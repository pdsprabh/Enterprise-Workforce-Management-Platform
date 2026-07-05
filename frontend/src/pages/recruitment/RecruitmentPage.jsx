import { useState } from 'react';
import TabNav from '../../components/ui/TabNav';
import KanbanBoard from '../../components/ui/KanbanBoard';
import JobCard from '../../components/recruitment/JobCard';
import CandidateCard from '../../components/recruitment/CandidateCard';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { mockJobPostings, mockCandidates } from '../../utils/mockData';
import { CANDIDATE_STAGES, CANDIDATE_STAGE_LABELS } from '../../utils/constants';
import './RecruitmentPage.css';

const TABS = [
  { key: 'positions', label: 'Open Positions' },
  { key: 'pipeline', label: 'Candidate Pipeline' },
];

const KANBAN_COLUMNS = [
  { key: CANDIDATE_STAGES.APPLIED,    title: CANDIDATE_STAGE_LABELS[CANDIDATE_STAGES.APPLIED],    color: '#4f46e5' },
  { key: CANDIDATE_STAGES.SCREENING,  title: CANDIDATE_STAGE_LABELS[CANDIDATE_STAGES.SCREENING],  color: '#3b82f6' },
  { key: CANDIDATE_STAGES.INTERVIEW,  title: CANDIDATE_STAGE_LABELS[CANDIDATE_STAGES.INTERVIEW],  color: '#f59e0b' },
  { key: CANDIDATE_STAGES.OFFER,      title: CANDIDATE_STAGE_LABELS[CANDIDATE_STAGES.OFFER],      color: '#10b981' },
  { key: CANDIDATE_STAGES.HIRED,      title: CANDIDATE_STAGE_LABELS[CANDIDATE_STAGES.HIRED],      color: '#059669' },
  { key: CANDIDATE_STAGES.REJECTED,   title: CANDIDATE_STAGE_LABELS[CANDIDATE_STAGES.REJECTED],   color: '#ef4444' },
];

export default function RecruitmentPage() {
  const [activeTab, setActiveTab] = useState('positions');
  const [candidates, setCandidates] = useState(mockCandidates);
  const { addToast } = useToast();

  function handleAdvance(candidateId, newStage) {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c))
    );
    addToast({ type: 'success', message: `Candidate advanced to ${CANDIDATE_STAGE_LABELS[newStage]}.` });
  }

  function handleReject(candidateId) {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: CANDIDATE_STAGES.REJECTED } : c))
    );
    addToast({ type: 'warning', message: 'Candidate marked as rejected.' });
  }

  // Build kanban columns with current candidates
  const kanbanColumns = KANBAN_COLUMNS.map((col) => ({
    ...col,
    items: candidates.filter((c) => c.stage === col.key),
  }));

  const activeJobs = mockJobPostings.filter((j) => j.status === 'active');

  return (
    <div className="recruitment-page">
      {/* Header */}
      <div className="recruitment-page__header">
        <h1 className="recruitment-page__title">Recruitment</h1>
        <Button variant="primary" onClick={() => addToast({ type: 'info', message: 'Post Job feature coming soon!' })}>
          + Post Job
        </Button>
      </div>

      {/* Tabs */}
      <div className="recruitment-page__tabs">
        <TabNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      <div className="recruitment-page__content" role="tabpanel">
        {/* Open Positions */}
        {activeTab === 'positions' && (
          <div className="jobs-grid">
            {activeJobs.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', gridColumn: '1/-1', textAlign: 'center', padding: '24px' }}>
                No open positions at the moment.
              </p>
            ) : (
              activeJobs.map((job) => <JobCard key={job.id} job={job} />)
            )}
          </div>
        )}

        {/* Candidate Pipeline */}
        {activeTab === 'pipeline' && (
          <div className="recruitment-page__kanban">
            <KanbanBoard
              columns={kanbanColumns}
              renderItem={(candidate, _col) => (
                <CandidateCard
                  candidate={candidate}
                  onAdvance={handleAdvance}
                  onReject={handleReject}
                />
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
