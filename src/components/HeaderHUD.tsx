import React, { useState } from 'react';
import { User } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
import {
  Shield,
  Zap,
  Coins,
  Flame,
  Volume2,
  VolumeX,
  Bell,
  Search,
  BatteryCharging,
  X,
  Sparkles
} from 'lucide-react';
import { audioService } from '../services/audioService';

interface Props {
  user: User;
  onOpenCommandPalette?: () => void;
  onOpenSearch?: () => void;
  onOpenAdmin?: () => void;
  onOpenProfile?: () => void;
  onOpenJudgeDemo?: () => void;
  onOpenLanding?: () => void;
  lowPowerMode?: boolean;
  onToggleLowPower?: () => void;
  notificationsOpen?: boolean;
  setNotificationsOpen?: (open: boolean) => void;
}

export interface StreakCounterProps {
  streak: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ streak }) => {
  let fireAnimClass = 'fire-anim-sm';
  let auraClass = '';
  let pillBorder = 'border-amber-500/40 bg-amber-950/40 text-amber-300';
  let flameIconColor = 'text-amber-400 fill-amber-500/20';

  if (streak > 15) {
    fireAnimClass = 'fire-anim-godlike';
    auraClass = 'fire-aura-godlike';
    pillBorder = 'border-[#B8E65A] bg-slate-950 text-[#B8E65A] font-black';
    flameIconColor = 'text-[#B8E65A] fill-[#B8E65A]/40';
  } else if (streak >= 5) {
    fireAnimClass = 'fire-anim-md';
    auraClass = 'fire-aura-md';
    pillBorder = 'border-orange-500/60 bg-orange-950/50 text-orange-300';
    flameIconColor = 'text-orange-400 fill-orange-500/30';
  } else {
    fireAnimClass = 'fire-anim-sm';
    pillBorder = 'border-amber-500/40 bg-amber-950/40 text-amber-300';
    flameIconColor = 'text-amber-400 fill-amber-500/20';
  }

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all ${pillBorder} ${auraClass}`}
      title={`${streak}-day active streak! Complete daily quests to maintain flame intensity.`}
    >
      <div className={`relative ${fireAnimClass}`}>
        <Flame className={`w-4 h-4 ${flameIconColor}`} />
        {streak >= 5 && (
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#B8E65A] rounded-full animate-ping" />
        )}
      </div>
      <span className="font-bold tracking-tight">{streak}D</span>
      {streak > 15 && (
        <span className="text-[9px] font-black tracking-widest text-[#38BDF8] uppercase hidden sm:inline">
          GODLIKE
        </span>
      )}
    </div>
  );
};

export const HeaderHUD: React.FC<Props> = ({
  user,
  onOpenCommandPalette,
  onOpenSearch,
  onOpenAdmin,
  onOpenProfile,
  onOpenJudgeDemo,
  onOpenLanding,
  lowPowerMode,
  onToggleLowPower,
  notificationsOpen,
  setNotificationsOpen
}) => {
  const [isMuted, setIsMuted] = useState(audioService.getMuted());
  const [internalShowNotifications, setInternalShowNotifications] = useState(false);

  const showNotifications = notificationsOpen !== undefined ? notificationsOpen : internalShowNotifications;
  const setShowNotifications = (open: boolean) => {
    if (setNotificationsOpen) setNotificationsOpen(open);
    setInternalShowNotifications(open);
  };

  const handleSearchClick = () => {
    audioService.playClick();
    if (onOpenCommandPalette) onOpenCommandPalette();
    if (onOpenSearch) onOpenSearch();
  };

  const handleProfileClick = () => {
    audioService.playClick();
    if (onOpenProfile) onOpenProfile();
    else if (onOpenAdmin) onOpenAdmin();
  };

  const notifications = [
    { id: 1, title: '🔥 17-Day Streak Protected!', desc: 'Streak freeze active for today.', time: '10m ago' },
    { id: 2, title: '⚔️ AI & DS Overtook ECE!', desc: 'Department rank increased to #1.', time: '1h ago' },
    { id: 3, title: '🎯 New 250 XP Bounty Live!', desc: 'Projector Raid in Block A classroom.', time: '2h ago' }
  ];

  const handleMuteToggle = () => {
    const muted = audioService.toggleMute();
    setIsMuted(muted);
    if (!muted) audioService.playClick();
  };

  const xpPercent = Math.min(100, Math.round((user.xp / user.nextLevelXp) * 100));

  return (
    <header className="sticky top-0 z-40 bg-[#071A14]/95 backdrop-blur-md border-b border-[#0E7C5A]/40 px-4 py-2.5 select-none font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo & User Level */}
        <div className="flex items-center gap-3">
          <div
            onClick={onOpenLanding || handleProfileClick}
            className="flex items-center gap-2.5 cursor-pointer group"
            title="Return to Product Overview"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0E7C5A]/30 border border-[#16A36A]/50 flex items-center justify-center shadow-[0_0_12px_rgba(22,163,106,0.3)]">
              <Shield className="w-5 h-5 text-[#B8E65A]" />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-white group-hover:text-[#B8E65A] transition-colors">
                ECO<span className="text-[#B8E65A]">QUEST</span>
              </span>
              <span className="block text-[9px] text-[#38BDF8] tracking-widest font-mono uppercase">
                {user.department} Guild
              </span>
            </div>
          </div>

          <div
            onClick={handleProfileClick}
            className="hidden sm:flex items-center gap-2 pl-3 border-l border-[#0E7C5A]/30 cursor-pointer group"
          >
            <AvatarDisplay
              avatarId={user.avatar}
              customization={user.avatarCustomization}
              size="sm"
              showLevel={user.level}
            />
            <div className="text-left">
              <div className="font-bold text-xs text-white group-hover:text-[#B8E65A] transition-colors flex items-center gap-1">
                {user.preferredName || user.name}
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Rank #{user.campusRank} • {user.department}
              </p>
            </div>
          </div>
        </div>

        {/* Center XP Bar & Stats */}
        <div className="flex-1 max-w-sm hidden md:flex flex-col gap-1">
          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-[#B8E65A] flex items-center gap-1 font-bold">
              <Zap className="w-3 h-3 text-[#B8E65A]" /> XP PROGRESS
            </span>
            <span className="text-slate-300">
              {user.xp.toLocaleString()} / {user.nextLevelXp.toLocaleString()} XP ({xpPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full p-0.5 border border-[#0E7C5A]/50 overflow-hidden relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0E7C5A] via-[#16A36A] to-[#B8E65A] transition-all duration-500 shadow-[0_0_10px_rgba(22,163,106,0.6)]"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* Right Stats & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 font-mono text-xs">
          
          {/* Eco Coins */}
          <div className="flex items-center gap-1.5 bg-[#F5C451]/10 border border-[#F5C451]/40 px-2.5 py-1.5 rounded-xl text-[#F5C451]">
            <Coins className="w-4 h-4 text-[#F5C451]" />
            <span className="font-bold">{user.coins.toLocaleString()}</span>
          </div>

          {/* Streak Counter Component with Dynamic Fire Animation */}
          <StreakCounter streak={user.streak || 0} />

          {/* Judge Demo Button */}
          {onOpenJudgeDemo && (
            <button
              onClick={() => {
                audioService.playClick();
                onOpenJudgeDemo();
              }}
              className="flex items-center gap-1.5 bg-[#16A36A] hover:bg-[#0E7C5A] text-slate-950 font-black px-2.5 py-1.5 rounded-xl shadow-[0_0_12px_rgba(22,163,106,0.4)] transition-all cursor-pointer text-[10px] tracking-wider uppercase"
              title="3-Minute Presentation Demo Mode for Judges"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current text-slate-950" />
              <span className="hidden sm:inline">JUDGE DEMO</span>
            </button>
          )}

          {/* Ctrl+K Search */}
          <button
            onClick={handleSearchClick}
            className="hidden lg:flex items-center gap-1.5 bg-slate-950 border border-slate-800 hover:border-[#16A36A]/50 px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-[#B8E65A] transition-all cursor-pointer"
            title="Search command palette (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-[10px]">Ctrl+K</span>
          </button>

          {/* Mute Button */}
          <button
            onClick={handleMuteToggle}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-[#16A36A]/50 text-slate-400 hover:text-[#B8E65A] transition-all cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#B8E65A]" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                audioService.playClick();
                setShowNotifications(!showNotifications);
              }}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-[#16A36A]/50 text-slate-400 hover:text-[#B8E65A] transition-all cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#B8E65A] rounded-full border border-slate-950 animate-ping" />
            </button>

            {/* Notifications Popover Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-[#071A14] border border-[#16A36A]/40 rounded-2xl shadow-2xl p-4 z-50 text-sans">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
                  <span className="font-bold text-xs text-white font-mono flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#B8E65A]" /> NOTIFICATIONS
                  </span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-500 hover:text-slate-300 text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2.5">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 bg-slate-950/90 rounded-xl border border-slate-800 text-left">
                      <div className="font-bold text-xs text-slate-200">{n.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{n.desc}</div>
                      <div className="text-[9px] text-slate-500 mt-1 font-mono text-right">{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
