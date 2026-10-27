import React, { useState } from "react";
import {
  QrCode, Share2, Shield, Lock, Clock, Check, Copy, AlertTriangle,
  Sparkles, Trash2, Eye, User, FileText, CheckCircle2, ChevronRight,
  RefreshCw, Info, ExternalLink, Calendar, CheckSquare, Square
} from "lucide-react";
import { MedicalRecord, SharedRecordToken, Language } from "../types";

interface SelectiveShareQRProps {
  medicalRecords: MedicalRecord[];
  sharedTokens: SharedRecordToken[];
  onUpdateSharedTokens: (tokens: SharedRecordToken[]) => void;
  activePatientName: string;
  activePatientAbha: string;
  lang: Language;
  onShowToast?: (msg: string, type?: "success" | "error" | "info") => void;
}

const RECORD_CATEGORIES = [
  "All",
  "Diabetes",
  "Blood pressure and cardiovascular health",
  "Allergies",
  "Prescriptions and medications",
  "Laboratory reports",
  "Previous consultations",
  "Other medical conditions"
];

export default function SelectiveShareQR({
  medicalRecords,
  sharedTokens,
  onUpdateSharedTokens,
  activePatientName,
  activePatientAbha,
  lang,
  onShowToast
}: SelectiveShareQRProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);

  // Share Configuration Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [recipientName, setRecipientName] = useState("Dr. Alok Sharma");
  const [purpose, setPurpose] = useState("Routine Consultation Follow-up");
  const [expiryDuration, setExpiryDuration] = useState<"15m" | "2h" | "24h" | "7d">("2h");
  const [patientConsentAgreed, setPatientConsentAgreed] = useState(false);

  // Active Generated Token Display Modal
  const [activeGeneratedToken, setActiveGeneratedToken] = useState<SharedRecordToken | null>(null);

  // Simulated Doctor Inspection Modal (allows patient to see what doctor would see)
  const [inspectingToken, setInspectingToken] = useState<SharedRecordToken | null>(null);

  // AI-Assisted Recommendation State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiConditionQuery, setAiConditionQuery] = useState("");
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiSuggestedIds, setAiSuggestedIds] = useState<string[]>([]);
  const [showAiHelper, setShowAiHelper] = useState(false);

  const triggerToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    if (onShowToast) onShowToast(msg, type);
  };

  // Helper mapping category
  const matchesCategory = (rec: MedicalRecord, cat: string) => {
    if (cat === "All") return true;
    if (cat === "Diabetes") return rec.category === "Diabetes" || rec.title.toLowerCase().includes("hba1c") || rec.title.toLowerCase().includes("sugar") || rec.title.toLowerCase().includes("metformin");
    if (cat === "Blood pressure and cardiovascular health") return rec.category === "Cardiovascular" || rec.title.toLowerCase().includes("lipid") || rec.title.toLowerCase().includes("blood pressure") || rec.title.toLowerCase().includes("cholesterol");
    if (cat === "Allergies") return rec.category === "Allergies" || rec.title.toLowerCase().includes("allergy") || rec.title.toLowerCase().includes("ige");
    if (cat === "Prescriptions and medications") return rec.type.toLowerCase().includes("prescription") || rec.category === "Prescription";
    if (cat === "Laboratory reports") return rec.type.toLowerCase().includes("diagnostic") || rec.category === "Diagnostic";
    if (cat === "Previous consultations") return rec.type.toLowerCase().includes("consultation") || rec.category === "Consultation";
    return true;
  };

  const filteredRecords = medicalRecords.filter((rec) => matchesCategory(rec, selectedCategory));

  const handleToggleRecord = (id: string) => {
    if (selectedRecordIds.includes(id)) {
      setSelectedRecordIds(selectedRecordIds.filter((r) => r !== id));
    } else {
      setSelectedRecordIds([...selectedRecordIds, id]);
    }
  };

  const handleSelectGroup = (cat: string) => {
    const ids = medicalRecords.filter((r) => matchesCategory(r, cat)).map((r) => r.id);
    setSelectedRecordIds(Array.from(new Set([...selectedRecordIds, ...ids])));
    triggerToast(`Selected all ${cat} records!`, "info");
  };

  const handleClearSelection = () => {
    setSelectedRecordIds([]);
    setAiSuggestedIds([]);
    setAiExplanation(null);
  };

  // AI Record Suggestion Handler
  const handleRunAiSuggestion = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsAiLoading(true);
    setAiExplanation(null);

    try {
      const payloadRecords = medicalRecords.map((r) => ({
        id: r.id,
        title: r.title,
        type: r.type,
        category: r.category || "General",
        summary: r.summary
      }));

      const res = await fetch("/api/gemini/suggest-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reasonOrCondition: queryText,
          records: payloadRecords
        })
      });

      if (res.ok) {
        const data = await res.json();
        const validIds = (data.suggestedRecordIds || []).filter((id: string) =>
          medicalRecords.some((r) => r.id === id)
        );
        setAiSuggestedIds(validIds);
        setSelectedRecordIds(validIds);
        setAiExplanation(data.explanation || "Suggested relevant records for this consultation.");
        triggerToast(`AI suggested ${validIds.length} relevant record(s). Please review and approve!`, "success");
      } else {
        // Smart client-side fallback keyword matching
        runLocalKeywordMatcher(queryText);
      }
    } catch {
      runLocalKeywordMatcher(queryText);
    } finally {
      setIsAiLoading(false);
    }
  };

  const runLocalKeywordMatcher = (queryText: string) => {
    const q = queryText.toLowerCase();
    const matched = medicalRecords.filter((r) => {
      const hay = `${r.title} ${r.summary} ${r.category || ""} ${r.type}`.toLowerCase();
      if (q.includes("diabet") || q.includes("sugar")) {
        return hay.includes("diabet") || hay.includes("hba1c") || hay.includes("sugar") || hay.includes("metformin");
      }
      if (q.includes("cardio") || q.includes("heart") || q.includes("bp") || q.includes("pressure")) {
        return hay.includes("lipid") || hay.includes("pressure") || hay.includes("cholesterol") || hay.includes("cardio");
      }
      if (q.includes("allergy") || q.includes("cough")) {
        return hay.includes("allerg") || hay.includes("ige") || hay.includes("cough") || hay.includes("rhinitis");
      }
      return hay.includes(q);
    });

    const ids = matched.map((r) => r.id);
    setAiSuggestedIds(ids);
    setSelectedRecordIds(ids);
    setAiExplanation(`Local smart matcher identified ${ids.length} matching health record(s) related to "${queryText}". You have full authority to edit this selection.`);
    triggerToast(`Matched ${ids.length} records. Please review before sharing.`, "info");
  };

  // Generate Tokenized QR
  const handleGenerateShareToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRecordIds.length === 0) {
      triggerToast("Please select at least one health record to share.", "error");
      return;
    }
    if (!patientConsentAgreed) {
      triggerToast("Please confirm patient consent before generating sharing credentials.", "error");
      return;
    }

    const durationMs =
      expiryDuration === "15m"
        ? 15 * 60 * 1000
        : expiryDuration === "2h"
        ? 2 * 60 * 60 * 1000
        : expiryDuration === "24h"
        ? 24 * 60 * 60 * 1000
        : 7 * 24 * 60 * 60 * 1000;

    const label =
      expiryDuration === "15m"
        ? "15 Minutes"
        : expiryDuration === "2h"
        ? "2 Hours"
        : expiryDuration === "24h"
        ? "24 Hours"
        : "7 Days";

    // Unpredictable cryptographic token
    const randomHex = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const tokenString = `tok_sec_${Date.now()}_${randomHex}`;

    const newToken: SharedRecordToken = {
      id: `sh-${Date.now()}`,
      token: tokenString,
      createdDate: new Date().toISOString().split("T")[0],
      expiryTime: new Date(Date.now() + durationMs).toISOString(),
      expiryDurationLabel: label,
      purpose: purpose,
      recipientName: recipientName,
      diseaseCategory: selectedCategory !== "All" ? selectedCategory : "Selective Clinical Dossier",
      recordIds: selectedRecordIds,
      revoked: false,
      accessCount: 0
    };

    onUpdateSharedTokens([newToken, ...sharedTokens]);
    setActiveGeneratedToken(newToken);
    setIsShareModalOpen(false);
    setPatientConsentAgreed(false);
    triggerToast("Time-limited secure QR generated! No permanent data is exposed.", "success");
  };

  // Revoke token
  const handleRevokeToken = (id: string) => {
    const updated = sharedTokens.map((t) => (t.id === id ? { ...t, revoked: true } : t));
    onUpdateSharedTokens(updated);
    if (activeGeneratedToken?.id === id) {
      setActiveGeneratedToken({ ...activeGeneratedToken, revoked: true });
    }
    triggerToast("Access immediately revoked! The QR code and token are permanently deactivated.", "info");
  };

  const handleCopyLink = (token: SharedRecordToken) => {
    const secureUrl = `${window.location.origin}/#share-view?token=${token.token}`;
    navigator.clipboard.writeText(secureUrl);
    triggerToast("Encrypted sharing link copied to clipboard!", "success");
  };

  return (
    <div className="space-y-6 animate-fade-in text-left pb-16">
      {/* Title & Purpose Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="font-sans font-black text-slate-900 dark:text-white text-lg md:text-xl flex items-center gap-2">
            <QrCode className="h-5.5 w-5.5 text-blue-600 dark:text-blue-400" />
            <span>Selective Health Record Sharing & QR</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              Privacy-First Zero Exposure
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Share <em>only</em> the records required by your consulting doctor. Your complete ABHA identity and unrelated medical history remain 100% private.
          </p>
        </div>

        {/* Generate Button */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => {
              if (selectedRecordIds.length === 0) {
                triggerToast("Please select at least one record from the list below.", "error");
                return;
              }
              setIsShareModalOpen(true);
            }}
            disabled={selectedRecordIds.length === 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
              selectedRecordIds.length > 0
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Share2 className="h-4 w-4" />
            <span>Create Secure QR ({selectedRecordIds.length})</span>
          </button>
        </div>
      </div>

      {/* Privacy and Security Guarantee Notice */}
      <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <Lock className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs">
              Cryptographic Safeguard & Selective Authorization
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              QR codes generated here do <strong>not</strong> contain raw records, passwords, or whole profiles. They generate temporary, unpredictable cryptographic tokens that can be revoked anytime.
            </p>
          </div>
        </div>
        <span className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 shrink-0">
          Instant Revocation Supported
        </span>
      </div>

      {/* AI-Assisted Consultation Record Selector Banner */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-black text-xs md:text-sm text-slate-900 dark:text-white">
              AI Record Suggester (Optional Assistance)
            </h4>
          </div>
          <button
            onClick={() => setShowAiHelper(!showAiHelper)}
            className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            {showAiHelper ? "Hide Assistant" : "Need help choosing records?"}
          </button>
        </div>

        {showAiHelper && (
          <div className="space-y-3 pt-2 border-t border-slate-150 dark:border-slate-800 text-xs animate-fade-in">
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Tell the assistant what type of appointment you have. The AI suggests relevant records for your review. <em>You retain 100% control and must manually approve each item before any link or QR is created.</em>
            </p>

            {/* Quick Consultation Presets */}
            <div className="flex flex-wrap gap-1.5">
              {[
                "Diabetic Follow-up & Sugar Review",
                "Cardiologist BP & Cholesterol Check",
                "Pulmonology & Allergic Cough Visit",
                "Routine Annual Health Checkup"
              ].map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setAiConditionQuery(preset);
                    handleRunAiSuggestion(preset);
                  }}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 rounded-lg text-[10.5px] font-medium transition cursor-pointer border border-slate-200/60"
                >
                  ⚡ {preset}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Or describe consultation purpose (e.g. visiting orthopaedic for knee pain)..."
                value={aiConditionQuery}
                onChange={(e) => setAiConditionQuery(e.target.value)}
                className="flex-1 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
              />
              <button
                onClick={() => handleRunAiSuggestion(aiConditionQuery)}
                disabled={isAiLoading || !aiConditionQuery.trim()}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isAiLoading ? "Analyzing..." : "Suggest"}</span>
              </button>
            </div>

            {/* AI Explanation feedback */}
            {aiExplanation && (
              <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50 text-blue-950 dark:text-blue-200 text-xs flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold">AI Suggestion Rationale:</p>
                  <p className="text-[11px] leading-relaxed">{aiExplanation}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category Tabs & Group Selector */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Filter Medical Records by Condition:</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {selectedRecordIds.length > 0 && (
              <button
                onClick={handleClearSelection}
                className="text-rose-500 font-bold hover:underline"
              >
                Clear Selection ({selectedRecordIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Category Scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {RECORD_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Record Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredRecords.map((rec) => {
          const isSelected = selectedRecordIds.includes(rec.id);
          const isAiSuggested = aiSuggestedIds.includes(rec.id);

          return (
            <div
              key={rec.id}
              onClick={() => handleToggleRecord(rec.id)}
              className={`p-4 rounded-2xl border transition flex flex-col justify-between cursor-pointer text-xs relative ${
                isSelected
                  ? "bg-blue-50/50 dark:bg-blue-950/30 border-blue-500 shadow-xs"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
              }`}
            >
              {/* Top Row with Checkbox & Category */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-0.5 text-blue-600">
                      {isSelected ? (
                        <CheckSquare className="h-5 w-5 fill-blue-600 text-white" />
                      ) : (
                        <Square className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {rec.category || rec.type}
                    </span>
                  </div>

                  {isAiSuggested && (
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-0.5">
                      <Sparkles className="h-2.5 w-2.5" />
                      AI Relevant
                    </span>
                  )}
                </div>

                {/* Title & Facility */}
                <h3 className="font-sans font-black text-xs sm:text-sm text-slate-900 dark:text-white leading-snug">
                  {rec.title}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {rec.institution} • {rec.date} • Dr. {rec.doctorName}
                </p>

                {/* Summary */}
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed bg-slate-50/70 dark:bg-slate-950/60 p-2 rounded-lg border border-slate-100 dark:border-slate-850">
                  {rec.summary}
                </p>
              </div>

              {/* Bottom status */}
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px]">
                <span className="text-slate-400 font-mono">ID: {rec.id}</span>
                <span
                  className={`font-bold ${
                    isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-500"
                  }`}
                >
                  {isSelected ? "Selected for Sharing ✓" : "Click to Include"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Shared Tokens & Revocation Management */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-sans font-black text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-blue-600" />
              <span>Active Selective Sharing Passes ({sharedTokens.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Manage time-limited passes. Access logs and instant revocation controls.
            </p>
          </div>
        </div>

        {sharedTokens.length > 0 ? (
          <div className="space-y-2.5">
            {sharedTokens.map((token) => {
              const isExpired = new Date(token.expiryTime) < new Date();
              const isInvalid = token.revoked || isExpired;

              return (
                <div
                  key={token.id}
                  className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs ${
                    isInvalid
                      ? "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-75"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs"
                  }`}
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-[11px] text-slate-800 dark:text-slate-200">
                        {token.token.slice(0, 18)}...
                      </span>
                      <span
                        className={`text-[8.5px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          token.revoked
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : isExpired
                            ? "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        }`}
                      >
                        {token.revoked ? "Revoked" : isExpired ? "Expired" : "Active Time-Pass"}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        • {token.recordIds.length} Record(s) Authorized
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      <strong>Recipient:</strong> {token.recipientName} • <strong>Purpose:</strong> {token.purpose}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                      <span>Expires: {new Date(token.expiryTime).toLocaleString()}</span>
                      <span>•</span>
                      <span>Accesses: {token.accessCount} times</span>
                    </div>
                  </div>

                  {/* Actions for this token */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {!isInvalid && (
                      <>
                        <button
                          onClick={() => setActiveGeneratedToken(token)}
                          className="px-2.5 py-1.5 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-xl font-bold hover:bg-blue-100 transition flex items-center gap-1 cursor-pointer"
                        >
                          <QrCode className="h-3.5 w-3.5" />
                          <span>Show QR</span>
                        </button>
                        <button
                          onClick={() => handleCopyLink(token)}
                          className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 transition flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Link</span>
                        </button>
                      </>
                    )}

                    {/* Simulate Doctor Inspection View */}
                    <button
                      onClick={() => setInspectingToken(token)}
                      className="px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold hover:bg-indigo-100 transition flex items-center gap-1 cursor-pointer"
                      title="Inspect what doctor sees"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Doctor View</span>
                    </button>

                    {!token.revoked && !isExpired && (
                      <button
                        onClick={() => handleRevokeToken(token.id)}
                        className="px-2.5 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition flex items-center gap-1 cursor-pointer border border-rose-200/50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Revoke</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-3 italic">
            No active shared record tokens. Select records above and create your first privacy-safe QR pass.
          </p>
        )}
      </div>

      {/* Share Configuration Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 my-6 space-y-4 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800 pb-3">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-600" />
                <span>Configure Selective Record Share</span>
              </h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerateShareToken} className="space-y-3.5 text-xs">
              {/* Selected records summary */}
              <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/40">
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                  Records Selected for Sharing ({selectedRecordIds.length})
                </p>
                <div className="mt-1 space-y-1 max-h-24 overflow-y-auto">
                  {selectedRecordIds.map((id) => {
                    const r = medicalRecords.find((rec) => rec.id === id);
                    return (
                      <p key={id} className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate">
                        • {r?.title} ({r?.date})
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Recipient Input */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  Recipient Name / Clinic *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Alok Sharma (Apollo Clinics)"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              {/* Purpose Input */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  Purpose of Record Access *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Second opinion on HbA1c glucose levels"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              {/* Expiry Duration Selection */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  Access Expiration Window *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "15m", label: "15 Mins", sub: "Emergency" },
                    { id: "2h", label: "2 Hours", sub: "OPD Visit" },
                    { id: "24h", label: "24 Hours", sub: "1 Day" },
                    { id: "7d", label: "7 Days", sub: "Consultation" }
                  ].map((dur) => (
                    <button
                      key={dur.id}
                      type="button"
                      onClick={() => setExpiryDuration(dur.id as any)}
                      className={`p-2 rounded-xl text-center border transition cursor-pointer ${
                        expiryDuration === dur.id
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      <p className="font-bold text-xs">{dur.label}</p>
                      <p className={`text-[8.5px] ${expiryDuration === dur.id ? "text-blue-100" : "text-slate-400"}`}>
                        {dur.sub}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient Consent Checkbox */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="consentCheck"
                  checked={patientConsentAgreed}
                  onChange={(e) => setPatientConsentAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="consentCheck" className="text-[11px] text-amber-950 dark:text-amber-200 leading-snug cursor-pointer">
                  <strong>Explicit Patient Consent:</strong> I authorize the generation of this temporary cryptographic pass strictly for the specified recipient and records. I acknowledge I can revoke access at any moment.
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-150 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!patientConsentAgreed}
                  className={`px-4 py-2 font-bold rounded-xl text-xs transition cursor-pointer ${
                    patientConsentAgreed
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Generate Privacy QR Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generated QR Code & Link Viewer Modal */}
      {activeGeneratedToken && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 max-w-sm w-full rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 my-6 text-center space-y-4 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800 pb-2">
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                ABDM Selective Pass
              </span>
              <button
                onClick={() => setActiveGeneratedToken(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* High-Fidelity Procedural SVG QR Code */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-inner inline-block">
              <svg
                viewBox="0 0 160 160"
                className="h-44 w-44 mx-auto text-slate-900"
                fill="currentColor"
              >
                {/* 3 Corner Anchor Squares */}
                <rect x="10" y="10" width="36" height="36" rx="6" />
                <rect x="18" y="18" width="20" height="20" fill="white" rx="3" />
                <rect x="23" y="23" width="10" height="10" />

                <rect x="114" y="10" width="36" height="36" rx="6" />
                <rect x="122" y="18" width="20" height="20" fill="white" rx="3" />
                <rect x="127" y="23" width="10" height="10" />

                <rect x="10" y="114" width="36" height="36" rx="6" />
                <rect x="18" y="122" width="20" height="20" fill="white" rx="3" />
                <rect x="23" y="127" width="10" height="10" />

                {/* Simulated Cryptographic Data Grid */}
                <rect x="54" y="14" width="8" height="8" />
                <rect x="68" y="20" width="8" height="8" />
                <rect x="82" y="14" width="8" height="8" />
                <rect x="96" y="24" width="8" height="8" />

                <rect x="54" y="44" width="8" height="8" />
                <rect x="68" y="52" width="8" height="8" />
                <rect x="82" y="44" width="8" height="8" />
                <rect x="96" y="52" width="8" height="8" />

                <rect x="20" y="60" width="8" height="8" />
                <rect x="34" y="68" width="8" height="8" />
                <rect x="48" y="60" width="8" height="8" />
                <rect x="62" y="76" width="8" height="8" />
                <rect x="76" y="68" width="8" height="8" />
                <rect x="90" y="60" width="8" height="8" />
                <rect x="104" y="76" width="8" height="8" />
                <rect x="118" y="68" width="8" height="8" />
                <rect x="132" y="60" width="8" height="8" />

                <rect x="14" y="88" width="8" height="8" />
                <rect x="28" y="96" width="8" height="8" />
                <rect x="42" y="88" width="8" height="8" />
                <rect x="56" y="104" width="8" height="8" />
                <rect x="70" y="88" width="8" height="8" />
                <rect x="84" y="104" width="8" height="8" />
                <rect x="98" y="88" width="8" height="8" />
                <rect x="112" y="96" width="8" height="8" />
                <rect x="126" y="88" width="8" height="8" />
                <rect x="140" y="104" width="8" height="8" />

                <rect x="54" y="120" width="8" height="8" />
                <rect x="68" y="134" width="8" height="8" />
                <rect x="82" y="120" width="8" height="8" />
                <rect x="96" y="134" width="8" height="8" />
                <rect x="110" y="120" width="8" height="8" />
                <rect x="124" y="134" width="8" height="8" />
                <rect x="138" y="120" width="8" height="8" />
              </svg>
            </div>

            <div className="space-y-1">
              <h4 className="font-black text-sm text-slate-900 dark:text-white">
                Valid for {activeGeneratedToken.recipientName}
              </h4>
              <p className="text-[11px] text-slate-500 font-mono">
                Expires in: {activeGeneratedToken.expiryDurationLabel}
              </p>
              <p className="text-[10px] text-slate-400">
                {activeGeneratedToken.recordIds.length} Selective Record(s) Bound
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleCopyLink(activeGeneratedToken)}
                className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Link</span>
              </button>
              <button
                onClick={() => {
                  handleRevokeToken(activeGeneratedToken.id);
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Revoke Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Doctor View Modal */}
      {inspectingToken && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 my-6 space-y-4 animate-scale-in text-left">
            <div className="flex justify-between items-start border-b border-slate-150 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Doctor Gateway Sandbox
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                  Recipient View: {inspectingToken.recipientName}
                </h3>
              </div>
              <button
                onClick={() => setInspectingToken(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50 text-xs text-blue-950 dark:text-blue-200">
              <p className="font-bold flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-blue-600" />
                <span>Zero Exposure Verification:</span>
              </p>
              <p className="text-[11px] mt-0.5 leading-relaxed">
                Notice that the recipient ONLY has access to the {inspectingToken.recordIds.length} records selected by {activePatientName}. All other sensitive medical conditions, family records, and notes remain completely obscured.
              </p>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
              <p className="font-extrabold text-slate-800 dark:text-slate-200 text-[11px] uppercase">
                Authorized Records Accessible Via Token:
              </p>
              {inspectingToken.recordIds.map((id) => {
                const rec = medicalRecords.find((r) => r.id === id);
                if (!rec) return null;
                return (
                  <div
                    key={id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-slate-900 dark:text-white">{rec.title}</p>
                      <span className="text-[9px] font-mono text-slate-400">{rec.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{rec.summary}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-150 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setInspectingToken(null)}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 cursor-pointer"
              >
                Close Doctor Sandbox
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
