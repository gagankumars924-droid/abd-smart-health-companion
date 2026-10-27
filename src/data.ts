import {
  MedicalRecord,
  Appointment,
  Challenge,
  OPDPatient,
  HospitalBed,
  ABHAMetadata,
  HealthContentItem,
  HealthCampaignBanner,
  SharedRecordToken,
  FamilyMemberProfile
} from "./types";

// Multi-lingual Translations
export const translations = {
  en: {
    title: "HealthShield Bharat",
    subtitle: "Ayushman Bharat Digital Mission",
    welcome: "Welcome",
    login: "Secure Login",
    enterAbha: "Enter ABHA Number or Mobile",
    otpSent: "OTP sent to your registered Aadhaar mobile number",
    verifyOtp: "Verify OTP",
    otpPlaceholder: "Enter 6-digit OTP",
    citizenRole: "Citizen Dashboard",
    doctorRole: "Doctor Desk",
    hospitalRole: "Hospital Control",
    govRole: "Govt Analytics",
    healthScore: "Health Score",
    upcomingAppts: "Appointments",
    healthRecords: "Health Locker",
    vaccinations: "Vaccinations",
    insurance: "Insurance Status",
    timeline: "Health Timeline",
    locker: "Digital Locker",
    summary: "AI Health Insight",
    booking: "Book Appointment",
    finder: "Nearby Hospitals",
    rewards: "Rewards & Wellness",
    emergency: "Emergency SOS",
    settings: "Settings",
    profile: "Profile",
    abhaId: "ABHA Number",
    abhaAddress: "ABHA Address",
    scanQr: "Scan QR Code",
    shareQr: "Share Health QR",
    addReport: "Add Lab Report",
    ocrSummary: "AI Report Explainer",
    preventiveTips: "Preventive Tips",
    missingScreenings: "Missing Screenings",
    riskAlerts: "Risk Indicators",
    healthTrends: "Health Trends",
    language: "Language Selection",
    darkMode: "Appearance",
    security: "Security & Consent",
    challenges: "Daily Challenges",
    points: "Points Available",
    badges: "Your Badges",
    habits: "Habit Tracker",
    emergencyCard: "Emergency Health QR",
    doctorDashboard: "Doctor Dashboard",
    hospitalDashboard: "Hospital Dashboard",
    govAnalytics: "Govt Dashboard",
    patientQueue: "Patient Queue",
    digitalPrescription: "Digital Prescription",
    instantUpdate: "Sync with ABHA",
    bedAvailability: "Beds Availability",
    opdManagement: "OPD Tracker",
    diseaseHeatmap: "Epidemic Heatmap",
    adoptionRate: "State-wise Adoption",
    familyHealth: "Family Accounts",
    recentActivity: "Recent Health Activity",
    healthContent: "Health Content & Videos",
    shareRecords: "Share Health Records",
    consentManager: "Data Sharing Consents",
    uploadSuccess: "Report parsed successfully by AI OCR!",
    pointsEarned: "Wellness points updated!",
  },
  hi: {
    title: "हेल्थशील्ड भारत",
    subtitle: "आयुष्मान भारत डिजिटल मिशन",
    welcome: "स्वागत है",
    login: "सुरक्षित लॉगिन",
    enterAbha: "आभा नंबर या मोबाइल दर्ज करें",
    otpSent: "आपके पंजीकृत आधार मोबाइल नंबर पर ओटीपी भेजा गया",
    verifyOtp: "ओटीपी सत्यापित करें",
    otpPlaceholder: "6-अंकीय ओटीपी दर्ज करें",
    citizenRole: "नागरिक डैशबोर्ड",
    doctorRole: "डॉक्टर डेस्क",
    hospitalRole: "अस्पताल नियंत्रण",
    govRole: "सरकारी विश्लेषिकी",
    healthScore: "स्वास्थ्य स्कोर",
    upcomingAppts: "अपॉइंटमेंट्स",
    healthRecords: "हेल्थ लॉकर",
    vaccinations: "टीकाकरण",
    insurance: "बीमा की स्थिति",
    timeline: "स्वास्थ्य समयरेखा",
    locker: "डिजिटल लॉकर",
    summary: "एआई स्वास्थ्य अंतर्दृष्टि",
    booking: "अपॉइंटमेंट बुक करें",
    finder: "निकटतम अस्पताल",
    rewards: "पुरस्कार और कल्याण",
    emergency: "आपातकालीन एसओएस",
    settings: "सेटिंग्स",
    profile: "प्रोफाइल",
    abhaId: "आभा संख्या",
    abhaAddress: "आभा पता",
    scanQr: "क्यूआर स्कैन करें",
    shareQr: "हेल्थ क्यूआर साझा करें",
    addReport: "लैब रिपोर्ट जोड़ें",
    ocrSummary: "एआई रिपोर्ट विश्लेषण",
    preventiveTips: "निवारक युक्तियाँ",
    missingScreenings: "छूटे हुए परीक्षण",
    riskAlerts: "जोखिम संकेत",
    healthTrends: "स्वास्थ्य रुझान",
    language: "भाषा चयन",
    darkMode: "सजावट शैली",
    security: "सुरक्षा और सहमति",
    challenges: "दैनिक चुनौतियां",
    points: "उपलब्ध अंक",
    badges: "आपके बैज",
    habits: "आदत ट्रैकर",
    emergencyCard: "आपातकालीन स्वास्थ्य क्यूआर",
    doctorDashboard: "डॉक्टर डैशबोर्ड",
    hospitalDashboard: "अस्पताल डैशबोर्ड",
    govAnalytics: "सरकारी डैशबोर्ड",
    patientQueue: "मरीज कतार",
    digitalPrescription: "डिजिटल पर्चा",
    instantUpdate: "आभा के साथ सिंक करें",
    bedAvailability: "बेड उपलब्धता",
    opdManagement: "ओपीडी ट्रैकर",
    diseaseHeatmap: "महामारी हीटमैप",
    adoptionRate: "राज्य-वार अपनाना",
    familyHealth: "पारिवारिक खाते",
    recentActivity: "हाल की स्वास्थ्य गतिविधियां",
    healthContent: "स्वास्थ्य वीडियो और सामग्री",
    shareRecords: "स्वास्थ्य रिकॉर्ड साझा करें",
    consentManager: "डेटा शेयरिंग सहमति",
    uploadSuccess: "एआई ओसीआर द्वारा रिपोर्ट का सफलतापूर्वक विश्लेषण किया गया!",
    pointsEarned: "वेलनेस अंक अपडेट किए गए!",
  },
  mr: {
    title: "एबीडीएम कंपेनियन",
    subtitle: "आयुष्मान भारत डिजिटल मिशन",
    welcome: "स्वागत आहे",
    login: "सुरक्षित लॉगिन",
    enterAbha: "आभा नंबर किंवा मोबाईल टाका",
    otpSent: "तुमच्या नोंदणीकृत आधार मोबाईल नंबरवर ओटीपी पाठवला आहे",
    verifyOtp: "ओटीपी सत्यापित करा",
    otpPlaceholder: "६-अंकी ओटीपी टाका",
    citizenRole: "नागरिक डॅशबोर्ड",
    doctorRole: "डॉक्टर डेस्क",
    hospitalRole: "रुग्णालय नियंत्रण",
    govRole: "सरकारी विश्लेषण",
    healthScore: "आरोग्य गुण",
    upcomingAppts: "अपॉइंटमेंट्स",
    healthRecords: "हेल्थ लॉकर",
    vaccinations: "लसीकरण",
    insurance: "विमा स्थिती",
    timeline: "आरोग्य टाइमलाइन",
    locker: "डिजिटल लॉकर",
    summary: "एआय आरोग्य विश्लेषण",
    booking: "अपॉइंटमेंट बुक करा",
    finder: "जवळचे रुग्णालय",
    rewards: "बक्षिसे आणि कल्याण",
    emergency: "आणीबाणी एसओएस",
    settings: "सेटिंग्ज",
    profile: "प्रोफाइल",
    abhaId: "आभा क्रमांक",
    abhaAddress: "आभा पत्ता",
    scanQr: "क्यूआर स्कॅन करा",
    shareQr: "आरोग्य क्यूआर शेअर करा",
    addReport: "लॅब रिपोर्ट जोडा",
    ocrSummary: "एआय रिपोर्ट स्पष्टीकरण",
    preventiveTips: "प्रतिबंधात्मक टिप्स",
    missingScreenings: "अपूर्ण चाचण्या",
    riskAlerts: "धोकादायक निर्देशक",
    healthTrends: "आरोग्य ट्रेंड्स",
    language: "भाषा निवड",
    darkMode: "स्वरूप",
    security: "सुरक्षा आणि संमती",
    challenges: "दैनिक आव्हाने",
    points: "उपलब्ध गुण",
    badges: "तुमचे बॅजेस",
    habits: "सवय ट्रॅकर",
    emergencyCard: "आणीबाणी आरोग्य क्यूआर",
    doctorDashboard: "डॉक्टर डॅशबोर्ड",
    hospitalDashboard: "रुग्णालय डॅशबोर्ड",
    govAnalytics: "सरकारी डॅशबोर्ड",
    patientQueue: "रुग्ण रांग",
    digitalPrescription: "डिजिटल प्रिस्क्रिप्शन",
    instantUpdate: "आभा सह सिंक करा",
    bedAvailability: "बेडची उपलब्धता",
    opdManagement: "ओपीडी ट्रॅकर",
    diseaseHeatmap: "साथीचे आजार हीटमॅप",
    adoptionRate: "राज्यनिहाय दत्तक दर",
    familyHealth: "कौटुंबिक खाती",
    recentActivity: "अलीकडील आरोग्य क्रियाकलाप",
    healthContent: "आरोग्य सामग्री आणि व्हिडिओ",
    shareRecords: "आरोग्य नोंदी सामायिक करा",
    consentManager: "डेटा संमती व्यवस्थापक",
    uploadSuccess: "एआय ओसीआर द्वारे रिपोर्टचे यशस्वी विश्लेषण!",
    pointsEarned: "वेलनेस गुण अपडेट केले!",
  },
  or: {
    title: "ସ୍ୱାସ୍ଥ୍ୟଶିଲ୍ଡ ଭାରତ",
    subtitle: "ଆୟୁଷ୍ମାନ ଭାରତ ଡିଜିଟାଲ ମିଶନ (ABDM)",
    welcome: "ସ୍ଵାଗତମ୍",
    login: "ସୁରକ୍ଷିତ ଲଗ୍ଇନ୍",
    enterAbha: "ଆଭା (ABHA) ନମ୍ବର କିମ୍ବା ମୋବାଇଲ ପ୍ରବେଶ କରନ୍ତୁ",
    otpSent: "ଆପଣଙ୍କ ପଞ୍ଜୀକୃତ ଆଧାର ମୋବାଇଲ ନମ୍ବରକୁ OTP ପଠାଗଲା",
    verifyOtp: "OTP ଯାଞ୍ଚ କରନ୍ତୁ",
    otpPlaceholder: "୬-ଅଙ୍କ ବିଶିଷ୍ଟ OTP ଲେଖନ୍ତୁ",
    citizenRole: "ନାଗରିକ ଡ୍ୟାସବୋର୍ଡ",
    doctorRole: "ଡାକ୍ତର ଡେସ୍କ",
    hospitalRole: "ଡାକ୍ତରଖାନା ନିୟନ୍ତ୍ରଣ",
    govRole: "ସରକାରୀ ବିଶ୍ଳେଷଣ",
    healthScore: "ସ୍ୱାସ୍ଥ୍ୟ ସ୍କୋର",
    upcomingAppts: "ଡାକ୍ତର ପରାମର୍ଶ",
    healthRecords: "ସ୍ୱାସ୍ଥ୍ୟ ଲକର୍",
    vaccinations: "ଟିକାକରଣ",
    insurance: "ବୀମା ସ୍ଥିତି (PM-JAY)",
    timeline: "ସ୍ୱାସ୍ଥ୍ୟ ଟାଇମଲାଇନ୍",
    locker: "ଡିଜିଟାଲ୍ ଲକର୍",
    summary: "AI ସ୍ୱାସ୍ଥ୍ୟ ସୂଚନା",
    booking: "ଆପଏଣ୍ଟମେଣ୍ଟ ବୁକ୍ କରନ୍ତୁ",
    finder: "ନିକଟସ୍ଥ ଡାକ୍ତରଖାନା",
    rewards: "ପୁରସ୍କାର ଏବଂ ସୁସ୍ଥତା",
    emergency: "ଜରୁରୀକାଳୀନ SOS",
    settings: "ସେଟିଂସ୍",
    profile: "ପ୍ରୋଫାଇଲ୍",
    abhaId: "ଆଭା (ABHA) ନମ୍ବର",
    abhaAddress: "ଆଭା ଠିକଣା",
    scanQr: "QR କୋଡ୍ ସ୍କାନ କରନ୍ତୁ",
    shareQr: "ସ୍ୱାସ୍ଥ୍ୟ QR ସେୟାର୍ କରନ୍ତୁ",
    addReport: "ଲାବୋରେଟୋରୀ ରିପୋର୍ଟ ଯୋଡନ୍ତୁ",
    ocrSummary: "AI ରିପୋର୍ଟ ବିଶ୍ଳେଷଣ",
    preventiveTips: "ସ୍ୱାସ୍ଥ୍ୟ ସୁରକ୍ଷା ଟିପ୍ସ",
    missingScreenings: "ଅସମ୍ପୂର୍ଣ୍ଣ ସ୍ୱାସ୍ଥ୍ୟ ପରୀକ୍ଷା",
    riskAlerts: "ସତର୍କତା ସଙ୍କେତ",
    healthTrends: "ସ୍ୱାସ୍ଥ୍ୟ ଧାରା",
    language: "ଭାଷା ଚୟନ",
    darkMode: "ରୂପରେଖ",
    security: "ସୁରକ୍ଷା ଓ ଅନୁମତି",
    challenges: "ଦୈନନ୍ଦିନ ଲକ୍ଷ୍ୟ",
    points: "ଉପଲବ୍ଧ ପଏଣ୍ଟ",
    badges: "ଆପଣଙ୍କ ବ୍ୟାଜ୍",
    habits: "ଅଭ୍ୟାସ ଟ୍ରାକର୍",
    emergencyCard: "ଜରୁରୀକାଳୀନ ସ୍ୱାସ୍ଥ୍ୟ QR",
    doctorDashboard: "ଡାକ୍ତର ଡ୍ୟାସବୋର୍ଡ",
    hospitalDashboard: "ଡାକ୍ତରଖାନା ଡ୍ୟାସବୋର୍ଡ",
    govAnalytics: "ସରକାରୀ ଡ୍ୟାସବୋର୍ଡ",
    patientQueue: "ରୋଗୀ ଧାଡ଼ି",
    digitalPrescription: "ଡିଜିଟାଲ୍ ପ୍ରେସକ୍ରିପସନ୍",
    instantUpdate: "ABHA ସହିତ ସିଙ୍କ୍ କରନ୍ତୁ",
    bedAvailability: "ଶଯ୍ୟା ଉପଲବ୍ଧତା",
    opdManagement: "OPD ଟ୍ରାକର୍",
    diseaseHeatmap: "ମହାମାରୀ ହିଟମ୍ୟାପ୍",
    adoptionRate: "ରାଜ୍ୟୱାରୀ ଗ୍ରହଣହାର",
    familyHealth: "ପରିବାର ସ୍ୱାସ୍ଥ୍ୟ ଖାତା",
    recentActivity: "ସମ୍ପ୍ରତି ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଯ୍ୟକଳାପ",
    healthContent: "ସ୍ୱାସ୍ଥ୍ୟ ଭିଡିଓ ଏବଂ ବିଷୟବସ୍ତୁ",
    shareRecords: "ନିର୍ଦ୍ଦିଷ୍ଟ ସ୍ୱାସ୍ଥ୍ୟ ରେକର୍ଡ ସେୟାର୍",
    consentManager: "ତଥ୍ୟ ସେୟାରିଂ ସହମତି",
    uploadSuccess: "AI ଦ୍ୱାରା ରିପୋର୍ଟ ସଫଳତାର ସହ ବିଶ୍ଳେଷଣ ହେଲା!",
    pointsEarned: "ୱେଲନେସ୍ ପଏଣ୍ଟ ଅଦ୍ୟତନ ହୋଇଛି!",
  }
};

// Initial Metadata
export const initialABHAMetadata: ABHAMetadata = {
  abhaId: "91-2045-8123-5678",
  name: "Tamanna Kalia",
  gender: "Female",
  dob: "1997-08-14",
  mobile: "+91 98765 43210",
  healthScore: 78,
  rewardPoints: 450
};

// Sample Medical Records (Health Locker & Timeline)
export const initialMedicalRecords: MedicalRecord[] = [
  {
    id: "rec-1",
    date: "2026-06-12",
    title: "Complete Blood Count (CBC)",
    institution: "Apollo Diagnostics, New Delhi",
    doctorName: "Dr. Alok Sharma",
    type: "Diagnostic Report",
    category: "Diagnostic",
    summary: "Mild anemia detected with low hemoglobin level (11.2 g/dL, normal is 12-15). Red Blood Cell count and other indices are within standard reference ranges.",
    findings: [
      { finding: "Hemoglobin", value: "11.2 g/dL", status: "warning", explanation: "Slightly low, indicating mild iron deficiency." },
      { finding: "White Blood Cells", value: "6,500 /cu.mm", status: "normal", explanation: "Healthy immune count, no signs of active infection." },
      { finding: "Platelets", value: "250,000 /cu.mm", status: "normal", explanation: "Normal blood clotting count." }
    ],
    estimatedHealthScore: 75,
    healthTips: [
      "Include iron-rich foods like spinach, beetroots, and pomegranates in your daily diet.",
      "Pair iron intake with Vitamin C (lemon water, oranges) to double iron absorption rate."
    ],
    riskAlerts: ["Mild Anaemia Risk - Monitoring blood levels in 3 months is advised."],
    missingScreenings: ["Serum Ferritin (Iron stores) Test", "Vitamin B12 level screen"],
    status: "Linked",
    isDemo: true
  },
  {
    id: "rec-2",
    date: "2026-06-30",
    title: "HbA1c Glycated Hemoglobin Test",
    institution: "Dr. Lal PathLabs, Sector 21",
    doctorName: "Dr. Meera Sen",
    type: "Diagnostic Report",
    category: "Diabetes",
    summary: "HbA1c level measured at 5.9% indicating early pre-diabetic state. Average blood glucose estimated at 123 mg/dL.",
    findings: [
      { finding: "HbA1c", value: "5.9 %", status: "warning", explanation: "Prediabetes range (5.7% - 6.4%). Requires dietary intervention." },
      { finding: "Fasting Glucose", value: "104 mg/dL", status: "warning", explanation: "Borderline impaired fasting glycemia." }
    ],
    estimatedHealthScore: 78,
    healthTips: [
      "Switch from polished white rice to whole millets (Ragi, Jowar, Bajra) to lower glycemic index.",
      "Engage in 30 minutes of brisk post-meal walks."
    ],
    riskAlerts: ["Early Insulin Resistance - Lifestyle reversal recommended."],
    status: "Linked",
    isDemo: true
  },
  {
    id: "rec-3",
    date: "2026-05-18",
    title: "Lipid Profile & Cardiovascular Panel",
    institution: "Max Lab, Gurugram",
    doctorName: "Dr. Sanjay Dutt",
    type: "Diagnostic Report",
    category: "Cardiovascular",
    summary: "Total cholesterol mildly elevated at 224 mg/dL. LDL at 146 mg/dL. Blood pressure recorded at 122/80 mmHg.",
    findings: [
      { finding: "Total Cholesterol", value: "224 mg/dL", status: "warning", explanation: "Above desirable limit (< 200 mg/dL)." },
      { finding: "LDL Cholesterol", value: "146 mg/dL", status: "warning", explanation: "Borderline high bad cholesterol." },
      { finding: "HDL (Good)", value: "48 mg/dL", status: "normal", explanation: "Adequate protective cardiac cholesterol." }
    ],
    estimatedHealthScore: 76,
    healthTips: ["Reduce intake of deep-fried food and trans fats.", "Include flaxseeds and walnuts in morning meals."],
    status: "Linked",
    isDemo: true
  },
  {
    id: "rec-4",
    date: "2026-04-10",
    title: "Allergy IgE & Respiratory Screening",
    institution: "Fortis Hospital, Noida",
    doctorName: "Dr. Rajesh Gupta",
    type: "Diagnostic Report",
    category: "Allergies",
    summary: "Elevated Total Serum IgE (280 IU/mL). Positive reactivity to house dust mites and seasonal brassica pollen.",
    findings: [
      { finding: "Total IgE", value: "280 IU/mL", status: "warning", explanation: "Heightened allergic predisposition." },
      { finding: "Eosinophil Count", value: "6.2%", status: "warning", explanation: "Mild allergic eosinophilia." }
    ],
    status: "Linked",
    isDemo: true
  },
  {
    id: "rec-5",
    date: "2026-07-02",
    title: "Digital Prescription - Metformin 500mg",
    institution: "Max Super Speciality Hospital",
    doctorName: "Dr. Priya Iyer",
    type: "Prescription",
    category: "Prescription",
    summary: "Rx: Tab Metformin 500mg OD post breakfast for 90 days. Cap Becosules OD for 30 days. Repeat HbA1c after 3 months.",
    status: "Linked",
    isDemo: true
  },
  {
    id: "rec-6",
    date: "2026-07-05",
    title: "Clinical Consultation Summary - Endocrinology",
    institution: "Apollo Clinics, Saket",
    doctorName: "Dr. Alok Sharma",
    type: "Consultation",
    category: "Consultation",
    summary: "Detailed metabolic consultation regarding prediabetes and mild fatigue. Recommended low glycemic index diet, hydration, and adherence to ABDM health records tracking.",
    status: "Linked",
    isDemo: true
  }
];

// Sample Appointments
export const initialAppointments: Appointment[] = [
  {
    id: "appt-1",
    doctorName: "Dr. Priya Iyer",
    specialty: "General Physician",
    hospitalName: "Max Healthcare, Sector 45",
    date: "2026-07-10",
    time: "10:30 AM",
    status: "Upcoming"
  },
  {
    id: "appt-2",
    doctorName: "Dr. Rajesh Gupta",
    specialty: "Pulmonologist",
    hospitalName: "Fortis Hospital, Noida",
    date: "2026-01-20",
    time: "03:45 PM",
    status: "Completed"
  }
];

// Nearby Hospitals & Booking Data
export const nearbyHospitals = [
  {
    name: "Max Super Speciality Hospital",
    distance: "1.2 km",
    address: "Saket, New Delhi",
    specialties: ["Cardiology", "General Medicine", "Paediatrics", "Orthopaedics"],
    rating: 4.8,
    bedsAvailable: 42,
    doctors: ["Dr. Priya Iyer (GP)", "Dr. Sanjay Dutt (Cardio)", "Dr. Meera Sen (Paed)"]
  },
  {
    name: "Fortis Memorial Research Institute",
    distance: "2.5 km",
    address: "Sector 44, Gurugram",
    specialties: ["Neurology", "Pulmonology", "Oncology", "Internal Medicine"],
    rating: 4.6,
    bedsAvailable: 28,
    doctors: ["Dr. Rajesh Gupta (Pulmo)", "Dr. Vikranth Patil (Neuro)"]
  },
  {
    name: "Apollo Hospitals",
    distance: "4.1 km",
    address: "Sarita Vihar, New Delhi",
    specialties: ["Emergency Care", "Gastroenterology", "Nephrology", "Dermatology"],
    rating: 4.7,
    bedsAvailable: 65,
    doctors: ["Dr. Alok Sharma (Diag)", "Dr. Kiran Rao (Gastro)"]
  },
  {
    name: "PRM Medical College and Hospital",
    distance: "0.5 km",
    address: "Baripada, Odisha",
    specialties: ["General Medicine", "Emergency Care", "Paediatrics", "Cardiology"],
    rating: 4.9,
    bedsAvailable: 120,
    doctors: ["Dr. S. K. Mahapatra (GP)", "Dr. B. K. Jena (Paed)"]
  }
];

// Daily Challenges / Rewards
export const initialChallenges: Challenge[] = [
  { id: "ch-1", title: "Active Steps Indian Standard", description: "Walk 8,000 steps to support cardiac agility.", points: 50, completed: false, category: "steps" },
  { id: "ch-2", title: "Ayush Hydration Mission", description: "Drink 3 liters of water and log your hydration.", points: 30, completed: true, category: "hydration" },
  { id: "ch-3", title: "Early Rest Loop", description: "Log 7.5 hours of uninterrupted sleep.", points: 40, completed: false, category: "sleep" },
  { id: "ch-4", title: "Fruit & Grain Balance", description: "Consume 3 servings of native whole fruits or millet meals.", points: 30, completed: false, category: "diet" }
];

// OPD Patient Queue (Doctor Dashboard)
export const initialOPDQueue: OPDPatient[] = [
  { id: "pat-1", name: "Tamanna Kalia", age: 28, gender: "Female", abhaId: "91-2045-8123-5678", status: "Waiting", time: "09:30 AM", symptoms: "Persistent dry cough, mild fatigue for 3 days" },
  { id: "pat-2", name: "Ramesh Chandra", age: 54, gender: "Male", abhaId: "91-4501-9238-1122", status: "Waiting", time: "10:15 AM", symptoms: "Fasting glucose elevated, burning sensation in feet" },
  { id: "pat-3", name: "Sunita Deshmukh", age: 41, gender: "Female", abhaId: "91-3209-4455-8899", status: "Completed", time: "08:45 AM", symptoms: "Migraine reviews, requested Vitamin D prescription" }
];

// Hospital Bed Distribution
export const initialBeds: HospitalBed[] = [
  { category: "General Ward", total: 150, available: 32 },
  { category: "Oxygen Supported", total: 80, available: 15 },
  { category: "ICU (Non-Ventilator)", total: 30, available: 8 },
  { category: "ICU Ventilator", total: 20, available: 4 },
  { category: "Emergency / Triage", total: 15, available: 6 }
];

// Sample Medical Reports to instantly paste (OCR simulator templates)
export const sampleReports = [
  {
    title: "Complete Blood Count (Anemia check)",
    text: `PATIENT: Tamanna Kalia  GENDER: Female  DATE: 2026-06-12
LAB: Apollo Diagnostics New Delhi

TEST RESULTS:
Hemoglobin: 11.2 g/dL (Reference: 12.0 - 15.5 g/dL) [LOW]
White Blood Cell (WBC): 6.5 x10^3/uL (Reference: 4.5 - 11.0 x10^3/uL) [NORMAL]
Platelet Count: 250 x10^3/uL (Reference: 150 - 450 x10^3/uL) [NORMAL]
RBC Count: 4.1 million/uL (Reference: 4.0 - 5.2 million/uL) [NORMAL]

COMMENTS: Mild anemia indicated due to borderline low hemoglobin levels. Serum ferritin requested for diagnostic certainty.`
  },
  {
    title: "Diabetes HbA1c Report",
    text: `PATIENT: Tamanna Kalia  AGE: 28  DATE: 2026-06-30
LAB: Lal PathLabs Sector 21

TEST: Glycosylated Hemoglobin (HbA1c)
RESULT: 5.9 % (Reference Range: < 5.7% Normal, 5.7% - 6.4% Prediabetes, >= 6.5% Diabetes) [PREDIABETIC]
Average Blood Glucose: 123 mg/dL

NOTES: Findings are indicative of Pre-diabetes. Lifestyle and dietary modification recommended with reduction in refined sugars and regular physical activity.`
  },
  {
    title: "Lipid Profile (Cholesterol)",
    text: `PATIENT: Tamanna Kalia  DATE: 2026-05-18
LAB: Max Lab Gurugram

TEST RESULTS:
Total Cholesterol: 224 mg/dL (Desirable: < 200 mg/dL) [HIGH]
HDL (Good) Cholesterol: 48 mg/dL (Desirable: > 50 mg/dL) [LOW]
LDL (Bad) Cholesterol: 146 mg/dL (Optimal: < 100 mg/dL) [HIGH]
Triglycerides: 160 mg/dL (Normal: < 150 mg/dL) [BORDERLINE]

IMPRESSION: Borderline High blood cholesterol level. Advised saturated fat reduction and standard cardiovascular exercises.`
  }
];

// Initial Health Content, Educational Videos, Clips & Articles
export const initialHealthContent: HealthContentItem[] = [
  {
    id: "cnt-1",
    title: "Understanding ABHA: Your Digital Health Passport Explained",
    titleHi: "आभा (ABHA) को समझें: आपका डिजिटल स्वास्थ्य पासपोर्ट",
    titleOr: "ABHA କୁ ବୁଝନ୍ତୁ: ଆପଣଙ୍କ ଡିଜିଟାଲ୍ ସ୍ୱାସ୍ଥ୍ୟ ପାସପୋର୍ଟ",
    description: "Learn how the 14-digit ABHA card secures your medical history across all hospitals in India with complete citizen consent.",
    descriptionHi: "जानिए कैसे 14-अंकीय आभा कार्ड आपकी संपूर्ण सहमति से भारत के सभी अस्पतालों में आपके स्वास्थ्य रिकॉर्ड को सुरक्षित रखता है।",
    descriptionOr: "ଜାଣନ୍ତୁ କିପରି ୧୪-ଅଙ୍କ ବିଶିଷ୍ଟ ABHA କାର୍ଡ ଆପଣଙ୍କ ସମ୍ମତିରେ ଭାରତର ସମସ୍ତ ଡାକ୍ତରଖାନାରେ ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ଇତିହାସ ସୁରକ୍ଷିତ ରଖେ।",
    contentType: "video",
    category: "Government health schemes and ABDM awareness",
    duration: "4:30 min",
    language: "all",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    likes: 1240,
    helpfulCount: 489,
    unhelpfulCount: 8,
    isSponsored: false,
    publishedDate: "2026-06-01",
    tags: ["ABDM", "ABHA ID", "Digital Health", "NHA Government"]
  },
  {
    id: "cnt-2",
    title: "Diabetes Management: Simple Native Diet Swaps for Lower HbA1c",
    titleHi: "मधुमेह नियंत्रण: कम HbA1c के लिए आसान भारतीय आहार बदलाव",
    titleOr: "ମଧୁମେହ ନିୟନ୍ତ୍ରଣ: କମ୍ HbA1c ପାଇଁ ସହଜ ଖାଦ୍ୟ ପରିବର୍ତ୍ତନ",
    description: "Crucial nutritional tips substituting refined rice with ragi, millets, and fiber-rich greens to naturally prevent blood sugar spikes.",
    descriptionHi: "सफेद चावल के स्थान पर रागी, ज्वार, बाजरा और फाइबर युक्त हरी सब्जियों से ब्लड शुगर नियंत्रित रखने के महत्वपूर्ण उपाय।",
    descriptionOr: "ଚାଉଳ ବଦଳରେ ମାଣ୍ଡିଆ, ଯଅ ଏବଂ ଶାଗ ବ୍ୟବହାର କରି ରକ୍ତ ଶର୍କରା ନିୟନ୍ତ୍ରଣ କରିବାର ସହଜ ଉପାୟ।",
    contentType: "video",
    category: "Diabetes and blood pressure",
    duration: "6:15 min",
    language: "hi",
    thumbnailUrl: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&auto=format&fit=crop&q=80",
    likes: 980,
    helpfulCount: 350,
    unhelpfulCount: 12,
    isSponsored: false,
    publishedDate: "2026-05-24",
    tags: ["Diabetes", "Diet", "Blood Sugar", "Millets"]
  },
  {
    id: "cnt-3",
    title: "Maternal Health & Nutrition during Pregnancy (Pradhan Mantri Matru Vandana)",
    titleHi: "गर्भावस्था में मातृ स्वास्थ्य और पोषण (प्रधानमंत्री मातृ वंदना)",
    titleOr: "ଗର୍ଭାବସ୍ଥାରେ ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ ଏବଂ ପୁଷ୍ଟିକର ଖାଦ୍ୟ (PMMVY)",
    description: "Guidance for expectant mothers on folic acid, iron supplements, prenatal checkups, and financial benefits under government maternal schemes.",
    descriptionHi: "गर्भवती माताओं के लिए आयरन, फॉलिक एसिड, नियमित जांच और सरकारी मातृत्व सहायता योजनाओं की सम्पूर्ण जानकारी।",
    descriptionOr: "ଗର୍ଭବତୀ ମହିଳାଙ୍କ ପାଇଁ ଆଇରନ, ଫୋଲିକ୍ ଏସିଡ୍, ନିୟମିତ ପରୀକ୍ଷା ଏବଂ ସରକାରୀ ଯୋଜନା ବିଷୟରେ ଜାଣନ୍ତୁ।",
    contentType: "video",
    category: "Women's health",
    duration: "5:45 min",
    language: "or",
    thumbnailUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80",
    likes: 742,
    helpfulCount: 290,
    unhelpfulCount: 3,
    isSponsored: false,
    publishedDate: "2026-04-18",
    tags: ["Women Health", "Maternal", "PMMVY", "Nutrition"]
  },
  {
    id: "cnt-4",
    title: "Infant Immunization Chart & Universal Vaccination Mission (Mission Indradhanush)",
    titleHi: "शिशु टीकाकरण चार्ट एवं सार्वभौमिक टीकाकरण (मिशन इंद्रधनुष)",
    titleOr: "ଶିଶୁ ଟୀକାକରଣ ଚାର୍ଟ ଏବଂ ସାର୍ବଜନୀନ ଟିକା (ମିଶନ ଇନ୍ଦ୍ରଧନୁଷ)",
    description: "Complete timetable for newborn vaccinations from BCG to MMR. Keep your child protected against preventable communicable diseases.",
    descriptionHi: "नवजात से लेकर 5 वर्ष तक के बच्चों के लिए अनिवार्य टीकों का सम्पूर्ण कार्यक्रम।",
    descriptionOr: "ନବଜାତ ଶିଶୁଙ୍କ ପାଇଁ ସମସ୍ତ ଜରୁରୀ ଟିକା ଚାର୍ଟ ଏବଂ ସରକାରୀ ସୁବିଧା।",
    contentType: "infographic",
    category: "Child health and nutrition",
    duration: "4 min read",
    language: "all",
    thumbnailUrl: "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=600&auto=format&fit=crop&q=80",
    articleBody: "Universal immunization saves millions of children. The national schedule provides BCG, OPV, Hepatitis B, Rotavirus, Pentavalent, PCV, and MMR vaccines free of cost across all primary health centers.",
    likes: 1104,
    helpfulCount: 521,
    unhelpfulCount: 4,
    isSponsored: false,
    publishedDate: "2026-05-10",
    tags: ["Child Health", "Vaccines", "Mission Indradhanush", "Infants"]
  },
  {
    id: "cnt-5",
    title: "Tele-MANAS: Free 24/7 Mental Health Support Helpline in India",
    titleHi: "टेली-मानस: भारत में 24/7 निःशुल्क मानसिक स्वास्थ्य सहायता हेल्पलाइन",
    titleOr: "ଟେଲି-ମାନସ: ଭାରତରେ ମାଗଣା ୨୪/୭ ମାନସିକ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟତା ହେଲ୍ପଲାଇନ",
    description: "Toll-free national mental health support network (14416). Learn how to recognize stress, anxiety, and seek compassionate counseling without stigma.",
    descriptionHi: "राष्ट्रीय मानसिक स्वास्थ्य हेल्पलाइन 14416 पर बिना किसी झिझक के गोपनीय परामर्श प्राप्त करें।",
    descriptionOr: "ନିଃଶୁଳ୍କ ଟେଲିଫୋନ ନମ୍ବର ୧୪୪୧୬ ମାଧ୍ୟମରେ ମାନସିକ ଚାପ ଓ ଚିନ୍ତାରୁ ମୁକ୍ତି ପାଇଁ ବିଶେଷଜ୍ଞଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ।",
    contentType: "clip",
    category: "Mental health and well-being",
    duration: "2:50 min",
    language: "en",
    thumbnailUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80",
    likes: 850,
    helpfulCount: 310,
    unhelpfulCount: 7,
    isSponsored: false,
    publishedDate: "2026-06-15",
    tags: ["Mental Health", "Tele-MANAS", "Stress Relief", "Helpline"]
  },
  {
    id: "cnt-6",
    title: "Monsoon Dengue, Malaria & Waterborne Illness Prevention Guide",
    titleHi: "मानसून में डेंगू, मलेरिया और जलजनित बीमारियों से बचाव गाइड",
    titleOr: "ବର୍ଷା ଦିନେ ଡେଙ୍ଗୁ, ମ୍ୟାଲେରିଆ ଏବଂ ଜଳବାହିତ ରୋଗରୁ ରକ୍ଷା ପାଇବା ଉପାୟ",
    description: "Essential home hygiene steps to eliminate stagnant water, prevent mosquito breeding, and purify drinking water in rural and urban households.",
    descriptionHi: "मच्छर जनित बीमारियों से बचाव के आसान उपाय और सुरक्षित पेयजल सुनिश्चित करने के नियम।",
    descriptionOr: "ପାଣି ଜମିବାକୁ ନଦେବା, ମଶା ନିବାରଣ ଏବଂ ପିଇବା ପାଣି ବିଶୋଧନ କରିବାର ସରଳ ନିୟମ।",
    contentType: "article",
    category: "Communicable diseases",
    duration: "5 min read",
    language: "all",
    thumbnailUrl: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=600&auto=format&fit=crop&q=80",
    articleBody: "During monsoons, stagnant water creates breeding sites for Aedes mosquitoes causing Dengue and Chikungunya. Ensure all water storage drums are covered, use mosquito nets, drink boiled water, and seek immediate CBC test if fever exceeds 101°F.",
    likes: 670,
    helpfulCount: 280,
    unhelpfulCount: 5,
    isSponsored: false,
    publishedDate: "2026-06-25",
    tags: ["Dengue", "Malaria", "Monsoon Health", "Hygiene"]
  },
  {
    id: "cnt-7",
    title: "How to Measure Blood Pressure Accurately at Home",
    titleHi: "घर पर ब्लड प्रेशर (रक्तचाप) सही तरीके से कैसे मापें",
    titleOr: "ଘରେ ରକ୍ତଚାପ (BP) ସଠିକ୍ ଭାବରେ କିପରି ମାପିବେ",
    description: "Step-by-step clinical instructions for arm cuff placement, resting position, and logging readings directly into your ABDM Health Locker.",
    descriptionHi: "सटीक बीपी रीडिंग के लिए सही बैठने की मुद्रा और कफ लगाने की सही विधि।",
    descriptionOr: "ସଠିକ୍ BP ମାପିବା ପାଇଁ ହାତର ସ୍ଥିତି ଏବଂ ମେସିନ୍ ବ୍ୟବହାର କରିବାର ସରଳ ନିୟମ।",
    contentType: "video",
    category: "Diabetes and blood pressure",
    duration: "3:40 min",
    language: "hi",
    thumbnailUrl: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=600&auto=format&fit=crop&q=80",
    likes: 820,
    helpfulCount: 395,
    unhelpfulCount: 6,
    isSponsored: false,
    publishedDate: "2026-05-18",
    tags: ["Blood Pressure", "Hypertension", "Home Care", "Cardiovascular"]
  },
  {
    id: "cnt-8",
    title: "Hand Hygiene & Safe Drinking Water Standards (Swachh Bharat Swasthya)",
    titleHi: "हाथ धोने के 6 चरण और सुरक्षित पेयजल मानक",
    titleOr: "ହାତ ଧୋଇବାର ୬ଟି ପଦ୍ଧତି ଏବଂ ବିଶୁଦ୍ଧ ପିଇବା ପାଣି",
    description: "The WHO 6-step hand washing technique to prevent hospital and community infections, and chlorine tablet water disinfection.",
    descriptionHi: "संक्रमण से बचाव के लिए हाथ धोने की सही तकनीक और पेयजल को कीटाणुमुक्त करने के उपाय।",
    descriptionOr: "ରୋଗ ଜୀବାଣୁ ଦୂର କରିବା ପାଇଁ ହାତ ଧୋଇବାର ସଠିକ୍ ଉପାୟ।",
    contentType: "infographic",
    category: "General health and hygiene",
    duration: "2 min read",
    language: "or",
    thumbnailUrl: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=600&auto=format&fit=crop&q=80",
    likes: 540,
    helpfulCount: 215,
    unhelpfulCount: 2,
    isSponsored: false,
    publishedDate: "2026-04-05",
    tags: ["Hygiene", "Hand Washing", "Clean Water", "Swachh Bharat"]
  }
];

// Health Awareness Campaigns and Sponsored Educational Banners (Visually separated from medical advice)
export const initialCampaignBanners: HealthCampaignBanner[] = [
  {
    id: "cmp-1",
    title: "Anemia Mukt Bharat – Free Iron & Folic Acid Testing",
    subtitle: "Visit your nearest Ayushman Arogya Mandir or Sub-Center for complimentary hemoglobin screening.",
    category: "Government Health Initiative",
    targetUrl: "https://anemiamuktbharat.info",
    sponsor: "Ministry of Health & Family Welfare, Govt. of India",
    badgeText: "Official Public Health Campaign",
    active: true,
    isOfficialGovScheme: true
  },
  {
    id: "cmp-2",
    title: "Poshan 2.0: Traditional Millet Recipes for Childhood Nutrition",
    subtitle: "Sponsored educational awareness module by National Institute of Nutrition on bio-available proteins.",
    category: "Sponsored Nutrition Awareness",
    targetUrl: "#",
    sponsor: "National Nutrition Foundation (Educational Grant)",
    badgeText: "Sponsored Educational Partner",
    active: true,
    isOfficialGovScheme: false
  },
  {
    id: "cmp-3",
    title: "Free Hypertension & Diabetes Screening Camp this Saturday",
    subtitle: "NABH-accredited community hospital health drive. Pre-register with your ABHA ID for zero waiting time.",
    category: "Community Health Drive",
    targetUrl: "#",
    sponsor: "Apollo Community Health Trust",
    badgeText: "Empaneled Hospital Outreach",
    active: true,
    isOfficialGovScheme: false
  }
];

// Initial Selective Sharing QR Tokens
export const initialSharedTokens: SharedRecordToken[] = [
  {
    id: "sh-1",
    token: "tok_sec_abdm_8841a9bc2",
    createdDate: "2026-07-06",
    expiryTime: new Date(Date.now() + 86400000 * 2).toISOString(),
    expiryDurationLabel: "48 Hours",
    purpose: "Specialist Second Opinion - Diabetes Follow-up",
    recipientName: "Dr. Alok Sharma (Endocrinologist)",
    diseaseCategory: "Diabetes",
    recordIds: ["rec-2", "rec-5"],
    revoked: false,
    accessCount: 2,
    lastAccessed: "2026-07-07 10:15 AM"
  },
  {
    id: "sh-2",
    token: "tok_sec_abdm_3109e4d1f",
    createdDate: "2026-07-04",
    expiryTime: new Date(Date.now() - 3600000).toISOString(),
    expiryDurationLabel: "Expired",
    purpose: "Pre-surgery Cardiac clearance check",
    recipientName: "Max Heart & Vascular Institute",
    diseaseCategory: "Cardiovascular",
    recordIds: ["rec-3"],
    revoked: true,
    accessCount: 1,
    lastAccessed: "2026-07-04 02:40 PM"
  }
];

// Initial Family Member Profiles with Isolated Records
export const initialFamilyProfiles: FamilyMemberProfile[] = [
  {
    id: "fam-self",
    name: "Tamanna Kalia",
    relationship: "Self" as any,
    age: 28,
    gender: "Female",
    abhaId: "91-2045-8123-5678",
    isDependent: false,
    consentStatus: "Authorized",
    avatarInitials: "TK",
    records: initialMedicalRecords,
    appointments: [
      {
        id: "appt-1",
        doctorName: "Dr. Priya Iyer",
        specialty: "General Physician",
        hospitalName: "Max Healthcare, Sector 45",
        date: "2026-07-10",
        time: "10:30 AM",
        status: "Upcoming",
        isDemo: true
      }
    ],
    medications: [
      { name: "Metformin 500mg", dosage: "1 Tab", frequency: "OD (Morning)", status: "Active" },
      { name: "Vitamin D3 60,000 IU", dosage: "1 Cap", frequency: "Once a week", status: "Active" }
    ]
  },
  {
    id: "fam-mother",
    name: "Suman Devi",
    relationship: "Mother",
    age: 56,
    gender: "Female",
    abhaId: "91-1192-4481-9022",
    isDependent: false,
    consentStatus: "Authorized",
    avatarInitials: "SD",
    records: [
      {
        id: "rec-m-1",
        date: "2026-06-20",
        title: "Knee Osteoarthritis X-Ray Report",
        institution: "Apollo Diagnostics, New Delhi",
        doctorName: "Dr. Vikram Seth",
        type: "Radiology Report",
        category: "General",
        summary: "Grade 2 bilateral knee joint space narrowing. Advised quadriceps strengthening exercises and low-impact physiotherapy.",
        findings: [
          { finding: "Medial Joint Space", value: "3.2 mm (Reduced)", status: "warning", explanation: "Early osteoarthritic wear." }
        ],
        estimatedHealthScore: 72,
        status: "Linked",
        isDemo: true
      },
      {
        id: "rec-m-2",
        date: "2026-06-25",
        title: "Hypertension Maintenance Prescription",
        institution: "Saket City Clinic",
        doctorName: "Dr. Alok Sharma",
        type: "Prescription",
        category: "Cardiovascular",
        summary: "Rx: Tab Telmisartan 40mg once daily after breakfast. Low sodium diet advised (less than 4g per day).",
        status: "Linked",
        isDemo: true
      }
    ],
    appointments: [
      {
        id: "appt-m-1",
        doctorName: "Dr. Vikram Seth",
        specialty: "Orthopaedics",
        hospitalName: "Saket City Clinic",
        date: "2026-07-18",
        time: "11:30 AM",
        status: "Upcoming",
        isDemo: true
      }
    ],
    medications: [
      { name: "Telmisartan 40mg", dosage: "1 Tab", frequency: "Morning (Post breakfast)", status: "Active" },
      { name: "Calcium + Vit D3", dosage: "1 Tab", frequency: "Night", status: "Active" }
    ]
  },
  {
    id: "fam-son",
    name: "Rohan Sharma",
    relationship: "Son",
    age: 6,
    gender: "Male",
    abhaId: "91-8842-1920-4511",
    isDependent: true,
    consentStatus: "GuardianConsent",
    avatarInitials: "RS",
    records: [
      {
        id: "rec-s-1",
        date: "2026-05-15",
        title: "Pediatric Wellness & Growth Milestone Check",
        institution: "Fortis Hospital, Noida",
        doctorName: "Dr. Meera Sen",
        type: "Pediatric Report",
        category: "General",
        summary: "Normal height and weight percentile (55th percentile). Vision screening 6/6 bilateral. Booster vaccination completed.",
        findings: [
          { finding: "Height", value: "116 cm", status: "normal", explanation: "Age-appropriate growth velocity." },
          { finding: "Weight", value: "21.4 kg", status: "normal", explanation: "Healthy BMI for pediatric age." }
        ],
        estimatedHealthScore: 92,
        status: "Linked",
        isDemo: true
      },
      {
        id: "rec-s-2",
        date: "2026-05-15",
        title: "MMR Booster Immunization Record",
        institution: "Fortis Hospital, Noida",
        doctorName: "Dr. Meera Sen",
        type: "Vaccination",
        category: "General",
        summary: "Administered Measles, Mumps, Rubella 2nd booster dose. No immediate adverse reaction noted.",
        status: "Linked",
        isDemo: true
      }
    ],
    appointments: [],
    medications: [
      { name: "Zincovit Pediatric Drops", dosage: "5 ml", frequency: "Once daily with breakfast", status: "Active" }
    ]
  }
];
