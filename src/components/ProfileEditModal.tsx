import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  UserCheck,
  ShieldCheck,
  Award,
  Sparkles,
  Save,
  Check,
  Sliders,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { User, Department } from '../types';
import {
  GAMING_AVATARS,
  AVATAR_CATEGORIES,
  CUSTOMIZATION_OPTIONS,
  AvatarCustomization
} from '../data/avatarsData';
import { AvatarDisplay } from './AvatarDisplay';
import { audioService } from '../services/audioService';
import { triggerHaptic, hapticPatterns } from '../utils/haptics';

interface ProfileEditModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (updatedData: Partial<User>) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  user,
  isOpen,
  onClose,
  onSaveProfile
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'avatar' | 'goals'>('profile');

  // Form Fields
  const [fullName, setFullName] = useState<string>(user.fullName || user.name);
  const [preferredName, setPreferredName] = useState<string>(user.preferredName || user.name);
  const [department, setDepartment] = useState<Department>(user.department || 'AI & DS');
  const [yearOfStudy, setYearOfStudy] = useState<string>(user.yearOfStudy || '3rd Year');
  const [section, setSection] = useState<string>(user.section || 'A');
  const [city, setCity] = useState<string>(user.city || 'Tiruchirappalli');
  const [bio, setBio] = useState<string>(user.bio || 'Eco defender on campus!');

  // Goals & Interests
  const [weeklyGoal, setWeeklyGoal] = useState<number>(user.weeklyGoal || 5);
  const [sustainabilityInterests, setSustainabilityInterests] = useState<string[]>(
    user.sustainabilityInterests || ['♻️ Waste Reduction', '⚡ Energy', '🌱 Food & Agriculture']
  );

  // Avatar Selection
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(user.avatar || 'forest_guardian');
  const activeAvatar = GAMING_AVATARS.find(a => a.id === selectedAvatarId) || GAMING_AVATARS[0];
  const [avatarCustomization, setAvatarCustomization] = useState<AvatarCustomization>(
    user.avatarCustomization || activeAvatar.defaultCustomization
  );

  if (!isOpen) return null;

  const handleInterestToggle = (interest: string) => {
    audioService.playClick();
    if (sustainabilityInterests.includes(interest)) {
      setSustainabilityInterests(prev => prev.filter(i => i !== interest));
    } else {
      setSustainabilityInterests(prev => [...prev, interest]);
    }
  };

  const handleSave = () => {
    audioService.playQuestComplete();
    triggerHaptic(hapticPatterns.levelUpBurst);

    onSaveProfile({
      name: preferredName || fullName,
      fullName,
      preferredName,
      department,
      yearOfStudy,
      section,
      city,
      bio,
      weeklyGoal,
      sustainabilityInterests,
      avatar: selectedAvatarId,
      avatarCustomization
    });

    onClose();
  };

  const INTEREST_OPTIONS = [
    '♻️ Waste Reduction',
    '💧 Water Conservation',
    '⚡ Energy',
    '🌳 Biodiversity',
    '🚲 Green Mobility',
    '☀️ Renewable Energy',
    '🌱 Food & Agriculture',
    '🌍 Climate Action'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0B1E17] border border-emerald-500/40 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-white"
      >
        {/* Top Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <AvatarDisplay avatarId={selectedAvatarId} customization={avatarCustomization} size="sm" />
            <div>
              <h2 className="text-xl font-black text-white">EDIT HERO PROFILE</h2>
              <p className="text-xs text-[#B8E65A] font-mono">
                PROFILE COMPLETION — {user.profileCompletionScore || 85}%
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Sub-Tabs */}
        <div className="grid grid-cols-3 bg-slate-950/80 border-b border-white/10 p-2 text-xs font-bold font-mono">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2.5 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-[#B8E65A] text-slate-950 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            BASIC DETAILS
          </button>
          <button
            onClick={() => setActiveTab('avatar')}
            className={`py-2.5 rounded-xl transition-all ${
              activeTab === 'avatar'
                ? 'bg-[#B8E65A] text-slate-950 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            GAMING AVATAR
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`py-2.5 rounded-xl transition-all ${
              activeTab === 'goals'
                ? 'bg-[#B8E65A] text-slate-950 font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ECO GOALS
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">FULL NAME</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#B8E65A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">PREFERRED DISPLAY NAME</label>
                  <input
                    type="text"
                    value={preferredName}
                    onChange={e => setPreferredName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#B8E65A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">DEPARTMENT</label>
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value as Department)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    <option value="AI & DS">AI & DS</option>
                    <option value="ECE">ECE</option>
                    <option value="CSE">CSE</option>
                    <option value="MECHANICAL">MECHANICAL</option>
                    <option value="BIOTECH">BIOTECH</option>
                    <option value="IT">IT</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="EEE">EEE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">YEAR</label>
                  <select
                    value={yearOfStudy}
                    onChange={e => setYearOfStudy(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">CITY</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">PLAYER BIO</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#B8E65A]"
                />
              </div>
            </div>
          )}

          {activeTab === 'avatar' && (
            <div className="space-y-6">
              <div className="flex items-center gap-6 bg-slate-900/60 p-4 rounded-2xl border border-white/10">
                <AvatarDisplay avatarId={selectedAvatarId} customization={avatarCustomization} size="xl" showAura={true} />
                <div>
                  <h3 className="text-xl font-black text-white">{activeAvatar.name}</h3>
                  <p className="text-xs text-[#B8E65A] font-mono">{activeAvatar.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{activeAvatar.description}</p>
                </div>
              </div>

              {/* Avatar Picker Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {GAMING_AVATARS.map(av => (
                  <button
                    key={av.id}
                    onClick={() => {
                      setSelectedAvatarId(av.id);
                      setAvatarCustomization({ ...av.defaultCustomization });
                    }}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      selectedAvatarId === av.id
                        ? 'bg-emerald-950 border-[#B8E65A] scale-105'
                        : 'bg-slate-900/60 border-white/10 hover:border-slate-700'
                    }`}
                  >
                    <AvatarDisplay avatarId={av.id} size="sm" />
                    <span className="text-[10px] font-bold text-white mt-1 truncate max-w-full block">
                      {av.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Gear Selectors */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">OUTFIT</label>
                  <select
                    value={avatarCustomization.outfit}
                    onChange={e => setAvatarCustomization(prev => ({ ...prev, outfit: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  >
                    {CUSTOMIZATION_OPTIONS.outfits.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">AURA</label>
                  <select
                    value={avatarCustomization.aura}
                    onChange={e => setAvatarCustomization(prev => ({ ...prev, aura: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  >
                    {CUSTOMIZATION_OPTIONS.auras.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  WEEKLY TARGET ACTIONS: <span className="text-[#B8E65A]">{weeklyGoal} ACTIONS/WEEK</span>
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[3, 5, 7, 10].map(g => (
                    <button
                      key={g}
                      onClick={() => setWeeklyGoal(g)}
                      className={`py-3 rounded-xl border text-center font-bold text-sm transition-all ${
                        weeklyGoal === g
                          ? 'bg-[#B8E65A] text-slate-950 border-[#B8E65A]'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      {g} / Wk
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">SUSTAINABILITY INTERESTS</label>
                <div className="grid grid-cols-2 gap-2">
                  {INTEREST_OPTIONS.map(interest => {
                    const selected = sustainabilityInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        onClick={() => handleInterestToggle(interest)}
                        className={`p-3 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all ${
                          selected
                            ? 'bg-emerald-950 border-[#B8E65A] text-[#B8E65A]'
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span>{interest}</span>
                        {selected && <Check className="w-4 h-4 text-[#B8E65A]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Save Bar */}
        <div className="p-4 border-t border-white/10 bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 text-sm"
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#B8E65A] text-slate-950 font-black shadow-[0_0_20px_rgba(184,230,90,0.5)] hover:scale-105 active:scale-95 transition-all text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> SAVE CHANGES
          </button>
        </div>
      </motion.div>
    </div>
  );
};
