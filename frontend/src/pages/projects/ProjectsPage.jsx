import { useState, useEffect } from 'react';
import TabNav from '../../components/ui/TabNav';
import Button from '../../components/ui/Button';
import ProjectCard from '../../components/projects/ProjectCard';
import TaskItem from '../../components/projects/TaskItem';
import { TASK_STATUS, TASK_STATUS_LABELS, PROJECT_STATUS, PROJECT_STATUS_LABELS } from '../../utils/constants';
import api from '../../api/axiosInstance';
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
  
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          api.get('/projects'),
          api.get('/projects/tasks/me')
        ]);
        setProjects(projectsRes.data.data || []);
        
        // Map backend task data to frontend format
        const mappedTasks = (tasksRes.data.data || []).map(t => ({
          ...t,
          id: t._id,
          title: t.title,
          project: t.project?.name || 'Unknown Project',
          priority: t.priority,
          status: t.status,
          dueDate: t.dueDate
        }));
        setTasks(mappedTasks);
      } catch (err) {
        console.error('Failed to fetch projects data', err);
        showToast('Failed to load projects data.', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [showToast]);

  // Filter projects
  const filteredProjects = projectFilter === 'all'
    ? projects
    : projects.filter((p) => p.status === projectFilter);

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

  async function handleToggleTask(taskId, currentStatus) {
    try {
      const newStatus = currentStatus === TASK_STATUS.DONE ? TASK_STATUS.TODO : TASK_STATUS.DONE;
      await api.put(`/projects/tasks/${taskId}/status`, { status: newStatus });
      
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          return { ...t, status: newStatus };
        })
      );
    } catch (err) {
      console.error(err);
      showToast('Failed to update task status.', 'error');
    }
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
