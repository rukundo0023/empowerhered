import localforage from 'localforage';

export async function setCache(key: string, data: any) {
  try {
    await localforage.setItem(key, data);
  } catch (err) {
    console.error('Error setting cache:', err);
  }
}

export async function getCache<T = any>(key: string): Promise<T | null> {
  try {
    const data = await localforage.getItem<T>(key);
    return data || null;
  } catch (err) {
    console.error('Error getting cache:', err);
    return null;
  }
} 