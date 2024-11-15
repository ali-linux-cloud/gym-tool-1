import React, { useState } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import type { SubscriptionRequest } from '../../types/auth';

export default function RejectedSubscriptions() {
  const [requests, setRequests] = useState<SubscriptionRequest[]>(() => {
    const savedRequests = JSON.parse(localStorage.getItem('subscription-requests') || '[]');
    return savedRequests.filter((req: SubscriptionRequest) => req.status === 'rejected');
  });

  const handleRestore = (userId: string) => {
    // Update request status back to pending
    const allRequests = JSON.parse(localStorage.getItem('subscription-requests') || '[]');
    const updatedRequests = allRequests.map((req: SubscriptionRequest) =>
      req.userId === userId ? { ...req, status: 'pending' } : req
    );
    localStorage.setItem('subscription-requests', JSON.stringify(updatedRequests));

    // Update local state
    setRequests(requests.filter(req => req.userId !== userId));
  };

  const handleDelete = (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    // Remove user from users list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.filter((user: any) => user.id !== userId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Remove from subscription requests
    const allRequests = JSON.parse(localStorage.getItem('subscription-requests') || '[]');
    const updatedRequests = allRequests.filter((req: SubscriptionRequest) => req.userId !== userId);
    localStorage.setItem('subscription-requests', JSON.stringify(updatedRequests));

    // Update local state
    setRequests(requests.filter(req => req.userId !== userId));
  };

  if (requests.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400">No rejected subscription requests</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {requests.map((request) => (
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
                  onClick={() => handleRestore(request.userId)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Restore Request
                </button>
                <button
                  onClick={() => handleDelete(request.userId)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete User
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