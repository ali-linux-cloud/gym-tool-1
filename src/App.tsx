import React from 'react';
import { useState, useEffect } from 'react';
import { Dumbbell } from 'lucide-react';
import MemberForm from './components/MemberForm';
import MemberList from './components/MemberList';
import SearchBar from './components/SearchBar';
import Modal from './components/Modal';
import FloatingActionButton from './components/FloatingActionButton';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import RenewalModal from './components/RenewalModal';
import type { Member, MemberFormData } from './types/member';
import type { User } from './types/auth';
import { calculateEndDate } from './utils/memberUtils';

type FilterType = 'all' | 'active' | 'expired' | 'ending-soon';

function App() {
  const [members, setMembers] = useState<Member[]>(() => {
    const currentUser = JSON.parse(localStorage.getItem('current-user') || '{}');
    const saved = localStorage.getItem(`gym-members-${currentUser.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('current-user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    // Check for persisted login
    const savedUser = localStorage.getItem('current-user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      // Load user-specific members
      const userMembers = localStorage.getItem(`gym-members-${user.id}`);
      if (userMembers) {
        setMembers(JSON.parse(userMembers));
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(`gym-members-${currentUser.id}`, JSON.stringify(members));
    }
  }, [members, currentUser]);

  useEffect(() => {
    // Check for subscription expiry on login
    if (currentUser && currentUser.subscriptionStatus === 'active') {
      const daysLeft = calculateDaysLeft(currentUser.subscriptionEndDate);
      if (daysLeft <= 7 && daysLeft > 0) {
        setIsRenewalModalOpen(true);
      }
    }
  }, [currentUser]);

  const calculateDaysLeft = (endDate: string | undefined) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleAddMember = (formData: MemberFormData) => {
    const newMember: Member = {
      id: crypto.randomUUID(),
      ...formData,
      endDate: calculateEndDate(formData.startDate, formData.duration),
    };
    setMembers([...members, newMember]);
    setIsModalOpen(false);
  };

  const handleRenewMembership = (memberId: string) => {
    const duration = window.prompt('Enter new duration (days):', '30');
    if (!duration) return;

    setMembers(members.map((member) => {
      if (member.id === memberId) {
        const startDate = new Date().toISOString().split('T')[0];
        return {
          ...member,
          startDate,
          duration: parseInt(duration),
          endDate: calculateEndDate(startDate, parseInt(duration)),
        };
      }
      return member;
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('current-user');
    setCurrentUser(null);
    setMembers([]);
    window.location.hash = '';
  };

  if (!currentUser) {
    return <LandingPage onLogin={setCurrentUser} />;
  }

  // Redirect to admin dashboard if user is admin
  if (currentUser.email === 'admin@saasfactory.com') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (!currentUser.isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-gray-800/50 rounded-lg p-8 max-w-md w-full border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Subscription Pending</h2>
          <p className="text-gray-300 mb-4">
            Your subscription is pending verification. Please wait while an administrator reviews your payment receipt.
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <Dumbbell className="h-8 w-8 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl font-bold text-white">PowerFit Pro</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="rounded-lg border border-gray-700 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Members</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="ending-soon">Ending Soon</option>
              </select>
              <div className="w-full sm:w-72">
                <SearchBar value={searchTerm} onChange={setSearchTerm} />
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="pb-20">
            <MemberList 
              members={members.filter(member => 
                member.name.toLowerCase().includes(searchTerm.toLowerCase())
              )}
              onRenew={handleRenewMembership}
              filter={filter}
            />
          </div>

          <FloatingActionButton onClick={() => setIsModalOpen(true)} />

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Add New Member"
          >
            <MemberForm onSubmit={handleAddMember} />
          </Modal>

          <RenewalModal
            isOpen={isRenewalModalOpen}
            onClose={() => setIsRenewalModalOpen(false)}
            currentUser={currentUser}
          />
        </div>
      </div>
    </div>
  );
}

export default App;