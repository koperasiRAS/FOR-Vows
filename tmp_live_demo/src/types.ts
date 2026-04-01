export interface GuestInfo {
  name: string;
}

export interface EventInfo {
  title: string;
  date: string;
  time: string;
  location: string;
  mapUrl: string;
  googleMapsLink: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface Wish {
  id: string;
  name: string;
  message: string;
  attendance: 'yes' | 'no' | 'maybe';
  date: string;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}
