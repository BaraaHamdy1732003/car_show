import React, { useState, useMemo } from 'react';
import { Car } from '../types/car';
import { CarCard } from './CarCard';
import { BRANDS } from '../data/brands';
import { CATEGORIES } from '../data/categories';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface CollectionViewProps {
  cars: Car[];
  onSelectCar: (car: Car) => void;
  onOpenExplorer3D: (car: Car) => void;
  onToggleFavorite: (carId: string) => void;
  favorites: string[];
  onAddToCompare: (car: Car) => void;
  compareList: Car[];
}

export const CollectionView: React.FC<CollectionViewProps> = ({
  cars,
  onSelectCar,
  onOpenExplorer3D,
  onToggleFavorite,
  favorites,
  onAddToCompare,
  compareList,
}) => {
  const [search, setSearch] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEngine, setSelectedEngine] = useState<string>('all');
  const [selectedDrivetrain, setSelectedDrivetrain] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'hp' | 'accel' | 'speed' | 'price-desc' | 'price-asc' | 'year'>('hp');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const resetFilters = () => {
    soundEngine.playClick();
    setSearch('');
    setSelectedBrand('all');
    setSelectedCategory('all');
    setSelectedEngine('all');
    setSelectedDrivetrain('all');
    setSortBy('hp');
  };

  const filteredCars = useMemo(() => {
    return cars
      .filter((c) => {
        // Search
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const match =
            c.model.toLowerCase().includes(q) ||
            c.manufacturer.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q) ||
            c.engine.configuration.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Brand
        if (selectedBrand !== 'all' && c.manufacturer.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false;
        }

        // Category
        if (selectedCategory !== 'all' && c.category !== selectedCategory) {
          return false;
        }

        // Engine
        if (selectedEngine !== 'all' && c.engine.engineType !== selectedEngine) {
          return false;
        }

        // Drivetrain
        if (selectedDrivetrain !== 'all' && c.engine.drivetrain !== selectedDrivetrain) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'hp') return b.engine.horsepower - a.engine.horsepower;
        if (sortBy === 'accel') return a.engine.acceleration0100 - b.engine.acceleration0100;
        if (sortBy === 'speed') return b.engine.topSpeedKmH - a.engine.topSpeedKmH;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'year') return b.year - a.year;
        return 0;
      });
  }, [cars, search, selectedBrand, selectedCategory, selectedEngine, selectedDrivetrain, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title & Filter Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D50000]" />
            <span className="text-xs font-mono text-[#D50000] font-bold uppercase tracking-widest">
              Showroom Catalog
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-heading uppercase text-white">
            Explore Collection ({filteredCars.length} / {cars.length})
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1 max-w-xl">
            Filter by manufacturer, powertrain architecture, drivetrain, or sort by acceleration and maximum output.
          </p>
        </div>

        {/* Search Input & Filter Toggle */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by model or engine..."
              className="w-full bg-[#121212] border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-neutral-500 focus:border-[#D50000] outline-none"
            />
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              setShowFilters(!showFilters);
            }}
            className={`p-2.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all ${
              showFilters
                ? 'bg-[#D50000] text-white border-[#D50000]'
                : 'bg-[#121212] text-neutral-300 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Advanced Filters</span>
          </button>

          {(selectedBrand !== 'all' || selectedCategory !== 'all' || selectedEngine !== 'all' || search) && (
            <button
              onClick={resetFilters}
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-all text-xs"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expandable Advanced Filters Bar */}
      {showFilters && (
        <div className="bg-[#121212] border border-neutral-800 rounded-2xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-mono animate-fadeIn">
          {/* Brand */}
          <div>
            <label className="text-neutral-400 block mb-1.5 uppercase text-[10px]">Manufacturer</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-[#181818] border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#D50000]"
            >
              <option value="all">All Manufacturers</option>
              {BRANDS.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="text-neutral-400 block mb-1.5 uppercase text-[10px]">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#181818] border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#D50000]"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Engine Type */}
          <div>
            <label className="text-neutral-400 block mb-1.5 uppercase text-[10px]">Engine Layout</label>
            <select
              value={selectedEngine}
              onChange={(e) => setSelectedEngine(e.target.value)}
              className="w-full bg-[#181818] border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#D50000]"
            >
              <option value="all">All Powertrains</option>
              {['V12', 'V8', 'V10', 'V6', 'Flat-6', 'W16', 'Hybrid', 'Electric'].map((eng) => (
                <option key={eng} value={eng}>
                  {eng}
                </option>
              ))}
            </select>
          </div>

          {/* Drivetrain */}
          <div>
            <label className="text-neutral-400 block mb-1.5 uppercase text-[10px]">Drivetrain</label>
            <select
              value={selectedDrivetrain}
              onChange={(e) => setSelectedDrivetrain(e.target.value)}
              className="w-full bg-[#181818] border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#D50000]"
            >
              <option value="all">All Drivetrains</option>
              <option value="RWD">Rear-Wheel Drive (RWD)</option>
              <option value="AWD">All-Wheel Drive (AWD)</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <label className="text-neutral-400 block mb-1.5 uppercase text-[10px]">Sort Order</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full bg-[#181818] border border-neutral-700 rounded-xl p-2.5 text-white outline-none focus:border-[#D50000]"
            >
              <option value="hp">Highest Output (HP)</option>
              <option value="accel">Fastest 0-100 km/h</option>
              <option value="speed">Highest Top Speed</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="year">Newest Model Year</option>
            </select>
          </div>
        </div>
      )}

      {/* Vehicle Grid */}
      {filteredCars.length === 0 ? (
        <div className="text-center py-20 bg-[#121212] border border-neutral-800 rounded-2xl p-8 max-w-md mx-auto">
          <p className="text-neutral-400 text-sm mb-4">
            No vehicles found matching current filter parameters.
          </p>
          <button
            onClick={resetFilters}
            className="py-2 px-4 bg-[#D50000] text-white text-xs font-bold uppercase rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
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
      )}
    </div>
  );
};
