import React, { useState } from 'react';
import { Guild, DepartmentRank, User } from '../types';
import { Swords, Shield, Users, Trophy, Plus, MapPin, Sparkles } from 'lucide-react';
import { apiService } from '../services/apiService';
import { audioService } from '../services/audioService';

interface Props {
  user: User;
  guilds: Guild[];
  departmentRanks: DepartmentRank[];
  onRefreshGuilds: () => void;
}

export const GuildWarsView: React.FC<Props> = ({
  user,
  guilds,
  departmentRanks,
  onRefreshGuilds
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGuildName, setNewGuildName] = useState('');
  const [newGuildTag, setNewGuildTag] = useState('');
  const [newGuildDesc, setNewGuildDesc] = useState('');

  const handleJoinGuild = async (guildId: string) => {
    audioService.playClick();
    try {
      await apiService.joinGuild(guildId);
      audioService.playQuestAccepted();
      onRefreshGuilds();
    } catch (err) {
      console.error('Join guild error:', err);
    }
  };

  const handleCreateGuild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuildName.trim() || !newGuildTag.trim()) return;

    audioService.playClick();
    try {
      await apiService.createGuild(newGuildName, newGuildTag, newGuildDesc);
      audioService.playQuestComplete();
      setShowCreateModal(false);
      setNewGuildName('');
      setNewGuildTag('');
      setNewGuildDesc('');
      onRefreshGuilds();
    } catch (err) {
      console.error('Create guild error:', err);
    }
  };

  const topScore = departmentRanks[0]?.score || 50000;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Title */}
      <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 backdrop-blur-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-purple-400 bg-purple-950/80 px-3 py-1 rounded-full border border-purple-500/30 uppercase mb-2">
            <Swords className="w-3.5 h-3.5" /> CAMPUS INTER-DEPARTMENT ARENA
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">DEPARTMENT GUILD WARS</h1>
          <p className="text-xs text-slate-400 mt-1">
            Every completed quest, scanned QR portal, and verified action adds points to your department's arena score.
          </p>
        </div>

        <button
          onClick={() => {
            audioService.playClick();
            setShowCreateModal(true);
          }}
          className="bg-purple-950 hover:bg-purple-900 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold px-4 py-2.5 rounded-2xl transition-colors cursor-pointer flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE STUDENT CLAN</span>
        </button>
      </div>

      {/* Main Grid: Department Standings + Campus Territory Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Department Rankings */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
          <h3 className="font-extrabold text-sm text-white tracking-wider font-mono uppercase flex items-center gap-2">
            <Trophy className="w-4 h-4 text-purple-400" /> DEPARTMENT ARENA LEADERBOARD
          </h3>

          <div className="space-y-3 font-mono">
            {departmentRanks.map((deptRank) => {
              const scorePercent = Math.min(100, Math.round((deptRank.score / topScore) * 100));
              const isUserDept = deptRank.department === user.department;
              return (
                <div
                  key={deptRank.department}
                  className={`p-4 rounded-2xl border transition-all ${
                    isUserDept
                      ? 'bg-purple-950/50 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'bg-slate-950/80 border-slate-800/80'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-slate-400 text-sm">#{deptRank.rank}</span>
                      <span className="font-bold text-white text-sm">{deptRank.department}</span>
                      {isUserDept && (
                        <span className="text-[10px] bg-purple-500 text-slate-950 px-2 py-0.5 rounded font-bold">
                          YOUR GUILD
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-purple-400 text-sm">{deptRank.score.toLocaleString()} PTS</span>
                      <div className="text-[10px] text-emerald-400">+{deptRank.weeklyGrowth}% this week</div>
                    </div>
                  </div>

                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400"
                      style={{ width: `${scorePercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Campus Territory Control Map */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-white tracking-wider font-mono uppercase flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-purple-400" /> TERRITORY CONTROL
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Visual control map of campus blocks. High-scoring departments hold dominant energy zones.
            </p>

            <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-4 space-y-3 font-mono text-xs">
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex justify-between items-center">
                <span>Block A (AI & DS)</span>
                <span className="text-emerald-400 font-bold">CONTROLLED ✓</span>
              </div>

              <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-xl flex justify-between items-center">
                <span>Block B (ECE)</span>
                <span className="text-cyan-400 font-bold">CONTESTED</span>
              </div>

              <div className="p-3 bg-purple-950/40 border border-purple-500/40 rounded-xl flex justify-between items-center">
                <span>Library Quad (CSE)</span>
                <span className="text-purple-400 font-bold">STABLE</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-500 text-center">
            Updated live from campus quest activity
          </div>
        </div>

      </div>

      {/* Student Guilds / Clans List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
        <h3 className="font-extrabold text-sm text-white tracking-wider font-mono uppercase flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-purple-400" /> ACTIVE STUDENT CLANS ({guilds.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {guilds.map((g) => (
            <div key={g.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                    [{g.tag}]
                  </span>
                  <span className="text-xs font-mono text-slate-400">LVL {g.level}</span>
                </div>

                <h4 className="font-extrabold text-white text-base mb-1">{g.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{g.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center font-mono text-xs">
                <span className="text-slate-400">{g.membersCount} / {g.maxMembers} Members</span>
                <button
                  onClick={() => handleJoinGuild(g.id)}
                  className="bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-700 px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Join Clan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Guild Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#070a0f]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 max-w-md w-full font-sans text-slate-100">
            <h3 className="text-xl font-black text-white mb-2">CREATE STUDENT CLAN</h3>
            <p className="text-xs text-slate-400 mb-4 font-mono">Form a group with campus friends to earn combined guild bonuses.</p>

            <form onSubmit={handleCreateGuild} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Clan Name</label>
                <input
                  type="text"
                  required
                  value={newGuildName}
                  onChange={(e) => setNewGuildName(e.target.value)}
                  placeholder="e.g. Cyber Botanists"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Clan Tag (3 Letters)</label>
                <input
                  type="text"
                  required
                  maxLength={3}
                  value={newGuildTag}
                  onChange={(e) => setNewGuildTag(e.target.value.toUpperCase())}
                  placeholder="BOT"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-purple-400 font-mono font-bold focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Description</label>
                <textarea
                  value={newGuildDesc}
                  onChange={(e) => setNewGuildDesc(e.target.value)}
                  placeholder="What is your clan's eco mission?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 h-20"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/2 bg-slate-800 text-slate-300 font-mono text-xs font-bold py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-mono text-xs font-bold py-2.5 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  Create Clan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
