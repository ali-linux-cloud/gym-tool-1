import React, { useState, useEffect } from 'react';
import { Dumbbell, ArrowRight, Check, Users, BarChart, Clock, Crown, Star } from 'lucide-react';
import type { User } from '../types/auth';
import AuthModal from './AuthModal';
import SubscriptionModal from './SubscriptionModal';

interface LandingPageProps {
  onLogin: (user: User) => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly');

  useEffect(() => {
    // Initialize admin account if it doesn't exist
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminExists = users.some((user: User) => user.email === 'admin@saasfactory.com');
    
    if (!adminExists) {
      const adminUser: User = {
        id: 'admin-001',
        email: 'admin@saasfactory.com',
        password: 'alisaasfactory012$$',
        name: 'Admin',
        isVerified: true,
        subscriptionStatus: 'active'
      };
      localStorage.setItem('users', JSON.stringify([...users, adminUser]));
    }
  }, []);

  const handleSubscriptionClick = (plan: 'monthly' | 'yearly' | 'lifetime') => {
    setSelectedPlan(plan);
    setIsSubscriptionModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header remains the same */}
        <header className="pt-8">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <Dumbbell className="h-8 w-8 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl font-bold text-white">PowerFit Pro</h1>
            </div>
            <button
              onClick={() => {
                setAuthMode('login');
                setIsAuthModalOpen(true);
              }}
              className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </nav>
        </header>

        <main className="mt-16 sm:mt-24">
          {/* Hero section remains the same */}
          <div className="text-center mb-16">
            <h1>
              <span className="block text-sm font-semibold uppercase tracking-wide text-blue-400">
                Gym Management Software
              </span>
              <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                <span className="block text-white">Run Your Gym Like a</span>
                <span className="block text-blue-400">Professional Business</span>
              </span>
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl">
              Streamline your gym operations, manage memberships, and grow your business with our comprehensive management solution.
            </p>
          </div>

          {/* Features section remains the same */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
              <div className="bg-blue-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Member Management</h3>
              <p className="text-gray-400">Track memberships, payments, and attendance with ease.</p>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
              <div className="bg-blue-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Business Analytics</h3>
              <p className="text-gray-400">Make data-driven decisions with detailed insights and reports.</p>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
              <div className="bg-blue-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Automated Operations</h3>
              <p className="text-gray-400">Save time with automated renewals and payment tracking.</p>
            </div>
          </div>

          {/* Updated Subscription Plans */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Choose Your Plan</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Basic Monthly Plan */}
              <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 hover:border-blue-500/50 transition-all transform hover:-translate-y-1">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xl font-bold text-white">Basic Plan</h3>
                    <span className="px-2 py-1 bg-blue-900/50 text-blue-200 text-xs rounded-full">
                      Monthly
                    </span>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">3,500</span>
                    <span className="text-gray-400 ml-2">DA/month</span>
                  </div>
                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-center gap-2 text-gray-300">
                      <Check size={20} className="text-blue-400" />
                      Full management suite
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <Check size={20} className="text-blue-400" />
                      Member tracking
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <Check size={20} className="text-blue-400" />
                      Basic analytics
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <Check size={20} className="text-blue-400" />
                      Email support
                    </li>
                  </ul>
                  <button
                    onClick={() => handleSubscriptionClick('monthly')}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </div>

              {/* Premium Yearly Plan */}
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-700/50 rounded-2xl p-8 border-2 border-gray-500/50 hover:border-silver transition-all transform hover:-translate-y-1 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-gray-400 to-gray-300 text-gray-900 text-sm font-semibold rounded-full">
                  MOST POPULAR
                </div>
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-gray-300" />
                    <h3 className="text-xl font-bold text-white">Premium Plan</h3>
                  </div>
                  <div className="mb-2">
                    <span className="text-lg line-through text-red-400">42,000</span>
                    <span className="text-gray-400 ml-2">DA/year</span>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">35,000</span>
                    <span className="text-gray-300 ml-2">DA/year</span>
                    <div className="mt-2">
                      <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-400/30">
                        2 Months FREE! 🎉
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-center gap-2 text-gray-200">
                      <Check size={20} className="text-gray-300" />
                      Everything in Basic
                    </li>
                    <li className="flex items-center gap-2 text-gray-200">
                      <Check size={20} className="text-gray-300" />
                      Advanced analytics
                    </li>
                    <li className="flex items-center gap-2 text-gray-200">
                      <Check size={20} className="text-gray-300" />
                      Priority support
                    </li>
                    <li className="flex items-center gap-2 text-gray-200">
                      <Check size={20} className="text-gray-300" />
                      Custom reports
                    </li>
                    <li className="flex items-center gap-2 text-gray-200">
                      <Check size={20} className="text-gray-300" />
                      Staff management
                    </li>
                  </ul>
                  <button
                    onClick={() => handleSubscriptionClick('yearly')}
                    className="w-full bg-gradient-to-r from-gray-400 to-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg hover:from-gray-300 hover:to-gray-200 transition-colors"
                  >
                    Get Premium Access
                  </button>
                </div>
              </div>

              {/* Premium Plus Lifetime Plan */}
              <div className="bg-gradient-to-br from-amber-900/30 to-yellow-700/20 rounded-2xl p-8 border-2 border-yellow-500/30 hover:border-yellow-400 transition-all transform hover:-translate-y-1">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="h-5 w-5 text-yellow-500" />
                    <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-amber-300 bg-clip-text text-transparent">
                      Premium Plus
                    </h3>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">50,000</span>
                    <span className="text-gray-300 ml-2">DA</span>
                    <div className="mt-2">
                      <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm rounded-full border border-yellow-400/30">
                        Lifetime Access 👑
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex items-center gap-2 text-gray-200">
                      <Check size={20} className="text-yellow-500" />
                      Everything in Premium
                    </li>
                    <li className="flex items-center gap-2 text-gray-200">
                      <Check size={20} className="text-yellow-500" />
                      Lifetime updates
                    </li>
                    <li className="flex items-center gap-2 text-gray-200">
                      <Check size={20} className="text-yellow-500" />
                      24/7 VIP support
                    </li>
                    <li className="flex items-center gap-2 text-gray-200">
                      <Check size={20} className="text-yellow-500" />
                      Custom branding
                    </li>
                    <li className="flex items-center gap-2 text-gray-200">
                      <Check size={20} className="text-yellow-500" />
                      API access
                    </li>
                    <li className="flex items-center gap-2 text-gray-200">
                      <Check size={20} className="text-yellow-500" />
                      Priority feature requests
                    </li>
                  </ul>
                  <button
                    onClick={() => handleSubscriptionClick('lifetime')}
                    className="w-full bg-gradient-to-r from-yellow-500 to-amber-400 text-gray-900 font-semibold py-3 px-4 rounded-lg hover:from-yellow-400 hover:to-amber-300 transition-colors"
                  >
                    Get Lifetime Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onLogin={onLogin}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        plan={selectedPlan}
        onRegister={() => {
          setIsSubscriptionModalOpen(false);
          setAuthMode('register');
          setIsAuthModalOpen(true);
        }}
      />
    </div>
  );
}