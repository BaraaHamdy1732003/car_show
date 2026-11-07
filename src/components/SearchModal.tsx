import React, { useState } from 'react';
import { Car } from '../types/car';
import { Search, X, Maximize2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface SearchModalProps {
  cars: Car[];
  onClose: () => void;
  onSelectCar: (car: Car) => void;
  onOpenExplorer3D: (car: Car) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  cars,
  onClose,
  onSelectCar,
  onOpenExplorer3D,
}) => {
  const [query, setQuery] = useState<string>('');

  const filtered = cars.filter((c) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      c.model.toLowerCase().includes(q) ||
      c.manufacturer.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.engine.configuration.toLowerCase().includes(q) ||
      c.engine.engineType.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div className="relative w-full max-w-3xl bg-[#121212] border border-neutral-800 rounded-2xl shadow-2xl text-white overflow-hidden animate-fadeIn">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center gap-4 bg-[#161616]">
          <Search className="w-6 h-6 text-[#D50000]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by model, brand (e.g. Ferrari, Porsche), V12, Hybrid..."
            autoFocus
            className="w-full bg-transparent text-base sm:text-lg text-white placeholder-neutral-500 outline-none font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-neutral-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 bg-neutral-800 text-neutral-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Tag Chips */}
        <div className="px-6 py-3 bg-[#0f0f0f] border-b border-neutral-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-mono">
          <span className="text-neutral-500">Quick Filters:</span>
          {['Ferrari', 'Porsche', 'Lamborghini', 'V12', 'Hypercars', 'Electric'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                soundEngine.playClick();
                setQuery(tag);
              }}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-[#D50000]/20 hover:text-[#FF2020] text-neutral-300 rounded-lg transition-all"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 font-mono text-sm">
              No vehicles found matching "{query}". Try another search term.
            </div>
          ) : (
            filtered.map((car) => (
              <div
                key={car.id}
                className="bg-[#181818] hover:bg-[#1f1f1f] border border-neutral-800/80 hover:border-[#D50000]/50 p-3 sm:p-4 rounded-xl flex items-center justify-between gap-4 transition-all group"
              >
                <div
                  className="flex items-center gap-4 cursor-pointer flex-1"
                  onClick={() => {
                    soundEngine.playClick();
                    onSelectCar(car);
                    onClose();
                  }}
                >
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-black shrink-0 border border-neutral-800">
                    <img
                      src={car.heroImage}
                      alt={car.model}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#D50000] font-bold uppercase">
                        {car.manufacturer}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        • {car.year} • {car.category}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white font-heading">
                      {car.model}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 font-mono text-xs">
                  <span className="hidden sm:inline text-neutral-400">
                    {car.engine.horsepower} HP
                  </span>
                  <span className="text-[#FFD600] font-bold">{car.priceDisplay}</span>

                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      onOpenExplorer3D(car);
                      onClose();
                    }}
                    className="p-2 bg-[#D50000] hover:bg-[#b00000] text-white rounded-lg transition-all"
                    title="Launch 3D Explorer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
