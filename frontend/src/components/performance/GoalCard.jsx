import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatters';
import { GOAL_STATUS_LABELS } from '../../utils/constants';
import './Performance.css';

function goalBadgeColor(status) {
  switch (status) {
    case 'on_track':  return 'success';
    case 'at_risk':   return 'warning';
    case 'overdue':   return 'danger';
    case 'completed': return 'primary';
    default:          return 'secondary';
  }
}

/**
 * GoalCard — displays a single performance goal with progress bar.
 *
 * @param {{ id, title, description, progress, dueDate, status }} goal
 */
export default function GoalCard({ goal }) {
  const { title, description, progress, dueDate, status } = goal;

  let barColor = '#10b981';
  if (status === 'at_risk') barColor = '#f59e0b';
  if (status === 'overdue') barColor = '#ef4444';
  if (status === 'completed') barColor = '#4f46e5';

  return (
    <div className="goal-card">
      <div className="goal-card__header">
        <span className="goal-card__title">{title}</span>
        <Badge color={goalBadgeColor(status)}>
          {GOAL_STATUS_LABELS[status] || status}
        </Badge>
      </div>

      {description && (
        <p className="goal-card__desc">{description}</p>
      )}

      <div className="goal-card__progress-row">
        <div className="goal-card__progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="goal-card__progress-fill"
            style={{ width: `${progress}%`, background: barColor }}
          />
        </div>
        <span className="goal-card__pct">{progress}%</span>
      </div>

      <p className="goal-card__due">Due: {formatDate(dueDate)}</p>
    </div>
  );
}
