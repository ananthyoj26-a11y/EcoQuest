import React, { useState, useEffect } from 'react';
import { Bounty, User } from '../types';
import { Flame, Clock, MapPin, Users, Coins, CheckCircle2, Shield } from 'lucide-react';
import { apiService } from '../services/apiService';
import { audioService } from '../services/audioService';
import { triggerHaptic, hapticPatterns } from '../utils/haptics';
import { triggerEcoActionBurst } from './EcoParticleCanvas';
import { showToast } from './ToastNotification';

interface Props {
  user: User;
  bounties: Bounty[];
  onRefreshBounties: () => void;
}

export const BountiesView: React.FC<Props> = ({ user, bounties, onRefreshBounties }) => {
  const [timeLeftStr, setTimeLeftStr] = useState<string>('02:14:32');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const remainingSeconds = 3600 * 2.5 - (Math.floor(now.getTime() / 1000) % 3600);
      const hours = String(Math.floor(remainingSeconds / 3600)).padStart(2, '0');
      const mins = String(Math.floor((remainingSeconds % 3600) / 60)).padStart(2, '0');
      const secs = String(remainingSeconds % 60).padStart(2, '0');
      setTimeLeftStr(`${hours}:${mins}:${secs}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAcceptBounty = async (bountyId: string, e?: React.MouseEvent) => {
    const bounty = bounties.find(b => b.id === bountyId);
    audioService.playQuestAccepted();
    triggerHaptic(hapticPatterns.mediumTap);
    if (e) triggerEcoActionBurst(e.clientX, e.clientY);
    try {
      await apiService.acceptBounty(bountyId);
      showToast({
        type: 'success',
        title: 'Bounty Claimed!',
        message: `Assigned bounty "${bounty?.title || 'Guild Raid'}" to active squad.`
      });
      onRefreshBounties();
    } catch (err) {
      console.error('Accept bounty error:', err);
    }
  };

  const handleCompleteBounty = async (bountyId: string, e?: React.MouseEvent) => {
    const bounty = bounties.find(b => b.id === bountyId);
    audioService.playQuestComplete();
    triggerHaptic(hapticPatterns.levelUpBurst);
    if (e) triggerEcoActionBurst(e.clientX, e.clientY);
    try {
      await apiService.completeBounty(bountyId);
      showToast({
        type: 'success',
        title: 'Bounty Completed!',
        message: `Guild Raid verified: "${bounty?.title || 'Clean Raid'}"`,
        xpReward: bounty?.rewardXp || 250,
        coinReward: bounty?.rewardCoins || 150
      });
      onRefreshBounties();
    } catch (err) {
      console.error('Complete bounty error:', err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 backdrop-blur-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30 uppercase mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" /> TIMED HIGH-VALUE MISSIONS
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">TIMED BOUNTY BOARD</h1>
          <p className="text-xs text-slate-400 mt-1">
            Urgent campus sustainability raids with massive XP and Eco Coin multipliers. Complete before the countdown expires!
          </p>
        </div>

        <div className="bg-slate-950 border border-amber-500/40 px-4 py-2.5 rounded-2xl font-mono text-xs text-right">
          <div className="text-slate-400 text-[10px]">NEXT BOUNTY REFRESH IN:</div>
          <div className="text-amber-400 font-extrabold text-lg tracking-widest">{timeLeftStr}</div>
        </div>
      </div>

      {/* Bounties List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bounties.map((b) => (
          <div
            key={b.id}
            className={`bg-slate-900/90 border rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between transition-all relative overflow-hidden ${
              b.completed ? 'border-amber-500/40 bg-amber-950/10' : 'border-slate-800 hover:border-amber-500/50'
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2.5 py-1 rounded-full border border-amber-800 uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3" /> TIMED RAID
                </span>

                <span className="text-xs font-mono text-amber-400 font-extrabold">
                  +{b.rewardXp} XP • +{b.rewardCoins} 🪙
                </span>
              </div>

              <h3 className="text-xl font-black text-white mb-2 flex items-center justify-between">
                <span>{b.title}</span>
                {b.completed && <CheckCircle2 className="w-6 h-6 text-amber-400 shrink-0" />}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {b.description}
              </p>

              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-3 mb-4 text-xs font-mono text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" /> {b.location}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-400" /> {b.currentParticipants} / {b.maxParticipants} Joined
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center font-mono text-xs">
              <span className="text-slate-500 text-[10px]">AUTO-EXPIRES SOON</span>

              {b.completed ? (
                <span className="text-emerald-400 font-bold">BOUNTY CLAIMED ✓</span>
              ) : !b.accepted ? (
                <button
                  onClick={() => handleAcceptBounty(b.id)}
                  className="bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-500/40 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  ACCEPT BOUNTY
                </button>
              ) : (
                <button
                  onClick={() => handleCompleteBounty(b.id)}
                  className="bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-black shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer"
                >
                  COMPLETE & CLAIM
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
