import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { User } from '../types/auth';

interface RenewalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

const PLANS = [
  {
    type: 'monthly',
    name: 'Basic Plan',
    price: '3,500',
    duration: '1 month'
  },
  {
    type: 'yearly',
    name: 'Premium Plan',
    price: '35,000',
    duration: '1 year',
    discount: '2 months free'
  },
  {
    type: 'lifetime',
    name: 'Premium Plus',
    price: '50,000',
    duration: 'Lifetime'
  }
];

export default function RenewalModal({ isOpen, onClose, currentUser }: RenewalModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0].type);
  const [receiptImage, setReceiptImage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!receiptImage) {
      alert('Please upload a payment receipt');
      return;
    }

    // Create renewal request
    const renewalRequests = JSON.parse(localStorage.getItem('renewal-requests') || '[]');
    const newRequest = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      planType: selectedPlan,
      receiptImage,
      submissionDate: new Date().toISOString(),
      status: 'pending'
    };

    localStorage.setItem('renewal-requests', JSON.stringify([...renewalRequests, newRequest]));
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/10">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">Renew Subscription</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Select Plan
              </label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {PLANS.map((plan) => (
                  <option key={plan.type} value={plan.type}>
                    {plan.name} - {plan.price} DA ({plan.duration})
                    {plan.discount ? ` (${plan.discount})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Payment Details
              </label>
              <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-300">Account Name: PowerFit Pro</p>
                <p className="text-sm text-gray-300">Account Number: 0023 4567 8901 2345</p>
                <p className="text-sm text-gray-300">Account Key: PFTPRO2024</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Upload Payment Receipt
              </label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleImageUpload}
                className="w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-600 file:text-white
                  hover:file:bg-blue-700
                  file:cursor-pointer"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Renewal
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}