import React, { useState } from 'react';
import { Car } from '../types/car';
import {
  X,
  Zap,
  Maximize2,
  Volume2,
  Heart,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface CarDetailsModalProps {
  car: Car;
  onClose: () => void;
  onOpenExplorer3D: (car: Car) => void;
  onOpenRevModal: (car: Car) => void;
  onToggleFavorite: (carId: string) => void;
  isFavorite: boolean;
  onAddToCompare: (car: Car) => void;
}

export const CarDetailsModal: React.FC<CarDetailsModalProps> = ({
  car,
  onClose,
  onOpenExplorer3D,
  onOpenRevModal,
  onToggleFavorite,
  isFavorite,
  onAddToCompare,
}) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'gallery' | 'equipment' | 'dimensions'>('specs');
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const tabs = [
    { id: 'specs', label: 'Technical Dossier' },
    { id: 'gallery', label: 'High-Res Gallery' },
    { id: 'dimensions', label: 'Chassis & Dimensions' },
    { id: 'equipment', label: 'Design & Equipment' },
  ];

  const handleShare = () => {
    soundEngine.playClick();
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const nextImage = () => {
    soundEngine.playClick();
    setSelectedGalleryIdx((prev) => (prev + 1) % car.gallery.length);
  };

  const prevImage = () => {
    soundEngine.playClick();
    setSelectedGalleryIdx((prev) => (prev - 1 + car.gallery.length) % car.gallery.length);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#111111] border border-neutral-800 rounded-2xl shadow-2xl text-white my-auto overflow-hidden">
        {/* Hero Banner Header with Vehicle Imagery */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-black">
          <img
            src={car.heroImage}
            alt={`${car.manufacturer} ${car.model}`}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-black/60" />

          {/* Close & Floating Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
            <button
              onClick={handleShare}
              className="p-2 bg-black/70 hover:bg-neutral-800 backdrop-blur-md text-neutral-300 rounded-lg border border-neutral-700 transition-all"
              title="Share Vehicle"
            >
              {copiedLink ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onToggleFavorite(car.id)}
              className={`p-2 bg-black/70 backdrop-blur-md rounded-lg border transition-all ${
                isFavorite
                  ? 'border-[#D50000] text-[#FF2020]'
                  : 'border-neutral-700 text-neutral-300 hover:text-white'
              }`}
              title="Add to Favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-black/70 hover:bg-[#D50000] backdrop-blur-md text-neutral-300 hover:text-white rounded-lg border border-neutral-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Floating Vehicle Title & Badge */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 z-20">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D50000] text-white">
                  {car.category}
                </span>
                <span className="text-xs text-neutral-300 font-mono">
                  {car.country} • {car.year}
                </span>
                {car.podiumSpot && (
                  <span className="text-[10px] font-mono text-[#FFD600] bg-black/80 px-2 py-0.5 rounded border border-[#FFD600]/40">
                    EXHIBITION PODIUM #{car.podiumSpot.podiumNumber}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading tracking-wide uppercase text-white">
                <span className="text-neutral-400 font-medium">{car.manufacturer}</span> {car.model}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl mt-1">
                {car.tagline}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  onClose();
                  onOpenExplorer3D(car);
                }}
                className="py-2.5 px-4 bg-[#D50000] hover:bg-[#b00000] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(213,0,0,0.5)]"
              >
                <Maximize2 className="w-4 h-4" />
                Launch 3D Explorer
              </button>

              <button
                onClick={() => onOpenRevModal(car)}
                className="py-2.5 px-3 bg-neutral-900/90 hover:bg-neutral-800 text-[#FFD600] border border-neutral-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" />
                Rev Sound
              </button>

              <button
                onClick={() => onAddToCompare(car)}
                className="py-2.5 px-3 bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-bold rounded-xl transition-all"
              >
                Compare
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-neutral-800 px-6 bg-[#0e0e0e] overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
                  isActive
                    ? 'border-[#D50000] text-[#FF2020]'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
          {/* TAB 1: TECHNICAL DOSSIER */}
          {activeTab === 'specs' && (
            <div className="space-y-8">
              {/* Highlight KPI Telemetry Dashboard */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[#161616] p-4 rounded-xl border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                    Horsepower
                  </span>
                  <div className="text-2xl sm:text-3xl font-black font-heading text-[#FF2020]">
                    {car.engine.horsepower} <span className="text-xs font-mono font-normal">HP</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#D50000] h-full rounded-full"
                      style={{ width: `${Math.min(100, (car.engine.horsepower / 1800) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="bg-[#161616] p-4 rounded-xl border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                    0-100 km/h Sprint
                  </span>
                  <div className="text-2xl sm:text-3xl font-black font-heading text-white">
                    {car.engine.acceleration0100} <span className="text-xs font-mono font-normal">SEC</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full"
                      style={{ width: `${Math.max(10, 100 - (car.engine.acceleration0100 / 6) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="bg-[#161616] p-4 rounded-xl border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                    Maximum Speed
                  </span>
                  <div className="text-2xl sm:text-3xl font-black font-heading text-[#FFD600]">
                    {car.engine.topSpeedKmH} <span className="text-xs font-mono font-normal">KM/H</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-[#FFD600] h-full rounded-full"
                      style={{ width: `${Math.min(100, (car.engine.topSpeedKmH / 490) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="bg-[#161616] p-4 rounded-xl border border-neutral-800">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block mb-1">
                    Starting Value
                  </span>
                  <div className="text-xl sm:text-2xl font-black font-heading text-white">
                    {car.priceDisplay}
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono block mt-1">
                    MSRP Factory Spec
                  </span>
                </div>
              </div>

              {/* Full Powertrain Specs Table */}
              <div>
                <h3 className="text-base font-bold font-heading uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#D50000]" />
                  Engine & Powertrain Architecture
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-[#151515] p-3 rounded-xl border border-neutral-800 flex justify-between">
                    <span className="text-neutral-400">Configuration</span>
                    <span className="text-white font-bold">{car.engine.configuration}</span>
                  </div>
                  <div className="bg-[#151515] p-3 rounded-xl border border-neutral-800 flex justify-between">
                    <span className="text-neutral-400">Displacement</span>
                    <span className="text-white font-bold">{car.engine.displacement}</span>
                  </div>
                  <div className="bg-[#151515] p-3 rounded-xl border border-neutral-800 flex justify-between">
                    <span className="text-neutral-400">Torque</span>
                    <span className="text-white font-bold">{car.engine.torque}</span>
                  </div>
                  <div className="bg-[#151515] p-3 rounded-xl border border-neutral-800 flex justify-between">
                    <span className="text-neutral-400">Transmission</span>
                    <span className="text-white font-bold">{car.engine.transmission}</span>
                  </div>
                  <div className="bg-[#151515] p-3 rounded-xl border border-neutral-800 flex justify-between">
                    <span className="text-neutral-400">Drivetrain</span>
                    <span className="text-white font-bold">{car.engine.drivetrain}</span>
                  </div>
                  <div className="bg-[#151515] p-3 rounded-xl border border-neutral-800 flex justify-between">
                    <span className="text-neutral-400">Efficiency</span>
                    <span className="text-white font-bold">{car.engine.fuelConsumption}</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Description */}
              <div className="bg-[#141414] p-5 rounded-xl border border-neutral-800">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#D50000] font-bold mb-2">
                  Curator Note & Engineering Background
                </h3>
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
                  {car.description}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: GALLERY VIEWER */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              {/* Active Large Image Display */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black border border-neutral-800 group">
                <img
                  src={car.gallery[selectedGalleryIdx] || car.heroImage}
                  alt={`${car.model} Gallery View ${selectedGalleryIdx + 1}`}
                  className="w-full h-full object-cover object-center"
                />

                {/* Left / Right Navigation */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-[#D50000] text-white backdrop-blur-md transition-all border border-neutral-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-[#D50000] text-white backdrop-blur-md transition-all border border-neutral-700"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute bottom-3 left-4 bg-black/80 px-3 py-1 rounded-md text-xs font-mono border border-neutral-800">
                  Angle {selectedGalleryIdx + 1} / {car.gallery.length}
                </div>
              </div>

              {/* Thumbnails Strip */}
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                {car.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedGalleryIdx(idx);
                    }}
                    className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                      selectedGalleryIdx === idx
                        ? 'border-[#D50000] scale-102 shadow-lg'
                        : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CHASSIS & DIMENSIONS */}
          {activeTab === 'dimensions' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="bg-[#151515] p-4 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block mb-1">OVERALL LENGTH</span>
                  <span className="text-base font-bold text-white">{car.dimensions.length}</span>
                </div>
                <div className="bg-[#151515] p-4 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block mb-1">OVERALL WIDTH</span>
                  <span className="text-base font-bold text-white">{car.dimensions.width}</span>
                </div>
                <div className="bg-[#151515] p-4 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block mb-1">OVERALL HEIGHT</span>
                  <span className="text-base font-bold text-white">{car.dimensions.height}</span>
                </div>
                <div className="bg-[#151515] p-4 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block mb-1">WHEELBASE</span>
                  <span className="text-base font-bold text-white">{car.dimensions.wheelbase}</span>
                </div>
                <div className="bg-[#151515] p-4 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block mb-1">CURB WEIGHT</span>
                  <span className="text-base font-bold text-[#FF2020]">{car.dimensions.weightKg} kg</span>
                </div>
                <div className="bg-[#151515] p-4 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block mb-1">LUGGAGE CAPACITY</span>
                  <span className="text-base font-bold text-white">{car.dimensions.cargoCapacity}</span>
                </div>
              </div>

              {/* Power-to-weight calculation */}
              <div className="bg-[#181212] p-5 rounded-xl border border-[#D50000]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-[#D50000] font-bold uppercase">
                    Calculated Power-To-Weight Ratio
                  </span>
                  <div className="text-2xl sm:text-3xl font-black font-heading text-white mt-1">
                    {(car.engine.horsepower / (car.dimensions.weightKg / 1000)).toFixed(1)} HP / Tonne
                  </div>
                </div>
                <div className="text-xs text-neutral-400 max-w-sm sm:text-right">
                  High power-to-weight metrics translate to immediate corner exit velocity and reduced tire heat stress.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DESIGN & EQUIPMENT */}
          {activeTab === 'equipment' && (
            <div className="space-y-6">
              {/* Exterior Colors */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">
                  Manufacturer Paint Catalog
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {car.equipment.exteriorColors.map((color) => (
                    <div
                      key={color.hex}
                      className="bg-[#151515] p-3 rounded-xl border border-neutral-800 flex items-center gap-3"
                    >
                      <span
                        className="w-6 h-6 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold text-white truncate">{color.name}</div>
                        <div className="text-[10px] font-mono text-neutral-500">{color.finish}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interior Materials */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">
                  Interior Materials & Craftsmanship
                </h4>
                <div className="flex flex-wrap gap-2">
                  {car.equipment.interiorMaterials.map((mat, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-[#161616] border border-neutral-800 text-xs font-mono text-neutral-300 rounded-lg"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lighting & Infotainment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-[#151515] p-4 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block mb-1">LIGHTING TECHNOLOGY</span>
                  <span className="text-white font-medium">{car.equipment.lightingTechnology}</span>
                </div>
                <div className="bg-[#151515] p-4 rounded-xl border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 block mb-1">INFOTAINMENT & TELEMETRY</span>
                  <span className="text-white font-medium">{car.equipment.infotainmentSystem}</span>
                </div>
              </div>

              {/* Safety & Assistance Systems */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-3">
                  Chassis Dynamics & Safety Systems
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  {car.equipment.safetyFeatures.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-neutral-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D50000]" />
                      {feat}
                    </div>
                  ))}
                  {car.equipment.driverAssistanceSystems.map((assist, i) => (
                    <div key={i} className="flex items-center gap-2 text-neutral-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD600]" />
                      {assist}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
