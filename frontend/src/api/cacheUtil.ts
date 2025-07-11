import localforage from 'localforage';

// Configure localforage for better performance
localforage.config({
  name: 'EmpowerHerEd',
  storeName: 'offline_cache',
  description: 'Offline cache for EmpowerHerEd application'
});

// Cache expiration times (in milliseconds)
export const CACHE_EXPIRY = {
  COURSES: 24 * 60 * 60 * 1000, // 24 hours
  RESOURCES: 12 * 60 * 60 * 1000, // 12 hours
  BOOKINGS: 60 * 60 * 1000, // 1 hour
  IMAGES: 7 * 24 * 60 * 60 * 1000, // 7 days
  USER_DATA: 30 * 24 * 60 * 60 * 1000, // 30 days
  CREDENTIALS: 7 * 24 * 60 * 60 * 1000, // 7 days (for offline login)
  DEFAULT: 60 * 60 * 1000 // 1 hour
};

// Offline action queue for syncing when back online
interface OfflineAction {
  id: string;
  type: 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

export async function setCache(key: string, data: any, expiry?: number) {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
      expiry: expiry || CACHE_EXPIRY.DEFAULT
    };
    await localforage.setItem(key, cacheData);
    console.log(`Cache set for key: ${key}`);
  } catch (err) {
    console.error('Error setting cache:', err);
  }
}

export async function getCache<T = any>(key: string): Promise<T | null> {
  try {
    const cacheData = await localforage.getItem<{
      data: T;
      timestamp: number;
      expiry: number;
    }>(key);
    
    if (!cacheData) return null;
    
    // Check if cache has expired
    const isExpired = Date.now() - cacheData.timestamp > cacheData.expiry;
    if (isExpired) {
      await localforage.removeItem(key);
      return null;
    }
    
    return cacheData.data;
  } catch (err) {
    console.error('Error getting cache:', err);
    return null;
  }
}

export async function removeCache(key: string) {
  try {
    await localforage.removeItem(key);
    console.log(`Cache removed for key: ${key}`);
  } catch (err) {
    console.error('Error removing cache:', err);
  }
}

export async function clearAllCache() {
  try {
    await localforage.clear();
    console.log('All cache cleared');
  } catch (err) {
    console.error('Error clearing cache:', err);
  }
}

// Offline queue management
export async function addToOfflineQueue(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>) {
  try {
    const queue = await getOfflineQueue();
    const newAction: OfflineAction = {
      ...action,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      retryCount: 0
    };
    queue.push(newAction);
    await localforage.setItem('offline_queue', queue);
    console.log('Action added to offline queue:', newAction);
  } catch (err) {
    console.error('Error adding to offline queue:', err);
  }
}

export async function getOfflineQueue(): Promise<OfflineAction[]> {
  try {
    const queue = await localforage.getItem<OfflineAction[]>('offline_queue');
    return queue || [];
  } catch (err) {
    console.error('Error getting offline queue:', err);
    return [];
  }
}

export async function removeFromOfflineQueue(actionId: string) {
  try {
    const queue = await getOfflineQueue();
    const filteredQueue = queue.filter(action => action.id !== actionId);
    await localforage.setItem('offline_queue', filteredQueue);
  } catch (err) {
    console.error('Error removing from offline queue:', err);
  }
}

export async function clearOfflineQueue() {
  try {
    await localforage.removeItem('offline_queue');
    console.log('Offline queue cleared');
  } catch (err) {
    console.error('Error clearing offline queue:', err);
  }
}

// Image caching utilities
export async function cacheImage(url: string, blob: Blob) {
  try {
    const imageKey = `image_${btoa(url)}`;
    await setCache(imageKey, {
      url,
      blob: await blobToBase64(blob),
      timestamp: Date.now()
    }, CACHE_EXPIRY.IMAGES);
    console.log(`Image cached: ${url}`);
  } catch (err) {
    console.error('Error caching image:', err);
  }
}

export async function getCachedImage(url: string): Promise<string | null> {
  try {
    const imageKey = `image_${btoa(url)}`;
    const cached = await getCache<{
      url: string;
      blob: string;
      timestamp: number;
    }>(imageKey);
    
    return cached ? cached.blob : null;
  } catch (err) {
    console.error('Error getting cached image:', err);
    return null;
  }
}

// Utility function to convert blob to base64
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Cache management utilities
export async function getCacheSize(): Promise<number> {
  try {
    const keys = await localforage.keys();
    return keys.length;
  } catch (err) {
    console.error('Error getting cache size:', err);
    return 0;
  }
}

export async function getCacheKeys(): Promise<string[]> {
  try {
    return await localforage.keys();
  } catch (err) {
    console.error('Error getting cache keys:', err);
    return [];
  }
}

// Preload essential data for offline use
export async function preloadOfflineData() {
  try {
    console.log('Preloading offline data...');
    
    // Preload courses
    if (!(await getCache('courses'))) {
      console.log('Courses not cached, will load when online');
    }
    
    // Preload resources
    if (!(await getCache('resources'))) {
      console.log('Resources not cached, will load when online');
    }
    
    // Preload user data
    const user = localStorage.getItem('user');
    if (user) {
      await setCache('user_data', JSON.parse(user), CACHE_EXPIRY.USER_DATA);
    }
    
    console.log('Offline data preload completed');
  } catch (err) {
    console.error('Error preloading offline data:', err);
  }
}

// Sync offline actions when back online
export async function syncOfflineActions(api: any) {
  try {
    const queue = await getOfflineQueue();
    if (queue.length === 0) return;
    
    console.log(`Syncing ${queue.length} offline actions...`);
    
    for (const action of queue) {
      try {
        switch (action.type) {
          case 'POST':
            await api.post(action.endpoint, action.data);
            break;
          case 'PUT':
            await api.put(action.endpoint, action.data);
            break;
          case 'DELETE':
            await api.delete(action.endpoint);
            break;
        }
        
        await removeFromOfflineQueue(action.id);
        console.log(`Synced action: ${action.type} ${action.endpoint}`);
      } catch (err) {
        console.error(`Failed to sync action ${action.id}:`, err);
        action.retryCount++;
        
        // Remove action if it has been retried too many times
        if (action.retryCount >= 3) {
          await removeFromOfflineQueue(action.id);
          console.log(`Removed failed action after 3 retries: ${action.id}`);
        }
      }
    }
    
    console.log('Offline sync completed');
  } catch (err) {
    console.error('Error syncing offline actions:', err);
  }
} 