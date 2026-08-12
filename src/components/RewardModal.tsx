import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, Coins, CheckCircle2 } from 'lucide-react';

interface Props {
  xpEarned: number;
  coinsEarned: number;
  title: string;
  onClose: () => void;
}

export const RewardModal: React.FC<Props> = ({ xpEarned, coinsEarned, title, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#070a0f]/90 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-slate-900 border-2 border-emerald-400 rounded-3xl p-8 max-w-sm w-full text-center relative shadow-[0_0_80px_rgba(16,185,129,0.5)] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.8 }}
          className="w-20 h-20 mx-auto rounded-3xl bg-emerald-950 border border-emerald-400 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)] mb-4"
        >
          <Sparkles className="w-10 h-10 animate-pulse" />
        </motion.div>

        <h3 className="text-2xl font-black text-white tracking-tight">MISSION ACCOMPLISHED!</h3>
        <p className="text-xs text-emerald-400 font-mono font-bold mt-1 uppercase">{title}</p>

        <div className="grid grid-cols-2 gap-3 my-6 font-mono">
          <div className="bg-slate-950 border border-emerald-500/40 p-3 rounded-2xl">
            <div className="text-[10px] text-slate-400">XP EARNED</div>
            <div className="text-xl font-black text-emerald-400">+{xpEarned} XP</div>
          </div>

          <div className="bg-slate-950 border border-amber-500/40 p-3 rounded-2xl">
            <div className="text-[10px] text-slate-400">ECO COINS</div>
            <div className="text-xl font-black text-amber-400">+{coinsEarned} 🪙</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm uppercase py-3.5 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.5)] cursor-pointer transition-all transform active:scale-95"
        >
          CLAIM & CONTINUE
        </button>
      </motion.div>
    </div>
  );
};
