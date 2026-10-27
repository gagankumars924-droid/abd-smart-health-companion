import React, { useState } from "react";
import {
  Users, UserPlus, Shield, Lock, FileText, Pill, Calendar, Trash2,
  CheckCircle, AlertCircle, Eye, ArrowRight, UserCheck, Heart, User,
  Activity, Sparkles, RefreshCw
} from "lucide-react";
import { FamilyMemberProfile, MedicalRecord, Language } from "../types";

interface FamilyHealthManagerProps {
  familyProfiles: FamilyMemberProfile[];
  activeProfileId: string;
  onSelectActiveProfile: (id: string) => void;
  onUpdateFamilyProfiles: (profiles: FamilyMemberProfile[]) => void;
  lang: Language;
  onShowToast?: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function FamilyHealthManager({
  familyProfiles,
  activeProfileId,
  onSelectActiveProfile,
  onUpdateFamilyProfiles,
  lang,
  onShowToast
}: FamilyHealthManagerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingMemberDetails, setViewingMemberDetails] = useState<FamilyMemberProfile | null>(null);

  // New Member Form
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<FamilyMemberProfile["relationship"]>("Mother");
  const [age, setAge] = useState<string>("50");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Female");
  const [abhaId, setAbhaId] = useState("");
  const [isDependent, setIsDependent] = useState(false);
  const [hasGuardianConsent, setHasGuardianConsent] = useState(false);

  const triggerToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    if (onShowToast) onShowToast(msg, type);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (!hasGuardianConsent) {
      triggerToast("Please confirm authorization consent for this household member.", "error");
      return;
    }

    const initials = name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const consentStatus = isDependent ? "GuardianConsent" : "Authorized";

    const newProfile: FamilyMemberProfile = {
      id: `fam-${Date.now()}`,
      name: name.trim(),
      relationship: relationship,
      age: parseInt(age) || 30,
      gender: gender,
      abhaId: abhaId.trim() || undefined,
      isDependent: isDependent,
      consentStatus: consentStatus,
      avatarInitials: initials || "FM",
      records: [
        {
          id: `rec-demo-${Date.now()}`,
          date: new Date().toISOString().split("T")[0],
          title: `Initial Health Intake - ${relationship}`,
          institution: "District Civil Hospital & Sub-Center",
          doctorName: "Dr. Alok Sharma",
          type: "Health Summary",
          category: "General",
          summary: `Demonstration baseline health record created for ${name}. Real ABHA records require cryptographic OTP consent handshake.`,
          status: "Local",
          isDemo: true
        }
      ],
      appointments: [],
      medications: []
    };

    onUpdateFamilyProfiles([...familyProfiles, newProfile]);
    setIsAddModalOpen(false);
    setName("");
    setAbhaId("");
    setHasGuardianConsent(false);
    triggerToast(`Added family profile for ${name}! Records are strictly segregated.`, "success");
  };

  const handleRemoveMember = (id: string, memberName: string) => {
    if (id === "fam-self") {
      triggerToast("Cannot remove the primary account holder.", "error");
      return;
    }
    const updated = familyProfiles.filter((f) => f.id !== id);
    onUpdateFamilyProfiles(updated);
    if (activeProfileId === id) {
      onSelectActiveProfile("fam-self");
    }
    triggerToast(`Family profile for ${memberName} removed from dashboard.`, "info");
  };

  const currentActiveProfile = familyProfiles.find((f) => f.id === activeProfileId) || familyProfiles[0];

  return (
    <div className="space-y-6 animate-fade-in text-left pb-16">
      {/* Title & Add Member Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="font-sans font-black text-slate-900 dark:text-white text-lg md:text-xl flex items-center gap-2">
            <Users className="h-5.5 w-5.5 text-blue-600 dark:text-blue-400" />
            <span>Family Health & Dependent Profiles</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              Segregated Locker Architecture
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize health accounts for parents, spouses, and children while preserving strict privacy and consent isolation.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 sm:mt-0" />
          <div className="space-y-0.5">
            <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-xs">
              ABDM Family Privacy Architecture
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Adding a family member maintains completely separate health records. Adult records require distinct consent, and children are secured under guardian authorization.
            </p>
          </div>
        </div>
        <span className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 shrink-0">
          Zero Record Mixing
        </span>
      </div>

      {/* Family Profile Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {familyProfiles.map((fam) => {
          const isActive = fam.id === activeProfileId;
          const isSelf = fam.relationship === "Self" as any;

          return (
            <div
              key={fam.id}
              className={`p-5 rounded-2xl border transition flex flex-col justify-between text-xs relative ${
                isActive
                  ? "bg-blue-50/60 dark:bg-blue-950/40 border-blue-600 shadow-md ring-2 ring-blue-500/20"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300"
              }`}
            >
              <div className="space-y-3">
                {/* Avatar and Details */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-11 w-11 rounded-2xl font-black text-sm flex items-center justify-center shrink-0 ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {fam.avatarInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-sans font-black text-sm text-slate-900 dark:text-white">
                          {fam.name}
                        </h3>
                        {isSelf && (
                          <span className="text-[8px] font-bold uppercase px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {fam.relationship} • {fam.gender}, {fam.age} yrs
                      </p>
                    </div>
                  </div>

                  {!isSelf && (
                    <button
                      onClick={() => handleRemoveMember(fam.id, fam.name)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded transition cursor-pointer"
                      title="Remove Member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Consent Status Badge */}
                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850 text-[10.5px]">
                  <span className="text-slate-500 font-medium">Authorization Status:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <UserCheck className="h-3 w-3" />
                    {fam.consentStatus === "GuardianConsent" ? "Guardian Authorized" : "Consent Granted"}
                  </span>
                </div>

                {/* ABHA details */}
                <div className="text-[10px] text-slate-400 font-mono">
                  ABHA: {fam.abhaId || "Sample Account (Demo Mode)"}
                </div>

                {/* Quick record stats */}
                <div className="grid grid-cols-2 gap-2 text-center pt-1 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850">
                    <span className="font-black text-slate-800 dark:text-slate-200 block text-xs">
                      {fam.records.length}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase font-medium">Records</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850">
                    <span className="font-black text-slate-800 dark:text-slate-200 block text-xs">
                      {fam.medications?.length || 0}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase font-medium">Prescriptions</span>
                  </div>
                </div>
              </div>

              {/* Action: Switch to Dashboard or View */}
              <div className="mt-4 pt-3 border-t border-slate-150 dark:border-slate-800 flex gap-2">
                <button
                  onClick={() => {
                    onSelectActiveProfile(fam.id);
                    triggerToast(`Switched active dashboard to ${fam.name}'s records!`, "success");
                  }}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{isActive ? "Active Dashboard" : "Switch to Dashboard"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Currently Active Profile's Isolated Records Viewer */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-150 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Isolated Health Profile
            </span>
            <h3 className="font-black text-base text-slate-900 dark:text-white mt-0.5 flex items-center gap-2">
              <span>{currentActiveProfile.name}'s Health Activity & Records</span>
              <span className="text-[10px] font-medium text-slate-400">
                ({currentActiveProfile.relationship})
              </span>
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Records isolated from other household members
          </span>
        </div>

        {/* Member's Active Prescriptions & Medications */}
        {currentActiveProfile.medications && currentActiveProfile.medications.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Pill className="h-3.5 w-3.5 text-blue-600" />
              <span>Current Medications ({currentActiveProfile.medications.length})</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentActiveProfile.medications.map((med, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs"
                >
                  <div>
                    <p className="font-black text-slate-800 dark:text-slate-200">{med.name}</p>
                    <p className="text-[10.5px] text-slate-500 mt-0.5">
                      Dosage: {med.dosage} • {med.frequency}
                    </p>
                  </div>
                  <span className="text-[8.5px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Member's Medical Records */}
        <div className="space-y-2 pt-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-blue-600" />
            <span>Health Records & Consultations ({currentActiveProfile.records.length})</span>
          </p>
          <div className="space-y-2.5">
            {currentActiveProfile.records.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                      {rec.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {rec.institution} • {rec.date} • Dr. {rec.doctorName}
                    </p>
                  </div>
                  <span className="text-[8px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {rec.type}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-150 dark:border-slate-850 mt-2">
                  {rec.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Family Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 my-6 space-y-4 animate-scale-in text-left">
            <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800 pb-3">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-600" />
                <span>Add Family Member</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  Full Display Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kalia"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">
                    Relationship *
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => {
                      const rel = e.target.value as any;
                      setRelationship(rel);
                      if (rel === "Son" || rel === "Daughter") {
                        setIsDependent(true);
                      }
                    }}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Dependent">Other Dependent</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Age</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">
                    ABHA Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="91-xxxx-xxxx-xxxx"
                    value={abhaId}
                    onChange={(e) => setAbhaId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Dependent checkbox */}
              <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <input
                  type="checkbox"
                  id="depCheck"
                  checked={isDependent}
                  onChange={(e) => setIsDependent(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="depCheck" className="text-[11px] text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                  This person is a minor child or dependent under my legal guardianship.
                </label>
              </div>

              {/* Consent checkbox */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 flex items-start gap-2">
                <input
                  type="checkbox"
                  id="famConsentCheck"
                  checked={hasGuardianConsent}
                  onChange={(e) => setHasGuardianConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="famConsentCheck" className="text-[11px] text-amber-950 dark:text-amber-200 leading-snug cursor-pointer">
                  <strong>Consent & Authorization:</strong> I certify that I have legal guardian authority (for minors) or express authorization from this family member to manage their healthcare profile on this device.
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-150 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!hasGuardianConsent}
                  className={`px-4 py-2 font-bold rounded-xl text-xs transition cursor-pointer ${
                    hasGuardianConsent
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Create Family Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
