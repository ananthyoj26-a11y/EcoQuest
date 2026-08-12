import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  ShieldCheck,
  GraduationCap,
  Heart,
  Target,
  UserCheck,
  Compass,
  Zap,
  Sliders,
  Layers,
  Award
} from 'lucide-react';
import { Department, User } from '../types';
import {
  GAMING_AVATARS,
  AVATAR_CATEGORIES,
  GamingAvatar,
  AvatarCustomization,
  CUSTOMIZATION_OPTIONS
} from '../data/avatarsData';
import { AvatarDisplay } from './AvatarDisplay';
import { audioService } from '../services/audioService';
import { triggerHaptic, hapticPatterns } from '../utils/haptics';

interface OnboardingWizardProps {
  initialName?: string;
  initialEmail?: string;
  onComplete: (data: {
    fullName: string;
    preferredName: string;
    collegeName: string;
    department: Department;
    yearOfStudy: string;
    section: string;
    sustainabilityInterests: string[];
    personalGoal: string;
    weeklyGoal: number;
    selectedAvatar: string;
    avatarCustomization: AvatarCustomization;
  }) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  initialName = 'Eco Hero',
  initialEmail = '',
  onComplete
}) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [fullName, setFullName] = useState<string>(initialName);
  const [preferredName, setPreferredName] = useState<string>(
    initialName.split(' ')[0] || initialName
  );
  const [collegeName, setCollegeName] = useState<string>('Saranathan College of Engineering');
  const [department, setDepartment] = useState<Department>('AI & DS');
  const [yearOfStudy, setYearOfStudy] = useState<string>('3rd Year');
  const [section, setSection] = useState<string>('A');

  // Interests & Goals
  const [sustainabilityInterests, setSustainabilityInterests] = useState<string[]>([
    '♻️ Waste Reduction',
    '⚡ Energy',
    '🌱 Food & Agriculture'
  ]);
  const [personalGoal, setPersonalGoal] = useState<string>('Build a daily eco habit');
  const [weeklyGoal, setWeeklyGoal] = useState<number>(5);

  // Avatar Selection State
  const [selectedCategory, setSelectedCategory] = useState<string>('ECO HEROES');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('forest_guardian');

  const activeAvatar = GAMING_AVATARS.find(a => a.id === selectedAvatarId) || GAMING_AVATARS[0];
  const [avatarCustomization, setAvatarCustomization] = useState<AvatarCustomization>(
    activeAvatar.defaultCustomization
  );

  const [customizerTab, setCustomizerTab] = useState<'avatar' | 'outfit' | 'hair' | 'backpack' | 'aura'>('avatar');

  // When avatar is changed, sync customization defaults
  const handleSelectAvatar = (av: GamingAvatar) => {
    audioService.playClick();
    triggerHaptic(hapticPatterns.lightTap);
    setSelectedAvatarId(av.id);
    setAvatarCustomization({ ...av.defaultCustomization });
  };

  const handleInterestToggle = (interest: string) => {
    audioService.playClick();
    triggerHaptic(hapticPatterns.lightTap);
    if (sustainabilityInterests.includes(interest)) {
      setSustainabilityInterests(prev => prev.filter(i => i !== interest));
    } else {
      setSustainabilityInterests(prev => [...prev, interest]);
    }
  };

  const handleNextStep = () => {
    audioService.playQuestAccepted();
    triggerHaptic(hapticPatterns.mediumTap);
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    audioService.playClick();
    triggerHaptic(hapticPatterns.lightTap);
    setStep(prev => prev - 1);
  };

  const handleFinishOnboarding = () => {
    audioService.playLevelUp();
    triggerHaptic(hapticPatterns.levelUpBurst);
    onComplete({
      fullName,
      preferredName: preferredName || fullName.split(' ')[0],
      collegeName,
      department,
      yearOfStudy,
      section,
      sustainabilityInterests,
      personalGoal,
      weeklyGoal,
      selectedAvatar: selectedAvatarId,
      avatarCustomization
    });
  };

  const INTEREST_OPTIONS = [
    { id: '♻️ Waste Reduction', label: 'Waste Reduction', icon: '♻️', desc: 'Zero-plastic dining & recycling' },
    { id: '💧 Water Conservation', label: 'Water Conservation', icon: '💧', desc: 'Rainwater harvesting & tap audits' },
    { id: '⚡ Energy', label: 'Energy Efficiency', icon: '⚡', desc: 'Solar tracking & lab power downs' },
    { id: '🌳 Biodiversity', label: 'Biodiversity', icon: '🌳', desc: 'Plantation drives & native flora' },
    { id: '🚲 Green Mobility', label: 'Green Mobility', icon: '🚲', desc: 'Bicycle commuting & EV shuttles' },
    { id: '☀️ Renewable Energy', label: 'Renewable Energy', icon: '☀️', desc: 'Photovoltaic micro-grids' },
    { id: '🌱 Food & Agriculture', label: 'Food & Organic', icon: '🌱', desc: 'Composting & urban gardens' },
    { id: '🌍 Climate Action', label: 'Climate Action', icon: '🌍', desc: 'Carbon footprint auditing' }
  ];

  const PERSONAL_GOAL_OPTIONS = [
    'Build a daily eco habit',
    'Reduce waste on campus',
    'Save water in hostels',
    'Save lab energy',
    'Improve fitness through green mobility',
    'Help my campus become greener',
    'Compete with friends in Guild Wars',
    'Become a sustainability leader'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#07130F]/95 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto text-white p-4 sm:p-6 md:p-8 font-sans">
      {/* Top Header & Progress */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#B8E65A] to-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-[0_0_20px_rgba(184,230,90,0.5)]">
            🌱
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-[#B8E65A]">
              ECOQUEST ONBOARDING
            </h1>
            <p className="text-xs text-emerald-400 font-mono">INITIALIZING PLAYER PROFILE</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#B8E65A] bg-emerald-950/80 px-3 py-1 rounded-full border border-[#B8E65A]/40">
            STEP {step} OF 6
          </span>
        </div>
      </div>

      {/* Main Step Container */}
      <div className="max-w-4xl mx-auto w-full my-auto py-6">
        <AnimatePresence mode="wait">
          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8 max-w-xl mx-auto"
            >
              <div className="relative inline-block">
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-950 via-teal-900 to-slate-900 border-2 border-[#B8E65A] flex items-center justify-center text-5xl sm:text-6xl shadow-[0_0_40px_rgba(184,230,90,0.4)] animate-bounce">
                  🌱
                </div>
                <div className="absolute -top-2 -right-2 bg-[#B8E65A] text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                  NEW HERO
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Welcome to EcoQuest,{' '}
                  <span className="text-[#B8E65A]">{preferredName || 'Hero'}! 🌱</span>
                </h2>
                <p className="text-slate-300 text-base leading-relaxed">
                  Let's personalize your EcoQuest journey. Connect your academic profile, set your sustainability goals, and summon your custom gaming hero!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-left space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[#B8E65A]">
                  <Sparkles className="w-4 h-4" /> PLAY FOR THE PLANET
                </div>
                <p className="text-xs text-slate-300">
                  Every real-world action you log on campus earns XP, Eco Coins, and evolution power for your digital Eco Spirit.
                </p>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#B8E65A] to-emerald-400 text-slate-950 font-black text-lg shadow-[0_0_30px_rgba(184,230,90,0.5)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                CONTINUE <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: BASIC PROFILE */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 max-w-xl mx-auto"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white">Academic & Player Details</h2>
                <p className="text-sm text-slate-300">
                  Verify your campus identity to unlock department leaderboard bonus multipliers.
                </p>
              </div>

              <div className="space-y-4 bg-slate-900/80 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">FULL NAME</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Ananth E"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#B8E65A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">PREFERRED DISPLAY NAME</label>
                  <input
                    type="text"
                    value={preferredName}
                    onChange={e => setPreferredName(e.target.value)}
                    placeholder="Ananth"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#B8E65A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">COLLEGE / INSTITUTION</label>
                  <select
                    value={collegeName}
                    onChange={e => setCollegeName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#B8E65A]"
                  >
                    <option value="Saranathan College of Engineering">Saranathan College of Engineering</option>
                    <option value="National Institute of Technology">National Institute of Technology</option>
                    <option value="Anna University Campus">Anna University Campus</option>
                    <option value="PSG College of Technology">PSG College of Technology</option>
                    <option value="SASTRA Deemed University">SASTRA Deemed University</option>
                    <option value="Other Campus">Other Green Campus</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">DEPARTMENT</label>
                    <select
                      value={department}
                      onChange={e => setDepartment(e.target.value as Department)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#B8E65A]"
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
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#B8E65A]"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Post-Grad">Post-Grad</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">SECTION</label>
                    <select
                      value={section}
                      onChange={e => setSection(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#B8E65A]"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                      <option value="D">Section D</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handlePrevStep}
                  className="w-1/3 py-3.5 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all"
                >
                  BACK
                </button>
                <button
                  onClick={handleNextStep}
                  className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-[#B8E65A] to-emerald-400 text-slate-950 font-black shadow-[0_0_20px_rgba(184,230,90,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  NEXT <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SUSTAINABILITY INTERESTS */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white">What do you care about most?</h2>
                <p className="text-sm text-slate-300">
                  Select your primary sustainability domains to personalize AI quest suggestions.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {INTEREST_OPTIONS.map(opt => {
                  const selected = sustainabilityInterests.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleInterestToggle(opt.id)}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        selected
                          ? 'bg-emerald-950/80 border-[#B8E65A] shadow-[0_0_20px_rgba(184,230,90,0.3)] scale-[1.02]'
                          : 'bg-slate-900/60 border-white/10 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-3xl mb-2">{opt.icon}</div>
                      <div>
                        <span className="font-bold text-xs text-white block">{opt.label}</span>
                        <span className="text-[10px] text-slate-400 leading-tight block mt-1">
                          {opt.desc}
                        </span>
                      </div>
                      {selected && (
                        <div className="mt-2 text-right">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#B8E65A]">
                            <Check className="w-3 h-3" /> SELECTED
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handlePrevStep}
                  className="w-1/3 py-3.5 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all"
                >
                  BACK
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={sustainabilityInterests.length === 0}
                  className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-[#B8E65A] to-emerald-400 text-slate-950 font-black shadow-[0_0_20px_rgba(184,230,90,0.4)] disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  NEXT <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: PERSONAL GOAL */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 max-w-xl mx-auto"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white">What would you like to achieve?</h2>
                <p className="text-sm text-slate-300">
                  Select your primary ambition on campus.
                </p>
              </div>

              <div className="space-y-2.5">
                {PERSONAL_GOAL_OPTIONS.map(goal => {
                  const selected = personalGoal === goal;
                  return (
                    <button
                      key={goal}
                      onClick={() => {
                        audioService.playClick();
                        triggerHaptic(hapticPatterns.lightTap);
                        setPersonalGoal(goal);
                      }}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        selected
                          ? 'bg-emerald-950/80 border-[#B8E65A] text-white shadow-[0_0_15px_rgba(184,230,90,0.3)] font-bold'
                          : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Target className={`w-5 h-5 ${selected ? 'text-[#B8E65A]' : 'text-slate-500'}`} />
                        <span className="text-sm">{goal}</span>
                      </div>
                      {selected && <Check className="w-5 h-5 text-[#B8E65A]" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handlePrevStep}
                  className="w-1/3 py-3.5 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all"
                >
                  BACK
                </button>
                <button
                  onClick={handleNextStep}
                  className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-[#B8E65A] to-emerald-400 text-slate-950 font-black shadow-[0_0_20px_rgba(184,230,90,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  NEXT <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: WEEKLY ECO GOAL */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 max-w-xl mx-auto"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-white">Select Your Weekly Mission Target</h2>
                <p className="text-sm text-slate-300">
                  How many verified sustainability actions will you complete each week?
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: 3, label: 'Casual Defender', xpBonus: '+10% XP', desc: 'Light pace for busy exam weeks' },
                  { num: 5, label: 'Eco Vanguard', xpBonus: '+25% XP (Recommended)', desc: 'Balanced campus activity' },
                  { num: 7, label: 'Daily Crusader', xpBonus: '+50% XP', desc: '1 action per day streak' },
                  { num: 10, label: 'Planetary Protector', xpBonus: '+100% XP', desc: 'Hardcore sustainability leader' }
                ].map(opt => {
                  const selected = weeklyGoal === opt.num;
                  return (
                    <button
                      key={opt.num}
                      onClick={() => {
                        audioService.playClick();
                        triggerHaptic(hapticPatterns.lightTap);
                        setWeeklyGoal(opt.num);
                      }}
                      className={`p-5 rounded-3xl border text-left flex flex-col justify-between transition-all ${
                        selected
                          ? 'bg-gradient-to-tr from-emerald-950 to-teal-900 border-[#B8E65A] shadow-[0_0_25px_rgba(184,230,90,0.4)] scale-[1.03]'
                          : 'bg-slate-900/60 border-white/10 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-3xl font-black text-[#B8E65A]">{opt.num}</span>
                          <span className="text-[10px] font-mono font-bold bg-slate-950 px-2 py-1 rounded-md text-emerald-400 border border-emerald-500/30">
                            {opt.xpBonus}
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-base">{opt.label}</h3>
                        <p className="text-xs text-slate-400 mt-1">{opt.desc}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-300">
                        <span>{opt.num} ACTIONS / WEEK</span>
                        {selected && <Check className="w-4 h-4 text-[#B8E65A]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handlePrevStep}
                  className="w-1/3 py-3.5 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all"
                >
                  BACK
                </button>
                <button
                  onClick={handleNextStep}
                  className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-[#B8E65A] to-emerald-400 text-slate-950 font-black shadow-[0_0_20px_rgba(184,230,90,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  CHOOSE AVATAR <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: CHOOSE YOUR ECO HERO (AVATAR & CUSTOMIZATION) */}
          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-1">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
                  CHOOSE YOUR ECO HERO
                </h2>
                <p className="text-sm text-slate-300">
                  Your avatar represents you across the EcoQuest world, leaderboards, and Guild Wars.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Avatar Preview Hero Stage */}
                <div className="lg:col-span-5 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 rounded-3xl border border-white/10 flex flex-col items-center justify-center text-center space-y-4 shadow-2xl relative overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none blur-2xl"
                    style={{ backgroundColor: activeAvatar.primaryColor }}
                  />

                  {/* Big Hero Avatar Display */}
                  <AvatarDisplay
                    avatarId={selectedAvatarId}
                    customization={avatarCustomization}
                    size="hero"
                    showAura={true}
                    showCategoryBadge={true}
                  />

                  <div>
                    <span
                      className="text-[10px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-950 border border-white/20 inline-block mb-1"
                      style={{ color: activeAvatar.primaryColor }}
                    >
                      {activeAvatar.category}
                    </span>
                    <h3 className="text-2xl font-black text-white">{activeAvatar.name}</h3>
                    <p className="text-xs text-[#B8E65A] font-mono">{activeAvatar.title}</p>
                    <p className="text-xs text-slate-400 mt-2 max-w-xs">{activeAvatar.description}</p>
                  </div>

                  {/* Summary Badges */}
                  <div className="w-full grid grid-cols-2 gap-2 text-left pt-3 border-t border-white/10 text-xs font-mono">
                    <div className="bg-slate-950/80 p-2 rounded-xl border border-white/5">
                      <span className="text-[9px] text-slate-500 block">OUTFIT</span>
                      <span className="font-bold text-white text-[11px] truncate block">
                        {avatarCustomization.outfit}
                      </span>
                    </div>
                    <div className="bg-slate-950/80 p-2 rounded-xl border border-white/5">
                      <span className="text-[9px] text-slate-500 block">ACTIVE AURA</span>
                      <span className="font-bold text-[#B8E65A] text-[11px] truncate block">
                        {avatarCustomization.aura}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Category Tabs & Avatar Selector Grid */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Category Selector Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {AVATAR_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          audioService.playClick();
                          setSelectedCategory(cat.id);
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 border ${
                          selectedCategory === cat.id
                            ? 'bg-emerald-950/90 border-[#B8E65A] text-[#B8E65A] shadow-[0_0_15px_rgba(184,230,90,0.3)]'
                            : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="tracking-tight">{cat.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Avatars Grid for Selected Category */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[280px] overflow-y-auto p-1 pr-2">
                    {GAMING_AVATARS.filter(a => a.category === selectedCategory).map(av => {
                      const isSelected = selectedAvatarId === av.id;
                      return (
                        <button
                          key={av.id}
                          onClick={() => handleSelectAvatar(av)}
                          className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 transition-all relative ${
                            isSelected
                              ? 'bg-emerald-950/90 border-[#B8E65A] ring-2 ring-[#B8E65A]/50 scale-105 shadow-xl'
                              : 'bg-slate-900/60 border-white/10 hover:border-slate-700'
                          }`}
                        >
                          <AvatarDisplay
                            avatarId={av.id}
                            size="sm"
                            showAura={isSelected}
                          />
                          <div className="w-full truncate">
                            <span className="text-xs font-bold text-white block truncate">{av.name}</span>
                            <span className="text-[9px] text-slate-400 block truncate">{av.title}</span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-[#B8E65A] text-slate-950 p-0.5 rounded-full">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Customization Sub-Tabs */}
                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Sliders className="w-4 h-4 text-[#B8E65A]" /> CUSTOMIZE HERO OUTFIT & GEAR
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">HAIRSTYLE</label>
                        <select
                          value={avatarCustomization.hairstyle}
                          onChange={e =>
                            setAvatarCustomization(prev => ({ ...prev, hairstyle: e.target.value }))
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                        >
                          {CUSTOMIZATION_OPTIONS.hairstyles.map(h => (
                            <option key={h} value={h}>{h}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">OUTFIT</label>
                        <select
                          value={avatarCustomization.outfit}
                          onChange={e =>
                            setAvatarCustomization(prev => ({ ...prev, outfit: e.target.value }))
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                        >
                          {CUSTOMIZATION_OPTIONS.outfits.map(o => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">ACTIVE AURA</label>
                        <select
                          value={avatarCustomization.aura}
                          onChange={e =>
                            setAvatarCustomization(prev => ({ ...prev, aura: e.target.value }))
                          }
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                        >
                          {CUSTOMIZATION_OPTIONS.auras.map(a => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Complete Onboarding Button */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handlePrevStep}
                  className="w-1/4 py-4 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all"
                >
                  BACK
                </button>
                <button
                  onClick={handleFinishOnboarding}
                  className="w-3/4 py-4 rounded-2xl bg-gradient-to-r from-[#B8E65A] via-emerald-400 to-teal-400 text-slate-950 font-black text-lg shadow-[0_0_35px_rgba(184,230,90,0.6)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  START YOUR JOURNEY 🌱 <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
