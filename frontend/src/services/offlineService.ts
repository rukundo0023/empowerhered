import api from '../api/axios';
import { 
  setCache, 
  getCache, 
  addToOfflineQueue, 
  getOfflineQueue, 
  syncOfflineActions,
  cacheImage,
  getCachedImage,
  preloadOfflineData,
  CACHE_EXPIRY
} from '../api/cacheUtil';

// Types for offline functionality
interface Course {
  _id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  category: string;
  imageUrl?: string;
  enrolledStudents: string[];
  modules: any[];
}

interface Booking {
  _id?: string;
  mentor?: string;
  mentee: string;
  menteeName: string;
  menteeEmail: string;
  date: Date;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  topic: string;
  notes?: string;
  meetingLink?: string;
}

interface Resource {
  _id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  url?: string;
  fileUrl?: string;
}

class OfflineService {
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;

  constructor() {
    this.setupNetworkListeners();
    this.preloadData();
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleOnline();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleOffline();
    });
  }

  private async preloadData() {
    if (this.isOnline) {
      await preloadOfflineData();
    }
  }

  private async handleOnline() {
    console.log('Back online - syncing offline actions...');
    if (!this.syncInProgress) {
      this.syncInProgress = true;
      await syncOfflineActions(api);
      this.syncInProgress = false;
    }
  }

  private handleOffline() {
    console.log('Gone offline - switching to offline mode');
  }

  // Course management
  async getCourses(): Promise<Course[]> {
    if (this.isOnline) {
      try {
        const response = await api.get('/courses');
        await setCache('courses', response.data, CACHE_EXPIRY.COURSES);
        return response.data;
      } catch (error) {
        console.error('Error fetching courses online:', error);
        // Fallback to cache
        const cached = await getCache<Course[]>('courses');
        return cached || [];
      }
    } else {
      const cached = await getCache<Course[]>('courses');
      return cached || [];
    }
  }

  async enrollInCourse(courseId: string): Promise<boolean> {
    if (this.isOnline) {
      try {
        await api.post(`/courses/${courseId}/enroll`);
        // Refresh courses cache
        const response = await api.get('/courses');
        await setCache('courses', response.data, CACHE_EXPIRY.COURSES);
        return true;
      } catch (error) {
        console.error('Error enrolling in course:', error);
        return false;
      }
    } else {
      // Queue for later sync
      await addToOfflineQueue({
        type: 'POST',
        endpoint: `/courses/${courseId}/enroll`,
        data: {}
      });
      return true; // Assume success for offline
    }
  }

  // Resource management
  async getResources(): Promise<Resource[]> {
    if (this.isOnline) {
      try {
        const response = await api.get('/resources');
        await setCache('resources', response.data, CACHE_EXPIRY.RESOURCES);
        return response.data;
      } catch (error) {
        console.error('Error fetching resources online:', error);
        const cached = await getCache<Resource[]>('resources');
        return cached || [];
      }
    } else {
      const cached = await getCache<Resource[]>('resources');
      return cached || [];
    }
  }

  // Booking system
  async createBooking(bookingData: Omit<Booking, '_id'>): Promise<Booking> {
    if (this.isOnline) {
      try {
        const response = await api.post('/mentors/bookings', bookingData);
        // Update local bookings cache
        const cached = await getCache<Booking[]>('bookings') || [];
        cached.push(response.data);
        await setCache('bookings', cached, CACHE_EXPIRY.BOOKINGS);
        return response.data;
      } catch (error) {
        console.error('Error creating booking online:', error);
        throw error;
      }
    } else {
      // Create offline booking
      const offlineBooking: Booking = {
        ...bookingData,
        _id: `offline_${Date.now()}`,
        status: 'pending'
      };

      // Add to local cache
      const cached = await getCache<Booking[]>('bookings') || [];
      cached.push(offlineBooking);
      await setCache('bookings', cached, CACHE_EXPIRY.BOOKINGS);

      // Queue for sync when online
      await addToOfflineQueue({
        type: 'POST',
        endpoint: '/mentors/bookings',
        data: bookingData
      });

      return offlineBooking;
    }
  }

  async getBookings(): Promise<Booking[]> {
    if (this.isOnline) {
      try {
        const response = await api.get('/mentors/bookings');
        await setCache('bookings', response.data, CACHE_EXPIRY.BOOKINGS);
        return response.data;
      } catch (error) {
        console.error('Error fetching bookings online:', error);
        const cached = await getCache<Booking[]>('bookings');
        return cached || [];
      }
    } else {
      const cached = await getCache<Booking[]>('bookings');
      return cached || [];
    }
  }

  async updateBooking(bookingId: string, updates: Partial<Booking>): Promise<boolean> {
    if (this.isOnline) {
      try {
        await api.put(`/mentors/bookings/${bookingId}`, updates);
        // Refresh bookings cache
        const response = await api.get('/mentors/bookings');
        await setCache('bookings', response.data, CACHE_EXPIRY.BOOKINGS);
        return true;
      } catch (error) {
        console.error('Error updating booking online:', error);
        return false;
      }
    } else {
      // Update local cache
      const cached = await getCache<Booking[]>('bookings') || [];
      const index = cached.findIndex(b => b._id === bookingId);
      if (index !== -1) {
        cached[index] = { ...cached[index], ...updates };
        await setCache('bookings', cached, CACHE_EXPIRY.BOOKINGS);
      }

      // Queue for sync
      await addToOfflineQueue({
        type: 'PUT',
        endpoint: `/mentors/bookings/${bookingId}`,
        data: updates
      });

      return true;
    }
  }

  // Image handling
  async loadImage(url: string): Promise<string> {
    // First check cache
    const cached = await getCachedImage(url);
    if (cached) {
      return cached;
    }

    if (this.isOnline) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        await cacheImage(url, blob);
        return await getCachedImage(url) || url;
      } catch (error) {
        console.error('Error loading image:', error);
        return url; // Fallback to original URL
      }
    } else {
      // Return placeholder or default image for offline
      return '/placeholder-image.png';
    }
  }

  // Preload images for offline use
  async preloadImages(urls: string[]): Promise<void> {
    if (!this.isOnline) return;

    console.log('Preloading images for offline use...');
    const promises = urls.map(async (url) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        await cacheImage(url, blob);
      } catch (error) {
        console.error(`Failed to preload image ${url}:`, error);
      }
    });

    await Promise.allSettled(promises);
    console.log('Image preloading completed');
  }

  // Get offline queue status
  async getOfflineQueueStatus(): Promise<{ count: number; actions: any[] }> {
    const queue = await getOfflineQueue();
    return {
      count: queue.length,
      actions: queue
    };
  }

  // Check if data is available offline
  async isDataAvailableOffline(dataType: 'courses' | 'resources' | 'bookings'): Promise<boolean> {
    const cached = await getCache(dataType);
    return cached !== null && Array.isArray(cached) && cached.length > 0;
  }

  // Get offline status
  getOfflineStatus(): { isOnline: boolean; hasOfflineData: boolean } {
    return {
      isOnline: this.isOnline,
      hasOfflineData: true // We'll enhance this later
    };
  }

  // Force sync when online
  async forceSync(): Promise<void> {
    if (this.isOnline && !this.syncInProgress) {
      this.syncInProgress = true;
      await syncOfflineActions(api);
      this.syncInProgress = false;
    }
  }

  // Clear all offline data
  async clearOfflineData(): Promise<void> {
    // This would clear all cached data
    // Implementation depends on your needs
  }

  // Mentor management
  async getMentors(allowedMentors?: string[]): Promise<any[]> {
    if (this.isOnline) {
      try {
        const response = await api.get('/mentors/available');
        let mentors = response.data;
        if (allowedMentors && allowedMentors.length > 0) {
          mentors = mentors.filter((mentor: any) => allowedMentors.includes(mentor.email));
        }
        await setCache('mentors', mentors, CACHE_EXPIRY.USER_DATA);
        return mentors;
      } catch (error) {
        console.error('Error fetching mentors online:', error);
        // Fallback to cache
        const cached = await getCache<any[]>('mentors');
        return cached || [];
      }
    } else {
      const cached = await getCache<any[]>('mentors');
      if (allowedMentors && allowedMentors.length > 0 && cached) {
        return cached.filter((mentor: any) => allowedMentors.includes(mentor.email));
      }
      return cached || [];
    }
  }
}

// Export singleton instance
export const offlineService = new OfflineService();
export default offlineService; 