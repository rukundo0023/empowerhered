import React, { useState, useEffect } from 'react';
import offlineAuthService from '../services/offlineAuthService';

const OfflineLoginInfo: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [hasCachedCredentials, setHasCachedCredentials] = useState(false);
  const [cachedEmails, setCachedEmails] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    const checkCachedCredentials = async () => {
      const available = await offlineAuthService.isOfflineLoginAvailable();
      const emails = await offlineAuthService.getCachedEmails();
      setHasCachedCredentials(available);
      setCachedEmails(emails);
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    
    checkCachedCredentials();

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  if (!isOffline && !hasCachedCredentials) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Offline Login Available
            </h3>
            <div className="mt-1 text-sm text-blue-700">
              {isOffline ? (
                <p>You can log in using cached credentials while offline.</p>
              ) : (
                <p>Enable "Remember Me" to cache credentials for offline login.</p>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {showDetails && (
        <div className="mt-4 text-sm text-blue-700">
          <h4 className="font-medium mb-2">How Offline Login Works:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Check "Remember Me" when logging in to cache your credentials</li>
            <li>When offline, you can log in using cached credentials</li>
            <li>Your session will automatically sync when you reconnect</li>
            <li>Cached credentials are stored securely and expire after 7 days</li>
          </ul>
          
          {hasCachedCredentials && (
            <div className="mt-3 p-2 bg-blue-100 rounded">
              <p className="font-medium">Cached Credentials:</p>
              <p className="text-xs mt-1">
                {cachedEmails.length > 0 
                  ? `Available for: ${cachedEmails.join(', ')}`
                  : 'No cached credentials found'
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OfflineLoginInfo; 