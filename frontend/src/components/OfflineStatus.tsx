import React, { useState, useEffect } from 'react';
import offlineService from '../services/offlineService';
import { getOfflineQueue } from '../api/cacheUtil';

interface OfflineStatusProps {
  showDetails?: boolean;
  className?: string;
}

const OfflineStatus: React.FC<OfflineStatusProps> = ({ 
  showDetails = false, 
  className = '' 
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);
  const [hasOfflineData, setHasOfflineData] = useState(false);
  const [showOfflineInfo, setShowOfflineInfo] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const checkOfflineData = async () => {
      const queue = await getOfflineQueue();
      setOfflineQueueCount(queue.length);
      
      // Check if we have any cached data
      const coursesAvailable = await offlineService.isDataAvailableOffline('courses');
      const resourcesAvailable = await offlineService.isDataAvailableOffline('resources');
      setHasOfflineData(coursesAvailable || resourcesAvailable);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    checkOfflineData();
    
    // Check periodically
    const interval = setInterval(checkOfflineData, 10000);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      clearInterval(interval);
    };
  }, []);

  const handleSync = async () => {
    if (isOnline && offlineQueueCount > 0) {
      await offlineService.forceSync();
      // Refresh queue count
      const queue = await getOfflineQueue();
      setOfflineQueueCount(queue.length);
    }
  };

  if (isOnline && offlineQueueCount === 0 && !showDetails) {
    return null;
  }

  return (
    <div className={`${className}`}>
      {/* Compact Status Bar */}
      {!showDetails && (
        <div className="fixed bottom-4 right-4 z-50">
          {!isOnline && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 shadow-lg max-w-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-yellow-800 text-sm font-medium">
                  Offline Mode
                </span>
                <button
                  onClick={() => setShowOfflineInfo(!showOfflineInfo)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  ℹ️
                </button>
              </div>
              
              {showOfflineInfo && (
                <div className="mt-2 text-xs text-yellow-700">
                  {hasOfflineData 
                    ? "You can browse cached content and create bookings that will sync when online."
                    : "Limited functionality available. Please connect to the internet."
                  }
                </div>
              )}
            </div>
          )}

          {isOnline && offlineQueueCount > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-lg max-w-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-blue-800 text-sm font-medium">
                    {offlineQueueCount} pending sync
                  </span>
                </div>
                <button
                  onClick={handleSync}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Sync Now
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detailed Status Panel */}
      {showDetails && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Offline Status
          </h3>

          {/* Connection Status */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {isOnline 
                ? 'You have a stable internet connection.'
                : 'You are currently offline. Some features may be limited.'
              }
            </p>
          </div>

          {/* Offline Queue Status */}
          {offlineQueueCount > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    {offlineQueueCount} action{offlineQueueCount !== 1 ? 's' : ''} pending sync
                  </p>
                  <p className="text-xs text-blue-700">
                    These will be processed when you're online
                  </p>
                </div>
                {isOnline && (
                  <button
                    onClick={handleSync}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    Sync Now
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Available Features */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Available Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Browse cached courses</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>View learning resources</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Create booking requests</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Access your profile</span>
              </li>
              {!isOnline && (
                <>
                  <li className="flex items-center space-x-2">
                    <span className="text-red-500">✗</span>
                    <span>Real-time updates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-red-500">✗</span>
                    <span>New course enrollments</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Cache Status */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Cache Status:</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Courses:</span>
                <span className={hasOfflineData ? 'text-green-600' : 'text-red-600'}>
                  {hasOfflineData ? 'Available' : 'Not cached'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Resources:</span>
                <span className={hasOfflineData ? 'text-green-600' : 'text-red-600'}>
                  {hasOfflineData ? 'Available' : 'Not cached'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
            >
              Refresh
            </button>
            {!isOnline && (
              <button
                onClick={() => {
                  // This would open browser's network settings
                  alert('Please check your internet connection and try again.');
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Check Connection
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineStatus; 