import React, { useState } from 'react';
import { CATEGORIES } from '../data/categories';
import { Car } from '../types/car';
import { CarCard } from './CarCard';
import { ArrowLeft, ChevronRight, Zap, Flame, Gauge, Crown, Compass, BatteryCharging, Volume2, Sparkles, Trophy, Mountain, Navigation, Cpu } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface CategoriesViewProps {
  cars: Car[];
  selectedCategoryFilter?: string;
  onSelectCar: (car: Car) => void;
  onOpenExplorer3D: (car: Car) => void;
  onToggleFavorite: (carId: string) => void;
  favorites: string[];
  onAddToCompare: (car: Car) => void;
  compareList: Car[];
  onBack: () => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Flame': return <Flame className="w-5 h-5 text-[#D50000]" />;
    case 'Zap': return <Zap className="w-5 h-5 text-[#FFD600]" />;
    case 'Gauge': return <Gauge className="w-5 h-5 text-[#FF6D00]" />;
    case 'Crown': return <Crown className="w-5 h-5 text-indigo-400" />;
    case 'Compass': return <Compass className="w-5 h-5 text-emerald-400" />;
    case 'BatteryCharging': return <BatteryCharging className="w-5 h-5 text-cyan-400" />;
    case 'Volume2': return <Volume2 className="w-5 h-5 text-red-400" />;
    case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-400" />;
    case 'Trophy': return <Trophy className="w-5 h-5 text-yellow-500" />;
    case 'Mountain': return <Mountain className="w-5 h-5 text-teal-400" />;
    case 'Navigation': return <Navigation className="w-5 h-5 text-blue-400" />;
    default: return <Cpu className="w-5 h-5 text-purple-400" />;
  }
};

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  cars,
  selectedCategoryFilter,
  onSelectCar,
  onOpenExplorer3D,
  onToggleFavorite,
  favorites,
  onAddToCompare,
  compareList,
  onBack,
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(
    selectedCategoryFilter || null
  );

  const categoryCars = activeCategory
    ? cars.filter((c) => c.category === activeCategory)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-neutral-800 pb-6">
        <div>
          <button
            onClick={() => {
              soundEngine.playClick();
              if (activeCategory) {
                setActiveCategory(null);
              } else {
                onBack();
              }
            }}
            className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {activeCategory ? 'Back to All Categories' : 'Back to Showroom'}
          </button>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D50000]" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading uppercase tracking-wide text-white">
                {activeCategory ? `${activeCategory} Collection` : 'Automotive Classifications'}
              </h1>
              <p className="text-xs text-neutral-400">
                Explore 12 distinct automotive disciplines from high-downforce GT track weapons to bespoke luxury saloons.
              </p>
            </div>
          </div>
        </div>
      </div>

      {activeCategory ? (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-base font-bold font-heading uppercase tracking-wider text-white">
              Vehicles in {activeCategory} ({categoryCars.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryCars.map((car) => (
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const count = cars.filter((c) => c.category === cat.name).length;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveCategory(cat.name);
                }}
                className="bg-[#121212] hover:bg-[#181818] border border-neutral-800/80 hover:border-[#D50000]/60 p-6 rounded-2xl cursor-pointer transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 group-hover:border-[#D50000]/40 transition-colors">
                      {getCategoryIcon(cat.iconName)}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {count} {count === 1 ? 'Model' : 'Models'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold font-heading text-white group-hover:text-[#D50000] transition-colors mb-2">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono text-neutral-400 group-hover:text-white transition-colors">
                  <span>View Vehicles</span>
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
