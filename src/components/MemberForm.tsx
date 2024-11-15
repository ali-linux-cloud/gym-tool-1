import React, { useState } from 'react';
import type { MemberFormData } from '../types/member';

interface MemberFormProps {
  onSubmit: (member: MemberFormData) => void;
}

const DURATION_OPTIONS = [
  { label: '15 days', value: 15 },
  { label: '1 month', value: 30 },
  { label: '2 months', value: 60 },
  { label: '3 months', value: 90 },
  { label: '6 months', value: 180 },
  { label: '1 year', value: 365 },
];

export default function MemberForm({ onSubmit }: MemberFormProps) {
  const [formData, setFormData] = useState<MemberFormData>({
    name: '',
    phoneNumber: '',
    startDate: new Date().toISOString().split('T')[0],
    duration: 30,
    price: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      phoneNumber: '',
      startDate: new Date().toISOString().split('T')[0],
      duration: 30,
      price: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-200">Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-200">Phone Number</label>
        <input
          type="tel"
          required
          pattern="[0-9]*"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-200">Start Date</label>
        <input
          type="date"
          required
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-200">Duration</label>
        <select
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {DURATION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-200">Price (DZD)</label>
        <input
          type="number"
          required
          min="0"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        Add Member
      </button>
    </form>
  );
}