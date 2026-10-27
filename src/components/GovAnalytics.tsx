import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp, AlertTriangle, Users, Building2, Stethoscope, Shield, Heart, Check } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const stateAdoptionData = [
  { name: "Maharashtra", citizens: 14.2, doctors: 8200, hospitals: 450 },
  { name: "Uttar Pradesh", citizens: 22.5, doctors: 9500, hospitals: 620 },
  { name: "Karnataka", citizens: 11.8, doctors: 7800, hospitals: 410 },
  { name: "Delhi NCR", citizens: 8.4, doctors: 11200, hospitals: 580 },
  { name: "Tamil Nadu", citizens: 13.1, doctors: 8900, hospitals: 480 },
  { name: "Rajasthan", citizens: 9.2, doctors: 5200, hospitals: 310 }
];

const healthTrendsData = [
  { month: "Jan", dengue: 120, flu: 450, typhoid: 80 },
  { month: "Feb", dengue: 90, flu: 520, typhoid: 65 },
  { month: "Mar", dengue: 150, flu: 610, typhoid: 110 },
  { month: "Apr", dengue: 220, flu: 430, typhoid: 140 },
  { month: "May", dengue: 310, flu: 310, typhoid: 195 },
  { month: "Jun", dengue: 480, flu: 250, typhoid: 240 }
];

const participationData = [
  { name: "Government Sector", value: 58 },
  { name: "Private Trust", value: 27 },
  { name: "Corporate Chains", value: 15 }
];

interface GovAnalyticsProps {
  lang: "en" | "hi" | "mr";
  t: any;
  doctorApplications?: any[];
  hospitalApplications?: any[];
  onApproveDoctor?: (id: string, username: string, tempPass: string) => void;
  onRejectDoctor?: (id: string) => void;
  onApproveHospital?: (id: string, username: string, tempPass: string) => void;
  onRejectHospital?: (id: string) => void;
  systemAuditLogs?: any[];
  onSuspendAccount?: (id: string, type: "doctor" | "hospital") => void;
  suspendedAccounts?: any[];
}

export default function GovAnalytics({
  lang,
  t,
  doctorApplications = [],
  hospitalApplications = [],
  onApproveDoctor = () => {},
  onRejectDoctor = () => {},
  onApproveHospital = () => {},
  onRejectHospital = () => {},
  systemAuditLogs = [],
  onSuspendAccount = () => {},
  suspendedAccounts = []
}: GovAnalyticsProps) {
  const [activeTab, setActiveTab] = React.useState<"analytics" | "doctors" | "hospitals" | "audit">("analytics");

  // Temporary local credentials generator
  const handleActionDoctor = (id: string, approve: boolean, name: string) => {
    if (approve) {
      const formattedName = name.toLowerCase().replace(/\s+/g, "_").replace(/dr\._?/g, "");
      const generatedUsername = `dr_${formattedName}`;
      const tempPass = `ABDM@Temp${Math.floor(1000 + Math.random() * 9000)}`;
      onApproveDoctor(id, generatedUsername, tempPass);
    } else {
      onRejectDoctor(id);
    }
  };

  const handleActionHospital = (id: string, approve: boolean, name: string) => {
    if (approve) {
      const formattedName = name.toLowerCase().replace(/\s+/g, "_").replace(/_hospital/g, "");
      const generatedUsername = `hosp_${formattedName.slice(0, 8)}`;
      const tempPass = `HOSP@Temp${Math.floor(1000 + Math.random() * 9000)}`;
      onApproveHospital(id, generatedUsername, tempPass);
    } else {
      onRejectHospital(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 text-xs font-bold font-sans transition border-b-2 cursor-pointer ${
            activeTab === "analytics"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          📊 Usage & Analytics
        </button>
        <button
          onClick={() => setActiveTab("doctors")}
          className={`px-4 py-2 text-xs font-bold font-sans transition border-b-2 cursor-pointer relative ${
            activeTab === "doctors"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          🩺 Doctor Applications
          {doctorApplications.filter(a => a.status === "Pending").length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] h-4 w-4 rounded-full flex items-center justify-center font-sans font-bold">
              {doctorApplications.filter(a => a.status === "Pending").length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("hospitals")}
          className={`px-4 py-2 text-xs font-bold font-sans transition border-b-2 cursor-pointer relative ${
            activeTab === "hospitals"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          🏥 Hospital Applications
          {hospitalApplications.filter(a => a.status === "Pending").length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] h-4 w-4 rounded-full flex items-center justify-center font-sans font-bold">
              {hospitalApplications.filter(a => a.status === "Pending").length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 text-xs font-bold font-sans transition border-b-2 cursor-pointer ${
            activeTab === "audit"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          🛡️ Secure Audit Logs
        </button>
      </div>

      {activeTab === "analytics" && (
        <>
          {/* Overview Metric Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-xl border border-blue-100 dark:border-blue-900 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-600 dark:text-blue-300 font-medium">ABHA Registrations</span>
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-2">79.2M</p>
              <span className="text-[10px] text-green-600 font-medium font-sans">↑ 14.2% this quarter</span>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs text-emerald-600 dark:text-emerald-300 font-medium">Verified Doctors</span>
                <Stethoscope className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mt-2">128,450</p>
              <span className="text-[10px] text-green-600 font-medium font-sans">↑ 8.5% this quarter</span>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-xl border border-amber-100 dark:border-amber-900 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs text-amber-600 dark:text-amber-300 font-medium">Active Hospitals</span>
                <Building2 className="h-4 w-4 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100 mt-2">14,820</p>
              <span className="text-[10px] text-green-600 font-medium font-sans">↑ 12.1% this quarter</span>
            </div>

            <div className="bg-rose-50 dark:bg-rose-950 p-4 rounded-xl border border-rose-100 dark:border-rose-900 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs text-rose-600 dark:text-rose-300 font-medium">Records Linked (ABDM)</span>
                <Shield className="h-4 w-4 text-rose-600" />
              </div>
              <p className="text-2xl font-bold text-rose-900 dark:text-rose-100 mt-2">184.5M</p>
              <span className="text-[10px] text-rose-600 font-medium font-sans">98.4% consent match</span>
            </div>
          </div>

          {/* Primary Graphs */}
          <div className="grid grid-cols-1 gap-6">
            {/* State-wise Adoption */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sans font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  {t.adoptionRate || "State-wise Adoption Rate (Millions)"}
                </h3>
                <span className="text-xs font-mono text-slate-500">Real-time ABDM sync</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stateAdoptionData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                    <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar name="Citizens Registered (M)" dataKey="citizens" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar name="Verified Doctors" dataKey="doctors" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Epidemic/Disease Heatmap and Participation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-sans font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-500" />
                    {t.diseaseHeatmap || "Monsoon Seasonal Disease Trends"}
                  </h3>
                  <span className="bg-rose-50 dark:bg-rose-950 text-rose-600 text-[10px] px-2 py-0.5 rounded-full font-medium">
                    Heat Alerts Active
                  </span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={healthTrendsData}>
                      <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} />
                      <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Area type="monotone" name="Flu/Infections" dataKey="flu" stroke="#f59e0b" fill="#fef3c7" />
                      <Area type="monotone" name="Dengue Cases" dataKey="dengue" stroke="#ef4444" fill="#fee2e2" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-sans font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-emerald-500" />
                    Hospital Distribution by Type
                  </h3>
                  <span className="text-xs text-emerald-600">Total: 14.8K Hospitals</span>
                </div>
                <div className="h-64 flex flex-col justify-between">
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={participationData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {participationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-around items-center text-xs pb-2 border-t border-slate-50 dark:border-slate-800 pt-3">
                    {participationData.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                        <span className="text-[10px] text-slate-600 dark:text-slate-300 font-sans">{item.name} ({item.value}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Government Initiatives */}
          <div className="bg-blue-900 text-white p-5 rounded-xl shadow-md border border-blue-800">
            <h4 className="font-sans font-semibold text-sm flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-emerald-400 animate-pulse" />
              Active Health Campaign Alert (National Level)
            </h4>
            <p className="text-xs text-blue-100 leading-relaxed mb-3">
              Pradhan Mantri Jan Arogya Yojana (PM-JAY) and Ayushman Bharat are driving targeted screenings for 
              diabetes and cervical cancer this month. Unified consent frameworks enable citizens to seamlessly download 
              e-vouchers and book pre-screenings with zero friction.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px]">
              <span className="bg-blue-800 px-3 py-1 rounded-full text-blue-200">Target: 250M screenings</span>
              <span className="bg-blue-800 px-3 py-1 rounded-full text-blue-200">State subsidy: 100% covered</span>
              <span className="bg-emerald-600 px-3 py-1 rounded-full text-white font-medium">92% adoption increase</span>
            </div>
          </div>
        </>
      )}

      {activeTab === "doctors" && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-sans font-bold text-slate-800 dark:text-slate-200 text-sm">
              🧑‍⚕️ Review ABDM Doctor Registry Applications
            </h3>
            <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono p-1 px-2 rounded">
              Total Pending: {doctorApplications.filter(d => d.status === "Pending").length}
            </span>
          </div>

          {doctorApplications.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8 font-sans">No doctor registration requests submitted.</p>
          ) : (
            <div className="space-y-4">
              {doctorApplications.map((doc) => (
                <div key={doc.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{doc.fullName}</span>
                        <span className="text-[9px] bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold px-1.5 py-0.5 rounded uppercase">
                          {doc.specialization}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                        Council Reg No: <strong className="font-mono text-slate-700 dark:text-slate-300">{doc.councilRegNo}</strong> • Experience: {doc.yearsOfExperience} Years
                      </p>
                    </div>
                    <span className={`text-[9px] font-bold p-1 px-2.5 rounded-full font-sans uppercase ${
                      doc.status === "Pending" ? "bg-amber-100 text-amber-700" : doc.status === "Approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {doc.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-800/60 pt-2.5 text-[11px] text-slate-600 dark:text-slate-400">
                    <div>
                      <p><strong>Hospital Facility:</strong> {doc.hospitalName}</p>
                      <p><strong>Clinic Address:</strong> {doc.clinicAddress || "N/A"}</p>
                    </div>
                    <div>
                      <p><strong>Official Email:</strong> {doc.email}</p>
                      <p><strong>Mobile:</strong> {doc.mobileNumber}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/60 text-[10px]">
                    <span className="flex items-center gap-1 text-slate-500 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded">
                      📄 SMC License: <span className="text-blue-600 dark:text-blue-400 underline font-mono cursor-pointer">{doc.licenseFile || "smc_license.pdf"}</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded">
                      🪪 Gov ID: <span className="text-blue-600 dark:text-blue-400 underline font-mono cursor-pointer">{doc.govtIdFile || "govt_id.pdf"}</span>
                    </span>
                    {doc.digitalSignature && (
                      <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                        🖋️ Signature Locked: <span className="font-mono italic font-bold">{doc.digitalSignature}</span>
                      </span>
                    )}
                  </div>

                  {doc.status === "Pending" && (
                    <div className="flex gap-2 pt-2 justify-end">
                      <button
                        onClick={() => handleActionDoctor(doc.id, false, doc.fullName)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-4 py-1.5 rounded-lg border border-rose-200 transition cursor-pointer"
                      >
                        Reject Application
                      </button>
                      <button
                        onClick={() => handleActionDoctor(doc.id, true, doc.fullName)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve & Issue Credentials
                      </button>
                    </div>
                  )}

                  {doc.status === "Approved" && (
                    <div className="bg-green-500/10 border border-green-500/20 p-2.5 rounded-lg text-[11px] font-sans text-green-700 dark:text-green-300 flex justify-between items-center">
                      <div>
                        <span>Credentials Generated:</span>
                        <p className="font-mono font-bold">Username: {doc.officialUsername} | Temp Password: {doc.temporaryPassword}</p>
                      </div>
                      <button
                        onClick={() => onSuspendAccount(doc.id, "doctor")}
                        className="bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-600 text-[10px] font-bold px-2 py-1 rounded"
                      >
                        Suspend Access
                      </button>
                    </div>
                  )}

                  {doc.status === "Suspended" && (
                    <div className="bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg text-[11px] font-sans text-red-700 dark:text-red-300 flex justify-between items-center">
                      <span>Account Suspended. ABDM health stacking integration disabled.</span>
                      <button
                        onClick={() => handleActionDoctor(doc.id, true, doc.fullName)}
                        className="bg-green-600 text-white text-[10px] font-bold px-2.5 py-1 rounded"
                      >
                        Re-Authorize Account
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "hospitals" && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-sans font-bold text-slate-800 dark:text-slate-200 text-sm">
              🏢 Review Hospital Registry Applications (HFID)
            </h3>
            <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono p-1 px-2 rounded">
              Total Pending: {hospitalApplications.filter(h => h.status === "Pending").length}
            </span>
          </div>

          {hospitalApplications.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8 font-sans">No hospital registration requests submitted.</p>
          ) : (
            <div className="space-y-4">
              {hospitalApplications.map((hosp) => (
                <div key={hosp.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{hosp.hospitalName}</span>
                        <span className="text-[9px] bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold px-1.5 py-0.5 rounded">
                          {hosp.hospitalType} Facility
                        </span>
                        {hosp.nabhStatus === "NABH Accredited" && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded">
                            NABH Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                        Reg Number: <strong className="font-mono text-slate-700 dark:text-slate-300">{hosp.registrationNumber}</strong> • ABDM Facility ID: <strong className="font-mono text-slate-700 dark:text-slate-300">{hosp.facilityId || "Pending Issuance"}</strong>
                      </p>
                    </div>
                    <span className={`text-[9px] font-bold p-1 px-2.5 rounded-full font-sans uppercase ${
                      hosp.status === "Pending" ? "bg-amber-100 text-amber-700" : hosp.status === "Approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {hosp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-800/60 pt-2.5 text-[11px] text-slate-600 dark:text-slate-400">
                    <div>
                      <p><strong>Admin In-Charge:</strong> {hosp.adminName}</p>
                      <p><strong>State / District:</strong> {hosp.state} / {hosp.district}</p>
                    </div>
                    <div>
                      <p><strong>Official Email:</strong> {hosp.email}</p>
                      <p><strong>Official Phone:</strong> {hosp.phone}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-2 border-t border-slate-200 dark:border-slate-800/60 text-[10px]">
                    <span className="flex items-center gap-1 text-slate-500 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded">
                      📄 Hospital License: <span className="text-blue-600 dark:text-blue-400 underline font-mono cursor-pointer">{hosp.licenseFile || "license.pdf"}</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded">
                      🪪 Reg Certificate: <span className="text-blue-600 dark:text-blue-400 underline font-mono cursor-pointer">{hosp.regCertificate || "reg_cert.pdf"}</span>
                    </span>
                    {hosp.nabhCertificate && (
                      <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                        🏆 NABH Cert: <span className="text-blue-600 dark:text-blue-400 underline font-mono cursor-pointer">{hosp.nabhCertificate}</span>
                      </span>
                    )}
                  </div>

                  {hosp.status === "Pending" && (
                    <div className="flex gap-2 pt-2 justify-end">
                      <button
                        onClick={() => handleActionHospital(hosp.id, false, hosp.hospitalName)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-4 py-1.5 rounded-lg border border-rose-200 transition cursor-pointer"
                      >
                        Reject Application
                      </button>
                      <button
                        onClick={() => handleActionHospital(hosp.id, true, hosp.hospitalName)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve & Issue Credentials
                      </button>
                    </div>
                  )}

                  {hosp.status === "Approved" && (
                    <div className="bg-green-500/10 border border-green-500/20 p-2.5 rounded-lg text-[11px] font-sans text-green-700 dark:text-green-300 flex justify-between items-center">
                      <div>
                        <span>Credentials Generated:</span>
                        <p className="font-mono font-bold">Username: {hosp.officialUsername} | Temp Password: {hosp.temporaryPassword}</p>
                      </div>
                      <button
                        onClick={() => onSuspendAccount(hosp.id, "hospital")}
                        className="bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-600 text-[10px] font-bold px-2 py-1 rounded"
                      >
                        Suspend Access
                      </button>
                    </div>
                  )}

                  {hosp.status === "Suspended" && (
                    <div className="bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg text-[11px] font-sans text-red-700 dark:text-red-300 flex justify-between items-center">
                      <span>Facility Suspended. Linked medical transfers frozen.</span>
                      <button
                        onClick={() => handleActionHospital(hosp.id, true, hosp.hospitalName)}
                        className="bg-green-600 text-white text-[10px] font-bold px-2.5 py-1 rounded"
                      >
                        Re-Authorize Account
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "audit" && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-sans font-bold text-slate-800 dark:text-slate-200 text-sm">
                🛡️ ABDM Real-Time Secure Audit Logs
              </h3>
              <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                Cryptographically hashed action tracking for security audit compliance.
              </p>
            </div>
            <span className="text-[9px] bg-red-500/10 text-red-600 border border-red-500/20 px-2 py-0.5 rounded font-mono font-bold">
              TLS 1.3 SECURE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-medium">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Event Action</th>
                  <th className="py-2.5 px-3">Cryptographic Trace / Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800/50">
                {systemAuditLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition">
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">{log.timestamp}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-sans ${
                        (log.role || log.actor) === "Citizen" ? "bg-blue-100 text-blue-700" : (log.role || log.actor) === "Doctor" ? "bg-emerald-100 text-emerald-700" : (log.role || log.actor) === "Hospital" ? "bg-indigo-100 text-indigo-700" : "bg-violet-100 text-violet-700"
                      }`}>
                        {log.role || log.actor}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 max-w-[320px] truncate" title={log.details}>
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
