import React, { useState } from 'react';
import { ShieldAlert, Plus, Sparkles, CheckCircle2, Flame, Target } from 'lucide-react';
import { apiService } from '../services/apiService';
import { audioService } from '../services/audioService';

interface Props {
  onRefreshQuests: () => void;
  onRefreshBounties: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ onRefreshQuests, onRefreshBounties }) => {
  const [questTitle, setQuestTitle] = useState('');
  const [questDesc, setQuestDesc] = useState('');
  const [questCategory, setQuestCategory] = useState<'Plastic' | 'Water' | 'Energy' | 'Mobility' | 'Biodiversity'>('Plastic');
  const [questXp, setQuestXp] = useState(100);
  const [questCoins, setQuestCoins] = useState(50);
  const [msg, setMsg] = useState<string | null>(null);

  const [bountyTitle, setBountyTitle] = useState('');
  const [bountyDesc, setBountyDesc] = useState('');
  const [bountyXp, setBountyXp] = useState(250);
  const [bountyLocation, setBountyLocation] = useState('Block A Classrooms');

  const handleCreateQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questTitle.trim()) return;

    audioService.playClick();
    try {
      await apiService.adminCreateQuest({
        title: questTitle,
        description: questDesc,
        category: questCategory,
        xp: Number(questXp),
        coins: Number(questCoins)
      });
      audioService.playQuestComplete();
      setMsg('New Campus Quest published to student arena!');
      setQuestTitle('');
      setQuestDesc('');
      onRefreshQuests();
    } catch (err) {
      console.error('Create quest error:', err);
    }
  };

  const handleCreateBounty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bountyTitle.trim()) return;

    audioService.playClick();
    try {
      await apiService.adminCreateBounty({
        title: bountyTitle,
        description: bountyDesc,
        rewardXp: Number(bountyXp),
        rewardCoins: Math.floor(Number(bountyXp) * 0.6),
        location: bountyLocation
      });
      audioService.playQuestComplete();
      setMsg('New High-Value Bounty launched to student arena!');
      setBountyTitle('');
      setBountyDesc('');
      onRefreshBounties();
    } catch (err) {
      console.error('Create bounty error:', err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title */}
      <div className="bg-slate-900/90 border border-rose-500/30 rounded-3xl p-6 backdrop-blur-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-rose-400 bg-rose-950/80 px-3 py-1 rounded-full border border-rose-500/30 uppercase mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> FACULTY & DIRECTOR CONTROL ROOM
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">ADMIN ARENA CONTROL</h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish new daily quests, schedule high-value bounties, and audit campus environmental progress.
          </p>
        </div>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Publish Quest Form */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
          <h3 className="font-extrabold text-sm text-white tracking-wider font-mono uppercase flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" /> PUBLISH NEW DAILY QUEST
          </h3>

          <form onSubmit={handleCreateQuest} className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Quest Title</label>
              <input
                type="text"
                required
                value={questTitle}
                onChange={(e) => setQuestTitle(e.target.value)}
                placeholder="e.g. Lab 3 Energy Audit"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Description</label>
              <textarea
                value={questDesc}
                onChange={(e) => setQuestDesc(e.target.value)}
                placeholder="Quest action details for students..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 h-20"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={questCategory}
                  onChange={(e) => setQuestCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2.5 text-emerald-400 focus:outline-none"
                >
                  <option value="Plastic">Plastic</option>
                  <option value="Water">Water</option>
                  <option value="Energy">Energy</option>
                  <option value="Mobility">Mobility</option>
                  <option value="Biodiversity">Biodiversity</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">XP Reward</label>
                <input
                  type="number"
                  value={questXp}
                  onChange={(e) => setQuestXp(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Coins</label>
                <input
                  type="number"
                  value={questCoins}
                  onChange={(e) => setQuestCoins(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2.5 text-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black py-3 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
            >
              PUBLISH QUEST TO ARENA
            </button>
          </form>
        </div>

        {/* Launch Bounty Form */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
          <h3 className="font-extrabold text-sm text-white tracking-wider font-mono uppercase flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" /> LAUNCH TIMED BOUNTY
          </h3>

          <form onSubmit={handleCreateBounty} className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Bounty Title</label>
              <input
                type="text"
                required
                value={bountyTitle}
                onChange={(e) => setBountyTitle(e.target.value)}
                placeholder="e.g. Block C Rooftop Cleanliness Drive"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Description</label>
              <textarea
                value={bountyDesc}
                onChange={(e) => setBountyDesc(e.target.value)}
                placeholder="Timed bounty targets and instructions..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 h-20"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">XP Reward</label>
                <input
                  type="number"
                  value={bountyXp}
                  onChange={(e) => setBountyXp(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2.5 text-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  value={bountyLocation}
                  onChange={(e) => setBountyLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2.5 text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black py-3 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
            >
              LAUNCH BOUNTY RAID
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
