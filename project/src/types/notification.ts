export type NotificationType = 
  | 'new_book' 
  | 'subscription' 
  | 'reading_reminder' 
  | 'referral' 
  | 'system'
  | 'ai_recommendation';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
  data?: Record<string, any>;
}

export interface NotificationFilters {
  type?: NotificationType;
  isRead?: boolean;
}
