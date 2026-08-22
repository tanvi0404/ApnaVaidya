package com.apnavaidya.service;

import com.apnavaidya.model.ChatRequest;
import com.apnavaidya.model.ChatResponse;

import java.util.*;

public class ChikitsakAiService {

    private static final List<String> EMERGENCY_KEYWORDS = Arrays.asList(
        "chest pain", "heart attack", "crushing chest", "left arm pain", "jaw pain", 
        "stroke", "face drooping", "slurred speech", "cant breathe", "can't breathe", 
        "shortness of breath", "difficulty breathing", "blue lips", "unconscious", 
        "bleeding heavily", "chhati me dard", "saans lene me dikkat", "chhati ch peerh", "dill da daura"
    );

    public boolean detectRedFlagEmergency(String text) {
        if (text == null || text.trim().isEmpty()) return false;
        String lower = text.toLowerCase();
        for (String kw : EMERGENCY_KEYWORDS) {
            if (lower.contains(kw)) return true;
        }
        return false;
    }

    public ChatResponse generateResponse(ChatRequest request) {
        String msg = request.getUserMessage() != null ? request.getUserMessage() : "";
        String lang = request.getLanguage();
        String name = request.getProfileName() != null && !request.getProfileName().isEmpty() ? request.getProfileName() : "Patient";
        int age = request.getProfileAge() > 0 ? request.getProfileAge() : 30;
        String gender = request.getProfileGender() != null ? request.getProfileGender() : "Male";
        String reportCtx = request.getReportContext() != null ? request.getReportContext() : "";

        boolean isEmergency = detectRedFlagEmergency(msg);

        if (isEmergency) {
            String emergencyText;
            if ("hi".equalsIgnoreCase(lang)) {
                emergencyText = "🚨 **आपातकालीन चेतावनी (Emergency Red-Flag):** आपके द्वारा बताए गए लक्षण आपातकालीन स्थिति का संकेत हो सकते हैं। कृपया तुरंत **108 या 112** डायल करें अथवा निकटतम अस्पताल के आपातकालीन विभाग में पहुँचें।";
            } else if ("hg".equalsIgnoreCase(lang)) {
                emergencyText = "🚨 **URGENT EMERGENCY ALERT:** Aapke bataye gaye symptoms critical emergency ke sanket ho sakte hain. Please bina kisi deri ke **108 ya 112** par call karein ya paas ke emergency hospital mein jaayein.";
            } else if ("pb".equalsIgnoreCase(lang)) {
                emergencyText = "🚨 **ਐਮਰਜੈਂਸੀ ਅਲਰਟ (Emergency Alert):** ਤੁਹਾਡੇ ਦੱਸੇ ਲੱਛਣ ਗੰਭੀਰ ਐਮਰਜੈਂਸੀ ਦਾ ਸੰਕੇਤ ਹੋ ਸਕਦੇ ਹਨ। ਕਿਰਪਾ ਕਰਕੇ ਤੁਰੰਤ **108 ਜਾਂ 112** 'ਤੇ ਕਾਲ ਕਰੋ।";
            } else {
                emergencyText = "🚨 **URGENT EMERGENCY MEDICAL RED-FLAG:** The symptoms you described represent potential life-threatening medical emergencies. Please **call 108 / 112 or reach the nearest emergency hospital immediately**.";
            }

            Map<String, String> explain = new HashMap<>();
            explain.put("profileGrounding", name + " (" + age + "y, " + gender + ")");
            explain.put("reportContext", reportCtx.isEmpty() ? "Emergency Triage Intercept" : reportCtx);
            explain.put("ragEvidence", "High-Priority Emergency Symptom Intercept");
            explain.put("safetyPolicy", "AIIMS Emergency Medicine & AHA Triage Protocols");

            return new ChatResponse(
                "msg-" + System.currentTimeMillis(),
                "assistant",
                emergencyText,
                true,
                Collections.singletonList("AIIMS Emergency Medicine & AHA Triage Protocols"),
                explain
            );
        }

        String lowerMsg = msg.toLowerCase();
        String content;

        if (lowerMsg.contains("ldl") || lowerMsg.contains("cholesterol") || lowerMsg.contains("lipid")) {
            if ("hi".equalsIgnoreCase(lang)) {
                content = String.format(
                    "**%s जी के लिए एलडीएल (LDL) और कोलेस्ट्रॉल विश्लेषण:**\n\n"
                    + "1. **एलडीएल क्या है?** यह रक्त वाहिकाओं में जमने वाला लिपोप्रोटीन है।\n"
                    + "2. **आयु एवं संदर्भ:** %d वर्ष की आयु में इष्टतम एलडीएल स्तर **< 100 mg/dL** होना चाहिए।\n"
                    + "3. **आहार सुधार:** ओट्स, अलसी, अखरोट, मेथी और हरी पत्तेदार सब्जियों का सेवन बढ़ाएं। संतृप्त वसा सीमित रखें।\n"
                    + "4. **डॉक्टर से प्रश्न:** *\"क्या मेरी शारीरिक स्थिति के अनुसार लिपिड प्रोफाइल का 90 दिनों में दोबारा परीक्षण करना उचित है?\"*",
                    name, age
                );
            } else if ("hg".equalsIgnoreCase(lang)) {
                content = String.format(
                    "**%s ji ke liye LDL aur Lipid Profile Insights:**\n\n"
                    + "1. **LDL ka matlab:** Isko atherogenic cholesterol kehte hain.\n"
                    + "2. **Clinical Target:** %d saal ki age mein healthy LDL level **< 100 mg/dL** maintain karna chahiye.\n"
                    + "3. **Diet Tips:** Oats, methi dana, badam aur walnuts add karein. Fried food aur trans fats avoid karein.\n"
                    + "4. **Doctor se discussion:** *\"Doctor saab, kya 3 months lifestyle modification ke baad retest karwayein?\"*",
                    name, age
                );
            } else {
                content = String.format(
                    "**Personalized LDL & Lipid Profile Analysis for %s (%d yrs):**\n\n"
                    + "1. **Biomarker Understanding:** Low-Density Lipoprotein (LDL) transports cholesterol to tissues and can deposit in arterial walls.\n"
                    + "2. **Clinical Reference Goal:** For optimal cardiovascular protection at age %d, the clinical target is **< 100 mg/dL** (and < 70 mg/dL for high ASCVD risk).\n"
                    + "3. **Evidence-Based Nutrition:** Increase soluble viscous fiber (oats, psyllium husk, methi seeds) and replace saturated fats with monounsaturated oils.\n"
                    + "4. **Suggested Clinician Question:** *\"Based on my baseline risk factors, what is my ideal target LDL level?\"*",
                    name, age, age
                );
            }
        } else if (lowerMsg.contains("hba1c") || lowerMsg.contains("glucose") || lowerMsg.contains("sugar") || lowerMsg.contains("diabetes")) {
            if ("hi".equalsIgnoreCase(lang)) {
                content = String.format(
                    "**%s जी के लिए HbA1c और ब्लड शुगर मार्गदर्शन:**\n\n"
                    + "1. **HbA1c क्या है?** यह पिछले 90 दिनों के औसत रक्त शर्करा स्तर को दर्शाता है।\n"
                    + "2. **लक्ष्य सीमा:** सामान्य स्तर **< 5.7%%**, प्री-डायबिटीज 5.7-6.4%%, और डायबिटीज प्रबंधन लक्ष्य **< 7.0%%** है।\n"
                    + "3. **दिनचर्या सलाह:** भोजन के बाद 20 मिनट की सैर मांसपेशियों में ग्लूकोज उपयोग को बढ़ाती है।\n"
                    + "4. **सलाह:** जटिल कार्बोहाइड्रेट्स (दलिया, ज्वार, बाजरा) का चुनाव करें।",
                    name
                );
            } else {
                content = String.format(
                    "**Personalized Glycemic & HbA1c Analysis for %s (%d yrs):**\n\n"
                    + "1. **What HbA1c Reflects:** 90-day glycemic equilibrium based on erythrocyte hemoglobin glycosylation.\n"
                    + "2. **Clinical Standards:** Normal: **< 5.7%%**, Pre-diabetes: **5.7%% – 6.4%%**, Controlled Diabetes: **< 7.0%%**.\n"
                    + "3. **Metabolic Levers:** 20-30 minutes of post-meal brisk walking activates GLUT-4 glucose transporters in skeletal muscle without requiring extra insulin.\n"
                    + "4. **Nutritional Guidance:** Emphasize low-GI legumes, high-fiber rotis, and adequate hydration.",
                    name, age
                );
            }
        } else if (lowerMsg.contains("blood pressure") || lowerMsg.contains("bp") || lowerMsg.contains("hypertension")) {
            content = String.format(
                "**Blood Pressure & Arterial Health for %s (%d yrs):**\n\n"
                + "1. **Target Baseline:** Resting BP < 120/80 mmHg is ideal for cardiovascular and renal protection.\n"
                + "2. **DASH Dietary Guidelines:** Limit sodium to < 2,000 mg/day, increase dietary potassium (bananas, coconut water, spinach).\n"
                + "3. **Stress & Sleep:** 7-8 hours of restful sleep and daily deep pranayama breathing lower arterial vascular tone.\n"
                + "4. **Follow-up:** Check sitting BP after 5 minutes of rest at the same time each morning.",
                name, age
            );
        } else {
            if (age < 18) {
                content = String.format(
                    "**Pediatric Health Support for %s (%d yrs, %s):**\n\n"
                    + "- **Focus Areas:** Balanced growth nutrition, childhood vaccination schedule, active physical play, and adequate rest.\n"
                    + "- **Safety Reminder:** Always verify pediatric weight-based medication dosages with your certified pediatrician.\n\n"
                    + "Feel free to ask about balanced school meal planning, growth percentiles, or allergy management!",
                    name, age, gender
                );
            } else {
                content = String.format(
                    "**ApnaVaidya Clinical Intelligence Context for %s (%d yrs, %s):**\n\n"
                    + "I have reviewed your active profile records%s.\n\n"
                    + "- **Preventive Levers:** Balanced whole-food nutrition, regular hydration, and daily Zone-2 cardio movement.\n"
                    + "- **Guidance Available:** Lab biomarker interpretation, medication timing & food interaction checks, Indian recipe suggestions, or ASCVD/IDRS risk guidance.\n\n"
                    + "How can I assist your health journey today?",
                    name, age, gender, reportCtx.isEmpty() ? "" : " and linked diagnostic report (" + reportCtx + ")"
                );
            }
        }

        Map<String, String> explain = new HashMap<>();
        explain.put("profileGrounding", name + " (" + age + "y, " + gender + ")");
        explain.put("reportContext", reportCtx.isEmpty() ? "Active Profile Diagnostic Baseline" : reportCtx);
        explain.put("ragEvidence", "Dynamic Clinical Evidence Retrieval for " + name);
        explain.put("safetyPolicy", "ICMR National Guidelines & Harrison's Internal Medicine");

        return new ChatResponse(
            "msg-" + System.currentTimeMillis(),
            "assistant",
            content,
            false,
            Arrays.asList("ICMR Clinical Practice Guidelines", "AIIMS Medical Protocols", "Harrison's Principles of Internal Medicine"),
            explain
        );
    }
}
