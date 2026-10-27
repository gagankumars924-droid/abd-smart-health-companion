import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client to prevent startup crashes if key is missing
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "") {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// 1. Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// Endpoint to check configuration status
app.get("/api/config-status", (req, res) => {
  const ai = getGeminiClient();
  res.json({
    hasGeminiKey: ai !== null,
    env: process.env.NODE_ENV || "development"
  });
});

// 2. Chatbot proxy endpoint
app.post("/api/gemini/chat", async (req, res) => {
  const { message, history } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.status(400).json({
      error: "Gemini API Key is missing. Please add your GEMINI_API_KEY in the Secrets panel."
    });
  }

  try {
    // Map history to the structure Gemini expects
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content }]
        });
      }
    }
    // Append the latest message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: `You are the "AABHA" AI Assistant inside HealthShield Bharat. Your goal is to increase citizen engagement, trust, and understanding of the Ayushman Bharat Digital Mission (ABDM) and their personal health.
Provide clear, warm, and accurate medical assistance. Keep responses concise and formatted cleanly with markdown bullets where helpful.
You can respond in English, Hindi, or friendly conversational Hinglish as requested. 
Always include a compassionate note and advise consulting an actual doctor for formal medical decisions.`
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with Gemini AI." });
  }
});

// 3. Medical Report Explainer / OCR summary endpoint
app.post("/api/gemini/explain-report", async (req, res) => {
  const { reportText } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.status(400).json({
      error: "Gemini API Key is missing. Please add your GEMINI_API_KEY in the Secrets panel."
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Explain the following medical report or lab test details in simple, non-jargon terms for a patient in India. Look out for typical ABDM metrics, clinical values, vaccines, and screenings.
Extract as much structured information as possible.
Return the output STRICTLY as a valid JSON object matching the following structure:
{
  "patientName": "Patient Name (or Patient if not found)",
  "reportType": "Report/Test Type (e.g. Complete Blood Count, Liver Function, lipid, etc.)",
  "date": "Date of report (or Recent)",
  "summary": "A friendly, easy-to-understand 2-3 sentence overview of what this report says in plain language.",
  "keyFindings": [
    { "finding": "Metric name (e.g., HbA1c)", "explanation": "What this metric actually means in simple terms", "value": "e.g., 7.2%", "status": "normal, warning, or critical" }
  ],
  "estimatedHealthScore": 85, // estimate an overall health score from 1 to 100 based on findings
  "healthTips": ["personalized practical diet/lifestyle tip 1", "personalized lifestyle tip 2"],
  "missingScreeningsOrVaccines": ["suggested vaccination or preventive screening based on findings, or general wellness checks"],
  "riskAlerts": ["important risk alert if values are critical or warning, or general health watch-out"]
}

Medical Report Text:
${reportText}`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsedJson = JSON.parse(response.text || "{}");
    res.json(parsedJson);
  } catch (error: any) {
    console.error("Gemini Report Explainer Error:", error);
    res.status(500).json({ error: error.message || "Failed to process the medical report." });
  }
});

// 4. Doctor Voice/Text Summary Generator endpoint
app.post("/api/gemini/doctor-summary", async (req, res) => {
  const { patientSymptoms, doctorNotes, voiceNotes } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.status(400).json({
      error: "Gemini API Key is missing. Please add your GEMINI_API_KEY in the Secrets panel to summarize."
    });
  }

  try {
    const rawInput = `Symptoms described: ${patientSymptoms || "None"}
Doctor clinical notes: ${doctorNotes || "None"}
Doctor dictated/voice notes: ${voiceNotes || "None"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are a clinical decision support assistant for Indian doctors integrated with ABDM. 
Analyze the doctor's clinical input, voice notes, and symptoms. Structure them into a professional clinical summary, suggest a digital prescription format, and provide a simplified text to update the patient's ABHA Digital Health Locker Timeline.

Return the output STRICTLY as a valid JSON object matching the following structure:
{
  "summary": "Professional clinical patient summary for the EHR",
  "diagnosis": "Primary suspected diagnosis or assessment",
  "digitalPrescription": {
    "medicines": [
      { "name": "Paracetamol 650mg", "dosage": "1 tablet", "frequency": "Thrice a day after meals", "duration": "5 days" }
    ],
    "tests": ["Complete Blood Count (CBC)"],
    "advice": "General advice like rest, high fluids intake."
  },
  "abdmTimelineUpdate": "A beautifully simplified 1-sentence layperson medical event description to go into the patient's ABHA Digital Timeline (e.g. 'Diagnosed with viral fever, advised rest and paracetamol')"
}

Doctor Inputs:
${rawInput}`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsedJson = JSON.parse(response.text || "{}");
    res.json(parsedJson);
  } catch (error: any) {
    console.error("Gemini Doctor Summary Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate doctor summary." });
  }
});

// 5. Patient Record Suggestion AI endpoint (Selective Sharing Assistant)
app.post("/api/gemini/suggest-records", async (req, res) => {
  const { reasonOrCondition, records } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.status(400).json({
      error: "Gemini API Key is missing. Using smart offline record matching."
    });
  }

  try {
    const prompt = `You are a privacy-first clinical assistant for Ayushman Bharat Digital Mission (ABDM).
A patient wants to selectively share relevant health records with a doctor or recipient for this specific reason/condition:
"${reasonOrCondition}"

Available records in the patient's health locker:
${JSON.stringify(records, null, 2)}

Identify ONLY the records that are clinically relevant to the patient's stated consultation purpose or disease condition.
IMPORTANT PRIVACY RULE: Never suggest unrelated records (e.g. do not suggest gynecological or unrelated pediatric tests if the patient is visiting for a cardiac checkup).
Return STRICTLY a JSON object with this structure:
{
  "suggestedRecordIds": ["rec-id-1", "rec-id-2"],
  "explanation": "Clear, friendly explanation in 1-2 sentences of why these specific records are suggested for this consultation",
  "matchedCategories": ["category 1", "category 2"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsedJson = JSON.parse(response.text || "{}");
    res.json(parsedJson);
  } catch (error: any) {
    console.error("Gemini Record Suggestion Error:", error);
    res.status(500).json({ error: error.message || "Failed to suggest records." });
  }
});

// Serve static built files or setup Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
