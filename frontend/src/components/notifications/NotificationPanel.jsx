import { useEffect, useRef } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationItem from './NotificationItem';
import './Notifications.css';

export default function NotificationPanel({ onClose }) {
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const panelRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="notification-panel" ref={panelRef} role="dialog" aria-label="Notifications">
      <div className="notification-panel__header">
        <h3 className="notification-panel__title">
          Notifications{unreadCount > 0 && ` (${unreadCount})`}
        </h3>
        {unreadCount > 0 && (
          <button className="notification-panel__mark-all" onClick={markAllRead}>
            Mark all read
          </button>
        )}
      </div>

      <div className="notification-panel__list">
        {notifications.length === 0 ? (
          <p className="notification-panel__empty">No notifications yet</p>
        ) : (
          notifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onRead={markAsRead}
            />
          ))
        )}
      </div>

      <div className="notification-panel__footer">
        <button className="notification-panel__view-all" onClick={onClose}>
          View all notifications
        </button>
      </div>
    </div>
  );
}
