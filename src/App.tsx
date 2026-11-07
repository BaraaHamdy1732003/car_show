import { useState, useEffect } from 'react';
import { CARS } from './data/cars';
import { BRANDS } from './data/brands';
import { Car } from './types/car';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ExhibitionHall } from './components/ExhibitionHall';
import { CarCard } from './components/CarCard';
import { CarExplorer3D } from './components/CarExplorer3D';
import { CarDetailsModal } from './components/CarDetailsModal';
import { EngineRevModal } from './components/EngineRevModal';
import { CompareModal } from './components/CompareModal';
import { SearchModal } from './components/SearchModal';
import { FavoritesView } from './components/FavoritesView';
import { BrandsView } from './components/BrandsView';
import { CategoriesView } from './components/CategoriesView';
import { CollectionView } from './components/CollectionView';
import { Footer } from './components/Footer';
import { ArrowRight, Layers, Zap } from 'lucide-react';
import { soundEngine } from './utils/audio';

export default function App() {
  // Navigation & View state
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string | undefined>(undefined);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>(undefined);

  // Modal states
  const [activeCarFor3D, setActiveCarFor3D] = useState<Car | null>(null);
  const [activeCarForDetails, setActiveCarForDetails] = useState<Car | null>(null);
  const [activeCarForRev, setActiveCarForRev] = useState<Car | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Favorites (localStorage)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('elite_auto_favorites');
      return saved ? JSON.parse(saved) : ['ferrari-sf90-stradale', 'ferrari-testarossa', 'porsche-911-gt3-rs'];
    } catch {
      return ['ferrari-sf90-stradale', 'ferrari-testarossa'];
    }
  });

  // Comparison tray (up to 3 cars)
  const [compareList, setCompareList] = useState<Car[]>(() => {
    return [CARS[0], CARS[1]]; // Preload Ferrari SF90 and Ferrari Testarossa for comparison
  });

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('elite_auto_favorites', JSON.stringify(favorites));
    } catch {
      // Ignored
    }
  }, [favorites]);

  // Global Keyboard Shortcuts (Cmd+K for search, Esc to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        soundEngine.playClick();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        if (activeCarFor3D) setActiveCarFor3D(null);
        else if (activeCarForDetails) setActiveCarForDetails(null);
        else if (activeCarForRev) setActiveCarForRev(null);
        else if (isCompareOpen) setIsCompareOpen(false);
        else if (isSearchOpen) setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCarFor3D, activeCarForDetails, activeCarForRev, isCompareOpen, isSearchOpen]);

  // Toggle Favorite
  const handleToggleFavorite = (carId: string) => {
    soundEngine.playClick();
    setFavorites((prev) =>
      prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]
    );
  };

  const handleClearFavorites = () => {
    setFavorites([]);
  };

  // Add/Remove from Compare
  const handleAddToCompare = (car: Car) => {
    soundEngine.playClick();
    if (compareList.some((c) => c.id === car.id)) {
      setCompareList((prev) => prev.filter((c) => c.id !== car.id));
    } else {
      if (compareList.length >= 3) {
        setCompareList([compareList[1], compareList[2], car]);
      } else {
        setCompareList((prev) => [...prev, car]);
      }
      setIsCompareOpen(true);
    }
  };

  const handleRemoveFromCompare = (carId: string) => {
    setCompareList((prev) => prev.filter((c) => c.id !== carId));
  };

  // View Navigation
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSelectedBrandFilter(undefined);
    setSelectedCategoryFilter(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBrandSelect = (brandName: string) => {
    setSelectedBrandFilter(brandName);
    setCurrentView('brands');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategoryFilter(categoryName);
    setCurrentView('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Featured cars for homepage showcase
  const featuredCars = CARS.filter((c) => c.featured);

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col font-sans selection:bg-[#D50000] selection:text-white">
      {/* Sticky Luxury Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        favoritesCount={favorites.length}
        compareCount={compareList.length}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1 w-full">
        {currentView === 'home' && (
          <div className="w-full">
            {/* Cinematic Hero */}
            <HeroSection
              onExploreCollection={() => handleNavigate('collection')}
              onDiscoverBrands={() => handleNavigate('brands')}
              onEnterExhibitionHall={() => {
                const exhibitionEl = document.getElementById('exhibition-hall-section');
                if (exhibitionEl) {
                  exhibitionEl.scrollIntoView({ behavior: 'smooth' });
                } else {
                  handleNavigate('exhibition');
                }
              }}
              onOpenExplorer3D={(car) => setActiveCarFor3D(car)}
              featuredCar={CARS[0]}
            />

            {/* The Exhibition Hall Pavilion Floor (Inspired directly by user photo!) */}
            <div id="exhibition-hall-section">
              <ExhibitionHall
                cars={CARS}
                onSelectCar={(car) => setActiveCarForDetails(car)}
                onOpenExplorer3D={(car) => setActiveCarFor3D(car)}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
                onOpenRevModal={(car) => setActiveCarForRev(car)}
              />
            </div>

            {/* Featured Showcase Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-neutral-900">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D50000]" />
                    <span className="text-xs font-mono text-[#D50000] font-bold uppercase tracking-widest">
                      Curated Masterpieces
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black font-heading uppercase text-white">
                    Featured <span className="text-[#D50000]">Exhibition Icons</span>
                  </h2>
                  <p className="text-neutral-400 text-xs sm:text-sm mt-1 max-w-xl">
                    Handpicked automotive icons renowned for benchmark lap times, engineering breakthroughs, and motorsport lineage.
                  </p>
                </div>

                <button
                  onClick={() => handleNavigate('collection')}
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 hover:text-[#D50000] transition-colors"
                >
                  <span>View All 32 Vehicles</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of Featured Vehicles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCars.slice(0, 6).map((car) => (
                  <CarCard
                    key={car.id}
                    car={car}
                    onSelect={(selected) => setActiveCarForDetails(selected)}
                    onOpenExplorer3D={(selected) => setActiveCarFor3D(selected)}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={favorites.includes(car.id)}
                    onAddToCompare={handleAddToCompare}
                    isCompared={compareList.some((c) => c.id === car.id)}
                  />
                ))}
              </div>
            </section>

            {/* Quick Marque Highlight Bar */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-neutral-900">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-[10px] font-mono text-[#D50000] uppercase font-bold tracking-widest block mb-1">
                    World-Class Marque Heritage
                  </span>
                  <h3 className="text-2xl font-bold font-heading uppercase text-white">
                    Featured Manufacturers
                  </h3>
                </div>
                <button
                  onClick={() => handleNavigate('brands')}
                  className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1"
                >
                  All 20 Brands →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {BRANDS.slice(0, 6).map((brand) => (
                  <div
                    key={brand.id}
                    onClick={() => handleBrandSelect(brand.name)}
                    className="bg-[#121212] hover:bg-[#181818] border border-neutral-800/80 hover:border-[#D50000]/60 p-4 rounded-xl cursor-pointer transition-all text-center group"
                  >
                    <div className="text-2xl mb-1">{brand.flag}</div>
                    <div className="font-heading font-bold text-sm text-white group-hover:text-[#D50000] transition-colors">
                      {brand.name}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500">
                      Est. {brand.founded}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Categories Bar */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="bg-gradient-to-r from-[#141010] via-[#121212] to-[#141010] border border-neutral-800 rounded-2xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D50000]/20 border border-[#D50000]/40 text-[#FF2020] text-xs font-mono font-bold uppercase mb-4">
                    <Zap className="w-3.5 h-3.5" />
                    Interactive Benchmarking
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black font-heading uppercase text-white mb-2">
                    Multi-Vehicle Comparison Tool
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    Compare up to three machines side-by-side. Analyze horsepower, torque dyno figures, 0–100 km/h acceleration, terminal velocity, and power-to-weight metrics with instant winner highlights.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setIsCompareOpen(true);
                    }}
                    className="py-3.5 px-6 bg-[#D50000] hover:bg-[#b00000] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(213,0,0,0.4)] flex items-center gap-2"
                  >
                    <Layers className="w-4 h-4" />
                    Open Comparison Matrix
                  </button>
                  <button
                    onClick={() => handleCategorySelect('Supercars')}
                    className="py-3.5 px-6 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Browse Supercars & Categories
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Dedicated Exhibition Floor View */}
        {currentView === 'exhibition' && (
          <div className="py-6">
            <ExhibitionHall
              cars={CARS}
              onSelectCar={(car) => setActiveCarForDetails(car)}
              onOpenExplorer3D={(car) => setActiveCarFor3D(car)}
              onToggleFavorite={handleToggleFavorite}
              favorites={favorites}
              onOpenRevModal={(car) => setActiveCarForRev(car)}
            />
          </div>
        )}

        {/* All Cars Collection View */}
        {currentView === 'collection' && (
          <CollectionView
            cars={CARS}
            onSelectCar={(car) => setActiveCarForDetails(car)}
            onOpenExplorer3D={(car) => setActiveCarFor3D(car)}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
            onAddToCompare={handleAddToCompare}
            compareList={compareList}
          />
        )}

        {/* Brands View */}
        {currentView === 'brands' && (
          <BrandsView
            cars={CARS}
            selectedBrandFilter={selectedBrandFilter}
            onSelectCar={(car) => setActiveCarForDetails(car)}
            onOpenExplorer3D={(car) => setActiveCarFor3D(car)}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
            onAddToCompare={handleAddToCompare}
            compareList={compareList}
            onBack={() => handleNavigate('home')}
          />
        )}

        {/* Categories View */}
        {currentView === 'categories' && (
          <CategoriesView
            cars={CARS}
            selectedCategoryFilter={selectedCategoryFilter}
            onSelectCar={(car) => setActiveCarForDetails(car)}
            onOpenExplorer3D={(car) => setActiveCarFor3D(car)}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
            onAddToCompare={handleAddToCompare}
            compareList={compareList}
            onBack={() => handleNavigate('home')}
          />
        )}

        {/* Favorites View */}
        {currentView === 'favorites' && (
          <FavoritesView
            cars={CARS}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onClearFavorites={handleClearFavorites}
            onSelectCar={(car) => setActiveCarForDetails(car)}
            onOpenExplorer3D={(car) => setActiveCarFor3D(car)}
            onAddToCompare={handleAddToCompare}
            compareList={compareList}
            onBack={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Global Interactive 3D Car Explorer Modal */}
      {activeCarFor3D && (
        <CarExplorer3D
          car={activeCarFor3D}
          onClose={() => setActiveCarFor3D(null)}
          onOpenDetails={(car) => {
            setActiveCarFor3D(null);
            setActiveCarForDetails(car);
          }}
          onOpenRevModal={(car) => setActiveCarForRev(car)}
        />
      )}

      {/* Global Vehicle Details Dossier Modal */}
      {activeCarForDetails && (
        <CarDetailsModal
          car={activeCarForDetails}
          onClose={() => setActiveCarForDetails(null)}
          onOpenExplorer3D={(car) => {
            setActiveCarForDetails(null);
            setActiveCarFor3D(car);
          }}
          onOpenRevModal={(car) => setActiveCarForRev(car)}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={favorites.includes(activeCarForDetails.id)}
          onAddToCompare={handleAddToCompare}
        />
      )}

      {/* Global Engine Rev Sound Simulator Modal */}
      {activeCarForRev && (
        <EngineRevModal
          car={activeCarForRev}
          onClose={() => setActiveCarForRev(null)}
        />
      )}

      {/* Global Compare Matrix Modal */}
      {isCompareOpen && (
        <CompareModal
          allCars={CARS}
          compareList={compareList}
          onRemoveFromCompare={handleRemoveFromCompare}
          onAddCar={(car) => {
            if (compareList.length < 3) {
              setCompareList((prev) => [...prev, car]);
            }
          }}
          onClose={() => setIsCompareOpen(false)}
          onOpenExplorer3D={(car) => {
            setIsCompareOpen(false);
            setActiveCarFor3D(car);
          }}
        />
      )}

      {/* Global Instant Search Modal */}
      {isSearchOpen && (
        <SearchModal
          cars={CARS}
          onClose={() => setIsSearchOpen(false)}
          onSelectCar={(car) => {
            setIsSearchOpen(false);
            setActiveCarForDetails(car);
          }}
          onOpenExplorer3D={(car) => {
            setIsSearchOpen(false);
            setActiveCarFor3D(car);
          }}
        />
      )}

      {/* Footer */}
      <Footer
        onSelectBrand={handleBrandSelect}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

