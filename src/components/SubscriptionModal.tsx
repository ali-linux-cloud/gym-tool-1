import React from 'react';
import { X, ArrowRight } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: 'monthly' | 'yearly' | 'lifetime';
  onRegister: () => void;
}

export default function SubscriptionModal({ isOpen, onClose, plan, onRegister }: SubscriptionModalProps) {
  if (!isOpen) return null;

  const price = plan === 'monthly' ? '3,500' : plan === 'yearly' ? '35,000' : '50,000';

  // Store selected plan in localStorage
  localStorage.setItem('selected-plan', plan);

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/10">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">Subscribe to {plan === 'monthly' ? 'Monthly' : plan === 'yearly' ? 'Yearly' : 'Lifetime'} Plan</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">How to Subscribe:</h3>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                    1
                  </span>
                  <div>
                    <p className="text-gray-300">
                      Send <span className="font-semibold text-white">{price} DA</span> to:
                    </p>
                    <div className="mt-2 p-3 bg-gray-800 rounded-lg border border-gray-700">
                      <p className="text-sm text-gray-300">Account Name: PowerFit Pro</p>
                      <p className="text-sm text-gray-300">Account Number: 0023 4567 8901 2345</p>
                      <p className="text-sm text-gray-300">Account Key: PFTPRO2024</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">
                    2
                  </span>
                  <div>
                    <p className="text-gray-300">
                      Create an account and upload your payment receipt
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
              <p className="text-sm text-blue-200">
                <strong>Note:</strong> Your subscription will be activated within 24 hours after verification of your payment receipt.
              </p>
            </div>

            <button
              onClick={onRegister}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Account
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}