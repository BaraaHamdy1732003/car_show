import React from 'react';
import { ArrowRight, Maximize2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { Car } from '../types/car';
import { HeroCar } from './HeroCar';

interface HeroSectionProps {
  onExploreCollection: () => void;
  onDiscoverBrands: () => void;
  onEnterExhibitionHall: () => void;
  onOpenExplorer3D: (car: Car) => void;
  featuredCar: Car;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCollection,
  onDiscoverBrands,
  onEnterExhibitionHall,
  onOpenExplorer3D,
  featuredCar,
}) => {
  return (
    <div className="relative min-h-[92vh] w-full flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Cinematic Exhibition Hall Background (Faithful to User's Photo) */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/exhibition-hall-main.jpg"
          alt="Luxury Car Exhibition Hall"
          className="w-full h-full object-cover object-center scale-105 animate-pulse-glow"
          style={{ animationDuration: '8s' }}
        />
        {/* Dark Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/65 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-transparent to-[#080808]/90" />
        
        {/* Subtle Ambient Red Light Columns (matching photo) */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-[#D50000]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-[#FFD600]/10 rounded-full blur-[160px] pointer-events-none" />
      </div>

      {/* Animated Hero Car (drives in on page load) */}
      <HeroCar />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">
        {/* Live Exhibition Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/80 border border-[#D50000]/40 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(213,0,0,0.3)] animate-fadeIn">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF2020] animate-ping" />
          <span className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
            Red is the Passion <span className="text-[#D50000]">//</span> International Automotive Exhibition
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-neutral-600" />
          <span className="hidden sm:inline-block text-[11px] font-mono text-[#FFD600] font-bold">
            32 Vehicles on Display
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-heading tracking-tight uppercase max-w-5xl leading-[0.95] text-white drop-shadow-2xl">
          DISCOVER AUTOMOTIVE <span className="text-[#D50000] drop-shadow-[0_0_35px_rgba(213,0,0,0.6)]">EXCELLENCE.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl font-normal leading-relaxed drop-shadow-md">
          Explore the machines that define performance, design, and innovation. Step inside an international luxury showroom with 360° real-time 3D inspection and authentic engineering telemetry.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 z-20">
          <button
            onClick={() => {
              soundEngine.playClick();
              onEnterExhibitionHall();
            }}
            className="py-4 px-8 bg-[#D50000] hover:bg-[#b00000] text-white text-xs sm:text-sm font-heading font-black tracking-widest uppercase rounded-xl transition-all shadow-[0_0_30px_rgba(213,0,0,0.5)] hover:shadow-[0_0_45px_rgba(213,0,0,0.8)] hover:scale-102 flex items-center gap-2 group"
          >
            <span>Enter Exhibition Hall</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onExploreCollection();
            }}
            className="py-4 px-8 bg-neutral-900/90 hover:bg-neutral-800 text-white text-xs sm:text-sm font-heading font-bold tracking-widest uppercase rounded-xl transition-all border border-neutral-700/80 hover:border-neutral-500 backdrop-blur-md"
          >
            Explore Collection
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onDiscoverBrands();
            }}
            className="py-4 px-7 bg-neutral-900/60 hover:bg-neutral-800/80 text-neutral-300 hover:text-white text-xs sm:text-sm font-heading font-bold tracking-widest uppercase rounded-xl transition-all border border-neutral-800 backdrop-blur-md"
          >
            Discover Brands
          </button>
        </div>

        {/* Hero Podium Spotlight Teaser Card */}
        <div className="mt-14 w-full max-w-2xl bg-black/80 backdrop-blur-xl border border-neutral-800/80 hover:border-[#D50000]/60 p-4 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row items-center justify-between gap-4 transition-all">
          <div className="flex items-center gap-4 text-left">
            <div className="w-16 h-12 rounded-lg overflow-hidden bg-neutral-900 shrink-0 border border-neutral-800">
              <img
                src={featuredCar.heroImage}
                alt={featuredCar.model}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#D50000] font-bold uppercase">
                  PODIUM 01 FEATURED
                </span>
                <span className="text-[10px] font-mono text-neutral-400">• {featuredCar.country}</span>
              </div>
              <h3 className="text-base font-bold font-heading text-white">
                {featuredCar.manufacturer} {featuredCar.model}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenExplorer3D(featuredCar);
              }}
              className="w-full sm:w-auto py-2 px-4 bg-[#D50000] hover:bg-[#b00000] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(213,0,0,0.4)]"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              Launch 3D Explorer
            </button>
          </div>
        </div>

        {/* Statistics Ticker Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 w-full max-w-4xl border-t border-neutral-800/80 pt-8 font-mono text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black font-heading text-white">32</div>
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Curated Vehicles</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-heading text-[#FF2020]">20</div>
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Iconic Marques</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-heading text-[#FFD600]">12</div>
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Classifications</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black font-heading text-white">100%</div>
            <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Interactive 3D</div>
          </div>
        </div>
      </div>
    </div>
  );
};