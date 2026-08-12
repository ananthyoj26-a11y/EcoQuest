import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Sparkles, ShieldCheck, Wifi, WifiOff, AlertCircle, X, Coins, Zap } from 'lucide-react';
import { triggerHaptic, hapticPatterns } from '../utils/haptics';
import { audioService } from '../services/audioService';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'offline' | 'online';
  title: string;
  message?: string;
  xpReward?: number;
  coinReward?: number;
  duration?: number;
}

// Global listener store for reactive toast triggers
type ToastListener = (toast: ToastMessage) => void;
const listeners: ToastListener[] = [];

export const showToast = (toast: Omit<ToastMessage, 'id'>) => {
  const newToast: ToastMessage = {
    ...toast,
    id: Math.random().toString(36).substring(2, 9)
  };
  listeners.forEach(fn => fn(newToast));
};

export const ToastNotificationContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleNewToast = (toast: ToastMessage) => {
      // Trigger haptic & sound feedback
      if (toast.type === 'success') {
        triggerHaptic(hapticPatterns.successPulse);
        audioService.playQuestComplete();
      } else if (toast.type === 'offline') {
        triggerHaptic(hapticPatterns.errorShake);
      } else {
        triggerHaptic(hapticPatterns.lightTap);
        audioService.playClick();
      }

      setToasts(prev => [toast, ...prev].slice(0, 4));

      // Auto dismiss
      const duration = toast.duration || 4000;
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, duration);
    };

    listeners.push(handleNewToast);
    return () => {
      const idx = listeners.indexOf(handleNewToast);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-2 sm:px-0">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => {
          let badgeBg = 'bg-emerald-950 border-emerald-500/50 text-emerald-400';
          let shadowGlow = 'shadow-[0_0_25px_rgba(22,163,106,0.35)]';
          let borderAccent = 'border-[#16A36A]';
          let IconComp = CheckCircle2;

          if (toast.type === 'offline') {
            badgeBg = 'bg-amber-950 border-amber-500/50 text-amber-400';
            shadowGlow = 'shadow-[0_0_25px_rgba(245,158,11,0.3)]';
            borderAccent = 'border-amber-500';
            IconComp = WifiOff;
          } else if (toast.type === 'online') {
            badgeBg = 'bg-cyan-950 border-cyan-500/50 text-cyan-400';
            shadowGlow = 'shadow-[0_0_25px_rgba(56,189,248,0.3)]';
            borderAccent = 'border-cyan-400';
            IconComp = Wifi;
          } else if (toast.type === 'warning') {
            badgeBg = 'bg-rose-950 border-rose-500/50 text-rose-400';
            shadowGlow = 'shadow-[0_0_25px_rgba(244,63,94,0.3)]';
            borderAccent = 'border-rose-500';
            IconComp = AlertCircle;
          }

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`pointer-events-auto bg-slate-900/95 backdrop-blur-xl border-l-4 ${borderAccent} border-t border-r border-b border-slate-700/60 p-4 rounded-2xl ${shadowGlow} flex items-start gap-3.5 relative overflow-hidden`}
            >
              {/* Radial background highlight */}
              <div className="absolute -top-10 -left-10 w-28 h-28 bg-[#16A36A]/10 rounded-full blur-xl pointer-events-none" />

              {/* Icon Container */}
              <div className={`p-2 rounded-xl ${badgeBg} border shrink-0 mt-0.5`}>
                <IconComp className="w-5 h-5 animate-pulse" />
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-white tracking-tight leading-tight">
                    {toast.title}
                  </h4>
                  {toast.type === 'success' && (
                    <Sparkles className="w-3.5 h-3.5 text-[#B8E65A] shrink-0" />
                  )}
                </div>

                {toast.message && (
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed font-sans">
                    {toast.message}
                  </p>
                )}

                {/* Optional XP & Coin Badges */}
                {(toast.xpReward || toast.coinReward) && (
                  <div className="flex items-center gap-2 mt-2 font-mono text-[11px]">
                    {toast.xpReward && (
                      <span className="bg-emerald-950/80 border border-emerald-500/50 text-[#B8E65A] px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#B8E65A]" /> +{toast.xpReward} XP
                      </span>
                    )}
                    {toast.coinReward && (
                      <span className="bg-amber-950/80 border border-amber-500/50 text-amber-300 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                        <Coins className="w-3 h-3 text-amber-400" /> +{toast.coinReward}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800 shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
