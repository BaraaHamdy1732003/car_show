import React from 'react';

export const HeroCar: React.FC = () => {
  return (
    <div className="pointer-events-none relative z-[5] flex w-full justify-center overflow-hidden pb-4">
      {/* Drive-in wrapper */}
      <div className="hero-car-drive relative w-[min(92vw,760px)]">
        {/* Speed lines trailing behind the car */}
        <div className="hero-car-lines absolute right-[96%] top-[48%] w-[45vw]">
          <div className="h-[2px] mb-3 bg-gradient-to-l from-white/70 to-transparent" />
          <div className="h-[2px] mb-3 ml-10 bg-gradient-to-l from-[#FFD600]/70 to-transparent" />
          <div className="h-[2px] ml-4 bg-gradient-to-l from-[#FF2020]/70 to-transparent" />
        </div>

        <svg
          viewBox="0 0 600 190"
          className="hero-car-idle w-full h-auto drop-shadow-[0_0_30px_rgba(213,0,0,0.45)]"
          style={{ overflow: 'visible' }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="hc-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ff2a2a" />
              <stop offset="1" stopColor="#7a0000" />
            </linearGradient>
            <linearGradient id="hc-glass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2a2a2a" />
              <stop offset="1" stopColor="#050505" />
            </linearGradient>
            <linearGradient id="hc-beam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="hc-rim" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#e5e5e5" />
              <stop offset="1" stopColor="#6b6b6b" />
            </radialGradient>
          </defs>

          {/* Ground shadow */}
          <ellipse cx="300" cy="172" rx="270" ry="8" fill="#000" opacity="0.7" />

          {/* Headlight beam */}
          <polygon className="hero-car-beam" points="566,118 780,88 780,165" fill="url(#hc-beam)" />

          {/* Body */}
          <path
            d="M28 128 C28 114 58 108 105 102 L185 78 C212 60 256 48 305 48 C350 48 388 58 418 76 L478 96 C528 102 570 110 576 124 L576 142 L28 142 Z"
            fill="url(#hc-body)"
          />
          {/* Windows */}
          <path
            d="M205 80 C228 64 262 56 303 56 C340 56 366 62 392 78 Z"
            fill="url(#hc-glass)"
          />
          {/* Yellow accent line */}
          <path d="M60 124 L560 124" stroke="#FFD600" strokeWidth="2" opacity="0.85" />
          {/* Headlight + tail light */}
          <path d="M520 104 L568 113 L540 116 Z" fill="#fff" />
          <rect className="hero-car-brake" x="28" y="112" width="10" height="9" rx="2" fill="#ff2020" />

          {/* Wheel arches */}
          <circle cx="140" cy="140" r="36" fill="#050505" />
          <circle cx="470" cy="140" r="36" fill="#050505" />

          {/* Wheels */}
          {[140, 470].map((cx) => (
            <g key={cx} transform={`translate(${cx} 140)`}>
              <g className="hero-car-wheel">
                <circle r="30" fill="#0e0e0e" />
                <circle r="21" fill="url(#hc-rim)" />
                {[0, 72, 144, 216, 288].map((a) => (
                  <line
                    key={a}
                    x1="0" y1="0" x2="0" y2="-20"
                    stroke="#2a2a2a" strokeWidth="4"
                    transform={`rotate(${a})`}
                  />
                ))}
                <circle r="5" fill="#FFD600" />
                <path d="M-12 -14 A19 19 0 0 1 12 -14" stroke="#D50000" strokeWidth="3" fill="none" />
              </g>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};