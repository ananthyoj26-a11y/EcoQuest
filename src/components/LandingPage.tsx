import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Flame,
  Coins,
  Award,
  Trees,
  Droplets,
  Sun,
  Recycle,
  Users,
  Play,
  X,
  UserCheck,
  Fingerprint,
  Lock,
  ChevronRight,
  AtSign,
  Gift,
  Check,
  Mail,
  UserPlus,
  LogIn
} from 'lucide-react';
import { Department } from '../types';
import { audioService } from '../services/audioService';
import { triggerHaptic, hapticPatterns } from '../utils/haptics';
import { EcoMascot } from './EcoMascot';

interface Props {
  onGoogleSignIn: () => void;
  onEmailSignUp?: (name: string, email: string, pass: string) => Promise<void>;
  onEmailSignIn?: (email: string, pass: string) => Promise<void>;
  onDemoSignIn: (name?: string, email?: string, department?: Department) => void;
  isLoadingAuth?: boolean;
}

export const LandingPage: React.FC<Props> = ({
  onGoogleSignIn,
  onEmailSignUp,
  onEmailSignIn,
  onDemoSignIn,
  isLoadingAuth = false
}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'google' | 'signup' | 'signin'>('google');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState<Department>('AI & DS');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse Move Parallax Handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  const commonDomains = [
    '@saranathan.ac.in',
    '@gmail.com',
    '@student.edu',
    '@ece.saranathan.ac.in',
    '@cse.saranathan.ac.in'
  ];

  const hasAtSymbol = email.includes('@');
  const atIndex = email.indexOf('@');
  const afterAtText = hasAtSymbol ? email.substring(atIndex).toLowerCase() : '';

  const filteredDomains = hasAtSymbol && afterAtText.length > 1
    ? commonDomains.filter(dom => dom.toLowerCase().startsWith(afterAtText))
    : commonDomains;

  const isEmailValid = email.includes('@') && email.includes('.');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.endsWith('@') && !email.endsWith('@')) {
      audioService.playClick();
      triggerHaptic(hapticPatterns.lightTap);
    }
    setEmail(val);
  };

  const mascotState = isAuthenticating || isLoadingAuth
    ? 'submitting'
    : isEmailValid
    ? 'valid_email'
    : isInputFocused
    ? 'typing'
    : 'idle';

  const triggerCelebrationConfetti = () => {
    try {
      confetti({
        particleCount: 110,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#16A36A', '#B8E65A', '#38BDF8', '#F5C451', '#4ADE80'],
        disableForReducedMotion: true
      });
    } catch {
      // Fallback
    }
  };

  const handleGoogleClick = async () => {
    setAuthError(null);
    audioService.playClick();
    triggerHaptic(hapticPatterns.mediumTap);
    setIsAuthenticating(true);
    triggerCelebrationConfetti();
    try {
      await onGoogleSignIn();
    } catch (err: any) {
      console.warn('Google Auth Error:', err);
      const isDomainError =
        err?.code === 'auth/unauthorized-domain' ||
        err?.message?.includes('unauthorized-domain') ||
        err?.toString()?.includes('unauthorized-domain');

      if (isDomainError) {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'current domain';
        setAuthError(`Domain "${domain}" is not authorized in Firebase Console. Use Fast-Pass Demo Mode below.`);
        setIsAuthenticating(false);
      } else if (err?.code === 'auth/popup-closed-by-user') {
        setIsAuthenticating(false);
        setAuthError('Google sign-in popup was closed. Try again or use Demo Mode.');
      } else {
        setIsAuthenticating(false);
        setAuthError(err?.message || 'Google sign-in failed. Try Email sign-in or Demo Mode.');
      }
    }
  };

  const handleEmailSignUpClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onEmailSignUp) return;
    setAuthError(null);
    if (!name.trim()) { setAuthError('Please enter your full name.'); return; }
    if (!email.includes('@')) { setAuthError('Please enter a valid email address.'); return; }
    if (password.length < 6) { setAuthError('Password must be at least 6 characters.'); return; }
    audioService.playClick();
    setIsAuthenticating(true);
    triggerCelebrationConfetti();
    try {
      await onEmailSignUp(name.trim(), email.trim(), password);
    } catch (err: any) {
      setIsAuthenticating(false);
      if (err?.code === 'auth/email-already-in-use') {
        setAuthError('This email is already registered. Try signing in instead.');
        setAuthTab('signin');
      } else if (err?.code === 'auth/weak-password') {
        setAuthError('Password too weak. Use at least 8 characters with mixed case.');
      } else {
        setAuthError(err?.message || 'Sign-up failed. Please try again.');
      }
    }
  };

  const handleEmailSignInClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onEmailSignIn) return;
    setAuthError(null);
    if (!email.includes('@')) { setAuthError('Please enter a valid email address.'); return; }
    if (!password) { setAuthError('Please enter your password.'); return; }
    audioService.playClick();
    setIsAuthenticating(true);
    try {
      await onEmailSignIn(email.trim(), password);
    } catch (err: any) {
      setIsAuthenticating(false);
      if (err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        setAuthError('Invalid email or password. Please try again.');
      } else {
        setAuthError(err?.message || 'Sign-in failed. Please try again.');
      }
    }
  };

  const handleDemoClick = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    audioService.playClick();
    triggerHaptic(hapticPatterns.mediumTap);
    setIsAuthenticating(true);
    triggerCelebrationConfetti();
    setTimeout(() => {
      onDemoSignIn('Judge Demo', 'judge@saranathan.ac.in', 'AI & DS');
    }, 400);
  };

  const handleQuickDomainTap = (domain: string) => {
    audioService.playClick();
    if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(10);

    if (email.includes('@')) {
      const prefix = email.split('@')[0];
      setEmail(`${prefix}${domain}`);
    } else {
      setEmail(`${email}${domain}`);
    }
  };

  const scrollToSection = (id: string) => {
    audioService.playClick();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Parallax offsets
  const parallaxX = (mousePos.x - (typeof window !== 'undefined' ? window.innerWidth / 2 : 0)) * 0.02;
  const parallaxY = (mousePos.y - (typeof window !== 'undefined' ? window.innerHeight / 2 : 0)) * 0.02;

  return (
    <div className="min-h-screen bg-mesh-animated text-slate-100 font-sans selection:bg-[#16A36A] selection:text-slate-950 relative overflow-x-hidden">
      
      {/* Dynamic Parallax Background Mesh Orbs */}
      <div
        style={{ transform: `translate(${parallaxX}px, ${parallaxY}px)` }}
        className="fixed top-0 left-1/3 w-[650px] h-[650px] bg-[#0E7C5A]/20 rounded-full blur-[160px] pointer-events-none z-0 transition-transform duration-300 ease-out"
      />
      <div
        style={{ transform: `translate(${-parallaxX * 1.5}px, ${-parallaxY * 1.5}px)` }}
        className="fixed bottom-0 right-1/4 w-[550px] h-[550px] bg-[#38BDF8]/12 rounded-full blur-[150px] pointer-events-none z-0 transition-transform duration-300 ease-out"
      />

      {/* 1. GLASS NAVBAR */}
      <nav className="sticky top-0 z-40 bg-[#071A14]/80 backdrop-blur-[20px] border-b border-white/10 px-6 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo with Sway Micro-Interaction */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('top')}>
            <div className="w-10 h-10 rounded-xl bg-[#0E7C5A]/30 border border-[#16A36A]/50 flex items-center justify-center shadow-[0_0_15px_rgba(22,163,106,0.3)] animate-sway">
              <Shield className="w-6 h-6 text-[#B8E65A]" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-white flex items-center gap-1">
                ECO<span className="text-[#B8E65A]">QUEST</span>
              </span>
              <span className="block text-[10px] text-[#38BDF8] tracking-widest font-mono uppercase">
                Saranathan College Campus Arena
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#B8E65A] transition-colors cursor-pointer">
              How It Works
            </button>
            <button onClick={() => scrollToSection('impact-section')} className="hover:text-[#B8E65A] transition-colors cursor-pointer">
              Impact
            </button>
            <button onClick={() => scrollToSection('features')} className="hover:text-[#B8E65A] transition-colors cursor-pointer">
              Features
            </button>
            <button onClick={() => scrollToSection('eco-spirit')} className="hover:text-[#B8E65A] transition-colors cursor-pointer">
              Eco Spirit
            </button>
          </div>

          {/* Primary CTA button with Neon Drop Shadow */}
          <button
            onClick={() => {
              audioService.playClick();
              setIsAuthModalOpen(true);
            }}
            className="bg-[#16A36A] hover:bg-[#0E7C5A] text-slate-950 font-black px-5 py-2.5 rounded-xl neon-button-shadow flex items-center gap-2 transition-all cursor-pointer text-sm transform hover:scale-105 active:scale-95"
          >
            <span>ENTER ECOQUEST</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section id="top" className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Hero Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#0E7C5A]/30 border border-[#16A36A]/40 px-3.5 py-1.5 rounded-full text-xs font-mono text-[#B8E65A] backdrop-blur-md">
            <Sparkles className="w-4 h-4 animate-pulse text-[#F5C451]" />
            <span>AI-POWERED CAMPUS SUSTAINABILITY ARENA</span>
          </div>

          <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.06]">
            PLAY FOR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B8E65A] via-[#16A36A] to-[#38BDF8]">
              THE PLANET.
            </span>
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
            Turn sustainable actions into quests, prove them with AI, compete with your campus, and watch your world grow.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => {
                audioService.playClick();
                setIsAuthModalOpen(true);
              }}
              className="bg-[#16A36A] hover:bg-[#0E7C5A] text-slate-950 font-extrabold text-base px-8 py-4 rounded-2xl neon-button-shadow-lg flex items-center gap-3 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
            >
              <span>START YOUR QUEST</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => scrollToSection('how-it-works')}
              className="glass-panel hover:bg-white/10 text-slate-200 font-bold text-base px-6 py-4 rounded-2xl transition-all cursor-pointer"
            >
              SEE HOW IT WORKS
            </button>
          </div>

          {/* Key Pillars */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs text-slate-300 font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#B8E65A]" />
              <span>Gemini Vision AI</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#B8E65A]" />
              <span>Department Guilds</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#B8E65A]" />
              <span>Real Eco Impact</span>
            </div>
          </div>
        </div>

        {/* Right Hero Visual Stage with Interactive Mascot & World */}
        <div className="lg:col-span-5 relative">
          <div className="glass-panel-glow rounded-3xl p-6 relative overflow-hidden min-h-[440px] flex flex-col justify-between border border-[#16A36A]/40">
            
            {/* Interactive Mascot Stage */}
            <div className="relative z-10 flex flex-col items-center justify-center my-auto py-6">
              
              {/* Interactive Mascot */}
              <div
                className="cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => {
                  audioService.playClick();
                  setIsAuthModalOpen(true);
                }}
              >
                <EcoMascot state={mascotState} mousePos={mousePos} size="lg" />
              </div>

              {/* Floating Game Pills */}
              <motion.div
                animate={{ x: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-2 left-2 bg-slate-950/90 border border-[#16A36A] text-[#B8E65A] font-mono font-bold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>+100 XP</span>
              </motion.div>

              <motion.div
                animate={{ x: [4, -4, 4] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-2 right-2 bg-slate-950/90 border border-[#38BDF8] text-[#38BDF8] font-mono font-bold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>AI VERIFIED ✓</span>
              </motion.div>

              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-12 left-2 bg-slate-950/90 border border-rose-500/50 text-rose-400 font-mono font-bold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>🔥 7 DAY STREAK</span>
              </motion.div>

              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-12 right-2 bg-slate-950/90 border border-[#F5C451]/60 text-[#F5C451] font-mono font-bold text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
              >
                <Coins className="w-3.5 h-3.5 fill-current" />
                <span>+50 ECO COINS</span>
              </motion.div>
            </div>

            {/* Bottom Campus Live Ticker */}
            <div className="relative z-10 bg-slate-950/80 rounded-2xl p-3 border border-slate-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-ping" />
                <span className="text-slate-300 font-mono">Ananya completed Water Guardian</span>
              </div>
              <span className="text-[#B8E65A] font-mono font-bold">+80 XP</span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CORE PRODUCT LOOP */}
      <section id="how-it-works" className="bg-slate-950/60 border-y border-white/10 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-xs font-mono font-bold text-[#B8E65A] uppercase tracking-widest bg-[#0E7C5A]/30 px-3.5 py-1.5 rounded-full border border-[#16A36A]/40">
            CORE PRODUCT LOOP
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 mb-16 tracking-tight">
            ONE ACTION CAN CREATE A RIPPLE.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              { num: '01', title: 'REAL WORLD', desc: 'Student uses stainless bottle or powers down lab equipment.', border: 'hover:border-[#16A36A]', bg: 'bg-[#0E7C5A]/40', color: 'text-[#B8E65A]' },
              { num: '02', title: 'AI VERIFICATION', desc: 'Server Gemini AI analyzes proof photo with 94%+ confidence.', border: 'hover:border-[#38BDF8]', bg: 'bg-[#38BDF8]/20', color: 'text-[#38BDF8]' },
              { num: '03', title: 'GAME REWARD', desc: 'Receive +100 XP, Eco Coins, and streak multipliers.', border: 'hover:border-[#F5C451]', bg: 'bg-[#F5C451]/20', color: 'text-[#F5C451]' },
              { num: '04', title: 'WORLD EVOLUTION', desc: 'Eco Spirit evolves into Cyber Tree & campus map flourishes.', border: 'hover:border-[#16A36A]', bg: 'bg-[#16A36A]/30', color: 'text-[#B8E65A]' },
              { num: '05', title: 'REAL IMPACT', desc: 'AI & DS Guild score increases, changing campus rankings.', border: 'hover:border-[#38BDF8]', bg: 'bg-[#38BDF8]/20', color: 'text-[#38BDF8]' }
            ].map((step, idx) => (
              <div
                key={idx}
                className={`glass-panel rounded-2xl p-6 text-left flex flex-col justify-between transition-all ${step.border} transform hover:-translate-y-1`}
              >
                <div className={`w-10 h-10 rounded-xl ${step.bg} ${step.color} font-mono font-bold flex items-center justify-center mb-4`}>
                  {step.num}
                </div>
                <h3 className="font-extrabold text-white text-base mb-2">{step.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LIVE IMPACT METRICS */}
      <section id="impact-section" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-white mb-2">MEASURABLE ENVIRONMENTAL IMPACT</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto mb-12">
            Real-time verified environmental savings across Saranathan College of Engineering.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel rounded-3xl p-6 text-center border border-white/10 hover:border-[#16A36A]/60 transition-all">
              <Recycle className="w-8 h-8 text-[#B8E65A] mx-auto mb-3" />
              <div className="text-3xl font-black text-white font-mono">12,480</div>
              <div className="text-xs text-slate-300 font-medium mt-1">Plastic Items Avoided</div>
            </div>

            <div className="glass-panel rounded-3xl p-6 text-center border border-white/10 hover:border-[#38BDF8]/60 transition-all">
              <Droplets className="w-8 h-8 text-[#38BDF8] mx-auto mb-3" />
              <div className="text-3xl font-black text-white font-mono">86,240 L</div>
              <div className="text-xs text-slate-300 font-medium mt-1">Water Saved</div>
            </div>

            <div className="glass-panel rounded-3xl p-6 text-center border border-white/10 hover:border-[#F5C451]/60 transition-all">
              <Sun className="w-8 h-8 text-[#F5C451] mx-auto mb-3" />
              <div className="text-3xl font-black text-white font-mono">3,420 kg</div>
              <div className="text-xs text-slate-300 font-medium mt-1">CO₂ Avoided</div>
            </div>

            <div className="glass-panel rounded-3xl p-6 text-center border border-white/10 hover:border-[#16A36A]/60 transition-all">
              <Users className="w-8 h-8 text-[#16A36A] mx-auto mb-3" />
              <div className="text-3xl font-black text-white font-mono">1,842</div>
              <div className="text-xs text-slate-300 font-medium mt-1">Student Heroes</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ECO SPIRIT CHARACTER SYSTEM */}
      <section id="eco-spirit" className="bg-slate-950/60 border-t border-white/10 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-widest bg-[#38BDF8]/10 px-3.5 py-1 rounded-full border border-[#38BDF8]/30">
            DIGITAL PET EVOLUTION
          </span>
          <h2 className="text-3xl font-black text-white mt-4 mb-4">MEET YOUR ECO SPIRIT</h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-12">
            Every student receives a digital spirit that grows and evolves as you complete real-world sustainability actions.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { stage: 'Stage 1', name: 'Seedling', level: 'Lvl 1-4', icon: '🌱' },
              { stage: 'Stage 2', name: 'Sprout', level: 'Lvl 5-9', icon: '🌿' },
              { stage: 'Stage 3', name: 'Guardian', level: 'Lvl 10-14', icon: '🌳' },
              { stage: 'Stage 4', name: 'Forest Spirit', level: 'Lvl 15-19', icon: '✨' },
              { stage: 'Stage 5', name: 'Planet Guardian', level: 'Lvl 20+', icon: '🪐' }
            ].map((stg, i) => (
              <div
                key={i}
                className="glass-panel rounded-2xl p-5 text-center hover:border-[#B8E65A] transition-all transform hover:-translate-y-1"
              >
                <div className="text-4xl mb-2">{stg.icon}</div>
                <div className="text-[10px] font-mono text-[#38BDF8] uppercase">{stg.stage}</div>
                <div className="font-bold text-white text-sm">{stg.name}</div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">{stg.level}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="glass-panel-glow rounded-3xl p-10 md:p-14 text-white relative overflow-hidden border border-[#16A36A]/50">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              READY TO PLAY FOR THE PLANET?
            </h2>
            <p className="text-base text-slate-200 font-medium max-w-xl mx-auto mb-8">
              Join Saranathan College of Engineering in converting daily habits into gamified impact and guild victory.
            </p>

            <button
              onClick={() => {
                audioService.playClick();
                setIsAuthModalOpen(true);
              }}
              className="bg-[#16A36A] text-slate-950 hover:bg-[#0E7C5A] font-black text-lg px-9 py-4 rounded-2xl neon-button-shadow-lg inline-flex items-center gap-3 transition-all cursor-pointer transform hover:scale-105 active:scale-95"
            >
              <span>ENTER CAMPUS ARENA</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8 text-center font-mono text-xs text-slate-500">
        ECOQUEST v3.6 • AI Startup Arena • Saranathan College of Engineering
      </footer>

      {/* AUTH MODAL */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 10 }}
              className="glass-panel-glow border-2 border-[#16A36A]/60 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative my-8"
            >
              {/* Close Button */}
              <button
                onClick={() => { setIsAuthModalOpen(false); setAuthError(null); setIsAuthenticating(false); }}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-900/80 rounded-full cursor-pointer hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="text-center mb-5">
                <div className="flex justify-center mb-2">
                  <EcoMascot state={mascotState} mousePos={mousePos} size="md" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">ENTER CAMPUS ARENA</h3>
                <p className="text-xs text-slate-300 mt-1">Join your department guild and start earning XP</p>
              </div>

              {/* Tab Switcher */}
              <div className="flex rounded-xl bg-slate-900/80 border border-slate-700/60 p-1 mb-5 gap-1">
                {[
                  { id: 'google' as const, label: 'Google', icon: <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg> },
                  { id: 'signup' as const, label: 'Sign Up', icon: <UserPlus className="w-3.5 h-3.5" /> },
                  { id: 'signin' as const, label: 'Sign In', icon: <LogIn className="w-3.5 h-3.5" /> },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => { setAuthTab(tab.id); setAuthError(null); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      authTab === tab.id
                        ? 'bg-[#0E7C5A] text-[#B8E65A] shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Error Banner */}
              {authError && (
                <div className="mb-4 p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-200 font-mono">
                  ⚠️ {authError}
                </div>
              )}

              {/* GOOGLE TAB */}
              {authTab === 'google' && (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGoogleClick}
                    disabled={isAuthenticating || isLoadingAuth}
                    className="w-full bg-white hover:bg-slate-100 text-slate-900 font-extrabold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 cursor-pointer shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>{isAuthenticating || isLoadingAuth ? 'CONNECTING...' : 'CONTINUE WITH GOOGLE'}</span>
                  </button>

                  <div className="relative flex items-center gap-2 py-1">
                    <div className="flex-1 h-px bg-slate-700" />
                    <span className="text-[11px] text-slate-500 font-mono">OR</span>
                    <div className="flex-1 h-px bg-slate-700" />
                  </div>

                  <button
                    type="button"
                    onClick={handleDemoClick}
                    disabled={isAuthenticating}
                    className="w-full bg-[#16A36A] hover:bg-[#0E7C5A] text-slate-950 font-black py-3 px-6 rounded-xl neon-button-shadow flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                  >
                    {isAuthenticating ? (
                      <><UserCheck className="w-5 h-5 animate-pulse" /><span>ENTERING ARENA...</span></>
                    ) : (
                      <><Play className="w-5 h-5 fill-current" /><span>FAST-PASS DEMO (JUDGES)</span></>
                    )}
                  </button>

                  <div className="pt-2 border-t border-slate-800 text-center text-[11px] text-slate-500 font-mono">
                    New to EcoQuest?{' '}
                    <button type="button" onClick={() => setAuthTab('signup')} className="text-[#B8E65A] hover:underline cursor-pointer">
                      Create an account →
                    </button>
                  </div>
                </div>
              )}

              {/* SIGN UP TAB */}
              {authTab === 'signup' && (
                <form onSubmit={handleEmailSignUpClick} className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text" required value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Ananth E"
                      className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#16A36A] focus:ring-1 focus:ring-[#16A36A] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1">Campus Email</label>
                    <input
                      type="email" required value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="student@saranathan.ac.in"
                      className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#16A36A] focus:ring-1 focus:ring-[#16A36A] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1">Password</label>
                    <input
                      type="password" required value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#16A36A] focus:ring-1 focus:ring-[#16A36A] transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full bg-[#16A36A] hover:bg-[#0E7C5A] text-slate-950 font-black py-3.5 px-6 rounded-xl neon-button-shadow flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>{isAuthenticating ? 'CREATING HERO...' : 'CREATE MY HERO ACCOUNT'}</span>
                  </button>
                  <div className="text-center text-[11px] text-slate-500 font-mono">
                    Already have an account?{' '}
                    <button type="button" onClick={() => setAuthTab('signin')} className="text-[#B8E65A] hover:underline cursor-pointer">Sign in →</button>
                  </div>
                </form>
              )}

              {/* SIGN IN TAB */}
              {authTab === 'signin' && (
                <form onSubmit={handleEmailSignInClick} className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1">Campus Email</label>
                    <input
                      type="email" required value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="student@saranathan.ac.in"
                      className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#16A36A] focus:ring-1 focus:ring-[#16A36A] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1">Password</label>
                    <input
                      type="password" required value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Your password"
                      className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#16A36A] focus:ring-1 focus:ring-[#16A36A] transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full bg-[#16A36A] hover:bg-[#0E7C5A] text-slate-950 font-black py-3.5 px-6 rounded-xl neon-button-shadow flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>{isAuthenticating ? 'SIGNING IN...' : 'SIGN IN TO ARENA'}</span>
                  </button>
                  <div className="text-center text-[11px] text-slate-500 font-mono">
                    No account?{' '}
                    <button type="button" onClick={() => setAuthTab('signup')} className="text-[#B8E65A] hover:underline cursor-pointer">Create one →</button>
                  </div>
                </form>
              )}

              {/* Motivation card */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="bg-slate-950/80 border border-dashed border-[#F5C451]/50 p-3 rounded-2xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F5C451]/10 border border-[#F5C451]/30 flex items-center justify-center shrink-0">
                    <Gift className="w-5 h-5 text-[#F5C451] animate-bounce" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono font-bold text-[#F5C451] flex items-center gap-1">
                      <Lock className="w-3 h-3" /> DAY 1 PIONEER BADGE LOCKED
                    </div>
                    <div className="text-[10px] text-slate-300">
                      Log in to unlock your Day 1 Badge, +150 Starter XP & Eco Spirit!
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
