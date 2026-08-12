import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, UserCheck, Play, Globe } from 'lucide-react';
import { Department, User } from '../types';
import { audioService } from '../services/audioService';

interface Props {
  onLogin: (name: string, email: string, department: Department) => void;
}

export const LoginLobby: React.FC<Props> = ({ onLogin }) => {
  const [name, setName] = useState('Alex Vance');
  const [email, setEmail] = useState('alex.vance@saranathan.ac.in');
  const [department, setDepartment] = useState<Department>('AI & DS');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const departmentsList: Department[] = [
    'AI & DS',
    'ECE',
    'CSE',
    'MECHANICAL',
    'IT',
    'BIOTECH',
    'CIVIL',
    'EEE'
  ];

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    audioService.playClick();
    setIsAuthenticating(true);

    setTimeout(() => {
      audioService.playQuestAccepted();
      onLogin(name, email, department);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#070a0f] text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden select-none font-sans">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Top Header Branding */}
      <div className="relative z-10 flex justify-between items-center max-w-6xl mx-auto w-full pt-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="font-extrabold tracking-wider text-xl text-white">ECO<span className="text-emerald-400">QUEST</span></h2>
            <p className="text-[10px] text-cyan-400 tracking-widest font-mono uppercase">Department of AI & DS • Saranathan College</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full text-slate-400">
          <Globe className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          <span>CAMPUS SERVER ACTIVE</span>
        </div>
      </div>

      {/* Main Center Area */}
      <div className="relative z-10 max-w-md mx-auto w-full my-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        >
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-widest uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3 h-3" /> ARENA AUTHENTICATION
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">PLAY FOR THE PLANET</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transform campus sustainability into daily RPG progression, guild wars, and AI-verified quests.
            </p>
          </div>

          <form onSubmit={handleStart} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                Player Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-sans"
                placeholder="e.g. Alex Vance"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                Campus Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors font-sans"
                placeholder="student@saranathan.ac.in"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                Department Guild
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-emerald-400 focus:outline-none focus:border-emerald-500 transition-colors font-mono cursor-pointer"
              >
                {departmentsList.map((dept) => (
                  <option key={dept} value={dept} className="bg-slate-900 text-white">
                    {dept} GUILD
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={(e) => handleStart(e as unknown as React.FormEvent)}
                disabled={isAuthenticating}
                className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all cursor-pointer font-sans"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>CONTINUE WITH GOOGLE</span>
              </button>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold py-3.5 px-6 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-95"
              >
                {isAuthenticating ? (
                  <>
                    <UserCheck className="w-5 h-5 animate-pulse" />
                    <span>DETECTING PLAYER DATA...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>PRESS START TO ENTER ARENA</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>GOOGLE AUTH ACTIVE</span>
            <span className="text-emerald-400">DEMO READY ✓</span>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center text-xs text-slate-500 font-mono py-2">
        ECOQUEST v2.4 • Developed for AI Startup Arena • Saranathan College of Engineering
      </div>
    </div>
  );
};
