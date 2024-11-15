import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import type { RenewalRequest } from '../../types/auth';

export default function RenewalRequests() {
  const [requests, setRequests] = useState<RenewalRequest[]>(() => {
    return JSON.parse(localStorage.getItem('renewal-requests') || '[]');
  });

  const handleVerify = (requestId: string, approved: boolean) => {
    // Get request details
    const request = requests.find(req => req.id === requestId);
    if (!request) return;

    // Calculate new subscription end date based on plan
    const startDate = new Date();
    let durationInDays = 30; // default monthly
    
    switch (request.planType) {
      case 'yearly':
        durationInDays = 365;
        break;
      case 'lifetime':
        durationInDays = 36500; // 100 years
        break;
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationInDays);

    // Update request status
    const updatedRequests = requests.map(req =>
      req.id === requestId ? { ...req, status: approved ? 'approved' : 'rejected' } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem('renewal-requests', JSON.stringify(updatedRequests));

    if (approved) {
      // Update user subscription status
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map(user => {
        if (user.id === request.userId) {
          return {
            ...user,
            subscriptionStatus: 'active',
            subscriptionStartDate: startDate.toISOString(),
            subscriptionEndDate: endDate.toISOString(),
            planType: request.planType
          };
        }
        return user;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  if (requests.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400">No pending renewal requests</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {requests.filter(req => req.status === 'pending').map((request) => (
        <div
          key={request.id}
          className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{request.userName}</h3>
                  <p className="text-gray-400">{request.userEmail}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-blue-400 font-medium">
                    {request.planType.charAt(0).toUpperCase() + request.planType.slice(1)} Plan
                  </span>
                  <span className="text-sm text-gray-400">
                    {new Date(request.submissionDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleVerify(request.id, true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Check className="h-4 w-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleVerify(request.id, false)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Reject
                </button>
              </div>
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
      ))}
    </div>
  );
}