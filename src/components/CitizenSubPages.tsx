import React, { useState } from "react";
import {
  ArrowLeft, CreditCard, Shield, QrCode, Heart, PlusCircle, Trash2, MapPin,
  CheckCircle, AlertTriangle, Sparkles, Award, PhoneCall, Calendar, Pill,
  Thermometer, Download, Info, Check, Activity, Search
} from "lucide-react";
import { ABHAMetadata, MedicalRecord, Appointment, Challenge } from "../types";

// ==========================================
// 1. PM-JAY UNIVERSAL INSURANCE GATEWAY
// ==========================================
interface PMJAYPortalProps {
  abhaMetadata: ABHAMetadata;
  pmjayClaims: any[];
  preAuthRequests: any[];
  preAuthForm: any;
  setPreAuthForm: React.Dispatch<React.SetStateAction<any>>;
  onAddPreAuth: (e: React.FormEvent) => void;
  preAuthSuccess: string | null;
  eVouchers: any[];
  onGenerateVoucher: (type: string) => void;
  newVoucherSuccess: string | null;
  onBack: () => void;
}

export function PMJAYPortal({
  abhaMetadata,
  pmjayClaims,
  preAuthRequests,
  preAuthForm,
  setPreAuthForm,
  onAddPreAuth,
  preAuthSuccess,
  eVouchers,
  onGenerateVoucher,
  newVoucherSuccess,
  onBack
}: PMJAYPortalProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="space-y-4 animate-fade-in text-left pb-16">
      {/* Action Bar */}
      <div className="flex items-center gap-2 mb-2">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <ArrowLeft className="h-5 w-5 text-slate-800 dark:text-slate-100" />
        </button>
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-sans">PM-JAY Golden Portal</h3>
      </div>

      {/* Interactive Golden Card */}
      <div className="perspective-1000 cursor-pointer" onClick={() => setFlipped(!flipped)}>
        <div className={`relative w-full h-52 transition-transform duration-700 transform-style-3d ${flipped ? "rotate-y-180" : ""}`}>
          
          {/* Front Face */}
          <div className="absolute inset-0 w-full h-full rounded-2xl p-4 bg-gradient-to-br from-amber-500 via-yellow-600 to-amber-700 text-white shadow-xl flex flex-col justify-between backface-hidden border-2 border-amber-300">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-1.5">
                <div className="h-7 w-7 bg-white rounded-full p-0.5 flex items-center justify-center">
                  <span className="text-[10px] font-black text-amber-600">NHA</span>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold leading-none tracking-tight">Ayushman Bharat</h4>
                  <p className="text-[7.5px] text-amber-100 font-medium uppercase leading-none mt-0.5">National Health Authority</p>
                </div>
              </div>
              <span className="bg-amber-400/30 border border-amber-300/40 text-amber-50 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest font-sans">
                GOLDEN CARD
              </span>
            </div>

            <div className="space-y-1 mt-2">
              <p className="text-[8px] text-amber-100 tracking-wider uppercase">Scheme Beneficiary</p>
              <h3 className="text-sm font-black tracking-wide font-sans">{abhaMetadata.name}</h3>
              <div className="grid grid-cols-2 gap-2 text-[9px] mt-1">
                <div>
                  <p className="text-[7px] text-amber-100 uppercase">ABHA ID</p>
                  <p className="font-mono font-bold">{abhaMetadata.abhaId}</p>
                </div>
                <div>
                  <p className="text-[7px] text-amber-100 uppercase">PM-JAY No.</p>
                  <p className="font-mono font-bold">PMJAY-902-184-750</p>
                </div>
              </div>
            </div>

            <div className="border-t border-amber-400/30 pt-1.5 flex justify-between items-center text-[8.5px] text-amber-100 font-sans">
              <span className="flex items-center gap-1 font-bold">
                <Shield className="h-3 w-3 text-emerald-400" /> ₹5,00,000 Cashless Cover Active
              </span>
              <span className="animate-pulse">Click to flip ↺</span>
            </div>
          </div>

          {/* Back Face */}
          <div className="absolute inset-0 w-full h-full rounded-2xl p-4 bg-slate-900 text-white shadow-xl flex flex-col justify-between rotate-y-180 backface-hidden border-2 border-amber-500">
            <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
              <span className="text-[8px] text-amber-400 font-bold uppercase tracking-widest">Verification & Family Details</span>
              <QrCode className="h-5 w-5 text-amber-500" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-[9px] py-1">
              <div className="space-y-1">
                <p className="text-slate-400 text-[7px] uppercase">Linked Household Members</p>
                <ul className="text-[8.5px] space-y-0.5 text-slate-200">
                  <li>• Sunita Sharma (Mother)</li>
                  <li>• Rohan Sharma (Son)</li>
                </ul>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-slate-400 text-[7px] uppercase">State Authority</p>
                <p className="font-bold text-slate-100 text-[8.5px]">NHA Government of India</p>
                <p className="text-[7.5px] text-slate-400">Issued: Aug 2024</p>
              </div>
            </div>

            <div className="bg-slate-950 p-1.5 rounded-lg flex items-center gap-2 border border-slate-800">
              <div className="h-6 w-6 bg-amber-500 text-white rounded-md flex items-center justify-center text-xs font-bold font-mono">
                QR
              </div>
              <p className="text-[8px] text-slate-400 leading-tight">Scan QR at any Empanelled PM-JAY hospital kiosk to instantly trigger paperless cashless admissions.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Cashless Claims Limit Progress Bar */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">Remaining Cashless Limit</span>
          <span className="font-mono font-bold text-emerald-600">₹4,77,500 / ₹5,00,000</span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full" style={{ width: "95.5%" }}></div>
        </div>
      </div>

      {/* E-Vouchers Section */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5 text-xs">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Award className="h-3.5 w-3.5 text-amber-500 animate-pulse" /> PM-JAY Preventive E-Vouchers
        </p>
        <p className="text-[10px] text-slate-500 leading-snug">Generate NHA funded digital health vouchers for free health screening diagnostics at private empanelled labs.</p>

        {newVoucherSuccess && (
          <div className="p-2 bg-emerald-50 text-emerald-700 text-[10px] rounded-lg border border-emerald-100 font-bold animate-pulse">
            {newVoucherSuccess}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onGenerateVoucher("Free Diabetes Screening")}
            className="p-2 border border-slate-150 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950 text-left rounded-lg transition"
          >
            <p className="font-bold text-[9px] text-slate-800 dark:text-slate-200">Diabetes Panel</p>
            <p className="text-[8px] text-slate-400 mt-0.5">Click to generate 🎟️</p>
          </button>
          <button
            onClick={() => onGenerateVoucher("Thyroid Profile Subsidy")}
            className="p-2 border border-slate-150 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950 text-left rounded-lg transition"
          >
            <p className="font-bold text-[9px] text-slate-800 dark:text-slate-200">Thyroid Profile</p>
            <p className="text-[8px] text-slate-400 mt-0.5">Click to generate 🎟️</p>
          </button>
        </div>

        {/* List of active generated vouchers */}
        <div className="space-y-1.5 pt-1">
          {eVouchers.map((v) => (
            <div key={v.id} className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg flex justify-between items-center border border-slate-150 dark:border-slate-850 text-[10.5px]">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">{v.type}</p>
                <p className="text-[8.5px] text-slate-400 font-mono mt-0.5">Code: {v.code} • Till {v.validTill}</p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 font-bold text-[8px] px-2 py-0.5 rounded border border-emerald-100">
                ACTIVE
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pre-Authorization Cashless Request Form */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          File Cashless Pre-Authorization
        </p>

        {preAuthSuccess && (
          <div className="p-2 bg-emerald-50 text-emerald-700 text-[10.5px] rounded-lg border border-emerald-100 font-bold">
            {preAuthSuccess}
          </div>
        )}

        <form onSubmit={onAddPreAuth} className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[8.5px] font-bold text-slate-400 uppercase">Hospital</label>
              <select
                value={preAuthForm.hospitalName}
                onChange={(e) => setPreAuthForm({ ...preAuthForm, hospitalName: e.target.value })}
                className="w-full p-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
              >
                <option value="Max Super Speciality Hospital">Max Super Speciality Hospital</option>
                <option value="Saket City Clinic">Saket City Clinic</option>
                <option value="Fortis Healthcare Delhi">Fortis Healthcare Delhi</option>
              </select>
            </div>
            <div>
              <label className="text-[8.5px] font-bold text-slate-400 uppercase">Specialty</label>
              <select
                value={preAuthForm.specialty}
                onChange={(e) => setPreAuthForm({ ...preAuthForm, specialty: e.target.value })}
                className="w-full p-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
              >
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Ophthalmology">Ophthalmology</option>
                <option value="Orthopaedics">Orthopaedics</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[8.5px] font-bold text-slate-400 uppercase">Treatment / Surgery *</label>
            <input
              type="text"
              required
              placeholder="e.g. Gallbladder Stone Removal"
              value={preAuthForm.treatmentName}
              onChange={(e) => setPreAuthForm({ ...preAuthForm, treatmentName: e.target.value })}
              className="w-full p-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[8.5px] font-bold text-slate-400 uppercase">Estimated cost (₹) *</label>
              <input
                type="number"
                required
                placeholder="e.g. 45000"
                value={preAuthForm.estimatedCost}
                onChange={(e) => setPreAuthForm({ ...preAuthForm, estimatedCost: e.target.value })}
                className="w-full p-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px] font-mono"
              />
            </div>
            <div>
              <label className="text-[8.5px] font-bold text-slate-400 uppercase">Clinical Diagnosis</label>
              <input
                type="text"
                placeholder="e.g. Cholelithiasis"
                value={preAuthForm.diagnosis}
                onChange={(e) => setPreAuthForm({ ...preAuthForm, diagnosis: e.target.value })}
                className="w-full p-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] py-1.5 rounded-lg transition"
          >
            Submit Cashless Pre-Auth to NHA
          </button>
        </form>
      </div>

      {/* Claims Disbursement History */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <CreditCard className="h-3.5 w-3.5 text-emerald-500" /> Cashless Claims Settled ({pmjayClaims.length})
        </p>

        <div className="space-y-2">
          {pmjayClaims.map((claim) => (
            <div key={claim.id} className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-150 dark:border-slate-850 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-100 font-sans">{claim.treatment}</p>
                <p className="text-[9px] text-slate-500 font-sans">{claim.hospital} • {claim.date}</p>
                <p className="text-[8.5px] text-slate-400 font-mono mt-0.5">NHA TxID: {claim.id}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 font-mono">₹{claim.amount.toLocaleString()}</span>
                <span className="block text-[8px] text-emerald-600 font-bold bg-green-50 px-1 py-0.5 rounded mt-1 text-center font-sans">
                  {claim.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. EMERGENCY SOS & ABHA MEDICAL CARD
// ==========================================
interface EmergencyCardProps {
  abhaMetadata: ABHAMetadata;
  onBack: () => void;
}

export function EmergencyQRPage({ abhaMetadata, onBack }: EmergencyCardProps) {
  const [dialing, setDialing] = useState<string | null>(null);

  const handleSimulateCall = (num: string, label: string) => {
    setDialing(label);
    setTimeout(() => setDialing(null), 3500);
  };

  return (
    <div className="space-y-4 animate-fade-in text-left pb-16">
      {/* Action Bar */}
      <div className="flex items-center gap-2 mb-2">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <ArrowLeft className="h-5 w-5 text-slate-800 dark:text-slate-100" />
        </button>
        <h3 className="text-base font-extrabold text-rose-600 font-sans flex items-center gap-1.5">
          <Thermometer className="h-5 w-5 animate-pulse text-rose-600" /> Emergency Health Card
        </h3>
      </div>

      {dialing && (
        <div className="p-3 bg-rose-600 text-white rounded-xl text-center space-y-1 animate-bounce">
          <p className="text-xs font-bold font-sans">📞 SIMULATING OUTGOING DIAL...</p>
          <p className="text-sm font-black font-mono">{dialing}</p>
          <p className="text-[9px] text-rose-100 font-sans">Connecting to Ayushman Emergency Dispatcher...</p>
        </div>
      )}

      {/* Primary Emergency Card */}
      <div className="bg-gradient-to-br from-red-600 via-rose-700 to-red-800 text-white p-5 rounded-2xl shadow-xl border-2 border-red-500 space-y-4">
        <div className="flex justify-between items-start border-b border-red-500/30 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-white text-red-600 rounded-full flex items-center justify-center font-black text-xs">
              SOS
            </div>
            <div>
              <h4 className="text-xs font-bold leading-none uppercase font-sans">ABDM Emergency Profile</h4>
              <p className="text-[9px] text-rose-200 mt-1">One-click Paramedic Scanning Locker</p>
            </div>
          </div>
          <span className="bg-red-900/40 text-rose-100 border border-red-400/30 text-[8px] px-2 py-0.5 rounded font-mono">
            BLOOD GROUP: B+
          </span>
        </div>

        <div className="flex gap-4 items-center">
          <div className="p-2 bg-white rounded-xl">
            <QrCode className="h-20 w-20 text-slate-900" />
          </div>
          <div className="space-y-1.5 text-xs">
            <p className="text-[9px] text-rose-200 uppercase">Scheme Holder</p>
            <p className="font-extrabold text-sm font-sans">{abhaMetadata.name}</p>
            <p className="text-[9px] text-rose-200 font-mono">{abhaMetadata.abhaId}</p>
            <div className="bg-red-900/30 p-1.5 rounded text-[10px] text-rose-100 border border-red-500/20">
              🚨 <span className="font-bold">Drug Allergies:</span> Penicillin, Sulfa Drugs
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-red-500/30 text-[10px] text-rose-200 flex justify-between">
          <span>Chronic: Mild Asthma</span>
          <span>Age/Gen: 29/Male</span>
        </div>
      </div>

      {/* Emergency SOS simulation buttons */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          One-Click Smart Dispatchers
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => handleSimulateCall("102", "National Ambulance Association - 102")}
            className="p-3 bg-red-50 dark:bg-red-950/20 hover:bg-red-100/50 border border-red-200 rounded-xl flex items-center gap-2.5 transition text-left text-red-700 dark:text-red-400"
          >
            <PhoneCall className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-bold leading-none">Ambulance</p>
              <p className="text-[9px] text-slate-400 mt-1">Dial 102 (Free)</p>
            </div>
          </button>

          <button
            onClick={() => handleSimulateCall("1800-11-4477", "PM-JAY Cashless Helpdesk")}
            className="p-3 bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100/50 border border-amber-200 rounded-xl flex items-center gap-2.5 transition text-left text-amber-700 dark:text-amber-400"
          >
            <PhoneCall className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-bold leading-none">NHA Helpdesk</p>
              <p className="text-[9px] text-slate-400 mt-1">Cashless Queries</p>
            </div>
          </button>
        </div>
      </div>

      {/* Medical Guidelines for First Responders */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          First Responder Action Policy
        </p>
        <div className="text-[11px] text-slate-500 space-y-2 leading-relaxed">
          <p>
            1. Paramedics can scan the ABHA Emergency QR code even from locked phone screens by triggering the ABDM companion emergency widget.
          </p>
          <p>
            2. Scanning provides read-only instant access to allergies, blood group, chronic conditions, and active PM-JAY policy details without requesting OTP approval.
          </p>
          <p>
            3. Action triggers a secure, logged emergency consent event, which auto-sends location credentials to the linked primary emergency guardian.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. MEDICINE TRACKER & COMPLIANCE
// ==========================================
interface MedicineTrackerProps {
  onBack: () => void;
}

export function MedicineTrackerPage({ onBack }: MedicineTrackerProps) {
  const [meds, setMeds] = useState([
    { id: "med-1", name: "Metformin 500mg", schedule: "Morning, After breakfast", taken: true, points: 10 },
    { id: "med-2", name: "Atorvastatin 10mg", schedule: "Night, After dinner", taken: false, points: 10 },
    { id: "med-3", name: "Multivitamin A-Z", schedule: "Afternoon, With lunch", taken: false, points: 5 }
  ]);
  const [newName, setNewName] = useState("");
  const [newSchedule, setNewSchedule] = useState("Morning, After breakfast");
  const [success, setSuccess] = useState<string | null>(null);

  const handleToggleMed = (id: string) => {
    setMeds(prev => prev.map(m => {
      if (m.id === id) {
        const nextState = !m.taken;
        if (nextState) {
          setSuccess(`Good job! You logged ${m.name} intake. Earned ${m.points} Wellness points.`);
          setTimeout(() => setSuccess(null), 4000);
        }
        return { ...m, taken: nextState };
      }
      return m;
    }));
  };

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newMed = {
      id: `med-${Date.now()}`,
      name: newName,
      schedule: newSchedule,
      taken: false,
      points: 10
    };
    setMeds([...meds, newMed]);
    setNewName("");
    setSuccess(`New medicine "${newMed.name}" added to daily routine.`);
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="space-y-4 animate-fade-in text-left pb-16">
      <div className="flex items-center gap-2 mb-2">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <ArrowLeft className="h-5 w-5 text-slate-800 dark:text-slate-100" />
        </button>
        <h3 className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-sans flex items-center gap-1.5">
          <Pill className="h-5 w-5 text-blue-600" /> Pill & Medicine Tracker
        </h3>
      </div>

      {success && (
        <div className="p-2.5 bg-emerald-50 text-emerald-700 text-[10.5px] rounded-lg border border-emerald-100 font-bold animate-pulse">
          {success}
        </div>
      )}

      {/* Pill Checkbox List */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">Today's Medication Schedule</span>
          <span className="text-[10px] text-slate-400">Mark as taken</span>
        </div>

        <div className="space-y-2">
          {meds.map((med) => (
            <div
              key={med.id}
              onClick={() => handleToggleMed(med.id)}
              className={`p-3 rounded-xl border cursor-pointer transition flex justify-between items-center ${
                med.taken
                  ? "bg-emerald-50/40 border-emerald-200/50 dark:bg-emerald-950/20 dark:border-emerald-900"
                  : "bg-slate-50 border-slate-150 dark:bg-slate-950 dark:border-slate-800"
              }`}
            >
              <div>
                <p className={`text-xs font-bold font-sans ${med.taken ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-200"}`}>
                  {med.name}
                </p>
                <p className="text-[9.5px] text-slate-500 mt-0.5">{med.schedule}</p>
              </div>
              <div className={`h-6 w-6 rounded-full border flex items-center justify-center transition-all ${
                med.taken ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 text-transparent"
              }`}>
                <Check className="h-4 w-4 stroke-[3]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form to add a new medication */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Add New Medicine
        </p>

        <form onSubmit={handleAddMed} className="space-y-2.5 text-xs">
          <div>
            <label className="text-[8.5px] font-bold text-slate-400 uppercase block mb-1">Medicine Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Paracetamol 650mg"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
            />
          </div>

          <div>
            <label className="text-[8.5px] font-bold text-slate-400 uppercase block mb-1">Time & Schedule</label>
            <select
              value={newSchedule}
              onChange={(e) => setNewSchedule(e.target.value)}
              className="w-full p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
            >
              <option value="Morning, After breakfast">Morning, After breakfast</option>
              <option value="Noon, With lunch">Noon, With lunch</option>
              <option value="Evening, Pre-dinner">Evening, Pre-dinner</option>
              <option value="Night, After dinner">Night, After dinner</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-[11px] transition"
          >
            Add to Routine
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 4. VACCINATION STATUS & CENTER SEARCH
// ==========================================
interface VaccinationDetailsProps {
  onBack: () => void;
}

export function VaccinationDetails({ onBack }: VaccinationDetailsProps) {
  const [postal, setPostal] = useState("");
  const [centers, setCenters] = useState<string[]>([]);

  const handleSearchCenters = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postal.trim()) return;
    setCenters([
      "Max immunization counter, Saket, PIN: " + postal,
      "Apex Medicare clinic, Block C, PIN: " + postal,
      "Sadar Sub-divisional Hospital, Govt desk, PIN: " + postal
    ]);
  };

  return (
    <div className="space-y-4 animate-fade-in text-left pb-16">
      <div className="flex items-center gap-2 mb-2">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <ArrowLeft className="h-5 w-5 text-slate-800 dark:text-slate-100" />
        </button>
        <h3 className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-sans flex items-center gap-1.5">
          <Thermometer className="h-5 w-5 text-emerald-600" /> Vaccination Booklet
        </h3>
      </div>

      {/* COVID Vaccine Fully Vaccinated Badge */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-4 rounded-xl shadow border border-emerald-400 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <span className="text-[8.5px] text-emerald-100 uppercase tracking-widest font-bold">ABDM IMMUNIZATION RECORD</span>
            <h4 className="text-sm font-extrabold font-sans">COVID-19 Fully Vaccinated</h4>
            <p className="text-[9.5px] text-emerald-100 font-mono">Certificate: 902-184-750-COV</p>
          </div>
          <div className="p-1 bg-white/20 rounded-lg">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[10px] pt-1.5 border-t border-emerald-400/30">
          <div>
            <p className="text-emerald-100 text-[8px] uppercase">Dose 1 & 2</p>
            <p className="font-bold">COVISHIELD Verified</p>
          </div>
          <div>
            <p className="text-emerald-100 text-[8px] uppercase">Booster Dose</p>
            <p className="font-bold">CORBEVAX Completed</p>
          </div>
        </div>
      </div>

      {/* Routine Immunizations Checklist */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Other Routine Vaccines Status
        </p>

        <div className="space-y-2 text-xs">
          {[
            { name: "Influenza (Flu Shot)", status: "Completed (Jan 2026)", type: "Annual" },
            { name: "Hepatitis B Booster", status: "Completed (2025)", type: "Routine" },
            { name: "Tetanus Toxoid (TT)", status: "Next due: Aug 2026", type: "Periodic", pending: true }
          ].map((v) => (
            <div key={v.name} className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">{v.name}</p>
                <p className="text-[9px] text-slate-500 mt-0.5">{v.type}</p>
              </div>
              <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded ${
                v.pending
                  ? "bg-amber-50 text-amber-700 border border-amber-100"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-100"
              }`}>
                {v.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Search vaccine center */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Locate Vaccine Center
        </p>

        <form onSubmit={handleSearchCenters} className="flex gap-1.5">
          <input
            type="text"
            required
            placeholder="Enter Pincode e.g. 110017"
            value={postal}
            onChange={(e) => setPostal(e.target.value)}
            className="flex-1 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg"
          />
          <button
            type="submit"
            className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shrink-0"
          >
            Find Center
          </button>
        </form>

        {centers.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {centers.map((c, i) => (
              <div key={i} className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-150 rounded text-[10px] font-sans flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <span>{c}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 5. DIAGNOSTICS TIMELINE & RECOVERY HISTORY
// ==========================================
interface TimelinePageProps {
  medicalRecords: MedicalRecord[];
  onBack: () => void;
}

export function TimelinePage({ medicalRecords, onBack }: TimelinePageProps) {
  return (
    <div className="space-y-4 animate-fade-in text-left pb-16">
      <div className="flex items-center gap-2 mb-2">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <ArrowLeft className="h-5 w-5 text-slate-800 dark:text-slate-100" />
        </button>
        <h3 className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-sans flex items-center gap-1.5">
          <Activity className="h-5 w-5 text-blue-600" /> Health Timeline History
        </h3>
      </div>

      <p className="text-[11px] text-slate-500 leading-snug">
        This timeline shows clinical consultations and diagnostic reports verified and synced securely with ABDM central registries.
      </p>

      {/* Timeline entries list */}
      <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-800 space-y-5 ml-2 pt-2">
        {medicalRecords.map((rec) => (
          <div key={rec.id} className="relative space-y-1.5">
            {/* Circle timeline dot */}
            <div className="absolute -left-[21px] top-1.5 h-3.5 w-3.5 bg-blue-600 rounded-full border-2 border-white dark:border-slate-900 shadow"></div>
            
            <span className="text-[9px] font-mono text-slate-400 font-bold block bg-slate-100 dark:bg-slate-950 p-0.5 px-2 rounded-md w-max">
              {rec.date}
            </span>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-850 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans leading-snug">
                    {rec.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">{rec.institution}</p>
                  <p className="text-[9px] text-slate-400 font-sans mt-0.5">Doctor: {rec.doctorName} • <span className="text-blue-600 font-bold">{rec.status}</span></p>
                </div>
                <span className="text-[8.5px] bg-blue-50 text-blue-600 font-bold p-1 px-2 rounded-full uppercase shrink-0">
                  {rec.type}
                </span>
              </div>

              {rec.summary && (
                <p className="text-[10px] text-slate-500 mt-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg leading-relaxed border border-slate-100 dark:border-slate-900">
                  {rec.summary}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 6. HEALTH NEWS & MONSOON ALERT CAMPAIGNS
// ==========================================
interface HealthNewsProps {
  onBack: () => void;
}

export function HealthNewsPage({ onBack }: HealthNewsProps) {
  return (
    <div className="space-y-4 animate-fade-in text-left pb-16">
      <div className="flex items-center gap-2 mb-2">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <ArrowLeft className="h-5 w-5 text-slate-800 dark:text-slate-100" />
        </button>
        <h3 className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-sans flex items-center gap-1.5">
          <Info className="h-5 w-5 text-blue-600" /> National Health Alerts
        </h3>
      </div>

      <div className="space-y-3.5">
        {[
          {
            title: "🌧️ Seasonal Outbreak Advisory: Mosquito-borne vectors warning",
            type: "National Alert",
            date: "Recent",
            color: "border-red-500 bg-red-50/20 text-red-800 dark:text-red-400",
            desc: "National Vector Borne Disease Control Program warns of heightened dengue & malaria transmission. Residents advised to clear stagnated water and use protective nets. Free preventative mosquito kits available at nearby empanelled clinics."
          },
          {
            title: "🌟 Ayushman PM-JAY Cashless expansion to older citizens",
            type: "Policy Update",
            date: "Jul 2026",
            color: "border-amber-500 bg-amber-50/20 text-amber-800 dark:text-amber-400",
            desc: "Union Cabinet approves cashless medical expansion under PM-JAY scheme for all citizens aged 70 and above, regardless of income brackets. Enrolment portals open at local e-seva counters starting next week."
          },
          {
            title: "📢 National De-addiction and Wellness drive launched",
            type: "Campaign Launch",
            date: "Jun 2026",
            color: "border-emerald-500 bg-emerald-50/20 text-emerald-800 dark:text-emerald-400",
            desc: "The Ministry of Health launches community outreach campaigns emphasizing daily yoga and diet counseling. Free nutritional guidance vouchers can be downloaded inside ABHA wellness challenges dashboard."
          }
        ].map((item, idx) => (
          <div key={idx} className={`p-4 rounded-xl border-l-4 border shadow-sm space-y-2 ${item.color}`}>
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider">
              <span>{item.type}</span>
              <span>{item.date}</span>
            </div>
            <h4 className="text-xs font-black leading-tight font-sans text-slate-900 dark:text-white">
              {item.title}
            </h4>
            <p className="text-[10.5px] leading-relaxed text-slate-600 dark:text-slate-300 font-sans">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 7. HOSPITALS DIRECTORY MAP LIST
// ==========================================
interface HospitalDirectoryProps {
  onBack: () => void;
  onShowToast?: (message: string, type?: "success" | "error" | "info") => void;
}

export function HospitalDirectory({ onBack, onShowToast }: HospitalDirectoryProps) {
  const [query, setQuery] = useState("");
  const hospitals = [
    { name: "Max Super Speciality Hospital", address: "Press Enclave Road, Saket", distance: "1.2 km", beds: "14 Vacant beds", specialty: "Cardiology, ICU", phone: "011-26510050" },
    { name: "Saket City Clinic", address: "Mandir Marg, Sector 15", distance: "2.5 km", beds: "8 Vacant beds", specialty: "General Medicine", phone: "011-26543210" },
    { name: "Fortis Healthcare Delhi", address: "Vasant Kunj Road, Phase 2", distance: "4.8 km", beds: "19 Vacant beds", specialty: "Neurology, Surgery", phone: "011-42771122" }
  ];

  const filtered = hospitals.filter(h => h.name.toLowerCase().includes(query.toLowerCase()));

  const handleAction = (message: string) => {
    if (onShowToast) {
      onShowToast(message, "info");
    } else {
      alert(message);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in text-left pb-16">
      <div className="flex items-center gap-2 mb-2">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition">
          <ArrowLeft className="h-5 w-5 text-slate-800 dark:text-slate-100" />
        </button>
        <h3 className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-sans flex items-center gap-1.5">
          <MapPin className="h-5 w-5 text-blue-600" /> Empanelled Hospital Directory
        </h3>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search empanelled hospitals..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-8 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl focus:outline-none"
        />
      </div>

      <div className="space-y-3.5">
        {filtered.map((hosp, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex justify-between items-start">
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 leading-snug">
                {hosp.name}
              </h4>
              <span className="text-[9px] text-emerald-600 font-bold bg-green-50 px-2 py-0.5 rounded shrink-0 uppercase">
                {hosp.beds}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-sans">{hosp.address} • <span className="text-blue-600 font-bold">{hosp.distance}</span></p>
            <p className="text-[9.5px] text-slate-400 font-sans">Specialties: {hosp.specialty}</p>
            
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => handleAction(`Simulating phone call directly to ${hosp.name} Desk at ${hosp.phone}...`)}
                className="flex-1 p-1.5 border border-slate-150 dark:border-slate-850 hover:bg-slate-50 text-center text-[10px] font-bold rounded-lg transition cursor-pointer"
              >
                📞 Call Facility
              </button>
              <button
                onClick={() => handleAction(`Simulating navigation routes directly to ${hosp.name} in Google Maps...`)}
                className="flex-1 p-1.5 bg-blue-600 hover:bg-blue-700 text-white text-center text-[10px] font-bold rounded-lg transition cursor-pointer"
              >
                🗺️ Directions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
