import React from 'react';
import { Car } from '../types/car';
import { Heart, Layers, Maximize2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface CarCardProps {
  car: Car;
  onSelect: (car: Car) => void;
  onOpenExplorer3D: (car: Car) => void;
  onToggleFavorite: (carId: string) => void;
  isFavorite: boolean;
  onAddToCompare: (car: Car) => void;
  isCompared?: boolean;
}

export const CarCard: React.FC<CarCardProps> = ({
  car,
  onSelect,
  onOpenExplorer3D,
  onToggleFavorite,
  isFavorite,
  onAddToCompare,
  isCompared,
}) => {
  return (
    <div className="group relative bg-[#121212] rounded-2xl overflow-hidden border border-neutral-800/80 hover:border-[#D50000]/70 transition-all duration-500 shadow-xl flex flex-col justify-between hover:shadow-[0_10px_35px_rgba(213,0,0,0.15)] hover:-translate-y-1">
      {/* Top Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden bg-black cursor-pointer" onClick={() => onSelect(car)}>
        <img
          src={car.heroImage}
          alt={`${car.manufacturer} ${car.model}`}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/50" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D50000] text-white">
            {car.category}
          </span>
          <span className="text-[10px] font-mono text-neutral-300 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-neutral-700">
            {car.year}
          </span>
        </div>

        {/* Favorite & Compare Action Buttons on Image */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playClick();
              onAddToCompare(car);
            }}
            className={`p-1.5 rounded-lg backdrop-blur-md border transition-all ${
              isCompared
                ? 'bg-[#FFD600]/20 border-[#FFD600] text-[#FFD600]'
                : 'bg-black/60 border-neutral-700 text-neutral-300 hover:text-white'
            }`}
            title="Add to comparison"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playClick();
              onToggleFavorite(car.id);
            }}
            className={`p-1.5 rounded-lg backdrop-blur-md border transition-all ${
              isFavorite
                ? 'bg-[#D50000]/20 border-[#D50000] text-[#FF2020]'
                : 'bg-black/60 border-neutral-700 text-neutral-300 hover:text-white'
            }`}
            title="Save to favorites"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Price Tag in Bottom Right */}
        <div className="absolute bottom-3 right-3 text-xs font-mono font-bold text-[#FFD600] bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-neutral-800">
          {car.priceDisplay}
        </div>

        {/* Origin Pill in Bottom Left */}
        <div className="absolute bottom-3 left-3 text-[11px] font-mono text-neutral-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#D50000]" />
          {car.country}
        </div>
      </div>

      {/* Card Content & Specifications */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#D50000] font-bold">
            {car.manufacturer}
          </div>
          <h3
            onClick={() => onSelect(car)}
            className="text-xl font-bold font-heading text-white mt-0.5 hover:text-[#D50000] cursor-pointer transition-colors"
          >
            {car.model}
          </h3>
          <p className="text-xs text-neutral-400 line-clamp-2 mt-1.5 leading-relaxed">
            {car.tagline}
          </p>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-3 gap-2 my-4 py-3 border-y border-neutral-800/80 text-center font-mono text-xs">
          <div>
            <span className="text-[10px] text-neutral-500 block uppercase">Power</span>
            <span className="font-bold text-white">{car.engine.horsepower} HP</span>
          </div>
          <div className="border-x border-neutral-800/80">
            <span className="text-[10px] text-neutral-500 block uppercase">0-100</span>
            <span className="font-bold text-[#FF2020]">{car.engine.acceleration0100}s</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 block uppercase">Top Speed</span>
            <span className="font-bold text-[#FFD600]">{car.engine.topSpeedKmH} km/h</span>
          </div>
        </div>

        {/* Bottom CTA Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenExplorer3D(car);
            }}
            className="flex-1 py-2 px-3 bg-[#D50000] hover:bg-[#b00000] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(213,0,0,0.3)]"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            3D Explorer
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onSelect(car);
            }}
            className="py-2 px-3.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-xl transition-all border border-neutral-700"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};
