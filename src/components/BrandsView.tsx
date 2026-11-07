import React, { useState } from 'react';
import { BRANDS } from '../data/brands';
import { Car } from '../types/car';
import { CarCard } from './CarCard';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface BrandsViewProps {
  cars: Car[];
  selectedBrandFilter?: string;
  onSelectCar: (car: Car) => void;
  onOpenExplorer3D: (car: Car) => void;
  onToggleFavorite: (carId: string) => void;
  favorites: string[];
  onAddToCompare: (car: Car) => void;
  compareList: Car[];
  onBack: () => void;
}

export const BrandsView: React.FC<BrandsViewProps> = ({
  cars,
  selectedBrandFilter,
  onSelectCar,
  onOpenExplorer3D,
  onToggleFavorite,
  favorites,
  onAddToCompare,
  compareList,
  onBack,
}) => {
  const [activeBrandName, setActiveBrandName] = useState<string | null>(
    selectedBrandFilter || null
  );

  const activeBrand = BRANDS.find(
    (b) => b.name.toLowerCase() === (activeBrandName || '').toLowerCase()
  );

  const brandCars = activeBrandName
    ? cars.filter(
        (c) => c.manufacturer.toLowerCase() === activeBrandName.toLowerCase()
      )
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-neutral-800 pb-6">
        <div>
          <button
            onClick={() => {
              soundEngine.playClick();
              if (activeBrandName) {
                setActiveBrandName(null);
              } else {
                onBack();
              }
            }}
            className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {activeBrandName ? 'Back to All Manufacturers' : 'Back to Showroom'}
          </button>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D50000]" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading uppercase tracking-wide text-white">
                {activeBrand ? activeBrand.name : 'World-Class Manufacturers'}
              </h1>
              <p className="text-xs text-neutral-400">
                {activeBrand
                  ? `${activeBrand.headquarters} • Founded ${activeBrand.founded}`
                  : 'Explore 20 iconic automotive marques and their high-performance road legends.'}
              </p>
            </div>
          </div>
        </div>

        {activeBrand && (
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-2xl">{activeBrand.flag}</span>
            <span className="text-neutral-400">{activeBrand.country}</span>
          </div>
        )}
      </div>

      {/* Brand Specific Cars or Brand Directory Grid */}
      {activeBrandName && activeBrand ? (
        <div>
          {/* Brand Manifesto Card */}
          <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden">
            <div
              className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-20"
              style={{ backgroundColor: activeBrand.accentColor }}
            />
            <div className="max-w-2xl relative z-10">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D50000] font-bold block mb-1">
                Marque Heritage
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-white mb-2">
                The Legacy of {activeBrand.name}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                {activeBrand.description}
              </p>
              <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
                <span>Headquarters: <strong className="text-white">{activeBrand.headquarters}</strong></span>
                <span>•</span>
                <span>Founded: <strong className="text-white">{activeBrand.founded}</strong></span>
              </div>
            </div>
          </div>

          {/* Cars by this brand */}
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-base font-bold font-heading uppercase tracking-wider text-white">
              Vehicles on Display ({brandCars.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onSelect={onSelectCar}
                onOpenExplorer3D={onOpenExplorer3D}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favorites.includes(car.id)}
                onAddToCompare={onAddToCompare}
                isCompared={compareList.some((c) => c.id === car.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Grid of all 20 brands */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BRANDS.map((brand) => {
            const count = cars.filter(
              (c) => c.manufacturer.toLowerCase() === brand.name.toLowerCase()
            ).length;
            return (
              <div
                key={brand.id}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveBrandName(brand.name);
                }}
                className="bg-[#121212] hover:bg-[#181818] border border-neutral-800/80 hover:border-[#D50000]/60 p-5 rounded-2xl cursor-pointer transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{brand.flag}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {count} {count === 1 ? 'Car' : 'Cars'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-heading text-white group-hover:text-[#D50000] transition-colors">
                    {brand.name}
                  </h3>
                  <div className="text-[11px] font-mono text-neutral-500 mb-2">
                    Est. {brand.founded} • {brand.country}
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {brand.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono text-neutral-400 group-hover:text-white transition-colors">
                  <span>Explore Marque</span>
                  <ChevronRight className="w-4 h-4 text-[#D50000] transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
