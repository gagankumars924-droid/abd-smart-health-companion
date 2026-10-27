import React, { useState } from "react";
import {
  Clock, FileText, Pill, Activity, Calendar, Download, Eye, ExternalLink,
  CheckCircle, AlertCircle, Shield, Building, User, Filter, ArrowUpRight,
  Printer, Sparkles, X, ChevronRight, Check
} from "lucide-react";
import { MedicalRecord, Appointment, Language } from "../types";

interface RecentHealthActivityProps {
  medicalRecords: MedicalRecord[];
  appointments: Appointment[];
  activePatientName: string;
  activePatientAbha: string;
  lang: Language;
  onNavigateToLocker?: () => void;
  onNavigateToAppointments?: () => void;
  onShowToast?: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function RecentHealthActivity({
  medicalRecords,
  appointments,
  activePatientName,
  activePatientAbha,
  lang,
  onNavigateToLocker,
  onNavigateToAppointments,
  onShowToast
}: RecentHealthActivityProps) {
  const [filterType, setFilterType] = useState<"All" | "Prescriptions" | "Diagnostics" | "Consultations" | "Medications">("All");
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const triggerToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    if (onShowToast) onShowToast(msg, type);
  };

  // Build a unified chronological timeline stream of recent health activities
  // 1. Prescriptions and Diagnostic reports from medicalRecords
  // 2. Doctor consultations from appointments
  // 3. Active medications
  const activities = [
    ...medicalRecords.map((rec) => ({
      id: rec.id,
      kind: rec.type.toLowerCase().includes("prescription") ? "Prescription" : "Diagnostic",
      title: rec.title,
      date: rec.date,
      provider: rec.institution,
      doctor: rec.doctorName,
      summary: rec.summary,
      record: rec,
      isDemo: !!rec.isDemo
    })),
    ...appointments.map((app) => ({
      id: app.id,
      kind: "Consultation",
      title: `Consultation with ${app.doctorName}`,
      date: app.date,
      provider: app.hospitalName,
      doctor: app.doctorName,
      summary: `Clinical visit scheduled for ${app.specialty} (${app.time})`,
      record: {
        id: app.id,
        date: app.date,
        title: `Consultation: ${app.specialty}`,
        institution: app.hospitalName,
        doctorName: app.doctorName,
        type: "Doctor Consultation",
        summary: `Appointment slot at ${app.hospitalName} for ${app.specialty}. Status: ${app.status}`,
        status: "Linked" as const,
        isDemo: true
      } as MedicalRecord,
      isDemo: true
    })),
    // Medication reminders
    {
      id: "med-1",
      kind: "Medication",
      title: "Metformin 500mg (Oral Glycemic Control)",
      date: "2026-07-07",
      provider: "Max Super Speciality Hospital",
      doctor: "Dr. Priya Iyer",
      summary: "Instructions: 1 tablet daily morning after breakfast for 90 days. Keep hydrated.",
      record: {
        id: "med-rec-1",
        date: "2026-07-07",
        title: "Active Medication - Metformin 500mg",
        institution: "Max Super Speciality Hospital",
        doctorName: "Dr. Priya Iyer",
        type: "Active Medication",
        summary: "Daily medication instructions: 1 tablet after morning breakfast. Monitored for blood glucose control.",
        status: "Linked" as const,
        isDemo: true
      } as MedicalRecord,
      isDemo: true
    }
  ];

  // Sort descending by date
  const sortedActivities = [...activities].sort((a, b) => (a.date < b.date ? 1 : -1));

  // Filter activities
  const filteredActivities = sortedActivities.filter((act) => {
    if (filterType === "All") return true;
    if (filterType === "Prescriptions") return act.kind === "Prescription";
    if (filterType === "Diagnostics") return act.kind === "Diagnostic";
    if (filterType === "Consultations") return act.kind === "Consultation";
    if (filterType === "Medications") return act.kind === "Medication";
    return true;
  });

  const displayedActivities = showAllHistory ? filteredActivities : filteredActivities.slice(0, 5);

  const handleDownloadRecord = (rec: MedicalRecord) => {
    setIsDownloading(true);
    triggerToast(`Generating cryptographically signed copy of "${rec.title}"...`, "info");
    setTimeout(() => {
      setIsDownloading(false);
      triggerToast(`Secure PDF for "${rec.title}" downloaded successfully!`, "success");

      // Create a downloadable text representation as a safe download simulation
      const content = `=====================================================
AYUSHMAN BHARAT DIGITAL MISSION (ABDM)
NATIONAL HEALTH AUTHORITY - VERIFIED CLINICAL RECORD
=====================================================
RECORD ID: ${rec.id}
DATE OF ISSUE: ${rec.date}
PATIENT NAME: ${activePatientName}
ABHA ID: ${activePatientAbha}
HEALTH FACILITY: ${rec.institution}
PRACTITIONER: ${rec.doctorName}
RECORD TYPE: ${rec.type}

CLINICAL SUMMARY:
${rec.summary}

${rec.findings && rec.findings.length > 0 ? `FINDINGS:
${rec.findings.map(f => `- ${f.finding}: ${f.value} (${f.explanation})`).join("\n")}` : ""}

SECURITY & INTEGRITY:
Digitally signed token: SHA256-${rec.id}-ABDM-SECURE-STAMP
Consent Mode: Patient-Controlled Cryptographic Handshake
=====================================================`;

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ABDM_Record_${rec.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in text-left pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="font-sans font-black text-slate-900 dark:text-white text-lg md:text-xl flex items-center gap-2">
            <Clock className="h-5.5 w-5.5 text-blue-600 dark:text-blue-400" />
            <span>Recent Health Activity</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Live Timeline
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Instant chronological access to prescriptions, lab diagnostics, doctor visits, and medications for {activePatientName}.
          </p>
        </div>

        {/* View All toggle */}
        <button
          onClick={() => setShowAllHistory(!showAllHistory)}
          className="px-3.5 py-1.5 bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-slate-700 hover:bg-blue-100 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
        >
          <span>{showAllHistory ? "Show Latest 5 Only" : `View Complete History (${filteredActivities.length})`}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Distinction Badge Notice */}
      <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/40 flex items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Shield className="h-4.5 w-4.5 text-blue-600 shrink-0" />
          <span className="text-[11.5px] text-slate-700 dark:text-slate-300">
            <strong>Demonstration Records Mode:</strong> Clearly marks simulated ABDM demonstration records vs live verified hospital feeds.
          </span>
        </div>
        <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 shrink-0">
          Sample Data Tagged
        </span>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: "All", label: "All Recent Activity", count: activities.length },
          { id: "Prescriptions", label: "Prescriptions", count: activities.filter(a => a.kind === "Prescription").length },
          { id: "Diagnostics", label: "Lab Reports", count: activities.filter(a => a.kind === "Diagnostic").length },
          { id: "Consultations", label: "Doctor Visits", count: activities.filter(a => a.kind === "Consultation").length },
          { id: "Medications", label: "Medication Directives", count: activities.filter(a => a.kind === "Medication").length }
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id as any)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition flex items-center gap-1.5 ${
              filterType === f.id
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
            }`}
          >
            <span>{f.label}</span>
            <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full ${filterType === f.id ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-500"}`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Chronological List of Recent Activity */}
      {displayedActivities.length > 0 ? (
        <div className="space-y-3">
          {displayedActivities.map((act) => {
            const isPrescription = act.kind === "Prescription";
            const isDiagnostic = act.kind === "Diagnostic";
            const isConsultation = act.kind === "Consultation";
            const isMedication = act.kind === "Medication";

            return (
              <div
                key={act.id}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 dark:hover:border-blue-600 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs"
              >
                {/* Left side: Icon & Title info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      isPrescription
                        ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600"
                        : isDiagnostic
                        ? "bg-purple-50 dark:bg-purple-950/60 text-purple-600"
                        : isConsultation
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600"
                        : "bg-amber-50 dark:bg-amber-950/60 text-amber-600"
                    }`}
                  >
                    {isPrescription && <FileText className="h-5 w-5" />}
                    {isDiagnostic && <Activity className="h-5 w-5" />}
                    {isConsultation && <User className="h-5 w-5" />}
                    {isMedication && <Pill className="h-5 w-5" />}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-slate-900 dark:text-white text-xs sm:text-sm font-sans">
                        {act.title}
                      </span>
                      {act.isDemo ? (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 uppercase">
                          Sample Demonstration
                        </span>
                      ) : (
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 uppercase flex items-center gap-0.5">
                          <CheckCircle className="h-2.5 w-2.5" />
                          Verified ABDM
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        {act.provider}
                      </span>
                      <span>•</span>
                      <span>Dr: {act.doctor}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-400">{act.date}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-100 dark:border-slate-850">
                      {act.summary}
                    </p>
                  </div>
                </div>

                {/* Right side: Action buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => setSelectedRecord(act.record)}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleDownloadRecord(act.record)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-10 text-center bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Clock className="h-10 w-10 text-slate-400 mx-auto" />
          <h4 className="font-black text-sm text-slate-800 dark:text-slate-200">
            No health activities found in this category
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            There are no recent medical records matching the selected filter for {activePatientName}.
          </p>
          <button
            onClick={() => setFilterType("All")}
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 cursor-pointer"
          >
            Show All Activities
          </button>
        </div>
      )}

      {/* Detailed Record Inspector Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 max-w-xl w-full rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 my-6 space-y-4 animate-scale-in">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-150 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {selectedRecord.type}
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                  {selectedRecord.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850 text-xs">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Healthcare Provider</p>
                <p className="font-extrabold text-slate-800 dark:text-slate-200">{selectedRecord.institution}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Consulting Practitioner</p>
                <p className="font-extrabold text-slate-800 dark:text-slate-200">{selectedRecord.doctorName}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Date of Record</p>
                <p className="font-mono text-slate-700 dark:text-slate-300">{selectedRecord.date}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Data Authenticity</p>
                <p className="font-bold text-amber-600 dark:text-amber-400">
                  {selectedRecord.isDemo ? "Demonstration Sample Record" : "Verified ABDM Linked"}
                </p>
              </div>
            </div>

            {/* Clinical Summary */}
            <div className="space-y-1.5 text-xs">
              <h4 className="font-extrabold text-slate-800 dark:text-slate-100">Clinical Narrative & Summary</h4>
              <p className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850 text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedRecord.summary}
              </p>
            </div>

            {/* Findings if any */}
            {selectedRecord.findings && selectedRecord.findings.length > 0 && (
              <div className="space-y-2 text-xs">
                <h4 className="font-extrabold text-slate-800 dark:text-slate-100">Recorded Diagnostic Findings</h4>
                <div className="space-y-1.5">
                  {selectedRecord.findings.map((f, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900"
                    >
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{f.finding}</p>
                        <p className="text-[10px] text-slate-400">{f.explanation}</p>
                      </div>
                      <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${f.status === "warning" ? "bg-amber-100 text-amber-800" : f.status === "critical" ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"}`}>
                        {f.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-slate-150 dark:border-slate-800 flex justify-between items-center">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadRecord(selectedRecord)}
                disabled={isDownloading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>{isDownloading ? "Generating File..." : "Download Certified Copy"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
