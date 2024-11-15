import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { User } from '../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onLogin: (user: User) => void;
}

export default function AuthModal({ isOpen, onClose, mode, onLogin }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [receiptImage, setReceiptImage] = useState<string>('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Special case for admin login
      if (mode === 'login' && email === 'admin@saasfactory.com' && password === 'alisaasfactory012$$') {
        const adminUser: User = {
          id: 'admin',
          email: 'admin@saasfactory.com',
          password: 'alisaasfactory012$$',
          name: 'Admin',
          isVerified: true,
          subscriptionStatus: 'active',
          planType: 'lifetime'
        };
        localStorage.setItem('current-user', JSON.stringify(adminUser));
        onLogin(adminUser);
        onClose();
        return;
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];

      if (mode === 'login') {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('current-user', JSON.stringify(user));
          onLogin(user);
          onClose();
        } else {
          setError('Invalid email or password');
        }
      } else {
        if (users.some(u => u.email === email)) {
          setError('Email already exists');
          return;
        }

        if (!receiptImage) {
          setError('Please upload a payment receipt');
          return;
        }

        const selectedPlan = localStorage.getItem('selected-plan') || 'monthly';
        
        const newUser: User = {
          id: crypto.randomUUID(),
          email,
          password,
          name,
          isVerified: false,
          subscriptionStatus: 'pending',
          planType: selectedPlan as 'monthly' | 'yearly' | 'lifetime',
          receiptImage,
          submissionDate: new Date().toISOString()
        };

        // Add user to users list
        localStorage.setItem('users', JSON.stringify([...users, newUser]));
        
        // Add subscription request
        const requests = JSON.parse(localStorage.getItem('subscription-requests') || '[]');
        const newRequest = {
          userId: newUser.id,
          userEmail: newUser.email,
          userName: newUser.name,
          planType: selectedPlan,
          receiptImage: newUser.receiptImage,
          submissionDate: newUser.submissionDate,
          status: 'pending'
        };
        localStorage.setItem('subscription-requests', JSON.stringify([...requests, newRequest]));
        
        // Set current user
        localStorage.setItem('current-user', JSON.stringify(newUser));
        onLogin(newUser);
        onClose();
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An error occurred. Please try again.');
    }
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
            <h2 className="text-xl font-semibold text-white">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-200">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-200">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-200">Payment Receipt</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleImageUpload}
                  className="mt-1 block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-600 file:text-white
                    hover:file:bg-blue-700
                    file:cursor-pointer"
                />
              </div>
            )}
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}