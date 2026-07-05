import { useState } from 'react';
import TabNav from '../../components/ui/TabNav';
import Button from '../../components/ui/Button';
import ProjectCard from '../../components/projects/ProjectCard';
import TaskItem from '../../components/projects/TaskItem';
import { mockProjects, mockTasks } from '../../utils/mockData';
import { TASK_STATUS, TASK_STATUS_LABELS, PROJECT_STATUS, PROJECT_STATUS_LABELS } from '../../utils/constants';
import { useToast } from '../../components/ui/Toast';
import './ProjectsPage.css';

const PROJECT_FILTERS = [
  { key: 'all', label: 'All' },
  { key: PROJECT_STATUS.ACTIVE,    label: PROJECT_STATUS_LABELS[PROJECT_STATUS.ACTIVE] },
  { key: PROJECT_STATUS.ON_HOLD,   label: PROJECT_STATUS_LABELS[PROJECT_STATUS.ON_HOLD] },
  { key: PROJECT_STATUS.COMPLETED, label: PROJECT_STATUS_LABELS[PROJECT_STATUS.COMPLETED] },
];

const TASK_FILTERS = [
  { key: 'all',                        label: 'All' },
  { key: TASK_STATUS.TODO,             label: TASK_STATUS_LABELS[TASK_STATUS.TODO] },
  { key: TASK_STATUS.IN_PROGRESS,      label: TASK_STATUS_LABELS[TASK_STATUS.IN_PROGRESS] },
  { key: TASK_STATUS.IN_REVIEW,        label: TASK_STATUS_LABELS[TASK_STATUS.IN_REVIEW] },
  { key: TASK_STATUS.DONE,             label: TASK_STATUS_LABELS[TASK_STATUS.DONE] },
];

const TABS = [
  { key: 'projects', label: 'My Projects' },
  { key: 'tasks',    label: 'My Tasks' },
];

export default function ProjectsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('projects');
  const [projectFilter, setProjectFilter] = useState('all');
  const [taskFilter, setTaskFilter] = useState('all');
  const [tasks, setTasks] = useState(mockTasks);

  // Filter projects
  const filteredProjects = projectFilter === 'all'
    ? mockProjects
    : mockProjects.filter((p) => p.status === projectFilter);

  // Filter & sort tasks — overdue first, then by due date
  const filteredTasks = tasks
    .filter((t) => taskFilter === 'all' || t.status === taskFilter)
    .sort((a, b) => {
      const aOverdue = a.status !== TASK_STATUS.DONE && new Date(a.dueDate) < new Date();
      const bOverdue = b.status !== TASK_STATUS.DONE && new Date(b.dueDate) < new Date();
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

  function handleToggleTask(taskId, currentStatus) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const newStatus = currentStatus === TASK_STATUS.DONE ? TASK_STATUS.TODO : TASK_STATUS.DONE;
        return { ...t, status: newStatus };
      })
    );
  }

  function handleNewProject() {
    showToast('New project creation coming soon!', 'info');
  }

  return (
    <div className="projects-page">
      <div className="projects-page__header">
        <h1 className="projects-page__title">Projects</h1>
        <Button onClick={handleNewProject}>+ New Project</Button>
      </div>

      <TabNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ── My Projects Tab ── */}
      {activeTab === 'projects' && (
        <>
          <div className="projects-page__filters">
            {PROJECT_FILTERS.map((f) => (
              <button
                key={f.key}
                className={`filter-chip${projectFilter === f.key ? ' filter-chip--active' : ''}`}
                onClick={() => setProjectFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredProjects.length === 0 ? (
            <div className="projects-empty">
              <div className="projects-empty__icon">📋</div>
              <p className="projects-empty__text">No projects match this filter.</p>
            </div>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── My Tasks Tab ── */}
      {activeTab === 'tasks' && (
        <>
          <div className="projects-page__filters">
            {TASK_FILTERS.map((f) => (
              <button
                key={f.key}
                className={`filter-chip${taskFilter === f.key ? ' filter-chip--active' : ''}`}
                onClick={() => setTaskFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="tasks-card">
            {filteredTasks.length === 0 ? (
              <div className="tasks-card__empty">No tasks match this filter.</div>
            ) : (
              filteredTasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={handleToggleTask} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
