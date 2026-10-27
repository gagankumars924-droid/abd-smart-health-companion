export type Language = "en" | "hi" | "mr" | "or"; // English, Hindi, Marathi, Odia

export type UserType = "Citizen" | "Doctor" | "Hospital" | "Government";

export type Screen =
  | "Splash"
  | "Login"
  | "Home"
  | "RecentActivity"
  | "HealthContent"
  | "ShareRecords"
  | "FamilyHealth"
  | "Locker"
  | "Timeline"
  | "AISummary"
  | "Booking"
  | "Finder"
  | "DoctorDashboard"
  | "HospitalDashboard"
  | "GovAnalytics"
  | "Rewards"
  | "EmergencyCard"
  | "Settings"
  | "Profile"
  | "PMJAY";

export interface MedicalRecord {
  id: string;
  date: string;
  title: string;
  institution: string;
  doctorName: string;
  type: string;
  summary: string;
  category?: "Diabetes" | "Cardiovascular" | "Allergies" | "Prescription" | "Diagnostic" | "Consultation" | "General";
  findings?: { finding: string; value: string; status: "normal" | "warning" | "critical"; explanation: string }[];
  estimatedHealthScore?: number;
  healthTips?: string[];
  riskAlerts?: string[];
  missingScreenings?: string[];
  status: "Linked" | "Local";
  isDemo?: boolean;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  hospitalName: string;
  date: string;
  time: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  isDemo?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  category: "steps" | "diet" | "sleep" | "hydration";
}

export interface OPDPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  abhaId: string;
  status: "Waiting" | "In Consultation" | "Completed";
  time: string;
  symptoms?: string;
}

export interface HospitalBed {
  category: string;
  total: number;
  available: number;
}

export interface ABHAMetadata {
  abhaId: string;
  name: string;
  gender: string;
  dob: string;
  mobile: string;
  healthScore: number;
  rewardPoints: number;
}

// Health Content & Videos
export type HealthContentCategory =
  | "General health and hygiene"
  | "Women's health"
  | "Child health and nutrition"
  | "Mental health and well-being"
  | "Diabetes and blood pressure"
  | "Communicable diseases"
  | "Preventive healthcare and vaccination"
  | "Government health schemes and ABDM awareness";

export interface HealthContentItem {
  id: string;
  title: string;
  titleHi?: string;
  titleOr?: string;
  description: string;
  descriptionHi?: string;
  descriptionOr?: string;
  contentType: "video" | "clip" | "infographic" | "article";
  category: HealthContentCategory;
  duration?: string;
  language: "en" | "hi" | "or" | "all";
  thumbnailUrl?: string;
  videoUrl?: string;
  articleBody?: string;
  likes: number;
  helpfulCount: number;
  unhelpfulCount: number;
  isSponsored?: boolean;
  sponsorName?: string;
  campaignLink?: string;
  publishedDate: string;
  tags: string[];
}

export interface HealthCampaignBanner {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  targetUrl?: string;
  sponsor: string;
  badgeText: string;
  active: boolean;
  isOfficialGovScheme?: boolean;
}

// Selective Sharing & Tokenized QR
export interface SharedRecordToken {
  id: string;
  token: string;
  createdDate: string;
  expiryTime: string;
  expiryDurationLabel: string;
  purpose: string;
  recipientName: string;
  diseaseCategory: string;
  recordIds: string[];
  revoked: boolean;
  accessCount: number;
  lastAccessed?: string;
}

// Family Member Profile
export interface FamilyMemberProfile {
  id: string;
  name: string;
  relationship: "Mother" | "Father" | "Spouse" | "Son" | "Daughter" | "Grandparent" | "Dependent";
  age?: number;
  gender: "Male" | "Female" | "Other";
  abhaId?: string;
  isDependent: boolean;
  consentStatus: "Authorized" | "GuardianConsent" | "PendingConsent";
  avatarInitials: string;
  records: MedicalRecord[];
  appointments: Appointment[];
  medications?: { name: string; dosage: string; frequency: string; status: "Active" | "Completed" }[];
}
