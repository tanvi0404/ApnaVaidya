package com.apnavaidya;

import com.apnavaidya.model.*;
import com.apnavaidya.service.*;
import com.apnavaidya.storage.*;
import com.sun.net.httpserver.*;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * ApnaVaidya Java 17 Backend HTTP REST Server
 * Provides high-speed RESTful endpoints for Clinical RAG, Risk Calculators, Reports, and Vascular Health.
 */
public class ApnaVaidyaServer {

    private static final int PORT = 8080;

    // In-memory sliding-window IP rate limiter
    private static final ConcurrentHashMap<String, RateLimitTracker> rateLimitMap = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS_PER_MINUTE_AUTH = 30; // 30 auth attempts / min per IP
    private static final int MAX_REQUESTS_PER_MINUTE_API = 300; // 300 API requests / min per IP

    private static class RateLimitTracker {
        private final AtomicInteger count = new AtomicInteger(0);
        private volatile long windowStartTime = System.currentTimeMillis();

        public boolean tryAcquire(int limit) {
            long now = System.currentTimeMillis();
            if (now - windowStartTime > 60_000) {
                synchronized (this) {
                    if (now - windowStartTime > 60_000) {
                        count.set(0);
                        windowStartTime = now;
                    }
                }
            }
            return count.incrementAndGet() <= limit;
        }
    }

    private static String getClientIp(HttpExchange exchange) {
        String xForwardedFor = exchange.getRequestHeaders().getFirst("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.trim().isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        if (exchange.getRemoteAddress() != null && exchange.getRemoteAddress().getAddress() != null) {
            return exchange.getRemoteAddress().getAddress().getHostAddress();
        }
        return "127.0.0.1";
    }

    private static boolean checkRateLimit(HttpExchange exchange, boolean isAuthEndpoint) {
        String clientIp = getClientIp(exchange);
        String key = (isAuthEndpoint ? "auth:" : "api:") + clientIp;
        RateLimitTracker tracker = rateLimitMap.computeIfAbsent(key, k -> new RateLimitTracker());
        int limit = isAuthEndpoint ? MAX_REQUESTS_PER_MINUTE_AUTH : MAX_REQUESTS_PER_MINUTE_API;
        return tracker.tryAcquire(limit);
    }

    private static final ReportService reportService = new ReportService();
    private static final ChikitsakAiService chatService = new ChikitsakAiService();
    private static final ClinicalRiskService riskService = new ClinicalRiskService();
    private static final VascularService vascularService = new VascularService();
    private static final MedicationService medicationService = new MedicationService();
    private static final LongevityService longevityService = new LongevityService();
    private static final ComprehensiveHealthService comprehensiveService = new ComprehensiveHealthService();
    private static final SimulationService simulationService = new SimulationService();
    private static final com.apnavaidya.storage.repository.UserRepository userRepository = new com.apnavaidya.storage.repository.UserRepository();
    private static final com.apnavaidya.storage.repository.FamilyProfileRepository familyProfileRepository = new com.apnavaidya.storage.repository.FamilyProfileRepository();
    private static final com.apnavaidya.storage.repository.ClinicalPrescriptionRepository prescriptionRepository = new com.apnavaidya.storage.repository.ClinicalPrescriptionRepository();

    public static void main(String[] args) {
        try {
            // Run Database Schema Migrations
            com.apnavaidya.storage.SchemaMigrator.runMigrations(System.getenv("DATABASE_URL"));

            String envPort = System.getenv("PORT");
            int defaultPort = PORT;
            int port = (envPort != null && !envPort.trim().isEmpty()) ? Integer.parseInt(envPort.trim()) : defaultPort;
            HttpServer server;
            try {
                server = HttpServer.create(new InetSocketAddress(port), 0);
            } catch (IOException e) {
                if (envPort == null || envPort.trim().isEmpty()) {
                    port = 8081;
                    server = HttpServer.create(new InetSocketAddress(port), 0);
                } else {
                    throw e;
                }
            }

            final int boundPort = server.getAddress().getPort();

            // Health check
            server.createContext("/api/health", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }
                String json = "{\"status\":\"UP\",\"service\":\"ApnaVaidya Java 17 Backend Engine\",\"version\":\"3.0.0\",\"port\":" + boundPort + "}";
                sendResponse(exchange, 200, json);
            });

            // Security Audit Vault Endpoint (Protected)
            server.createContext("/api/security/audit-logs", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                    List<Map<String, Object>> logs = comprehensiveService.getAuditLogs();
                    StringBuilder sb = new StringBuilder("[");
                    for (int i = 0; i < logs.size(); i++) {
                        Map<String, Object> log = logs.get(i);
                        sb.append(String.format(
                            "{\"id\":\"%s\",\"eventType\":\"%s\",\"details\":\"%s\",\"status\":\"%s\",\"ipAddress\":\"%s\",\"timestamp\":\"%s\",\"blockHash\":\"%s\"}",
                            log.get("id"), log.get("eventType"), escapeJson((String) log.get("details")),
                            log.get("status"), log.get("ipAddress"), log.get("timestamp"), log.get("blockHash")
                        ));
                        if (i < logs.size() - 1) sb.append(",");
                    }
                    sb.append("]");
                    sendResponse(exchange, 200, sb.toString());
                } else if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String body = readBody(exchange);
                    String eventType = extractJsonString(body, "eventType");
                    String details = extractJsonString(body, "details");
                    Map<String, Object> log = comprehensiveService.logAuditEvent(
                        eventType.isEmpty() ? "USER_ACTION" : eventType,
                        details.isEmpty() ? "Health record interaction recorded." : details,
                        "SUCCESS", "127.0.0.1"
                    );
                    sendResponse(exchange, 200, "{\"success\":true,\"logId\":\"" + log.get("id") + "\"}");
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // IDRS Diabetes Risk Endpoint (Protected)
            server.createContext("/api/risk/idrs", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String body = readBody(exchange);
                    int age = extractJsonInt(body, "age", 35);
                    int waist = extractJsonInt(body, "waist", 85);
                    String activity = extractJsonString(body, "activity");
                    String familyHistory = extractJsonString(body, "familyHistory");

                    Map<String, Object> result = comprehensiveService.calculateIdrs(age, waist, activity, familyHistory);
                    String json = String.format(
                        "{\"idrsScore\":%d,\"score\":%d,\"totalScore\":%d,\"maxScore\":%d,\"riskCategory\":\"%s\",\"clinicalAdvice\":\"%s\",\"guidelineSource\":\"%s\"}",
                        (Integer) result.get("idrsScore"), (Integer) result.get("score"), (Integer) result.get("totalScore"), (Integer) result.get("maxScore"),
                        escapeJson((String) result.get("riskCategory")),
                        escapeJson((String) result.get("clinicalAdvice")), escapeJson((String) result.get("guidelineSource"))
                    );
                    sendResponse(exchange, 200, json);
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // Digital Prescription Signing Endpoint (Protected)
            server.createContext("/api/teleconsult/sign-prescription", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String body = readBody(exchange);
                    String docName = extractJsonString(body, "doctorName");
                    String reg = extractJsonString(body, "regNumber");
                    String patient = extractJsonString(body, "patientName");
                    String diagnosis = extractJsonString(body, "diagnosis");

                    List<String> rxList = Arrays.asList("Atorvastatin 10mg OD", "Vitamin D3 60K QW", "Lifestyle Aerobic Base 150m/w");
                    Map<String, Object> rx = comprehensiveService.generateDigitalPrescription(
                        docName.isEmpty() ? "Dr. A. K. Sharma" : docName,
                        reg.isEmpty() ? "MCI-48291" : reg,
                        patient.isEmpty() ? "Arjun Sharma" : patient,
                        diagnosis.isEmpty() ? "Mild Dyslipidemia & Vitamin D Deficiency" : diagnosis,
                        rxList
                    );

                    prescriptionRepository.save(new com.apnavaidya.storage.repository.ClinicalPrescriptionRepository.PrescriptionEntity(
                        (String) rx.get("prescriptionId"),
                        (String) rx.get("doctorName"),
                        (String) rx.get("doctorReg"),
                        (String) rx.get("patientName"),
                        (String) rx.get("diagnosis"),
                        (String) rx.get("digitalSignature"),
                        (String) rx.get("signingTimestamp"),
                        (String) rx.get("status")
                    ));

                    String json = String.format(
                        "{\"prescriptionId\":\"%s\",\"doctorName\":\"%s\",\"patientName\":\"%s\",\"digitalSignature\":\"%s\",\"signingTimestamp\":\"%s\",\"status\":\"%s\"}",
                        rx.get("prescriptionId"), rx.get("doctorName"), rx.get("patientName"),
                        rx.get("digitalSignature"), rx.get("signingTimestamp"), rx.get("status")
                    );
                    sendResponse(exchange, 200, json);
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // Ayurvedic Prakriti Endpoint (Protected)
            server.createContext("/api/ayurveda/prakriti", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String body = readBody(exchange);
                    int vata = extractJsonInt(body, "vataCount", 2);
                    int pitta = extractJsonInt(body, "pittaCount", 2);
                    int kapha = extractJsonInt(body, "kaphaCount", 1);

                    Map<String, Object> result = comprehensiveService.calculatePrakriti(vata, pitta, kapha);
                    String json = String.format(
                        "{\"vataPercentage\":%d,\"pittaPercentage\":%d,\"kaphaPercentage\":%d,\"dominantDosha\":\"%s\",\"recommendation\":\"%s\"}",
                        (Integer) result.get("vataPercentage"), (Integer) result.get("pittaPercentage"),
                        (Integer) result.get("kaphaPercentage"), escapeJson((String) result.get("dominantDosha")),
                        escapeJson((String) result.get("recommendation"))
                    );
                    sendResponse(exchange, 200, json);
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // Organ Heatmap Vitality Endpoint (Protected)
            server.createContext("/api/organs/heatmap", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String body = readBody(exchange);
                    double ldl = extractJsonDouble(body, "ldl", 146.0);
                    double hba1c = extractJsonDouble(body, "hba1c", 5.4);
                    double tsh = extractJsonDouble(body, "tsh", 2.2);
                    double egfr = extractJsonDouble(body, "egfr", 95.0);
                    double alt = extractJsonDouble(body, "alt", 28.0);
                    double b12 = extractJsonDouble(body, "b12", 450.0);
                    double vitd = extractJsonDouble(body, "vitd", 32.0);

                    Map<String, Object> map = comprehensiveService.calculateOrganHeatmap(ldl, hba1c, tsh, egfr, alt, b12, vitd);
                    String json = String.format(
                        "{\"overallOrganVitality\":%d,\"heartScore\":%d,\"pancreasScore\":%d,\"thyroidScore\":%d,\"liverScore\":%d,\"kidneyScore\":%d,\"brainScore\":%d,\"skeletonScore\":%d,\"status\":\"%s\"}",
                        (Integer) map.get("overallOrganVitality"), (Integer) map.get("heartScore"), (Integer) map.get("pancreasScore"),
                        (Integer) map.get("thyroidScore"), (Integer) map.get("liverScore"), (Integer) map.get("kidneyScore"),
                        (Integer) map.get("brainScore"), (Integer) map.get("skeletonScore"), escapeJson((String) map.get("status"))
                    );
                    sendResponse(exchange, 200, json);
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // Symptom Red-Flag Triage Endpoint (Protected)
            server.createContext("/api/symptoms/triage", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String body = readBody(exchange);
                    List<String> symptoms = new ArrayList<>();
                    if (body.contains("symptoms")) {
                        String symPart = body.split("\"symptoms\":\\[")[1].split("\\]")[0];
                        for (String item : symPart.split(",")) {
                            symptoms.add(item.replace("\"", "").trim());
                        }
                    }
                    int duration = extractJsonInt(body, "durationDays", 2);

                    Map<String, Object> triage = comprehensiveService.triageSymptoms(symptoms, duration);
                    String json = String.format(
                        "{\"triageLevel\":\"%s\",\"severity\":\"%s\",\"recommendedSpecialist\":\"%s\",\"guidance\":\"%s\"}",
                        escapeJson((String) triage.get("triageLevel")), escapeJson((String) triage.get("severity")),
                        escapeJson((String) triage.get("recommendedSpecialist")), escapeJson((String) triage.get("guidance"))
                    );
                    sendResponse(exchange, 200, json);
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // Wearables Biometrics Live Sync Endpoint (Protected)
            server.createContext("/api/wearables/sync", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String query = exchange.getRequestURI().getQuery();
                    String profileId = getAuthenticatedUserId(exchange);
                    if (query != null && query.contains("profileId=")) {
                        profileId = query.split("profileId=")[1].split("&")[0];
                    }
                    Map<String, Object> bio = comprehensiveService.getWearableBiometrics(profileId);
                    String json = String.format(
                        Locale.US,
                        "{\"profileId\":\"%s\",\"restingHeartRate\":%d,\"hrvMs\":%d,\"vo2Max\":%.1f,\"dailySteps\":%d,\"sleepScore\":%d,\"spo2Percent\":%.1f,\"syncStatus\":\"%s\",\"lastSyncTime\":\"%s\"}",
                        bio.get("profileId"), (Integer) bio.get("restingHeartRate"), (Integer) bio.get("hrvMs"),
                        (Double) bio.get("vo2Max"), (Integer) bio.get("dailySteps"), (Integer) bio.get("sleepScore"),
                        (Double) bio.get("spo2Percent"), bio.get("syncStatus"), escapeJson((String) bio.get("lastSyncTime"))
                    );
                    sendResponse(exchange, 200, json);
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // What-If Lifestyle Scenario Simulation Endpoint (Protected)
            server.createContext("/api/simulation/what-if", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String body = readBody(exchange);
                    double baseHba1c = extractJsonDouble(body, "baseHba1c", 5.8);
                    double baseLdl = extractJsonDouble(body, "baseLdl", 146.0);
                    double baseSbp = extractJsonDouble(body, "baseSbp", 128.0);
                    double baseWeight = extractJsonDouble(body, "baseWeight", 76.0);
                    int extraWalking = extractJsonInt(body, "extraWalkingMins", 30);
                    int extraFiber = extractJsonInt(body, "extraFiberGrams", 15);
                    double extraSleep = extractJsonDouble(body, "extraSleepHours", 1.0);
                    double weightLoss = extractJsonDouble(body, "weightLossKg", 4.0);

                    Map<String, Object> sim = simulationService.simulateLifestyleIntervention(
                        baseHba1c, baseLdl, baseSbp, baseWeight,
                        extraWalking, extraFiber, extraSleep, weightLoss
                    );

                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> traj = (List<Map<String, Object>>) sim.get("trajectory");
                    StringBuilder trajSb = new StringBuilder("[");
                    for (int i = 0; i < traj.size(); i++) {
                        Map<String, Object> pt = traj.get(i);
                        trajSb.append(String.format(
                            Locale.US,
                            "{\"month\":%d,\"currentTrajectoryHba1c\":%.1f,\"simulatedHba1c\":%.1f,\"currentTrajectoryLdl\":%.1f,\"simulatedLdl\":%.1f}",
                            (Integer) pt.get("month"), (Double) pt.get("currentTrajectoryHba1c"), (Double) pt.get("simulatedHba1c"),
                            (Double) pt.get("currentTrajectoryLdl"), (Double) pt.get("simulatedLdl")
                        ));
                        if (i < traj.size() - 1) trajSb.append(",");
                    }
                    trajSb.append("]");

                    String json = String.format(
                        Locale.US,
                        "{\"projectedHba1c\":%.1f,\"projectedLdl\":%.1f,\"projectedSbp\":%.1f,\"projectedWeight\":%.1f,\"hba1cReduction\":%.1f,\"ldlReduction\":%.1f,\"sbpReduction\":%.1f,\"clinicalSummary\":\"%s\",\"trajectory\":%s}",
                        (Double) sim.get("projectedHba1c"), (Double) sim.get("projectedLdl"), (Double) sim.get("projectedSbp"),
                        (Double) sim.get("projectedWeight"), (Double) sim.get("hba1cReduction"), (Double) sim.get("ldlReduction"),
                        (Double) sim.get("sbpReduction"), escapeJson((String) sim.get("clinicalSummary")), trajSb.toString()
                    );
                    sendResponse(exchange, 200, json);
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // Microbiome Profile Endpoint (Protected)
            server.createContext("/api/microbiome/profile", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String query = exchange.getRequestURI().getQuery();
                    String profileId = getAuthenticatedUserId(exchange);
                    if (query != null && query.contains("profileId=")) {
                        profileId = query.split("profileId=")[1].split("&")[0];
                    }
                    Map<String, Object> mic = comprehensiveService.getMicrobiomeProfile(profileId);
                    String json = String.format(
                        "{\"profileId\":\"%s\",\"gutScore\":%d,\"butyratePercent\":%d,\"acetatePercent\":%d,\"propionatePercent\":%d,\"diversityStatus\":\"%s\",\"keystoneSpecies\":\"%s\",\"recommendedPrebiotics\":\"%s\"}",
                        mic.get("profileId"), (Integer) mic.get("gutScore"), (Integer) mic.get("butyratePercent"),
                        (Integer) mic.get("acetatePercent"), (Integer) mic.get("propionatePercent"),
                        escapeJson((String) mic.get("diversityStatus")), escapeJson((String) mic.get("keystoneSpecies")),
                        escapeJson((String) mic.get("recommendedPrebiotics"))
                    );
                    sendResponse(exchange, 200, json);
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // Exposome City Endpoint (Protected)
            server.createContext("/api/exposome/city", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                String city = "Delhi NCR";
                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String body = readBody(exchange);
                    city = extractJsonString(body, "city");
                }
                Map<String, Object> exp = comprehensiveService.getExposomeData(city);
                String json = String.format(
                    Locale.US,
                    "{\"city\":\"%s\",\"aqi\":%d,\"pm25\":%.1f,\"pm10\":%.1f,\"status\":\"%s\",\"shieldProtocol\":\"%s\"}",
                    escapeJson((String) exp.get("city")), (Integer) exp.get("aqi"), (Double) exp.get("pm25"),
                    (Double) exp.get("pm10"), escapeJson((String) exp.get("status")), escapeJson((String) exp.get("shieldProtocol"))
                );
                sendResponse(exchange, 200, json);
            });

            // Nutrition MNT Plan Endpoint (Protected)
            server.createContext("/api/nutrition/plan", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String body = readBody(exchange);
                    String profileId = extractJsonString(body, "profileId");
                    if (profileId.isEmpty()) {
                        profileId = getAuthenticatedUserId(exchange);
                    }
                    double hba1c = extractJsonDouble(body, "hba1c", 5.8);
                    double ldl = extractJsonDouble(body, "ldl", 146.0);

                    Map<String, Object> nut = comprehensiveService.getNutritionPlan(profileId, hba1c, ldl);
                    String json = String.format(
                        "{\"profileId\":\"%s\",\"dailyCalories\":%d,\"proteinGrams\":%d,\"carbGrams\":%d,\"fatGrams\":%d,\"glycemicStrategy\":\"%s\",\"primaryFocus\":\"%s\"}",
                        nut.get("profileId"), (Integer) nut.get("dailyCalories"), (Integer) nut.get("proteinGrams"),
                        (Integer) nut.get("carbGrams"), (Integer) nut.get("fatGrams"),
                        escapeJson((String) nut.get("glycemicStrategy")), escapeJson((String) nut.get("primaryFocus"))
                    );
                    sendResponse(exchange, 200, json);
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // Exercise Cardio-Metabolic Routine Endpoint (Protected)
            server.createContext("/api/exercise/routine", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String body = readBody(exchange);
                    String profileId = extractJsonString(body, "profileId");
                    if (profileId.isEmpty()) {
                        profileId = getAuthenticatedUserId(exchange);
                    }
                    int restingHr = extractJsonInt(body, "restingHr", 68);

                    Map<String, Object> ex = comprehensiveService.getExercisePlan(profileId, restingHr);
                    String json = String.format(
                        "{\"profileId\":\"%s\",\"zone2HeartRateRange\":\"%s\",\"weeklyTargetMinutes\":%d,\"recommendedModality\":\"%s\",\"estimatedVo2MaxGain\":\"%s\"}",
                        ex.get("profileId"), escapeJson((String) ex.get("zone2HeartRateRange")),
                        (Integer) ex.get("weeklyTargetMinutes"), escapeJson((String) ex.get("recommendedModality")),
                        escapeJson((String) ex.get("estimatedVo2MaxGain"))
                    );
                    sendResponse(exchange, 200, json);
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // Pharmacogenomics (PGx) Matcher Endpoint (Protected)
            server.createContext("/api/genomics/match", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String body = readBody(exchange);
                    String drug = extractJsonString(body, "drug");
                    String gene = extractJsonString(body, "gene");

                    Map<String, Object> pgx = comprehensiveService.matchPharmacogenomics(drug, gene);
                    String json = String.format(
                        "{\"drug\":\"%s\",\"gene\":\"%s\",\"phenotype\":\"%s\",\"cpicGuideline\":\"%s\",\"evidenceSource\":\"%s\"}",
                        escapeJson((String) pgx.get("drug")), escapeJson((String) pgx.get("gene")),
                        escapeJson((String) pgx.get("phenotype")), escapeJson((String) pgx.get("cpicGuideline")),
                        escapeJson((String) pgx.get("evidenceSource"))
                    );
                    sendResponse(exchange, 200, json);
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // Medications Endpoint (Protected)
            server.createContext("/api/medications", exchange -> {
                setCorsHeaders(exchange);
                String method = exchange.getRequestMethod();

                if ("OPTIONS".equalsIgnoreCase(method)) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!checkRateLimit(exchange, false)) {
                    sendResponse(exchange, 429, "{\"error\":\"Too Many Requests: API rate limit exceeded\"}");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                String authUserId = getAuthenticatedUserId(exchange);

                if ("GET".equalsIgnoreCase(method)) {
                    String query = exchange.getRequestURI().getQuery();
                    String profileId = authUserId;
                    if (query != null && query.contains("profileId=")) {
                        String reqProfile = query.split("profileId=")[1].split("&")[0];
                        if (reqProfile.equals(authUserId) || familyProfileRepository.findById(reqProfile, authUserId).isPresent()) {
                            profileId = reqProfile;
                        }
                    }
                    List<MedicationItem> meds = medicationService.getMedicationsByProfile(profileId);
                    StringBuilder sb = new StringBuilder("[");
                    for (int i = 0; i < meds.size(); i++) {
                        sb.append(medicationToJson(meds.get(i)));
                        if (i < meds.size() - 1) sb.append(",");
                    }
                    sb.append("]");
                    sendResponse(exchange, 200, sb.toString());
                } else if ("POST".equalsIgnoreCase(method)) {
                    String body = readBody(exchange);
                    String medId = extractJsonString(body, "medId");
                    String name = extractJsonString(body, "name");

                    if (!name.isEmpty()) {
                        // Create / Add new prescription medication
                        String genericName = extractJsonString(body, "genericName");
                        String dosage = extractJsonString(body, "dosage");
                        String frequency = extractJsonString(body, "frequency");
                        String timing = extractJsonString(body, "timing");
                        String foodInstruction = extractJsonString(body, "foodInstruction");
                        String prescribedFor = extractJsonString(body, "prescribedFor");
                        String doctorName = extractJsonString(body, "doctorName");
                        int remainingDays = extractJsonInt(body, "remainingDays", 30);
                        int totalPills = extractJsonInt(body, "totalPills", 60);
                        int remainingPills = extractJsonInt(body, "remainingPills", 60);
                        String profileId = extractJsonString(body, "profileId");
                        if (profileId.isEmpty() || (!profileId.equals(authUserId) && familyProfileRepository.findById(profileId, authUserId).isEmpty())) {
                            profileId = authUserId;
                        }

                        MedicationItem item = new MedicationItem(
                            medId.isEmpty() ? "med-" + System.currentTimeMillis() : medId,
                            profileId,
                            name,
                            genericName.isEmpty() ? name : genericName,
                            dosage.isEmpty() ? "1 Tablet" : dosage,
                            frequency.isEmpty() ? "Once Daily" : frequency,
                            timing.isEmpty() ? "Morning" : timing,
                            foodInstruction.isEmpty() ? "After food" : foodInstruction,
                            prescribedFor.isEmpty() ? "General Maintenance" : prescribedFor,
                            doctorName.isEmpty() ? "Consulting Physician" : doctorName,
                            remainingDays,
                            totalPills,
                            remainingPills,
                            false
                        );
                        medicationService.addMedication(item);
                        sendResponse(exchange, 201, medicationToJson(item));
                    } else {
                        // Toggle adherence status
                        boolean success = medicationService.toggleMedicationStatus(medId);
                        sendResponse(exchange, 200, "{\"success\":" + success + ",\"medId\":\"" + escapeJson(medId) + "\"}");
                    }
                } else if ("DELETE".equalsIgnoreCase(method)) {
                    String query = exchange.getRequestURI().getQuery();
                    String id = "";
                    if (query != null && query.contains("id=")) {
                        id = query.split("id=")[1].split("&")[0];
                    }
                    if (id.isEmpty()) {
                        String body = readBody(exchange);
                        id = extractJsonString(body, "id");
                    }
                    if (id.isEmpty()) {
                        sendResponse(exchange, 400, "{\"error\":\"Medication id is required for deletion\"}");
                        return;
                    }
                    boolean deleted = medicationService.deleteMedication(id);
                    sendResponse(exchange, 200, "{\"success\":" + deleted + ",\"id\":\"" + escapeJson(id) + "\"}");
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // Family Profiles Endpoint (Protected)
            server.createContext("/api/profiles", exchange -> {
                setCorsHeaders(exchange);
                String method = exchange.getRequestMethod();

                if ("OPTIONS".equalsIgnoreCase(method)) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!checkRateLimit(exchange, false)) {
                    sendResponse(exchange, 429, "{\"error\":\"Too Many Requests: API rate limit exceeded\"}");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                String authUserId = getAuthenticatedUserId(exchange);

                if ("GET".equalsIgnoreCase(method)) {
                    List<FamilyProfile> profiles = familyProfileRepository.findByUserId(authUserId);
                    StringBuilder sb = new StringBuilder("[");
                    for (int i = 0; i < profiles.size(); i++) {
                        FamilyProfile p = profiles.get(i);
                        sb.append(String.format(
                            Locale.US,
                            "{\"id\":\"%s\",\"userId\":\"%s\",\"name\":\"%s\",\"relationship\":\"%s\",\"age\":%d,\"gender\":\"%s\",\"bloodGroup\":\"%s\",\"weight\":\"%s\",\"bmi\":%.1f,\"avatarInitials\":\"%s\",\"avatarColor\":\"%s\",\"dietPreference\":\"%s\"}",
                            escapeJson(p.getId()), escapeJson(p.getUserId()), escapeJson(p.getName()),
                            escapeJson(p.getRelationship()), p.getAge(), escapeJson(p.getGender()),
                            escapeJson(p.getBloodGroup()), escapeJson(p.getWeight()), p.getBmi(),
                            escapeJson(p.getAvatarInitials()), escapeJson(p.getAvatarColor()),
                            escapeJson(p.getDietPreference())
                        ));
                        if (i < profiles.size() - 1) sb.append(",");
                    }
                    sb.append("]");
                    sendResponse(exchange, 200, sb.toString());
                } else if ("POST".equalsIgnoreCase(method)) {
                    String body = readBody(exchange);
                    String id = extractJsonString(body, "id");
                    String name = extractJsonString(body, "name");
                    String relationship = extractJsonString(body, "relationship");
                    int age = extractJsonInt(body, "age", 30);
                    String gender = extractJsonString(body, "gender");
                    String bloodGroup = extractJsonString(body, "bloodGroup");
                    String weight = extractJsonString(body, "weight");
                    double bmi = extractJsonDouble(body, "bmi", 22.0);
                    String initials = extractJsonString(body, "avatarInitials");
                    String color = extractJsonString(body, "avatarColor");
                    String diet = extractJsonString(body, "dietPreference");

                    FamilyProfile profile = new FamilyProfile(
                        id.isEmpty() ? "profile-" + System.currentTimeMillis() : id,
                        authUserId,
                        name.isEmpty() ? "Family Member" : name,
                        relationship.isEmpty() ? "Dependent" : relationship,
                        age,
                        gender.isEmpty() ? "Other" : gender,
                        bloodGroup.isEmpty() ? "O+" : bloodGroup,
                        weight.isEmpty() ? "65 kg" : weight,
                        bmi,
                        initials.isEmpty() ? "FM" : initials,
                        color.isEmpty() ? "emerald" : color,
                        Collections.emptyList(),
                        Collections.emptyList(),
                        Collections.emptyList(),
                        diet.isEmpty() ? "Balanced" : diet
                    );
                    familyProfileRepository.save(profile, authUserId);
                    sendResponse(exchange, 200, "{\"success\":true,\"id\":\"" + escapeJson(profile.getId()) + "\"}");
                } else if ("DELETE".equalsIgnoreCase(method)) {
                    String query = exchange.getRequestURI().getQuery();
                    String id = "";
                    if (query != null && query.contains("id=")) {
                        id = query.split("id=")[1].split("&")[0];
                    }
                    if (id.isEmpty()) {
                        String body = readBody(exchange);
                        id = extractJsonString(body, "id");
                    }
                    if (id.isEmpty()) {
                        sendResponse(exchange, 400, "{\"error\":\"Profile id is required for deletion\"}");
                        return;
                    }
                    boolean deleted = familyProfileRepository.deleteById(id, authUserId);
                    sendResponse(exchange, 200, "{\"success\":" + deleted + ",\"id\":\"" + escapeJson(id) + "\"}");
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // Medication Interaction Safety Endpoint (Protected)
            server.createContext("/api/medications/interaction", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String body = readBody(exchange);
                    List<String> drugs = new ArrayList<>();
                    if (body.contains("drugs")) {
                        String drugsPart = body.split("\"drugs\":\\[")[1].split("\\]")[0];
                        for (String item : drugsPart.split(",")) {
                            drugs.add(item.replace("\"", "").trim());
                        }
                    }
                    List<String> warnings = medicationService.checkInteractions(drugs);
                    StringBuilder sb = new StringBuilder("{\"warnings\":[");
                    for (int i = 0; i < warnings.size(); i++) {
                        sb.append("\"").append(escapeJson(warnings.get(i))).append("\"");
                        if (i < warnings.size() - 1) sb.append(",");
                    }
                    sb.append("]}");
                    sendResponse(exchange, 200, sb.toString());
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // Longevity Composite & Biological Aging Endpoint (Protected)
            server.createContext("/api/longevity/score", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String body = readBody(exchange);
                    LongevityRequest req = parseLongevityRequest(body);
                    LongevityResponse res = longevityService.calculateLongevity(req);

                    StringBuilder recs = new StringBuilder("[");
                    for (int i = 0; i < res.getPriorityInterventions().size(); i++) {
                        recs.append("\"").append(escapeJson(res.getPriorityInterventions().get(i))).append("\"");
                        if (i < res.getPriorityInterventions().size() - 1) recs.append(",");
                    }
                    recs.append("]");

                    String json = String.format(
                        Locale.US,
                        "{\"compositeScore\":%d,\"agingVelocity\":%.2f,\"estimatedBiologicalAge\":%.1f,\"statusTier\":\"%s\",\"agingTrajectory\":\"%s\",\"priorityInterventions\":%s}",
                        res.getCompositeScore(),
                        res.getAgingVelocity(),
                        res.getEstimatedBiologicalAge(),
                        escapeJson(res.getStatusTier()),
                        escapeJson(res.getAgingTrajectory()),
                        recs.toString()
                    );
                    sendResponse(exchange, 200, json);
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // Reports Endpoint (Protected)
            server.createContext("/api/reports", exchange -> {
                setCorsHeaders(exchange);
                String method = exchange.getRequestMethod();

                if ("OPTIONS".equalsIgnoreCase(method)) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!checkRateLimit(exchange, false)) {
                    sendResponse(exchange, 429, "{\"error\":\"Too Many Requests: API rate limit exceeded\"}");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                String authUserId = getAuthenticatedUserId(exchange);

                if ("GET".equalsIgnoreCase(method)) {
                    String query = exchange.getRequestURI().getQuery();
                    String profileId = authUserId;
                    if (query != null && query.contains("profileId=")) {
                        String reqProfile = query.split("profileId=")[1].split("&")[0];
                        if (reqProfile.equals(authUserId) || familyProfileRepository.findById(reqProfile, authUserId).isPresent()) {
                            profileId = reqProfile;
                        }
                    }
                    List<MedicalReport> reports = reportService.getReportsByProfile(profileId);
                    StringBuilder sb = new StringBuilder("[");
                    for (int i = 0; i < reports.size(); i++) {
                        MedicalReport r = reports.get(i);
                        sb.append(reportToJson(r));
                        if (i < reports.size() - 1) sb.append(",");
                    }
                    sb.append("]");
                    sendResponse(exchange, 200, sb.toString());
                } else if ("POST".equalsIgnoreCase(method)) {
                    String body = readBody(exchange);
                    String title = extractJsonString(body, "title");
                    String labName = extractJsonString(body, "labName");
                    String category = extractJsonString(body, "category");
                    String date = extractJsonString(body, "testDate");
                    String ocrConf = extractJsonString(body, "ocrConfidence");
                    String summary = extractJsonString(body, "overallSummary");

                    MedicalReport rep = new MedicalReport(
                        "rep-" + System.currentTimeMillis(),
                        authUserId,
                        title.isEmpty() ? "Newly Analyzed Diagnostic Report" : title,
                        labName.isEmpty() ? "NABL Accredited Clinical Laboratory" : labName,
                        date.isEmpty() ? "Today" : date,
                        category.isEmpty() ? "General Diagnostics" : category,
                        ocrConf.isEmpty() ? "99.2% OCR Confidence" : ocrConf,
                        summary.isEmpty() ? "All biomarkers parsed into structured electronic health format." : summary,
                        Collections.emptyList()
                    );
                    reportService.addReport(rep);
                    sendResponse(exchange, 201, reportToJson(rep));
                } else if ("DELETE".equalsIgnoreCase(method)) {
                    String query = exchange.getRequestURI().getQuery();
                    String id = "";
                    if (query != null && query.contains("id=")) {
                        id = query.split("id=")[1].split("&")[0];
                    }
                    if (id.isEmpty()) {
                        String body = readBody(exchange);
                        id = extractJsonString(body, "id");
                    }
                    if (id.isEmpty()) {
                        sendResponse(exchange, 400, "{\"error\":\"Report id is required for deletion\"}");
                        return;
                    }
                    boolean deleted = reportService.deleteReport(id, authUserId);
                    sendResponse(exchange, 200, "{\"success\":" + deleted + ",\"id\":\"" + escapeJson(id) + "\"}");
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // Chikitsak AI Chat Endpoint (Protected)
            server.createContext("/api/chat/ask", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!checkRateLimit(exchange, false)) {
                    sendResponse(exchange, 429, "{\"error\":\"Too Many Requests: API rate limit exceeded\"}");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String body = readBody(exchange);
                    ChatRequest req = parseChatRequest(body);
                    ChatResponse res = chatService.generateResponse(req);

                    String json = chatResponseToJson(res);
                    sendResponse(exchange, 200, json);
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // ASCVD Risk Calculation Endpoint (Protected)
            server.createContext("/api/risk/ascvd", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String body = readBody(exchange);
                    AscvdRequest req = parseAscvdRequest(body);
                    AscvdResponse res = riskService.calculateAscvdRisk(req);

                    String json = String.format(
                        Locale.US,
                        "{\"riskPercent\":%.1f,\"category\":\"%s\",\"categoryLabel\":\"%s\",\"recommendation\":\"%s\",\"clinicalSource\":\"%s\"}",
                        res.getRiskPercent(),
                        res.getCategory(),
                        res.getCategoryLabel(),
                        escapeJson(res.getRecommendation()),
                        escapeJson(res.getClinicalSource())
                    );
                    sendResponse(exchange, 200, json);
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // Vascular Age & ePWV Endpoint (Protected)
            server.createContext("/api/vascular/age", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!isAuthorized(exchange)) {
                    sendResponse(exchange, 401, "{\"error\":\"Unauthorized: Valid HMAC-SHA256 JWT Bearer token required\"}");
                    return;
                }

                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String body = readBody(exchange);
                    VascularRequest req = parseVascularRequest(body);
                    VascularResponse res = vascularService.calculateVascularAge(req);

                    StringBuilder recs = new StringBuilder("[");
                    for (int i = 0; i < res.getRecommendations().size(); i++) {
                        recs.append("\"").append(escapeJson(res.getRecommendations().get(i))).append("\"");
                        if (i < res.getRecommendations().size() - 1) recs.append(",");
                    }
                    recs.append("]");

                    String json = String.format(
                        Locale.US,
                        "{\"chronologicalAge\":%d,\"estimatedVascularAge\":%d,\"ageDelta\":%d,\"epwv\":%.1f,\"pulsePressure\":%.1f,\"cholHdlRatio\":%.1f,\"stiffnessLabel\":\"%s\",\"stiffnessColor\":\"%s\",\"recommendations\":%s}",
                        res.getChronologicalAge(),
                        res.getEstimatedVascularAge(),
                        res.getAgeDelta(),
                        res.getEpwv(),
                        res.getPulsePressure(),
                        res.getCholHdlRatio(),
                        res.getStiffnessLabel(),
                        res.getStiffnessColor(),
                        recs.toString()
                    );
                    sendResponse(exchange, 200, json);
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // Auth Login Endpoint with Real Password Verification & Cryptographic JWTs
            server.createContext("/api/auth/login", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!checkRateLimit(exchange, true)) {
                    sendResponse(exchange, 429, "{\"error\":\"Too Many Requests: Auth rate limit exceeded. Please try again in 60 seconds.\"}");
                    return;
                }

                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String body = readBody(exchange);
                    String identifier = extractJsonString(body, "identifier");
                    String password = extractJsonString(body, "password");

                    if (identifier == null || identifier.trim().isEmpty()) {
                        sendResponse(exchange, 400, "{\"error\":\"Email or Mobile is required\"}");
                        return;
                    }

                    if (password == null || password.trim().isEmpty()) {
                        sendResponse(exchange, 400, "{\"error\":\"Password is required\"}");
                        return;
                    }

                    String lowerId = identifier.trim().toLowerCase();

                    // Check for Evaluator / Demo Profiles
                    boolean isDemo = lowerId.equals("arjun") || lowerId.equals("rajesh") || lowerId.equals("sunita") || lowerId.equals("ananya") || lowerId.equals("demo") || lowerId.endsWith("@apnavaidya.in") || lowerId.equals("demo@apnavaidya.in");
                    if (isDemo) {
                        if (!AuthSecurityService.isDemoPasswordValid(password)) {
                            sendResponse(exchange, 401, "{\"error\":\"Invalid credentials. For demo accounts, use password 'Demo@123'.\"}");
                            return;
                        }

                        String name = "Arjun Sharma";
                        String email = "arjun.sharma@apnavaidya.in";
                        String userId = "user-arjun";

                        if (lowerId.contains("rajesh")) {
                            name = "Rajesh Sharma";
                            email = "rajesh.sharma@apnavaidya.in";
                            userId = "user-rajesh";
                        } else if (lowerId.contains("sunita")) {
                            name = "Sunita Sharma";
                            email = "sunita.sharma@apnavaidya.in";
                            userId = "user-sunita";
                        } else if (lowerId.contains("ananya")) {
                            name = "Ananya Sharma";
                            email = "ananya.sharma@apnavaidya.in";
                            userId = "user-ananya";
                        }

                        String token = AuthSecurityService.createJwtToken(userId, email, name);
                        String json = String.format(
                            Locale.US,
                            "{\"success\":true,\"token\":\"%s\",\"user\":{\"id\":\"%s\",\"name\":\"%s\",\"email\":\"%s\",\"mobile\":\"+91 98765 43210\",\"isDemo\":true}}",
                            token, userId, escapeJson(name), escapeJson(email)
                        );
                        sendResponse(exchange, 200, json);
                        return;
                    }

                    // Search Database via Phase 4/6 UserRepository (with AES-256 GCM encrypted fields at rest)
                    Optional<com.apnavaidya.storage.repository.UserRepository.UserEntity> optUser = userRepository.findByEmailOrMobile(identifier);

                    if (optUser.isEmpty()) {
                        sendResponse(exchange, 401, "{\"error\":\"Account not found with this email/mobile. Please register first.\"}");
                        return;
                    }

                    com.apnavaidya.storage.repository.UserRepository.UserEntity u = optUser.get();
                    String salt = u.getSalt();
                    String hash = u.getPasswordHash();

                    // Verify salted password hash
                    if (salt == null || hash == null || !AuthSecurityService.verifyPassword(password, salt, hash)) {
                        sendResponse(exchange, 401, "{\"error\":\"Invalid credentials. Incorrect password.\"}");
                        return;
                    }

                    String userId = u.getId();
                    String name = u.getName();
                    String email = u.getEmail();
                    String token = AuthSecurityService.createJwtToken(userId, email, name);

                    String userJson = String.format(
                        Locale.US,
                        "{\"id\":\"%s\",\"name\":\"%s\",\"email\":\"%s\",\"mobile\":\"%s\",\"age\":%d,\"gender\":\"%s\",\"place\":\"%s\",\"bloodGroup\":\"%s\",\"dietPreference\":\"%s\"}",
                        u.getId(), escapeJson(u.getName()), escapeJson(u.getEmail()), escapeJson(u.getMobile()),
                        u.getAge(), escapeJson(u.getGender()), escapeJson(u.getPlace()), escapeJson(u.getBloodGroup()), escapeJson(u.getDietPreference())
                    );

                    String responseJson = String.format(
                        Locale.US,
                        "{\"success\":true,\"token\":\"%s\",\"user\":%s}",
                        token, userJson
                    );
                    sendResponse(exchange, 200, responseJson);
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            // Auth Register Endpoint with Salted Password Hashing, AES-256 Vault & Signed JWTs
            server.createContext("/api/auth/register", exchange -> {
                setCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    sendResponse(exchange, 204, "");
                    return;
                }

                if (!checkRateLimit(exchange, true)) {
                    sendResponse(exchange, 429, "{\"error\":\"Too Many Requests: Registration rate limit exceeded. Please try again later.\"}");
                    return;
                }

                if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    String body = readBody(exchange);
                    String name = extractJsonString(body, "name");
                    String email = extractJsonString(body, "email");
                    String mobile = extractJsonString(body, "mobile");
                    String password = extractJsonString(body, "password");
                    int age = extractJsonInt(body, "age", 30);
                    String gender = extractJsonString(body, "gender");
                    String place = extractJsonString(body, "place");
                    String address = extractJsonString(body, "address");
                    String bloodGroup = extractJsonString(body, "bloodGroup");
                    String dietPreference = extractJsonString(body, "dietPreference");

                    if (name.trim().isEmpty() || (email.trim().isEmpty() && mobile.trim().isEmpty())) {
                        sendResponse(exchange, 400, "{\"error\":\"Name, email or mobile number is required\"}");
                        return;
                    }

                    if (password == null || password.length() < 4) {
                        sendResponse(exchange, 400, "{\"error\":\"Password must be at least 4 characters long\"}");
                        return;
                    }

                    // Generate cryptographic salt and password hash
                    String salt = AuthSecurityService.generateSalt();
                    String passwordHash = AuthSecurityService.hashPassword(password, salt);

                    String userId = "user-reg-" + System.currentTimeMillis();

                    // Persist via UserRepository (transparently encrypts passwordHash, salt, bloodGroup with AES-256 GCM)
                    com.apnavaidya.storage.repository.UserRepository.UserEntity newUser = new com.apnavaidya.storage.repository.UserRepository.UserEntity(
                        userId, name, email, mobile, passwordHash, salt, age, gender, place, address, bloodGroup, dietPreference, java.time.Instant.now().toString()
                    );
                    userRepository.save(newUser);

                    // Issue Cryptographic HMAC-SHA256 JWT Token
                    String token = AuthSecurityService.createJwtToken(userId, email, name);

                    String sanitizedUser = String.format(
                        Locale.US,
                        "{\"id\":\"%s\",\"name\":\"%s\",\"email\":\"%s\",\"mobile\":\"%s\",\"age\":%d,\"gender\":\"%s\",\"place\":\"%s\",\"address\":\"%s\",\"bloodGroup\":\"%s\",\"dietPreference\":\"%s\"}",
                        userId, escapeJson(name), escapeJson(email), escapeJson(mobile), age, escapeJson(gender),
                        escapeJson(place), escapeJson(address), escapeJson(bloodGroup), escapeJson(dietPreference)
                    );

                    String responseJson = String.format(
                        Locale.US,
                        "{\"success\":true,\"token\":\"%s\",\"user\":%s}",
                        token,
                        sanitizedUser
                    );
                    sendResponse(exchange, 200, responseJson);
                } else {
                    sendResponse(exchange, 405, "{\"error\":\"Method Not Allowed\"}");
                }
            });

            server.setExecutor(java.util.concurrent.Executors.newCachedThreadPool());
            server.start();

            System.out.println("=================================================");
            System.out.println("🚀 ApnaVaidya Java 17 Backend Engine Started!");
            System.out.println("📍 REST API Endpoint: http://localhost:" + server.getAddress().getPort() + "/api/health");
            System.out.println("🧬 Clinical Services: Chat RAG, ASCVD, Vascular, Reports");
            System.out.println("=================================================");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static boolean isAuthorized(HttpExchange exchange) {
        String authHeader = exchange.getRequestHeaders().getFirst("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }
        String token = authHeader.substring(7).trim();
        Map<String, String> claims = AuthSecurityService.verifyJwtToken(token);
        return claims != null && claims.containsKey("sub");
    }

    private static String getAuthenticatedUserId(HttpExchange exchange) {
        String authHeader = exchange.getRequestHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7).trim();
            Map<String, String> claims = AuthSecurityService.verifyJwtToken(token);
            if (claims != null && claims.containsKey("sub")) {
                return claims.get("sub");
            }
        }
        return "user-default";
    }

    private static void setCorsHeaders(HttpExchange exchange) {
        Headers headers = exchange.getResponseHeaders();
        String origin = exchange.getRequestHeaders().getFirst("Origin");
        String envOrigins = System.getenv("ALLOWED_ORIGINS");

        String allowOrigin = "http://localhost:5173"; // Safe default dev origin
        if (envOrigins != null && !envOrigins.trim().isEmpty()) {
            String[] allowed = envOrigins.split(",");
            for (String a : allowed) {
                if (origin != null && (a.trim().equalsIgnoreCase(origin.trim()) || "*".equals(a.trim()))) {
                    allowOrigin = origin;
                    break;
                }
            }
            if (origin != null && origin.endsWith(".vercel.app")) {
                allowOrigin = origin;
            }
        } else if (origin != null && (origin.endsWith(".vercel.app") || origin.startsWith("http://localhost:"))) {
            allowOrigin = origin;
        }

        headers.set("Access-Control-Allow-Origin", allowOrigin);
        headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept");
        headers.set("Access-Control-Allow-Credentials", "true");
        headers.set("Access-Control-Max-Age", "86400");
        headers.set("Content-Type", "application/json; charset=UTF-8");
    }

    private static void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        byte[] bytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, bytes.length > 0 ? bytes.length : -1);
        if (bytes.length > 0) {
            OutputStream os = exchange.getResponseBody();
            os.write(bytes);
            os.close();
        }
    }

    private static String readBody(HttpExchange exchange) throws IOException {
        InputStream is = exchange.getRequestBody();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        return sb.toString();
    }

    private static String escapeJson(String text) {
        if (text == null) return "";
        return text.replace("\\", "\\\\")
                   .replace("\"", "\\\"")
                   .replace("\b", "\\b")
                   .replace("\f", "\\f")
                   .replace("\n", "\\n")
                   .replace("\r", "\\r")
                   .replace("\t", "\\t");
    }

    private static String reportToJson(MedicalReport r) {
        StringBuilder sb = new StringBuilder("{");
        sb.append("\"id\":\"").append(r.getId()).append("\",");
        sb.append("\"profileId\":\"").append(r.getProfileId()).append("\",");
        sb.append("\"title\":\"").append(escapeJson(r.getTitle())).append("\",");
        sb.append("\"labName\":\"").append(escapeJson(r.getLabName())).append("\",");
        sb.append("\"date\":\"").append(escapeJson(r.getDate())).append("\",");
        sb.append("\"testDate\":\"").append(escapeJson(r.getDate())).append("\",");
        sb.append("\"uploadDate\":\"").append(escapeJson(r.getDate())).append("\",");
        sb.append("\"status\":\"Analyzed\",");
        sb.append("\"category\":\"").append(escapeJson(r.getCategory())).append("\",");
        sb.append("\"ocrConfidence\":\"").append(escapeJson(r.getOcrConfidence())).append("\",");
        sb.append("\"overallSummary\":\"").append(escapeJson(r.getOverallSummary())).append("\",");

        int abnormalCount = 0;
        if (r.getParameters() != null) {
            for (LabParameter p : r.getParameters()) {
                if (!"NORMAL".equalsIgnoreCase(p.getStatus())) abnormalCount++;
            }
        }
        int normalCount = (r.getParameters() != null ? r.getParameters().size() : 0) - abnormalCount;

        sb.append("\"summary\":{");
        sb.append("\"overallStatus\":\"").append(abnormalCount > 0 ? abnormalCount + " Parameter(s) Outside Range" : "All Measured Parameters Normal").append("\",");
        sb.append("\"keyFindings\":[\"").append(escapeJson(r.getOverallSummary())).append("\"],");
        sb.append("\"aiRecommendation\":\"Follow targeted nutrition and movement protocols. Consult physician for personalized clinical review.\",");
        sb.append("\"normalCount\":").append(normalCount).append(",");
        sb.append("\"abnormalCount\":").append(abnormalCount);
        sb.append("},");

        sb.append("\"parameters\":[");
        if (r.getParameters() != null) {
            for (int i = 0; i < r.getParameters().size(); i++) {
                LabParameter p = r.getParameters().get(i);
                sb.append(String.format(
                    Locale.US,
                    "{\"id\":\"%s\",\"name\":\"%s\",\"value\":%.1f,\"unit\":\"%s\",\"minNormal\":%.1f,\"maxNormal\":%.1f,\"status\":\"%s\",\"plainExplanation\":\"%s\",\"plainDescription\":\"%s\",\"clinicalMeaning\":\"%s\",\"lifestyleTip\":\"Incorporate whole foods and regular physical activity.\",\"doctorQuestion\":\"Should we monitor this biomarker over the next 3 months?\",\"sourceCitation\":\"%s\",\"clinicalCitation\":\"%s\"}",
                    p.getId(), 
                    escapeJson(p.getName()), 
                    p.getValue(), 
                    p.getUnit(), 
                    p.getMinNormal(), 
                    p.getMaxNormal(), 
                    p.getStatus(), 
                    escapeJson(p.getPlainDescription()), 
                    escapeJson(p.getPlainDescription()),
                    escapeJson(p.getPlainDescription()),
                    escapeJson(p.getClinicalCitation()),
                    escapeJson(p.getClinicalCitation())
                ));
                if (i < r.getParameters().size() - 1) sb.append(",");
            }
        }
        sb.append("]}");
        return sb.toString();
    }

    private static String chatResponseToJson(ChatResponse res) {
        StringBuilder citations = new StringBuilder("[");
        if (res.getCitations() != null) {
            for (int i = 0; i < res.getCitations().size(); i++) {
                citations.append("\"").append(escapeJson(res.getCitations().get(i))).append("\"");
                if (i < res.getCitations().size() - 1) citations.append(",");
            }
        }
        citations.append("]");

        StringBuilder explain = new StringBuilder("{");
        if (res.getExplainability() != null) {
            int idx = 0;
            for (Map.Entry<String, String> e : res.getExplainability().entrySet()) {
                explain.append("\"").append(e.getKey()).append("\":\"").append(escapeJson(e.getValue())).append("\"");
                if (idx < res.getExplainability().size() - 1) explain.append(",");
                idx++;
            }
        }
        explain.append("}");

        return String.format(
            "{\"id\":\"%s\",\"role\":\"%s\",\"content\":\"%s\",\"text\":\"%s\",\"isEmergency\":%b,\"citations\":%s,\"explainability\":%s}",
            res.getId(),
            res.getRole(),
            escapeJson(res.getContent()),
            escapeJson(res.getText()),
            res.isEmergency(),
            citations.toString(),
            explain.toString()
        );
    }

    private static ChatRequest parseChatRequest(String body) {
        ChatRequest req = new ChatRequest();
        if (body == null || body.isEmpty()) return req;

        req.setUserMessage(extractJsonString(body, "userMessage"));
        req.setLanguage(extractJsonString(body, "language"));
        req.setProfileName(extractJsonString(body, "profileName"));
        req.setProfileAge(extractJsonInt(body, "profileAge", 30));
        req.setProfileGender(extractJsonString(body, "profileGender"));
        req.setReportContext(extractJsonString(body, "reportContext"));
        return req;
    }

    private static AscvdRequest parseAscvdRequest(String body) {
        AscvdRequest req = new AscvdRequest();
        if (body == null || body.isEmpty()) return req;

        req.setAge(extractJsonInt(body, "age", 40));
        req.setGender(extractJsonString(body, "gender"));
        req.setTotalChol(extractJsonDouble(body, "totalChol", 200.0));
        req.setHdlChol(extractJsonDouble(body, "hdlChol", 50.0));
        req.setSystolicBp(extractJsonDouble(body, "systolicBp", 120.0));
        req.setSmoker(body.contains("\"smoker\":true"));
        req.setDiabetic(body.contains("\"diabetic\":true"));
        return req;
    }

    private static VascularRequest parseVascularRequest(String body) {
        VascularRequest req = new VascularRequest();
        if (body == null || body.isEmpty()) return req;

        req.setChronologicalAge(extractJsonInt(body, "chronologicalAge", 32));
        req.setSystolicBp(extractJsonDouble(body, "systolicBp", 124.0));
        req.setDiastolicBp(extractJsonDouble(body, "diastolicBp", 82.0));
        req.setTotalChol(extractJsonDouble(body, "totalChol", 228.0));
        req.setHdlChol(extractJsonDouble(body, "hdlChol", 52.0));
        req.setRestingHr(extractJsonInt(body, "restingHr", 68));
        req.setSmoker(body.contains("\"smoker\":true"));
        return req;
    }

    private static String extractJsonString(String json, String key) {
        String pattern = "\"" + key + "\":\"";
        int start = json.indexOf(pattern);
        if (start == -1) return "";
        start += pattern.length();
        int end = json.indexOf("\"", start);
        return end != -1 ? json.substring(start, end) : "";
    }

    private static int extractJsonInt(String json, String key, int defaultVal) {
        try {
            String pattern = "\"" + key + "\":";
            int start = json.indexOf(pattern);
            if (start == -1) return defaultVal;
            start += pattern.length();
            int end = json.indexOf(",", start);
            if (end == -1) end = json.indexOf("}", start);
            return Integer.parseInt(json.substring(start, end).trim());
        } catch (Exception e) {
            return defaultVal;
        }
    }

    private static String medicationToJson(MedicationItem m) {
        return String.format(
            Locale.US,
            "{\"id\":\"%s\",\"profileId\":\"%s\",\"name\":\"%s\",\"genericName\":\"%s\",\"dosage\":\"%s\",\"frequency\":\"%s\",\"timing\":\"%s\",\"foodInstruction\":\"%s\",\"prescribedFor\":\"%s\",\"doctorName\":\"%s\",\"remainingDays\":%d,\"totalPills\":%d,\"remainingPills\":%d,\"takenToday\":%b,\"status\":\"%s\"}",
            m.getId(), m.getProfileId(), escapeJson(m.getName()), escapeJson(m.getGenericName()), escapeJson(m.getDosage()),
            escapeJson(m.getFrequency()), escapeJson(m.getTiming()), escapeJson(m.getFoodInstruction()), escapeJson(m.getPrescribedFor()),
            escapeJson(m.getDoctorName()), m.getRemainingDays(), m.getTotalPills(), m.getRemainingPills(), m.isTakenToday(),
            m.isTakenToday() ? "taken" : "pending"
        );
    }

    private static LongevityRequest parseLongevityRequest(String body) {
        LongevityRequest req = new LongevityRequest();
        if (body == null || body.isEmpty()) return req;

        req.setChronologicalAge(extractJsonInt(body, "chronologicalAge", 32));
        req.setSystolicBp(extractJsonDouble(body, "systolicBp", 120.0));
        req.setTotalChol(extractJsonDouble(body, "totalChol", 200.0));
        req.setHdlChol(extractJsonDouble(body, "hdlChol", 50.0));
        req.setHba1c(extractJsonDouble(body, "hba1c", 5.4));
        req.setFastingGlucose(extractJsonDouble(body, "fastingGlucose", 92.0));
        req.setRestingHr(extractJsonInt(body, "restingHr", 68));
        req.setWeeklyExerciseMins(extractJsonInt(body, "weeklyExerciseMins", 150));
        req.setSleepHours(extractJsonDouble(body, "sleepHours", 7.5));
        req.setSmoker(body.contains("\"smoker\":true"));
        return req;
    }

    private static double extractJsonDouble(String json, String key, double defaultVal) {
        try {
            String pattern = "\"" + key + "\":";
            int start = json.indexOf(pattern);
            if (start == -1) return defaultVal;
            start += pattern.length();
            int end = json.indexOf(",", start);
            if (end == -1) end = json.indexOf("}", start);
            return Double.parseDouble(json.substring(start, end).trim());
        } catch (Exception e) {
            return defaultVal;
        }
    }
}
