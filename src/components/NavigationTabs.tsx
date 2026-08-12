import React from 'react';
import { motion } from 'motion/react';
import {
  Home,
  Target,
  Globe2,
  Swords,
  Bot,
  BarChart3,
  ShoppingBag,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { audioService } from '../services/audioService';
import { triggerHaptic, hapticPatterns } from '../utils/haptics';

interface Props {
  activeTab: string;
  onChangeTab?: (tab: string) => void;
  setActiveTab?: (tab: string) => void;
  isAdmin?: boolean;
}

export const NavigationTabs: React.FC<Props> = ({
  activeTab,
  onChangeTab,
  setActiveTab,
  isAdmin
}) => {
  // 6 Primary Destinations according to Spec
  const primaryTabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'quests', label: 'Quests', icon: Target },
    { id: 'world', label: 'World', icon: Globe2 },
    { id: 'guilds', label: 'Compete', icon: Swords },
    { id: 'coach', label: 'AI Coach', icon: Bot },
    { id: 'impact', label: 'Impact', icon: BarChart3 }
  ];

  const handleSelect = (tabId: string) => {
    audioService.playClick();
    triggerHaptic(hapticPatterns.lightTap);
    if (onChangeTab) onChangeTab(tabId);
    if (setActiveTab) setActiveTab(tabId);
  };

  return (
    <nav className="bg-[#071A14]/90 border-b border-[#0E7C5A]/30 px-4 py-2 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        
        {/* 6 Primary Tabs */}
        <div className="flex items-center gap-1 sm:gap-2">
          {primaryTabs.map((t) => {
            const Icon = t.icon;
            // Map sub-tabs so parent stays active if inside sub-tab
            const isActive =
              activeTab === t.id ||
              (t.id === 'quests' && (activeTab === 'bounties' || activeTab === 'hunt')) ||
              (t.id === 'world' && activeTab === 'pet') ||
              (t.id === 'guilds' && activeTab === 'leaderboard');

            return (
              <motion.button
                key={t.id}
                onClick={() => handleSelect(t.id)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#16A36A] text-slate-950 shadow-[0_0_15px_rgba(22,163,106,0.4)]'
                    : 'text-slate-300 hover:text-white hover:bg-[#0E7C5A]/30'
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.25, rotate: t.id === 'world' ? -12 : 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-[#B8E65A]'}`} />
                </motion.div>
                <span>{t.label}</span>
                {t.id === 'world' && (
                  <span className="text-[10px] bg-emerald-950 text-[#B8E65A] border border-[#16A36A]/50 px-1.5 py-0.2 rounded-full font-mono">
                    🌱
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Secondary Links: Profile, Shop & Admin */}
        <div className="flex items-center gap-2 pl-4 border-l border-[#0E7C5A]/30">
          <button
            onClick={() => handleSelect('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#16A36A] text-slate-950 font-bold'
                : 'text-[#B8E65A] hover:bg-[#0E7C5A]/20 border border-[#0E7C5A]/40'
            }`}
            title="My Hero Profile"
          >
            <span>Profile</span>
          </button>

          <button
            onClick={() => handleSelect('shop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'shop'
                ? 'bg-[#F5C451] text-slate-950 font-bold'
                : 'text-[#F5C451] hover:bg-[#F5C451]/10 border border-[#F5C451]/30'
            }`}
            title="Eco Shop & Rewards"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Shop</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => handleSelect('admin')}
              className={`p-2 rounded-xl text-xs transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-rose-500 text-white'
                  : 'text-rose-400 hover:bg-rose-950/40 border border-rose-800/40'
              }`}
              title="Admin Panel"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};


