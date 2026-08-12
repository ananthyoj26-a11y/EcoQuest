import React, { useState } from 'react';
import { User } from '../types';
import { Globe2, Sun, Droplets, Trees, Bike, Zap, Coins, CheckCircle2, Lock } from 'lucide-react';
import { audioService } from '../services/audioService';

interface Props {
  user: User;
  onUpdateUser: (updated: Partial<User>) => void;
}

interface WorldItem {
  id: string;
  name: string;
  category: string;
  price: number;
  icon: string;
  desc: string;
  impactText: string;
}

export const EcoWorldView: React.FC<Props> = ({ user, onUpdateUser }) => {
  const [selectedItem, setSelectedItem] = useState<WorldItem | null>(null);

  const availableItems: WorldItem[] = [
    { id: 'solar_panel_1', name: 'Rooftop Solar Array Alpha', category: 'Clean Energy', price: 0, icon: '☀️', desc: 'Converts photons into zero-emission power for Block A.', impactText: '+18.5 kWh daily energy clean power' },
    { id: 'rain_harvester_1', name: 'Rainwater Purifier Tank', category: 'Water', price: 0, icon: '💧', desc: 'Captures and filters monsoon rain for campus gardens.', impactText: '+240 Liters water recycled daily' },
    { id: 'urban_garden_1', name: 'Botanic Herb Garden', category: 'Biodiversity', price: 0, icon: '🌿', desc: 'Medicinal flora sanctuary planted behind Central Library.', impactText: '+12 kg CO₂ absorbed per month' },
    { id: 'bike_station_1', name: 'EV Bicycle Charging Dock', category: 'Mobility', price: 400, icon: '🚲', desc: 'Solar-powered charging dock for green student commutes.', impactText: '-4.2 kg transit emissions saved' },
    { id: 'composter_1', name: 'Campus Organic Bio-Composter', category: 'Recycling', price: 600, icon: '♻️', desc: 'Converts canteen food waste into nutrient soil.', impactText: '-50 kg landfill waste reduced' }
  ];

  const handleUnlock = (item: WorldItem) => {
    if (user.coins < item.price) return;
    audioService.playQuestComplete();

    const updatedUnlocked = [...user.unlockedWorldItems, item.id];
    onUpdateUser({
      coins: user.coins - item.price,
      unlockedWorldItems: updatedUnlocked
    });
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 backdrop-blur-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30 uppercase mb-2">
            <Globe2 className="w-3.5 h-3.5" /> PERSONAL CAMPUS ECOSYSTEM
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">MY ECO WORLD</h1>
          <p className="text-xs text-slate-400 mt-1">
            Build and expand your virtual campus ecosystem by unlocking clean energy, water recycling, and biodiversity structures.
          </p>
        </div>

        <div className="bg-slate-950 border border-cyan-500/30 px-4 py-2 rounded-2xl font-mono text-xs text-right">
          <span className="text-slate-400">STRUCTURES:</span>{' '}
          <strong className="text-cyan-400">{user.unlockedWorldItems.length} / {availableItems.length} UNLOCKED</strong>
        </div>
      </div>

      {/* Grid of Isometric-Style Ecosystem Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableItems.map((item) => {
          const isUnlocked = user.unlockedWorldItems.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={() => {
                audioService.playClick();
                setSelectedItem(item);
              }}
              className={`bg-slate-900/90 border rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden group ${
                isUnlocked
                  ? 'border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                  : 'border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800 uppercase">
                    {item.category}
                  </span>

                  {isUnlocked ? (
                    <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> {item.price} 🪙
                    </span>
                  )}
                </div>

                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-950 to-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-4xl my-4 mx-auto shadow-inner group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>

                <h3 className="text-lg font-black text-white text-center mb-1 group-hover:text-cyan-400 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-300 text-center leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 font-mono text-xs text-center text-emerald-400 font-bold">
                {item.impactText}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Item Detail Drawer Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-[#070a0f]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 max-w-md w-full font-sans text-slate-100 relative">
            <div className="text-center">
              <div className="text-6xl mb-3">{selectedItem.icon}</div>
              <h3 className="text-xl font-black text-white">{selectedItem.name}</h3>
              <p className="text-xs text-cyan-400 font-mono font-bold mt-1 uppercase">{selectedItem.category}</p>
              <p className="text-xs text-slate-300 mt-3 leading-relaxed">{selectedItem.desc}</p>

              <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl my-4 text-xs font-mono text-emerald-400 font-bold">
                {selectedItem.impactText}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>

                {!user.unlockedWorldItems.includes(selectedItem.id) ? (
                  <button
                    onClick={() => {
                      handleUnlock(selectedItem);
                      setSelectedItem(null);
                    }}
                    disabled={user.coins < selectedItem.price}
                    className="w-1/2 bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black text-xs uppercase py-3 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    Unlock ({selectedItem.price} 🪙)
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-1/2 bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono text-xs font-bold py-3 rounded-xl"
                  >
                    Already Unlocked ✓
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
