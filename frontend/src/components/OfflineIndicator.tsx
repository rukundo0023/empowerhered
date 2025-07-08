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
      top: 0,
      left: 0,
      width: '100%',
      background: '#f87171',
      color: '#fff',
      textAlign: 'center',
      padding: '8px 0',
      zIndex: 1000,
      fontWeight: 'bold',
    }}>
      You are offline. Some features may be unavailable.
    </div>
  );
};

export default OfflineIndicator; 