import React, { useState } from "react";
import { Sparkles, MessageSquare, AlertTriangle, Send, Heart, BrainCircuit, Activity, ChevronRight, HelpCircle, FileText } from "lucide-react";
import { sampleReports } from "../data";

interface AIChatAndSummaryProps {
  onAddRecordToLocker?: (record: any) => void;
  lang: "en" | "hi" | "mr";
  t: any;
}

export default function AIChatAndSummary({ onAddRecordToLocker, lang, t }: AIChatAndSummaryProps) {
  // Report Explainer State
  const [reportInput, setReportInput] = useState("");
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [reportResult, setReportResult] = useState<any>(null);
  const [reportError, setReportError] = useState("");

  // Chatbot State
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "ai"; content: string }>>([
    { role: "ai", content: "Namaste! I am AABHA, your HealthShield Bharat AI companion. Paste your lab reports above for explanations, or ask me any health and Ayushman Bharat questions here! E.g. 'What are benefits of ABHA card?'" }
  ]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // Trigger report analysis
  const handleAnalyzeReport = async (text: string) => {
    const finalSrc = text || reportInput;
    if (!finalSrc.trim()) return;

    setIsLoadingReport(true);
    setReportError("");
    setReportResult(null);

    try {
      const res = await fetch("/api/gemini/explain-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportText: finalSrc })
      });

      const data = await res.json();
      if (res.ok) {
        setReportResult(data);
        if (onAddRecordToLocker) {
          // Construct locker record
          onAddRecordToLocker({
            id: `rec-ai-${Date.now()}`,
            date: data.date || new Date().toISOString().split("T")[0],
            title: data.reportType || "AI Analyzed Report",
            institution: "ABDM Health Locker upload",
            doctorName: "AI Companion Explainer",
            type: "Diagnostic Report",
            summary: data.summary,
            findings: data.keyFindings,
            estimatedHealthScore: data.estimatedHealthScore,
            healthTips: data.healthTips,
            riskAlerts: data.riskAlerts,
            missingScreenings: data.missingScreeningsOrVaccines,
            status: "Local"
          });
        }
      } else {
        setReportError(data.error || "Failed to analyze report.");
      }
    } catch (err: any) {
      setReportError("Error communicating with server. Ensure GEMINI_API_KEY is configured.");
    } finally {
      setIsLoadingReport(false);
    }
  };

  // Trigger chatbot
  const handleSendChat = async (presetText?: string) => {
    const textToSend = presetText || chatInput;
    if (!textToSend.trim()) return;

    if (!presetText) setChatInput("");
    setChatHistory(prev => [...prev, { role: "user", content: textToSend }]);
    setIsLoadingChat(true);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory.map(h => ({
            role: h.role === "user" ? "user" : "model",
            content: h.content
          }))
        })
      });

      const data = await res.json();
      if (res.ok) {
        setChatHistory(prev => [...prev, { role: "ai", content: data.text }]);
      } else {
        setChatHistory(prev => [...prev, { role: "ai", content: `⚠️ Error: ${data.error || "Unable to get response"}` }]);
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { role: "ai", content: "⚠️ Could not connect to backend server. Make sure dev server is active and API Key is configured." }]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Pre-fill a sample report
  const handleSelectSample = (sampleText: string) => {
    setReportInput(sampleText);
  };

  return (
    <div className="space-y-6">
      {/* 1. Report Explainer Section */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-lg">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-sans font-semibold text-slate-800 dark:text-slate-100 text-sm">
              {t.ocrSummary || "AI Medical Report Explainer"}
            </h3>
            <p className="text-xs text-slate-500">
              Upload PDF or copy-paste clinical parameters to translate medical jargon into plain language.
            </p>
          </div>
        </div>

        {/* Preset Sample Reports for Fast Testing */}
        <div className="mb-4">
          <p className="text-[11px] font-sans font-medium text-slate-600 dark:text-slate-400 mb-2">
            💡 Quick Test Templates (Click to pre-fill):
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleReports.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSample(s.text)}
                className="text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition"
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area Input */}
        <div className="space-y-3">
          <textarea
            value={reportInput}
            onChange={(e) => setReportInput(e.target.value)}
            placeholder="Paste your medical lab report text here... (e.g. Hemoglobin 11.2, HbA1c 5.9, LDL 146)"
            rows={4}
            className="w-full p-3 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 font-mono transition"
          />

          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <FileText className="h-3 w-3" /> Fully compatible with standard Indian clinical labs
            </span>
            <button
              onClick={() => handleAnalyzeReport("")}
              disabled={isLoadingReport || !reportInput.trim()}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 disabled:opacity-40 hover:from-blue-700 hover:to-indigo-700 text-white text-xs px-4 py-2 rounded-xl shadow font-medium transition"
            >
              {isLoadingReport ? "Analyzing with AI..." : "Explain with AI"}
              <Sparkles className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {reportError && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950 text-rose-600 text-xs rounded-xl border border-rose-100 dark:border-rose-900">
            {reportError}
          </div>
        )}

        {/* Explanation Results */}
        {reportResult && (
          <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {reportResult.reportType || "Diagnostic Report"}
                </span>
                <h4 className="font-sans font-bold text-slate-800 dark:text-slate-100 mt-1.5">
                  Report Findings: {reportResult.patientName}
                </h4>
              </div>

              {/* Simulated Health Score */}
              <div className="flex items-center gap-2 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950 p-2 px-3 rounded-xl border border-teal-100 dark:border-teal-900">
                <div className="text-right">
                  <span className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider font-sans">Report Score</span>
                  <p className="text-xl font-bold text-emerald-800 dark:text-emerald-300">{reportResult.estimatedHealthScore}/100</p>
                </div>
                <Activity className="h-7 w-7 text-emerald-600" />
              </div>
            </div>

            {/* AI Summary Statement */}
            <div className="bg-blue-50/50 dark:bg-blue-950/20 p-3.5 rounded-xl border border-blue-50 dark:border-blue-900/50">
              <span className="text-[11px] text-blue-800 dark:text-blue-300 font-sans font-bold block mb-1">AI Simplified Summary:</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">{reportResult.summary}</p>
            </div>

            {/* Key Clinical Metric Badges */}
            <div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-400 mb-2">Clinical Parameters Translated:</p>
              <div className="grid grid-cols-1 gap-2">
                {reportResult.keyFindings?.map((k: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-800/60"
                  >
                    <div className="flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans">{k.finding}</span>
                        <span className="text-xs font-mono font-bold text-blue-600">{k.value}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{k.explanation}</p>
                    </div>

                    <span
                      className={`text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        k.status === "normal"
                          ? "bg-green-50 dark:bg-green-950 text-green-600"
                          : k.status === "warning"
                          ? "bg-amber-50 dark:bg-amber-950 text-amber-600"
                          : "bg-rose-50 dark:bg-rose-950 text-rose-600"
                      }`}
                    >
                      {k.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50/30 dark:bg-emerald-950/10 p-3 rounded-xl border border-emerald-50 dark:border-emerald-900/30">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block mb-1.5 flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" /> Dietary & Wellness Tips:
                </span>
                <ul className="list-disc pl-4 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                  {reportResult.healthTips?.map((t: string, i: number) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-50/30 dark:bg-rose-950/10 p-3 rounded-xl border border-rose-50 dark:border-rose-900/30">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 block mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Missing Screenings & Risks:
                </span>
                <ul className="list-disc pl-4 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                  {reportResult.missingScreeningsOrVaccines?.map((t: string, i: number) => (
                    <li key={i}>{t}</li>
                  ))}
                  {reportResult.riskAlerts?.map((t: string, i: number) => (
                    <li key={i} className="text-amber-600 font-sans font-medium">{t}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl text-[10px] text-slate-500 font-sans text-center">
              ⚠️ AI insights are for educational purposes. Sync this report directly with your ABHA ID to share with Dr. Priya Iyer.
            </div>
          </div>
        )}
      </div>

      {/* 2. Interactive Chatbot Section */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-lg">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-sans font-semibold text-slate-800 dark:text-slate-100 text-sm">
              Ask AABHA — Smart Health Chatbot
            </h3>
            <p className="text-xs text-slate-500">
              Get answers about ABDM integrations, PM-JAY medical insurance, or general medical queries.
            </p>
          </div>
        </div>

        {/* Chat History Panel */}
        <div className="bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-800 p-3 h-64 overflow-y-auto space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            {chatHistory.map((c, idx) => (
              <div key={idx} className={`flex ${c.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] p-2.5 rounded-2xl text-xs font-sans ${
                    c.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-tl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{c.content}</p>
                </div>
              </div>
            ))}
            {isLoadingChat && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2.5 rounded-2xl text-xs rounded-tl-none text-slate-500 flex items-center gap-1.5 shadow-sm">
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommended Starter Questions */}
        <div className="my-3">
          <p className="text-[10px] font-sans text-slate-500 mb-1.5">Suggested Questions:</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              "What is an ABHA card?",
              "Recommend pre-diabetic diet",
              "Who is eligible for PM-JAY?"
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChat(q)}
                className="text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-950 dark:hover:text-blue-300 border border-slate-150 dark:border-slate-700 px-2 py-1 rounded-full transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
            placeholder="Type your health questions here..."
            className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 transition"
          />
          <button
            onClick={() => handleSendChat()}
            disabled={isLoadingChat || !chatInput.trim()}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow disabled:opacity-45 transition"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
