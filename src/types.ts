export type Department = 
  | 'AI & DS'
  | 'ECE'
  | 'CSE'
  | 'MECHANICAL'
  | 'BIOTECH'
  | 'IT'
  | 'CIVIL'
  | 'EEE';

export interface UserProfile {
  userId: string;
  email: string;
  department: Department;
  avatar: string;
  photoURL?: string;
  avatarCustomization?: any;
  preferredName: string;
  fullName?: string;
  collegeName: string;
  yearOfStudy: string;
  section?: string;
  ecoSpiritName: string;
  primaryFocusArea?: string;
  weeklyGoal: number;
  notificationPreference?: string;
  profileCompletionScore: number;
  onboardingCompleted: boolean;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  photoURL?: string;
  department: Department;
  level: number;
  xp: number;
  nextLevelXp: number;
  coins: number;
  streak: number;
  streakFreeze: number;
  ecoSpiritName: string;
  ecoSpiritStage: 'Sprout' | 'Cyber Sapling' | 'Cyber Tree' | 'Ecosystem Guardian' | 'Planetary Guardian';
  ecoSpiritStageLevel: number;
  unlockedWorldItems: string[];
  badges: Badge[];
  unlockedSkins: string[];
  activeFrame: string;
  role: 'student' | 'admin' | 'faculty';
  createdAt: string;
  lastActive: string;
  campusRank: number;

  // Profile & Customization Extensions (Firebase User Profiles)
  fullName?: string;
  preferredName?: string;
  collegeName?: string;
  yearOfStudy?: string;
  section?: string;
  rollNumber?: string;
  phoneNumber?: string;
  gender?: string;
  city?: string;
  state?: string;
  country?: string;
  sustainabilityInterests?: string[];
  preferredQuestCategories?: string[];
  personalGoal?: string;
  weeklyGoal?: number;
  avatarCustomization?: {
    hairstyle: string;
    outfit: string;
    skinTone: string;
    hairColor: string;
    accessory: string;
    backpack: string;
    glasses: string;
    helmet: string;
    ecoBadge: string;
    aura: string;
    shoes: string;
  };
  profileCompletionScore?: number;
  bio?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'Plastic' | 'Water' | 'Energy' | 'Mobility' | 'Biodiversity' | 'Recycling';
  xp: number;
  coins: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Legendary';
  verificationType: 'AI_VISION' | 'QR_CODE' | 'FACULTY_CODE' | 'SELF_REPORT';
  accepted: boolean;
  completed: boolean;
  completedAt?: string;
  timerMinutes?: number;
  icon: string;
  instructions: string;
  departmentBonus?: Department;
}

export interface Bounty {
  id: string;
  title: string;
  description: string;
  rewardXp: number;
  rewardCoins: number;
  expiresAt: string;
  accepted: boolean;
  completed: boolean;
  targetDepartment?: Department;
  maxParticipants: number;
  currentParticipants: number;
  location: string;
}

export interface QRPortal {
  id: string;
  name: string;
  location: string;
  xpReward: number;
  coinsReward: number;
  category: string;
  code: string;
  scanned: boolean;
  clueHint: string;
}

export interface Guild {
  id: string;
  name: string;
  tag: string;
  department: Department;
  level: number;
  xp: number;
  membersCount: number;
  maxMembers: number;
  leader: string;
  emblem: string;
  description: string;
}

export interface LeaderboardEntry {
  rank: number;
  previousRank: number;
  userId: string;
  username: string;
  avatar: string;
  department: Department;
  level: number;
  xp: number;
  streak: number;
  badgesCount: number;
}

export interface DepartmentRank {
  rank: number;
  department: Department;
  score: number;
  membersCount: number;
  weeklyGrowth: number;
  primaryColor: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'COSMETIC' | 'PET_SKIN' | 'CANTEEN_VOUCHER' | 'CAMPUS_MERCH' | 'CRATE';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  icon: string;
  image?: string;
  purchased?: boolean;
  discountCode?: string;
}

export interface LiveActivity {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  department: Department;
  action: string;
  category: string;
  timestamp: string;
  xpEarned?: number;
}

export interface ImpactMetrics {
  plasticItemsAvoided: number;
  waterSavedLiters: number;
  energySavedKwh: number;
  co2AvoidedKg: number;
  treesPlanted: number;
  totalEcoActions: number;
  activeStudents: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'QUEST' | 'LEVEL_UP' | 'BADGE' | 'AVATAR' | 'GUILD' | 'STREAK' | 'AI' | 'IMPACT' | 'ECO_SPIRIT';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  icon?: string;
  linkTab?: string;
}

// Interfaces for Separate Firestore Collections (Req #2)
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
  photoURL?: string;
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
  avatarCustomization: any;
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

export interface UserImpactDoc {
  plasticItemsAvoided: number;
  waterSavedLiters: number;
  energySavedKwh: number;
  co2AvoidedKg: number;
  treesPlanted: number;
  totalEcoActions: number;
  updatedAt: any;
}

export interface UserPreferencesDoc {
  notificationPreference: string;
  emailNotifications: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
  theme: string;
  updatedAt: any;
}

export interface UserAvatarsDoc {
  selectedAvatarId: string;
  customization: any;
  unlockedAvatars: string[];
  unlockedCosmetics: string[];
  updatedAt: any;
}

export interface UserAchievementsDoc {
  badges: Badge[];
  unlockedBadgeIds: string[];
  updatedAt: any;
}

export interface UserNotificationsDoc {
  notifications: NotificationItem[];
  unreadCount: number;
  updatedAt: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedQuests?: string[];
}

