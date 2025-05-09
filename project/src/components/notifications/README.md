# Notification System

## Overview
The notification system provides real-time notifications to users about important events in the TextCentre application, such as new books, subscription changes, reading reminders, referrals, and AI recommendations.

## Components

### NotificationContext
- Manages notification state and provides methods for handling notifications
- Subscribes to real-time notifications using Supabase Realtime
- Provides methods for fetching, marking as read, and deleting notifications

### NotificationBell
- Displays the notification bell icon with unread count
- Opens the notification panel when clicked
- Positioned in the dashboard sidebar

### NotificationPanel
- Displays a list of notifications
- Provides filtering by notification type and read status
- Allows marking notifications as read and deleting them

## Notification Types
- `new_book`: Notifications about new books added to the library
- `subscription`: Subscription-related notifications (activation, cancellation, renewal)
- `reading_reminder`: Reminders to continue reading books in progress
- `referral`: Notifications about referral program activity
- `system`: System-wide announcements and important information
- `ai_recommendation`: Book recommendations from the AI assistant

## Database Schema
The notifications are stored in the `notifications` table with the following structure:
- `id`: UUID primary key
- `user_id`: UUID of the user (references auth.users)
- `type`: Type of notification (enum)
- `title`: Notification title
- `message`: Notification message
- `is_read`: Boolean indicating if the notification has been read
- `link`: Optional link to navigate to when clicking the notification
- `data`: Optional JSON data associated with the notification
- `created_at`: Timestamp when the notification was created

## Usage

### Adding the NotificationBell to a Component
```tsx
import { NotificationBell } from '../notifications';

const MyComponent = () => {
  return (
    <div>
      <NotificationBell />
    </div>
  );
};
```

### Creating a Notification
```tsx
import { notificationService } from '../../services/notificationService';

// Create a new book notification
await notificationService.newBookNotification(userId, bookId, bookTitle);

// Create a subscription notification
await notificationService.subscriptionNotification(userId, 'active');

// Create a reading reminder
await notificationService.readingReminderNotification(userId, bookId, bookTitle, progress);

// Create a referral notification
await notificationService.referralNotification(userId, referredBy, reward);

// Create an AI recommendation notification
await notificationService.aiRecommendationNotification(userId, bookIds, message);

// Create a system notification
await notificationService.systemNotification(userId, title, message, link);
```

### Using the Notification Context
```tsx
import { useNotifications } from '../../contexts/NotificationContext';

const MyComponent = () => {
  const { 
    notifications, 
    unreadCount,
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    filterNotifications 
  } = useNotifications();

  return (
    <div>
      <p>You have {unreadCount} unread notifications</p>
      {/* Component content */}
    </div>
  );
};
```

## Integration with AI Features
The notification system is integrated with the existing AI features to provide notifications for AI-generated recommendations and chat responses.
