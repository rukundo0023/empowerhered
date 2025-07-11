import React, { useState, useEffect } from 'react';
import offlineAuthService from '../services/offlineAuthService';

const OfflineSignupInfo: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pendingSignups, setPendingSignups] = useState<number>(0);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    const checkPendingSignups = async () => {
      const signups = await offlineAuthService.getPendingSignups();
      setPendingSignups(signups.length);
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    
    checkPendingSignups();

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  if (!isOffline && pendingSignups === 0) {
    return null;
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Offline Signup Available
            </h3>
            <div className="mt-1 text-sm text-green-700">
              {isOffline ? (
                <p>You can create an account offline. It will sync when you reconnect.</p>
              ) : pendingSignups > 0 ? (
                <p>{pendingSignups} pending signup(s) will sync automatically.</p>
              ) : (
                <p>Sign up normally - your account will be created immediately.</p>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-green-600 hover:text-green-800 text-sm font-medium"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {showDetails && (
        <div className="mt-4 text-sm text-green-700">
          <h4 className="font-medium mb-2">How Offline Signup Works:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Create your account while offline</li>
            <li>Your account data is stored locally</li>
            <li>You can start using the app immediately</li>
            <li>Account will sync to server when you reconnect</li>
            <li>Email availability is checked against cached accounts</li>
          </ul>
          
          {pendingSignups > 0 && (
            <div className="mt-3 p-2 bg-green-100 rounded">
              <p className="font-medium">Pending Sync:</p>
              <p className="text-xs mt-1">
                {pendingSignups} account(s) waiting to sync when online
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OfflineSignupInfo; 