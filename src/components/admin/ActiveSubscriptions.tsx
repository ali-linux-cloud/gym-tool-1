import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import type { User } from '../../types/auth';

export default function ActiveSubscriptions() {
  const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
  const activeUsers = users.filter(user => 
    user.isVerified && 
    user.subscriptionStatus === 'active' &&
    user.email !== 'admin@saasfactory.com'
  ).map(user => ({
    ...user,
    planType: user.planType || 'monthly' // Ensure planType has a default value
  }));

  const calculateDaysLeft = (endDate: string | undefined) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (activeUsers.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400">No active subscriptions</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid gap-6">
        {activeUsers.map((user) => {
          const daysLeft = calculateDaysLeft(user.subscriptionEndDate);
          
          return (
            <div
              key={user.id}
              className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                  <p className="text-gray-400">{user.email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  daysLeft > 7
                    ? 'bg-green-900/50 text-green-200 border border-green-700'
                    : 'bg-yellow-900/50 text-yellow-200 border border-yellow-700'
                }`}>
                  {daysLeft} days left
                </span>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                {user.subscriptionStartDate && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span>Started: {new Date(user.subscriptionStartDate).toLocaleDateString()}</span>
                  </div>
                )}
                {user.subscriptionEndDate && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span>Ends: {new Date(user.subscriptionEndDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-400">Plan:</span>
                <span className="text-sm font-medium text-blue-400">
                  {user.planType.charAt(0).toUpperCase() + user.planType.slice(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}