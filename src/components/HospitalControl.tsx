import React, { useState } from "react";
import { Building2, Bed, Check, Activity, TrendingUp, Users, DollarSign, ListChecks, ArrowUpRight } from "lucide-react";
import { HospitalBed } from "../types";

interface HospitalControlProps {
  initialBeds: HospitalBed[];
  lang: "en" | "hi" | "mr";
  t: any;
}

export default function HospitalControl({ initialBeds, lang, t }: HospitalControlProps) {
  const [beds, setBeds] = useState<HospitalBed[]>(initialBeds);
  const [complianceList, setComplianceList] = useState([
    { task: "Doctor onboarding in Healthcare Professionals Registry (HPR)", done: true },
    { task: "IPD/OPD module synchronization with local EHR system", done: true },
    { task: "ABHA QR code counters established at OPD registration", done: true },
    { task: "Real-time Bed availability integrated on State central API", done: false },
    { task: "Automated PM-JAY billing with direct consent-based links", done: false }
  ]);

  const toggleCompliance = (index: number) => {
    const updated = [...complianceList];
    updated[index].done = !updated[index].done;
    setComplianceList(updated);
  };

  const updateBedAvailability = (index: number, change: number) => {
    const updated = [...beds];
    const newAvail = updated[index].available + change;
    if (newAvail >= 0 && newAvail <= updated[index].total) {
      updated[index].available = newAvail;
      setBeds(updated);
    }
  };

  // Billing list mockup
  const billingList = [
    { patient: "Sunita Deshmukh", type: "OPD Review", cost: "₹450", status: "Paid via PM-JAY" },
    { patient: "Ramesh Chandra", type: "Cardio Scan", cost: "₹3,200", status: "ABDM-linked Pending" },
    { patient: "Karan Johar", type: "Daycare Cataract", cost: "₹18,500", status: "Approved, Claims Synced" }
  ];

  return (
    <div className="space-y-6">
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block font-sans">Daily OPD Visits</span>
            <p className="text-2xl font-black mt-1 text-slate-800 dark:text-slate-100 font-sans">284 <span className="text-xs text-green-600 font-normal">↑ 14%</span></p>
          </div>
          <Users className="h-8 w-8 text-blue-500 bg-blue-50 dark:bg-blue-950 p-1.5 rounded-xl" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block font-sans">ABDM Registrations today</span>
            <p className="text-2xl font-black mt-1 text-slate-800 dark:text-slate-100 font-sans">92% <span className="text-xs text-blue-600 font-normal">Direct QR scan</span></p>
          </div>
          <Activity className="h-8 w-8 text-emerald-500 bg-emerald-50 dark:bg-emerald-950 p-1.5 rounded-xl" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide block font-sans">PM-JAY Claims Settled</span>
            <p className="text-2xl font-black mt-1 text-slate-800 dark:text-slate-100 font-sans">₹1.84M <span className="text-xs text-teal-600 font-normal">Auto-verified</span></p>
          </div>
          <DollarSign className="h-8 w-8 text-teal-500 bg-teal-50 dark:bg-teal-950 p-1.5 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Real-time Bed availability modifier */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
              <Bed className="h-4 w-4 text-rose-500" />
              {t.bedAvailability || "Bed Availability Tracker"}
            </h4>
            <span className="text-[10px] text-emerald-600 font-bold bg-green-50 px-2 py-0.5 rounded uppercase">State portal synced</span>
          </div>

          <div className="space-y-3">
            {beds.map((b, idx) => {
              const pct = Math.round((b.available / b.total) * 100);
              return (
                <div key={b.category} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans">{b.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-500">
                        {b.available} available / {b.total} total
                      </span>
                      {/* Bed modifiers to simulate real-time hospital occupancy */}
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => updateBedAvailability(idx, -1)}
                          className="h-5 w-5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-xs flex items-center justify-center font-bold"
                          title="Simulate Bed Occupied"
                        >
                          -
                        </button>
                        <button
                          onClick={() => updateBedAvailability(idx, 1)}
                          className="h-5 w-5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-xs flex items-center justify-center font-bold"
                          title="Simulate Bed Released"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        pct > 40
                          ? "bg-green-500"
                          : pct > 15
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ABDM Onboarding / Compliance Checklists */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-2">
            <h4 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
              <ListChecks className="h-4 w-4 text-emerald-500" />
              ABDM Smart Integration Status
            </h4>
            <span className="text-xs text-blue-600 font-bold">
              {Math.round((complianceList.filter((c) => c.done).length / complianceList.length) * 100)}% Compliance
            </span>
          </div>

          <div className="space-y-3">
            {complianceList.map((c, i) => (
              <div
                key={i}
                onClick={() => toggleCompliance(i)}
                className="flex items-start gap-3 p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850 cursor-pointer hover:bg-slate-100/50 transition"
              >
                <div
                  className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition-all ${
                    c.done
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-slate-300 text-transparent"
                  }`}
                >
                  <Check className="h-3 w-3" />
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-snug">{c.task}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OPD Registrations / Invoicing Tracker */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h4 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm mb-4 flex items-center gap-1.5">
          <DollarSign className="h-4 w-4 text-teal-600" />
          Recent ABDM Consent-Based Billing Transactions
        </h4>

        <div className="space-y-2.5">
          {billingList.map((bill, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850"
            >
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 font-sans">{bill.patient}</p>
                <p className="text-[10px] text-slate-500 font-sans">{bill.type}</p>
              </div>

              <div className="text-right">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans">{bill.cost}</p>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded font-sans font-medium">
                  {bill.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
