import { useState } from 'react';
import api from '../api/axios';

const TestConnection = () => {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const testConnection = async () => {
    setStatus('testing');
    setMessage('Testing connection...');
    
    try {
      const response = await api.get('/');
      setStatus('success');
      setMessage(`Connection successful! Server responded: ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      setStatus('error');
      setMessage(`Connection failed: ${error.message}`);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Test Backend Connection</h3>
      <button
        onClick={testConnection}
        disabled={status === 'testing'}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {status === 'testing' ? 'Testing...' : 'Test Connection'}
      </button>
      {message && (
        <div className={`mt-2 p-2 rounded ${
          status === 'success' ? 'bg-green-100 text-green-800' :
          status === 'error' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default TestConnection; 