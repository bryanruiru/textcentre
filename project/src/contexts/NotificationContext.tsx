import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../store';
import { Notification, NotificationFilters, NotificationType } from '../types/notification';
import toast from 'react-hot-toast';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  filterNotifications: (filters: NotificationFilters) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { auth } = useAppStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!auth.user?.id) return;

    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${auth.user.id}`,
      }, (payload) => {
        const newNotification = payload.new as Notification;
        setNotifications(prev => [newNotification, ...prev]);
        
        // Show toast for new notifications
        toast(
          <div className="flex items-start">
            <div className="ml-3">
              <p className="font-medium">{newNotification.title}</p>
              <p className="text-sm text-gray-500">{newNotification.message}</p>
            </div>
          </div>,
          { duration: 5000 }
        );
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [auth.user?.id]);

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (auth.user?.id) {
      fetchNotifications();
    }
  }, [auth.user?.id]);

  const fetchNotifications = async () => {
    if (!auth.user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', auth.user.id)
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (error) throw error;
      
      setNotifications(data as Notification[]);
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
        
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      setError(err.message);
    }
  };

  const markAllAsRead = async () => {
    if (!auth.user?.id) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', auth.user.id)
        .eq('is_read', false);
        
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err);
      setError(err.message);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setNotifications(prev => 
        prev.filter(notification => notification.id !== id)
      );
    } catch (err: any) {
      console.error('Error deleting notification:', err);
      setError(err.message);
    }
  };

  const filterNotifications = (filters: NotificationFilters): Notification[] => {
    return notifications.filter(notification => {
      if (filters.type && notification.type !== filters.type) {
        return false;
      }
      if (filters.isRead !== undefined && notification.isRead !== filters.isRead) {
        return false;
      }
      return true;
    });
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    filterNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
