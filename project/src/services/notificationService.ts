import { supabase } from '../lib/supabase';
import { NotificationType } from '../types/notification';

/**
 * Service for creating and managing notifications
 */
export const notificationService = {
  /**
   * Create a new notification for a user
   */
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    link?: string,
    data?: Record<string, any>
  ) {
    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          link,
          data,
          is_read: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  /**
   * Create a new book notification
   */
  async newBookNotification(userId: string, bookId: string, bookTitle: string) {
    return this.createNotification(
      userId,
      'new_book',
      'New Book Available',
      `"${bookTitle}" has been added to our library.`,
      `/book/${bookId}`,
      { bookId }
    );
  },

  /**
   * Create a subscription notification
   */
  async subscriptionNotification(
    userId: string, 
    status: 'active' | 'canceled' | 'expired' | 'renewed',
    expiryDate?: string
  ) {
    let title = '';
    let message = '';

    switch (status) {
      case 'active':
        title = 'Subscription Activated';
        message = 'Your premium subscription is now active. Enjoy unlimited access to all books!';
        break;
      case 'canceled':
        title = 'Subscription Canceled';
        message = 'Your premium subscription has been canceled. You will have access until the end of your billing period.';
        break;
      case 'expired':
        title = 'Subscription Expired';
        message = 'Your premium subscription has expired. Renew now to continue enjoying premium benefits.';
        break;
      case 'renewed':
        title = 'Subscription Renewed';
        message = 'Your premium subscription has been renewed. Thank you for your continued support!';
        break;
    }

    return this.createNotification(
      userId,
      'subscription',
      title,
      message,
      '/dashboard/premium',
      { status, expiryDate }
    );
  },

  /**
   * Create a reading reminder notification
   */
  async readingReminderNotification(userId: string, bookId: string, bookTitle: string, progress: number) {
    return this.createNotification(
      userId,
      'reading_reminder',
      'Continue Reading',
      `You're ${progress}% through "${bookTitle}". Continue reading to finish the book!`,
      `/reader/${bookId}`,
      { bookId, progress }
    );
  },

  /**
   * Create a referral notification
   */
  async referralNotification(userId: string, referredBy: string, reward?: string) {
    return this.createNotification(
      userId,
      'referral',
      'Referral Bonus',
      `You were referred by ${referredBy}${reward ? ` and earned ${reward}` : ''}.`,
      '/dashboard/referrals',
      { referredBy, reward }
    );
  },

  /**
   * Create an AI recommendation notification
   */
  async aiRecommendationNotification(userId: string, bookIds: string[], message: string) {
    return this.createNotification(
      userId,
      'ai_recommendation',
      'AI Book Recommendations',
      message,
      '/dashboard/overview',
      { bookIds }
    );
  },

  /**
   * Create a system notification
   */
  async systemNotification(userId: string, title: string, message: string, link?: string) {
    return this.createNotification(
      userId,
      'system',
      title,
      message,
      link
    );
  }
};

export default notificationService;
