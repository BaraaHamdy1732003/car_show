import React, { useEffect, useState } from 'react';
import { Car } from '../types/car';
import { X, Volume2, Gauge, Zap } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface EngineRevModalProps {
  car: Car;
  onClose: () => void;
}

export const EngineRevModal: React.FC<EngineRevModalProps> = ({ car, onClose }) => {
  const [rpm, setRpm] = useState<number>(car.soundProfile.idleRpm);
  const [isPedalPressed, setIsPedalPressed] = useState<boolean>(false);
  const [boostPsi, setBoostPsi] = useState<number>(0);

  const redline = car.soundProfile.redlineRpm || 8500;
  const idle = car.soundProfile.idleRpm || 800;

  useEffect(() => {
    // Start Web Audio Engine
    soundEngine.startEngineSimulator(car.soundProfile.type, (currentRpm) => {
      setRpm(currentRpm);
      // Calculate realistic turbo boost
      if (car.engine.engineType === 'Electric') {
        setBoostPsi(0);
      } else {
        const ratio = Math.max(0, (currentRpm - idle) / (redline - idle));
        setBoostPsi(Math.round(ratio * 24 * 10) / 10);
      }
    });

    return () => {
      soundEngine.stopEngineSimulator();
    };
  }, [car]);

  const handleThrottleDown = () => {
    setIsPedalPressed(true);
    soundEngine.setThrottle(true, redline);
  };

  const handleThrottleUp = () => {
    setIsPedalPressed(false);
    soundEngine.setThrottle(false, redline);
  };

  const rpmPercent = Math.min(100, Math.max(0, ((rpm - idle) / (redline - idle)) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#111111] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D50000]/20 border border-[#D50000]/40 flex items-center justify-center text-[#FF2020]">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#D50000] font-bold uppercase tracking-widest">
                Acoustic Dynamics Simulator
              </span>
              <h3 className="text-xl font-bold font-heading text-white">
                {car.manufacturer} {car.model}
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.stopEngineSimulator();
              onClose();
            }}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Powertrain Tag */}
        <div className="flex items-center justify-between text-xs font-mono bg-neutral-900/80 px-4 py-2 rounded-xl border border-neutral-800 mb-6">
          <span className="text-neutral-400">Powertrain:</span>
          <span className="text-white font-semibold">{car.engine.configuration}</span>
        </div>

        {/* F1 Shift Lights Bar */}
        <div className="flex items-center justify-between gap-1 mb-6 px-2">
          {Array.from({ length: 12 }).map((_, idx) => {
            const threshold = (idx / 12) * 100;
            const isLit = rpmPercent >= threshold;
            let color = 'bg-green-500';
            if (idx >= 6 && idx < 9) color = 'bg-[#FFD600]';
            if (idx >= 9) color = 'bg-[#D50000]';

            return (
              <div
                key={idx}
                className={`h-2.5 flex-1 rounded-full transition-all duration-75 ${
                  isLit ? `${color} shadow-[0_0_8px_currentColor]` : 'bg-neutral-800'
                }`}
              />
            );
          })}
        </div>

        {/* Digital Tachometer Gauge */}
        <div className="relative aspect-[16/9] bg-[#0c0c0c] rounded-2xl border border-neutral-800 p-6 flex flex-col items-center justify-center shadow-inner overflow-hidden mb-6">
          {/* Circular Gauge Arc */}
          <div className="text-center z-10">
            <span className="text-xs font-mono text-neutral-500 tracking-widest uppercase block mb-1">
              Engine Speed
            </span>
            <div className="text-5xl sm:text-6xl font-black font-heading tracking-tight text-white">
              {rpm.toLocaleString()}
            </div>
            <div className="text-xs font-mono text-[#D50000] font-bold mt-1">
              RPM <span className="text-neutral-500">/ {redline} REDLINE</span>
            </div>
          </div>

          {/* Secondary Telemetry: Boost and Power */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-neutral-400 border-t border-neutral-800/80 pt-2">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#FFD600]" />
              BOOST: <strong className="text-white">{boostPsi} PSI</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#D50000]" />
              LOAD: <strong className="text-white">{Math.round(rpmPercent)}%</strong>
            </span>
          </div>

          {/* Red glow pulse on redline */}
          {rpmPercent > 88 && (
            <div className="absolute inset-0 bg-[#D50000]/15 pointer-events-none animate-pulse" />
          )}
        </div>

        {/* Rev Pedal / Accelerator Controller */}
        <div className="text-center">
          <p className="text-xs text-neutral-400 mb-3 font-mono">
            Click and hold or tap the throttle pedal to rev the engine:
          </p>

          <button
            onMouseDown={handleThrottleDown}
            onMouseUp={handleThrottleUp}
            onMouseLeave={handleThrottleUp}
            onTouchStart={handleThrottleDown}
            onTouchEnd={handleThrottleUp}
            className={`w-full py-4 rounded-xl font-heading font-black text-lg tracking-wider uppercase transition-all select-none shadow-2xl flex items-center justify-center gap-2 ${
              isPedalPressed
                ? 'bg-[#FF2020] text-white scale-98 shadow-[0_0_30px_rgba(213,0,0,0.8)]'
                : 'bg-[#D50000] hover:bg-[#b00000] text-white shadow-[0_0_20px_rgba(213,0,0,0.4)]'
            }`}
          >
            <Gauge className="w-5 h-5" />
            {isPedalPressed ? 'ACCELERATING (WOT) 🔥' : 'PRESS & HOLD THROTTLE'}
          </button>
        </div>
      </div>
    </div>
  );
};
