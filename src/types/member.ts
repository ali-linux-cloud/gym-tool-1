export interface Member {
  id: string;
  name: string;
  phoneNumber: string;
  startDate: string;
  duration: number;
  price: number;
  endDate: string;
}

export type MemberFormData = Omit<Member, 'id' | 'endDate'>;