import React from 'react';
import { LeaderboardEntry, DepartmentRank, User } from '../types';
import { Trophy, Flame, Shield, Users, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';

interface Props {
  user: User;
  students: LeaderboardEntry[];
  departments: DepartmentRank[];
}

export const LeaderboardView: React.FC<Props> = ({ user, students, departments }) => {
  return (
    <div className="space-y-6 font-sans">
      
      {/* Title */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 backdrop-blur-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30 uppercase mb-2">
            <Trophy className="w-3.5 h-3.5" /> ARENA RANKINGS
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">CAMPUS LEADERBOARDS</h1>
          <p className="text-xs text-slate-400 mt-1">
            Official ranking of students and department guilds competing across Saranathan College of Engineering.
          </p>
        </div>

        <div className="bg-slate-950 border border-emerald-500/30 px-4 py-2.5 rounded-2xl font-mono text-xs text-right">
          <span className="text-slate-400">YOUR CAMPUS RANK:</span>{' '}
          <strong className="text-emerald-400 text-base">#{user.campusRank}</strong>
        </div>
      </div>

      {/* Main Leaderboard Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between font-mono text-xs text-slate-400 pb-3 border-b border-slate-800 px-2">
          <span>STUDENT PLAYER</span>
          <span>STATS & STREAK</span>
        </div>

        <div className="space-y-2.5 font-sans">
          {students.map((st) => {
            const isCurrent = st.userId === user.id || st.username === user.name;
            const rankDiff = st.previousRank - st.rank;

            return (
              <div
                key={st.userId}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                  isCurrent
                    ? 'bg-emerald-950/60 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-mono font-black text-sm w-7 text-center ${
                    st.rank === 1 ? 'text-amber-400' : st.rank === 2 ? 'text-slate-300' : st.rank === 3 ? 'text-amber-600' : 'text-slate-400'
                  }`}>
                    #{st.rank}
                  </span>

                  <img
                    src={(isCurrent && user.photoURL) || st.avatar}
                    alt={st.username}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop';
                    }}
                  />

                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-2">
                      <span>{st.username}</span>
                      {isCurrent && (
                        <span className="text-[9px] bg-emerald-400 text-slate-950 font-mono font-black px-1.5 py-0.2 rounded">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                      <span>{st.department}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">LVL {st.level}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 font-mono text-xs">
                  <div className="text-right">
                    <div className="font-black text-emerald-400">{st.xp.toLocaleString()} XP</div>
                    <div className="text-[10px] text-rose-400 flex items-center justify-end gap-1">
                      <Flame className="w-3 h-3 fill-current" /> {st.streak}D STREAK
                    </div>
                  </div>

                  {rankDiff > 0 && (
                    <span className="text-emerald-400 text-[10px] flex items-center gap-0.5 bg-emerald-950 px-2 py-1 rounded">
                      <ArrowUp className="w-3 h-3" /> +{rankDiff}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
