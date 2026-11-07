import React from 'react';
import { Car } from '../types/car';
import { CarCard } from './CarCard';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface FavoritesViewProps {
  cars: Car[];
  favorites: string[];
  onToggleFavorite: (carId: string) => void;
  onClearFavorites: () => void;
  onSelectCar: (car: Car) => void;
  onOpenExplorer3D: (car: Car) => void;
  onAddToCompare: (car: Car) => void;
  compareList: Car[];
  onBack: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  cars,
  favorites,
  onToggleFavorite,
  onClearFavorites,
  onSelectCar,
  onOpenExplorer3D,
  onAddToCompare,
  compareList,
  onBack,
}) => {
  const favoriteCars = cars.filter((c) => favorites.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-neutral-800 pb-6">
        <div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onBack();
            }}
            className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Showroom
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D50000]/20 border border-[#D50000]/40 flex items-center justify-center text-[#FF2020]">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading uppercase tracking-wide text-white">
                Saved Collection ({favoriteCars.length})
              </h1>
              <p className="text-xs text-neutral-400">
                Your private garage preserved directly in your browser.
              </p>
            </div>
          </div>
        </div>

        {favoriteCars.length > 0 && (
          <button
            onClick={() => {
              soundEngine.playClick();
              onClearFavorites();
            }}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-[#D50000] border border-neutral-800 rounded-xl text-xs font-mono flex items-center gap-2 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All Favorites
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {favoriteCars.length === 0 ? (
        <div className="text-center py-20 bg-[#121212] border border-neutral-800/80 rounded-2xl p-8 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center text-neutral-500 mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-heading text-white uppercase mb-2">
            Your Private Garage is Empty
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mb-6 max-w-md mx-auto leading-relaxed">
            Click the heart icon on any vehicle card or 3D inspection view to bookmark your favorite supercars for fast benchmarking.
          </p>
          <button
            onClick={() => {
              soundEngine.playClick();
              onBack();
            }}
            className="py-2.5 px-6 bg-[#D50000] hover:bg-[#b00000] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
          >
            Explore Masterpiece Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onSelect={onSelectCar}
              onOpenExplorer3D={onOpenExplorer3D}
              onToggleFavorite={onToggleFavorite}
              isFavorite={true}
              onAddToCompare={onAddToCompare}
              isCompared={compareList.some((c) => c.id === car.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
