import React, { useState } from "react";
import {
  Stethoscope, QrCode, Search, FileText, Send, Sparkles, Check, AlertTriangle,
  ListFilter, Mic, MessageSquare, Shield, Lock, Clock, Eye, X, CheckCircle2,
  ExternalLink, Calendar, ChevronRight
} from "lucide-react";
import { OPDPatient, Language, SharedRecordToken, MedicalRecord } from "../types";

interface DoctorDeskProps {
  queue: OPDPatient[];
  activePatient: OPDPatient | null;
  onSelectPatient: (id: string) => void;
  onAddPrescriptionToPatient: (patientId: string, prescriptionData: any) => void;
  lang: Language;
  t: any;
  onShowToast?: (message: string, type?: "success" | "error" | "info") => void;
  sharedTokens?: SharedRecordToken[];
  allMedicalRecords?: MedicalRecord[];
}

export default function DoctorDesk({
  queue,
  activePatient,
  onSelectPatient,
  onAddPrescriptionToPatient,
  lang,
  t,
  onShowToast,
  sharedTokens = [],
  allMedicalRecords = []
}: DoctorDeskProps) {
  // Clinical Entry form state
  const [doctorNotes, setDoctorNotes] = useState("");
  const [voiceNotes, setVoiceNotes] = useState("");
  const [isDictating, setIsDictating] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [errorText, setErrorText] = useState("");
  const [isSynced, setIsSynced] = useState(false);

  // Doctor QR / Selective Token Intake State
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [verifiedTokenData, setVerifiedTokenData] = useState<{
    token: SharedRecordToken;
    records: MedicalRecord[];
  } | null>(null);
  const [isVerifyingToken, setIsVerifyingToken] = useState(false);

  const triggerToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    if (onShowToast) {
      onShowToast(msg, type);
    }
  };

  // Simulation dictation templates for easy doctor testing
  const dictationTemplates = [
    { label: "Dry Cough & Flu", text: "Patient has borderline high blood pressure. Complaining of dry cough for 3 days. Throat inflammation present. Suspect viral bronchitis. Advice steam inhalation, rest, and Paracetamol twice daily for 5 days." },
    { label: "Diabetes Follow-up", text: "Elevated fasting blood glucose at 135 mg/dL. Prescribe Metformin 500mg once daily after breakfast. Advise strict diabetic diet, 45 minutes walking, and re-screen HbA1c in 2 months." }
  ];

  const handleSimulateDictation = (text: string) => {
    setVoiceNotes(text);
    triggerToast("Voice dictation sample loaded!", "info");
  };

  const handleGenerateAISummary = async () => {
    if (!activePatient) return;
    setIsGeneratingAI(true);
    setErrorText("");
    setAiResult(null);
    setIsSynced(false);
    triggerToast("Generating clinical summary with Gemini AI...", "info");

    try {
      const res = await fetch("/api/gemini/doctor-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientSymptoms: activePatient.symptoms,
          doctorNotes: doctorNotes,
          voiceNotes: voiceNotes
        })
      });

      const data = await res.json();
      if (res.ok) {
        setAiResult(data);
        triggerToast("ABHA Digital Prescription generated successfully!", "success");
      } else {
        const errMsg = data.error || "Failed to process doctor notes.";
        setErrorText(errMsg);
        triggerToast(errMsg, "error");
      }
    } catch (err) {
      setErrorText("Could not connect to AI server. Check API secrets.");
      triggerToast("Failed to connect to AI server.", "error");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSyncToABHA = () => {
    if (!activePatient || !aiResult) return;
    setIsSynced(true);
    // Callback to update parent timeline state
    onAddPrescriptionToPatient(activePatient.id, {
      title: `Digital Prescription - ${aiResult.diagnosis || "Consultation Summary"}`,
      institution: "Aarogya Clinic, Sector 15",
      doctorName: "Dr. Alok Sharma",
      summary: aiResult.summary,
      findings: aiResult.digitalPrescription?.medicines?.map((m: any) => ({
        finding: m.name,
        value: m.dosage,
        explanation: `${m.frequency} for ${m.duration}`,
        status: "normal"
      })),
      date: new Date().toISOString().split("T")[0]
    });
    triggerToast(`Health prescription successfully synced to ${activePatient.name}'s ABHA Health Timeline!`, "success");
  };

  const handleVerifyToken = (tokenToVerify?: string) => {
    const targetToken = (tokenToVerify || tokenInput).trim().toUpperCase();
    if (!targetToken) {
      triggerToast("Please enter or scan a valid ABDM Selective Share Token.", "error");
      return;
    }

    setIsVerifyingToken(true);
    setTimeout(() => {
      const matched = sharedTokens.find(
        (t) => t.token.toUpperCase() === targetToken || t.id.toUpperCase() === targetToken
      );

      if (!matched) {
        setIsVerifyingToken(false);
        triggerToast(`Token "${targetToken}" not found or expired on ABDM gateway.`, "error");
        return;
      }

      if (matched.revoked) {
        setIsVerifyingToken(false);
        triggerToast("Access Denied: This selective sharing token has been REVOKED by the patient.", "error");
        return;
      }

      const authorizedRecords = allMedicalRecords.filter((r) =>
        matched.recordIds.includes(r.id)
      );

      setVerifiedTokenData({
        token: matched,
        records: authorizedRecords
      });
      setIsVerifyingToken(false);
      triggerToast(`Cryptographic consent verified! Decrypted ${authorizedRecords.length} records.`, "success");
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* 1. Patient selection queue */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
          <h4 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
            <Stethoscope className="h-4 w-4 text-blue-600" />
            {t.patientQueue || "Active Patient Queue"}
          </h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40 text-[11px] font-bold px-3 py-1.5 rounded-lg hover:bg-blue-100 transition cursor-pointer"
            >
              <QrCode className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>Scan Patient Selective QR</span>
            </button>
            <span className="bg-blue-50 dark:bg-blue-950 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {queue.filter((q) => q.status !== "Completed").length} Waiting
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {queue.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                onSelectPatient(p.id);
                setAiResult(null);
                setDoctorNotes("");
                setVoiceNotes("");
                setIsSynced(false);
                triggerToast(`Opened clinical workspace for ${p.name} (${p.gender}, ${p.age})`, "info");
              }}
              className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                activePatient?.id === p.id
                  ? "bg-blue-50/50 border-blue-400 dark:bg-blue-950/20 dark:border-blue-900"
                  : p.status === "Completed"
                  ? "bg-slate-50 border-slate-150 opacity-60 dark:bg-slate-950"
                  : "bg-slate-50 border-slate-150 hover:bg-slate-100/50 dark:bg-slate-950 dark:border-slate-800"
              }`}
            >
              <div>
                <div className="flex justify-between items-start">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 font-sans">{p.name}</p>
                  <span className="text-[9px] font-mono font-bold text-slate-400">ABHA Linked</span>
                </div>
                <p className="text-[10px] text-slate-500 font-sans mt-0.5">{p.gender}, {p.age} yrs • ID: {p.abhaId}</p>
              </div>

              <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-150 dark:border-slate-800/50">
                <span className="text-[9px] text-slate-400 font-mono">{p.time}</span>
                <span
                  className={`text-[9px] font-sans font-bold px-2 py-0.5 rounded ${
                    p.status === "Waiting"
                      ? "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400"
                      : p.status === "In Consultation"
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950"
                      : "bg-green-50 text-green-600 dark:bg-green-950"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Workstation area */}
      {activePatient ? (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[9px] text-blue-600 font-sans font-bold uppercase tracking-wider">Active Workspace</span>
              <h4 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm">
                Consultation: {activePatient.name} (ABHA: {activePatient.abhaId})
              </h4>
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-950 text-green-600 text-[10px] p-1 px-2.5 rounded-full font-bold">
              <Check className="h-3 w-3" /> Health Records Shared Securely
            </div>
          </div>

          {/* Patient Symptoms */}
          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-150 dark:border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider mb-1 font-sans">Patient Reported Symptoms:</span>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-sans">{activePatient.symptoms || "None reported."}</p>
          </div>

          {/* Quick Doctor Input fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Clinical Notes (Manual):</label>
              <textarea
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="Type physical examinations, pulse rate, BP values..."
                rows={3}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Voice Dictation Notes:</label>
                <div className="flex gap-1">
                  {dictationTemplates.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => handleSimulateDictation(textTextFilter(t.text))}
                      className="text-[9px] bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 p-1 px-1.5 rounded transition font-sans"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={voiceNotes}
                  onChange={(e) => setVoiceNotes(e.target.value)}
                  placeholder="Click templates to simulate AI voice transcription, or type..."
                  rows={3}
                  className="w-full p-2.5 pr-8 bg-slate-50 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 font-sans italic text-slate-600 dark:text-slate-400"
                />
                <button
                  onClick={() => {
                    const nextDictating = !isDictating;
                    setIsDictating(nextDictating);
                    if (nextDictating) {
                      triggerToast("Microphone active. Simulating clinical speech-to-text...", "info");
                    } else {
                      triggerToast("Microphone deactivated.", "info");
                    }
                  }}
                  className={`absolute right-2.5 bottom-3 p-1.5 rounded-full cursor-pointer ${
                    isDictating ? "bg-rose-500 text-white animate-pulse" : "bg-slate-200 dark:bg-slate-800 text-slate-500 hover:bg-slate-300 dark:hover:bg-slate-750"
                  }`}
                  title="Simulate Microphone Dictation"
                >
                  <Mic className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex justify-end gap-2 border-t border-slate-50 dark:border-slate-850 pt-3">
            <button
              onClick={handleGenerateAISummary}
              disabled={isGeneratingAI || (!doctorNotes.trim() && !voiceNotes.trim())}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 disabled:opacity-40 hover:from-blue-700 hover:to-indigo-700 text-white text-xs px-4 py-2 rounded-xl shadow font-semibold transition"
            >
              {isGeneratingAI ? "AI Formatting..." : "Generate Digital Prescription (AI)"}
              <Sparkles className="h-4 w-4" />
            </button>
          </div>

          {errorText && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950 text-rose-600 text-xs rounded-xl border border-rose-100 dark:border-rose-900">
              {errorText}
            </div>
          )}

          {/* AI Result Container */}
          {aiResult && (
            <div className="bg-blue-50/20 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900 rounded-2xl p-4 mt-4 space-y-4 animate-fade-in">
              <div className="flex justify-between items-center border-b border-blue-50 dark:border-blue-900/50 pb-2.5">
                <span className="text-xs font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5 font-sans">
                  <Sparkles className="h-4 w-4 text-amber-500" /> Clinical Decision Support Summary
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded font-sans uppercase">
                  Verified diagnosis: {aiResult.diagnosis || "Viral Fever"}
                </span>
              </div>

              <div className="space-y-3">
                {/* Clinical summary */}
                <div>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 font-sans">Clinical Assessment:</p>
                  <p className="text-xs text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed font-sans">{aiResult.summary}</p>
                </div>

                {/* Simulated Digital Prescription */}
                {aiResult.digitalPrescription && (
                  <div className="bg-white dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 shadow-xs">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 font-sans border-b border-slate-50 pb-1 flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5 text-blue-600" /> Digital Rx (Medicines prescribed)
                    </p>

                    <div className="space-y-2.5 mt-2">
                      {aiResult.digitalPrescription.medicines?.map((m: any, i: number) => (
                        <div key={i} className="flex justify-between text-xs font-sans border-b border-slate-50 dark:border-slate-900/50 pb-1.5">
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{m.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono block">{m.frequency} • {m.duration}</span>
                          </div>
                          <span className="text-[11px] text-slate-600 dark:text-slate-400">{m.dosage}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tests & General advice */}
                    {aiResult.digitalPrescription.tests && aiResult.digitalPrescription.tests.length > 0 && (
                      <div className="mt-3">
                        <p className="text-[10px] font-bold text-slate-500 font-sans uppercase">Suggested Diagnostic Tests:</p>
                        <p className="text-xs text-blue-600 font-sans mt-0.5">{aiResult.digitalPrescription.tests.join(", ")}</p>
                      </div>
                    )}

                    {aiResult.digitalPrescription.advice && (
                      <div className="mt-2.5 border-t border-slate-50 pt-2 text-[11px] text-slate-500 italic font-sans">
                        Advice: {aiResult.digitalPrescription.advice}
                      </div>
                    )}
                  </div>
                )}

                {/* ABHA Timeline Sync preview */}
                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-xl p-3 text-xs">
                  <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold block mb-0.5 uppercase tracking-wide font-sans">
                    ABHA timeline layperson update:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 font-sans italic">
                    "{aiResult.abdmTimelineUpdate || 'Consulted Dr. Alok Sharma. Prescribed medicines for cough & bronchitis relief.'}"
                  </p>
                </div>
              </div>

              {/* Instant ABHA update trigger */}
              <div className="flex justify-end pt-2 border-t border-blue-50 dark:border-blue-900/50">
                <button
                  onClick={handleSyncToABHA}
                  disabled={isSynced}
                  className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl shadow font-semibold transition ${
                    isSynced
                      ? "bg-green-600 text-white cursor-default"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  }`}
                >
                  {isSynced ? "Synced with ABHA ID ✓" : "Instantly Sync with patient ABHA Timeline"}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-950 p-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-500">
          <Stethoscope className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-sans">Please select a patient from the queue above to open the ABDM clinical desk workstation.</p>
        </div>
      )}

      {/* Doctor Selective Share QR & Token Intake Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 bg-blue-100 dark:bg-blue-950/60 text-blue-600 rounded-xl flex items-center justify-center">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Selective Health Record QR Intake
                  </h3>
                  <p className="text-xs text-slate-500">
                    ABDM Consent Manager HIE-CM Clinician Gateway
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsQrModalOpen(false);
                  setVerifiedTokenData(null);
                  setTokenInput("");
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Demo Tokens to Try */}
            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-600 dark:text-slate-400">Quick Test Active Tokens:</span>
                <span className="text-[10px] text-blue-600 font-mono">Simulated Tokens</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sharedTokens.slice(0, 4).map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setTokenInput(st.token);
                      handleVerifyToken(st.token);
                    }}
                    className={`p-2.5 rounded-lg border text-left transition flex items-center justify-between text-xs cursor-pointer ${
                      st.revoked
                        ? "bg-rose-50/50 border-rose-200 opacity-60 text-rose-800"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <div>
                      <p className="font-mono font-bold text-blue-600 dark:text-blue-400">{st.token}</p>
                      <p className="text-[10px] text-slate-500 font-sans truncate">{st.diseaseCategory} • {st.recipientName}</p>
                    </div>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                      {st.revoked ? "Revoked" : st.expiryDurationLabel}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Token Verification Form */}
            <div className="flex gap-2">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                placeholder="Enter 8-digit ABDM Token (e.g. ABDM-DB71)"
                className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono uppercase tracking-wider focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => handleVerifyToken()}
                disabled={isVerifyingToken || !tokenInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
              >
                {isVerifyingToken ? "Verifying..." : "Verify & Decrypt"}
              </button>
            </div>

            {/* Verified Selective Health Records Viewer */}
            {verifiedTokenData && (
              <div className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Shield className="h-3 w-3" /> ABDM Consent Verified • Active
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                      Category: {verifiedTokenData.token.diseaseCategory}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Authorized Purpose: <span className="font-semibold">{verifiedTokenData.token.purpose}</span> • Recipient: {verifiedTokenData.token.recipientName}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded">
                    Expires: {verifiedTokenData.token.expiryDurationLabel}
                  </span>
                </div>

                {/* Privacy Boundary Banner */}
                <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 rounded-lg p-2.5 text-[11px] text-blue-800 dark:text-blue-300 flex items-start gap-2">
                  <Lock className="h-3.5 w-3.5 mt-0.5 shrink-0 text-blue-600" />
                  <p>
                    <strong>Selective Disclosure Guarantee:</strong> Only {verifiedTokenData.records.length} records matching "{verifiedTokenData.token.diseaseCategory}" are accessible. The patient's remaining personal health locker records remain encrypted and inaccessible.
                  </p>
                </div>

                {/* Render Decrypted Records */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Decrypted Health Documents ({verifiedTokenData.records.length}):
                  </span>
                  {verifiedTokenData.records.map((rec) => (
                    <div
                      key={rec.id}
                      className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-100">{rec.title}</p>
                          <p className="text-[10px] text-slate-400">{rec.institution} • {rec.doctorName}</p>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{rec.date}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] bg-slate-50 dark:bg-slate-950 p-2 rounded">
                        {rec.summary}
                      </p>
                      {rec.findings && rec.findings.length > 0 && (
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          {rec.findings.map((f, i) => (
                            <div key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 p-1.5 rounded flex justify-between">
                              <span className="text-slate-500 font-sans">{f.finding}:</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{f.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Import to Doctor notes action */}
                <div className="flex justify-end gap-2 pt-2 border-t border-emerald-200 dark:border-emerald-900/60">
                  <button
                    onClick={() => {
                      const recordsSummary = verifiedTokenData.records
                        .map((r) => `[${r.date}] ${r.title}: ${r.summary}`)
                        .join("\n");
                      setDoctorNotes((prev) => (prev ? `${prev}\n\n${recordsSummary}` : recordsSummary));
                      setIsQrModalOpen(false);
                      triggerToast("Imported selective records into clinical notes workspace!", "success");
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Import Records into Clinical Workspace
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  function textTextFilter(t: string): string {
    return t;
  }
}
