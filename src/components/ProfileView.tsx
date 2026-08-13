import React from 'react';
import { User, Quest, Badge, ImpactMetrics } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
import {
  UserCheck,
  Edit3,
  Shield,
  Zap,
  Flame,
  Coins,
  Trophy,
  Award,
  Trees,
  Droplets,
  Sun,
  Recycle,
  Sparkles,
  CheckCircle2,
  Calendar,
  Building,
  GraduationCap,
  Heart,
  Sliders
} from 'lucide-react';
import { audioService } from '../services/audioService';
import { triggerHaptic, hapticPatterns } from '../utils/haptics';

interface ProfileViewProps {
  user: User;
  quests: Quest[];
  impactMetrics?: ImpactMetrics;
  onOpenEdit: () => void;
  onNavigateTab: (tab: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  quests,
  impactMetrics,
  onOpenEdit,
  onNavigateTab
}) => {
  const completedQuests = quests.filter(q => q.completed);
  const xpPercent = Math.min(100, Math.round((user.xp / user.nextLevelXp) * 100));

  const totalPlastic = impactMetrics?.plasticItemsAvoided ?? 120;
  const totalWater = impactMetrics?.waterSavedLiters ?? 860;
  const totalEnergy = impactMetrics?.energySavedKwh ?? 140;
  const totalCo2 = impactMetrics?.co2AvoidedKg ?? 34;

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. HERO PROFILE HEADER BANNER */}
      <div className="bg-gradient-to-br from-[#071A14] via-[#0E7C5A]/30 to-slate-950 border border-[#0E7C5A]/50 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
          
          {/* Avatar & Main Identity */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative group cursor-pointer" onClick={onOpenEdit}>
              <AvatarDisplay
                avatarId={user.avatar}
                photoURL={user.photoURL}
                customization={user.avatarCustomization}
                size="hero"
                showAura={true}
                showCategoryBadge={true}
              />
              <div className="absolute -bottom-2 -right-2 bg-[#B8E65A] text-slate-950 p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                <Edit3 className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-mono font-bold text-[#B8E65A] bg-[#0E7C5A]/40 px-3 py-1 rounded-full border border-[#16A36A]/50">
                  {user.department} GUILD • CAMPUS RANK #{user.campusRank}
                </span>
                <span className="text-xs font-mono font-bold text-[#38BDF8] bg-sky-950/60 px-3 py-1 rounded-full border border-sky-500/40">
                  LEVEL {user.level} HERO
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {user.fullName || user.preferredName || user.name}
              </h1>
              <p className="text-sm font-mono text-[#B8E65A] font-bold">
                @{user.preferredName || user.name.split(' ')[0]} • {user.email}
              </p>
              <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-2">
                <Building className="w-3.5 h-3.5 text-emerald-400" />
                {user.collegeName || 'Saranathan College of Engineering'}
                <span className="text-slate-500">•</span>
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                {user.yearOfStudy || '3rd Year'} ({user.section || 'A'})
              </p>
              {user.bio && (
                <p className="text-xs text-slate-300 italic pt-1 max-w-lg">
                  "{user.bio}"
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                audioService.playClick();
                triggerHaptic(hapticPatterns.mediumTap);
                onOpenEdit();
              }}
              className="w-full sm:w-auto bg-[#16A36A] hover:bg-[#0E7C5A] text-slate-950 font-black text-sm px-6 py-3.5 rounded-2xl shadow-[0_0_25px_rgba(22,163,106,0.5)] flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:scale-105"
            >
              <Edit3 className="w-4 h-4" />
              <span>EDIT PROFILE & AVATAR</span>
            </button>
            
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-white/10 text-center">
              <div className="text-[10px] font-mono text-slate-400">PROFILE COMPLETION</div>
              <div className="text-sm font-black text-[#38BDF8] flex items-center justify-center gap-1.5 mt-0.5">
                <UserCheck className="w-4 h-4 text-[#B8E65A]" />
                {user.profileCompletionScore || 85}% COMPLETE
              </div>
            </div>
          </div>

        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-8 pt-6 border-t border-[#0E7C5A]/30 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#38BDF8] font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#38BDF8]" /> XP PROGRESSION TO LEVEL {user.level + 1}
            </span>
            <span className="text-slate-300 font-bold">
              {user.xp} / {user.nextLevelXp} XP ({xpPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full p-0.5 border border-sky-500/30 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-600 via-sky-400 to-[#B8E65A] transition-all duration-500 shadow-[0_0_12px_rgba(56,189,248,0.6)]"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. STATS & COMPANION ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* STATS CARD */}
        <div className="bg-[#071A14] border border-[#0E7C5A]/40 rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-mono font-bold text-[#B8E65A] uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4" /> GAMING STATS
          </h3>

          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-white/5">
              <span className="text-[10px] text-slate-400 block">ECO COINS</span>
              <span className="text-lg font-black text-[#F5C451]">🪙 {user.coins}</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-white/5">
              <span className="text-[10px] text-slate-400 block">ACTIVE STREAK</span>
              <span className="text-lg font-black text-rose-400 flex items-center gap-1">
                <Flame className="w-4 h-4 fill-current" /> {user.streak}D
              </span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-white/5">
              <span className="text-[10px] text-slate-400 block">QUESTS DONE</span>
              <span className="text-lg font-black text-[#B8E65A]">{completedQuests.length}</span>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-white/5">
              <span className="text-[10px] text-slate-400 block">WEEKLY TARGET</span>
              <span className="text-lg font-black text-[#38BDF8]">{user.weeklyGoal || 5} / Wk</span>
            </div>
          </div>
        </div>

        {/* ECO SPIRIT COMPANION CARD */}
        <div className="bg-[#071A14] border border-[#0E7C5A]/40 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> ECO SPIRIT COMPANION
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                STAGE {user.ecoSpiritStageLevel}
              </span>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0E7C5A] to-teal-900 border border-[#16A36A] flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(22,163,106,0.4)]">
                🌱
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-white">{user.ecoSpiritName}</h4>
                <p className="text-xs text-[#B8E65A] font-mono">{user.ecoSpiritStage}</p>
                <p className="text-[11px] text-slate-400 mt-1">Evolves with every verified quest!</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('pet')}
            className="w-full py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-[#B8E65A] text-xs font-bold border border-[#16A36A]/50 transition-all cursor-pointer"
          >
            INTERACT WITH COMPANION →
          </button>
        </div>

        {/* SUSTAINABILITY INTERESTS CARD */}
        <div className="bg-[#071A14] border border-[#0E7C5A]/40 rounded-3xl p-6 space-y-4">
          <h3 className="text-xs font-mono font-bold text-[#B8E65A] uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-4 h-4" /> SUSTAINABILITY INTERESTS
          </h3>

          <div className="flex flex-wrap gap-2">
            {(user.sustainabilityInterests || ['♻️ Waste Reduction', '⚡ Energy', '🌱 Food & Agriculture']).map(interest => (
              <span
                key={interest}
                className="text-xs font-mono bg-slate-950 text-slate-200 px-3 py-1.5 rounded-xl border border-white/10"
              >
                {interest}
              </span>
            ))}
          </div>

          {user.personalGoal && (
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">PRIMARY AMBITION</span>
              <p className="text-xs text-white font-bold">{user.personalGoal}</p>
            </div>
          )}
        </div>

      </div>

      {/* 3. AVATAR COSMETICS & GEAR BREAKDOWN */}
      <div className="bg-[#071A14] border border-[#0E7C5A]/40 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-950 text-[#B8E65A] border border-emerald-800">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-white">EQUIPPED HERO GEAR & COSMETICS</h3>
              <p className="text-xs text-slate-400 font-mono">Custom loadout saved in Firestore</p>
            </div>
          </div>

          <button
            onClick={onOpenEdit}
            className="text-xs font-mono text-[#B8E65A] hover:text-white font-bold cursor-pointer"
          >
            CHANGE OUTFIT →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-500 block mb-1">HAIRSTYLE</span>
            <span className="font-bold text-white block truncate">{user.avatarCustomization?.hairstyle || 'Default Hair'}</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-500 block mb-1">OUTFIT</span>
            <span className="font-bold text-[#B8E65A] block truncate">{user.avatarCustomization?.outfit || 'Hero Armor'}</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-500 block mb-1">ACTIVE AURA</span>
            <span className="font-bold text-[#38BDF8] block truncate">{user.avatarCustomization?.aura || 'Bio-Aura'}</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-500 block mb-1">BACKPACK</span>
            <span className="font-bold text-amber-300 block truncate">{user.avatarCustomization?.backpack || 'Ranger Pack'}</span>
          </div>
        </div>
      </div>

      {/* 4. UNLOCKED BADGES & ACHIEVEMENTS */}
      <div className="bg-[#071A14] border border-[#0E7C5A]/40 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-white">EARNED BADGES & ACHIEVEMENTS</h3>
              <p className="text-xs text-slate-400 font-mono">{(user.badges || []).length} Badges Unlocked</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(user.badges || []).map(b => (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex items-start gap-3"
            >
              <div className="p-3 rounded-xl bg-emerald-950 text-[#B8E65A] border border-emerald-800 text-xl">
                🏆
              </div>
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                  {b.rarity}
                </span>
                <h4 className="font-bold text-white text-sm">{b.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
