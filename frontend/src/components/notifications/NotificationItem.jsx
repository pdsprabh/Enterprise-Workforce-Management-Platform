import { useNavigate } from 'react-router-dom';
import { formatNotificationTime } from '../../utils/formatters';
import { truncate } from '../../utils/formatters';
import { NOTIFICATION_TYPES } from '../../utils/constants';
import './Notifications.css';

const TYPE_ICONS = {
  [NOTIFICATION_TYPES.LEAVE]:       '🗓',
  [NOTIFICATION_TYPES.ATTENDANCE]:  '⏱',
  [NOTIFICATION_TYPES.PAYROLL]:     '💰',
  [NOTIFICATION_TYPES.HELPDESK]:    '🎧',
  [NOTIFICATION_TYPES.GENERAL]:     '📢',
  [NOTIFICATION_TYPES.PERFORMANCE]: '⭐',
};

export default function NotificationItem({ notification, onRead }) {
  const navigate = useNavigate();
  const { id, type, title, message, isRead, createdAt, actionUrl } = notification;

  function handleClick() {
    if (!isRead) onRead(id);
    if (actionUrl) navigate(actionUrl);
  }

  return (
    <div
      className={`notification-item${!isRead ? ' notification-item--unread' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={title}
    >
      <div className={`notification-item__icon notification-item__icon--${type}`}>
        {TYPE_ICONS[type] || '🔔'}
      </div>

      <div className="notification-item__body">
        <p className="notification-item__title">{title}</p>
        <p className="notification-item__message">{truncate(message, 60)}</p>
        <span className="notification-item__time">{formatNotificationTime(createdAt)}</span>
      </div>

      {!isRead && <div className="notification-item__dot" aria-hidden="true" />}
    </div>
  );
}
