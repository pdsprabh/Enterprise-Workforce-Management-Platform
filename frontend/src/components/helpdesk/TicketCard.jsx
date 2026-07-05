import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatters';
import {
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_LABELS,
  TICKET_CATEGORY_LABELS,
} from '../../utils/constants';
import './Helpdesk.css';

const STATUS_VARIANTS = {
  open:        'warning',
  in_progress: 'primary',
  resolved:    'success',
  closed:      'default',
};

const PRIORITY_VARIANTS = {
  low:    'default',
  medium: 'warning',
  high:   'danger',
  urgent: 'danger',
};

export default function TicketCard({ ticket }) {
  const { ticketNo, title, category, priority, status, raisedBy, assignedTo, createdAt } = ticket;

  return (
    <div className={`ticket-card ticket-card--${priority}`}>
      <div className="ticket-card__header">
        <div className="ticket-card__left">
          <div className="ticket-card__no">{ticketNo}</div>
          <h3 className="ticket-card__title">{title}</h3>
        </div>
        <div className="ticket-card__badges">
          <Badge variant={PRIORITY_VARIANTS[priority] || 'default'}>
            {TICKET_PRIORITY_LABELS[priority] || priority}
          </Badge>
          <Badge variant={STATUS_VARIANTS[status] || 'default'}>
            {TICKET_STATUS_LABELS[status] || status}
          </Badge>
        </div>
      </div>

      <div className="ticket-card__meta">
        <span className="ticket-card__meta-item">
          📂 {TICKET_CATEGORY_LABELS[category] || category}
        </span>
        <span className="ticket-card__meta-item">
          👤 {raisedBy}
        </span>
        <span className="ticket-card__meta-item">
          🔧 {assignedTo}
        </span>
        <span className="ticket-card__meta-item">
          📅 {formatDate(createdAt)}
        </span>
      </div>
    </div>
  );
}
