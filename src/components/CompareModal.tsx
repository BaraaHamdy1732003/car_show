import React from 'react';
import { Car } from '../types/car';
import { X, Plus, Trash2, Maximize2, Trophy } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface CompareModalProps {
  allCars: Car[];
  compareList: Car[];
  onRemoveFromCompare: (carId: string) => void;
  onAddCar: (car: Car) => void;
  onClose: () => void;
  onOpenExplorer3D: (car: Car) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  allCars,
  compareList,
  onRemoveFromCompare,
  onAddCar,
  onClose,
  onOpenExplorer3D,
}) => {
  // Find winners for key stats
  const highestHp = Math.max(...compareList.map((c) => c.engine.horsepower), 0);
  const fastest0100 = Math.min(...compareList.map((c) => c.engine.acceleration0100), 999);
  const highestTopSpeed = Math.max(...compareList.map((c) => c.engine.topSpeedKmH), 0);
  const lightestWeight = Math.min(...compareList.map((c) => c.dimensions.weightKg), 99999);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-[#111111] border border-neutral-800 rounded-2xl shadow-2xl text-white my-auto overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#141414] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D50000]" />
            <div>
              <span className="text-[10px] font-mono text-[#D50000] uppercase font-bold tracking-widest">
                Benchmarking Suite
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-heading uppercase text-white">
                Vehicle Comparison Matrix
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle Selection Header Bar */}
        <div className="p-6 border-b border-neutral-800 bg-[#0e0e0e]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((slotIdx) => {
              const car = compareList[slotIdx];
              return (
                <div
                  key={slotIdx}
                  className="bg-[#161616] rounded-xl border border-neutral-800 p-4 min-h-[160px] flex flex-col justify-between"
                >
                  {car ? (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono text-[#D50000] uppercase font-bold">
                            {car.manufacturer}
                          </span>
                          <h4 className="text-base font-bold font-heading text-white">
                            {car.model}
                          </h4>
                          <span className="text-xs text-[#FFD600] font-mono font-bold">
                            {car.priceDisplay}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            soundEngine.playClick();
                            onRemoveFromCompare(car.id);
                          }}
                          className="p-1 text-neutral-500 hover:text-[#D50000] transition-colors"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="relative aspect-[16/9] rounded-lg overflow-hidden my-2 bg-black border border-neutral-800">
                        <img
                          src={car.heroImage}
                          alt={car.model}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onOpenExplorer3D(car);
                        }}
                        className="w-full py-1.5 bg-[#D50000]/20 hover:bg-[#D50000] text-[#FF2020] hover:text-white border border-[#D50000]/40 text-[11px] font-bold uppercase rounded-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        Launch 3D Explorer
                      </button>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                      <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500 mb-2">
                        <Plus className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-neutral-400 font-medium mb-3">
                        Slot {slotIdx + 1}: Select Car
                      </span>
                      <select
                        onChange={(e) => {
                          const found = allCars.find((c) => c.id === e.target.value);
                          if (found) {
                            soundEngine.playClick();
                            onAddCar(found);
                          }
                        }}
                        defaultValue=""
                        className="w-full bg-[#111111] text-xs font-mono text-neutral-300 border border-neutral-700 rounded-lg p-2 focus:border-[#D50000] outline-none"
                      >
                        <option value="" disabled>
                          + Choose Vehicle...
                        </option>
                        {allCars
                          .filter((c) => !compareList.some((sel) => sel.id === c.id))
                          .map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.manufacturer} {c.model} ({c.year})
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison Specs Table */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          {compareList.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              Please add at least one vehicle to the comparison matrix above.
            </div>
          ) : (
            <div className="space-y-2 text-xs font-mono">
              {[
                {
                  label: 'Horsepower (HP)',
                  getValue: (c: Car) => `${c.engine.horsepower} HP`,
                  isWinner: (c: Car) => c.engine.horsepower === highestHp && compareList.length > 1,
                },
                {
                  label: '0-100 km/h (sec)',
                  getValue: (c: Car) => `${c.engine.acceleration0100}s`,
                  isWinner: (c: Car) =>
                    c.engine.acceleration0100 === fastest0100 && compareList.length > 1,
                },
                {
                  label: 'Top Speed',
                  getValue: (c: Car) => `${c.engine.topSpeedKmH} km/h`,
                  isWinner: (c: Car) =>
                    c.engine.topSpeedKmH === highestTopSpeed && compareList.length > 1,
                },
                {
                  label: 'Engine Type',
                  getValue: (c: Car) => c.engine.configuration,
                  isWinner: () => false,
                },
                {
                  label: 'Displacement',
                  getValue: (c: Car) => c.engine.displacement,
                  isWinner: () => false,
                },
                {
                  label: 'Torque',
                  getValue: (c: Car) => c.engine.torque,
                  isWinner: () => false,
                },
                {
                  label: 'Drivetrain',
                  getValue: (c: Car) => c.engine.drivetrain,
                  isWinner: () => false,
                },
                {
                  label: 'Transmission',
                  getValue: (c: Car) => c.engine.transmission,
                  isWinner: () => false,
                },
                {
                  label: 'Curb Weight',
                  getValue: (c: Car) => `${c.dimensions.weightKg} kg`,
                  isWinner: (c: Car) =>
                    c.dimensions.weightKg === lightestWeight && compareList.length > 1,
                },
                {
                  label: 'Starting Price',
                  getValue: (c: Car) => c.priceDisplay,
                  isWinner: () => false,
                },
              ].map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-4 gap-2 items-center bg-[#151515] p-3 rounded-lg border border-neutral-800"
                >
                  <div className="font-bold text-neutral-400 uppercase text-[11px]">
                    {row.label}
                  </div>
                  {[0, 1, 2].map((slotIdx) => {
                    const car = compareList[slotIdx];
                    if (!car) {
                      return (
                        <div key={slotIdx} className="text-neutral-600 text-center">
                          —
                        </div>
                      );
                    }
                    const winner = row.isWinner(car);
                    return (
                      <div
                        key={slotIdx}
                        className={`text-center font-semibold rounded py-1 px-2 flex items-center justify-center gap-1.5 ${
                          winner
                            ? 'bg-[#D50000]/20 text-[#FF2020] border border-[#D50000]/50'
                            : 'text-neutral-200'
                        }`}
                      >
                        {winner && <Trophy className="w-3.5 h-3.5 text-[#FFD600]" />}
                        {row.getValue(car)}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
