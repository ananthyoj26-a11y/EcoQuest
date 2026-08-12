import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Bot, Flame, Shield, CheckCircle2, ArrowRight, Play, X, Zap } from 'lucide-react';
import { User, Quest, DepartmentRank } from '../types';
import { audioService } from '../services/audioService';

interface Props {
  user: User;
  quests: Quest[];
  departments: DepartmentRank[];
  onOpenAIVision: (quest: Quest) => void;
  onNavigateTab: (tab: string) => void;
  onUpdateUser: (updated: Partial<User>) => void;
  onUpdateDepartments: (depts: DepartmentRank[]) => void;
  onClose: () => void;
}

export const JudgeDemoRunner: React.FC<Props> = ({
  user,
  quests,
  departments,
  onOpenAIVision,
  onNavigateTab,
  onUpdateUser,
  onUpdateDepartments,
  onClose
}) => {
  const [currentWowStep, setCurrentWowStep] = useState<number>(1);
  const [wowNotification, setWowNotification] = useState<string | null>(null);

  const wowMoments = [
    {
      id: 1,
      title: 'WOW 1: Cinematic Cyberpunk HUD',
      badge: 'INTERFACE & CORE LOOP',
      description: 'Futuristic RPG HUD displaying real-time XP progress, 17-Day Streak, Eco Coins, and live campus ticker.',
      actionLabel: 'EXPLORE HUD & DASHBOARD',
      action: () => {
        audioService.playClick();
        onNavigateTab('dashboard');
        setWowNotification('✨ WOW 1 ACTIVE: Inspect Player Profile, Level 18 Stats & Campus Ticker');
      }
    },
    {
      id: 2,
      title: 'WOW 2: AI Proof-of-Action (Gemini Vision)',
      badge: 'COMPUTER VISION AI',
      description: 'Upload proof photo (e.g. reusable bottle, solar panel). Gemini server-side AI analyzes, detects object with confidence %, and awards XP.',
      actionLabel: 'TEST AI VISION VERIFICATION',
      action: () => {
        audioService.playClick();
        const quest = quests.find(q => q.verificationType === 'AI_VISION') || quests[0];
        onOpenAIVision(quest);
        setWowNotification('🤖 WOW 2 ACTIVE: Launching Server Gemini AI Photo Inspector');
      }
    },
    {
      id: 3,
      title: 'WOW 3: Eco-Pet Evolution Burst',
      badge: 'GAMIFICATION & RETENTION',
      description: 'Digital pet Volt responds to eco-actions. Watch Volt evolve into a glowing Cyber Tree with aura catalysts.',
      actionLabel: 'TRIGGER PET EVOLUTION',
      action: () => {
        audioService.playLevelUp();
        onNavigateTab('pet');
        onUpdateUser({
          ecoSpiritStage: 'Cyber Tree',
          ecoSpiritStageLevel: 3,
          xp: user.xp + 250
        });
        setWowNotification('🌱 WOW 3 ACTIVE: Volt Evolved to Cyber Tree! (+250 XP)');
      }
    },
    {
      id: 4,
      title: 'WOW 4: Department Rank Jump (#2 → #1)',
      badge: 'GUILD WARS COMPETITION',
      description: 'Your verified eco-actions add points to AI & DS Guild score, instantly triggering a live department rank jump!',
      actionLabel: 'EXECUTE RANK UP (#2 → #1)',
      action: () => {
        audioService.playQuestAccepted();
        onNavigateTab('guilds');
        const updatedDepts = departments.map(d => {
          if (d.department === 'AI & DS') {
            return { ...d, rank: 1, score: d.score + 5000 };
          }
          if (d.department === 'ECE') {
            return { ...d, rank: 2 };
          }
          return d;
        });
        onUpdateDepartments(updatedDepts);
        setWowNotification('⚔️ WOW 4 ACTIVE: AI & DS GUILD OVERTOOK ECE! NOW #1 RANK!');
      }
    },
    {
      id: 5,
      title: 'WOW 5: AI Eco Coach Recommendation',
      badge: 'PERSONALIZED AI MENTOR',
      description: 'AI Eco Coach analyzes player level, streak, and recent actions to recommend the next highest impact challenge.',
      actionLabel: 'CONSULT AI ECO COACH',
      action: () => {
        audioService.playClick();
        onNavigateTab('coach');
        setWowNotification('💡 WOW 5 ACTIVE: ECO COACH analyzing player data & strategic advice');
      }
    }
  ];

  const handleNextStep = () => {
    const nextStep = currentWowStep < 5 ? currentWowStep + 1 : 1;
    setCurrentWowStep(nextStep);
    wowMoments[nextStep - 1].action();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(16,185,129,0.3)] relative overflow-hidden"
      >
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-cyan-400 to-purple-500" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              AI STARTUP ARENA • 3-MIN JUDGE PRESENTATION MODE
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">5 JUDGE WOW MOMENTS</h2>
          </div>
        </div>

        {/* Step Selector Tabs */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {wowMoments.map((mom) => (
            <button
              key={mom.id}
              onClick={() => {
                setCurrentWowStep(mom.id);
                mom.action();
              }}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-mono text-xs ${
                currentWowStep === mom.id
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-[10px]">STEP 0{mom.id}</div>
            </button>
          ))}
        </div>

        {/* Selected Step Display Card */}
        {wowMoments[currentWowStep - 1] && (
          <div className="bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-5 mb-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800 uppercase">
                {wowMoments[currentWowStep - 1].badge}
              </span>
              <span className="text-xs font-mono text-slate-400">STEP {currentWowStep} OF 5</span>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-2">
              {wowMoments[currentWowStep - 1].title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {wowMoments[currentWowStep - 1].description}
            </p>

            <button
              onClick={() => {
                wowMoments[currentWowStep - 1].action();
                onClose();
              }}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{wowMoments[currentWowStep - 1].actionLabel}</span>
            </button>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Close Runner
          </button>

          <button
            onClick={handleNextStep}
            className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <span>NEXT WOW STEP</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
