import React from 'react';
import { BRANDS } from '../data/brands';
import { soundEngine } from '../utils/audio';

interface FooterProps {
  onSelectBrand: (brandName: string) => void;
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectBrand, onNavigate }) => {
  return (
    <footer className="w-full bg-[#050505] border-t border-neutral-900 text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Branding Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-neutral-900">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D50000] to-[#8a0000] flex items-center justify-center font-heading font-black text-xl text-white shadow-lg">
                EA
              </div>
              <span className="font-heading font-black text-2xl tracking-wider uppercase text-white">
                ELITE <span className="text-[#D50000]">AUTO</span>
              </span>
            </div>

            <p className="text-neutral-400 text-sm leading-relaxed max-w-md mb-6">
              ELITE AUTO — Explore the Art of Automotive Engineering. An interactive international exhibition featuring the world’s most iconic hypercars, supercars, and classic racing machines.
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Showroom Stage Operational • 32 Masterpieces Active</span>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D50000] font-bold mb-4">
              Showroom Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              {[
                { label: 'The Exhibition Floor (Pavilion)', view: 'exhibition' },
                { label: 'Complete Vehicle Collection', view: 'collection' },
                { label: 'Manufacturer Directory', view: 'brands' },
                { label: 'Category Explorer', view: 'categories' },
                { label: 'Saved Favorites', view: 'favorites' },
              ].map((item) => (
                <li key={item.view}>
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      onNavigate(item.view);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D50000] font-bold mb-4">
              Exhibition Heritage
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Inspired by international automotive galas at Villa d’Este, Goodwood Festival of Speed, and Pebble Beach Concours d’Elegance.
            </p>
            <div className="bg-[#0f0f0f] p-4 rounded-xl border border-neutral-800 text-xs font-mono text-neutral-400">
              <div className="text-white font-bold mb-1">“Red is the Passion”</div>
              <div>Dedicated to automotive craftsmanship, high-revving acoustics, and aerodynamic brilliance.</div>
            </div>
          </div>
        </div>

        {/* 20 Brand Directory Pills */}
        <div className="py-10 border-b border-neutral-900">
          <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-500 font-bold mb-4">
            Manufacturer Directory ({BRANDS.length} Iconic Marques)
          </h4>
          <div className="flex flex-wrap gap-2">
            {BRANDS.map((brand) => (
              <button
                key={brand.id}
                onClick={() => {
                  soundEngine.playClick();
                  onSelectBrand(brand.name);
                }}
                className="px-3 py-1 bg-[#101010] hover:bg-[#181818] border border-neutral-800 hover:border-[#D50000]/50 rounded-lg text-xs font-mono text-neutral-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <span>{brand.flag}</span>
                <span>{brand.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Legal & Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <div>
            © {new Date().getFullYear()} ELITE AUTO SHOWROOM. All vehicle specifications and trademarks belong to their respective manufacturers.
          </div>
          <div className="flex items-center gap-4">
            <span>Dark Cinematic Experience</span>
            <span>•</span>
            <span>360° Real-Time 3D</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
