export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  rating: number;
  reviewCount: number;
  price: number | null;
  isPremium: boolean;
  isFree: boolean;
  hasAudio: boolean;
  genre: string[];
  publishedDate: string;
  progress?: number;
  lastRead?: string;
  reviews?: Review[];
  filePath?: string; // Path to the book file (epub, mp3, etc.)
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  isPremium: boolean;
  readingList?: string[];
  recentlyViewed?: string[];
  createdAt?: string;
  usageThisMonth?: UserUsage;
  referralCode?: string;
  referralCount?: number;
}

export interface UserUsage {
  booksRead: number;
  booksLimit: number;
  previewsViewed: number;
  previewsLimit: number;
  lastResetDate: string;
  aiQueriesUsed: number;
  aiQueriesLimit: number;
}

export interface Subscription {
  id?: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'cancelling';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  trial_end?: string;
  trial_start?: string;
  is_in_trial?: boolean;
  trial_days_remaining?: number;
  created_at?: string;
  updated_at?: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  is_popular?: boolean;
  stripe_price_id?: string;
}

export interface UserProfile extends User {
  stats?: {
    totalBooks: number;
    completedBooks: number;
    readingTime?: number;
  };
  recentBooks?: {
    id: string;
    title: string;
    author: string;
    coverImage: string;
    progress: number;
    lastRead: string;
  }[];
  subscription?: Subscription;
}

export interface AdminDashboard {
  stats: {
    totalUsers: number;
    totalBooks: number;
    premiumUsers: number;
    premiumPercentage: number;
  };
  recentUsers: User[];
  popularBooks: {
    id: string;
    title: string;
    author: string;
    rating: number;
    reviewCount: number;
  }[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export type ThemeMode = 'light' | 'dark' | 'sepia';

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface UserPreference {
  user_id: string;
  favorite_genres: string[];
  reading_time_preference?: 'morning' | 'afternoon' | 'evening' | 'night';
  content_preferences?: {
    fiction: boolean;
    nonfiction: boolean;
    academic: boolean;
    entertainment: boolean;
  };
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  language_preference?: string;
  created_at?: string;
  updated_at?: string;
}