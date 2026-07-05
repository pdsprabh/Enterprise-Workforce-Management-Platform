import { useState } from 'react';
import StarRating from '../ui/StarRating';
import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatters';
import './Performance.css';

function reviewBadgeColor(status) {
  switch (status) {
    case 'completed':   return 'success';
    case 'in_progress': return 'warning';
    case 'pending':     return 'secondary';
    default:            return 'primary';
  }
}

/**
 * ReviewCard — displays a performance review cycle with star rating and expandable feedback.
 *
 * @param {{ id, cycle, period, rating, reviewer, completedOn, status, feedback }} review
 */
export default function ReviewCard({ review }) {
  const { cycle, period, rating, reviewer, completedOn, status, feedback } = review;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="review-card">
      <div className="review-card__header">
        <div>
          <p className="review-card__cycle">{cycle}</p>
          <p className="review-card__period">{period}</p>
        </div>
        <Badge color={reviewBadgeColor(status)}>
          {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>

      <div className="review-card__meta">
        {rating != null ? (
          <StarRating rating={rating} />
        ) : (
          <span className="review-card__pending-rating">Rating pending</span>
        )}
        <span className="review-card__reviewer">By {reviewer}</span>
        {completedOn && (
          <span className="review-card__date">{formatDate(completedOn)}</span>
        )}
      </div>

      {feedback && (
        <>
          <p className={`review-card__feedback${expanded ? ' review-card__feedback--expanded' : ''}`}>
            {feedback}
          </p>
          <button
            className="review-card__toggle"
            onClick={() => setExpanded((p) => !p)}
            aria-expanded={expanded}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        </>
      )}
    </div>
  );
}
