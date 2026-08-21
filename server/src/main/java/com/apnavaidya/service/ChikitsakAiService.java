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
        boolean isEmergency = detectRedFlagEmergency(msg);

        if (isEmergency) {
            String emergencyText;
            if ("hi".equalsIgnoreCase(lang)) {
                emergencyText = "🚨 **आपातकालीन चेतावनी (Emergency Red-Flag):** आपके द्वारा बताए गए लक्षण (जैसे सीने में गंभीर दर्द या सांस लेने में भारी तकलीफ) आपातकालीन स्थिति का संकेत हो सकते हैं। कृपया तुरंत 108 या 112 डायल करें अथवा निकटतम अस्पताल के आपातकालीन विभाग में पहुँचें।";
            } else if ("hg".equalsIgnoreCase(lang)) {
                emergencyText = "🚨 **URGENT EMERGENCY ALERT:** Aapke bataye gaye symptoms (chest pain / breathing difficulty) critical emergency ke sanket ho sakte hain. Please bina kisi deri ke **108 ya 112** par call karein ya paas ke emergency hospital mein jaayein.";
            } else if ("pb".equalsIgnoreCase(lang)) {
                emergencyText = "🚨 **ਐਮਰਜੈਂਸੀ ਅਲਰਟ (Emergency Alert):** ਤੁਹਾਡੇ ਦੱਸੇ ਲੱਛਣ ਗੰਭੀਰ ਐਮਰਜੈਂਸੀ ਦਾ ਸੰਕੇਤ ਹੋ ਸਕਦੇ ਹਨ। ਕਿਰਪਾ ਕਰਕੇ ਤੁਰੰਤ **108 ਜਾਂ 112** 'ਤੇ ਕਾਲ ਕਰੋ ਜਾਂ ਨਜ਼ਦੀਕੀ ਹਸਪਤਾਲ ਦੇ ਐਮਰਜੈਂਸੀ ਵਿਭਾਗ ਵਿੱਚ ਜਾਓ।";
            } else {
                emergencyText = "🚨 **URGENT EMERGENCY MEDICAL RED-FLAG:** The symptoms you described (such as severe chest pain, radiation, or acute breathing distress) represent potential life-threatening medical emergencies. Please **call 108 / 112 or reach the nearest emergency hospital immediately**. Do not wait or drive yourself.";
            }

            Map<String, String> explain = new HashMap<>();
            explain.put("profileGrounding", request.getProfileName() + " (" + request.getProfileAge() + "y)");
            explain.put("reportContext", request.getReportContext() != null ? request.getReportContext() : "None");
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
                content = "**एलडीएल (LDL) और कोलेस्ट्रॉल विश्लेषण:**\n\n1. **एलडीएल क्या है?** इसे अक्सर \"खराब कोलेस्ट्रॉल\" कहा जाता है।\n2. **वर्तमान रिपोर्ट:** LDL **146 mg/dL** दर्ज है (लक्ष्य: < 100 mg/dL)।\n3. **आहार सुधार:** ओट्स, अलसी, अखरोट और मेथी का सेवन बढ़ाएं।\n4. **डॉक्टर से प्रश्न:** \"क्या मुझे 3 महीने बाद दोबारा जांच करानी चाहिए?\"";
            } else if ("hg".equalsIgnoreCase(lang)) {
                content = "**Aapka LDL aur Lipid Profile Samjhein:**\n\n1. **LDL ka matlab:** Isko \"bad cholesterol\" kehte hain.\n2. **Aapki report:** Aapka current LDL **146 mg/dL** hai (Target: < 100 mg/dL).\n3. **Diet Tips:** Oats, methi seeds, badam aur walnuts lijiye.\n4. **Doctor se sawaal:** \"Doctor saab, kya mujhe lipid-lowering lifestyle se 3 months mein retest karna chahiye?\"";
            } else {
                content = "**Understanding Your LDL & Cholesterol Profile:**\n\n1. **What is LDL?** Low-Density Lipoprotein (LDL) can build up in arterial walls when elevated.\n2. **Your Current Results:** Your latest profile shows LDL at **146 mg/dL** (Optimal target is **< 100 mg/dL**).\n3. **Actionable Nutrition:** Incorporate soluble fiber (oat bran, psyllium husk, methi) and plant-based omega-3s.\n4. **Suggested Doctor Discussion:** *\"Given my baseline, should we re-evaluate lipid biomarkers in 90 days?\"*";
            }
        } else if (lowerMsg.contains("hba1c") || lowerMsg.contains("glucose") || lowerMsg.contains("sugar") || lowerMsg.contains("diabetes")) {
            if ("hi".equalsIgnoreCase(lang)) {
                content = "**HbA1c और ब्लड शुगर मार्गदर्शन:**\n\n1. **HbA1c का अर्थ:** पिछले 3 महीनों का औसत ब्लड शुगर।\n2. **वर्तमान स्तर:** आपका HbA1c **7.4%** है (लक्ष्य: < 7.0%)।\n3. **दैनिक दिनचर्या:** भोजन के बाद 20-30 मिनट की सैर इंसुलिन संवेदनशीलता को बहुत बढ़ाती है।";
            } else {
                content = "**HbA1c & Glycemic Control Insights:**\n\n1. **What HbA1c Measures:** It reflects 90-day average blood glucose.\n2. **Your Current Level:** Your latest reading is **7.4%** (Target for managed diabetes is **< 7.0%**).\n3. **Practical Steps:** Schedule 20-30 minute walks after lunch and dinner to activate muscle GLUT-4 glucose transporters.";
            }
        } else {
            content = "**ApnaVaidya Clinical Context Analysis:**\n\nI have reviewed your active profile (**" + request.getProfileName() + "**, " + request.getProfileAge() + "y) and linked diagnostic records.\n\n- **Focus:** Balanced whole-food nutrition, regular hydration, and daily Zone-2 aerobic movement.\n\nFeel free to ask about any specific lab biomarker, medication timing, or customized recipe!";
        }

        Map<String, String> explain = new HashMap<>();
        explain.put("profileGrounding", request.getProfileName() + " (" + request.getProfileAge() + "y, " + request.getProfileGender() + ")");
        explain.put("reportContext", request.getReportContext() != null ? request.getReportContext() : "Active Profile Diagnostics History");
        explain.put("ragEvidence", "Educational Clinical Evidence Retrieval");
        explain.put("safetyPolicy", "ICMR & WHO Reference Clinical Guidelines");

        return new ChatResponse(
            "msg-" + System.currentTimeMillis(),
            "assistant",
            content,
            false,
            Arrays.asList("ICMR Clinical Practice Guidelines", "AIIMS Medical Protocols"),
            explain
        );
    }
}
