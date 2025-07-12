import { getCache, setCache, CACHE_EXPIRY, getOfflineQueue } from '../api/cacheUtil';
import { addToOfflineQueue } from '../api/cacheUtil';

export interface OfflineUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
  lastLogin: number;
  isOfflineUser: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  gender: string;
  role: string;
  terms: boolean;
}

class OfflineAuthService {

  constructor() {
    this.setupNetworkListeners();
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      // Removed: this.isOnline = true;
    });

    window.addEventListener('offline', () => {
      // Removed: this.isOnline = false;
    });
  }

  // Check if user can login offline (has cached credentials)
  async canLoginOffline(email: string): Promise<boolean> {
    try {
      const cachedCredentials = await getCache<LoginCredentials[]>('offline_credentials');
      if (!cachedCredentials) return false;
      
      return cachedCredentials.some(cred => cred.email === email);
    } catch (error) {
      console.error('Error checking offline login capability:', error);
      return false;
    }
  }

  // Cache user credentials for offline login
  async cacheCredentials(email: string, password: string): Promise<void> {
    try {
      const existingCredentials = await getCache<LoginCredentials[]>('offline_credentials') || [];
      
      // Remove existing credentials for this email
      const filteredCredentials = existingCredentials.filter(cred => cred.email !== email);
      
      // Add new credentials
      const newCredentials = [...filteredCredentials, { email, password }];
      
      // Limit to 3 cached credentials
      const limitedCredentials = newCredentials.slice(-3);
      
      await setCache('offline_credentials', limitedCredentials, CACHE_EXPIRY.CREDENTIALS);
      console.log('Credentials cached for offline login');
    } catch (error) {
      console.error('Error caching credentials:', error);
    }
  }

  // Get cached credentials for an email
  async getCachedCredentials(email: string): Promise<LoginCredentials | null> {
    try {
      const cachedCredentials = await getCache<LoginCredentials[]>('offline_credentials');
      if (!cachedCredentials) return null;
      
      return cachedCredentials.find(cred => cred.email === email) || null;
    } catch (error) {
      console.error('Error getting cached credentials:', error);
      return null;
    }
  }

  // Create offline user session
  async createOfflineSession(email: string, password: string): Promise<OfflineUser> {
    try {
      // Create a mock offline user
      const offlineUser: OfflineUser = {
        _id: `offline_${Date.now()}`,
        name: email.split('@')[0], // Use email prefix as name
        email,
        role: 'user', // Default role for offline users
        token: `offline_token_${Date.now()}`,
        lastLogin: Date.now(),
        isOfflineUser: true
      };

      // Cache the offline user
      await setCache('offline_user', offlineUser, CACHE_EXPIRY.USER_DATA);
      
      // Queue the login action for when online
      await addToOfflineQueue({
        type: 'POST',
        endpoint: '/users/login',
        data: { email, password }
      });

      console.log('Offline session created for:', email);
      return offlineUser;
    } catch (error) {
      console.error('Error creating offline session:', error);
      throw new Error('Failed to create offline session');
    }
  }

  // Attempt offline login
  async loginOffline(email: string, password: string): Promise<OfflineUser> {
    try {
      // Check if we have cached credentials
      const cachedCredentials = await this.getCachedCredentials(email);
      
      if (!cachedCredentials) {
        throw new Error('No cached credentials found for offline login');
      }

      // Verify password matches (basic check)
      if (cachedCredentials.password !== password) {
        throw new Error('Invalid credentials for offline login');
      }

      // Create offline session
      const offlineUser = await this.createOfflineSession(email, password);
      
      return offlineUser;
    } catch (error) {
      console.error('Offline login failed:', error);
      throw error;
    }
  }

  // Sync offline login when back online
  async syncOfflineLogin(api: any): Promise<void> {
    try {
      const offlineUser = await getCache<OfflineUser>('offline_user');
      if (!offlineUser || !offlineUser.isOfflineUser) return;

      console.log('Syncing offline login for:', offlineUser.email);

      // Get cached credentials
      const credentials = await this.getCachedCredentials(offlineUser.email);
      if (!credentials) return;

      // Attempt real login
      const response = await api.post('/users/login', credentials);
      
      if (response.data.token) {
        // Replace offline user with real user data
        const realUser = {
          ...response.data,
          isOfflineUser: false
        };
        
        await setCache('offline_user', realUser, CACHE_EXPIRY.USER_DATA);
        console.log('Offline login synced successfully');
      }
    } catch (error) {
      console.error('Error syncing offline login:', error);
    }
  }

  // Sync all offline authentication actions
  async syncOfflineAuth(api: any): Promise<void> {
    try {
      // First sync any pending signups
      await this.syncOfflineSignup(api);
      
      // Then sync offline login if applicable
      await this.syncOfflineLogin(api);
    } catch (error) {
      console.error('Error syncing offline auth:', error);
    }
  }

  // Check if current user is an offline user
  async isOfflineUser(): Promise<boolean> {
    try {
      const user = await getCache<OfflineUser>('offline_user');
      return user?.isOfflineUser || false;
    } catch (error) {
      return false;
    }
  }

  // Get offline user data
  async getOfflineUser(): Promise<OfflineUser | null> {
    try {
      return await getCache<OfflineUser>('offline_user');
    } catch (error) {
      console.error('Error getting offline user:', error);
      return null;
    }
  }

  // Clear offline user data
  async clearOfflineUser(): Promise<void> {
    try {
      await setCache('offline_user', null, 0);
      console.log('Offline user data cleared');
    } catch (error) {
      console.error('Error clearing offline user:', error);
    }
  }

  // Check if offline login is available
  async isOfflineLoginAvailable(): Promise<boolean> {
    try {
      const credentials = await getCache<LoginCredentials[]>('offline_credentials');
      return Boolean(credentials && credentials.length > 0);
    } catch (error) {
      return false;
    }
  }

  // Get list of cached emails for offline login
  async getCachedEmails(): Promise<string[]> {
    try {
      const credentials = await getCache<LoginCredentials[]>('offline_credentials');
      return credentials ? credentials.map(cred => cred.email) : [];
    } catch (error) {
      return [];
    }
  }

  // Offline signup functionality
  async signupOffline(signupData: SignupData): Promise<OfflineUser> {
    try {
      // Check if email already exists in cached credentials
      const existingCredentials = await this.getCachedCredentials(signupData.email);
      if (existingCredentials) {
        throw new Error('An account with this email already exists');
      }

      // Create offline user session
      const offlineUser: OfflineUser = {
        _id: `offline_${Date.now()}`,
        name: signupData.name,
        email: signupData.email,
        role: signupData.role,
        token: `offline_token_${Date.now()}`,
        lastLogin: Date.now(),
        isOfflineUser: true
      };

      // Cache the offline user
      await setCache('offline_user', offlineUser, CACHE_EXPIRY.USER_DATA);
      
      // Cache credentials for future offline login
      await this.cacheCredentials(signupData.email, signupData.password);
      
      // Queue the signup action for when online
      await addToOfflineQueue({
        type: 'POST',
        endpoint: '/users/register',
        data: signupData
      });

      console.log('Offline signup completed for:', signupData.email);
      return offlineUser;
    } catch (error) {
      console.error('Error in offline signup:', error);
      throw error;
    }
  }

  // Check if email is available for signup (not in cached credentials)
  async isEmailAvailableForSignup(email: string): Promise<boolean> {
    try {
      const cachedCredentials = await getCache<LoginCredentials[]>('offline_credentials');
      if (!cachedCredentials) return true;
      
      return !cachedCredentials.some(cred => cred.email === email);
    } catch (error) {
      console.error('Error checking email availability:', error);
      return true; // Assume available if error
    }
  }

  // Get pending signup data
  async getPendingSignups(): Promise<SignupData[]> {
    try {
      const queue = await getOfflineQueue();
      return queue
        .filter((action: any) => action.endpoint === '/users/register')
        .map((action: any) => action.data as SignupData);
    } catch (error) {
      console.error('Error getting pending signups:', error);
      return [];
    }
  }

  // Sync offline signup when back online
  async syncOfflineSignup(api: any): Promise<void> {
    try {
      const pendingSignups = await this.getPendingSignups();
      if (pendingSignups.length === 0) return;

      console.log(`Syncing ${pendingSignups.length} offline signups...`);

      for (const signupData of pendingSignups) {
        try {
          await api.post('/users/register', signupData);
          console.log('Offline signup synced successfully for:', signupData.email);
          
          // Remove from queue after successful sync
          const queue = await getOfflineQueue();
          const updatedQueue = queue.filter((action: any) => 
            !(action.endpoint === '/users/register' && action.data.email === signupData.email)
          );
          await setCache('offline_queue', updatedQueue, CACHE_EXPIRY.DEFAULT);
        } catch (error) {
          console.error('Failed to sync signup for:', signupData.email, error);
        }
      }
    } catch (error) {
      console.error('Error syncing offline signups:', error);
    }
  }
}

// Export singleton instance
export const offlineAuthService = new OfflineAuthService();
export default offlineAuthService; 