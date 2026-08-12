import React, { useState } from 'react';
import { Quest } from '../types';
import {
  Target,
  Sparkles,
  CheckCircle2,
  Clock,
  Coins,
  Shield,
  Coffee,
  Droplets,
  Zap,
  Bike,
  Trees,
  Search,
  Filter
} from 'lucide-react';
import { audioService } from '../services/audioService';
import { triggerHaptic, hapticPatterns } from '../utils/haptics';
import { triggerEcoActionBurst } from './EcoParticleCanvas';

interface Props {
  quests: Quest[];
  onAcceptQuest: (questId: string) => void;
  onOpenAIVision: (quest: Quest) => void;
  onCompleteQuestDirect: (questId: string) => void;
}

export const QuestsView: React.FC<Props> = ({
  quests,
  onAcceptQuest,
  onOpenAIVision,
  onCompleteQuestDirect
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['ALL', 'Plastic', 'Water', 'Energy', 'Mobility', 'Biodiversity'];

  const filteredQuests = quests.filter(q => {
    const matchesCategory = selectedCategory === 'ALL' || q.category === selectedCategory;
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Plastic': return Coffee;
      case 'Water': return Droplets;
      case 'Energy': return Zap;
      case 'Mobility': return Bike;
      case 'Biodiversity': return Trees;
      default: return Target;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-400 bg-emerald-950/80 border-emerald-800';
      case 'Medium': return 'text-cyan-400 bg-cyan-950/80 border-cyan-800';
      case 'Hard': return 'text-amber-400 bg-amber-950/80 border-amber-800';
      case 'Legendary': return 'text-purple-400 bg-purple-950/80 border-purple-800';
      default: return 'text-slate-400 bg-slate-950 border-slate-800';
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title Header */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 backdrop-blur-xl flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 uppercase mb-2">
            <Target className="w-3.5 h-3.5" /> DAILY CAMPUS MISSIONS
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">ECO QUEST BOARD</h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete real-world sustainable actions on campus to earn XP, Eco Coins, and raise your department's rank.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search quests..."
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 font-mono">
        <Filter className="w-4 h-4 text-emerald-400 shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              audioService.playClick();
              setSelectedCategory(cat);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredQuests.map((quest) => {
          const CategoryIcon = getCategoryIcon(quest.category);
          return (
            <div
              key={quest.id}
              className={`bg-slate-900/90 border rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between transition-all relative overflow-hidden ${
                quest.completed
                  ? 'border-emerald-500/40 bg-emerald-950/10'
                  : 'border-slate-800 hover:border-emerald-500/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800 uppercase">
                    <CategoryIcon className="w-3 h-3" /> {quest.category}
                  </span>

                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${getDifficultyColor(quest.difficulty)}`}>
                    {quest.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-white mb-2 flex items-center justify-between">
                  <span>{quest.title}</span>
                  {quest.completed && <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {quest.description}
                </p>

                <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3 mb-4 text-xs font-mono text-slate-400 space-y-1">
                  <div className="text-slate-200 font-bold flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" /> Proof: {quest.verificationType}
                  </div>
                  <div className="text-[11px] text-slate-400">{quest.instructions}</div>
                  {quest.departmentBonus && (
                    <div className="text-[10px] text-cyan-400 font-bold pt-1">
                      ⚡ Guild Bonus Active for {quest.departmentBonus} (+20 XP)
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="font-bold text-emerald-400">+{quest.xp} XP</span>
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <Coins className="w-3 h-3" /> +{quest.coins}
                  </span>
                </div>

                {quest.completed ? (
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800">
                    QUEST COMPLETED ✓
                  </span>
                ) : !quest.accepted ? (
                  <button
                    onClick={(e) => {
                      audioService.playQuestAccepted();
                      triggerHaptic(hapticPatterns.mediumTap);
                      triggerEcoActionBurst(e.clientX, e.clientY);
                      onAcceptQuest(quest.id);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer active:scale-95 shadow-md hover:shadow-[#16A36A]/20"
                  >
                    ACCEPT QUEST
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        audioService.playClick();
                        triggerHaptic(hapticPatterns.lightTap);
                        onOpenAIVision(quest);
                      }}
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5 transition-all cursor-pointer transform active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI VERIFY</span>
                    </button>

                    <button
                      onClick={(e) => {
                        audioService.playQuestComplete();
                        triggerHaptic(hapticPatterns.successPulse);
                        triggerEcoActionBurst(e.clientX, e.clientY);
                        onCompleteQuestDirect(quest.id);
                      }}
                      className="bg-slate-800 hover:bg-emerald-950 hover:text-emerald-400 text-slate-400 font-mono text-[10px] px-2.5 py-2 rounded-xl transition-colors cursor-pointer active:scale-95"
                      title="Quick test verify for judges/demo"
                    >
                      INSTANT
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
