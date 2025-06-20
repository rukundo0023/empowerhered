import { useState, useEffect } from 'react';
import api from '../api/axios';

interface ConnectionStatus {
  status: string;
  error: string | null;
}

const TestConnection: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'Testing connection...',
    error: null
  });

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test the base API endpoint
        const response = await api.get('/');
        setConnectionStatus({
          status: 'Backend Connected Successfully!',
          error: null
        });
        console.log('Backend Response:', response.data);
      } catch (err: any) {
        setConnectionStatus({
          status: 'Connection Failed',
          error: err.message || 'Unknown error occurred'
        });
        console.error('Connection Error:', err);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Backend Connection Test</h2>
      <div className={`p-4 rounded-lg ${
        connectionStatus.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
      }`}>
        <p className="font-semibold">Status: {connectionStatus.status}</p>
        {connectionStatus.error && (
          <div className="mt-2">
            <p className="font-semibold">Error Details:</p>
            <p className="text-sm">{connectionStatus.error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestConnection; 