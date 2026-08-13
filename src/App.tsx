import React, { useState, useEffect } from 'react';
import { User, Quest, Bounty, Guild, DepartmentRank, ShopItem, QRPortal, LiveActivity, ImpactMetrics, Department, UserProfile } from './types';
import { AvatarCustomization } from './data/avatarsData';
import { apiService } from './services/apiService';
import { audioService } from './services/audioService';
import { dbCacheService } from './services/dbCacheService';
import {
  onAuthStateChange,
  signInWithGoogle,
  signUpWithEmailPassword,
  signInWithEmailPassword,
  signOutUser,
  getUserProfile,
  getUserProgress,
  saveUserProfile,
  saveUserProfileAndProgress,
  assembleAppUser
} from './services/firebase';

import { CinematicPreloader } from './components/CinematicPreloader';
import { LandingPage } from './components/LandingPage';
import { HeaderHUD } from './components/HeaderHUD';
import { NavigationTabs } from './components/NavigationTabs';
import { EcoParticleCanvas } from './components/EcoParticleCanvas';
import { ToastNotificationContainer, showToast } from './components/ToastNotification';

import { DashboardView } from './components/DashboardView';
import { QuestsView } from './components/QuestsView';
import { AICoachView } from './components/AICoachView';
import { EcoPetView } from './components/EcoPetView';
import { EcoWorldView } from './components/EcoWorldView';
import { GuildWarsView } from './components/GuildWarsView';
import { EcoHuntView } from './components/EcoHuntView';
import { BountiesView } from './components/BountiesView';
import { EcoShopView } from './components/EcoShopView';
import { LeaderboardView } from './components/LeaderboardView';
import { ImpactView } from './components/ImpactView';
import { AdminDashboard } from './components/AdminDashboard';

import { AIVisionModal } from './components/AIVisionModal';
import { RewardModal } from './components/RewardModal';
import { SearchModal } from './components/SearchModal';
import { JudgeDemoRunner } from './components/JudgeDemoRunner';
import { OnboardingWizard } from './components/OnboardingWizard';
import { ProfileEditModal } from './components/ProfileEditModal';
import { ProfileView } from './components/ProfileView';

export function App() {
  const [isPreloading, setIsPreloading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [firebaseAuthUser, setFirebaseAuthUser] = useState<any>(null);
  // true while waiting for Firebase auth to resolve (before we know if logged in)
  const [isAuthResolving, setIsAuthResolving] = useState(true);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isJudgeDemoOpen, setIsJudgeDemoOpen] = useState(false);
  const [showLandingView, setShowLandingView] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Game collections
  const [quests, setQuests] = useState<Quest[]>([]);
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [departmentRanks, setDepartmentRanks] = useState<DepartmentRank[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [qrPortals, setQrPortals] = useState<QRPortal[]>([]);
  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>([]);
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetrics>({
    plasticItemsAvoided: 12480,
    waterSavedLiters: 86240,
    energySavedKwh: 14200,
    co2AvoidedKg: 3420,
    treesPlanted: 1842,
    totalEcoActions: 24680,
    activeStudents: 1247
  });

  // UI Modals
  const [aiVisionQuest, setAiVisionQuest] = useState<Quest | null>(null);
  const [rewardData, setRewardData] = useState<{ xpEarned: number; coinsEarned: number; title: string } | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // 1. Firebase Auth Listener — resolves auth state and fetches Firestore profile
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (authUser) => {
      setFirebaseAuthUser(authUser);
      if (authUser) {
        setIsLoadingAuth(true);
        setShowLandingView(false); // Ensure landing page is hidden when logged in
        try {
          const profile = await getUserProfile(authUser.uid);
          const progress = await getUserProgress(authUser.uid);

          if (profile) {
            const assembled = assembleAppUser(authUser, profile, progress);
            setUser(assembled);
            dbCacheService.cacheUser(assembled);
            if (!profile.onboardingCompleted) {
              setShowOnboarding(true);
            }
          } else {
            // Check IndexedDB fallback or assemble minimal user
            const cachedUser = await dbCacheService.getCachedUser();
            if (cachedUser && cachedUser.id === authUser.uid) {
              setUser(cachedUser);
            } else {
              const minimalUser = assembleAppUser(authUser, null, null);
              setUser(minimalUser);
              setShowOnboarding(true);
            }
          }
        } catch (err) {
          console.warn('Firebase Auth profile sync error:', err);
          const minimalUser = assembleAppUser(authUser, null, null);
          setUser(minimalUser);
        } finally {
          setIsLoadingAuth(false);
          setIsAuthResolving(false);
        }
      } else {
        // Not signed in
        setUser(null);
        setIsAuthResolving(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Ctrl + K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Online/Offline Status Listeners
  useEffect(() => {
    const handleOffline = () => {
      setIsOfflineMode(true);
      showToast({
        type: 'offline',
        title: 'Network Interrupted',
        message: 'Switched to offline-first mode. Quests & state saved locally in IndexedDB.'
      });
    };

    const handleOnline = () => {
      setIsOfflineMode(false);
      showToast({
        type: 'online',
        title: 'Back Online!',
        message: 'Reconnected to campus server. Syncing IndexedDB game cache...'
      });
      loadState();
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Fetch initial game state with IndexedDB fallback
  const loadState = async () => {
    try {
      const data = await apiService.getInitialState();
      if (!user && !firebaseAuthUser) {
        setUser(data.user);
      }
      setQuests(data.quests);
      setBounties(data.bounties);
      setGuilds(data.guilds);
      setDepartmentRanks(data.departmentRanks);
      setShopItems(data.shopItems);
      setQrPortals(data.qrPortals);
      setLiveActivities(data.liveActivities);
      if (data.impactMetrics) {
        setImpactMetrics(data.impactMetrics);
      }

      // Cache to IndexedDB for offline persistence
      await dbCacheService.cacheQuests(data.quests);
      await dbCacheService.setItem('game_full_state', data);
    } catch (err) {
      console.warn('Network load failed, falling back to IndexedDB cache:', err);
      setIsOfflineMode(true);
      const cachedQuests = await dbCacheService.getCachedQuests();
      const cachedUser = await dbCacheService.getCachedUser();
      const cachedFullState = await dbCacheService.getItem<any>('game_full_state');

      if (!user && cachedUser) setUser(cachedUser);
      if (cachedQuests) setQuests(cachedQuests);
      if (cachedFullState?.data) {
        setBounties(cachedFullState.data.bounties || []);
        setGuilds(cachedFullState.data.guilds || []);
        setDepartmentRanks(cachedFullState.data.departmentRanks || []);
        setShopItems(cachedFullState.data.shopItems || []);
        setQrPortals(cachedFullState.data.qrPortals || []);
        setLiveActivities(cachedFullState.data.liveActivities || []);
        if (cachedFullState.data.impactMetrics) setImpactMetrics(cachedFullState.data.impactMetrics);
      }

      showToast({
        type: 'offline',
        title: 'Offline Cache Active',
        message: 'Loaded game state directly from browser IndexedDB.'
      });
    }
  };

  useEffect(() => {
    loadState();
  }, []);

  // Handle Google OAuth Sign-In
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setShowLandingView(false);
    } catch (err: any) {
      throw err;
    }
  };

  // Email/Password Sign-Up
  const handleEmailSignUp = async (name: string, email: string, pass: string) => {
    const { firebaseUser } = await signUpWithEmailPassword(name, email, pass);
    setFirebaseAuthUser(firebaseUser);
    setShowLandingView(false);
    setShowOnboarding(true);
  };

  // Email/Password Sign-In
  const handleEmailSignIn = async (email: string, pass: string) => {
    const { firebaseUser, isFirstLogin } = await signInWithEmailPassword(email, pass);
    setFirebaseAuthUser(firebaseUser);
    setShowLandingView(false);
    if (isFirstLogin) setShowOnboarding(true);
  };

  // Demo/Guest Login Handler for Judges
  const handleDemoLogin = async (username = 'Judge Demo User', email = 'judge@saranathan.ac.in', department: Department = 'AI & DS') => {
    audioService.playClick();
    try {
      // Build a rich demo user locally — no server dependency
      const demoUser: User = {
        id: 'demo_judge_01',
        name: username || 'Judge Demo User',
        email: email || 'judge@saranathan.ac.in',
        avatar: 'forest_guardian',
        photoURL: '',
        department: department || 'AI & DS',
        level: 18,
        xp: 2450,
        nextLevelXp: 3000,
        coins: 1850,
        streak: 17,
        streakFreeze: 1,
        ecoSpiritName: 'Volt',
        ecoSpiritStage: 'Cyber Sapling',
        ecoSpiritStageLevel: 2,
        unlockedWorldItems: ['solar_panel_1', 'rain_harvester_1', 'urban_garden_1'],
        badges: [
          { id: 'b1', title: 'Plastic Breaker', description: 'Avoided single-use plastics for 10 consecutive days', icon: 'ShieldCheck', rarity: 'Rare', unlockedAt: '2026-08-01' },
          { id: 'b2', title: 'Solar Sentinel', description: 'Scanned 5 solar energy portals across campus', icon: 'Sun', rarity: 'Epic', unlockedAt: '2026-08-05' },
          { id: 'b3', title: 'Streak Master', description: 'Maintained a 15-day eco quest streak', icon: 'Flame', rarity: 'Legendary', unlockedAt: '2026-08-10' }
        ],
        unlockedSkins: ['neon_cyber_green', 'obsidian_dark'],
        activeFrame: 'frame_neon_glitch',
        role: 'student',
        createdAt: '2026-07-15',
        lastActive: new Date().toISOString(),
        campusRank: 12,
        fullName: username || 'Judge Demo User',
        preferredName: (username || 'Judge').split(' ')[0],
        collegeName: 'Saranathan College of Engineering',
        yearOfStudy: '3rd Year',
        section: 'A',
        sustainabilityInterests: ['♻️ Waste Reduction', '⚡ Energy', '🌱 Food & Agriculture'],
        personalGoal: 'Demonstrate EcoQuest features',
        weeklyGoal: 7,
        profileCompletionScore: 95,
        bio: 'Demo judge account — full feature access enabled.'
      };

      setUser(demoUser);
      setShowLandingView(false);
      showToast({
        type: 'success',
        title: `Welcome, ${demoUser.preferredName}! 🌱`,
        message: 'Fast-Pass Demo Mode active. Full EcoQuest experience unlocked!',
        xpReward: 100,
        coinReward: 50
      });

      // Load game state in the background (quests, bounties, etc.)
      loadState();
    } catch (err) {
      console.error('Demo Login error:', err);
      showToast({ type: 'warning', title: 'Demo login failed', message: 'Please refresh and try again.' });
    }
  };

  // Onboarding Completed Handler — receives data directly from OnboardingWizard
  const handleCompleteOnboarding = async (onboardingData: {
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
  }) => {
    const uid = firebaseAuthUser?.uid || user?.id;
    if (!uid) return;

    const userPhoto = firebaseAuthUser?.photoURL || user?.photoURL || '';

    // Build profile doc for Firestore
    const profileDoc = {
      fullName: onboardingData.fullName,
      preferredName: onboardingData.preferredName,
      email: firebaseAuthUser?.email || user?.email || '',
      photoURL: userPhoto,
      collegeName: onboardingData.collegeName,
      department: onboardingData.department,
      yearOfStudy: onboardingData.yearOfStudy,
      section: onboardingData.section,
      sustainabilityInterests: onboardingData.sustainabilityInterests,
      preferredQuestCategories: [],
      personalGoal: onboardingData.personalGoal,
      weeklyGoal: onboardingData.weeklyGoal,
      selectedAvatar: onboardingData.selectedAvatar,
      avatarCustomization: onboardingData.avatarCustomization,
      selectedEcoSpirit: 'Sproutling',
      profileCompletionScore: 90,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const progressDoc = {
      xp: 150,
      level: 1,
      nextLevelXp: 1000,
      coins: 250,
      streak: 1,
      streakFreeze: 1,
      ecoSpiritName: 'Sproutling',
      ecoSpiritStage: 'Sprout' as const,
      ecoSpiritStageLevel: 1,
      unlockedWorldItems: ['rain_harvester_1'],
      unlockedSkins: ['neon_cyber_green'],
      unlockedAvatars: [onboardingData.selectedAvatar],
      unlockedCustomizations: [],
      activeFrame: 'frame_neon_glitch',
      role: 'student' as const,
      campusRank: 42
    };

    try {
      await saveUserProfileAndProgress(uid, profileDoc, progressDoc);
    } catch (err) {
      console.warn('Saving onboarding profile to Firestore failed:', err);
    }

    const newAppUser: User = {
      id: uid,
      name: onboardingData.preferredName || onboardingData.fullName,
      email: firebaseAuthUser?.email || user?.email || '',
      avatar: onboardingData.selectedAvatar,
      photoURL: userPhoto,
      department: onboardingData.department,
      level: 1,
      xp: 150,
      nextLevelXp: 1000,
      coins: 250,
      streak: 1,
      streakFreeze: 1,
      ecoSpiritName: 'Sproutling',
      ecoSpiritStage: 'Sprout',
      ecoSpiritStageLevel: 1,
      unlockedWorldItems: ['rain_harvester_1'],
      badges: [],
      unlockedSkins: ['neon_cyber_green'],
      activeFrame: 'frame_neon_glitch',
      role: 'student',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      campusRank: 42,
      fullName: onboardingData.fullName,
      preferredName: onboardingData.preferredName,
      collegeName: onboardingData.collegeName,
      yearOfStudy: onboardingData.yearOfStudy,
      section: onboardingData.section,
      sustainabilityInterests: onboardingData.sustainabilityInterests,
      personalGoal: onboardingData.personalGoal,
      weeklyGoal: onboardingData.weeklyGoal,
      avatarCustomization: onboardingData.avatarCustomization,
      profileCompletionScore: 90,
      bio: ''
    };

    setUser(newAppUser);
    dbCacheService.cacheUser(newAppUser);
    setShowOnboarding(false);

    showToast({
      type: 'success',
      title: '🌟 Hero Profile Created!',
      message: `Welcome, ${newAppUser.name}! Your Eco Spirit Sproutling is ready for campus quests!`,
      xpReward: 150,
      coinReward: 75
    });
  };

  // Profile Edit Save Handler
  const handleSaveProfileEdit = async (updatedData: Partial<UserProfile>) => {
    if (!user) return;

    const currentProfile: UserProfile = {
      userId: user.id,
      email: user.email,
      department: updatedData.department || user.department,
      avatar: updatedData.avatar || user.avatar,
      avatarCustomization: updatedData.avatarCustomization || user.avatarCustomization,
      preferredName: updatedData.preferredName || user.preferredName,
      collegeName: updatedData.collegeName || user.collegeName,
      yearOfStudy: updatedData.yearOfStudy || user.yearOfStudy,
      ecoSpiritName: updatedData.ecoSpiritName || user.ecoSpiritName,
      primaryFocusArea: updatedData.primaryFocusArea || user.primaryFocusArea,
      weeklyGoal: updatedData.weeklyGoal || user.weeklyGoal,
      notificationPreference: updatedData.notificationPreference || user.notificationPreference,
      profileCompletionScore: 100,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString()
    };

    try {
      await saveUserProfile(currentProfile);
    } catch (err) {
      console.warn('Save edited profile to Firestore failed:', err);
    }

    const newAppUser: User = {
      ...user,
      ...currentProfile
    };

    setUser(newAppUser);
    dbCacheService.cacheUser(newAppUser);
    setIsProfileEditOpen(false);

    showToast({
      type: 'success',
      title: 'Hero Profile Updated!',
      message: 'Your avatar customization and preferences have been synced.'
    });
  };

  // Sign Out Handler
  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch {
      // Ignored
    }
    setUser(null);
    setFirebaseAuthUser(null);
    setShowLandingView(true);
    showToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been safely signed out of EcoQuest.'
    });
  };

  // Quest Actions
  const handleAcceptQuest = async (questId: string) => {
    // Tactile haptic feedback pulse using browser Vibration API
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([35, 20, 35]);
    }
    const quest = quests.find(q => q.id === questId);
    try {
      await apiService.acceptQuest(questId);
      showToast({
        type: 'success',
        title: 'Quest Accepted!',
        message: `Added "${quest?.title || 'Eco Quest'}" to active quest log.`
      });
      loadState();
    } catch (err) {
      // Offline fallback
      await dbCacheService.queueOfflineAction({ type: 'ACCEPT_QUEST', payload: { questId } });
      setQuests(prev => prev.map(q => q.id === questId ? { ...q, accepted: true } : q));
      showToast({
        type: 'success',
        title: 'Quest Accepted (Offline)',
        message: `Saved to IndexedDB offline queue.`
      });
    }
  };

  const handleCompleteQuestDirect = async (questId: string) => {
    // Tactile haptic feedback pulse using browser Vibration API
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([50, 30, 80]);
    }
    const quest = quests.find(q => q.id === questId);
    try {
      const res = await apiService.completeQuestDirect(questId);
      setUser(res.user);
      setRewardData({
        xpEarned: res.xpEarned,
        coinsEarned: res.coinsEarned,
        title: quest?.title || 'Quest Completed'
      });
      showToast({
        type: 'success',
        title: 'Quest Complete!',
        message: `Verified: "${quest?.title || 'Eco Action'}"`,
        xpReward: res.xpEarned,
        coinReward: res.coinsEarned
      });
      loadState();
    } catch (err) {
      console.error('Complete quest error:', err);
    }
  };

  // User state partial updates
  const handleUpdateUser = (updated: Partial<User>) => {
    if (user) {
      const newU = { ...user, ...updated };
      setUser(newU);
      dbCacheService.cacheUser(newU);
    }
  };

  // Render Preloader
  if (isPreloading) {
    return <CinematicPreloader onComplete={() => setIsPreloading(false)} />;
  }

  // While Firebase auth is still resolving (first load), show a minimal spinner
  if (isAuthResolving) {
    return (
      <div className="min-h-screen bg-[#071A14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#0E7C5A]/30 border border-[#16A36A]/50 flex items-center justify-center shadow-[0_0_30px_rgba(22,163,106,0.4)] animate-pulse">
            <span className="text-3xl">🌱</span>
          </div>
          <div className="text-[#B8E65A] font-mono text-sm tracking-widest animate-pulse">LOADING ECOQUEST...</div>
        </div>
      </div>
    );
  }

  // Render Landing Page if not authenticated or explicitly viewing landing page
  if (!user || showLandingView) {
    return (
      <LandingPage
        onGoogleSignIn={handleGoogleSignIn}
        onEmailSignUp={handleEmailSignUp}
        onEmailSignIn={handleEmailSignIn}
        onDemoSignIn={(name, email, dept) => handleDemoLogin(name, email, dept)}
        isLoadingAuth={isLoadingAuth}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#071A14] text-slate-100 font-sans selection:bg-[#16A36A] selection:text-slate-950 relative overflow-x-hidden">
      
      {/* Toast Notification Container */}
      <ToastNotificationContainer />

      {/* Canvas-based Floating Leaves & Light Orbs Particle System */}
      <EcoParticleCanvas />

      {/* Background Ambient Glow Effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#0E7C5A]/15 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
        
        {/* Top Header HUD */}
        <HeaderHUD
          user={user}
          notificationsOpen={notificationsOpen}
          setNotificationsOpen={setNotificationsOpen}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenCommandPalette={() => setIsSearchOpen(true)}
          onOpenAdmin={() => setActiveTab('admin')}
          onOpenProfile={() => setActiveTab('profile')}
          onOpenJudgeDemo={() => setIsJudgeDemoOpen(true)}
          onOpenLanding={() => setShowLandingView(true)}
        />

        {/* Primary Navigation Tabs */}
        <NavigationTabs
          activeTab={activeTab}
          onChangeTab={(tab) => {
            audioService.playClick();
            setActiveTab(tab);
          }}
          setActiveTab={(tab) => {
            audioService.playClick();
            setActiveTab(tab);
          }}
          isAdmin={user.role === 'admin'}
        />

        {/* View Switcher */}
        <main className="transition-all duration-300">
          {activeTab === 'dashboard' && (
            <DashboardView
              user={user}
              quests={quests}
              bounties={bounties}
              liveActivities={liveActivities}
              impactMetrics={impactMetrics}
              onOpenQuests={() => setActiveTab('quests')}
              onOpenPet={() => setActiveTab('pet')}
              onOpenWorld={() => setActiveTab('world')}
              onOpenAIVision={(quest) => setAiVisionQuest(quest)}
              onOpenBounties={() => setActiveTab('bounties')}
              onOpenProfileEdit={() => setIsProfileEditOpen(true)}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              user={user}
              quests={quests}
              impactMetrics={impactMetrics}
              onOpenEdit={() => setIsProfileEditOpen(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'quests' && (
            <QuestsView
              quests={quests}
              onAcceptQuest={handleAcceptQuest}
              onOpenAIVision={(quest) => setAiVisionQuest(quest)}
              onCompleteQuestDirect={handleCompleteQuestDirect}
            />
          )}

          {activeTab === 'coach' && <AICoachView user={user} />}

          {activeTab === 'pet' && (
            <EcoPetView user={user} onUpdateUser={handleUpdateUser} />
          )}

          {activeTab === 'world' && (
            <EcoWorldView user={user} onUpdateUser={handleUpdateUser} />
          )}

          {activeTab === 'guilds' && (
            <GuildWarsView
              user={user}
              guilds={guilds}
              departmentRanks={departmentRanks}
              onRefreshGuilds={loadState}
            />
          )}

          {activeTab === 'hunt' && (
            <EcoHuntView
              user={user}
              portals={qrPortals}
              onRefreshPortals={loadState}
            />
          )}

          {activeTab === 'bounties' && (
            <BountiesView
              user={user}
              bounties={bounties}
              onRefreshBounties={loadState}
            />
          )}

          {activeTab === 'shop' && (
            <EcoShopView
              user={user}
              shopItems={shopItems}
              onRefreshShop={loadState}
              onUpdateUser={handleUpdateUser}
            />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardView
              user={user}
              students={[
                { userId: user.id, username: user.name, department: user.department, avatar: user.avatar, level: user.level, xp: user.xp, streak: user.streak, rank: user.campusRank, previousRank: user.campusRank + 2 },
                { userId: 'u2', username: 'Kavitha S.', department: 'ECE', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', level: 12, xp: 4850, streak: 12, rank: 1, previousRank: 1 },
                { userId: 'u3', username: 'Rohan Verma', department: 'CSE', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', level: 11, xp: 4420, streak: 9, rank: 2, previousRank: 3 },
                { userId: 'u4', username: 'Priya Sharma', department: 'AI & DS', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', level: 10, xp: 3950, streak: 7, rank: 3, previousRank: 2 },
                { userId: 'u5', username: 'Siddharth R.', department: 'Mechanical', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', level: 8, xp: 2900, streak: 5, rank: 5, previousRank: 5 }
              ]}
              departments={departmentRanks}
            />
          )}

          {activeTab === 'impact' && (
            <ImpactView user={user} impact={impactMetrics} />
          )}

          {activeTab === 'admin' && (
            <AdminDashboard
              onRefreshQuests={loadState}
              onRefreshBounties={loadState}
            />
          )}
        </main>

        {/* Global Footer */}
        <footer className="pt-8 pb-4 text-center font-mono text-xs text-slate-500 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            ECOQUEST v3.6 • Saranathan College of Engineering Campus Arena
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            {firebaseAuthUser && (
              <button
                onClick={handleSignOut}
                className="text-rose-400 hover:text-rose-300 transition-colors font-bold cursor-pointer"
              >
                LOGOUT ({user.email || 'USER'})
              </button>
            )}
            <span className="text-[#B8E65A] font-bold">⚡ 60 FPS ENGINE ACTIVE</span>
            <span>PROMOTING SUSTAINABILITY IN CAMPUSES</span>
          </div>
        </footer>

      </div>

      {/* Onboarding Wizard Modal for First-Time Logins */}
      {showOnboarding && (
        <OnboardingWizard
          initialName={firebaseAuthUser?.displayName || user?.name || 'Eco Hero'}
          initialEmail={firebaseAuthUser?.email || user?.email || ''}
          onComplete={handleCompleteOnboarding}
        />
      )}

      {/* Profile & Avatar Customization Edit Modal */}
      {isProfileEditOpen && user && (
        <ProfileEditModal
          user={user}
          onClose={() => setIsProfileEditOpen(false)}
          onSave={handleSaveProfileEdit}
          onSignOut={handleSignOut}
        />
      )}

      {/* AI Vision Verification Modal */}
      {aiVisionQuest && (
        <AIVisionModal
          quest={aiVisionQuest}
          onClose={() => setAiVisionQuest(null)}
          onSuccess={(res) => {
            setUser(res.user);
            setRewardData({
              xpEarned: res.xpEarned,
              coinsEarned: res.coinsEarned,
              title: res.quest.title
            });
            loadState();
          }}
        />
      )}

      {/* Reward Sequence Celebration Modal */}
      {rewardData && (
        <RewardModal
          xpEarned={rewardData.xpEarned}
          coinsEarned={rewardData.coinsEarned}
          title={rewardData.title}
          onClose={() => setRewardData(null)}
        />
      )}

      {/* Ctrl + K Search Command Palette Modal */}
      {isSearchOpen && (
        <SearchModal
          quests={quests}
          bounties={bounties}
          onClose={() => setIsSearchOpen(false)}
          onNavigate={(tab) => setActiveTab(tab)}
          onSelectQuest={(quest) => {
            setActiveTab('quests');
            setAiVisionQuest(quest);
          }}
        />
      )}

      {/* 5 WOW Moments Judge Presentation Demo Modal */}
      {isJudgeDemoOpen && user && (
        <JudgeDemoRunner
          user={user}
          quests={quests}
          departments={departmentRanks}
          onOpenAIVision={(quest) => setAiVisionQuest(quest)}
          onNavigateTab={(tab) => setActiveTab(tab)}
          onUpdateUser={handleUpdateUser}
          onUpdateDepartments={(depts) => setDepartmentRanks(depts)}
          onClose={() => setIsJudgeDemoOpen(false)}
        />
      )}

    </div>
  );
}

export default App;

