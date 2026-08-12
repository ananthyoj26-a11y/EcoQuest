import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Terminal } from 'lucide-react';
import { audioService } from '../services/audioService';

interface Props {
  onComplete: () => void;
}

export const CinematicPreloader: React.FC<Props> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);

  const statusMessages = [
    'CONNECTING TO CAMPUS SENSOR NETWORK...',
    'LOADING PLAYER GAMING PROFILE...',
    'SYNCHRONIZING ECO WORLD ISOMETRIC MAP...',
    'CALIBRATING ECO SPIRIT DIGITAL PET...',
    'INITIALIZING AI ECO COACH ENGINE...',
    'SYSTEM ONLINE - WELCOME TO ARENA'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 400);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const idx = Math.min(Math.floor((progress / 100) * statusMessages.length), statusMessages.length - 1);
    setStatusIndex(idx);
  }, [progress, statusMessages.length]);

  const handleSkip = () => {
    audioService.playClick();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070a0f] text-emerald-400 font-mono flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      {/* Background Matrix/Cyber Stream Effects */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      
      <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center">
        {/* Animated Cyber Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.95, 1.05, 1], opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
          className="w-20 h-20 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-6"
        >
          <Shield className="w-10 h-10 text-emerald-400" />
        </motion.div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold tracking-widest text-white mb-1 font-sans drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]">
          ECO<span className="text-emerald-400">QUEST</span>
        </h1>
        <p className="text-xs text-cyan-400 tracking-widest mb-8 uppercase font-mono">
          Campus Eco Gaming Arena • Saranathan AI & DS
        </p>

        {/* Status Line */}
        <div className="flex items-center gap-2 text-xs text-emerald-400/90 mb-3 bg-emerald-950/30 px-3 py-1.5 rounded border border-emerald-800/40 w-full justify-center">
          <Terminal className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span className="truncate">{statusMessages[statusIndex]}</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-900/80 border border-emerald-500/30 rounded-full p-1 shadow-inner mb-4 relative">
          <motion.div
            className="h-3 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Counter */}
        <div className="flex justify-between w-full text-xs text-slate-400 mb-8 font-mono">
          <span>INITIALIZING</span>
          <span className="text-emerald-400 font-bold">{progress}%</span>
        </div>

        {/* Skip Button for judges/speed demo */}
        <button
          onClick={handleSkip}
          className="text-xs text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 underline decoration-emerald-500/40 underline-offset-4 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Press to enter arena immediately</span>
        </button>
      </div>
    </div>
  );
};
