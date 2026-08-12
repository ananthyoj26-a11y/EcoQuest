import {
  User,
  Quest,
  Bounty,
  QRPortal,
  Guild,
  LeaderboardEntry,
  DepartmentRank,
  ShopItem,
  LiveActivity,
  ImpactMetrics,
  Department
} from '../types';

class ApiService {
  private baseUrl = '/api';

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Server error' }));
      throw new Error(errorData.message || `Request failed with status ${res.status}`);
    }

    return res.json();
  }

  // Auth & Profile
  async login(email?: string, name?: string, department?: Department): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, name, department })
    });
  }

  async getUserProfile(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/user/profile');
  }

  async updateUserProfile(data: Partial<User>): Promise<{ user: User }> {
    return this.request<{ user: User }>('/user/update', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Quests
  async getQuests(): Promise<{ quests: Quest[] }> {
    return this.request<{ quests: Quest[] }>('/quests');
  }

  async acceptQuest(questId: string): Promise<{ quest: Quest }> {
    return this.request<{ quest: Quest }>('/quests/accept', {
      method: 'POST',
      body: JSON.stringify({ questId })
    });
  }

  async completeQuest(questId: string, proofMethod: string, notes?: string): Promise<{ quest: Quest; user: User; xpEarned: number; coinsEarned: number; streakUpdated: boolean; levelUp: boolean }> {
    return this.request('/quests/complete', {
      method: 'POST',
      body: JSON.stringify({ questId, proofMethod, notes })
    });
  }

  async completeQuestDirect(questId: string): Promise<{ quest: Quest; user: User; xpEarned: number; coinsEarned: number; streakUpdated: boolean; levelUp: boolean }> {
    return this.completeQuest(questId, 'direct');
  }

  async getInitialState(): Promise<{
    user: User;
    quests: Quest[];
    bounties: Bounty[];
    guilds: Guild[];
    departmentRanks: DepartmentRank[];
    shopItems: ShopItem[];
    qrPortals: QRPortal[];
    liveActivities: LiveActivity[];
    impactMetrics: ImpactMetrics;
  }> {
    const [
      profileRes,
      questsRes,
      bountiesRes,
      guildsRes,
      leaderboardsRes,
      shopRes,
      portalsRes,
      liveRes,
      impactRes
    ] = await Promise.all([
      this.getUserProfile(),
      this.getQuests(),
      this.getBounties(),
      this.getGuilds(),
      this.getLeaderboards(),
      this.getShopItems(),
      this.getQRPortals(),
      this.getLiveActivity(),
      this.getImpactMetrics()
    ]);

    return {
      user: profileRes.user,
      quests: questsRes.quests,
      bounties: bountiesRes.bounties,
      guilds: guildsRes.guilds,
      departmentRanks: leaderboardsRes.departments,
      shopItems: shopRes.items,
      qrPortals: portalsRes.portals,
      liveActivities: liveRes.activities,
      impactMetrics: impactRes.impact
    };
  }

  // AI Verification (Gemini Server-Side)
  async verifyAIVision(imageData: string, questId: string): Promise<{
    verified: boolean;
    confidence: number;
    analysis: string;
    itemDetected: string;
    xpEarned: number;
    coinsEarned: number;
    quest: Quest;
    user: User;
  }> {
    return this.request('/quests/verify-ai', {
      method: 'POST',
      body: JSON.stringify({ imageData, questId })
    });
  }

  // AI Coach
  async askAICoach(prompt: string, history: Array<{ sender: 'user' | 'ai'; text: string }>): Promise<{
    reply: string;
    suggestedQuests?: string[];
  }> {
    return this.request('/ai/coach', {
      method: 'POST',
      body: JSON.stringify({ prompt, history })
    });
  }

  async generateWeeklyReport(): Promise<{ report: string }> {
    return this.request('/ai/weekly-report', { method: 'POST' });
  }

  // Bounties
  async getBounties(): Promise<{ bounties: Bounty[] }> {
    return this.request('/bounties');
  }

  async acceptBounty(bountyId: string): Promise<{ bounty: Bounty }> {
    return this.request('/bounties/accept', {
      method: 'POST',
      body: JSON.stringify({ bountyId })
    });
  }

  async completeBounty(bountyId: string): Promise<{ bounty: Bounty; user: User; xpEarned: number; coinsEarned: number }> {
    return this.request('/bounties/complete', {
      method: 'POST',
      body: JSON.stringify({ bountyId })
    });
  }

  // QR Portals & Hunt
  async getQRPortals(): Promise<{ portals: QRPortal[] }> {
    return this.request('/qr-portals');
  }

  async scanQRPortal(code: string): Promise<{
    portal: QRPortal;
    user: User;
    xpEarned: number;
    coinsEarned: number;
    alreadyScanned: boolean;
  }> {
    return this.request('/qr-portals/scan', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  }

  // Leaderboards & Guild Wars
  async getLeaderboards(): Promise<{
    students: LeaderboardEntry[];
    departments: DepartmentRank[];
  }> {
    return this.request('/leaderboards');
  }

  // Guilds
  async getGuilds(): Promise<{ guilds: Guild[] }> {
    return this.request('/guilds');
  }

  async createGuild(name: string, tag: string, description: string): Promise<{ guild: Guild }> {
    return this.request('/guilds/create', {
      method: 'POST',
      body: JSON.stringify({ name, tag, description })
    });
  }

  async joinGuild(guildId: string): Promise<{ guild: Guild }> {
    return this.request('/guilds/join', {
      method: 'POST',
      body: JSON.stringify({ guildId })
    });
  }

  // Shop & Eco Crates
  async getShopItems(): Promise<{ items: ShopItem[] }> {
    return this.request('/shop');
  }

  async buyShopItem(itemId: string): Promise<{ item: ShopItem; user: User }> {
    return this.request('/shop/buy', {
      method: 'POST',
      body: JSON.stringify({ itemId })
    });
  }

  async openEcoCrate(): Promise<{
    reward: {
      type: 'XP' | 'COINS' | 'PET_SKIN' | 'TITLE' | 'BADGE';
      amount?: number;
      name: string;
      rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
      icon: string;
    };
    user: User;
  }> {
    return this.request('/shop/open-crate', { method: 'POST' });
  }

  // Live Activity & Impact
  async getLiveActivity(): Promise<{ activities: LiveActivity[] }> {
    return this.request('/live-activity');
  }

  async getImpactMetrics(): Promise<{ impact: ImpactMetrics }> {
    return this.request('/impact');
  }

  // Admin Operations
  async adminCreateQuest(questData: Partial<Quest>): Promise<{ quest: Quest }> {
    return this.request('/admin/create-quest', {
      method: 'POST',
      body: JSON.stringify(questData)
    });
  }

  async adminCreateBounty(bountyData: Partial<Bounty>): Promise<{ bounty: Bounty }> {
    return this.request('/admin/create-bounty', {
      method: 'POST',
      body: JSON.stringify(bountyData)
    });
  }

  // Seed Demo State
  async seedDemoData(): Promise<{ message: string; user: User }> {
    return this.request('/demo/seed', { method: 'POST' });
  }
}

export const apiService = new ApiService();
