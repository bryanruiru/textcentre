import { notificationService } from './notificationService';
import { Book } from '../types';

/**
 * Utility functions to integrate AI features with the notification system
 */
export const aiNotificationIntegration = {
  /**
   * Send a notification for AI book recommendations
   */
  async sendRecommendationNotification(
    userId: string,
    recommendedBooks: Book[],
    reason: string = 'Based on your reading history'
  ) {
    const bookIds = recommendedBooks.map(book => book.id);
    const bookTitles = recommendedBooks.map(book => book.title);
    
    let message = '';
    
    if (bookTitles.length === 1) {
      message = `We think you might enjoy "${bookTitles[0]}". ${reason}`;
    } else if (bookTitles.length === 2) {
      message = `We think you might enjoy "${bookTitles[0]}" and "${bookTitles[1]}". ${reason}`;
    } else if (bookTitles.length > 2) {
      const lastBook = bookTitles.pop();
      message = `We think you might enjoy ${bookTitles.map(title => `"${title}"`).join(', ')} and "${lastBook}". ${reason}`;
    }
    
    return notificationService.aiRecommendationNotification(
      userId,
      bookIds,
      message
    );
  },
  
  /**
   * Send a notification for AI chat responses
   */
  async sendChatResponseNotification(
    userId: string,
    question: string,
    hasAnswer: boolean
  ) {
    if (hasAnswer) {
      return notificationService.systemNotification(
        userId,
        'AI Chat Response',
        `Your question "${question.substring(0, 30)}${question.length > 30 ? '...' : ''}" has been answered.`,
        '/dashboard/overview?openChat=true'
      );
    } else {
      return notificationService.systemNotification(
        userId,
        'AI Chat Response Needed',
        `We need more information to answer your question about "${question.substring(0, 30)}${question.length > 30 ? '...' : ''}".`,
        '/dashboard/overview?openChat=true'
      );
    }
  },
  
  /**
   * Send a notification for reading reminders
   */
  async sendReadingReminderNotification(
    userId: string,
    book: Book,
    daysSinceLastRead: number
  ) {
    if (!book.progress || book.progress >= 100) return;
    
    let message = '';
    
    if (daysSinceLastRead === 1) {
      message = `You haven't read "${book.title}" since yesterday. Continue your reading journey!`;
    } else if (daysSinceLastRead > 1 && daysSinceLastRead <= 7) {
      message = `It's been ${daysSinceLastRead} days since you last read "${book.title}". Keep up your reading streak!`;
    } else if (daysSinceLastRead > 7) {
      message = `It's been over a week since you last read "${book.title}". Don't lose your progress!`;
    }
    
    return notificationService.readingReminderNotification(
      userId,
      book.id,
      book.title,
      book.progress
    );
  },
  
  /**
   * Send a notification for new AI features
   */
  async sendNewAIFeatureNotification(
    userId: string,
    featureName: string,
    featureDescription: string
  ) {
    return notificationService.systemNotification(
      userId,
      `New AI Feature: ${featureName}`,
      featureDescription,
      '/dashboard/overview'
    );
  }
};

export default aiNotificationIntegration;
