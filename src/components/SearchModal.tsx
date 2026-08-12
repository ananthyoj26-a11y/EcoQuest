import React, { useState, useEffect } from 'react';
import { Search, X, Target, Swords, QrCode, ShoppingBag, Trophy, Bot, Sparkles } from 'lucide-react';
import { Quest, Bounty } from '../types';

interface Props {
  quests: Quest[];
  bounties: Bounty[];
  onClose: () => void;
  onNavigate: (tabId: string) => void;
  onSelectQuest: (quest: Quest) => void;
}

export const SearchModal: React.FC<Props> = ({
  quests,
  bounties,
  onClose,
  onNavigate,
  onSelectQuest
}) => {
  const [term, setTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const navigationItems = [
    { id: 'dashboard', label: 'Command Dashboard', icon: Target },
    { id: 'quests', label: 'Daily Eco Quests', icon: Sparkles },
    { id: 'coach', label: 'AI Eco Coach', icon: Bot },
    { id: 'pet', label: 'Eco Spirit Pet', icon: Sparkles },
    { id: 'world', label: 'My Eco World', icon: Sparkles },
    { id: 'guilds', label: 'Department Guild Wars', icon: Swords },
    { id: 'hunt', label: 'QR Eco Hunt', icon: QrCode },
    { id: 'bounties', label: 'Timed Bounties Board', icon: Swords },
    { id: 'shop', label: 'Eco Shop & Crates', icon: ShoppingBag },
    { id: 'leaderboard', label: 'Campus Leaderboards', icon: Trophy }
  ];

  const filteredNav = navigationItems.filter(i =>
    i.label.toLowerCase().includes(term.toLowerCase())
  );

  const filteredQuests = quests.filter(q =>
    q.title.toLowerCase().includes(term.toLowerCase()) ||
    q.category.toLowerCase().includes(term.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#070a0f]/80 backdrop-blur-md flex items-start justify-center pt-20 p-4 font-sans select-none">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-xl w-full p-4 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        
        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 mb-4">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search quests, bounties, views, or commands..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto space-y-4 pr-1 font-mono text-xs">
          
          {/* Views */}
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest px-2 mb-2">QUICK NAVIGATION</div>
            <div className="grid grid-cols-2 gap-2">
              {filteredNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                    className="p-2.5 bg-slate-950 hover:bg-emerald-950/80 border border-slate-800 hover:border-emerald-500/40 rounded-xl text-left text-slate-300 hover:text-emerald-400 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Icon className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span className="truncate font-sans font-medium text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quests Matching */}
          {filteredQuests.length > 0 && (
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest px-2 mb-2">QUESTS</div>
              <div className="space-y-1.5">
                {filteredQuests.slice(0, 4).map((q) => (
                  <div
                    key={q.id}
                    onClick={() => {
                      onSelectQuest(q);
                      onClose();
                    }}
                    className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex justify-between items-center cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-white font-sans">{q.title}</div>
                      <div className="text-[10px] text-slate-400">{q.category} • {q.difficulty}</div>
                    </div>
                    <span className="text-emerald-400 font-bold">+{q.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
