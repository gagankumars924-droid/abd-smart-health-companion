import React from "react";
import { Award, CheckCircle2, TrendingUp, Sparkles, Heart, Zap } from "lucide-react";
import { Challenge } from "../types";

interface RewardsWellnessProps {
  challenges: Challenge[];
  rewardPoints: number;
  onToggleChallenge: (id: string) => void;
  lang: "en" | "hi" | "mr";
  t: any;
}

export default function RewardsWellness({
  challenges,
  rewardPoints,
  onToggleChallenge,
  lang,
  t
}: RewardsWellnessProps) {
  // Badges array
  const badges = [
    { name: "ABHA Pioneer", desc: "First digital health link", icon: "🛡️", unlocked: true },
    { name: "Hydration Guru", desc: "Completed 7-day water loops", icon: "💧", unlocked: true },
    { name: "Aarogya Master", desc: "Health Score above 80", icon: "🌟", unlocked: true },
    { name: "Iron Warrior", desc: "Resolved low hemoglobin count", icon: "🍃", unlocked: false }
  ];

  // Daily habit tracker state simulation
  const [habits, setHabits] = React.useState([
    { name: "Morning Sunlight", done: [true, true, false, true, false, true, true] },
    { name: "Yoga/Pranayama", done: [true, false, true, true, false, false, true] },
    { name: "Avoid Refined Sugars", done: [true, true, true, false, true, true, false] }
  ]);

  const toggleHabit = (habitIndex: number, dayIndex: number) => {
    const updated = [...habits];
    updated[habitIndex].done[dayIndex] = !updated[habitIndex].done[dayIndex];
    setHabits(updated);
  };

  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="space-y-6">
      {/* Points and badge tier card */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white p-5 rounded-2xl shadow border border-teal-400">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] text-teal-100 uppercase tracking-widest font-semibold font-sans">AYUSHMAN WELLNESS REWARDS</span>
            <h3 className="text-2xl font-black mt-1 font-sans flex items-center gap-1.5">
              {rewardPoints} <span className="text-sm font-normal text-teal-100">Points</span>
            </h3>
            <p className="text-xs text-teal-100 mt-1">Level 4: Ayushman Silver Companion</p>
          </div>
          <div className="p-2 bg-white/10 rounded-xl">
            <Award className="h-7 w-7 text-yellow-300 animate-bounce" />
          </div>
        </div>

        {/* Level progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-teal-100 font-sans mb-1">
            <span>Next Tier: Gold Leader</span>
            <span>{500 - rewardPoints} pts needed</span>
          </div>
          <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-300 transition-all duration-500" style={{ width: `${(rewardPoints / 500) * 100}%` }}></div>
          </div>
        </div>

        <div className="mt-3.5 pt-3.5 border-t border-white/10 flex justify-between items-center text-[10px] text-teal-50 font-sans">
          <span>🎁 Redeemable at PM-JAY partner pharmacies</span>
          <span className="underline cursor-pointer hover:text-white flex items-center gap-1">
            View Catalog <Sparkles className="h-3 w-3" />
          </span>
        </div>
      </div>

      {/* Wellness Missions / Daily Challenges */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-teal-50 dark:bg-teal-950 text-teal-600 rounded-lg">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm">
              {t.challenges || "Daily Wellness Missions"}
            </h4>
            <p className="text-xs text-slate-500">Earn direct medical subsidy points by completing healthy routines.</p>
          </div>
        </div>

        <div className="space-y-3">
          {challenges.map((c) => (
            <div
              key={c.id}
              onClick={() => onToggleChallenge(c.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition flex justify-between items-center ${
                c.completed
                  ? "bg-emerald-50/40 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900"
                  : "bg-slate-50 border-slate-150 hover:bg-slate-100/50 dark:bg-slate-950 dark:border-slate-800"
              }`}
            >
              <div className="pr-3 flex-1">
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-sans ${
                    c.completed
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                  }`}
                >
                  {c.category}
                </span>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1.5 font-sans leading-tight">
                  {c.title}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-sans leading-tight">{c.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-sans font-black text-teal-600 bg-teal-50 dark:bg-teal-950 px-2 py-1 rounded">
                  +{c.points} pt
                </span>
                <CheckCircle2
                  className={`h-5 w-5 transition-transform ${
                    c.completed ? "text-emerald-500 scale-110" : "text-slate-300 dark:text-slate-700"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Habit Grid Tracker */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            {t.habits || "Habit Grid"}
          </h4>
          <span className="text-[10px] text-slate-400">Tap circles to log</span>
        </div>

        <div className="space-y-3 pt-1">
          {/* Calendar header row */}
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pl-32 pr-2">
            {days.map((d, i) => (
              <span key={i} className="w-6 text-center">{d}</span>
            ))}
          </div>

          {habits.map((h, hIdx) => (
            <div key={hIdx} className="flex items-center justify-between">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-sans w-32 truncate">{h.name}</span>
              <div className="flex justify-between flex-1 pl-2 pr-1">
                {h.done.map((done, dIdx) => (
                  <button
                    key={dIdx}
                    onClick={() => toggleHabit(hIdx, dIdx)}
                    className={`h-5 w-5 rounded-full text-[9px] font-bold transition flex items-center justify-center ${
                      done
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {done && "✓"}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Government Badges Section */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h4 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm mb-4 flex items-center gap-1.5">
          <Award className="h-4 w-4 text-yellow-500" />
          {t.badges || "Ayushman Milestones"}
        </h4>

        <div className="grid grid-cols-2 gap-3">
          {badges.map((b) => (
            <div
              key={b.name}
              className={`p-3 rounded-xl border flex gap-2 items-center transition ${
                b.unlocked
                  ? "bg-slate-50 dark:bg-slate-950 border-slate-150 dark:border-slate-800"
                  : "bg-slate-100/40 dark:bg-slate-950/40 border-dashed border-slate-200 dark:border-slate-800 opacity-55"
              }`}
            >
              <span className="text-2xl">{b.icon}</span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans truncate">{b.name}</p>
                <p className="text-[9px] text-slate-500 font-sans leading-tight truncate">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
