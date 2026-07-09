import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatters';
import {
  TICKET_PRIORITY_LABELS,
  TICKET_STATUS_LABELS,
  TICKET_CATEGORY_LABELS,
  TICKET_STATUS
} from '../../utils/constants';
import Button from '../ui/Button';
import useAuth from '../../hooks/useAuth';
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

export default function TicketCard({ ticket, onStatusChange }) {
  const { user } = useAuth();
  const { ticketNo, title, category, priority, status, raisedBy, assignedTo, createdAt } = ticket;
  
  const canUpdateStatus = ['Super Admin', 'Organization Admin', 'HR Manager', 'IT Administrator'].includes(user?.role);

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

      {canUpdateStatus && (
        <div className="ticket-card__actions" style={{ marginTop: '16px', display: 'flex', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
          {status === TICKET_STATUS.OPEN && (
            <Button variant="secondary" size="sm" onClick={() => onStatusChange(ticket.id, TICKET_STATUS.IN_PROGRESS)}>
              Mark In Progress
            </Button>
          )}
          {(status === TICKET_STATUS.OPEN || status === TICKET_STATUS.IN_PROGRESS) && (
            <Button variant="primary" size="sm" onClick={() => onStatusChange(ticket.id, TICKET_STATUS.RESOLVED)}>
              Resolve
            </Button>
          )}
          {(status === TICKET_STATUS.RESOLVED || status === TICKET_STATUS.IN_PROGRESS) && (
            <Button variant="ghost" size="sm" onClick={() => onStatusChange(ticket.id, TICKET_STATUS.CLOSED)}>
              Close Ticket
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
