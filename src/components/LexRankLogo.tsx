import React from 'react';

interface LexRankLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export default function LexRankLogo({ className = '', size = 'md', showText = true }: LexRankLogoProps) {
  // Determine pixel sizes
  const dimensions = {
    sm: { container: 'w-16 h-16', svg: 'w-12 h-12', titleSize: 'text-xs', subSize: 'text-[7px]' },
    md: { container: 'w-32 h-32', svg: 'w-24 h-24', titleSize: 'text-base', subSize: 'text-[9px]' },
    lg: { container: 'w-48 h-48', svg: 'w-36 h-36', titleSize: 'text-xl', subSize: 'text-[11px]' },
    xl: { container: 'w-64 h-64', svg: 'w-52 h-52', titleSize: 'text-2xl', subSize: 'text-[13px]' },
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center font-sans ${className}`}>
      {/* Outer rounded App Icon Frame replicating the image background */}
      <div className="relative p-5 bg-gradient-to-b from-[#111319] to-[#08090d] rounded-[32px] border border-zinc-800/60 shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.05)] flex flex-col items-center justify-center overflow-hidden">
        {/* Subtle radial sheen overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.05)_0%,transparent_70%)] pointer-events-none" />

        {/* Vector SVG Emblem rendering the golden scales, book, and nib */}
        <svg 
          viewBox="0 0 200 200" 
          className="w-28 h-28 select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Definitions for metallic golden gradients and glow effects */}
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" /> {/* Amber 500 */}
              <stop offset="30%" stopColor="#FBBF24" /> {/* Amber 400 */}
              <stop offset="50%" stopColor="#FFFBEB" /> {/* Warm light gold highlight */}
              <stop offset="70%" stopColor="#D97706" /> {/* Amber 600 */}
              <stop offset="100%" stopColor="#92400E" /> {/* Amber 800 */}
            </linearGradient>

            <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E4E4E7" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#71717A" />
            </linearGradient>

            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Golden Lunar/Crescent Arc framing the top-left */}
          <path 
            d="M 50 155 A 72 72 0 1 1 162 138" 
            stroke="url(#goldGrad)" 
            strokeWidth="3.5" 
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* 2. Scale of Justice (Pillar, beam, plates) */}
          {/* Base pedestal */}
          <path d="M 88 120 L 112 120 L 110 115 L 90 115 Z" fill="url(#goldGrad)" />
          <path d="M 94 115 L 106 115 L 104 111 L 96 111 Z" fill="url(#goldGrad)" />
          {/* Main vertical column */}
          <rect x="98" y="48" width="4" height="63" rx="1.5" fill="url(#goldGrad)" />
          {/* Decorative column tip */}
          <path d="M 100 37 L 104 44 L 96 44 Z" fill="url(#goldGrad)" />
          <circle cx="100" cy="46" r="2.5" fill="url(#goldGrad)" />
          {/* Main Horizontal Beam */}
          <path d="M 68 56 Q 100 50 132 56 L 132 59 Q 100 53 68 59 Z" fill="url(#goldGrad)" />
          <circle cx="100" cy="54" r="3.5" fill="url(#goldGrad)" />
          <circle cx="68" cy="57.5" r="2" fill="url(#goldGrad)" />
          <circle cx="132" cy="57.5" r="2" fill="url(#goldGrad)" />

          {/* Left hanging strings */}
          <line x1="68" y1="57.5" x2="57" y2="85" stroke="url(#goldGrad)" strokeWidth="1" />
          <line x1="68" y1="57.5" x2="79" y2="85" stroke="url(#goldGrad)" strokeWidth="1" />
          {/* Left Pan */}
          <path d="M 54 85 Q 68 85 82 85 Q 82 95 68 95 Q 54 95 54 85 Z" fill="url(#goldGrad)" />
          
          {/* Right hanging strings */}
          <line x1="132" y1="57.5" x2="121" y2="85" stroke="url(#goldGrad)" strokeWidth="1" />
          <line x1="132" y1="57.5" x2="143" y2="85" stroke="url(#goldGrad)" strokeWidth="1" />
          {/* Right Pan */}
          <path d="M 118 85 Q 132 85 146 85 Q 146 95 132 95 Q 118 95 118 85 Z" fill="url(#goldGrad)" />

          {/* 3. Open Book lying underneath the Scale scales */}
          {/* Left Book Section (symmetrical curve) */}
          <path 
            d="M 100 120 Q 75 105 45 118 L 41 120 L 41 138 C 70 125 90 135 100 142 Z" 
            fill="url(#silverGrad)" 
            stroke="url(#goldGrad)" 
            strokeWidth="1.5"
          />
          {/* Right Book Section */}
          <path 
            d="M 100 120 Q 125 105 155 118 L 159 120 L 159 138 C 130 125 110 135 100 142 Z" 
            fill="url(#silverGrad)" 
            stroke="url(#goldGrad)" 
            strokeWidth="1.5"
          />
          {/* Symmetrical interior page lines for 3D realism */}
          <path d="M 45 123 Q 73 111 96 125" stroke="url(#goldGrad)" strokeWidth="0.8" opacity="0.6" />
          <path d="M 49 128 Q 74 117 96 130" stroke="url(#goldGrad)" strokeWidth="0.8" opacity="0.4" />
          <path d="M 155 123 Q 127 111 104 125" stroke="url(#goldGrad)" strokeWidth="0.8" opacity="0.6" />
          <path d="M 151 128 Q 126 117 104 130" stroke="url(#goldGrad)" strokeWidth="0.8" opacity="0.4" />

          {/* 4. Elegant Fountain Pen Nib pointing from below */}
          <path 
            d="M 100 152 Q 95 168 94 185 L 106 185 Q 105 168 100 152 Z" 
            fill="url(#goldGrad)" 
          />
          {/* Pen Center split nib line & breather hole */}
          <circle cx="100" cy="165" r="1.5" fill="#0c0d12" />
          <line x1="100" y1="152" x2="100" y2="185" stroke="#0c0d12" strokeWidth="1.2" />
        </svg>

        {/* Text descriptions matching the typography style precisely */}
        {showText && (
          <div className="text-center mt-3 select-none space-y-1">
            <h1 className="text-xl font-black tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 uppercase font-sans leading-none drop-shadow-sm">
              LEXRANK
            </h1>
            
            <div className="flex items-center justify-center gap-1.5 py-0.5">
              <span className="h-[1px] w-4 bg-amber-500/40" />
              <p className="text-[9px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-zinc-100 uppercase tracking-[0.25em] font-mono leading-none">
                CLAT PG PREP
              </p>
              <span className="h-[1px] w-4 bg-amber-500/40" />
            </div>

            <p className="text-[7.5px] font-medium text-amber-500/80 uppercase tracking-[0.16em] leading-normal font-sans">
              Practice. Analyze. Achieve AIR 1.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
