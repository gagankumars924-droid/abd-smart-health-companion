import React, { useState, useEffect } from "react";
import {
  Shield, CheckCircle2, Lock, Globe, ArrowRight, Activity, Sparkles,
  Server, Cpu, Database, Award, ExternalLink
} from "lucide-react";
import HealthShieldLogo from "./HealthShieldLogo";
import { Language } from "../types";

interface SplashScreenProps {
  onComplete: () => void;
  lang: Language;
  onSelectLang: (lang: Language) => void;
}

export default function SplashScreen({
  onComplete,
  lang,
  onSelectLang
}: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    {
      titleEn: "Initializing National Digital Health Sandbox...",
      titleHi: "राष्ट्रीय डिजिटल स्वास्थ्य सैंडबॉक्स प्रारंभ हो रहा है...",
      titleOr: "ଜାତୀୟ ଡିଜିଟାଲ୍ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ୟାଣ୍ଡବକ୍ସ ଆରମ୍ଭ ହେଉଛି...",
      detail: "NHA Root PKI Verification",
      icon: Server
    },
    {
      titleEn: "Connecting to 14-Digit ABHA Identity Vault...",
      titleHi: "14-अंकीय आभा पहचान वॉल्ट से कनेक्ट हो रहा है...",
      titleOr: "୧୪-ଅଙ୍କ ବିଶିଷ୍ଟ ABHA ପରିଚୟ ଭଲ୍ଟ ସହିତ ସଂଯୋଗ ହେଉଛି...",
      detail: "HIE-CM Consent Handshake",
      icon: Shield
    },
    {
      titleEn: "Establishing FHIR R4 Encrypted Health Gateway...",
      titleHi: "FHIR R4 एन्क्रिप्टेड स्वास्थ्य गेटवे स्थापित हो रहा है...",
      titleOr: "FHIR R4 ଏନକ୍ରିପ୍ଟେଡ୍ ସ୍ୱାସ୍ଥ୍ୟ ଗେଟୱେ ସ୍ଥାପନ ହେଉଛି...",
      detail: "256-Bit AES Cryptographic Channel",
      icon: Database
    },
    {
      titleEn: "Universal Health Ecosystem Synchronized ✓",
      titleHi: "सार्वभौमिक स्वास्थ्य नेटवर्क सुरक्षित एवं तैयार ✓",
      titleOr: "ସାର୍ବଜନୀନ ସ୍ୱାସ୍ଥ୍ୟ ଇକୋସିଷ୍ଟମ୍ ପ୍ରସ୍ତୁତ ✓",
      detail: "Zero-Knowledge Architecture Online",
      icon: CheckCircle2
    }
  ];

  // Smooth realistic progress animation
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2800; // 2.8s total duration

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct < 28) setCurrentStepIndex(0);
      else if (pct < 60) setCurrentStepIndex(1);
      else if (pct < 90) setCurrentStepIndex(2);
      else setCurrentStepIndex(3);

      if (pct >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 350);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Keyboard shortcut: Press Enter or Space to skip immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        onComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onComplete]);

  const currentStep = steps[currentStepIndex];
  const stepTitle =
    lang === "hi"
      ? currentStep.titleHi
      : lang === "or"
      ? currentStep.titleOr
      : currentStep.titleEn;

  return (
    <div className="min-h-screen bg-[#070b19] text-white flex flex-col justify-between select-none overflow-hidden relative font-sans">
      {/* 1. National Tricolor Top Ambient Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-600 shadow-[0_0_15px_rgba(255,153,51,0.5)] z-20 shrink-0" />

      {/* Background Cyber-Health Radial Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-orange-600/15 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-600/15 blur-3xl" />

        {/* Fine Guilloche / Grid Pattern Texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: "28px 28px"
          }}
        />
      </div>

      {/* 2. Top Utility Bar: Language Selector & Instant Skip Button */}
      <header className="relative z-20 px-6 py-4 flex justify-between items-center w-full max-w-6xl mx-auto">
        {/* National Emblem & Department Identification */}
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-bold text-slate-300 tracking-wider uppercase font-mono hidden sm:inline">
            ABDM Sandbox v2.4 • Production Ready
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Language Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-700/60 rounded-full px-2.5 py-1 backdrop-blur-md">
            <Globe className="h-3.5 w-3.5 text-blue-400" />
            <select
              value={lang}
              onChange={(e) => onSelectLang(e.target.value as Language)}
              className="bg-transparent text-[11px] font-bold text-slate-200 cursor-pointer focus:outline-none"
            >
              <option value="en" className="bg-slate-900 text-white">English (EN)</option>
              <option value="hi" className="bg-slate-900 text-white">हिन्दी (HI)</option>
              <option value="or" className="bg-slate-900 text-white">ଓଡ଼ିଆ (OR)</option>
              <option value="mr" className="bg-slate-900 text-white">मराठी (MR)</option>
            </select>
          </div>

          {/* Skip / Enter Now Button */}
          <button
            onClick={onComplete}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition backdrop-blur-md cursor-pointer shadow-lg"
          >
            <span>Enter Portal</span>
            <ArrowRight className="h-3.5 w-3.5 text-orange-400" />
          </button>
        </div>
      </header>

      {/* 3. Center Hero Logo & Title Presentation */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-8 max-w-2xl mx-auto space-y-7">
        
        {/* Animated Brand Emblem */}
        <div className="relative group cursor-pointer" onClick={onComplete} title="Click to enter immediately">
          <HealthShieldLogo
            size="hero"
            animated={true}
            variant="icon-only"
            className="transform transition hover:scale-105 duration-300"
          />

          {/* Micro Orbit Pulse Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/20 scale-125 animate-ping opacity-40 pointer-events-none" />
        </div>

        {/* Hero Branding & Typography */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/10 via-blue-500/10 to-emerald-500/10 border border-slate-700/80 px-4 py-1.5 rounded-full backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="h-2 w-2 rounded-full bg-white" />
            <span className="h-2 w-2 rounded-full bg-green-600" />
            <span className="text-xs font-black tracking-widest uppercase bg-gradient-to-r from-orange-400 via-white to-emerald-400 bg-clip-text text-transparent">
              आयुष्मान भारत डिजिटल मिशन • ABDM
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-none">
            HEALTHSHIELD <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">BHARAT</span>
          </h1>

          <p className="text-xs sm:text-sm text-blue-200/90 font-medium max-w-lg mx-auto leading-relaxed">
            National Universal Health Architecture • 14-Digit ABHA Health Locker • Unified Teleconsultation & Patient Privacy
          </p>
        </div>

        {/* 4. Live Gateway Handshake Progress Card */}
        <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl space-y-3 text-left">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <currentStep.icon className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span className="font-mono text-slate-300 text-[11px] truncate max-w-[260px]">
                {stepTitle}
              </span>
            </div>
            <span className="font-mono font-bold text-orange-400 text-xs">
              {progress}%
            </span>
          </div>

          {/* Progress Bar with Tricolor Glow Fill */}
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-orange-500 via-blue-400 to-emerald-400 rounded-full transition-all duration-150 ease-out shadow-[0_0_10px_rgba(56,189,248,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-0.5">
            <span>{currentStep.detail}</span>
            <span className="text-slate-500">Press Enter to skip</span>
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-2.5 py-1 rounded-lg">
            <Lock className="h-3 w-3 text-emerald-400" />
            <span>256-Bit AES End-to-End Encryption</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-2.5 py-1 rounded-lg">
            <Shield className="h-3 w-3 text-blue-400" />
            <span>Consent-Governed HIE-CM</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-2.5 py-1 rounded-lg">
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>FHIR R4 Compliant</span>
          </div>
        </div>
      </main>

      {/* 5. Footer with Official Ministry Identification */}
      <footer className="relative z-20 pb-6 pt-2 text-center text-slate-400 text-xs w-full max-w-4xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 text-[11px] text-slate-400">
          <span>National Health Authority (NHA)</span>
          <span className="hidden sm:inline">•</span>
          <span>Ministry of Health & Family Welfare</span>
          <span className="hidden sm:inline">•</span>
          <span>Government of India</span>
        </div>
        <p className="text-[10px] text-slate-500 font-mono mt-1">
          © 2026 Ayushman Bharat Digital Mission. Designed for Indian Citizens, Doctors & Healthcare Facilities.
        </p>
      </footer>
    </div>
  );
}
