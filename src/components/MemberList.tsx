import React from 'react';
import { RefreshCw, User } from 'lucide-react';
import type { Member } from '../types/member';
import { formatCurrency, isMembershipActive, getDaysRemaining } from '../utils/memberUtils';

interface MemberListProps {
  members: Member[];
  onRenew: (memberId: string) => void;
  filter: 'all' | 'active' | 'expired' | 'ending-soon';
}

function getAvatarColor(name: string): string {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}

export default function MemberList({ members, onRenew, filter }: MemberListProps) {
  const filteredMembers = members.filter(member => {
    const daysLeft = getDaysRemaining(member.endDate);
    switch (filter) {
      case 'active':
        return daysLeft > 0;
      case 'expired':
        return daysLeft <= 0;
      case 'ending-soon':
        return daysLeft > 0 && daysLeft <= 7;
      default:
        return true;
    }
  });

  if (filteredMembers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-800/50 rounded-lg p-8 max-w-md mx-auto border border-gray-700">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-white">No members found</h3>
          <p className="mt-1 text-sm text-gray-400">
            {filter === 'all'
              ? 'Get started by adding your first member'
              : `No members found with the "${filter}" filter`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredMembers.map((member) => {
        const isActive = isMembershipActive(member.endDate);
        const avatarColor = getAvatarColor(member.name);
        const initials = member.name
          .split(' ')
          .map(word => word[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
        const daysRemaining = getDaysRemaining(member.endDate);

        return (
          <div key={member.id} className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500/50 transition-colors">
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${avatarColor} flex items-center justify-center shadow-lg`}>
                  {initials ? (
                    <span className="text-white text-lg font-semibold">{initials}</span>
                  ) : (
                    <User className="text-white" size={24} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-semibold text-white truncate">
                    {member.name}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    {member.phoneNumber}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isActive
                      ? daysRemaining <= 7
                        ? 'bg-yellow-900/50 text-yellow-200 border border-yellow-700'
                        : 'bg-green-900/50 text-green-200 border border-green-700'
                      : 'bg-red-900/50 text-red-200 border border-red-700'
                  }`}
                >
                  {isActive ? (daysRemaining <= 7 ? 'Ending Soon' : 'Active') : 'Expired'}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Start Date:</span>
                  <span className="text-white">{member.startDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">End Date:</span>
                  <span className="text-white">{member.endDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Days Remaining:</span>
                  <span className={`font-medium ${
                    daysRemaining <= 0
                      ? 'text-red-300'
                      : daysRemaining <= 7
                      ? 'text-yellow-300'
                      : 'text-green-300'
                  }`}>
                    {daysRemaining <= 0
                      ? 'Expired'
                      : `${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Price:</span>
                  <span className="text-white font-medium">
                    {formatCurrency(member.price)}
                  </span>
                </div>
              </div>
              {!isActive && (
                <button
                  onClick={() => onRenew(member.id)}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-900/30 text-blue-200 rounded-lg border border-blue-700 hover:bg-blue-900/50 transition-colors"
                >
                  <RefreshCw size={16} />
                  Renew Membership
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}