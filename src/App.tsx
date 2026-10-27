import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity, User, FileText, Stethoscope, Building2, TrendingUp, Sparkles,
  Calendar, MapPin, AlertTriangle, Heart, Shield, QrCode, Award, PhoneCall,
  CheckCircle2, Plus, Search, MessageSquare, PlusCircle, ArrowRight, Lock,
  Settings, LogOut, ChevronRight, Info, Globe, RefreshCw, Sun, Moon,
  Users, Check, Fingerprint, ArrowLeft, UploadCloud, UserCheck, Key,
  CreditCard, ShieldAlert, CheckCircle, Pill, Thermometer, Map, Download,
  Menu, Trash2, Send, Mic, Play, Square, Eye, FileSpreadsheet, PlusSquare, HelpCircle, Video, Clock
} from "lucide-react";

// Types
import {
  Language,
  ABHAMetadata,
  MedicalRecord,
  Appointment,
  Challenge,
  OPDPatient,
  HospitalBed,
  HealthContentItem,
  HealthCampaignBanner,
  SharedRecordToken,
  FamilyMemberProfile
} from "./types";

// Multi-lingual Translations & Data
import {
  translations,
  initialHealthContent,
  initialCampaignBanners,
  initialSharedTokens,
  initialFamilyProfiles
} from "./data";

// Sub-components
import AIChatAndSummary from "./components/AIChatAndSummary";
import DoctorDesk from "./components/DoctorDesk";
import GovAnalytics from "./components/GovAnalytics";
import HospitalControl from "./components/HospitalControl";
import RewardsWellness from "./components/RewardsWellness";
import Teleconsultation from "./components/Teleconsultation";
import HealthContentHub from "./components/HealthContentHub";
import RecentHealthActivity from "./components/RecentHealthActivity";
import SelectiveShareQR from "./components/SelectiveShareQR";
import FamilyHealthManager from "./components/FamilyHealthManager";
import SplashScreen from "./components/SplashScreen";
import HealthShieldLogo from "./components/HealthShieldLogo";

// Modular Citizen Sub-pages
import {
  PMJAYPortal,
  EmergencyQRPage,
  MedicineTrackerPage,
  VaccinationDetails,
  TimelinePage,
  HealthNewsPage,
  HospitalDirectory
} from "./components/CitizenSubPages";

// Core Mock Data
const initialABHAMetadata: ABHAMetadata = {
  abhaId: "91-2045-8123-5678",
  name: "Tamanna Kalia",
  gender: "F",
  dob: "1999-05-18",
  mobile: "9876543210",
  healthScore: 84,
  rewardPoints: 240
};

const initialMedicalRecords: MedicalRecord[] = [
  { id: "rec-1", date: "2026-06-20", title: "Complete Blood Count", institution: "Dr. Lal PathLabs", doctorName: "Dr. Verma", type: "Lab Report", summary: "All metrics normal except borderline low vitamin D3.", status: "Linked" },
  { id: "rec-2", date: "2026-05-12", title: "General OPD Prescription", institution: "Aarogya Clinic", doctorName: "Dr. Alok Sharma", type: "Prescription", summary: "Acute viral gastroenteritis. Advised probiotics & hydration.", status: "Linked" }
];

const initialAppointments: Appointment[] = [
  { id: "appt-1", doctorName: "Dr. Alok Sharma", specialty: "General Medicine", hospitalName: "Saket City Clinic", date: "2026-07-12", time: "11:00 AM", status: "Upcoming" }
];

const initialChallenges: Challenge[] = [
  { id: "ch-1", title: "Pranayama Streak", description: "Complete 10 minutes of breathing cycles", points: 15, completed: false, category: "sleep" },
  { id: "ch-2", title: "Monsoon Hydration Meter", description: "Drink 3.5 liters of water daily", points: 20, completed: true, category: "hydration" },
  { id: "ch-3", title: "10K Step Target", description: "Earn points by meeting the physical activity goal", points: 25, completed: false, category: "steps" }
];

const initialOPDQueue: OPDPatient[] = [
  { id: "pat-101", name: "Sunita Deshmukh", age: 48, gender: "Female", abhaId: "91-4501-1920-8812", status: "Waiting", time: "10:15 AM", symptoms: "Chronic dry cough, occasional chest tightness." },
  { id: "pat-102", name: "Karan Johar", age: 34, gender: "Male", abhaId: "91-8812-4411-9204", status: "In Consultation", time: "10:30 AM", symptoms: "Blurry vision in left eye, request diabetic eye review." },
  { id: "pat-103", name: "Ramesh Chandra", age: 62, gender: "Male", abhaId: "91-1120-4592-1840", status: "Completed", time: "09:45 AM", symptoms: "Post-surgery cardiac assessment." }
];

const initialHospitalBeds: HospitalBed[] = [
  { category: "ICU / Ventilator", total: 15, available: 4 },
  { category: "Emergency Trauma Beds", total: 20, available: 7 },
  { category: "General Medical Wards", total: 60, available: 22 },
  { category: "Maternity / Pediatric", total: 25, available: 11 }
];

export default function App() {
  // App Section Routing States
  const [appSection, setAppSection] = useState<"Splash" | "Welcome" | "Login" | "Dashboard">("Splash");
  const [activeUserType, setActiveUserType] = useState<"Citizen" | "Doctor" | "Hospital" | "Government">("Citizen");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeScreen, setActiveScreen] = useState<string>("Home");
  const [lang, setLang] = useState<Language>("en");
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean | null>(null);

  // New Citizen Features State: Health Content, Campaigns, Selective Sharing & Family Profiles
  const [healthContentItems, setHealthContentItems] = useState<HealthContentItem[]>(initialHealthContent);
  const [campaignBanners, setCampaignBanners] = useState<HealthCampaignBanner[]>(initialCampaignBanners);
  const [sharedTokens, setSharedTokens] = useState<SharedRecordToken[]>(initialSharedTokens);
  const [familyProfiles, setFamilyProfiles] = useState<FamilyMemberProfile[]>(initialFamilyProfiles);
  const [activeFamilyProfileId, setActiveFamilyProfileId] = useState<string>("fam-self");

  // Global high-fidelity toast notification state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Check Gemini API Key configuration on load
  useEffect(() => {
    fetch("/api/config-status")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.hasGeminiKey === "boolean") {
          setHasGeminiKey(data.hasGeminiKey);
        } else {
          setHasGeminiKey(false);
        }
      })
      .catch(() => {
        setHasGeminiKey(false);
      });
  }, []);

  // Language translations map
  const t = translations[lang];

  // Citizen States
  const [abhaMetadata, setAbhaMetadata] = useState<ABHAMetadata>(initialABHAMetadata);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(initialMedicalRecords);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [familyMembers, setFamilyMembers] = useState([
    { name: "Suman Devi", relationship: "Mother", abhaId: "91-1192-4481-9022" },
    { name: "Rohan Sharma", relationship: "Son", abhaId: "91-8842-1920-4511" }
  ]);
  const [newFamilyName, setNewFamilyName] = useState("");
  const [newFamilyRelation, setNewFamilyRelation] = useState("Mother");
  const [newFamilyAbha, setNewFamilyAbha] = useState("");

  // Synchronized Active Profile Data (Personal vs Authorized Family Member)
  const activeProfileData = (() => {
    const activeFam = familyProfiles.find((f) => f.id === activeFamilyProfileId) || familyProfiles[0];
    if (activeFam && activeFam.id !== "fam-self") {
      return {
        name: activeFam.name,
        abhaId: activeFam.abhaId || "91-XXXX-XXXX-XXXX",
        healthScore: activeFam.id === "fam-son" ? 92 : activeFam.id === "fam-mother" ? 72 : 80,
        rewardPoints: activeFam.id === "fam-son" ? 360 : activeFam.id === "fam-mother" ? 180 : 250,
        mobile: "91******" + (activeFam.age || 28),
        gender: activeFam.gender,
        dob: activeFam.id === "fam-son" ? "2020-05-10" : activeFam.id === "fam-mother" ? "1970-04-12" : "1997-08-14",
        records: activeFam.records || [],
        appointments: activeFam.appointments || []
      };
    }
    return {
      name: abhaMetadata.name,
      abhaId: abhaMetadata.abhaId,
      healthScore: abhaMetadata.healthScore,
      rewardPoints: abhaMetadata.rewardPoints,
      mobile: abhaMetadata.mobile,
      gender: abhaMetadata.gender === "M" ? "Male" : "Female",
      dob: abhaMetadata.dob,
      records: medicalRecords,
      appointments: appointments
    };
  })();

  // PM-JAY States
  const [pmjayClaims, setPmjayClaims] = useState([
    { id: "CLM-902", date: "2026-05-10", hospital: "Max Super Speciality Hospital", treatment: "Acute Appendicitis Surgery", amount: 15000, status: "Disbursed" },
    { id: "CLM-811", date: "2026-06-22", hospital: "Saket City Clinic", treatment: "Dengue Ward Bed & Diagnostics", amount: 7500, status: "Disbursed" }
  ]);
  const [preAuthRequests, setPreAuthRequests] = useState([
    { id: "PA-502", hospitalName: "Max Super Speciality Hospital", treatment: "Planned Cataract Surgery", specialty: "Ophthalmology", estimatedCost: "32000", diagnosis: "Severe Bilateral Cataract", status: "Approved", date: "2026-07-02" }
  ]);
  const [preAuthForm, setPreAuthForm] = useState({
    hospitalName: "Max Super Speciality Hospital",
    treatmentName: "",
    specialty: "General Medicine",
    estimatedCost: "",
    diagnosis: ""
  });
  const [preAuthSuccess, setPreAuthSuccess] = useState<string | null>(null);
  const [eVouchers, setEVouchers] = useState([
    { id: "VCH-01", type: "Free Diabetes Screening", code: "PMJAY-DIA-88", status: "Active", validTill: "2026-08-31" },
    { id: "VCH-02", type: "Cervical Cancer Screening Subsidy", code: "PMJAY-CERV-22", status: "Active", validTill: "2026-09-15" }
  ]);
  const [newVoucherSuccess, setNewVoucherSuccess] = useState<string | null>(null);

  // Form states for Book Consultation
  const [bookingSpecialty, setBookingSpecialty] = useState("General Medicine");
  const [bookingHospital, setBookingHospital] = useState("Max Super Speciality Hospital");
  const [bookingDate, setBookingDate] = useState("2026-07-12");
  const [bookingTime, setBookingTime] = useState("11:00 AM");
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState("");

  // Doctor & Hospital Admin registries
  const [doctorApplications, setDoctorApplications] = useState([
    { id: "app-doc-1", fullName: "Dr. Alok Sharma", councilRegNo: "MCI-44129", specialization: "General Medicine", hospitalName: "Saket City Clinic", status: "Pending" },
    { id: "app-doc-2", fullName: "Dr. Sunita Kapoor", councilRegNo: "MCI-92044", specialization: "Cardiology", hospitalName: "Apollo Hospitals Delhi", status: "Pending" }
  ]);
  const [hospitalApplications, setHospitalApplications] = useState([
    { id: "app-hosp-1", hospitalName: "Sadar Charitable Clinic", registrationNumber: "RE-901-DEL", state: "Delhi", nabhStatus: "NABH Accredited", status: "Pending" }
  ]);
  const [registeredDoctors, setRegisteredDoctors] = useState([
    { username: "dr_verma", password: "password123", fullName: "Dr. Rajesh Verma", specialty: "General Medicine" },
    { username: "dr_sharma", password: "password123", fullName: "Dr. Alok Sharma", specialty: "General Medicine" },
    { username: "dr_jena", password: "password123", fullName: "Dr. B. K. Jena", specialty: "Paediatrics" }
  ]);
  const [registeredHospitals, setRegisteredHospitals] = useState([
    { username: "hosp_max", password: "password123", hospitalName: "Max Super Speciality Hospital" },
    { username: "hosp_prm", password: "12345678", hospitalName: "PRM MEDICAL COLLEGE AND HOSPITAL, BARIPADA" }
  ]);
  const [systemAuditLogs, setSystemAuditLogs] = useState([
    { actor: "Citizen", action: "ABHA_LINK_VERIFIED", details: "Tamanna Kalia linked Dr. Lal PathLabs diagnostics consent.", timestamp: new Date().toISOString() }
  ]);

  // Login variables
  const [activeLoginPortal, setActiveLoginPortal] = useState<"Citizen" | "Doctor" | "Hospital" | "Government" | null>(null);
  const [citizenLoginStep, setCitizenLoginStep] = useState<"input" | "otp" | "not_found" | "create_abha" | "abha_card" | "learn">("input");
  const [citizenLoginMethod, setCitizenLoginMethod] = useState<"mobile" | "abha_id" | "abha_address" | "fingerprint" | "face_id" | "pin">("mobile");
  const [securePinValue, setSecurePinValue] = useState("");
  const [isFingerprintScanning, setIsFingerprintScanning] = useState(false);
  const [isFaceScanning, setIsFaceScanning] = useState(false);
  const [activeCitizenProfile, setActiveCitizenProfile] = useState<"self" | "mother" | "son">("self");
  
  // Citizen Forms
  const [citizenInput, setCitizenInput] = useState("91-2045-8123-5678");
  const [citizenOtp, setCitizenOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  // Create ABHA Form State
  const [citizenRegForm, setCitizenRegForm] = useState({
    fullName: "",
    dob: "",
    gender: "M",
    mobile: "",
    aadhaar: "",
    dl: "",
    email: "",
    address: "",
    state: "",
    district: ""
  });
  const [citizenRegOtp, setCitizenRegOtp] = useState("");
  const [citizenRegOtpSent, setCitizenRegOtpSent] = useState(false);
  const [generatedAbhaCard, setGeneratedAbhaCard] = useState<{
    abhaId: string;
    name: string;
    dob: string;
    gender: string;
  } | null>(null);

  // Citizen Dashboard Security & Consent States
  const [citizenBiometricEnabled, setCitizenBiometricEnabled] = useState(false);
  const [citizenSessionTimeout, setCitizenSessionTimeout] = useState(15);
  const [citizenConsentToggles, setCitizenConsentToggles] = useState({
    shareWithDoctors: true,
    shareWithHospitals: true,
    requireOtpForRecords: false,
    auditSyncing: true
  });
  const [verifiedDevices, setVerifiedDevices] = useState([
    { id: "dev-1", name: "Chrome on macOS (Current Session)", status: "Active" },
    { id: "dev-2", name: "iPhone 15 - Safari Mobile", status: "Linked" }
  ]);

  // Doctor Forms
  const [doctorUsername, setDoctorUsername] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");
  const [doctorOtp, setDoctorOtp] = useState("");
  const [doctorBiometric, setDoctorBiometric] = useState(false);
  const [doctorLoginError, setDoctorLoginError] = useState("");
  
  // Doctor Registration Form State
  const [doctorRegForm, setDoctorRegForm] = useState({
    fullName: "",
    councilRegNo: "",
    licenseNo: "",
    specialization: "General Medicine",
    hospitalName: "",
    clinicAddress: "",
    email: "",
    mobileNumber: "",
    yearsOfExperience: "5",
    licenseFile: "smc_license.pdf",
    govtIdFile: "govt_id.pdf",
    digitalSignature: ""
  });
  const [doctorRegSuccess, setDoctorRegSuccess] = useState(false);

  // Hospital Forms
  const [hospitalUsername, setHospitalUsername] = useState("");
  const [hospitalPassword, setHospitalPassword] = useState("");
  const [hospitalOtp, setHospitalOtp] = useState("");
  const [hospitalLoginError, setHospitalLoginError] = useState("");
  
  // Hospital Registration Form State
  const [hospitalRegForm, setHospitalRegForm] = useState({
    hospitalName: "",
    registrationNumber: "",
    nabhStatus: "NABH Accredited",
    facilityId: "",
    hospitalType: "Private",
    address: "",
    district: "",
    state: "",
    email: "",
    phone: "",
    adminName: "",
    licenseFile: "hosp_license.pdf",
    regCertificate: "hosp_reg_cert.pdf",
    nabhCertificate: "nabh_cert.pdf"
  });
  const [hospitalRegSuccess, setHospitalRegSuccess] = useState(false);

  // Government Forms
  const [govUsername, setGovUsername] = useState("");
  const [govPassword, setGovPassword] = useState("");
  const [govOtp, setGovOtp] = useState("");
  const [govCaptcha, setGovCaptcha] = useState("");
  const [govCaptchaAnswer, setGovCaptchaAnswer] = useState("NIC9");
  const [govHardwareKey, setGovHardwareKey] = useState(false);
  const [govBiometric, setGovBiometric] = useState(false);
  const [govLoginError, setGovLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Doctor Patient Queue
  const [opdQueue, setOpdQueue] = useState<OPDPatient[]>(initialOPDQueue);
  const [activePatient, setActivePatient] = useState<OPDPatient | null>(initialOPDQueue[0]);

  // Teleconsultations & Doctor States
  const [activeDoctorName, setActiveDoctorName] = useState("Dr. Rajesh Verma");
  const [doctorActiveTab, setDoctorActiveTab] = useState<"opd" | "teleconsult">("opd");
  const [teleconsultations, setTeleconsultations] = useState<any[]>([
    {
      id: "tele-1",
      doctorId: "dr_sharma",
      doctorName: "Dr. Alok Sharma",
      specialty: "General Medicine",
      date: "2026-07-15",
      timeSlot: "11:00 AM",
      sharedRecordIds: ["rec-1"],
      status: "Scheduled",
      roomName: "ABDM-Tele-Room-5052",
      citizenNotes: "I am feeling minor chest congestion since last week."
    },
    {
      id: "tele-2",
      doctorId: "dr_jena",
      doctorName: "Dr. B. K. Jena",
      specialty: "Pediatrics",
      date: "2026-07-16",
      timeSlot: "02:30 PM",
      sharedRecordIds: ["rec-2"],
      status: "Scheduled",
      roomName: "ABDM-Tele-Room-9011",
      citizenNotes: "Requesting pediatric growth assessment review."
    }
  ]);

  // General audit log function
  const addAuditLog = (actor: string, action: string, details: string) => {
    const newLog = {
      actor,
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setSystemAuditLogs([newLog, ...systemAuditLogs]);
  };

  // Handle direct bypass logins
  const handleQuickBypass = (role: "Citizen" | "Doctor" | "Hospital" | "Government") => {
    setLoginLoading(true);
    setTimeout(() => {
      setIsLoggedIn(true);
      setActiveUserType(role);
      setLoginLoading(false);
      setAppSection("Dashboard");
      if (role === "Citizen") {
        setActiveScreen("Home");
        addAuditLog("Citizen", "BYPASS_LOGIN", "Tamanna Kalia bypassed OTP authentication via Sandbox clearance.");
      } else if (role === "Doctor") {
        setActiveScreen("DoctorDashboard");
        setActiveDoctorName("Dr. Rajesh Verma");
        addAuditLog("Doctor", "BYPASS_LOGIN", "Dr. Rajesh Verma bypassed HPR credentials via Sandbox clearance.");
      } else if (role === "Hospital") {
        setActiveScreen("HospitalDashboard");
        addAuditLog("Hospital", "BYPASS_LOGIN", "Max Super Speciality Hospital bypassed HFID credentials via Sandbox clearance.");
      } else if (role === "Government") {
        setActiveScreen("GovAnalytics");
        addAuditLog("Government", "BYPASS_LOGIN", "NHA Admin Officer bypassed smart key clearance via Sandbox clearance.");
      }
    }, 800);
  };

  // Form submissions
  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setLoginLoading(true);
      setTimeout(() => {
        setOtpSent(true);
        setLoginLoading(false);
      }, 700);
    } else {
      if (citizenOtp === "123456" || citizenOtp.length > 3) {
        setLoginLoading(true);
        setTimeout(() => {
          setIsLoggedIn(true);
          setActiveUserType("Citizen");
          setAppSection("Dashboard");
          setActiveScreen("Home");
          setLoginLoading(false);
          addAuditLog("Citizen", "OTP_LOGIN", "Citizen Tamanna Kalia logged into ABHA Gateway.");
        }, 800);
      } else {
        showToast("Incorrect secure OTP. Enter test code 123456.", "error");
      }
    }
  };

  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDoctorLoginError("");
    if (!doctorOtp) {
      setDoctorLoginError("Enter 2FA authentication code.");
      return;
    }
    const match = registeredDoctors.find(d => d.username === doctorUsername.trim());
    if (match && doctorPassword === match.password && (doctorOtp === "123456" || doctorOtp.length > 3)) {
      setLoginLoading(true);
      setTimeout(() => {
        setIsLoggedIn(true);
        setActiveUserType("Doctor");
        setActiveDoctorName(`Dr. ${match.fullName}`);
        setAppSection("Dashboard");
        setActiveScreen("DoctorDashboard");
        setLoginLoading(false);
        addAuditLog("Doctor", "HPR_LOGIN", `Dr. ${match.fullName} logged into clinical desk.`);
      }, 800);
    } else {
      setDoctorLoginError("Invalid credentials or 2FA code. Use quick bypass.");
    }
  };

  const handleHospitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHospitalLoginError("");
    if (!hospitalOtp) {
      setHospitalLoginError("Enter 2FA authentication code.");
      return;
    }
    const match = registeredHospitals.find(h => h.username === hospitalUsername.trim());
    if (match && hospitalPassword === match.password && (hospitalOtp === "123456" || hospitalOtp.length > 3)) {
      setLoginLoading(true);
      setTimeout(() => {
        setIsLoggedIn(true);
        setActiveUserType("Hospital");
        setAppSection("Dashboard");
        setActiveScreen("HospitalDashboard");
        setLoginLoading(false);
        addAuditLog("Hospital", "HFID_LOGIN", `${match.hospitalName} logged into facility dashboard.`);
      }, 800);
    } else {
      setHospitalLoginError("Invalid credentials or 2FA code. Use quick bypass.");
    }
  };

  const handleGovSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGovLoginError("");
    if (!govHardwareKey || !govBiometric) {
      setGovLoginError("FIDO Hardware token key and biometric clearances are required.");
      return;
    }
    if (govUsername === "admin" && govPassword === "admin123" && (govOtp === "123456" || govOtp.length > 3) && govCaptcha.trim() === govCaptchaAnswer) {
      setLoginLoading(true);
      setTimeout(() => {
        setIsLoggedIn(true);
        setActiveUserType("Government");
        setAppSection("Dashboard");
        setActiveScreen("GovAnalytics");
        setLoginLoading(false);
        addAuditLog("Government", "NHA_ADMIN_LOGIN", "Gov auditor secure login established.");
      }, 800);
    } else {
      setGovLoginError("Invalid admin credentials or CAPTCHA mismatch. Use quick bypass.");
    }
  };

  const handleBookConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppt: Appointment = {
      id: `appt-${Date.now()}`,
      doctorName: bookingSpecialty === "Cardiology" ? "Dr. Sunita Kapoor" : "Dr. Alok Sharma",
      specialty: bookingSpecialty,
      hospitalName: bookingHospital,
      date: bookingDate,
      time: bookingTime,
      status: "Upcoming"
    };
    setAppointments([newAppt, ...appointments]);
    setBookingSuccessMsg(`Consultation booked successfully! Recipient: ${newAppt.doctorName} at ${newAppt.hospitalName}.`);
    addAuditLog("Citizen", "BOOK_APPOINTMENT", `Booked ${newAppt.specialty} consult for ${newAppt.date}.`);
    setTimeout(() => setBookingSuccessMsg(""), 5000);
  };

  const handleToggleChallenge = (id: string) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === id) {
        const nextState = !c.completed;
        const ptsChange = nextState ? c.points : -c.points;
        setAbhaMetadata(prevMeta => ({
          ...prevMeta,
          rewardPoints: prevMeta.rewardPoints + ptsChange
        }));
        return { ...c, completed: nextState };
      }
      return c;
    }));
  };

  const handleAddPreAuthRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest = {
      id: `PA-${Math.floor(500 + Math.random() * 500)}`,
      hospitalName: preAuthForm.hospitalName,
      treatmentName: preAuthForm.treatmentName,
      specialty: preAuthForm.specialty,
      estimatedCost: preAuthForm.estimatedCost,
      diagnosis: preAuthForm.diagnosis || "General Admission Guidance",
      status: "Processing" as const,
      date: new Date().toISOString().split("T")[0]
    };
    setPreAuthRequests([newRequest, ...preAuthRequests]);
    setPreAuthForm({
      hospitalName: "Max Super Speciality Hospital",
      treatmentName: "",
      specialty: "General Medicine",
      estimatedCost: "",
      diagnosis: ""
    });
    setPreAuthSuccess("Pre-authorization request filed successfully! Linked via secure NHA consent framework.");
    addAuditLog("Citizen", "PMJAY_PREAUTH_SUBMITTED", `Filed cashless pre-auth at ${newRequest.hospitalName} for ${newRequest.treatmentName}`);
    setTimeout(() => setPreAuthSuccess(null), 5000);
  };

  const handleGeneratePreventiveVoucher = (type: string) => {
    const newVch = {
      id: `VCH-${Math.floor(10 + Math.random() * 90)}`,
      type: type,
      code: `PMJAY-PREV-${Math.floor(10 + Math.random() * 90)}`,
      status: "Active",
      validTill: "2026-09-30"
    };
    setEVouchers([newVch, ...eVouchers]);
    setNewVoucherSuccess(`Prevention diagnostic voucher for "${type}" issued under PM-JAY scheme! Code: ${newVch.code}`);
    addAuditLog("Citizen", "PMJAY_VOUCHER_ISSUED", `Issued preventative voucher for ${type}`);
    setTimeout(() => setNewVoucherSuccess(null), 4000);
  };

  const handleAddFamilyMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamilyName.trim() || !newFamilyAbha.trim()) return;
    const newFam = {
      name: newFamilyName,
      relationship: newFamilyRelation,
      abhaId: newFamilyAbha
    };
    setFamilyMembers([...familyMembers, newFam]);
    setNewFamilyName("");
    setNewFamilyAbha("");
    addAuditLog("Citizen", "FAMILY_LINKED", `Linked family account ${newFam.name} (${newFam.relationship})`);
    showToast(`Success! Linked ${newFam.name}'s Health ID card via secure Aadhaar consensus.`, "success");
  };

  const handleApproveDoctorReg = (id: string, generatedUsername: string, tempPass: string) => {
    setDoctorApplications(prev => prev.map(d => d.id === id ? { ...d, status: "Approved", officialUsername: generatedUsername, temporaryPassword: tempPass } : d));
    const approvedDoc = doctorApplications.find(d => d.id === id);
    if (approvedDoc) {
      setRegisteredDoctors(prev => [...prev, {
        username: generatedUsername,
        password: tempPass,
        fullName: approvedDoc.fullName,
        specialty: approvedDoc.specialization
      }]);
      addAuditLog("Government", "HPR_APPROVE", `Verified HPR registry credentials for Dr. ${approvedDoc.fullName}. Generated Temp Credentials.`);
    }
  };

  const handleApproveHospitalReg = (id: string, generatedUsername: string, tempPass: string) => {
    setHospitalApplications(prev => prev.map(h => h.id === id ? { ...h, status: "Approved", officialUsername: generatedUsername, temporaryPassword: tempPass } : h));
    const approvedHosp = hospitalApplications.find(h => h.id === id);
    if (approvedHosp) {
      setRegisteredHospitals(prev => [...prev, {
        username: generatedUsername,
        password: tempPass,
        hospitalName: approvedHosp.hospitalName
      }]);
      addAuditLog("Government", "HFID_APPROVE", `Approved HFID registry empanelment for ${approvedHosp.hospitalName}.`);
    }
  };

  const handleSuspendAccount = (id: string, type: "doctor" | "hospital") => {
    if (type === "doctor") {
      setDoctorApplications(prev => prev.map(d => d.id === id ? { ...d, status: "Suspended" } : d));
      const doc = doctorApplications.find(d => d.id === id);
      if (doc) {
        setRegisteredDoctors(prev => prev.filter(rd => rd.fullName !== doc.fullName));
        addAuditLog("Government", "HPR_SUSPEND", `Suspended HPR clinical credentials for Dr. ${doc.fullName}. Access Revoked.`);
      }
    } else {
      setHospitalApplications(prev => prev.map(h => h.id === id ? { ...h, status: "Suspended" } : h));
      const hosp = hospitalApplications.find(h => h.id === id);
      if (hosp) {
        setRegisteredHospitals(prev => prev.filter(rh => rh.hospitalName !== hosp.hospitalName));
        addAuditLog("Government", "HFID_SUSPEND", `Suspended empanelment registry for ${hosp.hospitalName}. Linked transactions frozen.`);
      }
    }
  };

  const handleDoctorAddPrescription = (patientId: string, prescriptionData: any) => {
    setMedicalRecords([
      {
        id: `rec-doc-${Date.now()}`,
        date: prescriptionData.date,
        title: prescriptionData.title,
        institution: prescriptionData.institution,
        doctorName: prescriptionData.doctorName,
        type: "Prescription",
        summary: prescriptionData.summary,
        status: "Linked"
      },
      ...medicalRecords
    ]);
    setOpdQueue(prev => prev.map(p => p.id === patientId ? { ...p, status: "Completed" } : p));
    addAuditLog("Doctor", "PRESCRIPTION_SYNC", `Synced EHR prescription to patient ABHA Health Timeline.`);
  };

  // Log out routine
  const handleLogout = () => {
    setIsLoggedIn(false);
    setOtpSent(false);
    setAppSection("Welcome");
    setCitizenOtp("");
    setDoctorOtp("");
    setHospitalOtp("");
    setGovOtp("");
  };

  // ==========================================
  // FULL-SCREEN SCREENS (OUTSIDE PHONE FRAME)
  // ==========================================

  if (appSection === "Splash") {
    return (
      <SplashScreen
        onComplete={() => setAppSection("Welcome")}
        lang={lang}
        onSelectLang={(newLang) => setLang(newLang)}
      />
    );
  }

  if (appSection === "Welcome") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col select-none overflow-x-hidden font-sans">
        {/* Dynamic header with national flag colors */}
        <div className="h-1.5 bg-gradient-to-r from-orange-500 via-white to-green-600 shrink-0"></div>
        
        {/* Top Navbar */}
        <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-850 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <HealthShieldLogo
              size="md"
              showWordmark={true}
              animated={true}
              subtitle="National Digital Health Mission Gateway"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAppSection("Splash")}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 p-1.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Replay ABDM Splash Screen"
            >
              <Activity className="h-3.5 w-3.5 text-orange-500" />
              <span>Intro</span>
            </button>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-slate-400" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as any)}
                className="p-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer focus:outline-none shadow-sm text-slate-700"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिन्दी (HI)</option>
                <option value="mr">मराठी (MR)</option>
                <option value="or">ଓଡ଼ିଆ (OR)</option>
              </select>
            </div>
          </div>
        </header>

        {/* Main Landing Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Comprehensive NHA Information Panel */}
          <div className="lg:col-span-7 space-y-8 animate-fade-in text-left">
            
            {/* Title & Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <HealthShieldLogo size="lg" animated={true} variant="icon-only" />
                <div>
                  <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 px-3 py-1 rounded-full text-blue-700 dark:text-blue-400 text-xs font-bold font-sans">
                    <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" /> Official ABDM Ecosystem Gateway
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-sans leading-tight mt-1">
                    HealthShield <span className="text-orange-500">Bharat</span>
                  </h2>
                </div>
              </div>
              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Introducing a comprehensive, high-fidelity sandbox companion for the Ayushman Bharat Digital Mission (ABDM). This multi-portal application bridges citizens, doctors, hospitals, and national administrators onto a single secure platform. It demonstrates digital consents, FHIR-compliant record linkages, AI diagnostic insights, and real-time healthcare resource monitoring to accelerate digital health adoption across India.
              </p>
            </div>

            {/* Live Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "ABHA Card Holders", value: "45.2 Cr+", color: "text-blue-600 dark:text-blue-400" },
                { label: "Empaneled Facilities", value: "1.8 Lakh+", color: "text-emerald-600 dark:text-emerald-400" },
                { label: "Digital Consultations", value: "2.1 Cr+", color: "text-amber-600 dark:text-amber-400" }
              ].map((st, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm hover:shadow-md transition">
                  <p className="text-2xl font-black font-sans leading-none tracking-tight text-slate-900 dark:text-white">{st.value}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase mt-2 leading-tight tracking-wider">{st.label}</p>
                </div>
              ))}
            </div>

            {/* Objectives Section */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
              <h3 className="text-lg font-bold font-sans text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Objectives
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex gap-2.5 items-start">
                  <span className="text-emerald-500 font-black mt-0.5">•</span>
                  <span><strong>Standardize electronic health records (EHR)</strong> using FHIR-compliant secure schemas.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="text-emerald-500 font-black mt-0.5">•</span>
                  <span><strong>Enhance patient-centric data ownership</strong> via an on-demand secure digital consent ledger.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="text-emerald-500 font-black mt-0.5">•</span>
                  <span><strong>Accelerate PM-JAY cashless subsidy disbursements</strong> transparently without paper records.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="text-emerald-500 font-black mt-0.5">•</span>
                  <span><strong>Empower clinics and clinicians</strong> with voice prescriber pads and automated AI diagnostics.</span>
                </li>
              </ul>
            </div>

            {/* Key Features & Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key Features */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-3">
                <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Sparkles className="h-5 w-5 text-blue-500" /> Key Features
                </h3>
                <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="h-2 w-2 bg-blue-500 rounded-full mt-1.5"></span>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-100">Citizen Secure Locker:</strong>
                      <p className="mt-0.5 text-slate-500 dark:text-slate-400">ABHA cards, health logs, PM-JAY claims, and AI-explained diagnostics.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-2 w-2 bg-blue-500 rounded-full mt-1.5"></span>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-100">Clinician HPR Desk:</strong>
                      <p className="mt-0.5 text-slate-500 dark:text-slate-400">Symptom speech transcriptions, digital prescribing, and instant EHR syncing.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-2 w-2 bg-blue-500 rounded-full mt-1.5"></span>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-100">Hospital Bed vacancy:</strong>
                      <p className="mt-0.5 text-slate-500 dark:text-slate-400">Interactive live vacancy list, emergency triaging, and OPD queue tracker.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Benefits */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-3">
                <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Award className="h-5 w-5 text-emerald-500" /> Benefits
                </h3>
                <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <span className="h-2 w-2 bg-emerald-500 rounded-full mt-1.5"></span>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-100">Paperless Healthcare:</strong>
                      <p className="mt-0.5 text-slate-500 dark:text-slate-400">Eliminates physical records, duplicate scans, and diagnostic file clutter.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-2 w-2 bg-emerald-500 rounded-full mt-1.5"></span>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-100">Absolute Transparency:</strong>
                      <p className="mt-0.5 text-slate-500 dark:text-slate-400">Secured digital claims pre-auth under national PM-JAY registry guidelines.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="h-2 w-2 bg-emerald-500 rounded-full mt-1.5"></span>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-100">Gamified Well-being:</strong>
                      <p className="mt-0.5 text-slate-500 dark:text-slate-400">Earn direct wellness points for physical targets and diagnostic milestones.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Simulation Guide */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
              <h3 className="text-lg font-bold font-sans text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <Info className="h-5 w-5 text-amber-500" /> Quick Simulation Guide
              </h3>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>Follow these quick sandbox steps to evaluate our digital health prototype:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-3">
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-150 dark:border-slate-850">
                    <span className="font-extrabold text-blue-600 dark:text-blue-400 block mb-1">Step 1: Citizen Wallet</span>
                    <span>Click the Citizen portal card. Sign in instantly using our secure <strong>Fast Bypass</strong> to browse the health score, linked history, and PM-JAY vouchers.</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-150 dark:border-slate-850">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block mb-1">Step 2: Doctor Panel</span>
                    <span>Access HPR Practitioner Desk. Check waitlists, transcribe symptoms, or issue digital prescriptions linked instantly to patient ABHA records.</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-150 dark:border-slate-850">
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400 block mb-1">Step 3: Hospital Desk</span>
                    <span>Manage bed vacancy listings, update patient room files, register check-ins, or process automated PM-JAY scheme vouchers.</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-150 dark:border-slate-850">
                    <span className="font-extrabold text-amber-600 dark:text-amber-400 block mb-1">Step 4: Government Hub</span>
                    <span>Empanel facilities, certify clinicians, view geographical heatmaps, and inspect the real-time cryptographic audit trail.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Why This Improves Adoption */}
            <div className="bg-blue-500/10 dark:bg-blue-500/5 border border-blue-500/25 dark:border-blue-500/15 p-6 rounded-2xl text-slate-800 dark:text-slate-100 text-sm leading-relaxed space-y-2">
              <h4 className="font-bold text-base text-blue-700 dark:text-blue-400">Why this solution improves ABDM adoption</h4>
              <p>
                Standard health databases often feel passive and overly technical, discouraging voluntary enrollment. Our companion solves this by gamifying preventative milestones, introducing localized speech-to-text translators for clinical prescriptions, and providing high-fidelity transparency. By demonstrating immediate, tangible value for patients, doctors, and hospitals, it turns compliance into an intuitive national lifestyle utility.
              </p>
            </div>

          </div>

          {/* Right Column: Interactive Portal Gateway (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white dark:bg-slate-900 p-6 lg:p-8 rounded-3xl border-2 border-blue-600 dark:border-blue-500/30 shadow-xl space-y-5 animate-fade-in">
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest block">Interactive Gateway</span>
                <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                  Select Portal to Sign In
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  Choose a health registry segment below to launch its dedicated sub-application.
                </p>
              </div>

              {/* Portal selection list with detailed bullet list as requested */}
              <div className="space-y-4">
                {[
                  {
                    role: "Citizen" as const,
                    title: "👤 Citizen Portal",
                    items: ["ABHA Health Locker", "AI Health Assistant", "PM-JAY Integration", "Health Records", "Rewards & Wellness"],
                    color: "border-blue-200 dark:border-blue-900 hover:border-blue-500 hover:bg-blue-50/25 dark:hover:bg-blue-950/20",
                    btnColor: "bg-blue-600 hover:bg-blue-700 active:scale-95"
                  },
                  {
                    role: "Doctor" as const,
                    title: "🩺 Doctor Panel",
                    items: ["Digital Prescription", "Patient Health Records", "AI Medical Summary", "Voice Notes", "Appointment Management"],
                    color: "border-emerald-200 dark:border-emerald-900 hover:border-emerald-500 hover:bg-emerald-50/25 dark:hover:bg-emerald-950/20",
                    btnColor: "bg-emerald-600 hover:bg-emerald-700 active:scale-95"
                  },
                  {
                    role: "Hospital" as const,
                    title: "🏥 Hospital Control",
                    items: ["Bed Management", "Patient Registration", "Billing", "Laboratory Integration", "Pharmacy Integration", "Analytics Dashboard"],
                    color: "border-indigo-200 dark:border-indigo-900 hover:border-indigo-500 hover:bg-indigo-50/25 dark:hover:bg-indigo-950/20",
                    btnColor: "bg-indigo-600 hover:bg-indigo-700 active:scale-95"
                  },
                  {
                    role: "Government" as const,
                    title: "🇮🇳 National Government Dashboard",
                    items: ["Doctor Verification", "Hospital Approval", "ABDM Adoption Analytics", "Disease Heatmaps", "Audit Logs", "Public Health Insights"],
                    color: "border-amber-200 dark:border-amber-900 hover:border-amber-500 hover:bg-amber-50/25 dark:hover:bg-amber-950/20",
                    btnColor: "bg-amber-600 hover:bg-amber-700 active:scale-95"
                  }
                ].map((portal) => (
                  <div
                    key={portal.role}
                    onClick={() => {
                      setActiveLoginPortal(portal.role);
                      setCitizenLoginStep("input");
                      setOtpSent(false);
                      setDoctorRegSuccess(false);
                      setHospitalRegSuccess(false);
                    }}
                    className={`p-4 rounded-2xl border bg-slate-50/50 dark:bg-slate-950/40 text-left transition duration-200 cursor-pointer hover:shadow-md hover:scale-[1.01] ${portal.color}`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1.5 flex-1">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white font-sans">{portal.title}</h4>
                        {/* Bullets block as requested */}
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          {portal.items.map((it, idx) => (
                            <span key={idx} className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-sans font-medium">
                              <span className="h-1 w-1 bg-slate-400 rounded-full"></span> {it}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // prevent double trigger
                          setActiveLoginPortal(portal.role);
                          setCitizenLoginStep("input");
                          setOtpSent(false);
                          setDoctorRegSuccess(false);
                          setHospitalRegSuccess(false);
                        }}
                        className={`text-xs font-bold text-white py-2 px-4 rounded-xl flex items-center gap-1 shrink-0 shadow-sm transition transform active:scale-95 ${portal.btnColor}`}
                      >
                        Enter <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-150 dark:border-slate-800 pt-4 flex justify-between items-center text-[10px] text-slate-400 font-medium">
                <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-emerald-500" /> Aadhaar Verified Gateways</span>
                <span>Version 1.2.0 (Stable)</span>
              </div>
            </div>
          </div>

        </main>

        {/* Dynamic Footer */}
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-850 px-6 py-4 mt-auto text-xs text-slate-500 dark:text-slate-400 text-center shrink-0">
          <p>© 2026 National Health Authority • Department of Health & Family Welfare • Government of India</p>
        </footer>

        {/* ==========================================
            SECURE FLOATING LOGIN & REGISTRATION MODAL
            ========================================== */}
        {activeLoginPortal && (
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-[100] flex justify-center items-center p-4 overflow-y-auto select-text">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto flex flex-col font-sans p-6 relative animate-scale-up text-slate-800 dark:text-slate-100">
              
              {/* Close Button */}
              <button
                onClick={() => {
                  setActiveLoginPortal(null);
                  setCitizenLoginStep("input");
                  setOtpSent(false);
                  setDoctorRegSuccess(false);
                  setHospitalRegSuccess(false);
                }}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
              >
                ✕
              </button>

              {/* Modal Header */}
              <div className="text-left border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    ABDM Secure Sandbox Environment
                  </span>
                </div>
                <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  {activeLoginPortal === "Citizen" && "👤 Citizen Health Wallet Gateway"}
                  {activeLoginPortal === "Doctor" && "🩺 HPR Practitioner Registry"}
                  {activeLoginPortal === "Hospital" && "🏥 HFID Facility Control Desk"}
                  {activeLoginPortal === "Government" && "🇮🇳 NHA National Administration Gate"}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Ayushman Bharat Digital Mission • Ministry of Health, Govt of India
                </p>
              </div>

              {/* Sandbox Quick Bypass Clearances - PERFECT FOR EVALUATORS */}
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-3 text-left text-xs mb-4">
                <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400">
                  <Sparkles className="h-4 w-4 text-amber-500 animate-spin" />
                  <span>Sandbox Testing Clearance</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                  Skip the standard clinical and dual-factor authentications. Tap the bypass button below to access the full-screen dashboard instantly.
                </p>
                <button
                  onClick={() => {
                    handleQuickBypass(activeLoginPortal);
                    setActiveLoginPortal(null);
                  }}
                  className="w-full mt-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-[10px] py-1.5 rounded-xl transition transform active:scale-95 shadow flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Fingerprint className="h-4 w-4" /> Fast Bypass Login as {activeLoginPortal}
                </button>
              </div>

              {/* Dynamic Modal Contents */}
              <div className="flex-1 text-xs text-left">
                
                {/* ----------------- CITIZEN PORTAL MODAL ----------------- */}
                {activeLoginPortal === "Citizen" && (
                  <div className="space-y-4">
                    {/* Tab Selectors */}
                    <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
                      <button
                        onClick={() => setCitizenLoginStep("input")}
                        className={`flex-1 py-1.5 text-center font-bold rounded-lg cursor-pointer transition ${
                          citizenLoginStep === "input" || citizenLoginStep === "otp" || citizenLoginStep === "not_found"
                            ? "bg-white dark:bg-slate-850 shadow-sm text-blue-600 dark:text-blue-400"
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        Aadhaar / Mobile Login
                      </button>
                      <button
                        onClick={() => {
                          setCitizenLoginStep("create_abha");
                          setCitizenRegOtpSent(false);
                          setGeneratedAbhaCard(null);
                        }}
                        className={`flex-1 py-1.5 text-center font-bold rounded-lg cursor-pointer transition ${
                          citizenLoginStep === "create_abha" || citizenLoginStep === "abha_card"
                            ? "bg-white dark:bg-slate-850 shadow-sm text-blue-600 dark:text-blue-400"
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        Create New ABHA ID
                      </button>
                      <button
                        onClick={() => setCitizenLoginStep("learn")}
                        className={`flex-1 py-1.5 text-center font-bold rounded-lg cursor-pointer transition ${
                          citizenLoginStep === "learn"
                            ? "bg-white dark:bg-slate-850 shadow-sm text-blue-600 dark:text-blue-400"
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        Learn Info
                      </button>
                    </div>

                    {/* CITIZEN SUB-VIEWS */}
                    {(citizenLoginStep === "input" || citizenLoginStep === "not_found") && (
                      <div className="space-y-4 text-xs font-sans">
                        {/* Interactive Authentication Method Switcher Grid */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Choose Authentication Method
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: "mobile", label: "Mobile OTP", icon: PhoneCall, color: "border-blue-200 dark:border-blue-900 text-blue-600" },
                              { id: "abha_id", label: "ABHA ID", icon: CreditCard, color: "border-indigo-200 dark:border-indigo-900 text-indigo-600" },
                              { id: "abha_address", label: "ABHA Address", icon: Globe, color: "border-teal-200 dark:border-teal-900 text-teal-600" },
                              { id: "fingerprint", label: "Fingerprint", icon: Fingerprint, color: "border-emerald-200 dark:border-emerald-900 text-emerald-600" },
                              { id: "face_id", label: "Face ID", icon: UserCheck, color: "border-rose-200 dark:border-rose-900 text-rose-600" },
                              { id: "pin", label: "Secure PIN", icon: Key, color: "border-amber-200 dark:border-amber-900 text-amber-600" }
                            ].map((m) => {
                              const IconComponent = m.icon;
                              const isSelected = citizenLoginMethod === m.id;
                              return (
                                <button
                                  key={m.id}
                                  type="button"
                                  onClick={() => {
                                    setCitizenLoginMethod(m.id as any);
                                    setCitizenLoginStep("input");
                                    setSecurePinValue("");
                                    setIsFingerprintScanning(false);
                                    setIsFaceScanning(false);
                                  }}
                                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition text-center cursor-pointer ${
                                    isSelected
                                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-950 dark:border-white font-extrabold shadow-sm"
                                      : "bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 " + m.color
                                  }`}
                                >
                                  <IconComponent className="h-4 w-4 shrink-0" />
                                  <span className="text-[9px] leading-none tracking-tight">{m.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 1. Mobile Number + OTP */}
                        {citizenLoginMethod === "mobile" && (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const val = citizenInput.trim();
                              if (val === "9876543210" || val === "91-2045-8123-5678" || (generatedAbhaCard && (val === generatedAbhaCard.abhaId || val === citizenRegForm.mobile))) {
                                setCitizenLoginStep("otp");
                                addAuditLog("Citizen", "ABHA_DETECTION_SUCCESS", `Smart detected linked ABHA profile: Tamanna Kalia.`);
                              } else {
                                setCitizenLoginStep("not_found");
                                addAuditLog("Citizen", "ABHA_DETECTION_FAILED", `No linked ABHA ID found for: ${val}`);
                              }
                            }}
                            className="space-y-3 pt-2"
                          >
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">
                                Registered Indian Mobile Number
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-400 font-bold font-sans">+91</span>
                                <input
                                  type="tel"
                                  required
                                  maxLength={10}
                                  placeholder="e.g. 9876543210"
                                  value={citizenInput === "91-2045-8123-5678" ? "9876543210" : citizenInput}
                                  onChange={(e) => setCitizenInput(e.target.value)}
                                  className="w-full pl-11 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-medium tracking-wide"
                                />
                              </div>
                              <p className="text-[9px] text-slate-400">
                                Enter <strong>9876543210</strong> to instantly retrieve profile Tamanna Kalia.
                              </p>
                            </div>

                            {citizenLoginStep === "not_found" && (
                              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl space-y-2">
                                <p className="font-bold">No ABHA account found!</p>
                                <p className="text-[10px]">
                                  No registered ABHA ID is linked with "{citizenInput}". Would you like to create your ABHA ID to securely access digital health services?
                                </p>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCitizenLoginStep("create_abha");
                                      setCitizenRegOtpSent(false);
                                      setGeneratedAbhaCard(null);
                                    }}
                                    className="bg-red-600 text-white font-bold px-3 py-1 rounded-lg text-[10px] cursor-pointer"
                                  >
                                    Create New ABHA ID
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setCitizenLoginStep("learn")}
                                    className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-3 py-1 rounded-lg text-[10px]"
                                  >
                                    Learn About ABHA
                                  </button>
                                </div>
                              </div>
                            )}

                            <button
                              type="submit"
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle className="h-4 w-4" /> Request Secure OTP Code
                            </button>
                          </form>
                        )}

                        {/* 2. ABHA ID + OTP */}
                        {citizenLoginMethod === "abha_id" && (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              const val = citizenInput.trim();
                              if (val === "91-2045-8123-5678" || val === "9876543210" || (generatedAbhaCard && val === generatedAbhaCard.abhaId)) {
                                setCitizenLoginStep("otp");
                                addAuditLog("Citizen", "ABHA_DETECTION_SUCCESS", `Smart detected linked ABHA profile: Tamanna Kalia.`);
                              } else {
                                setCitizenLoginStep("not_found");
                              }
                            }}
                            className="space-y-3 pt-2"
                          >
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">
                                Enter 14-Digit ABHA ID (xx-xxxx-xxxx-xxxx)
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. 91-2045-8123-5678"
                                value={citizenInput}
                                onChange={(e) => setCitizenInput(e.target.value)}
                                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-center text-xs tracking-wider"
                              />
                              <p className="text-[9px] text-slate-400">
                                Try standard testing ABHA ID: <strong>91-2045-8123-5678</strong>.
                              </p>
                            </div>

                            {citizenLoginStep === "not_found" && (
                              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl space-y-2">
                                <p className="font-bold">No registered ABHA ID exists!</p>
                                <p className="text-[10px]">
                                  We couldn't locate any active health locker profile matching "{citizenInput}". Please register a new ABHA health ID cards instantly.
                                </p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCitizenLoginStep("create_abha");
                                    setCitizenRegOtpSent(false);
                                    setGeneratedAbhaCard(null);
                                  }}
                                  className="bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg text-[10px]"
                                >
                                  Create My ABHA ID Now
                                </button>
                              </div>
                            )}

                            <button
                              type="submit"
                              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle className="h-4 w-4" /> Request Verification OTP
                            </button>
                          </form>
                        )}

                        {/* 3. ABHA Address */}
                        {citizenLoginMethod === "abha_address" && (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              setIsLoggedIn(true);
                              setActiveUserType("Citizen");
                              setAppSection("Dashboard");
                              setActiveScreen("Home");
                              setActiveLoginPortal(null);
                              addAuditLog("Citizen", "ADDRESS_PASSLESS_LOGIN", `Logged in securely using ABHA Address credentials.`);
                            }}
                            className="space-y-3 pt-2"
                          >
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">
                                Enter Your ABHA Address
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. aarav"
                                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pr-16 font-sans font-bold text-slate-800 dark:text-slate-100"
                                />
                                <span className="absolute right-3 top-2.5 text-slate-400 font-extrabold">@abdm</span>
                              </div>
                              <p className="text-[9px] text-slate-400">
                                Connect effortlessly via your customized alias (e.g., <strong>aarav@abdm</strong>).
                              </p>
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <UserCheck className="h-4 w-4" /> Validate ABHA Address & Login
                            </button>
                          </form>
                        )}

                        {/* 4. Fingerprint Login */}
                        {citizenLoginMethod === "fingerprint" && (
                          <div className="space-y-4 pt-3 text-center flex flex-col items-center">
                            <div className={`p-5 rounded-full border-2 transition-all duration-300 ${
                              isFingerprintScanning 
                                ? "bg-emerald-500/10 border-emerald-500 animate-pulse text-emerald-500" 
                                : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-emerald-500 hover:border-emerald-500"
                            }`}>
                              <Fingerprint className={`h-12 w-12 stroke-[1.5] ${isFingerprintScanning ? "scale-110" : ""}`} />
                            </div>

                            <div className="space-y-1 max-w-[280px]">
                              <p className="font-extrabold text-slate-800 dark:text-slate-100">
                                {isFingerprintScanning ? "Scanning Fingerprint..." : "Touch Biometric Sensor"}
                              </p>
                              <p className="text-[10.5px] text-slate-500 leading-snug">
                                {isFingerprintScanning 
                                  ? "Verifying cryptographically backed biometric FIDO2 credentials..." 
                                  : "Place your thumb or index finger on your device's fingerprint scanner or click scan below."}
                              </p>
                            </div>

                            <button
                              type="button"
                              disabled={isFingerprintScanning}
                              onClick={() => {
                                setIsFingerprintScanning(true);
                                setTimeout(() => {
                                  setIsLoggedIn(true);
                                  setActiveUserType("Citizen");
                                  setAppSection("Dashboard");
                                  setActiveScreen("Home");
                                  setActiveLoginPortal(null);
                                  setIsFingerprintScanning(false);
                                  addAuditLog("Citizen", "BIOMETRIC_FINGERPRINT_SUCCESS", "Tamanna Kalia authenticated securely via FIDO2 Passkey Biometrics.");
                                }, 1500);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold px-5 py-2 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
                            >
                              {isFingerprintScanning ? "Reading Passkeys..." : "Scan Fingerprint Now"}
                            </button>
                          </div>
                        )}

                        {/* 5. Face ID Login */}
                        {citizenLoginMethod === "face_id" && (
                          <div className="space-y-4 pt-3 text-center flex flex-col items-center">
                            {/* Simulated Camera Scanner View */}
                            <div className="relative h-28 w-28 rounded-2xl border-2 border-slate-300 dark:border-slate-800 overflow-hidden flex items-center justify-center bg-slate-950/90 shadow-inner group">
                              <div className={`absolute inset-0 border-2 transition-all duration-300 ${isFaceScanning ? "border-rose-500 animate-pulse" : "border-transparent"}`}></div>
                              
                              {/* Glowing Scan Line */}
                              {isFaceScanning && (
                                <div className="absolute left-0 right-0 h-1 bg-rose-500 shadow-md shadow-rose-500/50 animate-bounce top-0"></div>
                              )}

                              <User className={`h-12 w-12 transition-all duration-300 ${isFaceScanning ? "text-rose-400 scale-105" : "text-slate-500"}`} />
                              <span className="absolute bottom-1 text-[8px] text-slate-400 uppercase tracking-widest font-mono">SIM-CAM-01</span>
                            </div>

                            <div className="space-y-1 max-w-[280px]">
                              <p className="font-extrabold text-slate-800 dark:text-slate-100">
                                {isFaceScanning ? "Scanning Face Geometry..." : "Face ID Authentication"}
                              </p>
                              <p className="text-[10.5px] text-slate-500 leading-snug">
                                {isFaceScanning 
                                  ? "Aligning markers... Match found: Tamanna Kalia (99.8%)" 
                                  : "Align your face with the camera frame to execute secure, passwordless authentication."}
                              </p>
                            </div>

                            <button
                              type="button"
                              disabled={isFaceScanning}
                              onClick={() => {
                                setIsFaceScanning(true);
                                setTimeout(() => {
                                  setIsLoggedIn(true);
                                  setActiveUserType("Citizen");
                                  setAppSection("Dashboard");
                                  setActiveScreen("Home");
                                  setActiveLoginPortal(null);
                                  setIsFaceScanning(false);
                                  addAuditLog("Citizen", "BIOMETRIC_FACE_SUCCESS", "Tamanna Kalia authenticated securely via Face ID scanner.");
                                }, 1500);
                              }}
                              className="bg-rose-600 hover:bg-rose-700 disabled:bg-slate-400 text-white font-bold px-5 py-2 rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
                            >
                              {isFaceScanning ? "Processing Cam Data..." : "Activate Camera Scan"}
                            </button>
                          </div>
                        )}

                        {/* 6. Secure PIN */}
                        {citizenLoginMethod === "pin" && (
                          <div className="space-y-3 pt-2 text-center flex flex-col items-center">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Enter 4-Digit Secure App PIN
                            </label>

                            {/* Passcode Dots */}
                            <div className="flex gap-4 my-2">
                              {[0, 1, 2, 3].map((idx) => {
                                const hasChar = securePinValue.length > idx;
                                return (
                                  <div
                                    key={idx}
                                    className={`h-3 w-3 rounded-full transition-all duration-150 ${
                                      hasChar 
                                        ? "bg-amber-500 scale-110" 
                                        : "bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                                    }`}
                                  ></div>
                                );
                              })}
                            </div>

                            {/* Passcode Validation Hint */}
                            <p className="text-[10px] text-slate-400">
                              Demo Hint: Pin is <strong>1234</strong>.
                            </p>

                            {/* Custom Keypad Layout */}
                            <div className="grid grid-cols-3 gap-2 max-w-[210px] w-full mt-1.5">
                              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "Clear", "0", "OK"].map((val) => {
                                return (
                                  <button
                                    key={val}
                                    type="button"
                                    onClick={() => {
                                      if (val === "Clear") {
                                        setSecurePinValue("");
                                      } else if (val === "OK") {
                                        if (securePinValue === "1234") {
                                          setIsLoggedIn(true);
                                          setActiveUserType("Citizen");
                                          setAppSection("Dashboard");
                                          setActiveScreen("Home");
                                          setActiveLoginPortal(null);
                                          addAuditLog("Citizen", "PIN_LOGIN_SUCCESS", "Tamanna Kalia logged in via App PIN.");
                                        } else {
                                          showToast("PIN code mismatch. Please enter the valid test PIN 1234.", "error");
                                          setSecurePinValue("");
                                        }
                                      } else {
                                        if (securePinValue.length < 4) {
                                          setSecurePinValue(securePinValue + val);
                                        }
                                      }
                                    }}
                                    className="p-3 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-850 rounded-xl text-xs font-black transition cursor-pointer text-slate-800 dark:text-slate-100"
                                  >
                                    {val}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {citizenLoginStep === "otp" && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (citizenOtp === "123456" || citizenOtp.length > 3) {
                            setIsLoggedIn(true);
                            setActiveUserType("Citizen");
                            setAppSection("Dashboard");
                            setActiveScreen("Home");
                            setActiveLoginPortal(null);
                            addAuditLog("Citizen", "OTP_LOGIN_SUCCESS", `Citizen logged in securely via OTP authentication.`);
                          } else {
                            showToast("Invalid verification code! Use test OTP: 123456", "error");
                          }
                        }}
                        className="space-y-3"
                      >
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-700 dark:text-emerald-400">
                          <p className="font-bold">✓ Profile Detected!</p>
                          <p className="text-[10px] mt-0.5">
                            Ayushman record linked to <strong>Tamanna Kalia</strong>. Secure OTP code has been dispatched to mobile ending in ******210.
                          </p>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">
                            Enter 6-Digit Secure Verification OTP
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            placeholder="Enter test code: 123456"
                            value={citizenOtp}
                            onChange={(e) => setCitizenOtp(e.target.value)}
                            className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-center text-sm tracking-widest font-bold"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
                        >
                          Verify OTP & Access Wallet
                        </button>
                      </form>
                    )}

                    {citizenLoginStep === "create_abha" && (
                      <div className="space-y-3">
                        {!citizenRegOtpSent ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              setCitizenRegOtpSent(true);
                              addAuditLog("Citizen", "ABHA_REG_OTP_SENT", `Requested registry OTP verification for Aadhaar ending in ${citizenRegForm.aadhaar.slice(-4)}`);
                            }}
                            className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 text-[11px]"
                          >
                            <p className="text-slate-500">
                              ABHA (Ayushman Bharat Health Account) is your unique 14-digit digital healthcare identity which enables seamless record sharing across India.
                            </p>

                            <div className="grid grid-cols-2 gap-2.5">
                              <div>
                                <label className="font-bold text-slate-400">Full Name (As in ID)</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Alok Roy"
                                  value={citizenRegForm.fullName}
                                  onChange={(e) => setCitizenRegForm({ ...citizenRegForm, fullName: e.target.value })}
                                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                                />
                              </div>
                              <div>
                                <label className="font-bold text-slate-400">Date of Birth</label>
                                <input
                                  type="date"
                                  required
                                  value={citizenRegForm.dob}
                                  onChange={(e) => setCitizenRegForm({ ...citizenRegForm, dob: e.target.value })}
                                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                              <div>
                                <label className="font-bold text-slate-400">Gender</label>
                                <select
                                  value={citizenRegForm.gender}
                                  onChange={(e) => setCitizenRegForm({ ...citizenRegForm, gender: e.target.value })}
                                  className="w-full p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                                >
                                  <option value="M">Male</option>
                                  <option value="F">Female</option>
                                  <option value="O">Other</option>
                                </select>
                              </div>
                              <div>
                                <label className="font-bold text-slate-400">Mobile (Linked to Aadhaar)</label>
                                <input
                                  type="tel"
                                  required
                                  placeholder="e.g. 9830012345"
                                  value={citizenRegForm.mobile}
                                  onChange={(e) => setCitizenRegForm({ ...citizenRegForm, mobile: e.target.value })}
                                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                              <div>
                                <label className="font-bold text-slate-400">Aadhaar Card (Optional)</label>
                                <input
                                  type="text"
                                  placeholder="12-digit Aadhaar"
                                  value={citizenRegForm.aadhaar}
                                  onChange={(e) => setCitizenRegForm({ ...citizenRegForm, aadhaar: e.target.value })}
                                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                                />
                              </div>
                              <div>
                                <label className="font-bold text-slate-400">Driving Licence No (Optional)</label>
                                <input
                                  type="text"
                                  placeholder="e.g. DL-14201"
                                  value={citizenRegForm.dl}
                                  onChange={(e) => setCitizenRegForm({ ...citizenRegForm, dl: e.target.value })}
                                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="font-bold text-slate-400">Email Address</label>
                              <input
                                type="email"
                                placeholder="e.g. alok@mail.in"
                                value={citizenRegForm.email}
                                onChange={(e) => setCitizenRegForm({ ...citizenRegForm, email: e.target.value })}
                                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-bold text-slate-400">Residential Address</label>
                              <textarea
                                placeholder="Full street address..."
                                value={citizenRegForm.address}
                                onChange={(e) => setCitizenRegForm({ ...citizenRegForm, address: e.target.value })}
                                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px] h-14 resize-none"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                              <div>
                                <label className="font-bold text-slate-400">State</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Maharashtra"
                                  value={citizenRegForm.state}
                                  onChange={(e) => setCitizenRegForm({ ...citizenRegForm, state: e.target.value })}
                                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                                />
                              </div>
                              <div>
                                <label className="font-bold text-slate-400">District</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Pune"
                                  value={citizenRegForm.district}
                                  onChange={(e) => setCitizenRegForm({ ...citizenRegForm, district: e.target.value })}
                                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition"
                            >
                              Send Verification OTP to Mobile
                            </button>
                          </form>
                        ) : (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (citizenRegOtp === "123456" || citizenRegOtp.length > 3) {
                                // Generate ABHA
                                const randNum = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
                                const newCard = {
                                  abhaId: randNum,
                                  name: citizenRegForm.fullName || "Tamanna Kalia",
                                  dob: citizenRegForm.dob || "1999-05-18",
                                  gender: citizenRegForm.gender || "F"
                                };
                                setGeneratedAbhaCard(newCard);
                                setCitizenLoginStep("abha_card");
                                setAbhaMetadata({
                                  abhaId: randNum,
                                  name: citizenRegForm.fullName || "Tamanna Kalia",
                                  gender: citizenRegForm.gender || "F",
                                  dob: citizenRegForm.dob || "1999-05-18",
                                  mobile: citizenRegForm.mobile || "9876543210",
                                  healthScore: 80,
                                  rewardPoints: 100
                                });
                                setCitizenInput(randNum);
                                addAuditLog("Citizen", "ABHA_CARD_GENERATED", `Issued new 14-digit digital ID card: ${randNum} to ${citizenRegForm.fullName}.`);
                              } else {
                                showToast("Invalid registry OTP. Use test code: 123456", "error");
                              }
                            }}
                            className="space-y-3"
                          >
                            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-700 dark:text-blue-400">
                              <p className="font-bold">Security OTP Sent!</p>
                              <p className="text-[10px] mt-0.5">
                                Please enter the verification OTP sent to Aadhaar-linked mobile <strong>{citizenRegForm.mobile}</strong>.
                              </p>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-slate-400 uppercase">
                                Enter 6-Digit ID Verification OTP
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="Enter test code: 123456"
                                value={citizenRegOtp}
                                onChange={(e) => setCitizenRegOtp(e.target.value)}
                                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-center tracking-widest text-sm font-bold"
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition"
                            >
                              Verify Aadhaar Consent & Generate ABHA ID
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {citizenLoginStep === "abha_card" && generatedAbhaCard && (
                      <div className="space-y-4 text-center">
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl font-bold">
                          🎉 Ayushman Bharat Account Issued Successfully!
                        </div>

                        {/* Aadhaar Style Digital Health ID card */}
                        <div className="bg-gradient-to-br from-blue-700 via-indigo-800 to-indigo-950 text-white p-4.5 rounded-2xl shadow-xl border border-indigo-500 flex flex-col justify-between h-48 select-none mx-auto max-w-[340px]">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1.5">
                              <div className="h-7 w-7 bg-white rounded-full flex items-center justify-center text-xs font-bold text-blue-600 font-sans">
                                IN
                              </div>
                              <div className="text-left">
                                <h4 className="text-[10px] font-black leading-none">Aadhaar Health ID</h4>
                                <p className="text-[7px] text-indigo-200 mt-0.5 font-bold uppercase tracking-wider">Ayushman Bharat Mission</p>
                              </div>
                            </div>
                            <span className="bg-emerald-400 text-slate-900 font-extrabold text-[7.5px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                              HEALTH ID READY
                            </span>
                          </div>

                          <div className="flex justify-between items-end text-left">
                            <div className="space-y-0.5 text-xs">
                              <p className="text-[7.5px] text-indigo-200 uppercase tracking-widest leading-none">ABHA Holder Name</p>
                              <p className="font-extrabold text-sm truncate max-w-[180px]">{generatedAbhaCard.name}</p>
                              <p className="font-mono text-[9px] text-indigo-100">{generatedAbhaCard.abhaId}</p>
                              <p className="text-[7.5px] text-indigo-300">DOB: {generatedAbhaCard.dob} • Gender: {generatedAbhaCard.gender}</p>
                            </div>
                            <div className="p-1 bg-white rounded-xl shrink-0">
                              <QrCode className="h-12 w-12 text-slate-900" />
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500">
                          Your diagnostic locker and PM-JAY medical subsidies are now active on your digital account.
                        </p>

                        <button
                          onClick={() => {
                            setIsLoggedIn(true);
                            setActiveUserType("Citizen");
                            setAppSection("Dashboard");
                            setActiveScreen("Home");
                            setActiveLoginPortal(null);
                          }}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition"
                        >
                          Log In to Health Wallet Dashboard
                        </button>
                      </div>
                    )}

                    {citizenLoginStep === "learn" && (
                      <div className="space-y-3">
                        <h4 className="font-sans font-bold text-slate-900 dark:text-white">ABHA Digital Ecosystem Insights</h4>
                        
                        <div className="space-y-2.5 max-h-[45vh] overflow-y-auto text-[11px] leading-relaxed pr-1">
                          {[
                            { q: "What is ABHA Number & Address?", a: "ABHA Number is a unique 14-digit identification number that aggregates and connects your digital health documentation across labs, medical offices, and empanelled national hospitals. ABHA Address is an easy-to-use self-configured alias like 'name@abdm'." },
                            { q: "Is my personal diagnostic data secure?", a: "ABDM enforces fully cryptographic privacy laws. Hospitals and doctors cannot see your health records unless you grant explicit approval via secure Aadhaar-based OTP consensus handshakes. Your data is encrypted at rest and in transit." },
                            { q: "How do PM-JAY and ABHA integrate?", a: "ABHA accounts link with your PM-JAY gold card. This automatically checks eligibility for hospital bed allotments, surgery approvals, pre-auth cover, and issues cashless subsidies dynamically without paperwork." },
                            { q: "Can I manage family or dependents?", a: "Yes. Within your ABDM companion, you can link dependents, kids, or elderly parents under a unified household card. This lets you securely manage their treatment timelines, vaccination folders, and emergency files." }
                          ].map((item, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-150 dark:border-slate-850">
                              <p className="font-extrabold text-blue-700 dark:text-blue-400 mb-1">❓ {item.q}</p>
                              <p className="text-slate-600 dark:text-slate-300">{item.a}</p>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => setCitizenLoginStep("input")}
                          className="w-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-2 rounded-xl text-center"
                        >
                          Back to Login View
                        </button>
                      </div>
                    )}

                  </div>
                )}

                {/* ----------------- DOCTOR PORTAL MODAL ----------------- */}
                {activeLoginPortal === "Doctor" && (
                  <div className="space-y-4">
                    {/* Tab Selection */}
                    <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
                      <button
                        onClick={() => setDoctorRegSuccess(false)}
                        className={`flex-1 py-1.5 text-center font-bold rounded-lg cursor-pointer transition ${
                          !doctorRegSuccess
                            ? "bg-white dark:bg-slate-850 shadow-sm text-emerald-600 dark:text-emerald-400"
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        Clinical Login
                      </button>
                      <button
                        onClick={() => setDoctorRegSuccess(true)}
                        className={`flex-1 py-1.5 text-center font-bold rounded-lg cursor-pointer transition ${
                          doctorRegSuccess
                            ? "bg-white dark:bg-slate-850 shadow-sm text-emerald-600 dark:text-emerald-400"
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        Apply to Join ABDM
                      </button>
                    </div>

                    {!doctorRegSuccess ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setDoctorLoginError("");
                          
                          // Look inside registeredDoctors
                          const match = registeredDoctors.find(d => d.username.trim().toLowerCase() === doctorUsername.trim().toLowerCase());
                          if (match && doctorPassword === "password123" && (doctorOtp === "123456" || doctorOtp.length > 3)) {
                            setIsLoggedIn(true);
                            setActiveUserType("Doctor");
                            setAppSection("Dashboard");
                            setActiveScreen("DoctorDashboard");
                            setActiveLoginPortal(null);
                            addAuditLog("Doctor", "HPR_LOGIN_SUCCESS", `Dr. ${match.fullName} logged into Practitioner Desk.`);
                          } else {
                            setDoctorLoginError("Invalid HPR registry credentials. Use fast bypass or make sure your applied registration has been approved by Government.");
                          }
                        }}
                        className="space-y-3"
                      >
                        <div className="space-y-2.5">
                          <div>
                            <label className="font-bold text-slate-400">ABDM Doctor HPR Username</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. dr_verma"
                              value={doctorUsername}
                              onChange={(e) => setDoctorUsername(e.target.value)}
                              className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                            />
                            <p className="text-[9.5px] text-slate-400">Default usernames: <strong>dr_verma</strong>, <strong>dr_sharma</strong>, or <strong>dr_jena</strong></p>
                          </div>

                          <div>
                            <label className="font-bold text-slate-400">Secure Password</label>
                            <input
                              type="password"
                              required
                              placeholder="••••••••"
                              value={doctorPassword}
                              onChange={(e) => setDoctorPassword(e.target.value)}
                              className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                            />
                            <p className="text-[9.5px] text-slate-400">Default password: <strong>password123</strong></p>
                          </div>

                          <div>
                            <label className="font-bold text-slate-400">Practitioner 2FA Security Pin</label>
                            <input
                              type="text"
                              required
                              maxLength={6}
                              placeholder="Enter test code: 123456"
                              value={doctorOtp}
                              onChange={(e) => setDoctorOtp(e.target.value)}
                              className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-center font-mono font-bold tracking-widest"
                            />
                          </div>

                          <label className="flex items-center gap-2 cursor-pointer pt-1">
                            <input
                              type="checkbox"
                              checked={doctorBiometric}
                              onChange={(e) => setDoctorBiometric(e.target.checked)}
                              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-[10.5px] text-slate-600 dark:text-slate-300">Enable biometric face-clearance bypass</span>
                          </label>
                        </div>

                        {doctorLoginError && (
                          <p className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl font-bold">
                            ⚠️ {doctorLoginError}
                          </p>
                        )}

                        <button
                          type="submit"
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
                        >
                          Verify Clinical HPR Credentials
                        </button>
                      </form>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          // Add to global doctor applications
                          const newAppId = `app-doc-${Date.now()}`;
                          const newApp = {
                            id: newAppId,
                            fullName: doctorRegForm.fullName || "Dr. Anonymous",
                            councilRegNo: doctorRegForm.councilRegNo || "MCI-00000",
                            specialization: doctorRegForm.specialization,
                            hospitalName: doctorRegForm.hospitalName || "Unspecified Hospital",
                            status: "Pending",
                            yearsOfExperience: doctorRegForm.yearsOfExperience,
                            clinicAddress: doctorRegForm.clinicAddress,
                            email: doctorRegForm.email,
                            mobileNumber: doctorRegForm.mobileNumber,
                            licenseFile: doctorRegForm.licenseFile,
                            govtIdFile: doctorRegForm.govtIdFile,
                            digitalSignature: doctorRegForm.digitalSignature || "Registered Handshake"
                          };
                          setDoctorApplications(prev => [...prev, newApp]);
                          showToast(`Application submitted successfully! ID: APP-HPR-${newAppId.slice(-4)}. Pending approval.`, "success");
                          setDoctorRegSuccess(false);
                          addAuditLog("Doctor", "REGISTRY_APPLIED", `Dr. ${newApp.fullName} applied to HPR. Status: Pending.`);
                        }}
                        className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 text-[11px]"
                      >
                        <p className="text-slate-500">
                          Submit your clinical credentials to join the Healthcare Professionals Registry (HPR). Upon state authorization, NHA will issue secure ABDM cloud credentials.
                        </p>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="font-bold text-slate-400">Doctor Full Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Dr. Alok Sen"
                              value={doctorRegForm.fullName}
                              onChange={(e) => setDoctorRegForm({ ...doctorRegForm, fullName: e.target.value })}
                              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-slate-400">Specialty</label>
                            <select
                              value={doctorRegForm.specialization}
                              onChange={(e) => setDoctorRegForm({ ...doctorRegForm, specialization: e.target.value })}
                              className="w-full p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                            >
                              <option value="General Medicine">General Medicine</option>
                              <option value="Cardiology">Cardiology</option>
                              <option value="Pediatrics">Pediatrics</option>
                              <option value="Neurology">Neurology</option>
                              <option value="Dermatology">Dermatology</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="font-bold text-slate-400">Medical Council Reg No</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. MCI-99120"
                              value={doctorRegForm.councilRegNo}
                              onChange={(e) => setDoctorRegForm({ ...doctorRegForm, councilRegNo: e.target.value })}
                              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-slate-400">Years of Experience</label>
                            <input
                              type="number"
                              required
                              value={doctorRegForm.yearsOfExperience}
                              onChange={(e) => setDoctorRegForm({ ...doctorRegForm, yearsOfExperience: e.target.value })}
                              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-400">Primary Hospital Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Saket City Clinic"
                            value={doctorRegForm.hospitalName}
                            onChange={(e) => setDoctorRegForm({ ...doctorRegForm, hospitalName: e.target.value })}
                            className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-400">Clinic / Chamber Address</label>
                          <textarea
                            placeholder="Chamber address details..."
                            value={doctorRegForm.clinicAddress}
                            onChange={(e) => setDoctorRegForm({ ...doctorRegForm, clinicAddress: e.target.value })}
                            className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px] h-14 resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="font-bold text-slate-400">Official Email ID</label>
                            <input
                              type="email"
                              required
                              placeholder="e.g. alok@practitioner.in"
                              value={doctorRegForm.email}
                              onChange={(e) => setDoctorRegForm({ ...doctorRegForm, email: e.target.value })}
                              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-slate-400">Mobile Number</label>
                            <input
                              type="tel"
                              required
                              placeholder="e.g. 9811002233"
                              value={doctorRegForm.mobileNumber}
                              onChange={(e) => setDoctorRegForm({ ...doctorRegForm, mobileNumber: e.target.value })}
                              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                            <UploadCloud className="h-5 w-5 text-slate-400 mb-1" />
                            <span className="text-[9.5px] text-slate-500">Upload SMC License</span>
                            <span className="text-[8px] font-mono text-emerald-600 mt-1">smc_license.pdf</span>
                          </div>
                          <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                            <UploadCloud className="h-5 w-5 text-slate-400 mb-1" />
                            <span className="text-[9.5px] text-slate-500">Upload Govt ID</span>
                            <span className="text-[8px] font-mono text-emerald-600 mt-1">govt_id.pdf</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-400">Digital Signoff Auth Signature Key</label>
                          <input
                            type="text"
                            required
                            placeholder="Type your name to digitally sign"
                            value={doctorRegForm.digitalSignature}
                            onChange={(e) => setDoctorRegForm({ ...doctorRegForm, digitalSignature: e.target.value })}
                            className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px] italic font-bold"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
                        >
                          Submit HPR Registry Application
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* ----------------- HOSPITAL PORTAL MODAL ----------------- */}
                {activeLoginPortal === "Hospital" && (
                  <div className="space-y-4">
                    {/* Tab Selection */}
                    <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
                      <button
                        onClick={() => setHospitalRegSuccess(false)}
                        className={`flex-1 py-1.5 text-center font-bold rounded-lg cursor-pointer transition ${
                          !hospitalRegSuccess
                            ? "bg-white dark:bg-slate-850 shadow-sm text-indigo-600 dark:text-indigo-400"
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        Facility Login
                      </button>
                      <button
                        onClick={() => setHospitalRegSuccess(true)}
                        className={`flex-1 py-1.5 text-center font-bold rounded-lg cursor-pointer transition ${
                          hospitalRegSuccess
                            ? "bg-white dark:bg-slate-850 shadow-sm text-indigo-600 dark:text-indigo-400"
                            : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                        }`}
                      >
                        Register Facility
                      </button>
                    </div>

                    {!hospitalRegSuccess ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setHospitalLoginError("");
                          
                          // Match hospitalUsername
                          const match = registeredHospitals.find(h => h.username.trim().toLowerCase() === hospitalUsername.trim().toLowerCase());
                          if (match && hospitalPassword === match.password && (hospitalOtp === "123456" || hospitalOtp.length > 3)) {
                            setIsLoggedIn(true);
                            setActiveUserType("Hospital");
                            setAppSection("Dashboard");
                            setActiveScreen("HospitalDashboard");
                            setActiveLoginPortal(null);
                            addAuditLog("Hospital", "HFID_LOGIN_SUCCESS", `${match.hospitalName} entered admission desk.`);
                          } else {
                            setHospitalLoginError("Invalid facility credentials. Make sure your empanelment registration has been approved by Government.");
                          }
                        }}
                        className="space-y-3"
                      >
                        <div className="space-y-2.5">
                          <div>
                            <label className="font-bold text-slate-400">Facility ABDM Username (HFID)</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. hosp_max"
                              value={hospitalUsername}
                              onChange={(e) => setHospitalUsername(e.target.value)}
                              className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                            />
                            <p className="text-[9.5px] text-slate-400">Default username: <strong>hosp_max</strong> or <strong>hosp_prm</strong></p>
                          </div>

                          <div>
                            <label className="font-bold text-slate-400">Secure Password</label>
                            <input
                              type="password"
                              required
                              placeholder="••••••••"
                              value={hospitalPassword}
                              onChange={(e) => setHospitalPassword(e.target.value)}
                              className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                            />
                            <p className="text-[9.5px] text-slate-400">Default password: <strong>password123</strong> or <strong>12345678</strong> (PRM)</p>
                          </div>

                          <div>
                            <label className="font-bold text-slate-400">Facility 2FA Pin</label>
                            <input
                              type="text"
                              required
                              maxLength={6}
                              placeholder="Enter test code: 123456"
                              value={hospitalOtp}
                              onChange={(e) => setHospitalOtp(e.target.value)}
                              className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-center font-mono font-bold tracking-widest"
                            />
                          </div>
                        </div>

                        {hospitalLoginError && (
                          <p className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl font-bold">
                            ⚠️ {hospitalLoginError}
                          </p>
                        )}

                        <button
                          type="submit"
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
                        >
                          Verify Facility Authorization
                        </button>
                      </form>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          // Add to global hospital applications
                          const newAppId = `app-hosp-${Date.now()}`;
                          const newApp = {
                            id: newAppId,
                            hospitalName: hospitalRegForm.hospitalName || "Unnamed Clinic",
                            registrationNumber: hospitalRegForm.registrationNumber || "REG-9901",
                            nabhStatus: hospitalRegForm.nabhStatus,
                            state: hospitalRegForm.state || "Delhi",
                            district: hospitalRegForm.district || "New Delhi",
                            status: "Pending",
                            facilityId: hospitalRegForm.facilityId,
                            hospitalType: hospitalRegForm.hospitalType,
                            address: hospitalRegForm.address,
                            email: hospitalRegForm.email,
                            phone: hospitalRegForm.phone,
                            adminName: hospitalRegForm.adminName,
                            licenseFile: hospitalRegForm.licenseFile,
                            regCertificate: hospitalRegForm.regCertificate,
                            nabhCertificate: hospitalRegForm.nabhCertificate
                          };
                          setHospitalApplications(prev => [...prev, newApp]);
                          showToast(`Empanelment request registered! ID: APP-HFID-${newAppId.slice(-4)}. Pending evaluation.`, "success");
                          setHospitalRegSuccess(false);
                          addAuditLog("Hospital", "EMPANELMENT_APPLIED", `${newApp.hospitalName} applied to join ABDM layout.`);
                        }}
                        className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 text-[11px]"
                      >
                        <p className="text-slate-500">
                          Register your healthcare facility, nursing home, clinic, or diagnostic center under ABDM to enable real-time bed inventories, laboratory syncing, and PM-JAY claim cover.
                        </p>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="font-bold text-slate-400">Hospital Facility Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Apollo Delhi"
                              value={hospitalRegForm.hospitalName}
                              onChange={(e) => setHospitalRegForm({ ...hospitalRegForm, hospitalName: e.target.value })}
                              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-slate-400">Facility Type</label>
                            <select
                              value={hospitalRegForm.hospitalType}
                              onChange={(e) => setHospitalRegForm({ ...hospitalRegForm, hospitalType: e.target.value })}
                              className="w-full p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                            >
                              <option value="Private">Private Facility</option>
                              <option value="Government">Government Sector</option>
                              <option value="Trust">Trust Clinic</option>
                              <option value="Corporate">Corporate Chain</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="font-bold text-slate-400">Registration / Licensing Number</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. REG-44021"
                              value={hospitalRegForm.registrationNumber}
                              onChange={(e) => setHospitalRegForm({ ...hospitalRegForm, registrationNumber: e.target.value })}
                              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-slate-400">NABH Status</label>
                            <select
                              value={hospitalRegForm.nabhStatus}
                              onChange={(e) => setHospitalRegForm({ ...hospitalRegForm, nabhStatus: e.target.value })}
                              className="w-full p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                            >
                              <option value="NABH Accredited">NABH Accredited</option>
                              <option value="Non-Accredited">Non-Accredited</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-400">Full Postal Address</label>
                          <textarea
                            placeholder="Hospital geographical coordinates or street address..."
                            value={hospitalRegForm.address}
                            onChange={(e) => setHospitalRegForm({ ...hospitalRegForm, address: e.target.value })}
                            className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px] h-14 resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="font-bold text-slate-400">District</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Sadar"
                              value={hospitalRegForm.district}
                              onChange={(e) => setHospitalRegForm({ ...hospitalRegForm, district: e.target.value })}
                              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-slate-400">State</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. West Bengal"
                              value={hospitalRegForm.state}
                              onChange={(e) => setHospitalRegForm({ ...hospitalRegForm, state: e.target.value })}
                              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="font-bold text-slate-400">Official Email</label>
                            <input
                              type="email"
                              required
                              placeholder="e.g. contact@apollo.in"
                              value={hospitalRegForm.email}
                              onChange={(e) => setHospitalRegForm({ ...hospitalRegForm, email: e.target.value })}
                              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-slate-400">Official Phone</label>
                            <input
                              type="tel"
                              required
                              placeholder="e.g. 011-209422"
                              value={hospitalRegForm.phone}
                              onChange={(e) => setHospitalRegForm({ ...hospitalRegForm, phone: e.target.value })}
                              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-400">Administrator In-Charge Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Sandeep Mishra"
                            value={hospitalRegForm.adminName}
                            onChange={(e) => setHospitalRegForm({ ...hospitalRegForm, adminName: e.target.value })}
                            className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-1.5 text-center mt-2">
                          <div className="p-1.5 bg-slate-50 dark:bg-slate-950 rounded-lg border text-[9px] text-slate-500">
                            <UploadCloud className="h-4 w-4 mx-auto mb-0.5 text-slate-400" />
                            Facility License
                          </div>
                          <div className="p-1.5 bg-slate-50 dark:bg-slate-950 rounded-lg border text-[9px] text-slate-500">
                            <UploadCloud className="h-4 w-4 mx-auto mb-0.5 text-slate-400" />
                            Reg Certificate
                          </div>
                          <div className="p-1.5 bg-slate-50 dark:bg-slate-950 rounded-lg border text-[9px] text-slate-500">
                            <UploadCloud className="h-4 w-4 mx-auto mb-0.5 text-slate-400" />
                            NABH File
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
                        >
                          Submit Empanelment Registry Request
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* ----------------- GOVERNMENT PORTAL MODAL ----------------- */}
                {activeLoginPortal === "Government" && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setGovLoginError("");
                      
                      if (!govHardwareKey || !govBiometric) {
                        setGovLoginError("FIDO2 Hardware Key and TouchID/Fingerprint biometric clearances are required for NHA secure terminal nodes.");
                        return;
                      }

                      if (govUsername === "admin" && govPassword === "admin123" && (govOtp === "123456" || govOtp.length > 3) && govCaptcha.trim() === govCaptchaAnswer) {
                        setIsLoggedIn(true);
                        setActiveUserType("Government");
                        setAppSection("Dashboard");
                        setActiveScreen("GovAnalytics");
                        setActiveLoginPortal(null);
                        addAuditLog("Government", "NHA_ADMIN_LOGIN_SUCCESS", "Government Oversight Hub authorized via cryptokey multi-factor clearance.");
                      } else {
                        setGovLoginError("Incorrect credentials or CAPTCHA code. Use sandboxed fast bypass.");
                      }
                    }}
                    className="space-y-3"
                  >
                    <p className="text-[11px] text-slate-500">
                      Oversight access is cryptographically locked to registered NHA nodal officers. Multi-factor hardware and live IP checks are enforced.
                    </p>

                    <div className="space-y-2 text-[11px]">
                      <div>
                        <label className="font-bold text-slate-400">Auditor Official Username</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. admin"
                          value={govUsername}
                          onChange={(e) => setGovUsername(e.target.value)}
                          className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                        />
                        <p className="text-[9.5px] text-slate-400">Default username: <strong>admin</strong></p>
                      </div>

                      <div>
                        <label className="font-bold text-slate-400">Security Password</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={govPassword}
                          onChange={(e) => setGovPassword(e.target.value)}
                          className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                        />
                        <p className="text-[9.5px] text-slate-400">Default password: <strong>admin123</strong></p>
                      </div>

                      <div>
                        <label className="font-bold text-slate-400">Two-Factor security token OTP</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="Enter test code: 123456"
                          value={govOtp}
                          onChange={(e) => setGovOtp(e.target.value)}
                          className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-center font-mono font-bold tracking-widest"
                        />
                      </div>

                      {/* CAPTCHA block */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800 items-center">
                        <div className="text-center font-mono font-bold tracking-wider line-through bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-1.5 rounded select-none text-xs">
                          {govCaptchaAnswer}
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Enter CAPTCHA"
                          value={govCaptcha}
                          onChange={(e) => setGovCaptcha(e.target.value)}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                        />
                      </div>

                      {/* Hardware Checks */}
                      <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl space-y-1.5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={govHardwareKey}
                            onChange={(e) => setGovHardwareKey(e.target.checked)}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="font-medium text-slate-700 dark:text-slate-300">✓ FIDO2 Hardware Token Key Inserted</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={govBiometric}
                            onChange={(e) => setGovBiometric(e.target.checked)}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="font-medium text-slate-700 dark:text-slate-300">✓ Secure Fingerprint Biometric Verified</span>
                        </label>
                      </div>

                      <div className="text-[10px] text-slate-400 font-semibold uppercase flex justify-between">
                        <span>Terminal node: NHA-HQ-DEL-15</span>
                        <span>IP: 10.24.110.15</span>
                      </div>
                    </div>

                    {govLoginError && (
                      <p className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl font-bold">
                        ⚠️ {govLoginError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer"
                    >
                      Authenticate NHA Admin Node
                    </button>
                  </form>
                )}

              </div>
              
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==============================================================
  // SECURE HIGH-FIDELITY FULL-SCREEN PORTALS (LOGGED-IN DASHBOARD)
  // ==============================================================
  if (appSection === "Dashboard" && isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col select-text font-sans relative">
        {/* National Tricolor Top Thin Line Decoration */}
        <div className="h-1.5 bg-gradient-to-r from-orange-500 via-white to-green-600 w-full z-50 shrink-0"></div>

        {/* Global Dashboard Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-3.5 px-6 flex justify-between items-center shrink-0 shadow-sm z-45">
          <div className="flex items-center gap-3">
            <HealthShieldLogo
              size="sm"
              showWordmark={true}
              animated={false}
              subtitle="Ayushman Bharat Digital Mission"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Active Portal Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              {activeUserType === "Citizen" && <span className="text-blue-600 flex items-center gap-1">👤 Citizen Health Wallet</span>}
              {activeUserType === "Doctor" && <span className="text-emerald-600 flex items-center gap-1">🩺 HPR Practitioner Desk</span>}
              {activeUserType === "Hospital" && <span className="text-indigo-600 flex items-center gap-1">🏥 HFID Admission Desk</span>}
              {activeUserType === "Government" && <span className="text-amber-600 flex items-center gap-1">🇮🇳 NHA Oversight Hub</span>}
            </div>

            {/* Replay Splash / Intro Button */}
            <button
              onClick={() => setAppSection("Splash")}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold transition cursor-pointer"
              title="Replay ABDM Splash Screen"
            >
              <Activity className="h-3.5 w-3.5 text-orange-500" />
              <span>Intro</span>
            </button>

            {/* Gemini API Key Status Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <Sparkles className={`h-3.5 w-3.5 ${hasGeminiKey ? "text-emerald-500 animate-pulse" : "text-amber-500"}`} />
              <span className="hidden md:inline text-[10px] uppercase font-black tracking-wider text-slate-500 dark:text-slate-400">Gemini:</span>
              <span className={`text-[10px] font-black ${hasGeminiKey ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                {hasGeminiKey === null ? "Verifying..." : hasGeminiKey ? "Active" : "Demo Mode"}
              </span>
            </div>

            {/* Language Dropdown */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as any)}
              className="p-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer focus:outline-none"
            >
              <option value="en">English (EN)</option>
              <option value="hi">हिन्दी (HI)</option>
              <option value="mr">मराठी (MR)</option>
              <option value="or">ଓଡ଼ିଆ (OR)</option>
            </select>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-extrabold border border-rose-100 dark:border-rose-900/50 flex items-center gap-1.5 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition cursor-pointer"
            >
              <LogOut className="h-4 w-4" /> Log Out
            </button>
          </div>
        </header>

        {/* Global Dashboard Layout */}
        <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
          
          {/* Sidebar - Visible on Desktop / tablet, hidden on Mobile */}
          {activeUserType === "Citizen" && (
            <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-1.5 shrink-0 text-left">
              <div className="p-3 bg-gradient-to-br from-blue-700 to-indigo-850 text-white rounded-2xl shadow-sm mb-3 text-left border border-blue-600 animate-fade-in">
                <span className="text-[8.5px] text-blue-200 uppercase tracking-widest font-bold">ABHA Verified</span>
                <p className="font-extrabold text-sm truncate">{activeProfileData.name}</p>
                <p className="text-[10px] text-blue-200 font-mono mt-0.5 truncate">{activeProfileData.abhaId}</p>
              </div>

              {[
                { label: "Home Dashboard", icon: User, screen: "Home" },
                { label: "Recent Health Activity", icon: Clock, screen: "RecentActivity" },
                { label: "Health Content & Videos", icon: Video, screen: "HealthContent" },
                { label: "Share Health Records", icon: QrCode, screen: "ShareRecords" },
                { label: "Family Health Profiles", icon: Users, screen: "FamilyHealth" },
                { label: "ABHA Health Locker", icon: FileText, screen: "Locker" },
                { label: "Appointment Slots", icon: Calendar, screen: "Appointments" },
                { label: "ABDM Teleconsult", icon: Video, screen: "Teleconsult" },
                { label: "Rewards & Wellness", icon: Award, screen: "Rewards" },
                { label: "Profile & ABHA Card", icon: Settings, screen: "Profile" }
              ].map((tab) => (
                <button
                  key={tab.screen}
                  onClick={() => setActiveScreen(tab.screen)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer text-left ${
                    activeScreen === tab.screen
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850"
                  }`}
                >
                  <tab.icon className="h-4.5 w-4.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </aside>
          )}

          {/* Main Dashboard Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-950/30">
            {hasGeminiKey === false && (
              <div className="max-w-6xl mx-auto mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 text-amber-900 dark:text-amber-200 text-xs rounded-2xl border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm animate-fade-in">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-300 rounded-xl mt-0.5 sm:mt-0 shrink-0">
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-950 dark:text-amber-150 text-sm">Gemini AI Key Is Not Configured</h4>
                    <p className="text-[11.5px] mt-0.5 leading-relaxed text-slate-700 dark:text-slate-300">
                      Smart features like the <strong>AI Medical Report Explainer</strong>, the <strong>AABHA Intelligent Health Chatbot</strong>, and automated <strong>Clinical Handover Voice Summaries</strong> are running in local mock/demonstration mode. Add your <code className="font-mono bg-amber-100/80 dark:bg-amber-900/40 px-1.5 py-0.5 rounded font-black text-amber-950 dark:text-amber-100 text-[10px]">GEMINI_API_KEY</code> in the <strong>Secrets</strong> panel inside the AI Studio UI to activate full live AI assistance.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="max-w-6xl mx-auto">
              
              {/* 1. CITIZEN PORTAL SUB-SCREENS */}
              {activeUserType === "Citizen" && (
                <div className="space-y-6">
                  {activeScreen !== "Home" && (
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in text-left">
                      <button
                        onClick={() => {
                          setActiveScreen("Home");
                          addAuditLog("Citizen", "NAV_BACK", "Returned to primary Home Dashboard.");
                        }}
                        className="p-2 bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 font-bold text-xs shrink-0 border border-blue-200/50 dark:border-slate-700"
                      >
                        <ArrowLeft className="h-4.5 w-4.5" />
                        <span>Back to Dashboard</span>
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <p className="text-xs text-slate-500 font-medium">
                        Currently viewing: <strong className="text-slate-700 dark:text-slate-300 uppercase tracking-wider">{activeScreen === "AISummary" ? "AABHA AI Doctor" : activeScreen === "Meds" ? "My Prescriptions" : activeScreen === "Timeline" ? "Clinical Timeline" : activeScreen}</strong>
                      </p>
                    </div>
                  )}

                  {/* Home Dashboard */}
                  {activeScreen === "Home" && (
                    <div className="space-y-6 animate-fade-in text-left pb-16">
                      
                      {/* Family Profile Switcher Pill Row */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-3xl border border-slate-250 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Active Health Member:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {familyProfiles.map((fam) => (
                            <button
                              key={fam.id}
                              onClick={() => {
                                setActiveFamilyProfileId(fam.id);
                                addAuditLog("Citizen", "PROFILE_SWITCH", `Switched active viewport context to: ${fam.name} (${fam.relationship}).`);
                                showToast(`Switched active profile to ${fam.name} (${fam.relationship})`, "info");
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black tracking-tight cursor-pointer transition flex items-center gap-1.5 ${
                                activeFamilyProfileId === fam.id
                                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750"
                              }`}
                            >
                              <span>{fam.relationship === "Self" ? "👤 Self (Tamanna)" : `👥 ${fam.name} (${fam.relationship})`}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Banner Greeting & Health Score Circle */}
                      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-indigo-950 text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden border border-blue-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1.5 max-w-lg">
                          <span className="text-[9px] bg-blue-500/30 border border-blue-400/20 text-blue-200 uppercase font-sans tracking-wider font-semibold px-2 py-0.5 rounded-md">
                            Cryptographic Consent Handshake Active
                          </span>
                          <h2 className="text-xl md:text-2xl font-black font-sans tracking-tight">
                            Welcome back, {activeProfileData.name}!
                          </h2>
                          <p className="text-xs text-blue-100">
                            Your health locker is synchronized with <strong className="text-emerald-400 font-bold">14-digit ABHA ID: {activeProfileData.abhaId}</strong>. You have absolute ownership and cryptographic privacy of your medical documents.
                          </p>
                        </div>
                        
                        <div
                          onClick={() => setActiveScreen("Rewards")}
                          className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 cursor-pointer hover:scale-102 transition shrink-0 self-stretch md:self-auto justify-between"
                          title="Click to view health metrics"
                        >
                          <div className="text-left">
                            <span className="text-[9px] text-emerald-300 font-bold uppercase tracking-wider block">Health Score</span>
                            <span className="text-xs text-slate-200">Aadhaar verified index</span>
                          </div>
                          <div className="h-12 w-12 rounded-full border-4 border-emerald-400 bg-emerald-500/20 flex items-center justify-center font-mono font-black text-lg text-emerald-300">
                            {activeProfileData.healthScore}
                          </div>
                        </div>
                      </div>

                      {/* Quick metrics grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3.5 shadow-sm">
                          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
                            <Award className="h-5.5 w-5.5" />
                          </div>
                          <div>
                            <span className="text-[9.5px] text-slate-400 uppercase font-bold tracking-wider block">Wellness Reward Points</span>
                            <span className="text-base font-black text-slate-800 dark:text-slate-100 font-mono">{activeProfileData.rewardPoints} pts</span>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3.5 shadow-sm">
                          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-xl">
                            <ShieldAlert className="h-5.5 w-5.5" />
                          </div>
                          <div>
                            <span className="text-[9.5px] text-slate-400 uppercase font-bold tracking-wider block">Active PM-JAY Policy Cover</span>
                            <span className="text-base font-black text-slate-800 dark:text-slate-100 font-sans">₹5,00,000 Cashless</span>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3.5 shadow-sm">
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl">
                            <Activity className="h-5.5 w-5.5" />
                          </div>
                          <div>
                            <span className="text-[9.5px] text-slate-400 uppercase font-bold tracking-wider block">Latest Pulse Rate</span>
                            <span className="text-base font-black text-slate-800 dark:text-slate-100 font-mono">72 bpm</span>
                          </div>
                        </div>
                      </div>

                      {/* Interactive Health Booklet Section */}
                      <div className="space-y-3">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                          National Health Services & Wallet Modules
                        </h3>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                          {[
                            { label: "PM-JAY Golden Card", screen: "PMJAY", icon: CreditCard, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/45" },
                            { label: "Recent Health Activity", screen: "RecentActivity", icon: Clock, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/45" },
                            { label: "Health Content & Videos", screen: "HealthContent", icon: Video, color: "text-rose-500 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/45" },
                            { label: "Share Health Records", screen: "ShareRecords", icon: QrCode, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/45" },
                            { label: "Family Health Profiles", screen: "FamilyHealth", icon: Users, color: "text-violet-600 bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-900/45" },
                            { label: "Emergency SOS QR", screen: "Emergency", icon: ShieldAlert, color: "text-red-500 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/45" },
                            { label: "My Prescription Pills", screen: "Meds", icon: Pill, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/45" },
                            { label: "Vaccines Passport", screen: "Vaccines", icon: Thermometer, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/45" },
                            { label: "Clinical Timeline", screen: "Timeline", icon: Calendar, color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/45" },
                            { label: "ABDM Teleconsult", screen: "Teleconsult", icon: Video, color: "text-violet-500 bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-900/45" },
                            { label: "Ask AABHA AI", screen: "AISummary", icon: Sparkles, color: "text-rose-500 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/45 animate-pulse" },
                            { label: "Hospitals Directory", screen: "Hospitals", icon: MapPin, color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/45" },
                            { label: "Official Health Alerts", screen: "News", icon: Info, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/45" },
                            { label: "Missions & Rewards", screen: "Rewards", icon: Award, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/45" }
                          ].map((feat) => (
                            <button
                              key={feat.screen}
                              onClick={() => setActiveScreen(feat.screen)}
                              className={`p-4 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 transition flex flex-col items-center justify-between text-center min-h-[110px] border-b-4 hover:scale-103 cursor-pointer shadow-sm`}
                            >
                              <div className={`p-2.5 rounded-xl border ${feat.color}`}>
                                <feat.icon className="h-6 w-6" />
                              </div>
                              <span className="text-[11px] font-black text-slate-700 dark:text-slate-300 mt-2 leading-tight tracking-tight font-sans">
                                {feat.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Side-by-side dashboard snapshot widgets */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Next consultation widget */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm text-left">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">Upcoming Consultations</span>
                            <span className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline cursor-pointer" onClick={() => setActiveScreen("Appointments")}>Manage Slots</span>
                          </div>
                          
                          {appointments.length > 0 ? (
                            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850 flex justify-between items-center">
                              <div>
                                <p className="font-extrabold text-slate-800 dark:text-slate-100 text-sm font-sans">{appointments[0]?.doctorName}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{appointments[0]?.specialty} • {appointments[0]?.hospitalName}</p>
                              </div>
                              <span className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold px-3 py-1.5 rounded-full text-[10.5px]">
                                {appointments[0]?.time}
                              </span>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-500 py-2">No upcoming consultation slots booked.</p>
                          )}
                        </div>

                        {/* Pill reminder widget */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm text-left">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">Today's Active Prescriptions</span>
                            <span className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline cursor-pointer" onClick={() => setActiveScreen("Meds")}>Full Med-Logger</span>
                          </div>
                          
                          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850 justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg shrink-0">
                                <Pill className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">Metformin 500mg</p>
                                <p className="text-[10.5px] text-slate-400 mt-0.5">Diabetes Control • Post breakfast</p>
                              </div>
                            </div>
                            <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-extrabold text-[9px] px-2.5 py-1 rounded border border-emerald-100 dark:border-emerald-900/50 uppercase tracking-wider">
                              Taken
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Standard Subpages */}
                  {activeScreen === "PMJAY" && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <PMJAYPortal
                        abhaMetadata={abhaMetadata}
                        pmjayClaims={pmjayClaims}
                        preAuthRequests={preAuthRequests}
                        preAuthForm={preAuthForm}
                        setPreAuthForm={setPreAuthForm}
                        onAddPreAuth={handleAddPreAuthRequestSubmit}
                        preAuthSuccess={preAuthSuccess}
                        eVouchers={eVouchers}
                        onGenerateVoucher={handleGeneratePreventiveVoucher}
                        newVoucherSuccess={newVoucherSuccess}
                        onBack={() => setActiveScreen("Home")}
                      />
                    </div>
                  )}

                  {activeScreen === "RecentActivity" && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <RecentHealthActivity
                        medicalRecords={activeProfileData.records}
                        appointments={activeProfileData.appointments}
                        activePatientName={activeProfileData.name}
                        activePatientAbha={activeProfileData.abhaId}
                        lang={lang}
                        onNavigateToLocker={() => setActiveScreen("Locker")}
                        onNavigateToAppointments={() => setActiveScreen("Appointments")}
                        onShowToast={showToast}
                      />
                    </div>
                  )}

                  {activeScreen === "HealthContent" && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <HealthContentHub
                        contentItems={healthContentItems}
                        campaignBanners={campaignBanners}
                        onUpdateContentItems={setHealthContentItems}
                        onUpdateCampaignBanners={setCampaignBanners}
                        lang={lang}
                        onShowToast={showToast}
                      />
                    </div>
                  )}

                  {activeScreen === "ShareRecords" && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <SelectiveShareQR
                        medicalRecords={activeProfileData.records}
                        sharedTokens={sharedTokens}
                        onUpdateSharedTokens={setSharedTokens}
                        activePatientName={activeProfileData.name}
                        activePatientAbha={activeProfileData.abhaId}
                        lang={lang}
                        onShowToast={showToast}
                      />
                    </div>
                  )}

                  {activeScreen === "FamilyHealth" && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <FamilyHealthManager
                        familyProfiles={familyProfiles}
                        activeProfileId={activeFamilyProfileId}
                        onSelectActiveProfile={setActiveFamilyProfileId}
                        onUpdateFamilyProfiles={setFamilyProfiles}
                        lang={lang}
                        onShowToast={showToast}
                      />
                    </div>
                  )}

                  {activeScreen === "Teleconsult" && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <Teleconsultation
                        userType="Citizen"
                        medicalRecords={medicalRecords}
                        onAddRecordToLocker={(rec) => setMedicalRecords([rec, ...medicalRecords])}
                        teleconsultations={teleconsultations}
                        onUpdateTeleconsultations={setTeleconsultations}
                        onAddAuditLog={addAuditLog}
                        lang={lang}
                        t={t}
                        onShowToast={showToast}
                      />
                    </div>
                  )}

                  {activeScreen === "Emergency" && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <EmergencyQRPage abhaMetadata={abhaMetadata} onBack={() => setActiveScreen("Home")} />
                    </div>
                  )}

                  {activeScreen === "Meds" && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <MedicineTrackerPage onBack={() => setActiveScreen("Home")} />
                    </div>
                  )}

                  {activeScreen === "Vaccines" && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <VaccinationDetails onBack={() => setActiveScreen("Home")} />
                    </div>
                  )}

                  {activeScreen === "Timeline" && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <TimelinePage medicalRecords={medicalRecords} onBack={() => setActiveScreen("Home")} />
                    </div>
                  )}

                  {activeScreen === "Hospitals" && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <HospitalDirectory onBack={() => setActiveScreen("Home")} onShowToast={showToast} />
                    </div>
                  )}

                  {activeScreen === "News" && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <HealthNewsPage onBack={() => setActiveScreen("Home")} />
                    </div>
                  )}

                  {/* Health Locker tab */}
                  {activeScreen === "Locker" && (
                    <div className="space-y-6 animate-fade-in text-left pb-16">
                      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                        <h2 className="font-sans font-black text-slate-900 dark:text-white text-lg md:text-xl flex items-center gap-1.5">
                          <FileText className="h-5 w-5 text-blue-600" /> ABDM Digital Health Locker
                        </h2>
                        <p className="text-xs text-slate-500">Secure consent-based repository explanation & AI-explainers</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {/* Linked Records List */}
                        <div className="lg:col-span-2 space-y-3">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Linked Cryptographic Medical Records ({medicalRecords.length})
                          </p>
                          
                          <div className="space-y-3.5">
                            {medicalRecords.map((rec) => (
                              <div key={rec.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs shadow-sm">
                                <div className="flex justify-between items-start gap-4">
                                  <div>
                                    <p className="font-extrabold text-slate-900 dark:text-white text-sm font-sans">{rec.title}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{rec.institution} • {rec.date}</p>
                                    <p className="text-[10.5px] text-slate-400 mt-0.5">Doctor: {rec.doctorName}</p>
                                  </div>
                                  <span className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-extrabold text-[9px] px-2.5 py-1 rounded-full uppercase shrink-0 border border-blue-100 dark:border-blue-900/50">
                                    {rec.type}
                                  </span>
                                </div>
                                {rec.summary && (
                                  <div className="text-xs text-slate-600 dark:text-slate-300 font-sans mt-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-150 dark:border-slate-850 leading-relaxed">
                                    <span className="font-black text-emerald-600 dark:text-emerald-400 text-[10px] uppercase block mb-1">✓ AI Summary</span>
                                    {rec.summary}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Mini AI explainer assistant widget inside locker */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-left">
                          <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider">AABHA AI Records Assistant</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Need a clinical note translated to plain language? Upload or paste details into our sandbox Gemini consultation model below.
                          </p>
                          <AIChatAndSummary
                            onAddRecordToLocker={(rec) => setMedicalRecords([rec, ...medicalRecords])}
                            lang={lang}
                            t={t}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ask AABHA AI direct assistant tab */}
                  {activeScreen === "AISummary" && (
                    <div className="space-y-6 animate-fade-in text-left pb-16">
                      <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex justify-between items-center">
                        <div>
                          <h2 className="font-sans font-black text-slate-900 dark:text-white text-lg md:text-xl flex items-center gap-1.5">
                            <Sparkles className="h-5 w-5 text-rose-500 animate-pulse" /> Ask AABHA AI Doctor
                          </h2>
                          <p className="text-xs text-slate-500">Real-time clinical summary & translation assistant powered by Gemini</p>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <AIChatAndSummary lang={lang} t={t} />
                      </div>
                    </div>
                  )}

                  {/* Appointment booking tab */}
                  {activeScreen === "Appointments" && (
                    <div className="space-y-6 animate-fade-in text-left pb-16">
                      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                        <h2 className="font-sans font-black text-slate-900 dark:text-white text-lg md:text-xl flex items-center gap-1.5">
                          <Calendar className="h-5 w-5 text-blue-600" /> Live OPD Appointment Booking
                        </h2>
                        <p className="text-xs text-slate-500">Real-time OPD queue status and empanelled slots booking</p>
                      </div>

                      {bookingSuccessMsg && (
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs rounded-xl border border-emerald-100 dark:border-emerald-900/50 font-bold">
                          ✓ {bookingSuccessMsg}
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {/* Book slot form */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                          <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider">Secure Slot Reservation</h4>
                          
                          <form onSubmit={handleBookConsultationSubmit} className="space-y-3.5 text-xs">
                            <div className="space-y-1">
                              <label className="font-bold text-slate-400">Select Specialty</label>
                              <select
                                value={bookingSpecialty}
                                onChange={(e) => setBookingSpecialty(e.target.value)}
                                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                              >
                                <option value="General Medicine">General Medicine</option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Pediatrics">Pediatrics</option>
                                <option value="Dermatology">Dermatology</option>
                                <option value="Orthopedics">Orthopedics</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="font-bold text-slate-400">Empanelled Facility</label>
                              <select
                                value={bookingHospital}
                                onChange={(e) => setBookingHospital(e.target.value)}
                                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                              >
                                <option value="Max Super Speciality Hospital">Max Super Speciality Hospital</option>
                                <option value="Saket City Clinic">Saket City Clinic</option>
                                <option value="Fortis Healthcare Delhi">Fortis Healthcare Delhi</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="font-bold text-slate-400">Date</label>
                              <input
                                type="date"
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-bold text-slate-400">Available Consultation Slots</label>
                              <select
                                value={bookingTime}
                                onChange={(e) => setBookingTime(e.target.value)}
                                className="w-full p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                              >
                                <option value="10:00 AM">10:00 AM</option>
                                <option value="11:00 AM">11:00 AM</option>
                                <option value="02:30 PM">02:30 PM</option>
                                <option value="04:00 PM">04:00 PM</option>
                              </select>
                            </div>

                            <button
                              type="submit"
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition cursor-pointer shadow-md shadow-blue-500/10"
                            >
                              Sync Identity & Confirm Booking
                            </button>
                          </form>
                        </div>

                        {/* List of active consultations */}
                        <div className="lg:col-span-2 space-y-3">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Consultation Log</p>
                          
                          <div className="space-y-3">
                            {appointments.map((app) => (
                              <div key={app.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div>
                                  <p className="font-black text-slate-900 dark:text-white text-sm">{app.doctorName}</p>
                                  <p className="text-xs text-slate-500 mt-0.5">{app.specialty} • {app.hospitalName}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-extrabold text-[10px] px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-900/50 font-mono">
                                    {app.time}
                                  </span>
                                  <span className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 font-extrabold text-[10px] px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/50 uppercase">
                                    Confirmed
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rewards wellness tab */}
                  {activeScreen === "Rewards" && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <RewardsWellness
                        challenges={challenges}
                        rewardPoints={abhaMetadata.rewardPoints}
                        onToggleChallenge={handleToggleChallenge}
                        lang={lang}
                        t={t}
                      />
                    </div>
                  )}

                  {/* Citizen Profile Tab */}
                  {activeScreen === "Profile" && (
                    <div className="space-y-6 animate-fade-in text-left pb-16">
                      <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                        <h2 className="font-sans font-black text-slate-900 dark:text-white text-lg md:text-xl flex items-center gap-1.5">
                          <User className="h-5 w-5 text-blue-600" /> Official ABHA Card & Security
                        </h2>
                        <p className="text-xs text-slate-500">Government of India Digitally Signed Credentials</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {/* ABHA Card mockup */}
                        <div className="space-y-4">
                          <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-950 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden border border-blue-800 space-y-4 animate-fade-in">
                            {/* Govt top label */}
                            <div className="flex justify-between items-start">
                              <div className="text-left">
                                <p className="text-[8.5px] font-bold text-orange-400 tracking-widest uppercase">Department of Health</p>
                                <p className="text-[7.5px] text-slate-300 font-medium">Government of India</p>
                              </div>
                              <div className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center font-bold text-[10px]">
                                🇮🇳
                              </div>
                            </div>

                            <div className="flex gap-4 items-center pt-2">
                              <div className="h-16 w-16 bg-slate-800 rounded-2xl border border-white/20 overflow-hidden flex items-center justify-center shrink-0">
                                <User className="h-10 w-10 text-slate-400" />
                              </div>
                              <div className="text-left space-y-0.5">
                                <p className="text-[9.5px] text-emerald-400 font-extrabold uppercase tracking-widest">Digital ABHA Wallet</p>
                                <h3 className="font-black text-sm tracking-tight">{activeProfileData.name}</h3>
                                <p className="text-[10px] text-slate-300 font-mono">ID: {activeProfileData.abhaId}</p>
                              </div>
                            </div>

                            <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                              <div className="text-left text-[9px] text-slate-400">
                                <p>Gender: {activeProfileData.gender} • DOB: {activeProfileData.dob}</p>
                                <p className="font-mono mt-0.5">Linked Mobile: {activeProfileData.mobile}</p>
                              </div>
                              <div className="bg-white p-1 rounded-lg">
                                <QrCode className="h-10 w-10 text-slate-950" />
                              </div>
                            </div>
                          </div>

                          {/* BRAND NEW ABDM HEALTH PASSPORT CARD */}
                          <div className="bg-slate-950 text-slate-100 p-5 rounded-3xl shadow-xl border border-slate-800 space-y-4 text-left relative overflow-hidden group">
                            {/* Absolute glow decorative elements */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all duration-300"></div>
                            
                            <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4.5 w-4.5 text-teal-400 animate-spin-slow animate-pulse" />
                                <span className="text-[10px] font-black tracking-widest text-teal-400 uppercase font-mono">
                                  Global Health Passport
                                </span>
                              </div>
                              <span className="text-[8.5px] bg-teal-500/10 text-teal-400 font-mono px-2 py-0.5 rounded-full border border-teal-500/20 font-bold uppercase">
                                Active EHR
                              </span>
                            </div>

                            {/* Passport Specific Dynamic Fields */}
                            <div className="grid grid-cols-2 gap-3.5 text-xs">
                              <div className="space-y-0.5">
                                <span className="text-[8.5px] text-slate-400 uppercase font-bold tracking-wider font-mono">Blood Group</span>
                                <p className="font-black text-slate-100 font-sans">
                                  {activeCitizenProfile === "mother" ? "A+ Positive" : activeCitizenProfile === "son" ? "B+ Positive" : "O+ Positive"}
                                </p>
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-[8.5px] text-slate-400 uppercase font-bold tracking-wider font-mono">Immunization Index</span>
                                <p className="font-black text-slate-100 font-sans">
                                  {activeCitizenProfile === "mother" ? "Complete" : activeCitizenProfile === "son" ? "Pediatric Level 4" : "94% Secured"}
                                </p>
                              </div>
                              <div className="space-y-0.5 col-span-2">
                                <span className="text-[8.5px] text-slate-400 uppercase font-bold tracking-wider font-mono">Known Allergies / Sensitivities</span>
                                <p className="font-black text-teal-300 font-sans">
                                  {activeCitizenProfile === "mother" ? "Dust Sensitivity, Penicillin Allergy" : activeCitizenProfile === "son" ? "Gluten Intolerant, Lactose Sensitive" : "None (No major clinical triggers)"}
                                </p>
                              </div>
                              <div className="space-y-0.5 col-span-2">
                                <span className="text-[8.5px] text-slate-400 uppercase font-bold tracking-wider font-mono">Emergency Medical Contact</span>
                                <p className="font-black text-slate-100 font-sans">
                                  {activeCitizenProfile === "mother" ? "Tamanna Kalia (Daughter) • +91 9876543210" : activeCitizenProfile === "son" ? "Tamanna Kalia (Mother) • +91 9876543210" : "Suman Devi (Mother) • +91 9111924481"}
                                </p>
                              </div>
                            </div>

                            {/* Interactive Action Buttons */}
                            <div className="pt-2 flex gap-2">
                              <button
                                onClick={() => {
                                  showToast(`Generating PDF Health Passport for ${activeProfileData.name}. Downloading signed credential token...`, "info");
                                }}
                                className="flex-1 bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-750 font-bold py-1.5 rounded-xl text-[10.5px] transition flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Download className="h-3.5 w-3.5 text-teal-400" />
                                <span>Get Wallet PDF</span>
                              </button>
                              <button
                                onClick={() => {
                                  showToast("Broadcasting secure cryptographically sealed clinical token for hospital validation check.", "success");
                                }}
                                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-1.5 rounded-xl text-[10.5px] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-teal-500/10"
                              >
                                <RefreshCw className="h-3.5 w-3.5" />
                                <span>Share Access</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Household card dependent linker */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                          <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider">Household Dependent Cards</h4>
                          
                          <form onSubmit={handleAddFamilyMemberSubmit} className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1 text-left">
                                <label className="font-bold text-slate-400">Dependent Name</label>
                                <input
                                  type="text"
                                  required
                                  value={newFamilyName}
                                  onChange={(e) => setNewFamilyName(e.target.value)}
                                  placeholder="e.g. Suman Devi"
                                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg animate-fade-in"
                                />
                              </div>
                              <div className="space-y-1 text-left">
                                <label className="font-bold text-slate-400">Relationship</label>
                                <select
                                  value={newFamilyRelation}
                                  onChange={(e) => setNewFamilyRelation(e.target.value)}
                                  className="w-full p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg"
                                >
                                  <option value="Mother">Mother</option>
                                  <option value="Father">Father</option>
                                  <option value="Spouse">Spouse</option>
                                  <option value="Son">Son</option>
                                  <option value="Daughter">Daughter</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1 text-left">
                              <label className="font-bold text-slate-400">ABHA / Aadhaar ID</label>
                              <input
                                type="text"
                                required
                                value={newFamilyAbha}
                                onChange={(e) => setNewFamilyAbha(e.target.value)}
                                placeholder="xxxx-xxxx-xxxx-xxxx"
                                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-center"
                              />
                            </div>

                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition">
                              Consent & Link Family Card
                            </button>
                          </form>

                          <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-left">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Dependents ({familyMembers.length})</p>
                            {familyMembers.map((fam, i) => (
                              <div key={i} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs animate-fade-in">
                                <div>
                                  <p className="font-extrabold text-slate-800 dark:text-slate-100">{fam.name}</p>
                                  <p className="text-[10px] text-slate-400 mt-0.5">Relation: {fam.relationship} • ID: {fam.abhaId}</p>
                                </div>
                                <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 font-extrabold text-[8.5px] px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/50 uppercase">Verified</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Audit log logs */}
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-left">
                          <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider">Cryptographic Consent Ledger</h4>
                          <div className="space-y-2.5 max-h-56 overflow-y-auto text-xs leading-normal pr-1">
                            {systemAuditLogs.filter(l => l.actor === "Citizen").map((l, idx) => (
                              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850">
                                <p className="font-extrabold text-slate-700 dark:text-slate-300">{l.action}</p>
                                <p className="text-slate-500 mt-0.5 text-[10.5px]">{l.details}</p>
                                <p className="text-[9px] text-slate-400 font-mono mt-1">{l.timestamp}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. DOCTOR CLINICAL DESK */}
              {activeUserType === "Doctor" && (
                <div className="space-y-6 animate-fade-in text-left pb-16">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="font-sans font-black text-slate-900 dark:text-white text-lg md:text-xl flex items-center gap-1.5">
                        <Stethoscope className="h-5 w-5 text-emerald-600" /> HPR Verified Practitioner Workspace
                      </h2>
                      <p className="text-xs text-slate-500">Official Clinical consultation dashboard synchronized with HPR registry</p>
                    </div>

                    {/* Navigation Tab Control */}
                    <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 max-w-md shrink-0">
                      <button
                        onClick={() => setDoctorActiveTab("opd")}
                        className={`py-1.5 px-3 rounded-xl text-[11px] font-black tracking-tight transition cursor-pointer flex items-center gap-1.5 ${
                          doctorActiveTab === "opd"
                            ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm"
                            : "text-slate-650 dark:text-slate-400 hover:text-slate-900"
                        }`}
                      >
                        <Users className="h-3.5 w-3.5" />
                        <span>Physical OPD Queue</span>
                      </button>
                      <button
                        onClick={() => setDoctorActiveTab("teleconsult")}
                        className={`py-1.5 px-3 rounded-xl text-[11px] font-black tracking-tight transition cursor-pointer flex items-center gap-1.5 ${
                          doctorActiveTab === "teleconsult"
                            ? "bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm"
                            : "text-slate-650 dark:text-slate-400 hover:text-slate-900"
                        }`}
                      >
                        <Video className="h-3.5 w-3.5" />
                        <span>Video Teleconsultations</span>
                      </button>
                    </div>
                  </div>

                  {doctorActiveTab === "opd" ? (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in">
                      <DoctorDesk
                        queue={opdQueue}
                        activePatient={activePatient}
                        onSelectPatient={(id) => setActivePatient(opdQueue.find(p => p.id === id) || null)}
                        onAddPrescriptionToPatient={handleDoctorAddPrescription}
                        lang={lang}
                        t={t}
                        onShowToast={showToast}
                        sharedTokens={sharedTokens}
                        allMedicalRecords={medicalRecords}
                      />
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in">
                      <Teleconsultation
                        userType="Doctor"
                        currentDoctorName={activeDoctorName}
                        medicalRecords={medicalRecords}
                        onAddRecordToLocker={(rec) => setMedicalRecords([rec, ...medicalRecords])}
                        teleconsultations={teleconsultations}
                        onUpdateTeleconsultations={setTeleconsultations}
                        onAddAuditLog={(actor, action, details) => addAuditLog(actor, action, details)}
                        lang={lang}
                        t={t}
                        onShowToast={showToast}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* 3. HOSPITAL HFID ADMISSION CONTROLS */}
              {activeUserType === "Hospital" && (
                <div className="space-y-6 animate-fade-in text-left pb-16">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h2 className="font-sans font-black text-slate-900 dark:text-white text-lg md:text-xl flex items-center gap-1.5">
                      <Building2 className="h-5 w-5 text-indigo-600" /> HFID Admissions & Facilities Controller
                    </h2>
                    <p className="text-xs text-slate-500">Admissions Registrar counters, beds occupancy index, and PM-JAY preauth requests</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Admission Registrar Form */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
                      <h4 className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider">Fast Intake Admission Registrar</h4>
                      
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const name = (e.currentTarget.elements.namedItem("patName") as HTMLInputElement).value;
                        const abha = (e.currentTarget.elements.namedItem("patAbha") as HTMLInputElement).value;
                        const age = parseInt((e.currentTarget.elements.namedItem("patAge") as HTMLInputElement).value);
                        if (!name || !abha) return;

                        const newPat: OPDPatient = {
                          id: `pat-${Date.now()}`,
                          name,
                          age,
                          gender: "Male",
                          abhaId: abha,
                          status: "Waiting",
                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          symptoms: "Emergency Admissions Request"
                        };
                        setOpdQueue([newPat, ...opdQueue]);
                        addAuditLog("Hospital", "PATIENT_INTAKE", `Admitted emergency patient ${newPat.name} (ABHA: ${newPat.abhaId})`);
                        showToast(`Success! Admitted patient ${newPat.name} directly via synchronized ABHA consent handshakes.`, "success");
                        e.currentTarget.reset();
                      }} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1 text-left">
                            <label className="font-bold text-slate-400">Patient Full Name</label>
                            <input
                              name="patName"
                              type="text"
                              required
                              placeholder="Full Name"
                              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                            />
                          </div>
                          <div className="space-y-1 text-left">
                            <label className="font-bold text-slate-400">ABHA ID / Mobile</label>
                            <input
                              name="patAbha"
                              type="text"
                              required
                              placeholder="e.g. 91-2045-8123-5678"
                              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xs"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1 text-left">
                            <label className="font-bold text-slate-400">Age</label>
                            <input
                              name="patAge"
                              type="number"
                              required
                              placeholder="Age"
                              className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                            />
                          </div>
                          <div className="flex items-end">
                            <button
                              type="submit"
                              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl transition shadow-md shadow-indigo-500/10 cursor-pointer"
                            >
                              Sync & Admit
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>

                    {/* Bed management subcomponent */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <HospitalControl
                        initialBeds={initialHospitalBeds}
                        lang={lang}
                        t={t}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 4. GOVERNMENT SUPERVISORY CONSOLE */}
              {activeUserType === "Government" && (
                <div className="space-y-6 animate-fade-in text-left pb-16">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h2 className="font-sans font-black text-slate-900 dark:text-white text-lg md:text-xl flex items-center gap-1.5">
                      <TrendingUp className="h-5 w-5 text-amber-600" /> National Health Authority - Government Oversight Center
                    </h2>
                    <p className="text-xs text-slate-500">Review clinical applications, grant official ABDM credentials, manage suspensions, and audit real-time cryptographic consent logs</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <GovAnalytics
                      lang={lang}
                      t={t}
                      doctorApplications={doctorApplications}
                      hospitalApplications={hospitalApplications}
                      onApproveDoctor={handleApproveDoctorReg}
                      onApproveHospital={handleApproveHospitalReg}
                      systemAuditLogs={systemAuditLogs}
                    />
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>

        {/* Mobile bottom navigation bar overlay - only visible on Mobile for Citizens */}
        {activeUserType === "Citizen" && (
          <nav className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 h-14 flex justify-around items-center px-2 shrink-0 shadow-lg sticky bottom-0 z-40">
            {[
              { label: "Home", icon: User, screen: "Home" },
              { label: "Recent", icon: Clock, screen: "RecentActivity" },
              { label: "Content", icon: Video, screen: "HealthContent" },
              { label: "Share QR", icon: QrCode, screen: "ShareRecords" },
              { label: "Family", icon: Users, screen: "FamilyHealth" },
              { label: "Locker", icon: FileText, screen: "Locker" }
            ].map((tab) => (
              <button
                key={tab.screen}
                onClick={() => setActiveScreen(tab.screen)}
                className={`flex flex-col items-center justify-center transition shrink-0 cursor-pointer ${
                  activeScreen === tab.screen ? "text-blue-600 dark:text-blue-400 scale-105 font-bold" : "text-slate-400"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="text-[10px] mt-0.5 font-sans leading-none">{tab.label}</span>
              </button>
            ))}
          </nav>
        )}

        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-3.5 text-[10px] text-slate-400 dark:text-slate-500 text-center shrink-0">
          <p>© 2026 National Health Authority • Department of Health & Family Welfare • Government of India</p>
        </footer>
      </div>
    );
  }

  // ==========================================
  // MOBILE EMULATOR SCREENS (LOGIN FALLBACK)
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 md:p-6 select-none overflow-x-hidden">
      
      {/* Sleek physical responsive Android mobile emulator wrapper */}
      <div className="w-full h-screen md:w-[412px] md:h-[846px] md:rounded-[48px] md:border-[12px] md:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl relative overflow-hidden flex flex-col">
        
        {/* Phone Speaker & Notch */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 h-5 w-32 bg-slate-800 rounded-b-2xl z-50"></div>
        
        {/* Simulated Android Status Bar (with Saffron-White-Green Tiny accent ribbon) */}
        <div className="h-6 bg-slate-100 dark:bg-slate-900 flex justify-between items-center px-4 pt-1 text-[10px] text-slate-500 font-mono z-40">
          <div className="flex gap-1 items-center">
            <span className="h-1.5 w-1.5 bg-orange-500 rounded-full"></span>
            <span className="h-1.5 w-1.5 bg-white rounded-full"></span>
            <span className="h-1.5 w-1.5 bg-green-600 rounded-full"></span>
            <span className="font-bold text-slate-700 dark:text-slate-300">Aadhaar Sec</span>
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-[9px] font-bold">5G LTE</span>
            <Thermometer className="h-2.5 w-2.5" />
            <Activity className="h-2.5 w-2.5 animate-pulse text-rose-500" />
            <span className="font-bold">10:45 AM</span>
          </div>
        </div>

        {/* Dynamic App Screens Render area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col bg-white dark:bg-slate-950">

          {/* ==========================================
              C. LOGIN PAGES FOR THE 4 ROLES
              ========================================== */}
          {appSection === "Login" && (
            <div className="flex-1 p-5 flex flex-col justify-between text-slate-800 dark:text-slate-100 animate-fade-in pb-12">
              <div className="text-left space-y-3">
                <button
                  onClick={() => setAppSection("Welcome")}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition -ml-1 inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500"
                >
                  <ArrowLeft className="h-4 w-4" /> Portals
                </button>

                <div className="space-y-1">
                  <span className="text-[9px] bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold px-2 py-0.5 rounded uppercase font-sans">
                    {activeUserType} Secure Gate
                  </span>
                  <h3 className="text-base font-extrabold font-sans">
                    {activeUserType === "Citizen" ? "Aadhaar Health Locker Access" : activeUserType === "Doctor" ? "HPR Practitioner Sign In" : activeUserType === "Hospital" ? "HFID Facility Console Gateway" : "National Health Authority Audit Gate"}
                  </h3>
                </div>
              </div>

              {/* Interactive bypass button highlighted */}
              <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl space-y-2 text-xs my-4 text-left">
                <p className="font-bold text-[10.5px] text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-amber-500 animate-spin" /> Sandboxed Sandbox Clearance
                </p>
                <p className="text-[10px] text-slate-500 leading-snug">
                  Skip standard credentialing or 2FA checks. Tap the button below to bypass login and test all features instantly.
                </p>
                <button
                  onClick={() => handleQuickBypass(activeUserType)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black text-[10.5px] py-2 rounded-xl transition shadow flex items-center justify-center gap-1.5"
                >
                  <Fingerprint className="h-4 w-4" /> Fast Bypass Login (Instant Access)
                </button>
              </div>

              {/* Standard login Forms */}
              <div className="flex-1 my-2">
                {activeUserType === "Citizen" && (
                  <form onSubmit={handleCitizenSubmit} className="space-y-3 text-left text-xs">
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-bold text-slate-400 uppercase">ABHA Address / Mobile Number</label>
                      <input
                        type="text"
                        required
                        disabled={otpSent}
                        placeholder="e.g. 91-2045-8123-5678"
                        value={citizenInput}
                        onChange={(e) => setCitizenInput(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-xs focus:outline-none"
                      />
                    </div>

                    {otpSent && (
                      <div className="space-y-1.5 animate-fade-in">
                        <label className="text-[9.5px] font-bold text-slate-400 uppercase">Enter 6-Digit Aadhaar OTP</label>
                        <input
                          type="password"
                          required
                          placeholder="Test Code: 123456"
                          value={citizenOtp}
                          onChange={(e) => setCitizenOtp(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center tracking-widest font-mono text-sm focus:outline-none"
                        />
                        <p className="text-[9px] text-emerald-600 font-bold">✓ Securing validation handshake. Resend in 59s</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition shadow flex items-center justify-center gap-1.5"
                    >
                      {loginLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : otpSent ? "Verify & Link Session" : "Request Aadhaar Consent OTP"}
                    </button>
                  </form>
                )}

                {activeUserType === "Doctor" && (
                  <form onSubmit={handleDoctorSubmit} className="space-y-3 text-left text-xs">
                    {doctorLoginError && <p className="text-[10px] text-red-500 font-bold">{doctorLoginError}</p>}
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-bold text-slate-400 uppercase">Registered Username</label>
                      <input
                        type="text"
                        placeholder="e.g. dr_verma"
                        value={doctorUsername}
                        onChange={(e) => setDoctorUsername(e.target.value)}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-bold text-slate-400 uppercase">Password</label>
                      <input
                        type="password"
                        placeholder="e.g. password123"
                        value={doctorPassword}
                        onChange={(e) => setDoctorPassword(e.target.value)}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-bold text-slate-400 uppercase">2FA OTP (123456)</label>
                      <input
                        type="password"
                        placeholder="123456"
                        value={doctorOtp}
                        onChange={(e) => setDoctorOtp(e.target.value)}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs tracking-widest font-mono"
                      />
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs">
                      Sign In to Clinical Desk
                    </button>
                  </form>
                )}

                {activeUserType === "Hospital" && (
                  <form onSubmit={handleHospitalSubmit} className="space-y-3 text-left text-xs">
                    {hospitalLoginError && <p className="text-[10px] text-red-500 font-bold">{hospitalLoginError}</p>}
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-bold text-slate-400 uppercase">HFID Facility Username</label>
                      <input
                        type="text"
                        placeholder="e.g. hosp_max"
                        value={hospitalUsername}
                        onChange={(e) => setHospitalUsername(e.target.value)}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-bold text-slate-400 uppercase">Security Password</label>
                      <input
                        type="password"
                        placeholder="password123"
                        value={hospitalPassword}
                        onChange={(e) => setHospitalPassword(e.target.value)}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-bold text-slate-400 uppercase">2FA Token (123456)</label>
                      <input
                        type="password"
                        placeholder="123456"
                        value={hospitalOtp}
                        onChange={(e) => setHospitalOtp(e.target.value)}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs tracking-widest font-mono"
                      />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-xs">
                      Sign In to Facility Desk
                    </button>
                  </form>
                )}

                {activeUserType === "Government" && (
                  <form onSubmit={handleGovSubmit} className="space-y-3 text-left text-xs">
                    {govLoginError && <p className="text-[10px] text-red-500 font-bold">{govLoginError}</p>}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Audit Admin ID</label>
                        <input
                          type="text"
                          placeholder="admin"
                          value={govUsername}
                          onChange={(e) => setGovUsername(e.target.value)}
                          className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Password</label>
                        <input
                          type="password"
                          placeholder="admin123"
                          value={govPassword}
                          onChange={(e) => setGovPassword(e.target.value)}
                          className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Secure Key (123456)</label>
                        <input
                          type="password"
                          placeholder="123456"
                          value={govOtp}
                          onChange={(e) => setGovOtp(e.target.value)}
                          className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">CAPTCHA: NIC9</label>
                        <input
                          type="text"
                          placeholder="Enter NIC9"
                          value={govCaptcha}
                          onChange={(e) => setGovCaptcha(e.target.value)}
                          className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-2 text-[10.5px]">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={govHardwareKey}
                          onChange={(e) => setGovHardwareKey(e.target.checked)}
                          className="rounded border-slate-300 text-blue-600"
                        />
                        <span>FIDO2 Token Key inserted</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={govBiometric}
                          onChange={(e) => setGovBiometric(e.target.checked)}
                          className="rounded border-slate-300 text-blue-600"
                        />
                        <span>Secure Fingerprint matched</span>
                      </label>
                    </div>

                    <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-lg text-xs">
                      Sign In as Officer
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ==========================================
              D. PORTALS ACTIVE MAIN ROUTING VIEWS
              ========================================== */}
          {appSection === "Dashboard" && isLoggedIn && (
            <div className="flex-1 flex flex-col justify-between">
              
              {/* Top Custom Bar branding with Saffron/White/Green styling */}
              <div className="bg-white dark:bg-slate-900 p-3 px-4 border-b border-slate-150 dark:border-slate-850 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2 text-left">
                  <HealthShieldLogo size="xs" variant="icon-only" />
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white font-sans leading-none uppercase">
                      {activeUserType === "Citizen" ? "ABDM Citizen App" : activeUserType === "Doctor" ? "HPR Practitioner Desk" : activeUserType === "Hospital" ? "HFID Admission Desk" : "NHA Audit Portal"}
                    </h3>
                    <p className="text-[8.5px] text-slate-400 mt-0.5">Ayushman Bharat National Platform</p>
                  </div>
                </div>

                {/* Header controls */}
                <div className="flex items-center gap-2.5">
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value as any)}
                    className="p-1 text-[9.5px] font-bold bg-slate-50 border border-slate-200 dark:border-slate-800 rounded font-sans cursor-pointer focus:outline-none"
                  >
                    <option value="en">EN</option>
                    <option value="hi">HI</option>
                    <option value="mr">MR</option>
                    <option value="or">OR</option>
                  </select>

                  <button
                    onClick={handleLogout}
                    className="p-1 px-1.5 bg-rose-50 text-rose-600 rounded text-[9px] font-bold border border-rose-100 flex items-center gap-1 hover:bg-rose-100 transition"
                  >
                    <LogOut className="h-3 w-3" /> Log Out
                  </button>
                </div>
              </div>

              {/* Dynamic Sub-pages inside App layout */}
              <div className="flex-1 p-4 overflow-y-auto">

                {/* --------------------------------------
                    1. CITIZEN VIEWS
                    -------------------------------------- */}
                {activeUserType === "Citizen" && (
                  <>
                    {activeScreen !== "Home" && (
                      <div className="mb-3.5 flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-850 animate-fade-in text-left">
                        <button
                          onClick={() => {
                            setActiveScreen("Home");
                            addAuditLog("Citizen", "NAV_BACK", "Returned to primary Home Dashboard.");
                          }}
                          className="p-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-blue-600 dark:text-blue-400 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 font-bold text-[10.5px] shrink-0 border border-slate-200/40"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                          <span>Back</span>
                        </button>
                        <span className="text-slate-300 dark:text-slate-700">|</span>
                        <p className="text-[10px] text-slate-500 font-medium">
                          Viewing: <span className="uppercase font-bold tracking-wider text-slate-700 dark:text-slate-300">{activeScreen === "AISummary" ? "AABHA AI Doctor" : activeScreen === "Meds" ? "My Prescriptions" : activeScreen === "Timeline" ? "Clinical Timeline" : activeScreen}</span>
                        </p>
                      </div>
                    )}

                    {/* Standard Citizen Dashboard */}
                    {activeScreen === "Home" && (
                      <div className="space-y-4 animate-fade-in text-left pb-16">
                        
                        {/* Indian Flag thematic Saffron-White-Green border decoration */}
                        <div className="h-1 bg-gradient-to-r from-orange-500 via-white to-green-600 rounded-full mb-1"></div>

                        {/* Namaste Greeting & Health Score Circle */}
                        <div className="bg-gradient-to-br from-blue-700 to-indigo-850 text-white p-4 rounded-2xl shadow-lg relative overflow-hidden border border-blue-600 flex justify-between items-center">
                          <div className="space-y-0.5">
                            <span className="text-[8.5px] text-blue-200 uppercase font-sans tracking-wider font-semibold">Verified Aadhaar Identity</span>
                            <h3 className="text-sm font-extrabold font-sans">Namaste, {abhaMetadata.name}!</h3>
                            <p className="text-[10px] text-blue-200 font-mono">ABHA ID: {abhaMetadata.abhaId}</p>
                          </div>
                          
                          {/* Circular health score interactive dial */}
                          <div
                            onClick={() => setActiveScreen("Rewards")}
                            className="h-14 w-14 rounded-full border-4 border-emerald-400 bg-white/10 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition shrink-0 relative"
                            title="Click to view health metrics"
                          >
                            <span className="text-xs font-black leading-none">{abhaMetadata.healthScore}</span>
                            <span className="text-[6.5px] text-emerald-200 font-bold uppercase mt-0.5">Score</span>
                          </div>
                        </div>

                        {/* Quick metrics grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-850 flex items-center gap-2">
                            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-lg">
                              <Award className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="text-[8.5px] text-slate-400 uppercase font-bold tracking-wider block font-sans">Wellness Pts</span>
                              <span className="text-xs font-black text-slate-800 dark:text-slate-100 font-mono">{abhaMetadata.rewardPoints} pts</span>
                            </div>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-150 dark:border-slate-850 flex items-center gap-2">
                            <div className="p-1.5 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded-lg">
                              <ShieldAlert className="h-4 w-4" />
                            </div>
                            <div>
                              <span className="text-[8.5px] text-slate-400 uppercase font-bold tracking-wider block font-sans">Policy Cover</span>
                              <span className="text-xs font-black text-slate-800 dark:text-slate-100 font-sans">₹5.0L Active</span>
                            </div>
                          </div>
                        </div>

                        {/* Complete Navigable Feature Grid */}
                        <div className="space-y-2">
                          <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest">Interactive Health Booklet</p>
                          
                          <div className="grid grid-cols-3 gap-2.5">
                            {[
                              { label: "PM-JAY Golden Card", screen: "PMJAY", icon: CreditCard, color: "text-amber-500 bg-amber-50" },
                              { label: "Recent Health", screen: "RecentActivity", icon: Clock, color: "text-blue-600 bg-blue-50" },
                              { label: "Health Videos", screen: "HealthContent", icon: Video, color: "text-rose-500 bg-rose-50" },
                              { label: "Share Records", screen: "ShareRecords", icon: QrCode, color: "text-emerald-500 bg-emerald-50" },
                              { label: "Family Health", screen: "FamilyHealth", icon: Users, color: "text-violet-500 bg-violet-50" },
                              { label: "Emergency SOS", screen: "Emergency", icon: ShieldAlert, color: "text-red-500 bg-red-50" },
                              { label: "Today's Pills", screen: "Meds", icon: Pill, color: "text-blue-500 bg-blue-50" },
                              { label: "Vaccines", screen: "Vaccines", icon: Thermometer, color: "text-emerald-500 bg-emerald-50" },
                              { label: "Timeline History", screen: "Timeline", icon: Calendar, color: "text-indigo-500 bg-indigo-50" },
                              { label: "AABHA AI Doctor", screen: "AISummary", icon: Sparkles, color: "text-rose-500 bg-rose-50 animate-pulse" },
                              { label: "Hospitals", screen: "Hospitals", icon: MapPin, color: "text-indigo-500 bg-indigo-50" },
                              { label: "Health Alerts", screen: "News", icon: Info, color: "text-blue-500 bg-blue-50" },
                              { label: "Missions & Pts", screen: "Rewards", icon: Award, color: "text-emerald-500 bg-emerald-50" }
                            ].map((feat) => (
                              <button
                                key={feat.screen}
                                onClick={() => setActiveScreen(feat.screen)}
                                className="p-2.5 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100/60 dark:hover:bg-slate-950/40 rounded-2xl border border-slate-150 dark:border-slate-850 transition flex flex-col items-center justify-between text-center min-h-[82px] border-b-2"
                              >
                                <div className={`p-1.5 rounded-xl ${feat.color}`}>
                                  <feat.icon className="h-5 w-5" />
                                </div>
                                <span className="text-[9.5px] font-extrabold text-slate-700 dark:text-slate-300 mt-1 leading-tight tracking-tight font-sans">
                                  {feat.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Upcoming appointment snapshot */}
                        <div className="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-150 dark:border-slate-850 space-y-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-slate-400 uppercase font-sans">Next Appointment</span>
                            <span className="text-blue-600 font-bold hover:underline cursor-pointer" onClick={() => setActiveScreen("Appointments")}>View all</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <div>
                              <p className="font-black text-slate-800 dark:text-slate-200 font-sans">{appointments[0]?.doctorName}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{appointments[0]?.specialty} • {appointments[0]?.hospitalName}</p>
                            </div>
                            <span className="bg-blue-50 text-blue-700 font-bold px-2 py-1 rounded-full text-[9px] font-sans">
                              {appointments[0]?.time}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Pill reminder widget */}
                        <div className="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-150 dark:border-slate-850 space-y-2">
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-slate-400 uppercase font-sans">Today's Pill Reminder</span>
                            <span className="text-blue-600 font-bold hover:underline cursor-pointer" onClick={() => setActiveScreen("Meds")}>Track</span>
                          </div>
                          <div className="flex items-center gap-3 bg-white dark:bg-slate-950 p-2.5 rounded-lg border border-slate-150 dark:border-slate-850 justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <Pill className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                              <div>
                                <p className="font-bold text-slate-800 dark:text-slate-100">Metformin 500mg</p>
                                <p className="text-[9.5px] text-slate-400">Morning, After breakfast</p>
                              </div>
                            </div>
                            <span className="bg-emerald-50 text-emerald-700 font-bold text-[8px] px-2 py-0.5 rounded border border-emerald-100 uppercase">Taken</span>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Navigable Citizen Sub-screens routing */}
                    {activeScreen === "RecentActivity" && (
                      <RecentHealthActivity
                        medicalRecords={activeProfileData.records}
                        appointments={activeProfileData.appointments}
                        activePatientName={activeProfileData.name}
                        activePatientAbha={activeProfileData.abhaId}
                        lang={lang}
                        onNavigateToLocker={() => setActiveScreen("Locker")}
                        onNavigateToAppointments={() => setActiveScreen("Appointments")}
                        onShowToast={showToast}
                      />
                    )}

                    {activeScreen === "HealthContent" && (
                      <HealthContentHub
                        contentItems={healthContentItems}
                        campaignBanners={campaignBanners}
                        onUpdateContentItems={setHealthContentItems}
                        onUpdateCampaignBanners={setCampaignBanners}
                        lang={lang}
                        onShowToast={showToast}
                      />
                    )}

                    {activeScreen === "ShareRecords" && (
                      <SelectiveShareQR
                        medicalRecords={activeProfileData.records}
                        sharedTokens={sharedTokens}
                        onUpdateSharedTokens={setSharedTokens}
                        activePatientName={activeProfileData.name}
                        activePatientAbha={activeProfileData.abhaId}
                        lang={lang}
                        onShowToast={showToast}
                      />
                    )}

                    {activeScreen === "FamilyHealth" && (
                      <FamilyHealthManager
                        familyProfiles={familyProfiles}
                        activeProfileId={activeFamilyProfileId}
                        onSelectActiveProfile={setActiveFamilyProfileId}
                        onUpdateFamilyProfiles={setFamilyProfiles}
                        lang={lang}
                        onShowToast={showToast}
                      />
                    )}

                    {activeScreen === "PMJAY" && (
                      <PMJAYPortal
                        abhaMetadata={abhaMetadata}
                        pmjayClaims={pmjayClaims}
                        preAuthRequests={preAuthRequests}
                        preAuthForm={preAuthForm}
                        setPreAuthForm={setPreAuthForm}
                        onAddPreAuth={handleAddPreAuthRequestSubmit}
                        preAuthSuccess={preAuthSuccess}
                        eVouchers={eVouchers}
                        onGenerateVoucher={handleGeneratePreventiveVoucher}
                        newVoucherSuccess={newVoucherSuccess}
                        onBack={() => setActiveScreen("Home")}
                      />
                    )}

                    {activeScreen === "Emergency" && (
                      <EmergencyQRPage abhaMetadata={abhaMetadata} onBack={() => setActiveScreen("Home")} />
                    )}

                    {activeScreen === "Meds" && (
                      <MedicineTrackerPage onBack={() => setActiveScreen("Home")} />
                    )}

                    {activeScreen === "Vaccines" && (
                      <VaccinationDetails onBack={() => setActiveScreen("Home")} />
                    )}

                    {activeScreen === "Timeline" && (
                      <TimelinePage medicalRecords={medicalRecords} onBack={() => setActiveScreen("Home")} />
                    )}

                    {activeScreen === "Hospitals" && (
                      <HospitalDirectory onBack={() => setActiveScreen("Home")} onShowToast={showToast} />
                    )}

                    {activeScreen === "News" && (
                      <HealthNewsPage onBack={() => setActiveScreen("Home")} />
                    )}

                    {/* Locker Tab (Health Records Explainer) */}
                    {activeScreen === "Locker" && (
                      <div className="space-y-4 animate-fade-in text-left pb-16">
                        <div className="border-b border-slate-100 dark:border-slate-900 pb-2">
                          <h4 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                            <FileText className="h-4 w-4 text-blue-600" /> ABDM Digital Health Locker
                          </h4>
                          <p className="text-[10px] text-slate-500">Secure consent-based repository explanation & AI-explainers</p>
                        </div>

                        {/* List of active medical records */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Linked Records List ({medicalRecords.length})</p>
                          {medicalRecords.map((rec) => (
                            <div key={rec.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-850 text-xs">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-extrabold text-slate-800 dark:text-slate-200 font-sans">{rec.title}</p>
                                  <p className="text-[9.5px] text-slate-500 mt-0.5">{rec.institution} • {rec.date}</p>
                                  <p className="text-[8.5px] text-slate-400 mt-0.5">Doctor: {rec.doctorName}</p>
                                </div>
                                <span className="bg-blue-50 text-blue-700 font-bold text-[8px] px-2 py-0.5 rounded-full uppercase shrink-0">
                                  {rec.type}
                                </span>
                              </div>
                              {rec.summary && (
                                <p className="text-[9.5px] text-slate-400 font-sans mt-2 bg-white dark:bg-slate-950 p-1.5 rounded border border-slate-100 leading-normal">
                                  {rec.summary}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Gemini explainer module embedded */}
                        <AIChatAndSummary
                          onAddRecordToLocker={(rec) => setMedicalRecords([rec, ...medicalRecords])}
                          lang={lang}
                          t={t}
                        />
                      </div>
                    )}

                    {/* AISummary Tab (Direct AABHA Chat assistant) */}
                    {activeScreen === "AISummary" && (
                      <div className="space-y-4 animate-fade-in text-left pb-16">
                        <div className="border-b border-slate-100 dark:border-slate-900 pb-2 flex justify-between items-center">
                          <div>
                            <h4 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                              <Sparkles className="h-4 w-4 text-rose-500" /> AABHA Health Assistant
                            </h4>
                            <p className="text-[10px] text-slate-500">Real-time Gemini consultation explainer proxy</p>
                          </div>
                          {activeScreen !== "Home" && (
                            <button onClick={() => setActiveScreen("Home")} className="p-1 px-2 text-[10px] bg-slate-50 border rounded-lg font-bold font-sans">
                              Back
                            </button>
                          )}
                        </div>
                        <AIChatAndSummary lang={lang} t={t} />
                      </div>
                    )}

                    {/* Appointments Tab */}
                    {activeScreen === "Appointments" && (
                      <div className="space-y-4 animate-fade-in text-left pb-16">
                        <div className="border-b border-slate-100 dark:border-slate-900 pb-2">
                          <h4 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-blue-600" /> My Consultations & Slots
                          </h4>
                          <p className="text-[10px] text-slate-500">OPD Appointments and digital hospital queues</p>
                        </div>

                        {bookingSuccessMsg && (
                          <div className="p-2.5 bg-emerald-50 text-emerald-700 text-[10.5px] rounded-lg border border-emerald-100 font-bold">
                            {bookingSuccessMsg}
                          </div>
                        )}

                        {/* Book consult form */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-150 dark:border-slate-850 shadow-sm space-y-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Book New OPD Slot</p>
                          
                          <form onSubmit={handleBookConsultationSubmit} className="space-y-2.5 text-xs">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[8.5px] font-bold text-slate-400 block mb-0.5 uppercase">Hospital</label>
                                <select
                                  value={bookingHospital}
                                  onChange={(e) => setBookingHospital(e.target.value)}
                                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                                >
                                  <option value="Max Super Speciality Hospital">Max Speciality Hospital</option>
                                  <option value="Saket City Clinic">Saket City Clinic</option>
                                  <option value="Fortis Healthcare Delhi">Fortis Healthcare Delhi</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-[8.5px] font-bold text-slate-400 block mb-0.5 uppercase">Specialty</label>
                                <select
                                  value={bookingSpecialty}
                                  onChange={(e) => setBookingSpecialty(e.target.value)}
                                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                                >
                                  <option value="General Medicine">General Medicine</option>
                                  <option value="Cardiology">Cardiology</option>
                                  <option value="Pediatrics">Pediatrics</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[8.5px] font-bold text-slate-400 block mb-0.5 uppercase">Date</label>
                                <input
                                  type="date"
                                  value={bookingDate}
                                  onChange={(e) => setBookingDate(e.target.value)}
                                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                                />
                              </div>

                              <div>
                                <label className="text-[8.5px] font-bold text-slate-400 block mb-0.5 uppercase">Time Slot</label>
                                <select
                                  value={bookingTime}
                                  onChange={(e) => setBookingTime(e.target.value)}
                                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10.5px]"
                                >
                                  <option value="10:00 AM">10:00 AM</option>
                                  <option value="11:00 AM">11:00 AM</option>
                                  <option value="02:30 PM">02:30 PM</option>
                                  <option value="04:00 PM">04:00 PM</option>
                                </select>
                              </div>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition text-[11px] shadow">
                              Confirm Booking
                            </button>
                          </form>
                        </div>

                        {/* List of active consultations */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Booked OPD Slots ({appointments.length})</p>
                          {appointments.map((appt) => (
                            <div key={appt.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-850 flex justify-between items-center text-xs">
                              <div>
                                <p className="font-extrabold text-slate-800 dark:text-slate-100 font-sans">{appt.doctorName}</p>
                                <p className="text-[9.5px] text-slate-500 font-sans">{appt.specialty} • {appt.hospitalName}</p>
                                <p className="text-[8.5px] text-slate-400 font-mono mt-0.5">ApptID: {appt.id}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="bg-emerald-50 text-emerald-800 font-bold text-[8.5px] px-2.5 py-1 rounded-full border border-emerald-100">
                                  {appt.time}
                                </span>
                                <p className="text-[8.5px] text-slate-400 mt-1.5">{appt.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                      </div>
                    )}

                    {/* Rewards Tab (Wellness & Habits tracker) */}
                    {activeScreen === "Rewards" && (
                      <div className="space-y-4 animate-fade-in text-left pb-16">
                        <div className="border-b border-slate-100 dark:border-slate-900 pb-2 flex justify-between items-center">
                          <div>
                            <h4 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                              <Award className="h-4 w-4 text-emerald-600" /> Ayushman Wellness Points
                            </h4>
                            <p className="text-[10px] text-slate-500">Log healthy habits to trigger medication subsidies</p>
                          </div>
                          {activeScreen !== "Home" && (
                            <button onClick={() => setActiveScreen("Home")} className="p-1 px-2 text-[10px] bg-slate-50 border rounded-lg font-bold font-sans">
                              Back
                            </button>
                          )}
                        </div>

                        <RewardsWellness
                          challenges={challenges}
                          rewardPoints={abhaMetadata.rewardPoints}
                          onToggleChallenge={handleToggleChallenge}
                          lang={lang}
                          t={t}
                        />
                      </div>
                    )}

                    {/* Profile Tab (ABHA Card, Linked Family, Consent log) */}
                    {activeScreen === "Profile" && (
                      <div className="space-y-4 animate-fade-in text-left pb-16">
                        <div className="border-b border-slate-100 dark:border-slate-900 pb-2">
                          <h4 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                            <User className="h-4 w-4 text-blue-600" /> Digital ABHA Card Profile
                          </h4>
                          <p className="text-[10px] text-slate-500">Manage linked dependents and security clearances</p>
                        </div>

                        {/* Interactive Digital ABHA Card Layout */}
                        <div className="bg-gradient-to-br from-indigo-700 via-blue-800 to-indigo-950 text-white p-4.5 rounded-2xl shadow-xl border border-indigo-500 flex flex-col justify-between h-48">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1.5">
                              <div className="h-7 w-7 bg-white rounded-full flex items-center justify-center text-xs font-bold text-blue-600 font-sans">
                                IN
                              </div>
                              <div>
                                <h4 className="text-[10px] font-black leading-none">Aadhaar Health ID</h4>
                                <p className="text-[7px] text-indigo-200 mt-0.5 font-bold uppercase tracking-wider">Ayushman Bharat Mission</p>
                              </div>
                            </div>
                            <span className="bg-emerald-400 text-slate-900 font-extrabold text-[7.5px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                              VERIFIED
                            </span>
                          </div>

                          <div className="flex justify-between items-end">
                            <div className="space-y-0.5 text-xs">
                              <p className="text-[8px] text-indigo-200 uppercase tracking-widest">Aadhaar Holder Name</p>
                              <p className="font-extrabold text-sm">{abhaMetadata.name}</p>
                              <p className="font-mono text-[9px] text-indigo-100">{abhaMetadata.abhaId}</p>
                              <p className="text-[8px] text-indigo-300">DOB: {abhaMetadata.dob} • Gender: {abhaMetadata.gender}</p>
                            </div>
                            <div className="p-1.5 bg-white rounded-xl shrink-0">
                              <QrCode className="h-14 w-14 text-slate-900" />
                            </div>
                          </div>
                        </div>

                        {/* Add family member Dependent */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-150 dark:border-slate-850 shadow-sm space-y-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Link Family Household Card</p>
                          
                          <form onSubmit={handleAddFamilyMemberSubmit} className="space-y-2.5 text-xs">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[8.5px] font-bold text-slate-400 block mb-0.5">Dependent Name</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Suman Devi"
                                  value={newFamilyName}
                                  onChange={(e) => setNewFamilyName(e.target.value)}
                                  className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px]"
                                />
                              </div>
                              <div>
                                <label className="text-[8.5px] font-bold text-slate-400 block mb-0.5">Relation</label>
                                <select
                                  value={newFamilyRelation}
                                  onChange={(e) => setNewFamilyRelation(e.target.value)}
                                  className="w-full p-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px]"
                                >
                                  <option value="Mother">Mother</option>
                                  <option value="Father">Father</option>
                                  <option value="Spouse">Spouse</option>
                                  <option value="Son">Son</option>
                                  <option value="Daughter">Daughter</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="text-[8.5px] font-bold text-slate-400 block mb-0.5">ABHA / Aadhaar ID</label>
                              <input
                                type="text"
                                required
                                placeholder="xxxx-xxxx-xxxx-xxxx"
                                value={newFamilyAbha}
                                onChange={(e) => setNewFamilyAbha(e.target.value)}
                                className="w-full p-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-mono"
                              />
                            </div>

                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded-lg text-[10.5px] transition">
                              Consent & Link Family Card
                            </button>
                          </form>

                          {/* Dependent Family Members List */}
                          <div className="space-y-2 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-[9.5px] font-bold text-slate-400 uppercase">Linked Dependents ({familyMembers.length})</p>
                            {familyMembers.map((fam, i) => (
                              <div key={i} className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-150 dark:border-slate-850 flex justify-between items-center text-xs">
                                <div>
                                  <p className="font-bold text-slate-800 dark:text-slate-100">{fam.name}</p>
                                  <p className="text-[9.5px] text-slate-400">Relation: {fam.relationship} • ID: {fam.abhaId}</p>
                                </div>
                                <span className="bg-emerald-50 text-emerald-800 font-bold text-[8.5px] px-2 py-0.5 rounded border border-emerald-100 uppercase">Verified</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Auditing consensus consent records */}
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-150 dark:border-slate-850 space-y-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase font-sans">Data Consent Log Ledger</p>
                          <div className="space-y-1.5 max-h-40 overflow-y-auto text-[10px] text-slate-500 font-sans leading-tight">
                            {systemAuditLogs.filter(l => l.actor === "Citizen").map((l, idx) => (
                              <div key={idx} className="p-2 bg-white dark:bg-slate-950 rounded border border-slate-150 dark:border-slate-900">
                                <p className="font-bold text-slate-700 dark:text-slate-300">{l.action}</p>
                                <p className="mt-0.5 text-slate-400">{l.details}</p>
                                <p className="text-[8px] text-slate-400 font-mono mt-0.5">{l.timestamp}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Floating Mobile Bottom Navigation Bar */}
                    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-250 dark:border-slate-800/80 flex justify-around items-center px-4 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-safe">
                      {[
                        { label: "Home", icon: User, screen: "Home" },
                        { label: "Locker", icon: FileText, screen: "Locker" },
                        { label: "Book Slots", icon: Calendar, screen: "Appointments" },
                        { label: "Rewards", icon: Award, screen: "Rewards" },
                        { label: "Passport", icon: Settings, screen: "Profile" }
                      ].map((tab) => {
                        const IsActive = activeScreen === tab.screen;
                        return (
                          <button
                            key={tab.screen}
                            onClick={() => {
                              setActiveScreen(tab.screen);
                            }}
                            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 cursor-pointer relative"
                          >
                            <tab.icon className={`h-5 w-5 transition-transform ${IsActive ? "text-blue-600 scale-110" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`} />
                            <span className={`text-[9px] mt-0.5 font-bold transition-colors ${IsActive ? "text-blue-600" : "text-slate-500 dark:text-slate-400"}`}>
                              {tab.label}
                            </span>
                            {IsActive && (
                              <span className="absolute bottom-0 h-1 w-4 bg-blue-600 rounded-full animate-pulse shadow-sm shadow-blue-500/50"></span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* --------------------------------------
                    2. DOCTOR VIEWS
                    -------------------------------------- */}
                {activeUserType === "Doctor" && (
                  <div className="space-y-4 animate-fade-in text-left pb-16">
                    <div className="border-b border-slate-150 dark:border-slate-850 pb-2 flex justify-between items-center">
                      <div>
                        <h4 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                          <Stethoscope className="h-4.5 w-4.5 text-emerald-600" /> HPR Verified Desk
                        </h4>
                        <p className="text-[10px] text-slate-500">MCI Registered practitioner workspace</p>
                      </div>
                    </div>

                    {/* Embed Doctor Desk subcomponent */}
                    <DoctorDesk
                      queue={opdQueue}
                      activePatient={activePatient}
                      onSelectPatient={(id) => setActivePatient(opdQueue.find(p => p.id === id) || null)}
                      onAddPrescriptionToPatient={handleDoctorAddPrescription}
                      lang={lang}
                      t={t}
                      onShowToast={showToast}
                      sharedTokens={sharedTokens}
                      allMedicalRecords={medicalRecords}
                    />
                  </div>
                )}

                {/* --------------------------------------
                    3. HOSPITAL VIEWS
                    -------------------------------------- */}
                {activeUserType === "Hospital" && (
                  <div className="space-y-4 animate-fade-in text-left pb-16">
                    <div className="border-b border-slate-150 dark:border-slate-850 pb-2">
                      <h4 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                        <Building2 className="h-4.5 w-4.5 text-indigo-600" /> HFID Admissions Console
                      </h4>
                      <p className="text-[10px] text-slate-500">Empanelled facility bed inventory & claims tracker</p>
                    </div>

                    {/* Patient registration counter mock */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fast Intake Admission Registrar</p>
                      
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const name = (e.currentTarget.elements.namedItem("patName") as HTMLInputElement).value;
                        const abha = (e.currentTarget.elements.namedItem("patAbha") as HTMLInputElement).value;
                        const age = parseInt((e.currentTarget.elements.namedItem("patAge") as HTMLInputElement).value);
                        if (!name || !abha) return;

                        const newPat: OPDPatient = {
                          id: `pat-${Date.now()}`,
                          name,
                          age,
                          gender: "Male",
                          abhaId: abha,
                          status: "Waiting",
                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          symptoms: "Emergency Admissions Request"
                        };
                        setOpdQueue([newPat, ...opdQueue]);
                        addAuditLog("Hospital", "PATIENT_INTAKE", `Admitted emergency patient ${newPat.name} (ABHA: ${newPat.abhaId})`);
                        showToast(`Success! Admitted patient ${newPat.name} directly via synchronized ABHA consent handshakes.`, "success");
                        e.currentTarget.reset();
                      }} className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            name="patName"
                            type="text"
                            required
                            placeholder="Patient Full Name"
                            className="p-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-xs"
                          />
                          <input
                            name="patAbha"
                            type="text"
                            required
                            placeholder="ABHA ID / Mobile"
                            className="p-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded font-mono text-[10px]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            name="patAge"
                            type="number"
                            required
                            placeholder="Age"
                            className="p-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded text-xs"
                          />
                          <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-1.5 rounded text-[10.5px] transition"
                          >
                            Sync & Admit Patient
                          </button>
                        </div>
                      </form>
                    </div>

                    <HospitalControl
                      initialBeds={initialHospitalBeds}
                      lang={lang}
                      t={t}
                    />
                  </div>
                )}

                {/* --------------------------------------
                    4. GOVERNMENT VIEWS
                    -------------------------------------- */}
                {activeUserType === "Government" && (
                  <div className="space-y-4 animate-fade-in text-left pb-16">
                    <div className="border-b border-slate-150 dark:border-slate-850 pb-2">
                      <h4 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                        <TrendingUp className="h-4.5 w-4.5 text-amber-600" /> NHA Public Oversight Hub
                      </h4>
                      <p className="text-[10px] text-slate-500">Government Registry Approvals & disease heatmaps</p>
                    </div>

                    <GovAnalytics
                      lang={lang}
                      t={t}
                      doctorApplications={doctorApplications}
                      hospitalApplications={hospitalApplications}
                      onApproveDoctor={handleApproveDoctorReg}
                      onApproveHospital={handleApproveHospitalReg}
                      systemAuditLogs={systemAuditLogs}
                    />
                  </div>
                )}

              </div>

            </div>
          )}

        </div>

      {/* Reusable premium Toast Notification with motion */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-sm md:max-w-md w-[calc(100%-2rem)] bg-slate-900/95 dark:bg-slate-800/95 text-white dark:text-slate-100 backdrop-blur shadow-2xl p-4 rounded-2xl border border-slate-800 dark:border-slate-700 flex gap-3 items-center text-left"
          >
            {toast.type === "success" ? (
              <div className="h-8 w-8 shrink-0 bg-green-500/15 text-green-500 rounded-full flex items-center justify-center font-bold">
                ✓
              </div>
            ) : toast.type === "error" ? (
              <div className="h-8 w-8 shrink-0 bg-red-500/15 text-red-500 rounded-full flex items-center justify-center font-bold">
                ✕
              </div>
            ) : (
              <div className="h-8 w-8 shrink-0 bg-blue-500/15 text-blue-500 rounded-full flex items-center justify-center font-bold">
                ℹ
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[11.5px] md:text-xs font-semibold leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-200 dark:hover:text-slate-400 p-1 text-xs font-bold leading-none cursor-pointer animate-pulse"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Physical simulated home gesture indicator line */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-28 bg-slate-350 dark:bg-slate-800 rounded-full z-45 pointer-events-none"></div>

      </div>

    </div>
  );
}
