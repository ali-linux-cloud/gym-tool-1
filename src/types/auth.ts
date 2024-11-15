export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  isVerified: boolean;
  subscriptionStatus: 'pending' | 'active' | 'expired';
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  planType: 'monthly' | 'yearly' | 'lifetime';
  receiptImage?: string;
  submissionDate?: string;
}

export interface SubscriptionRequest {
  userId: string;
  userEmail: string;
  userName: string;
  planType: 'monthly' | 'yearly' | 'lifetime';
  receiptImage: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface RenewalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planType: 'monthly' | 'yearly' | 'lifetime';
  receiptImage: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
}