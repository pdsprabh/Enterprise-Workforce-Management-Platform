import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../api/axiosInstance';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get('/notifications/me');
      if (res.data.success) {
        setNotifications(res.data.data.map(n => ({ ...n, id: n._id })));
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch if there is a token (authenticated)
    const token = localStorage.getItem('token');
    if (token) {
      fetchNotifications();
    } else {
      setIsLoading(false);
    }
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = useCallback(async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllRead,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return ctx;
}

export default NotificationProvider;
