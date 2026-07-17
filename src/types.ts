export type Tab = 'home' | 'account' | 'admin' | 'privacy' | 'refund' | 'about' | 'thankyou';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  planId: 'plan-a' | 'plan-b';
  planName: string;
  amount: number;
  screenshot: string; // Base64 or mock image representation
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface Plan {
  id: 'plan-a' | 'plan-b';
  name: string;
  badge: string;
  originalPrice: number;
  salePrice: number;
  episodesCount: number;
  ideasCount: number;
  earningCapacity: string;
  timeRequired: string;
  stockLeft: number;
  descriptionHindi: string;
  descriptionEnglish: string;
  bulletPoints: string[];
  colorTheme: {
    primary: string;
    secondary: string;
    bgGradient: string;
    border: string;
    text: string;
  };
}

export interface User {
  name: string;
  email: string;
  phone: string;
  purchasedPlans: ('plan-a' | 'plan-b')[];
  joinedDate: string;
}

export interface VideoEpisode {
  id: string;
  planId: 'plan-a' | 'plan-b';
  title: string;
  duration: string;
  description: string;
  videoUrl: string; // Embed or placeholder
  thumbnailUrl?: string;
  isLocked: boolean;
}

export interface EarningAlert {
  id: string;
  name: string;
  amount: number;
  plan: 'Plan A' | 'Plan B';
  time: string;
}
