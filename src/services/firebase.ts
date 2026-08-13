import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { User, Department } from '../types';
import { AvatarCustomization } from '../data/avatarsData';

// Fallback config from firebase-applet-config.json
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId,
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure local persistence
setPersistence(auth, browserLocalPersistence).catch(console.error);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Interfaces for Separate User Data Structures (Req #2 & #9)
export interface UserDoc {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: any;
  lastLoginAt: any;
  onboardingCompleted: boolean;
  profileCompleted: boolean;
}

export interface UserProfileDoc {
  fullName: string;
  preferredName: string;
  email: string;
  phoneNumber?: string;
  collegeName: string;
  department: Department;
  yearOfStudy: string;
  section: string;
  rollNumber?: string;
  gender?: string;
  city?: string;
  state?: string;
  country?: string;
  sustainabilityInterests: string[];
  preferredQuestCategories: string[];
  personalGoal?: string;
  weeklyGoal: number;
  selectedAvatar: string;
  avatarCustomization: AvatarCustomization;
  selectedEcoSpirit: string;
  bio?: string;
  profileCompletionScore: number;
  onboardingCompleted?: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface UserProgressDoc {
  xp: number;
  level: number;
  nextLevelXp: number;
  coins: number;
  streak: number;
  streakFreeze: number;
  ecoSpiritName: string;
  ecoSpiritStage: 'Sprout' | 'Cyber Sapling' | 'Cyber Tree' | 'Ecosystem Guardian' | 'Planetary Guardian';
  ecoSpiritStageLevel: number;
  unlockedWorldItems: string[];
  unlockedSkins: string[];
  unlockedAvatars: string[];
  unlockedCustomizations: string[];
  activeFrame: string;
  role: 'student' | 'admin' | 'faculty';
  campusRank: number;
}

// --- AUTH FUNCTIONS ---

export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    let isFirstLogin = false;

    try {
      // Check if user doc exists in Firestore
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      isFirstLogin = !userSnap.exists() || !userSnap.data()?.onboardingCompleted;

      const photoURL = firebaseUser.photoURL || '';
      const displayName = firebaseUser.displayName || 'Eco Hero';

      // Save/Merge root identity user record
      await setDoc(
        userRef,
        {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName,
          photoURL,
          lastLoginAt: serverTimestamp(),
          onboardingCompleted: true,
          profileCompleted: true,
          ...(isFirstLogin ? { createdAt: serverTimestamp() } : {})
        },
        { merge: true }
      );

      // Merge into userProfiles as well to ensure photoURL and name are available
      const profileRef = doc(db, 'userProfiles', firebaseUser.uid);
      await setDoc(
        profileRef,
        {
          email: firebaseUser.email || '',
          fullName: displayName,
          preferredName: displayName.split(' ')[0] || displayName,
          photoURL,
          onboardingCompleted: true,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );
    } catch (fsErr) {
      console.warn('Firestore user doc sync warning:', fsErr);
    }

    return { firebaseUser, isFirstLogin };
  } catch (error: any) {
    console.warn('Google Auth Popup Error:', error?.code || error?.message || error);
    throw error;
  }
};

export const signUpWithEmailPassword = async (name: string, email: string, pass: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const firebaseUser = userCredential.user;

  if (name) {
    try {
      await updateProfile(firebaseUser, { displayName: name });
    } catch {
      // Ignored
    }
  }

  // Create root identity doc safely with merge: true
  const userRef = doc(db, 'users', firebaseUser.uid);
  const newUserDoc: Partial<UserDoc> = {
    uid: firebaseUser.uid,
    email: firebaseUser.email || email,
    displayName: name || 'Eco Hero',
    photoURL: '',
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
    onboardingCompleted: false,
    profileCompleted: false
  };
  await setDoc(userRef, newUserDoc, { merge: true });

  // Also create initial userProfiles doc
  const profileRef = doc(db, 'userProfiles', firebaseUser.uid);
  await setDoc(
    profileRef,
    {
      email: firebaseUser.email || email,
      fullName: name || 'Eco Hero',
      preferredName: (name || 'Eco Hero').split(' ')[0],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );

  return { firebaseUser, isFirstLogin: true };
};

export const signInWithEmailPassword = async (email: string, pass: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const firebaseUser = userCredential.user;

  let isFirstLogin = false;
  try {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      isFirstLogin = true;
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName: firebaseUser.displayName || 'Eco Hero',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        onboardingCompleted: false,
        profileCompleted: false
      }, { merge: true });
    } else {
      await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
      isFirstLogin = !userSnap.data()?.onboardingCompleted;
    }
  } catch (fsErr) {
    console.warn('Firestore sign-in sync warning:', fsErr);
  }

  return { firebaseUser, isFirstLogin };
};

export const logoutUser = async () => {
  await firebaseSignOut(auth);
};

export const signOutUser = async () => {
  await firebaseSignOut(auth);
};

// --- FIRESTORE USER PROFILE & PROGRESS FUNCTIONS ---

export const saveUserProfile = async (profile: any) => {
  const uid = profile.userId || profile.uid;
  if (!uid) return;
  await setDoc(doc(db, 'userProfiles', uid), profile, { merge: true });
};

export const saveUserProgress = async (progress: any) => {
  const uid = progress.userId || progress.uid;
  if (!uid) return;
  await setDoc(doc(db, 'userProgress', uid), progress, { merge: true });
};

export const getUserDoc = async (uid: string): Promise<UserDoc | null> => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserDoc) : null;
};

export const getUserProfile = async (uid: string): Promise<UserProfileDoc | null> => {
  const snap = await getDoc(doc(db, 'userProfiles', uid));
  return snap.exists() ? (snap.data() as UserProfileDoc) : null;
};

export const getUserProgress = async (uid: string): Promise<UserProgressDoc | null> => {
  const snap = await getDoc(doc(db, 'userProgress', uid));
  return snap.exists() ? (snap.data() as UserProgressDoc) : null;
};

export const getUserImpact = async (uid: string) => {
  const snap = await getDoc(doc(db, 'userImpact', uid));
  return snap.exists() ? snap.data() : null;
};

export const saveUserImpact = async (uid: string, impact: any) => {
  if (!uid) return;
  await setDoc(doc(db, 'userImpact', uid), { ...impact, updatedAt: serverTimestamp() }, { merge: true });
};

export const getUserPreferences = async (uid: string) => {
  const snap = await getDoc(doc(db, 'userPreferences', uid));
  return snap.exists() ? snap.data() : null;
};

export const saveUserPreferences = async (uid: string, preferences: any) => {
  if (!uid) return;
  await setDoc(doc(db, 'userPreferences', uid), { ...preferences, updatedAt: serverTimestamp() }, { merge: true });
};

export const getUserAvatars = async (uid: string) => {
  const snap = await getDoc(doc(db, 'userAvatars', uid));
  return snap.exists() ? snap.data() : null;
};

export const saveUserAvatars = async (uid: string, avatarData: any) => {
  if (!uid) return;
  await setDoc(doc(db, 'userAvatars', uid), { ...avatarData, updatedAt: serverTimestamp() }, { merge: true });
};

export const getUserAchievements = async (uid: string) => {
  const snap = await getDoc(doc(db, 'userAchievements', uid));
  return snap.exists() ? snap.data() : null;
};

export const saveUserAchievements = async (uid: string, achievements: any) => {
  if (!uid) return;
  await setDoc(doc(db, 'userAchievements', uid), { ...achievements, updatedAt: serverTimestamp() }, { merge: true });
};

export const getUserNotifications = async (uid: string) => {
  const snap = await getDoc(doc(db, 'userNotifications', uid));
  return snap.exists() ? snap.data() : null;
};

export const saveUserNotifications = async (uid: string, notificationsData: any) => {
  if (!uid) return;
  await setDoc(doc(db, 'userNotifications', uid), { ...notificationsData, updatedAt: serverTimestamp() }, { merge: true });
};

export const saveUserProfileAndProgress = async (
  uid: string,
  profile: Partial<UserProfileDoc>,
  progress?: Partial<UserProgressDoc>
) => {
  const userRef = doc(db, 'users', uid);
  const profileRef = doc(db, 'userProfiles', uid);
  const progressRef = doc(db, 'userProgress', uid);

  // Calculate Profile Completion Score
  let filledFields = 0;
  const fieldsToCheck = [
    profile.fullName,
    profile.preferredName,
    profile.email,
    profile.collegeName,
    profile.department,
    profile.yearOfStudy,
    profile.section,
    profile.sustainabilityInterests?.length ? 'yes' : undefined,
    profile.weeklyGoal,
    profile.selectedAvatar,
    profile.phoneNumber,
    profile.city,
    profile.bio
  ];
  fieldsToCheck.forEach(f => {
    if (f !== undefined && f !== null && f !== '') filledFields++;
  });
  const profileCompletionScore = Math.min(100, Math.round((filledFields / 13) * 100));

  const updatedProfile: Partial<UserProfileDoc> = {
    ...profile,
    profileCompletionScore,
    updatedAt: serverTimestamp()
  };

  await setDoc(profileRef, updatedProfile, { merge: true });

  if (progress) {
    await setDoc(progressRef, progress, { merge: true });
  }

  // Also save to userAvatars collection if avatar is specified
  if (profile.selectedAvatar) {
    await saveUserAvatars(uid, {
      selectedAvatarId: profile.selectedAvatar,
      customization: profile.avatarCustomization
    });
  }

  // Mark onboarding complete in root user doc safely with merge: true
  await setDoc(
    userRef,
    {
      onboardingCompleted: true,
      profileCompleted: profileCompletionScore >= 80,
      lastLoginAt: serverTimestamp()
    },
    { merge: true }
  );
};

// Helper to convert Firestore profile + progress into App User state
export const assembleAppUser = (
  param1: any,
  param2?: any,
  param3?: any,
  param4?: any,
  param5?: any
): User => {
  let uid = '';
  let email = '';
  let userDoc: UserDoc | null = null;
  let profileDoc: UserProfileDoc | null = null;
  let progressDoc: UserProgressDoc | null = null;
  let authUserObj: any = null;

  if (typeof param1 === 'object' && param1 !== null && param1.uid) {
    // Called as assembleAppUser(authUser, profileDoc, progressDoc)
    authUserObj = param1;
    uid = param1.uid;
    email = param1.email || '';
    profileDoc = param2 || null;
    progressDoc = param3 || null;
  } else {
    // Called as assembleAppUser(uid, email, userDoc, profileDoc, progressDoc)
    uid = param1;
    email = param2 || '';
    userDoc = param3 || null;
    profileDoc = param4 || null;
    progressDoc = param5 || null;
  }

  const googlePhotoURL = authUserObj?.photoURL || (profileDoc as any)?.photoURL || (userDoc as any)?.photoURL || '';
  const googleName = authUserObj?.displayName || (userDoc as any)?.displayName || '';

  const userName = profileDoc?.preferredName || profileDoc?.fullName || googleName || 'Eco Hero';

  return {
    id: uid,
    name: userName,
    email: email || userDoc?.email || authUserObj?.email || '',
    avatar: profileDoc?.selectedAvatar || 'forest_guardian',
    photoURL: googlePhotoURL,
    department: (profileDoc?.department as Department) || 'AI & DS',
    level: progressDoc?.level || 1,
    xp: progressDoc?.xp || 150,
    nextLevelXp: progressDoc?.nextLevelXp || 1000,
    coins: progressDoc?.coins || 250,
    streak: progressDoc?.streak || 3,
    streakFreeze: progressDoc?.streakFreeze || 1,
    ecoSpiritName: progressDoc?.ecoSpiritName || 'Sproutling',
    ecoSpiritStage: progressDoc?.ecoSpiritStage || 'Sprout',
    ecoSpiritStageLevel: progressDoc?.ecoSpiritStageLevel || 1,
    unlockedWorldItems: progressDoc?.unlockedWorldItems || ['rain_harvester_1'],
    badges: [
      { id: 'b1', title: 'Zero-Plastic Pioneer', description: 'Initiated campus plastic reduction journey', icon: 'ShieldCheck', rarity: 'Common', unlockedAt: new Date().toISOString().split('T')[0] },
      { id: 'b2', title: 'Solar Sentinel', description: 'Scanned solar energy portals across campus', icon: 'Sun', rarity: 'Rare', unlockedAt: new Date().toISOString().split('T')[0] }
    ],
    unlockedSkins: progressDoc?.unlockedSkins || ['neon_cyber_green'],
    activeFrame: progressDoc?.activeFrame || 'frame_neon_glitch',
    role: progressDoc?.role || 'student',
    createdAt: userDoc?.createdAt?.toDate ? userDoc.createdAt.toDate().toISOString() : new Date().toISOString(),
    lastActive: new Date().toISOString(),
    campusRank: progressDoc?.campusRank || 14,
    // Attach profile extras onto User object for app-wide access
    fullName: profileDoc?.fullName || googleName,
    preferredName: profileDoc?.preferredName || (googleName ? googleName.split(' ')[0] : userName),
    collegeName: profileDoc?.collegeName || 'Saranathan College of Engineering',
    yearOfStudy: profileDoc?.yearOfStudy || '3rd Year',
    section: profileDoc?.section || 'A',
    sustainabilityInterests: profileDoc?.sustainabilityInterests || ['♻️ Waste Reduction', '⚡ Energy', '🌱 Food & Agriculture'],
    personalGoal: profileDoc?.personalGoal || 'Build a daily eco habit',
    weeklyGoal: profileDoc?.weeklyGoal || 5,
    avatarCustomization: profileDoc?.avatarCustomization,
    profileCompletionScore: profileDoc?.profileCompletionScore || 85,
    bio: profileDoc?.bio || 'Passionate about campus sustainability and renewable energy.'
  } as any;
};
