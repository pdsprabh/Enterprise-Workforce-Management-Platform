import Badge from '../ui/Badge';
import { getInitials, formatDate } from '../../utils/formatters';
import { PROJECT_STATUS_LABELS } from '../../utils/constants';
import './Projects.css';

const STATUS_BADGE_VARIANTS = {
  active:    'success',
  on_hold:   'warning',
  completed: 'primary',
  cancelled: 'danger',
};

function getProgressClass(progress) {
  if (progress >= 70) return 'high';
  if (progress >= 30) return 'medium';
  return 'low';
}

export default function ProjectCard({ project }) {
  const { title, status, progress, deadline, teamMembers, tasksTotal, tasksCompleted, department } = project;
  const maxAvatars = 3;
  const visibleMembers = teamMembers.slice(0, maxAvatars);
  const overflow = teamMembers.length - maxAvatars;

  return (
    <div className={`project-card project-card--${status}`}>
      <div className="project-card__header">
        <h3 className="project-card__title">{title}</h3>
        <Badge variant={STATUS_BADGE_VARIANTS[status] || 'default'}>
          {PROJECT_STATUS_LABELS[status] || status}
        </Badge>
      </div>

      <p className="project-card__meta">
        {department} · Due: {formatDate(deadline)}
      </p>

      <div className="project-card__progress-label">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="project-card__progress-bar">
        <div
          className={`project-card__progress-fill project-card__progress-fill--${getProgressClass(progress)}`}
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="project-card__footer">
        <span className="project-card__tasks">
          {tasksCompleted} / {tasksTotal} tasks
        </span>
        <div className="project-card__team" aria-label="Team members">
          {visibleMembers.map((m) => (
            <div key={m.id} className="project-card__avatar" title={m.name}>
              {getInitials(m.name)}
            </div>
          ))}
          {overflow > 0 && (
            <div className="project-card__overflow">+{overflow}</div>
          )}
        </div>
      </div>
    </div>
  );
}
