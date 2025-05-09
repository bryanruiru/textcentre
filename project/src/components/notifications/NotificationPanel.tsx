import React, { useState } from 'react';
import { X, Book, CreditCard, Clock, Users, AlertCircle, Zap, Bell } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { Notification, NotificationType } from '../../types/notification';
import { Link } from 'react-router-dom';

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { 
    notifications, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    filterNotifications 
  } = useNotifications();
  
  const [activeFilter, setActiveFilter] = useState<NotificationType | 'all'>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  
  const filteredNotifications = activeFilter === 'all' 
    ? (showUnreadOnly ? filterNotifications({ isRead: false }) : notifications)
    : filterNotifications({ 
        type: activeFilter, 
        ...(showUnreadOnly ? { isRead: false } : {})
      });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'new_book':
        return <Book size={18} className="text-blue-500" />;
      case 'subscription':
        return <CreditCard size={18} className="text-purple-500" />;
      case 'reading_reminder':
        return <Clock size={18} className="text-amber-500" />;
      case 'referral':
        return <Users size={18} className="text-green-500" />;
      case 'system':
        return <AlertCircle size={18} className="text-red-500" />;
      case 'ai_recommendation':
        return <Zap size={18} className="text-indigo-500" />;
      default:
        return <AlertCircle size={18} className="text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString();
      }
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  return (
    <div className="max-h-[80vh] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="p-2 border-b dark:border-gray-700 flex justify-between items-center">
        <div className="flex space-x-1 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('new_book')}
            className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
              activeFilter === 'new_book'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            New Books
          </button>
          <button
            onClick={() => setActiveFilter('subscription')}
            className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
              activeFilter === 'subscription'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Subscription
          </button>
          <button
            onClick={() => setActiveFilter('ai_recommendation')}
            className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
              activeFilter === 'ai_recommendation'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            AI Recommendations
          </button>
        </div>
        
        <div className="flex items-center">
          <label className="flex items-center text-xs text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={() => setShowUnreadOnly(!showUnreadOnly)}
              className="mr-1 h-3 w-3"
            />
            Unread only
          </label>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-grow">
        {loading ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Loading notifications...
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">
            Error loading notifications: {error}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <div className="flex justify-center mb-2">
              <Bell size={24} className="text-gray-400" />
            </div>
            <p className="font-medium">No notifications</p>
            <p className="text-sm mt-1">
              {activeFilter !== 'all' || showUnreadOnly
                ? 'Try changing your filters'
                : "You're all caught up!"}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer ${
                !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="ml-3 flex-grow">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {notification.title}
                    </p>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                        {formatDate(notification.createdAt)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {notification.message}
                  </p>
                  {notification.link && (
                    <Link
                      to={notification.link}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
                    >
                      View details
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {filteredNotifications.length > 0 && (
        <div className="p-3 border-t dark:border-gray-700 flex justify-center">
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
