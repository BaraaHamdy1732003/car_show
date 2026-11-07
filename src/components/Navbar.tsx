import React, { useState } from 'react';
import {
  Search,
  Heart,
  Layers,
  Volume2,
  VolumeX,
  Menu,
  X,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  favoritesCount: number;
  compareCount: number;
  onOpenSearch: () => void;
  onOpenCompare: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  favoritesCount,
  compareCount,
  onOpenSearch,
  onOpenCompare,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getMuted());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const navLinks = [
    { id: 'home', label: 'Showroom' },
    { id: 'exhibition', label: 'Exhibition Floor' },
    { id: 'collection', label: 'Explore Cars' },
    { id: 'brands', label: 'Brands' },
    { id: 'categories', label: 'Categories' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-[#080808]/90 backdrop-blur-xl border-b border-neutral-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            onClick={() => {
              soundEngine.playClick();
              onNavigate('home');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#D50000] to-[#8a0000] flex items-center justify-center shadow-[0_0_20px_rgba(213,0,0,0.4)] group-hover:shadow-[0_0_30px_rgba(213,0,0,0.7)] transition-all">
              <span className="font-heading font-black text-xl text-white tracking-wider">EA</span>
              <div className="absolute -inset-0.5 rounded-xl border border-white/20 pointer-events-none" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-xl tracking-wider uppercase text-white">
                  ELITE <span className="text-[#D50000]">AUTO</span>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFD600]" />
              </div>
              <p className="text-[9px] font-mono tracking-widest uppercase text-neutral-400">
                Luxury Car Exhibition
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    soundEngine.playClick();
                    onNavigate(link.id);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all relative ${
                    isActive
                      ? 'text-white bg-[#141414] border border-neutral-800'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#D50000] rounded-full shadow-[0_0_8px_#D50000]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-2">
            {/* Search Trigger */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenSearch();
              }}
              className="p-2.5 rounded-xl bg-[#141414] border border-neutral-800 text-neutral-300 hover:text-white hover:border-[#D50000]/50 transition-all flex items-center gap-2 text-xs"
              title="Quick Search"
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline font-mono text-[11px] text-neutral-400">
                Search <kbd className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700">⌘K</kbd>
              </span>
            </button>

            {/* Compare Drawer Button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenCompare();
              }}
              className="p-2.5 rounded-xl bg-[#141414] border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-all relative"
              title="Compare Vehicles"
            >
              <Layers className="w-4 h-4" />
              {compareCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FFD600] text-black font-mono font-bold text-[10px] flex items-center justify-center shadow-lg">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Favorites Button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onNavigate('favorites');
              }}
              className="p-2.5 rounded-xl bg-[#141414] border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition-all relative"
              title="Saved Vehicles"
            >
              <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'text-[#FF2020]' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#D50000] text-white font-mono font-bold text-[10px] flex items-center justify-center shadow-lg">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2.5 rounded-xl border transition-all ${
                !isMuted
                  ? 'bg-[#D50000]/10 border-[#D50000]/40 text-[#FF2020]'
                  : 'bg-[#141414] border-neutral-800 text-neutral-500'
              }`}
              title={isMuted ? 'Unmute showroom audio' : 'Mute audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 lg:hidden rounded-xl bg-[#141414] border border-neutral-800 text-neutral-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-800 bg-[#0d0d0d] px-6 py-6 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                soundEngine.playClick();
                onNavigate(link.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2.5 px-4 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-between ${
                currentView === link.id
                  ? 'bg-[#D50000] text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {link.label}
              <span className="text-xs font-mono opacity-50">→</span>
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};
