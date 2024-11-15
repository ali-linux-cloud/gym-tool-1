import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, X as XIcon } from 'lucide-react';
import type { SubscriptionRequest } from '../types/auth';

interface SubscriptionVerificationProps {
  onBack: () => void;
}

export default function SubscriptionVerification({ onBack }: SubscriptionVerificationProps) {
  const [requests, setRequests] = useState<SubscriptionRequest[]>(() => {
    return JSON.parse(localStorage.getItem('subscription-requests') || '[]');
  });

  const handleVerify = (userId: string, approved: boolean) => {
    // Update request status
    const updatedRequests = requests.map(req =>
      req.userId === userId ? { ...req, status: approved ? 'approved' : 'rejected' } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem('subscription-requests', JSON.stringify(updatedRequests));

    // Update user verification status
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          isVerified: approved,
          subscriptionStatus: approved ? 'active' : 'expired'
        };
      }
      return user;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Update current user if it's the same user
    const currentUser = JSON.parse(localStorage.getItem('current-user') || '{}');
    if (currentUser.id === userId) {
      localStorage.setItem('current-user', JSON.stringify({
        ...currentUser,
        isVerified: approved,
        subscriptionStatus: approved ? 'active' : 'expired'
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white">Subscription Verification</h1>
        </div>

        <div className="grid gap-6">
          {requests.length === 0 ? (
            <div className="bg-gray-800/50 rounded-lg p-8 text-center border border-gray-700">
              <p className="text-gray-300">No pending subscription requests</p>
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request.userId}
                className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{request.userName}</h3>
                        <p className="text-gray-400">{request.userEmail}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.status === 'pending'
                            ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-700'
                            : request.status === 'approved'
                            ? 'bg-green-900/50 text-green-200 border border-green-700'
                            : 'bg-red-900/50 text-red-200 border border-red-700'
                        }`}
                      >
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
                      Submitted: {new Date(request.submissionDate).toLocaleDateString()}
                    </p>
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerify(request.userId, true)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Check size={16} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerify(request.userId, false)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XIcon size={16} />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="w-full md:w-64 h-48 rounded-lg overflow-hidden">
                    <img
                      src={request.receiptImage}
                      alt="Payment receipt"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}