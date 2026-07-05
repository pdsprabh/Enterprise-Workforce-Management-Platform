import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatters';
import { EMPLOYMENT_TYPE_LABELS } from '../../utils/constants';
import './Recruitment.css';

function statusBadgeColor(status) {
  return status === 'active' ? 'success' : 'secondary';
}

/**
 * JobCard — card display for a job posting.
 *
 * @param {{ id, title, department, type, applicants, postedDate, status, location }} job
 */
export default function JobCard({ job }) {
  const { title, department, type, applicants, postedDate, status, location } = job;

  return (
    <div className="job-card">
      <div className="job-card__header">
        <h3 className="job-card__title">{title}</h3>
        <Badge color={statusBadgeColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>

      <div className="job-card__meta">
        <span className="job-card__dept">{department}</span>
        <span className="job-card__sep" aria-hidden="true">·</span>
        <span className="job-card__type">{EMPLOYMENT_TYPE_LABELS[type] || type}</span>
        <span className="job-card__sep" aria-hidden="true">·</span>
        <span className="job-card__location">📍 {location}</span>
      </div>

      <div className="job-card__footer">
        <span className="job-card__applicants">
          <strong>{applicants}</strong> applicant{applicants !== 1 ? 's' : ''}
        </span>
        <span className="job-card__date">Posted {formatDate(postedDate)}</span>
      </div>
    </div>
  );
}
