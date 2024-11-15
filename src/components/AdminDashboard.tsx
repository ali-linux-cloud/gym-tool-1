import React, { useState } from 'react';
import { Dumbbell, Users, ClipboardCheck } from 'lucide-react';
import SubscriptionRequests from './admin/SubscriptionRequests';
import RenewalRequests from './admin/RenewalRequests';
import ActiveSubscriptions from './admin/ActiveSubscriptions';

interface AdminDashboardProps {
  onLogout: () => void;
}

type TabType = 'renewals' | 'requests' | 'subscriptions';

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('requests');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <Dumbbell className="h-8 w-8 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-400">Manage subscriptions and renewals</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 rounded-xl bg-gray-800/50 p-1 mb-8">
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg ${
                activeTab === 'requests'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <ClipboardCheck className="h-5 w-5" />
              New Requests
            </button>
            <button
              onClick={() => setActiveTab('renewals')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg ${
                activeTab === 'renewals'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <ClipboardCheck className="h-5 w-5" />
              Renewal Requests
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg ${
                activeTab === 'subscriptions'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className="h-5 w-5" />
              Active Subscriptions
            </button>
          </div>

          {/* Content */}
          <div className="bg-gray-800/30 rounded-xl border border-gray-700">
            {activeTab === 'requests' && <SubscriptionRequests />}
            {activeTab === 'renewals' && <RenewalRequests />}
            {activeTab === 'subscriptions' && <ActiveSubscriptions />}
          </div>
        </div>
      </div>
    </div>
  );
}