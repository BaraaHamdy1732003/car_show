import React, { useState } from 'react';
import { Car } from '../types/car';
import { Eye, Volume2, Maximize2, Heart } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ExhibitionHallProps {
  cars: Car[];
  onSelectCar: (car: Car) => void;
  onOpenExplorer3D: (car: Car) => void;
  onToggleFavorite: (carId: string) => void;
  favorites: string[];
  onOpenRevModal: (car: Car) => void;
}

export const ExhibitionHall: React.FC<ExhibitionHallProps> = ({
  cars,
  onSelectCar,
  onOpenExplorer3D,
  onToggleFavorite,
  favorites,
  onOpenRevModal,
}) => {
  const [selectedWing, setSelectedWing] = useState<string>('All Wings');
  const [activeCarId, setActiveCarId] = useState<string>('ferrari-sf90-stradale');
  const [viewAngle, setViewAngle] = useState<'cinematic' | 'floor-plan' | 'spotlight-grid'>('cinematic');

  const wings = [
    'All Wings',
    'Italian Thoroughbreds',
    'German Engineering',
    'Hypercar Apex',
    'British Heritage',
    'American Power',
  ];

  const filteredCars = cars.filter((c) => {
    if (selectedWing === 'All Wings') return true;
    return c.podiumSpot?.wing === selectedWing;
  });

  const activeCar = cars.find((c) => c.id === activeCarId) || cars[0];

  return (
    <section className="relative w-full bg-[#080808] border-b border-neutral-800 text-white overflow-hidden py-12 md:py-20">
      {/* Cinematic Ambient Hall Background */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D50000]/15 rounded-full blur-[140px]" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#FFD600]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[700px] h-60 bg-[#D50000]/20 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Exhibition Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 border-b border-neutral-800/80 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-[#D50000]/20 border border-[#D50000]/40 text-[#FF2020] text-xs font-semibold tracking-widest uppercase rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF2020] animate-ping" />
                Live Showroom Pavilion
              </span>
              <span className="text-neutral-400 text-xs font-mono tracking-wider">
                HALL A • PAVILION DE LEGENDES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-wide uppercase">
              The Grand <span className="text-[#D50000]">Exhibition Floor</span>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mt-1">
              Inspired by international automotive galas. Step into the dark exhibition hall where legendary supercars rest on spotlighted red carpet podiums.
            </p>
          </div>

          {/* Exhibition Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-[#121212] p-1 rounded-xl border border-neutral-800 flex items-center">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setViewAngle('cinematic');
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  viewAngle === 'cinematic'
                    ? 'bg-[#D50000] text-white shadow-lg'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Cinematic Hall
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setViewAngle('floor-plan');
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  viewAngle === 'floor-plan'
                    ? 'bg-[#D50000] text-white shadow-lg'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Interactive Floor Map
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setViewAngle('spotlight-grid');
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  viewAngle === 'spotlight-grid'
                    ? 'bg-[#D50000] text-white shadow-lg'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Podium Highlights
              </button>
            </div>
          </div>
        </div>

        {/* Wing Category Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
          <span className="text-xs font-mono uppercase text-neutral-500 whitespace-nowrap mr-2">
            Showroom Wings:
          </span>
          {wings.map((wing) => {
            const isSelected = selectedWing === wing;
            return (
              <button
                key={wing}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedWing(wing);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#D50000] text-white border-[#D50000] shadow-[0_0_15px_rgba(213,0,0,0.5)]'
                    : 'bg-[#121212] text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white'
                }`}
              >
                {wing === 'Italian Thoroughbreds' ? '🇮🇹 Red is the Passion' : wing}
              </button>
            );
          })}
        </div>

        {/* VIEW 1: CINEMATIC EXHIBITION HALL (Directly mirroring the photo!) */}
        {viewAngle === 'cinematic' && (
          <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-[#0e0e0e] shadow-2xl">
            {/* Main Stage Canvas Container */}
            <div className="relative aspect-[16/9] min-h-[460px] max-h-[640px] w-full bg-black overflow-hidden group">
              {/* Cinematic Hall Backdrop */}
              <img
                src="/images/exhibition-hall-main.jpg"
                alt="Elite Auto Luxury Exhibition Hall"
                className="w-full h-full object-cover object-center scale-100 transition-transform duration-1000 group-hover:scale-105 opacity-90"
              />

              {/* Polished Floor Reflection & Vignette Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-black/60 pointer-events-none" />
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#080808]/20 to-[#080808]/80 pointer-events-none" />

              {/* Glowing Neon Signage in Distance (matching photo) */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-2 rounded-full bg-black/80 backdrop-blur-md border border-[#D50000]/40 shadow-[0_0_25px_rgba(213,0,0,0.4)]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D50000] animate-ping" />
                <span className="font-heading font-black tracking-widest text-xs sm:text-sm uppercase text-white">
                  RED IS THE PASSION <span className="text-[#D50000]">//</span> ELITE AUTO EXHIBITION
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-[#FFD600]/20 text-[#FFD600] border border-[#FFD600]/30 font-bold">
                  HALL ACTIVE
                </span>
              </div>

              {/* Interactive Podium Hotspots on the Exhibition Floor */}
              {/* Podium 1: Foreground Red Ferrari */}
              <div
                className="absolute left-[38%] bottom-[16%] -translate-x-1/2 cursor-pointer transition-transform duration-300 hover:scale-105 z-20"
                onClick={() => {
                  soundEngine.playClick();
                  setActiveCarId('ferrari-sf90-stradale');
                }}
              >
                <div
                  className={`relative p-2 rounded-xl transition-all ${
                    activeCarId === 'ferrari-sf90-stradale'
                      ? 'ring-2 ring-[#D50000] ring-offset-4 ring-offset-black bg-[#D50000]/10'
                      : 'hover:bg-white/10'
                  }`}
                >
                  {/* Spotlight Cone Simulation */}
                  <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-48 h-36 bg-gradient-to-b from-white/20 via-[#D50000]/10 to-transparent pointer-events-none blur-md rounded-t-full" />
                  
                  {/* Podium Label Tag */}
                  <div className="flex items-center gap-2 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#D50000]/50 shadow-[0_0_15px_rgba(213,0,0,0.5)]">
                    <span className="w-2 h-2 rounded-full bg-[#D50000]" />
                    <div className="text-left">
                      <div className="text-[10px] font-mono text-[#D50000] font-bold">PODIUM 01</div>
                      <div className="text-xs font-bold text-white">Ferrari SF90 Stradale</div>
                    </div>
                    <span className="text-[11px] font-mono text-[#FFD600] font-semibold pl-2">1,000 HP</span>
                  </div>
                </div>
              </div>

              {/* Podium 2: Iconic Yellow Testarossa (Directly from photo!) */}
              <div
                className="absolute left-[26%] bottom-[32%] -translate-x-1/2 cursor-pointer transition-transform duration-300 hover:scale-105 z-20"
                onClick={() => {
                  soundEngine.playClick();
                  setActiveCarId('ferrari-testarossa');
                }}
              >
                <div
                  className={`relative p-2 rounded-xl transition-all ${
                    activeCarId === 'ferrari-testarossa'
                      ? 'ring-2 ring-[#FFD600] ring-offset-4 ring-offset-black bg-[#FFD600]/10'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-40 h-28 bg-gradient-to-b from-yellow-100/25 via-[#FFD600]/15 to-transparent pointer-events-none blur-md rounded-t-full" />
                  <div className="flex items-center gap-2 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#FFD600]/60 shadow-[0_0_15px_rgba(255,214,0,0.4)]">
                    <span className="w-2 h-2 rounded-full bg-[#FFD600]" />
                    <div className="text-left">
                      <div className="text-[10px] font-mono text-[#FFD600] font-bold">PODIUM 02</div>
                      <div className="text-xs font-bold text-white">Ferrari Testarossa</div>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-300 bg-neutral-800 px-1.5 py-0.5 rounded">1984 V12</span>
                  </div>
                </div>
              </div>

              {/* Podium 3: Ferrari 296 GTB */}
              <div
                className="absolute left-[16%] bottom-[48%] -translate-x-1/2 cursor-pointer transition-transform duration-300 hover:scale-105 z-20"
                onClick={() => {
                  soundEngine.playClick();
                  setActiveCarId('ferrari-296-gtb');
                }}
              >
                <div
                  className={`relative p-1.5 rounded-lg transition-all ${
                    activeCarId === 'ferrari-296-gtb' ? 'ring-2 ring-[#D50000] bg-[#D50000]/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-neutral-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D50000]" />
                    <span className="text-[11px] font-semibold">Ferrari 296 GTB</span>
                  </div>
                </div>
              </div>

              {/* Podium 4: Ferrari F40 Classic */}
              <div
                className="absolute left-[20%] bottom-[60%] -translate-x-1/2 cursor-pointer transition-transform duration-300 hover:scale-105 z-20"
                onClick={() => {
                  soundEngine.playClick();
                  setActiveCarId('ferrari-f40');
                }}
              >
                <div
                  className={`relative p-1.5 rounded-lg transition-all ${
                    activeCarId === 'ferrari-f40' ? 'ring-2 ring-[#D50000] bg-[#D50000]/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-neutral-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D50000]" />
                    <span className="text-[11px] font-semibold">Ferrari F40 (1987)</span>
                  </div>
                </div>
              </div>

              {/* Podium 6: Porsche 911 GT3 RS */}
              <div
                className="absolute right-[22%] bottom-[28%] translate-x-1/2 cursor-pointer transition-transform duration-300 hover:scale-105 z-20"
                onClick={() => {
                  soundEngine.playClick();
                  setActiveCarId('porsche-911-gt3-rs');
                }}
              >
                <div
                  className={`relative p-2 rounded-xl transition-all ${
                    activeCarId === 'porsche-911-gt3-rs'
                      ? 'ring-2 ring-[#D50000] ring-offset-4 ring-offset-black bg-[#D50000]/10'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-700 shadow-xl">
                    <span className="w-2 h-2 rounded-full bg-[#D50000]" />
                    <div className="text-left">
                      <div className="text-[10px] font-mono text-neutral-400 font-bold">PODIUM 06</div>
                      <div className="text-xs font-bold text-white">Porsche 911 GT3 RS</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Podium 8: Bugatti Chiron Pur Sport */}
              <div
                className="absolute right-[36%] bottom-[46%] translate-x-1/2 cursor-pointer transition-transform duration-300 hover:scale-105 z-20"
                onClick={() => {
                  soundEngine.playClick();
                  setActiveCarId('bugatti-chiron-pur-sport');
                }}
              >
                <div
                  className={`relative p-1.5 rounded-lg transition-all ${
                    activeCarId === 'bugatti-chiron-pur-sport' ? 'ring-2 ring-blue-500 bg-blue-500/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-neutral-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-[11px] font-semibold">Bugatti Chiron Pur Sport</span>
                  </div>
                </div>
              </div>

              {/* Live Selected Car Spotlight HUD Banner */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md bg-black/85 backdrop-blur-xl border border-neutral-700/80 rounded-xl p-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)] z-30">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D50000]/20 text-[#FF2020] border border-[#D50000]/30">
                        {activeCar.podiumSpot ? `PODIUM #${activeCar.podiumSpot.podiumNumber}` : 'PODIUM'}
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">{activeCar.country}</span>
                    </div>
                    <h3 className="text-lg font-bold font-heading text-white mt-0.5">
                      {activeCar.manufacturer} {activeCar.model}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-[#FFD600] font-bold">{activeCar.priceDisplay}</div>
                    <div className="text-[10px] text-neutral-400">{activeCar.year} Model</div>
                  </div>
                </div>

                {/* Quick specs pill */}
                <div className="grid grid-cols-3 gap-2 my-2.5 bg-neutral-900/80 rounded-lg p-2 border border-neutral-800 text-center font-mono">
                  <div>
                    <div className="text-[10px] text-neutral-400">POWER</div>
                    <div className="text-xs font-bold text-[#FF2020]">{activeCar.engine.horsepower} HP</div>
                  </div>
                  <div className="border-x border-neutral-800">
                    <div className="text-[10px] text-neutral-400">0-100 KM/H</div>
                    <div className="text-xs font-bold text-white">{activeCar.engine.acceleration0100}s</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-400">MAX SPEED</div>
                    <div className="text-xs font-bold text-[#FFD600]">{activeCar.engine.topSpeedKmH} km/h</div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => onOpenExplorer3D(activeCar)}
                    className="flex-1 py-2 px-3 bg-[#D50000] hover:bg-[#b00000] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(213,0,0,0.4)]"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    Enter 3D Explorer
                  </button>

                  <button
                    onClick={() => onSelectCar(activeCar)}
                    className="py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg transition-all border border-neutral-700 flex items-center gap-1"
                    title="View Technical Specs"
                  >
                    Specs
                  </button>

                  <button
                    onClick={() => onOpenRevModal(activeCar)}
                    className="py-2 px-2.5 bg-neutral-800 hover:bg-[#FFD600]/20 hover:text-[#FFD600] text-neutral-200 text-xs font-semibold rounded-lg transition-all border border-neutral-700"
                    title="Simulate Engine Sound"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: INTERACTIVE FLOOR MAP */}
        {viewAngle === 'floor-plan' && (
          <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-[#0c0c0c] p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-neutral-800 pb-4">
              <div>
                <h3 className="text-lg font-bold font-heading uppercase tracking-wider text-white">
                  Architectural Showroom Floor Layout
                </h3>
                <p className="text-xs text-neutral-400">
                  Select any podium coordinate to inspect vehicle placement, lighting angle, and technical telemetry.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-[#D50000] rounded-sm" /> Red Carpet Podium
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" /> Active Spotlight
                </span>
              </div>
            </div>

            {/* Floor Map Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredCars.map((car, idx) => {
                const isActive = car.id === activeCarId;
                return (
                  <div
                    key={car.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setActiveCarId(car.id);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                      isActive
                        ? 'bg-[#1a0f0f] border-[#D50000] shadow-[0_0_20px_rgba(213,0,0,0.35)]'
                        : 'bg-[#141414] border-neutral-800 hover:border-neutral-700 hover:bg-[#181818]'
                    }`}
                  >
                    {/* Podium carpet simulation bar */}
                    <div
                      className={`h-1.5 w-full rounded mb-2 transition-all ${
                        isActive ? 'bg-[#D50000] shadow-[0_0_8px_#D50000]' : 'bg-neutral-800 group-hover:bg-[#D50000]/60'
                      }`}
                    />

                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1">
                      <span>P-{String(car.podiumSpot?.podiumNumber || idx + 1).padStart(2, '0')}</span>
                      <span>{car.year}</span>
                    </div>

                    <div className="font-bold text-xs text-white truncate mb-1">
                      {car.manufacturer}
                    </div>
                    <div className="text-[11px] text-neutral-300 font-medium truncate mb-2">
                      {car.model}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono border-t border-neutral-800/80 pt-1.5 text-neutral-400">
                      <span className="text-[#FF2020] font-semibold">{car.engine.horsepower} HP</span>
                      <span className="text-[#FFD600]">{car.engine.acceleration0100}s</span>
                    </div>

                    {isActive && (
                      <div className="mt-2 pt-2 border-t border-[#D50000]/30 flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenExplorer3D(car);
                          }}
                          className="w-full py-1 text-[10px] bg-[#D50000] text-white font-bold rounded uppercase tracking-wider"
                        >
                          Explore 3D
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: PODIUM HIGHLIGHTS (Curated exhibition cars matching the photo) */}
        {viewAngle === 'spotlight-grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.slice(0, 6).map((car) => {
              const isFav = favorites.includes(car.id);
              return (
                <div
                  key={car.id}
                  className="bg-[#121212] border border-neutral-800 rounded-2xl overflow-hidden hover:border-[#D50000]/60 transition-all duration-300 group flex flex-col shadow-xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-950">
                    <img
                      src={car.heroImage}
                      alt={`${car.manufacturer} ${car.model}`}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/40" />

                    {/* Spotlight podium badge */}
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-neutral-700 text-[10px] font-mono font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#D50000]" />
                      PODIUM #{car.podiumSpot?.podiumNumber || '01'}
                    </div>

                    <div className="absolute top-3 right-3 text-xs font-mono font-bold text-[#FFD600] bg-black/80 px-2.5 py-1 rounded-md border border-neutral-800">
                      {car.priceDisplay}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                      <span className="font-mono text-neutral-400">{car.category}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800/80 text-neutral-300 border border-neutral-700">
                        {car.country}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-mono uppercase tracking-widest text-[#D50000] font-bold">
                        {car.manufacturer}
                      </div>
                      <h4 className="text-xl font-bold font-heading text-white mt-0.5 mb-2">
                        {car.model}
                      </h4>
                      <p className="text-xs text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
                        {car.tagline}
                      </p>
                    </div>

                    {/* Specs strip */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-neutral-800 text-center font-mono text-xs mb-4">
                      <div>
                        <span className="text-[10px] text-neutral-500 block">HORSEPOWER</span>
                        <span className="font-bold text-white">{car.engine.horsepower} HP</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block">0-100 KM/H</span>
                        <span className="font-bold text-[#FF2020]">{car.engine.acceleration0100}s</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 block">TOP SPEED</span>
                        <span className="font-bold text-[#FFD600]">{car.engine.topSpeedKmH} km/h</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenExplorer3D(car)}
                        className="flex-1 py-2 px-3 bg-[#D50000] hover:bg-[#b00000] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        3D Inspect
                      </button>
                      <button
                        onClick={() => onSelectCar(car)}
                        className="py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg transition-all"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onToggleFavorite(car.id)}
                        className={`p-2 rounded-lg border transition-all ${
                          isFav
                            ? 'bg-[#D50000]/20 border-[#D50000] text-[#FF2020]'
                            : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
                        }`}
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current text-[#D50000]' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
