import React from "react";

interface HealthShieldLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "hero";
  animated?: boolean;
  showWordmark?: boolean;
  variant?: "horizontal" | "stacked" | "icon-only";
  className?: string;
  subtitle?: string;
  theme?: "dark" | "light" | "auto";
}

export default function HealthShieldLogo({
  size = "md",
  animated = false,
  showWordmark = false,
  variant = "horizontal",
  className = "",
  subtitle = "Ayushman Bharat Digital Mission",
  theme = "auto"
}: HealthShieldLogoProps) {
  // Dimensions mapping
  const sizeMap = {
    xs: { dim: 24, stroke: 1.5, textMain: "text-xs", textSub: "text-[8px]" },
    sm: { dim: 32, stroke: 1.75, textMain: "text-sm", textSub: "text-[9px]" },
    md: { dim: 44, stroke: 2, textMain: "text-base", textSub: "text-[10px]" },
    lg: { dim: 64, stroke: 2.25, textMain: "text-xl", textSub: "text-xs" },
    xl: { dim: 96, stroke: 2.5, textMain: "text-2xl", textSub: "text-sm" },
    hero: { dim: 128, stroke: 3, textMain: "text-3xl md:text-4xl", textSub: "text-xs md:text-sm" }
  };

  const { dim } = sizeMap[size];

  return (
    <div
      className={`inline-flex ${
        variant === "stacked" ? "flex-col items-center text-center" : "items-center"
      } gap-3 ${className}`}
    >
      {/* SVG Emblem Icon */}
      <div
        className="relative shrink-0 flex items-center justify-center select-none"
        style={{ width: dim, height: dim }}
      >
        {/* Ambient Back Glow (especially vibrant in hero/large sizes) */}
        {(size === "lg" || size === "xl" || size === "hero") && (
          <div
            className={`absolute inset-0 rounded-full blur-xl opacity-60 pointer-events-none ${
              animated ? "animate-pulse" : ""
            } bg-gradient-to-tr from-orange-500/30 via-blue-600/30 to-emerald-500/30`}
          />
        )}

        <svg
          viewBox="0 0 120 120"
          width={dim}
          height={dim}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-md overflow-visible"
        >
          <defs>
            {/* National Tricolor & Tech Gradients */}
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E3A8A" />
              <stop offset="50%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#0B132B" />
            </linearGradient>

            <linearGradient id="shieldBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="35%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#138808" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            <linearGradient id="crossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>

            <linearGradient id="saffronGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            <linearGradient id="emeraldGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Outer Orbit Ring with 24 Ashoka Chakra Radial Notches */}
          <g className={animated ? "origin-center animate-[spin_24s_linear_infinite]" : "origin-center"}>
            <circle
              cx="60"
              cy="60"
              r="55"
              stroke="url(#shieldBorderGrad)"
              strokeWidth="1.5"
              strokeDasharray="3 4"
              opacity="0.65"
            />
            {/* 4 Cardinal micro-orbs representing 4 Pillars of ABDM */}
            <circle cx="60" cy="5" r="2.2" fill="#FF9933" />
            <circle cx="115" cy="60" r="2.2" fill="#38BDF8" />
            <circle cx="60" cy="115" r="2.2" fill="#10B981" />
            <circle cx="5" cy="60" r="2.2" fill="#FFFFFF" />
          </g>

          {/* 2. Concentric Golden Ring */}
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="url(#saffronGold)"
            strokeWidth="1"
            opacity="0.3"
          />

          {/* 3. The National Health Shield Body (Curved heraldic fortress contour) */}
          <path
            d="M60 12 
               C82 12, 100 21, 102 38 
               C103 67, 85 93, 60 108 
               C35 93, 17 67, 18 38 
               C20 21, 38 12, 60 12 Z"
            fill="url(#shieldGrad)"
            stroke="url(#shieldBorderGrad)"
            strokeWidth="3"
            filter="url(#glowFilter)"
          />

          {/* Subtle Inner Contour Highlight */}
          <path
            d="M60 16 
               C79 16, 95 24, 97 39 
               C98 64, 82 87, 60 101 
               C38 87, 22 64, 23 39 
               C25 24, 41 16, 60 16 Z"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1"
            fill="none"
          />

          {/* 4. Ashoka Chakra / Sunburst Wheel Halo in Center */}
          <g className={animated ? "origin-center animate-[spin_30s_linear_infinite]" : "origin-center"}>
            <circle
              cx="60"
              cy="56"
              r="24"
              stroke="#38BDF8"
              strokeWidth="1"
              strokeDasharray="2 3"
              opacity="0.4"
            />
            {/* Subtle Spokes */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="60"
                y1="56"
                x2={60 + 22 * Math.cos((deg * Math.PI) / 180)}
                y2={56 + 22 * Math.sin((deg * Math.PI) / 180)}
                stroke="#60A5FA"
                strokeWidth="0.75"
                opacity="0.25"
              />
            ))}
          </g>

          {/* 5. Medical Cross with Integrated Ecg / Pulse Core */}
          <g>
            {/* Cross Vertical Beam */}
            <rect
              x="53.5"
              y="32"
              width="13"
              height="48"
              rx="4"
              fill="url(#crossGrad)"
              opacity="0.95"
            />
            {/* Cross Horizontal Beam */}
            <rect
              x="36"
              y="49.5"
              width="48"
              height="13"
              rx="4"
              fill="url(#crossGrad)"
              opacity="0.95"
            />

            {/* Glowing Pulse / ECG Line Traced through Center */}
            <path
              d="M32 56 L47 56 L51 46 L55 65 L61 40 L66 68 L70 52 L73 56 L88 56"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glowFilter)"
            />

            {/* Central Pure Heart/Sparkle Core */}
            <circle cx="60" cy="56" r="3.5" fill="#FFFFFF" />
            <circle cx="60" cy="56" r="6" stroke="#38BDF8" strokeWidth="1" opacity="0.8" />
          </g>

          {/* 6. Lower Shield Security Lock / Verification Check Emblem */}
          <g transform="translate(48, 86)">
            {/* Hexagon / Security Shield badge */}
            <polygon
              points="12,0 23,6 23,18 12,24 1,18 1,6"
              fill="#065F46"
              stroke="#34D399"
              strokeWidth="1.5"
            />
            {/* White Checkmark */}
            <path
              d="M7 12 L10.5 15.5 L17 8.5"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      {/* Typographic Wordmark & Mission Branding */}
      {showWordmark && (
        <div
          className={`${
            variant === "stacked" ? "text-center mt-1" : "text-left"
          }`}
        >
          <div className="flex items-center gap-1.5 justify-center md:justify-start">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-white border border-slate-300 dark:border-slate-600" />
            <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
            <span
              className={`text-[9px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 font-sans`}
            >
              National Health Authority
            </span>
          </div>

          <h1
            className={`font-black tracking-tight leading-none text-slate-900 dark:text-white ${sizeMap[size].textMain} mt-1`}
          >
            HealthShield <span className="text-orange-500">Bharat</span>
          </h1>

          <p
            className={`font-medium text-slate-500 dark:text-slate-400 leading-tight mt-0.5 ${sizeMap[size].textSub}`}
          >
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
}
