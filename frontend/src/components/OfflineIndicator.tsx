import React, { useEffect, useState } from 'react';

const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '64px', // Position below navbar (navbar height is 64px)
      left: 0,
      width: '100%',
      background: '#f87171',
      color: '#fff',
      textAlign: 'center',
      padding: '4px 0', // Reduced padding from 8px to 4px
      zIndex: 999, // Lower than navbar z-index (1000)
      fontWeight: 'bold',
      fontSize: '14px', // Smaller font size
    }}>
      You are offline. Some features may be unavailable.
    </div>
  );
};

export default OfflineIndicator; 