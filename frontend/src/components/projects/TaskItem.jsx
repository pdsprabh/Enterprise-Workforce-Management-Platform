import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatters';
import { TASK_PRIORITY, TASK_PRIORITY_LABELS, TASK_STATUS } from '../../utils/constants';
import './Projects.css';

const PRIORITY_VARIANTS = {
  [TASK_PRIORITY.LOW]:      'default',
  [TASK_PRIORITY.MEDIUM]:   'warning',
  [TASK_PRIORITY.HIGH]:     'danger',
  [TASK_PRIORITY.CRITICAL]: 'danger',
};

const PRIORITY_COLORS = {
  [TASK_PRIORITY.LOW]:      '#9CA3AF',
  [TASK_PRIORITY.MEDIUM]:   '#F59E0B',
  [TASK_PRIORITY.HIGH]:     '#F97316',
  [TASK_PRIORITY.CRITICAL]: '#EF4444',
};

export default function TaskItem({ task, onToggle }) {
  const isDone = task.status === TASK_STATUS.DONE;
  const isOverdue = !isDone && task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div className="task-item">
      {/* Checkbox */}
      <button
        className={`task-item__checkbox${isDone ? ' task-item__checkbox--done' : ''}`}
        onClick={() => onToggle && onToggle(task.id, task.status)}
        aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
        aria-pressed={isDone}
      >
        {isDone && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Priority color dot */}
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: PRIORITY_COLORS[task.priority] || '#9CA3AF',
          flexShrink: 0,
        }}
        title={TASK_PRIORITY_LABELS[task.priority]}
        aria-hidden="true"
      />

      {/* Title */}
      <span className={`task-item__title${isDone ? ' task-item__title--done' : ''}`}>
        {task.title}
      </span>

      {/* Meta */}
      <div className="task-item__meta">
        <Badge
          variant={PRIORITY_VARIANTS[task.priority] || 'default'}
          style={{ fontSize: '0.75rem' }}
        >
          {TASK_PRIORITY_LABELS[task.priority] || task.priority}
        </Badge>

        <span className="task-item__assignee">{task.assignee}</span>

        <span className={`task-item__due${isOverdue ? ' task-item__due--overdue' : ''}`}>
          {formatDate(task.dueDate)}
          {isOverdue && ' 🔴'}
        </span>
      </div>
    </div>
  );
}
