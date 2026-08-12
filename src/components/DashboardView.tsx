import React from 'react';
import { User, Quest, Bounty, LiveActivity, ImpactMetrics } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
import {
  Shield,
  Zap,
  Flame,
  Trophy,
  Sparkles,
  ArrowRight,
  Clock,
  Coins,
  CheckCircle2,
  TreeDeciduous,
  Droplets,
  Sun,
  Recycle,
  Radio,
  Swords,
  ChevronRight,
  Target,
  Edit3,
  UserCheck,
  Award
} from 'lucide-react';
import { audioService } from '../services/audioService';

interface Props {
  user: User;
  quests: Quest[];
  bounties: Bounty[];
  liveActivities: LiveActivity[];
  impactMetrics?: ImpactMetrics;
  onOpenQuests: () => void;
  onOpenPet: () => void;
  onOpenWorld: () => void;
  onOpenAIVision: (quest: Quest) => void;
  onOpenBounties: () => void;
  onOpenProfileEdit?: () => void;
}

export const DashboardView: React.FC<Props> = ({
  user,
  quests,
  bounties,
  liveActivities,
  impactMetrics,
  onOpenQuests,
  onOpenPet,
  onOpenWorld,
  onOpenAIVision,
  onOpenBounties,
  onOpenProfileEdit
}) => {
  const featuredQuest = quests.find(q => !q.completed) || quests[0];
  const activeBounty = bounties.find(b => !b.completed) || bounties[0];

  const xpPercent = Math.min(100, Math.round((user.xp / user.nextLevelXp) * 100));

  const totalEcoActions = impactMetrics?.totalEcoActions ?? quests.filter(q => q.completed).length ?? 12;
  const waterSaved = impactMetrics?.waterSavedLiters ?? 86240;
  const energySaved = impactMetrics?.energySavedKwh ?? 14200;
  const co2Avoided = impactMetrics?.co2AvoidedKg ?? 3420;

  // Weekly Goal Calculations (Req #8)
  const completedThisWeek = quests.filter(q => q.completed).length || 3;
  const weeklyTarget = user.weeklyGoal || 5;
  const weeklyGoalPercent = Math.min(100, Math.round((completedThisWeek / weeklyTarget) * 100));

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. TOP HEADER WELCOME & PERSONALIZED GOAL */}
      <div className="bg-[#071A14] border border-[#0E7C5A]/40 rounded-3xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#B8E65A] uppercase tracking-wider bg-[#0E7C5A]/30 px-3 py-1 rounded-full border border-[#16A36A]/40">
                {user.department} GUILD • CAMPUS RANK #{user.campusRank}
              </span>

              {/* Profile Completion Score Badge (Req #19) */}
              <button
                onClick={onOpenProfileEdit}
                className="text-[10px] font-mono font-bold text-[#38BDF8] bg-slate-950 px-3 py-1 rounded-full border border-[#38BDF8]/40 hover:border-[#B8E65A] transition-all flex items-center gap-1.5 cursor-pointer"
                title="Click to complete your optional profile details"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#B8E65A]" />
                <span>PROFILE COMPLETE — {user.profileCompletionScore || 85}%</span>
                <Edit3 className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight pt-1">
              GOOD MORNING, {(user.preferredName || user.name).toUpperCase()} 👋
            </h1>
            <p className="text-sm text-slate-300">
              Personalized for your <span className="text-[#B8E65A] font-bold">{user.department}</span> journey at {user.collegeName || 'Saranathan College'}.
            </p>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-3 font-mono text-sm w-full md:w-auto">
            <div className="flex-1 md:flex-none bg-slate-950/80 border border-slate-800 p-3 rounded-2xl text-center">
              <div className="text-[10px] text-slate-400">LEVEL</div>
              <div className="text-base font-black text-[#B8E65A]">{user.level}</div>
            </div>

            <div className="flex-1 md:flex-none bg-slate-950/80 border border-slate-800 p-3 rounded-2xl text-center">
              <div className="text-[10px] text-slate-400">ECO COINS</div>
              <div className="text-base font-black text-[#F5C451]">🪙 {user.coins}</div>
            </div>

            <div className="flex-1 md:flex-none bg-slate-950/80 border border-slate-800 p-3 rounded-2xl text-center">
              <div className="text-[10px] text-slate-400">STREAK</div>
              <div className="text-base font-black text-rose-400 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-current" /> {user.streak}D
              </div>
            </div>
          </div>

        </div>

        {/* Weekly Eco Goal Progress (Req #8) */}
        <div className="mt-6 pt-5 border-t border-[#0E7C5A]/30 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#B8E65A] font-bold flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#B8E65A]" /> YOUR WEEKLY ECO GOAL
              </span>
              <span className="text-white font-bold">
                {completedThisWeek} / {weeklyTarget} ACTIONS THIS WEEK ({weeklyGoalPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full p-0.5 border border-[#0E7C5A]/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0E7C5A] via-[#16A36A] to-[#B8E65A] transition-all duration-500 shadow-[0_0_10px_rgba(22,163,106,0.6)]"
                style={{ width: `${weeklyGoalPercent}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#38BDF8] font-bold flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#38BDF8]" /> XP PROGRESS TO LEVEL {user.level + 1}
              </span>
              <span className="text-slate-300">
                {user.xp} / {user.nextLevelXp} XP ({xpPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full p-0.5 border border-sky-500/30 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-600 via-sky-400 to-[#B8E65A] transition-all duration-500 shadow-[0_0_10px_rgba(56,189,248,0.6)]"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* 2. TODAY'S FEATURED QUEST */}
      <div className="bg-gradient-to-br from-[#071A14] via-[#0E7C5A]/20 to-slate-950 border-2 border-[#16A36A]/50 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-bold text-[#B8E65A] bg-[#0E7C5A]/40 px-3.5 py-1.5 rounded-full border border-[#16A36A]/50 uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> TODAY'S PRIMARY QUEST
          </span>
          <span className="text-xs font-mono text-[#38BDF8] font-bold bg-[#38BDF8]/10 px-3 py-1 rounded-lg border border-[#38BDF8]/30">
            +{featuredQuest.xp} XP • +{featuredQuest.coins} COINS
          </span>
        </div>

        <div>
          <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            {featuredQuest.title}
            {featuredQuest.completed && <CheckCircle2 className="w-7 h-7 text-[#B8E65A]" />}
          </h2>
          <p className="text-base text-slate-200 leading-relaxed mb-6 max-w-3xl">
            {featuredQuest.description}
          </p>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-6 flex items-center gap-3 text-xs font-mono text-slate-300">
            <Clock className="w-5 h-5 text-[#B8E65A] flex-shrink-0" />
            <div>
              <span className="text-white font-bold">Verification Method:</span> {featuredQuest.verificationType} — {featuredQuest.instructions}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800">
          <button
            onClick={onOpenQuests}
            className="text-xs font-mono text-[#B8E65A] hover:text-white flex items-center gap-1.5 cursor-pointer font-bold"
          >
            <span>VIEW ALL AVAILABLE QUESTS ({quests.filter(q => !q.completed).length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {!featuredQuest.completed && (
            <button
              onClick={() => {
                audioService.playClick();
                onOpenAIVision(featuredQuest);
              }}
              className="bg-[#16A36A] hover:bg-[#0E7C5A] text-slate-950 font-black text-sm px-6 py-3.5 rounded-2xl shadow-[0_0_25px_rgba(22,163,106,0.5)] flex items-center gap-2.5 transition-all cursor-pointer transform hover:scale-105"
            >
              <Sparkles className="w-5 h-5 fill-current" />
              <span>VERIFY WITH AI →</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. YOUR HERO AVATAR & YOUR ECO SPIRIT PROGRESSION ROW (Req #18) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* YOUR HERO (Gaming Avatar) */}
        <div
          onClick={onOpenProfileEdit}
          className="bg-[#071A14] border border-[#0E7C5A]/40 rounded-3xl p-6 hover:border-[#16A36A] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-[#B8E65A] bg-[#0E7C5A]/30 px-3 py-1 rounded-full border border-[#16A36A]/40 uppercase">
                YOUR GAMING HERO
              </span>
              <span className="text-xs font-mono text-slate-400">LEVEL {user.level}</span>
            </div>

            <div className="flex items-center gap-4 py-2">
              <AvatarDisplay
                avatarId={user.avatar}
                customization={user.avatarCustomization}
                size="xl"
                showAura={true}
                showCategoryBadge={true}
              />
              <div>
                <h4 className="font-extrabold text-2xl text-white group-hover:text-[#B8E65A] transition-colors">
                  {user.preferredName || user.name}
                </h4>
                <p className="text-xs text-[#38BDF8] font-mono font-bold mt-0.5">
                  {user.avatarCustomization?.outfit || 'Hero Ranger'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {user.department} • {user.yearOfStudy || 'Student Hero'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-[#B8E65A] font-bold">
            <span className="flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-[#B8E65A]" /> CUSTOMIZE OUTFIT & HERO GEAR
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* YOUR ECO SPIRIT (Companion) */}
        <div
          onClick={() => {
            audioService.playClick();
            onOpenPet();
          }}
          className="bg-[#071A14] border border-[#0E7C5A]/40 rounded-3xl p-6 hover:border-[#16A36A] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-3 py-1 rounded-full border border-[#38BDF8]/30">
                YOUR ECO SPIRIT
              </span>
              <span className="text-xs font-mono text-slate-400">STAGE {user.ecoSpiritStageLevel}</span>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0E7C5A] to-teal-900 border border-[#16A36A] flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(22,163,106,0.4)] group-hover:scale-105 transition-transform">
                🌱
              </div>
              <div>
                <h4 className="font-extrabold text-2xl text-white group-hover:text-[#B8E65A] transition-colors">
                  {user.ecoSpiritName}
                </h4>
                <p className="text-xs text-[#B8E65A] font-mono font-bold mt-0.5">{user.ecoSpiritStage}</p>
                <p className="text-xs text-slate-400 mt-1">
                  82% → Next Evolution Stage
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-[#B8E65A] font-bold">
            <span>INTERACT & FEED SPIRIT</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* 4. CAMPUS LIVE TICKER */}
      <div className="bg-[#071A14] border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#B8E65A] animate-pulse" />
            <h3 className="font-extrabold text-sm text-white tracking-wider font-mono uppercase">
              REAL-TIME CAMPUS ACTIVITY
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">LIVE FEED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-sans">
          {liveActivities.map((act) => (
            <div key={act.id} className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
              <img src={act.avatar} alt={act.username} className="w-9 h-9 rounded-xl object-cover border border-slate-700" />
              <div className="text-xs overflow-hidden">
                <div className="font-bold text-slate-200 truncate">{act.username} <span className="text-[10px] text-[#B8E65A] font-mono">({act.department})</span></div>
                <div className="text-[11px] text-slate-400 truncate">{act.action}</div>
                <div className="text-[9px] text-slate-500 font-mono mt-0.5">{act.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

