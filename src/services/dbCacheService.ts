/**
 * IndexedDB Offline-First Caching Service for EcoQuest
 * Persists critical game state data (active quests, user profile, bounties, offline actions)
 * ensuring seamless user experience even if network connection is interrupted.
 */

const DB_NAME = 'EcoQuestDB';
const DB_VERSION = 1;
const STORE_STATE = 'game_state';
const STORE_OFFLINE_QUEUE = 'offline_queue';

class DBCacheService {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !('indexedDB' in window)) {
        reject(new Error('IndexedDB is not supported in this browser environment.'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_STATE)) {
          db.createObjectStore(STORE_STATE);
        }
        if (!db.objectStoreNames.contains(STORE_OFFLINE_QUEUE)) {
          db.createObjectStore(STORE_OFFLINE_QUEUE, { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.warn('Failed to open EcoQuest IndexedDB:', request.error);
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  /**
   * Save a key-value record to game_state store
   */
  async setItem<T>(key: string, data: T): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_STATE, 'readwrite');
        const store = transaction.objectStore(STORE_STATE);
        const payload = {
          data,
          savedAt: new Date().toISOString()
        };
        const request = store.put(payload, key);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn(`[IndexedDB] Cache save error for ${key}:`, err);
    }
  }

  /**
   * Retrieve a key-value record from game_state store
   */
  async getItem<T>(key: string): Promise<{ data: T; savedAt: string } | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_STATE, 'readonly');
        const store = transaction.objectStore(STORE_STATE);
        const request = store.get(key);
        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn(`[IndexedDB] Cache read error for ${key}:`, err);
      return null;
    }
  }

  /**
   * Quick helper to cache active quests status
   */
  async cacheQuests(quests: any[]): Promise<void> {
    await this.setItem('active_quests', quests);
  }

  /**
   * Retrieve cached active quests
   */
  async getCachedQuests(): Promise<any[] | null> {
    const record = await this.getItem<any[]>('active_quests');
    return record ? record.data : null;
  }

  /**
   * Quick helper to cache user profile & stats
   */
  async cacheUser(user: any): Promise<void> {
    await this.setItem('user_profile', user);
  }

  /**
   * Retrieve cached user profile
   */
  async getCachedUser(): Promise<any | null> {
    const record = await this.getItem<any>('user_profile');
    return record ? record.data : null;
  }

  /**
   * Queue an offline action (e.g., complete quest, accept bounty) for auto-sync when back online
   */
  async queueOfflineAction(action: { type: string; payload: any }): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_OFFLINE_QUEUE, 'readwrite');
        const store = transaction.objectStore(STORE_OFFLINE_QUEUE);
        const request = store.add({
          ...action,
          timestamp: Date.now()
        });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn('[IndexedDB] Offline queue error:', err);
    }
  }

  /**
   * Get all pending offline actions
   */
  async getPendingActions(): Promise<any[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_OFFLINE_QUEUE, 'readonly');
        const store = transaction.objectStore(STORE_OFFLINE_QUEUE);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      return [];
    }
  }

  /**
   * Clear all pending offline actions after successful sync
   */
  async clearPendingActions(): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_OFFLINE_QUEUE, 'readwrite');
        const store = transaction.objectStore(STORE_OFFLINE_QUEUE);
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.warn('[IndexedDB] Clear pending error:', err);
    }
  }
}

export const dbCacheService = new DBCacheService();
