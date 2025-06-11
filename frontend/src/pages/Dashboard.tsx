import React from 'react';
import { useAuth } from '../context/AuthContext';
import UserProfile from '../components/UserProfile';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <UserProfile />
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {user?.name}!</h2>
            <p className="text-gray-600">
              This is your personalized dashboard. Here you can manage your profile and access various features based on your role.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 