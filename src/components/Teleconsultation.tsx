import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Video, VideoOff, Shield, ShieldCheck, FileText, CheckCircle2,
  Plus, Search, Calendar, MapPin, Lock, RefreshCw, Clock,
  Stethoscope, X, User, Volume2, VolumeX, PhoneOff, Pill,
  Activity, Sparkles, ChevronRight, Download, Eye, Send, FileCode
} from "lucide-react";
import { MedicalRecord, Appointment } from "../types";

export interface Teleconsultation {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  timeSlot: string;
  sharedRecordIds: string[]; // medical record IDs shared securely
  status: "Scheduled" | "Active" | "Completed" | "Cancelled";
  roomName: string;
  citizenNotes?: string;
  prescription?: {
    diagnosis: string;
    medicines: { name: string; dosage: string; frequency: string; duration: string }[];
    advice?: string;
  };
}

interface TeleconsultationProps {
  userType: "Citizen" | "Doctor";
  currentDoctorName?: string; // name of logged in doctor if userType is Doctor
  medicalRecords: MedicalRecord[];
  onAddRecordToLocker: (record: MedicalRecord) => void;
  teleconsultations: Teleconsultation[];
  onUpdateTeleconsultations: (updated: Teleconsultation[]) => void;
  onAddAuditLog: (actor: "Citizen" | "Doctor", action: string, details: string) => void;
  lang: "en" | "hi" | "mr";
  t: any;
  onShowToast?: (message: string, type?: "success" | "error" | "info") => void;
}

export default function Teleconsultation({
  userType,
  currentDoctorName = "Dr. Alok Sharma",
  medicalRecords,
  onAddRecordToLocker,
  teleconsultations,
  onUpdateTeleconsultations,
  onAddAuditLog,
  lang,
  t,
  onShowToast
}: TeleconsultationProps) {
  const triggerToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    if (onShowToast) {
      onShowToast(msg, type);
    } else {
      alert(msg);
    }
  };
  // Available doctors for Citizen browse
  const availableDoctors = [
    {
      id: "dr_verma",
      name: "Dr. Rajesh Verma",
      specialty: "General Medicine",
      hospital: "Fortis Hospital, Noida",
      rating: 4.8,
      experience: "12 years",
      fee: "₹400",
      bio: "Expert in treating respiratory infections, cold, flu, diabetes, and hypertension lifestyle care.",
      slots: ["10:00 AM", "11:30 AM", "03:00 PM", "04:30 PM", "06:00 PM"],
      avatar: "RV"
    },
    {
      id: "dr_sharma",
      name: "Dr. Alok Sharma",
      specialty: "General Medicine",
      hospital: "Saket City Clinic, New Delhi",
      rating: 4.9,
      experience: "15 years",
      fee: "₹500",
      bio: "Senior Consultant specialized in acute viral disorders, gastrointestinal health, and medical wellness.",
      slots: ["09:30 AM", "11:00 AM", "02:30 PM", "04:00 PM", "05:30 PM"],
      avatar: "AS"
    },
    {
      id: "dr_jena",
      name: "Dr. B. K. Jena",
      specialty: "Pediatrics",
      hospital: "PRM Medical College and Hospital",
      rating: 4.9,
      experience: "18 years",
      fee: "₹350",
      bio: "Compassionate care for infants, children, and adolescents with pediatric immunizations & growth consultation.",
      slots: ["10:30 AM", "12:00 PM", "03:30 PM", "05:00 PM"],
      avatar: "BJ"
    },
    {
      id: "dr_iyer",
      name: "Dr. Priya Iyer",
      specialty: "Cardiology",
      hospital: "Max Healthcare, Sector 45",
      rating: 4.9,
      experience: "16 years",
      fee: "₹800",
      bio: "Senior Cardiologist specializing in preventive heart care, hypertension diagnostics, and lipid abnormalities.",
      slots: ["11:00 AM", "01:00 PM", "04:00 PM", "06:30 PM"],
      avatar: "PI"
    }
  ];

  // Citizen-specific states
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [bookingDate, setBookingDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const [citizenNotes, setCitizenNotes] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"browse" | "my-bookings">("browse");

  // Call simulation states
  const [activeCall, setActiveCall] = useState<Teleconsultation | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [callConnected, setCallConnected] = useState<boolean>(false);
  const [connectingStep, setConnectingStep] = useState<string>("Initializing secure media stream...");
  const [chatMessage, setChatMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<{ sender: "Citizen" | "Doctor"; text: string; time: string }[]>([]);

  // Doctor-specific prescription states inside call
  const [rxDiagnosis, setRxDiagnosis] = useState<string>("");
  const [rxMedicines, setRxMedicines] = useState<{ name: string; dosage: string; frequency: string; duration: string }[]>(
    [{ name: "", dosage: "", frequency: "Once Daily", duration: "5 Days" }]
  );
  const [rxAdvice, setRxAdvice] = useState<string>("");
  const [rxSynced, setRxSynced] = useState<boolean>(false);

  // Filter doctors based on search
  const filteredDoctors = availableDoctors.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.hospital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle slot booking
  const handleBookTeleconsult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId || !selectedSlot) {
      triggerToast("Please select a Doctor and an available slot.", "error");
      return;
    }

    const doctor = availableDoctors.find(d => d.id === selectedDoctorId);
    if (!doctor) return;

    const newConsultation: Teleconsultation = {
      id: `tele-${Date.now()}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: bookingDate,
      timeSlot: selectedSlot,
      sharedRecordIds: selectedRecordIds,
      status: "Scheduled",
      roomName: `ABDM-Tele-Room-${Math.floor(1000 + Math.random() * 9000)}`,
      citizenNotes: citizenNotes
    };

    onUpdateTeleconsultations([newConsultation, ...teleconsultations]);
    onAddAuditLog(
      "Citizen",
      "BOOK_TELECONSULTATION",
      `Booked teleconsultation with ${doctor.name} on ${bookingDate} at ${selectedSlot}. Shared ${selectedRecordIds.length} health record(s).`
    );

    // Reset fields
    setSelectedDoctorId("");
    setSelectedSlot("");
    setSelectedRecordIds([]);
    setCitizenNotes("");
    setActiveTab("my-bookings");
  };

  // Toggle record sharing
  const toggleRecordShare = (id: string) => {
    if (selectedRecordIds.includes(id)) {
      setSelectedRecordIds(selectedRecordIds.filter(rid => rid !== id));
    } else {
      setSelectedRecordIds([...selectedRecordIds, id]);
    }
  };

  // Join simulated video call
  const handleJoinCall = (consultation: Teleconsultation) => {
    setActiveCall(consultation);
    setCallConnected(false);
    setChatHistory([]);
    setRxDiagnosis("");
    setRxMedicines([{ name: "", dosage: "", frequency: "Once Daily", duration: "5 Days" }]);
    setRxAdvice("");
    setRxSynced(false);

    // Set active status on teleconsultation
    const updated = teleconsultations.map(tc => {
      if (tc.id === consultation.id) {
        return { ...tc, status: "Active" as const };
      }
      return tc;
    });
    onUpdateTeleconsultations(updated);

    // Simulation steps
    setConnectingStep("Securing cryptographic end-to-end tunnel...");
    setTimeout(() => {
      setConnectingStep("Exchanging ABDM Health ID credentials & verifying HPR signature...");
      setTimeout(() => {
        setConnectingStep("Acquiring media permissions under ABDM consent architecture...");
        setTimeout(() => {
          setCallConnected(true);
          onAddAuditLog(
            userType,
            "JOIN_TELECONSULT_CALL",
            `Joined secure video consultation session room ${consultation.roomName}.`
          );
        }, 1000);
      }, 1000);
    }, 1000);
  };

  // End simulated call
  const handleEndCall = () => {
    if (!activeCall) return;

    // Reset status to completed if prescription is done, or back to Scheduled
    const updated = teleconsultations.map(tc => {
      if (tc.id === activeCall.id) {
        return {
          ...tc,
          status: rxSynced ? ("Completed" as const) : ("Scheduled" as const)
        };
      }
      return tc;
    });
    onUpdateTeleconsultations(updated);
    onAddAuditLog(
      userType,
      "LEAVE_TELECONSULT_CALL",
      `Left secure video room ${activeCall.roomName}.`
    );
    setActiveCall(null);
  };

  // Chat message send
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMsg = {
      sender: userType,
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory([...chatHistory, newMsg]);
    setChatMessage("");

    // Simulate doctor or citizen auto response after 2 seconds
    setTimeout(() => {
      const responses = {
        Citizen: [
          "Yes Doctor, I have been facing this cough for 3 days.",
          "I shared my complete CBC blood report, please review.",
          "Thank you, Doctor. Should I take this medicine after meals?",
          "Okay, I will make sure to rest and follow this advice."
        ],
        Doctor: [
          "Hello. I am reviewing your shared health records now.",
          "Based on your symptoms and CBC report, it looks like a standard viral infection.",
          "I am writing a digital prescription right now. It will sync directly to your ABHA timeline.",
          "Please make sure to drink warm water and get plenty of rest."
        ]
      };

      const pool = userType === "Citizen" ? responses.Doctor : responses.Citizen;
      const randomText = pool[Math.floor(Math.random() * pool.length)];

      setChatHistory(prev => [
        ...prev,
        {
          sender: userType === "Citizen" ? "Doctor" : "Citizen",
          text: randomText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1800);
  };

  // Add prescription rows
  const addRxRow = () => {
    setRxMedicines([...rxMedicines, { name: "", dosage: "", frequency: "Once Daily", duration: "5 Days" }]);
  };

  // Remove prescription row
  const removeRxRow = (index: number) => {
    if (rxMedicines.length === 1) return;
    setRxMedicines(rxMedicines.filter((_, i) => i !== index));
  };

  // Update prescription row
  const updateRxRow = (index: number, key: string, val: string) => {
    const updated = rxMedicines.map((med, i) => {
      if (i === index) {
        return { ...med, [key]: val };
      }
      return med;
    });
    setRxMedicines(updated);
  };

  // Submit and Sync Prescription to ABHA
  const handleSyncPrescription = () => {
    if (!activeCall) return;
    if (!rxDiagnosis.trim()) {
      triggerToast("Please enter a Diagnosis before generating prescription.", "error");
      return;
    }

    const filteredMeds = rxMedicines.filter(m => m.name.trim() !== "");
    if (filteredMeds.length === 0) {
      triggerToast("Please add at least one medicine to the prescription.", "error");
      return;
    }

    // Update local prescription state inside teleconsultations array
    const updatedConsults = teleconsultations.map(tc => {
      if (tc.id === activeCall.id) {
        return {
          ...tc,
          status: "Completed" as const,
          prescription: {
            diagnosis: rxDiagnosis,
            medicines: filteredMeds,
            advice: rxAdvice
          }
        };
      }
      return tc;
    });
    onUpdateTeleconsultations(updatedConsults);

    // Formulate a beautiful Digital Prescription Record to insert directly into patient's Medical Records!
    const newRecord: MedicalRecord = {
      id: `rec-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      title: `Digital Tele-Prescription - ${rxDiagnosis}`,
      institution: "Aarogya Remote Health Desk",
      doctorName: activeCall.doctorName,
      type: "Prescription",
      summary: `Teleconsultation Diagnosis: ${rxDiagnosis}. Medicines prescribed: ${filteredMeds.map(m => m.name).join(", ")}. Advice: ${rxAdvice || "General wellness rest."}`,
      findings: filteredMeds.map(m => ({
        finding: m.name,
        value: m.dosage,
        explanation: `${m.frequency} • ${m.duration}`,
        status: "normal" as const
      })),
      status: "Linked"
    };

    onAddRecordToLocker(newRecord);
    setRxSynced(true);

    onAddAuditLog(
      "Doctor",
      "GENERATE_TELE_PRESCRIPTION",
      `Generated digital prescription for patient on Tele-session ${activeCall.roomName} and synced directly to patient ABHA ID.`
    );
  };

  // Get active consultations list for display
  // For Doctor, only show consultations assigned to them (matches currentDoctorName)
  const displayConsultations = userType === "Citizen"
    ? teleconsultations
    : teleconsultations.filter(tc => tc.doctorName.toLowerCase().includes(currentDoctorName.toLowerCase()) || currentDoctorName.toLowerCase().includes(tc.doctorName.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* ==========================================
          ACTIVE SIMULATED CALL SCREEN INTERACTIVE IF EXIST
          ========================================== */}
      {activeCall && (
        <div className="fixed inset-0 bg-slate-950 text-slate-100 z-50 overflow-hidden flex flex-col md:flex-row">
          
          {/* Main call simulation grid */}
          <div className="flex-1 flex flex-col relative h-[60vh] md:h-full border-r border-slate-800">
            {/* Top call compliance ribbon */}
            <div className="bg-slate-900 px-4 py-2.5 flex justify-between items-center text-xs text-slate-400">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="h-4 w-4 animate-pulse" />
                <span>ABDM-Sealed Encrypted Line</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
                <span className="font-mono text-[11px] font-bold">ROOM: {activeCall.roomName}</span>
              </div>
            </div>

            {/* Simulated Video Feeds Container */}
            <div className="flex-1 bg-slate-900 relative flex flex-col sm:flex-row gap-3 p-4 justify-center items-center">
              {!callConnected ? (
                /* Connecting Stage Visuals */
                <div className="text-center space-y-4 max-w-md p-6">
                  <div className="relative mx-auto h-20 w-20 flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-20"></span>
                    <div className="p-4 bg-teal-500 text-slate-950 rounded-full">
                      <Video className="h-10 w-10 animate-bounce" />
                    </div>
                  </div>
                  <h3 className="font-extrabold text-teal-400 text-sm">Establishing Secure Teleconsultation</h3>
                  <div className="text-xs text-slate-400 space-y-1 bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <p className="font-mono text-[10.5px] text-teal-500 font-bold">✦ {connectingStep}</p>
                    <p className="text-[10px] text-slate-500">Dual security authorization with NHA health gateway.</p>
                  </div>
                </div>
              ) : (
                /* Split Screen Feeds */
                <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Doctor Screen Block */}
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                    {isVideoOff && userType === "Doctor" ? (
                      <div className="text-center text-slate-500">
                        <VideoOff className="h-10 w-10 mx-auto mb-2 text-rose-500" />
                        <p className="text-xs">Your video is stopped</p>
                      </div>
                    ) : (
                      <div className="w-full h-full relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-slate-900/50 flex flex-col justify-end p-4 z-10">
                          <span className="bg-slate-900/80 backdrop-blur-md text-white font-black text-xs px-3 py-1 rounded-full w-max border border-slate-750">
                            {activeCall.doctorName} ({activeCall.specialty})
                          </span>
                        </div>
                        {/* Interactive Vector Doctor Feed */}
                        <div className="text-center p-8 z-0">
                          <div className="h-24 w-24 rounded-full bg-blue-900 border-4 border-blue-600/50 mx-auto mb-4 flex items-center justify-center text-3xl font-black text-white">
                            🩺
                          </div>
                          <div className="flex gap-1 items-center justify-center mt-2">
                            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-[10.5px] text-slate-400 font-bold tracking-wider font-sans uppercase">HPR Certified Video Verified</span>
                          </div>
                          <p className="text-xs text-slate-400 max-w-xs mt-2 italic">
                            "Hello Tamanna, I am analyzing your shared clinical logs. How can I help you today?"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Citizen Screen Block */}
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                    {isVideoOff && userType === "Citizen" ? (
                      <div className="text-center text-slate-500">
                        <VideoOff className="h-10 w-10 mx-auto mb-2 text-rose-500" />
                        <p className="text-xs">Your video is stopped</p>
                      </div>
                    ) : (
                      <div className="w-full h-full relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-slate-900/50 flex flex-col justify-end p-4 z-10">
                          <span className="bg-slate-900/80 backdrop-blur-md text-white font-black text-xs px-3 py-1 rounded-full w-max border border-slate-750">
                            Tamanna Kalia (Patient)
                          </span>
                        </div>
                        {/* Interactive Vector Citizen Feed */}
                        <div className="text-center p-8 z-0">
                          <div className="h-24 w-24 rounded-full bg-emerald-950 border-4 border-emerald-600/50 mx-auto mb-4 flex items-center justify-center text-3xl font-black text-white">
                            👤
                          </div>
                          <div className="flex gap-1 items-center justify-center mt-2">
                            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-[10.5px] text-slate-400 font-bold tracking-wider font-sans uppercase">ABHA Authenticated Voice</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            {/* Video Call Controls Overlay */}
            <div className="bg-slate-900 p-4 flex justify-between items-center px-6 border-t border-slate-800 shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full transition ${isMuted ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`p-3 rounded-full transition ${isVideoOff ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
                >
                  {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </button>
              </div>

              {/* Patient Note or Doctor Note summary tiny line */}
              <div className="hidden lg:block text-xs text-slate-400 max-w-sm overflow-hidden text-ellipsis whitespace-nowrap">
                {activeCall.citizenNotes ? `Patient Symptom Note: "${activeCall.citizenNotes}"` : "End-to-End Cryptographic Audit Sync active"}
              </div>

              <button
                onClick={handleEndCall}
                className="bg-rose-600 hover:bg-rose-700 text-white font-black px-6 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-rose-950"
              >
                <PhoneOff className="h-4.5 w-4.5" />
                <span>Leave Room</span>
              </button>
            </div>
          </div>

          {/* Secure Side Panel: Chat or Patient Shared Records or Prescription Form */}
          <div className="w-full md:w-[440px] bg-slate-900 flex flex-col border-t md:border-t-0 border-slate-800 h-[40vh] md:h-full">
            
            {/* Split Panel Headings */}
            <div className="bg-slate-950 p-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-teal-400" />
                <h4 className="font-sans font-black text-xs text-slate-200 uppercase tracking-wider">Patient Sandbox Wallet Locker</h4>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Securely shared medical reports and direct Rx Generator</p>
            </div>

            {/* Scrollable Container with shared records AND/OR prescription form */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-left">
              
              {/* SECTION: Patient Shared Medical Records */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block border-b border-slate-850 pb-1">
                  🔒 Securely Shared ABHA Records ({activeCall.sharedRecordIds.length})
                </span>

                {activeCall.sharedRecordIds.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {medicalRecords
                      .filter(rec => activeCall.sharedRecordIds.includes(rec.id))
                      .map(rec => (
                        <div key={rec.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-slate-200 text-[11.5px]">{rec.title}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{rec.institution} • {rec.date}</p>
                            </div>
                            <span className="bg-slate-900 border border-slate-800 text-teal-400 text-[8px] font-black px-2 py-0.5 rounded">
                              {rec.type}
                            </span>
                          </div>
                          {rec.summary && (
                            <p className="text-[10.5px] text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-slate-850/50 mt-2 font-sans italic leading-relaxed">
                              "{rec.summary}"
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl text-center">
                    <p className="text-[10.5px] text-slate-500">No medical records were selected to be shared for this slot.</p>
                  </div>
                )}
              </div>

              {/* SECTION: Direct Rx Prescription Writer (DOCTOR SPECIALTY VIEW) */}
              {userType === "Doctor" && (
                <div className="space-y-3.5 border-t border-slate-800 pt-4">
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block border-b border-slate-850 pb-1 flex items-center gap-1.5">
                    <Stethoscope className="h-4 w-4" /> Digital Prescription Generator (HPR Signing)
                  </span>

                  {rxSynced ? (
                    <div className="p-4 bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 rounded-xl space-y-2 text-xs">
                      <p className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                        ABHA ID Sync Completed!
                      </p>
                      <p className="text-[10.5px] text-slate-300 leading-relaxed">
                        This digital prescription has been cryptographically signed with your HPR credentials, sealed, and synced directly to the patient's ABHA locker timeline.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-850">
                      {/* Diagnosis */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-400">Diagnosis / Assessment:</label>
                        <input
                          type="text"
                          required
                          value={rxDiagnosis}
                          onChange={(e) => setRxDiagnosis(e.target.value)}
                          placeholder="e.g. Acute Allergic Bronchitis"
                          className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none"
                        />
                      </div>

                      {/* Medicines List */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="font-bold text-slate-400">Medicines (Rx):</label>
                          <button
                            type="button"
                            onClick={addRxRow}
                            className="text-[10px] text-teal-400 hover:underline flex items-center gap-0.5"
                          >
                            <Plus className="h-3 w-3" /> Add Row
                          </button>
                        </div>

                        <div className="space-y-2">
                          {rxMedicines.map((med, index) => (
                            <div key={index} className="grid grid-cols-12 gap-1.5 items-center bg-slate-900 p-2 rounded-lg border border-slate-800">
                              <div className="col-span-5">
                                <input
                                  type="text"
                                  placeholder="Medicine Name"
                                  value={med.name}
                                  onChange={(e) => updateRxRow(index, "name", e.target.value)}
                                  className="w-full p-1 bg-slate-950 border border-slate-800 rounded text-[10.5px] text-slate-100 focus:outline-none"
                                />
                              </div>
                              <div className="col-span-3">
                                <input
                                  type="text"
                                  placeholder="Dosage"
                                  value={med.dosage}
                                  onChange={(e) => updateRxRow(index, "dosage", e.target.value)}
                                  className="w-full p-1 bg-slate-950 border border-slate-800 rounded text-[10.5px] text-slate-100 focus:outline-none"
                                />
                              </div>
                              <div className="col-span-3">
                                <select
                                  value={med.frequency}
                                  onChange={(e) => updateRxRow(index, "frequency", e.target.value)}
                                  className="w-full p-1 bg-slate-950 border border-slate-800 rounded text-[10.5px] text-slate-300 focus:outline-none"
                                >
                                  <option value="Once Daily">QD</option>
                                  <option value="Twice Daily">BID</option>
                                  <option value="Thrice Daily">TID</option>
                                  <option value="As Needed">PRN</option>
                                </select>
                              </div>
                              <div className="col-span-1 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeRxRow(index)}
                                  className="text-rose-500 hover:text-rose-400 text-sm font-bold"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* General Advice */}
                      <div className="space-y-1">
                        <label className="font-bold text-slate-400">Rest & Diet Advice:</label>
                        <textarea
                          rows={2}
                          value={rxAdvice}
                          onChange={(e) => setRxAdvice(e.target.value)}
                          placeholder="Hot steam inhalations thrice daily. Avoid cold items."
                          className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none"
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="button"
                        onClick={handleSyncPrescription}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black py-2 rounded-xl transition shadow flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                      >
                        <Shield className="h-3.5 w-3.5 text-teal-200" />
                        <span>Sign & Sync to ABHA Wallet</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: Citizen View Prescription Live (CITIZEN EXCLUSIVE VIEW) */}
              {userType === "Citizen" && activeCall.prescription && (
                <div className="space-y-3.5 border-t border-slate-800 pt-4 animate-fade-in">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block border-b border-slate-850 pb-1 flex items-center gap-1.5">
                    <Pill className="h-4 w-4" /> Live Received Prescription (ABHA Sync Active)
                  </span>

                  <div className="bg-emerald-950/25 border border-emerald-800/40 rounded-xl p-3.5 text-xs space-y-3">
                    <div className="flex justify-between items-center border-b border-emerald-900/40 pb-1.5">
                      <p className="font-extrabold text-emerald-400">Diagnosis: {activeCall.prescription.diagnosis}</p>
                      <span className="text-[8.5px] bg-emerald-500/10 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded border border-emerald-500/20 uppercase">Sealed Rx</span>
                    </div>

                    <div className="space-y-2">
                      {activeCall.prescription.medicines.map((med, i) => (
                        <div key={i} className="flex justify-between text-[11px] text-slate-200 border-b border-slate-850/50 pb-1">
                          <div>
                            <span className="font-bold">{med.name}</span>
                            <span className="text-[9.5px] text-slate-500 block">{med.frequency} • {med.duration}</span>
                          </div>
                          <span className="text-slate-400">{med.dosage}</span>
                        </div>
                      ))}
                    </div>

                    {activeCall.prescription.advice && (
                      <p className="text-[10.5px] text-slate-400 bg-slate-900/50 p-2 rounded border border-slate-850/40 italic">
                        Advice: {activeCall.prescription.advice}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Live Secure Call Text Chat Box */}
              <div className="border-t border-slate-800 pt-4 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  💬 Secure Chat Room Channel
                </span>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 h-36 flex flex-col justify-between">
                  <div className="flex-1 overflow-y-auto space-y-2 text-[11px] pr-1">
                    {chatHistory.length === 0 ? (
                      <p className="text-slate-600 text-center py-4">End-to-end encrypted room chat started.</p>
                    ) : (
                      chatHistory.map((chat, idx) => (
                        <div key={idx} className={`flex flex-col ${chat.sender === userType ? "items-end" : "items-start"}`}>
                          <div className={`p-2 rounded-xl max-w-[85%] leading-snug ${chat.sender === userType ? "bg-teal-600 text-white rounded-br-none" : "bg-slate-850 text-slate-200 rounded-bl-none"}`}>
                            {chat.text}
                          </div>
                          <span className="text-[8px] text-slate-600 mt-0.5 font-mono">{chat.time}</span>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-1.5 mt-2 pt-1.5 border-t border-slate-900">
                    <input
                      type="text"
                      placeholder="Type a secure message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-1 p-1 px-2.5 bg-slate-900 text-slate-200 border border-slate-800 rounded-lg text-xs focus:outline-none"
                    />
                    <button type="submit" className="bg-teal-600 text-slate-950 p-1.5 rounded-lg hover:bg-teal-500 transition">
                      <Send className="h-3 w-3" />
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ==========================================
          STANDARD PORTAL INTERFACE VIEW (NOT IN ACTIVE CALL)
          ========================================== */}
      {userType === "Citizen" ? (
        /* CITIZEN VIEW: BROWSE DOCTORS AND SCHEDULE OR VIEW RECENT CONSULTATIONS */
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex justify-between items-center text-left">
            <div>
              <h2 className="font-sans font-black text-slate-900 dark:text-white text-lg md:text-xl flex items-center gap-1.5">
                <Video className="h-5 w-5 text-violet-600" /> ABDM Teleconsultation Hub
              </h2>
              <p className="text-xs text-slate-500">Book remote consultations, share clinical locker logs, and join secure calls</p>
            </div>
            
            <div className="flex gap-1.5">
              <button
                onClick={() => setActiveTab("browse")}
                className={`p-1 px-3 text-xs rounded-lg font-bold transition cursor-pointer ${activeTab === "browse" ? "bg-violet-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
              >
                Browse & Schedule
              </button>
              <button
                onClick={() => setActiveTab("my-bookings")}
                className={`p-1 px-3 text-xs rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${activeTab === "my-bookings" ? "bg-violet-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}
              >
                My Booked Slots
                {teleconsultations.length > 0 && (
                  <span className="bg-violet-500 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center">
                    {teleconsultations.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {activeTab === "browse" ? (
            /* Browse and Book Form split screen */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Doctor Directory browse */}
              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search specialty, doctor name, hospital facility..."
                    className="w-full p-2.5 pl-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Empanelled NHA Tele-Practitioners ({filteredDoctors.length})</p>
                  
                  {filteredDoctors.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoctorId(doc.id)}
                      className={`p-4 bg-white dark:bg-slate-900 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${selectedDoctorId === doc.id ? "border-violet-500 shadow-md ring-2 ring-violet-500/15" : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950"}`}
                    >
                      <div className="flex gap-3.5 items-start">
                        <div className="h-11 w-11 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-400 flex items-center justify-center font-black text-sm shrink-0">
                          {doc.avatar}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-slate-900 dark:text-white text-sm">{doc.name}</h4>
                            <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[8.5px] font-black px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/50 uppercase">Verified</span>
                          </div>
                          <p className="text-xs text-slate-500 font-sans">{doc.specialty} • {doc.experience} Exp</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{doc.hospital}</p>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-relaxed font-sans mt-2.5 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-150 dark:border-slate-850">
                        "{doc.bio}"
                      </p>

                      <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-850 text-xs">
                        <span className="text-slate-500">Fee: <strong className="text-slate-800 dark:text-white">{doc.fee}</strong></span>
                        <div className="flex gap-1.5 items-center">
                          <span className="text-amber-500 text-xs">★</span>
                          <span className="font-extrabold text-slate-800 dark:text-white">{doc.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secure Slot Reservation Form */}
              <div className="lg:col-span-5 space-y-4 text-left bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-2 flex justify-between items-center">
                  <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Fast Slot Booking Form</span>
                  <Lock className="h-4 w-4 text-violet-600" />
                </div>

                <form onSubmit={handleBookTeleconsult} className="space-y-4 text-xs">
                  {/* Selected Doctor Info Card inside Form */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Selected Tele-Practitioner</label>
                    {selectedDoctorId ? (
                      (() => {
                        const doc = availableDoctors.find(d => d.id === selectedDoctorId);
                        return (
                          <div className="p-3 bg-violet-50/40 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900 rounded-xl flex justify-between items-center">
                            <div>
                              <p className="font-black text-violet-800 dark:text-violet-400">{doc?.name}</p>
                              <p className="text-[10.5px] text-slate-500">{doc?.specialty} • {doc?.hospital}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedDoctorId("")}
                              className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 border-dashed text-center text-slate-400">
                        Please tap or click on any doctor from the list.
                      </div>
                    )}
                  </div>

                  {/* Booking Date */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Consultation Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-white focus:outline-none"
                    />
                  </div>

                  {/* Available Time Slots */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Select Available Time Slot</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {selectedDoctorId ? (
                        availableDoctors.find(d => d.id === selectedDoctorId)?.slots.map(slot => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-2 rounded-xl text-[11px] font-bold border transition ${selectedSlot === slot ? "bg-violet-600 text-white border-violet-600" : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-100"}`}
                          >
                            {slot}
                          </button>
                        ))
                      ) : (
                        <p className="col-span-2 text-slate-400 text-center py-2 italic text-[10px]">Choose doctor to view active slots</p>
                      )}
                    </div>
                  </div>

                  {/* SECURE HEALTH RECORD SHARING CHECKLIST */}
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div className="flex justify-between items-center">
                      <label className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Lock className="h-3.5 w-3.5 text-emerald-500" />
                        Secure ABHA Locker sharing
                      </label>
                      <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-extrabold px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/50 uppercase">Consent Signed</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-snug">
                      Toggle and check reports you want to securely share with this doctor. They will have viewing access ONLY during this consultation call session.
                    </p>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {medicalRecords.map((rec) => (
                        <div
                          key={rec.id}
                          onClick={() => toggleRecordShare(rec.id)}
                          className={`p-2.5 rounded-lg border text-[11px] transition cursor-pointer flex justify-between items-center ${selectedRecordIds.includes(rec.id) ? "bg-emerald-50/50 border-emerald-400 dark:bg-emerald-950/20 dark:border-emerald-900" : "bg-slate-50 border-slate-200 dark:bg-slate-950 dark:border-slate-800"}`}
                        >
                          <div className="space-y-0.5 text-left">
                            <p className="font-bold text-slate-800 dark:text-slate-200">{rec.title}</p>
                            <p className="text-[9.5px] text-slate-500">{rec.institution} • {rec.date}</p>
                          </div>
                          <span className="text-emerald-600 dark:text-emerald-400 text-xs">
                            {selectedRecordIds.includes(rec.id) ? "✓ Shared" : "＋ Share"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Citizen Notes / Symptoms input */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-400">Briefly Describe Your Symptoms:</label>
                    <textarea
                      rows={2}
                      value={citizenNotes}
                      onChange={(e) => setCitizenNotes(e.target.value)}
                      placeholder="e.g. Coughing, chest pain, throat inflammation since 3 days."
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                    />
                  </div>

                  {/* Submit Book button */}
                  <button
                    type="submit"
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-black py-2.5 rounded-xl transition cursor-pointer shadow-md shadow-violet-500/10 flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="h-4.5 w-4.5 text-violet-200" />
                    <span>Authorize ABDM Tele-Slot Book</span>
                  </button>
                </form>
              </div>

            </div>
          ) : (
            /* My Scheduled Teleconsultations list */
            <div className="space-y-4 text-left max-w-4xl mx-auto">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your booked teleconsultation sessions ({displayConsultations.length})</p>

              {displayConsultations.length === 0 ? (
                <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center text-slate-400">
                  <Video className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs">No active or scheduled teleconsultation slots found.</p>
                  <button
                    onClick={() => setActiveTab("browse")}
                    className="text-violet-600 text-xs font-bold mt-2 hover:underline"
                  >
                    Browse & Book Doctor Now
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {displayConsultations.map((tc) => (
                    <div
                      key={tc.id}
                      className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 border-b border-slate-100 dark:border-slate-850 pb-3">
                        <div className="flex gap-3.5 items-center">
                          <div className="p-2.5 bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 rounded-xl shrink-0">
                            <Stethoscope className="h-5.5 w-5.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-slate-800 dark:text-slate-100 text-sm">{tc.doctorName}</h4>
                              <span className="bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-[8.5px] font-black px-1.5 py-0.5 rounded uppercase font-mono">Teleconsult</span>
                            </div>
                            <p className="text-xs text-slate-500">{tc.specialty} • Session ID: {tc.roomName}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold px-3 py-1.5 rounded-full text-[10.5px] border border-slate-200 dark:border-slate-800 flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {tc.date}
                          </span>
                          <span className="bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-400 font-extrabold px-3 py-1.5 rounded-full text-[10.5px] border border-violet-100 dark:border-violet-900/50 font-mono flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {tc.timeSlot}
                          </span>
                        </div>
                      </div>

                      {/* Display shared records overview */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Lock className="h-3 w-3 text-emerald-500" />
                            Secure Shared Record Locker Items:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {tc.sharedRecordIds.length > 0 ? (
                              medicalRecords
                                .filter(r => tc.sharedRecordIds.includes(r.id))
                                .map(r => (
                                  <span key={r.id} className="bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 text-[9.5px] font-black px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-0.5">
                                    ✓ {r.title}
                                  </span>
                                ))
                            ) : (
                              <span className="text-slate-400 text-[10px] italic">No records shared (Restricted viewing mode)</span>
                            )}
                          </div>
                        </div>

                        {tc.status === "Completed" ? (
                          <div className="flex gap-2">
                            <span className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5">
                              <CheckCircle2 className="h-4.5 w-4.5" /> Checked Out
                            </span>
                            {tc.prescription && (
                              <button
                                onClick={() => {
                                  triggerToast(`Diagnosis: ${tc.prescription?.diagnosis}. Medicines: ${tc.prescription?.medicines.map(m => `${m.name} (${m.dosage})`).join(", ")}`, "info");
                                }}
                                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>View prescription</span>
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleJoinCall(tc)}
                            className="bg-violet-600 hover:bg-violet-700 text-white font-black px-5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-violet-500/15 cursor-pointer animate-pulse"
                          >
                            <Video className="h-4 w-4" />
                            <span>Join Secure Video Call</span>
                          </button>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* DOCTOR VIEW: LIST OF INCOMING PATIENT TELECONSULTATION REQUESTS */
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex justify-between items-center text-left">
            <div>
              <h2 className="font-sans font-black text-slate-900 dark:text-white text-lg md:text-xl flex items-center gap-1.5">
                <Stethoscope className="h-5 w-5 text-emerald-600" /> Secure HPR Practitioner Tele-desk
              </h2>
              <p className="text-xs text-slate-500">Conduct remote video consultations, view patient shared reports, and sign digital prescriptions</p>
            </div>
            
            <div className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
              Signed-In: Dr. {currentDoctorName}
            </div>
          </div>

          <div className="space-y-4 text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Incoming secure patient calls ({displayConsultations.length})</p>

            {displayConsultations.length === 0 ? (
              <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center text-slate-500">
                <Video className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs">No active or scheduled incoming patient teleconsultation calls assigned to you.</p>
                <p className="text-[10.5px] text-slate-400 mt-1 italic">Note: Log in as Citizen to schedule a consultation slot with your doctor account.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {displayConsultations.map((tc) => (
                  <div
                    key={tc.id}
                    className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 border-b border-slate-100 dark:border-slate-850 pb-3">
                      <div className="flex gap-3.5 items-center">
                        <div className="h-11 w-11 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-black text-sm shrink-0">
                          TK
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-slate-800 dark:text-slate-100 text-sm">Tamanna Kalia</h4>
                            <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[8.5px] font-black px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/50 uppercase">ABHA Linked</span>
                          </div>
                          <p className="text-xs text-slate-500">Gender: Female • Age: 27 yrs • Session ID: {tc.roomName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {tc.date}
                        </span>
                        <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-emerald-400" />
                          {tc.timeSlot}
                        </span>
                      </div>
                    </div>

                    {/* Shared records index */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Lock className="h-3 w-3 text-emerald-500" />
                          Patient Shared ABHA Locker Records:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {tc.sharedRecordIds.length > 0 ? (
                            medicalRecords
                              .filter(r => tc.sharedRecordIds.includes(r.id))
                              .map(r => (
                                <span key={r.id} className="bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 text-[9.5px] font-black px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-0.5">
                                  ✓ {r.title}
                                </span>
                              ))
                          ) : (
                            <span className="text-slate-400 text-[10px] italic">No records shared (Restricted view)</span>
                          )}
                        </div>
                      </div>

                      {tc.status === "Completed" ? (
                        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5">
                          <CheckCircle2 className="h-4.5 w-4.5" /> Prescription Completed
                        </span>
                      ) : (
                        <button
                          onClick={() => handleJoinCall(tc)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-500/15 cursor-pointer animate-pulse"
                        >
                          <Video className="h-4 w-4" />
                          <span>Initiate Video Call & Connect</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
