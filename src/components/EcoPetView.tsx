import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSpring, animated } from '@react-spring/web';
import { User } from '../types';
import { Sparkles, Heart, Zap, Coins, ShieldCheck, Award } from 'lucide-react';
import { audioService } from '../services/audioService';
import { triggerHaptic, hapticPatterns } from '../utils/haptics';
import { triggerEcoActionBurst } from './EcoParticleCanvas';
import { showToast } from './ToastNotification';

interface Props {
  user: User;
  onUpdateUser: (updated: Partial<User>) => void;
}

export const EcoPetView: React.FC<Props> = ({ user, onUpdateUser }) => {
  const [happiness, setHappiness] = useState(88);
  const [auraLevel, setAuraLevel] = useState(94);
  const [hydration, setHydration] = useState(90);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const stages = [
    { name: 'Sprout', levelReq: 1, icon: '🌱', desc: 'A tiny neon seedling born from campus conservation.' },
    { name: 'Cyber Sapling', levelReq: 5, icon: '🌿', desc: 'Resilient digital plant glowing with clean energy.' },
    { name: 'Cyber Tree', levelReq: 10, icon: '🌳', desc: 'Majestic ecosystem node purifying campus air.' },
    { name: 'Ecosystem Guardian', levelReq: 15, icon: '🌲', desc: 'High-tech biodiversity sentinel with energy aura.' },
    { name: 'Planetary Guardian', levelReq: 20, icon: '🐉', desc: 'Legendary elemental spirit protecting the campus arena.' }
  ];

  const currentStageObj = stages.find(s => s.name === user.ecoSpiritStage) || stages[1];

  // React-Spring useSpring animation for interactive pet hover bounce and morphing
  const petBounceSpring = useSpring({
    transform: isHovered
      ? 'scale(1.16) translateY(-10px) rotate(-6deg)'
      : 'scale(1) translateY(0px) rotate(0deg)',
    borderRadius: isHovered ? '40% 60% 70% 30% / 40% 50% 60% 50%' : '50%',
    config: { mass: 1, tension: 280, friction: 14 }
  });

  const handleFeed = (e: React.MouseEvent) => {
    if (user.coins < 50) return;
    audioService.playQuestComplete();
    triggerHaptic(hapticPatterns.successPulse);
    triggerEcoActionBurst(e.clientX, e.clientY);
    setIsCelebrating(true);
    setHappiness(prev => Math.min(100, prev + 10));
    setHydration(prev => Math.min(100, prev + 15));

    onUpdateUser({
      coins: user.coins - 50,
      xp: user.xp + 30
    });

    showToast({
      type: 'success',
      title: `${user.ecoSpiritName} Nourished!`,
      message: 'Happiness +10, Hydration +15. Energy boost applied!',
      xpReward: 30
    });

    setTimeout(() => setIsCelebrating(false), 1400);
  };

  const handlePet = (e?: React.MouseEvent) => {
    audioService.playHover();
    triggerHaptic(hapticPatterns.mediumTap);
    if (e) triggerEcoActionBurst(e.clientX, e.clientY);
    setIsCelebrating(true);
    setHappiness(prev => Math.min(100, prev + 5));
    setTimeout(() => setIsCelebrating(false), 1000);
  };

  const handleManualEvolve = (e: React.MouseEvent) => {
    if (user.coins < 300) return;
    audioService.playPetEvolve();
    triggerHaptic(hapticPatterns.levelUpBurst);
    triggerEcoActionBurst(e.clientX, e.clientY);
    setIsCelebrating(true);

    let nextStage = 'Cyber Tree';
    if (user.ecoSpiritStage === 'Sprout') nextStage = 'Cyber Sapling';
    else if (user.ecoSpiritStage === 'Cyber Sapling') nextStage = 'Cyber Tree';
    else if (user.ecoSpiritStage === 'Cyber Tree') nextStage = 'Ecosystem Guardian';
    else if (user.ecoSpiritStage === 'Ecosystem Guardian') nextStage = 'Planetary Guardian';

    onUpdateUser({
      coins: user.coins - 300,
      ecoSpiritStage: nextStage as User['ecoSpiritStage'],
      ecoSpiritStageLevel: user.ecoSpiritStageLevel + 1
    });

    showToast({
      type: 'success',
      title: 'EVOLUTION COMPLETE!',
      message: `${user.ecoSpiritName} evolved to ${nextStage}! Aura resonance boosted.`,
      xpReward: 150
    });

    setTimeout(() => setIsCelebrating(false), 1800);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 backdrop-blur-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" /> DIGITAL ECO-PET CHAMBER
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">ECO SPIRIT: {user.ecoSpiritName}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Your digital pet reacts physically to your touch, grows with quest completions, and protects your guild.
          </p>
        </div>

        <div className="bg-slate-950 border border-emerald-500/30 px-4 py-2 rounded-2xl font-mono text-xs text-right">
          <span className="text-slate-400">STAGE:</span>{' '}
          <strong className="text-emerald-400">{user.ecoSpiritStage}</strong>
        </div>
      </div>

      {/* Main Pet Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Pet Display Stage */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-8 backdrop-blur-xl flex flex-col items-center text-center relative overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Glowing Aura Ring */}
          <div className="relative my-8">
            <motion.div
              animate={{
                scale: isCelebrating ? [1, 1.25, 1] : [0.95, 1.05, 0.95],
                rotate: [0, 360]
              }}
              transition={{
                scale: { duration: isCelebrating ? 0.6 : 3, repeat: Infinity },
                rotate: { duration: 12, repeat: Infinity, ease: 'linear' }
              }}
              className="w-48 h-48 rounded-full border-2 border-dashed border-emerald-400/60 shadow-[0_0_50px_rgba(16,185,129,0.4)] flex items-center justify-center"
            />

            {/* React-Spring Physical Morphing EcoPet Container */}
            <animated.div style={petBounceSpring} className="absolute inset-0 m-auto w-36 h-36">
              <motion.div
                onMouseEnter={() => {
                  setIsHovered(true);
                  triggerHaptic(hapticPatterns.lightTap);
                }}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handlePet}
                whileTap={{ scale: 0.88, rotate: -10 }}
                animate={
                  isCelebrating
                    ? {
                        scale: [1, 1.35, 0.88, 1.2, 1],
                        rotate: [0, -18, 18, -10, 0],
                        y: [0, -28, 6, -12, 0]
                      }
                    : {
                        y: [0, -8, 0]
                      }
                }
                transition={
                  isCelebrating
                    ? { duration: 1.2, ease: 'easeInOut' }
                    : {
                        type: 'spring',
                        stiffness: 320,
                        damping: 12,
                        y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }
                      }
                }
                className="w-full h-full rounded-full bg-gradient-to-tr from-emerald-950 via-teal-900 to-slate-900 border-2 border-[#B8E65A] flex items-center justify-center text-6xl shadow-[0_0_35px_rgba(184,230,90,0.5)] cursor-pointer select-none"
              >
                <span className="filter drop-shadow-[0_0_12px_rgba(184,230,90,0.8)]">
                  {currentStageObj.icon}
                </span>
              </motion.div>
            </animated.div>
          </div>

          <h3 className="text-2xl font-black text-white">{user.ecoSpiritName}</h3>
          <p className="text-xs text-emerald-400 font-mono font-bold mt-1 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#B8E65A]" /> {user.ecoSpiritStage} • LVL {user.ecoSpiritStageLevel}
          </p>
          <p className="text-xs text-slate-300 max-w-sm mt-2 leading-relaxed">
            {currentStageObj.desc}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 font-mono">
            <button
              onClick={handlePet}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400/30" />
              <span>PET SPIRIT</span>
            </button>

            <button
              onClick={handleFeed}
              className="bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-400 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Coins className="w-4 h-4 text-amber-400" />
              <span>FEED (50 COINS)</span>
            </button>

            <button
              onClick={handleManualEvolve}
              className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-black px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer flex items-center gap-1.5 transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>EVOLVE (300 COINS)</span>
            </button>
          </div>
        </div>

        {/* Right: Mood Meters & Evolution Path */}
        <div className="space-y-6">
          
          {/* Mood Meters */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4 font-mono">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" /> SPIRIT VITALITY
            </h4>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">HAPPINESS</span>
                <span className="text-rose-400 font-bold">{happiness}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${happiness}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">ECO AURA</span>
                <span className="text-emerald-400 font-bold">{auraLevel}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${auraLevel}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">HYDRATION</span>
                <span className="text-cyan-400 font-bold">{hydration}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${hydration}%` }} />
              </div>
            </div>
          </div>

          {/* Evolution Roadmap */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-3 font-mono">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" /> EVOLUTION ROADMAP
            </h4>

            <div className="space-y-2">
              {stages.map((st, i) => {
                const isUnlocked = user.level >= st.levelReq || user.ecoSpiritStage === st.name;
                return (
                  <div
                    key={st.name}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      isUnlocked
                        ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{st.icon}</span>
                      <span>{st.name}</span>
                    </div>
                    <span>LVL {st.levelReq}+</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
