import { useState, useEffect } from 'react';
import TabNav from '../../components/ui/TabNav';
import KanbanBoard from '../../components/ui/KanbanBoard';
import JobCard from '../../components/recruitment/JobCard';
import CandidateCard from '../../components/recruitment/CandidateCard';
import AIAnalysisModal from '../../components/recruitment/AIAnalysisModal';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { CANDIDATE_STAGES, CANDIDATE_STAGE_LABELS } from '../../utils/constants';
import api from '../../api/axiosInstance';
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

const EMPTY_FORM = {
  title: '',
  department: '',
  type: 'full-time',
  location: '',
  status: 'active',
};

const EMPTY_CANDIDATE_FORM = {
  name: '',
  email: '',
  mobile: '',
  positionAppliedFor: '',
};

export default function RecruitmentPage() {
  const [activeTab, setActiveTab] = useState('positions');
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Post Job modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Add Candidate modal state
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [candidateForm, setCandidateForm] = useState(EMPTY_CANDIDATE_FORM);
  const [candidateFormErrors, setCandidateFormErrors] = useState({});
  const [candidateResume, setCandidateResume] = useState(null);
  const [candidateSubmitting, setCandidateSubmitting] = useState(false);

  // AI Modal state
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedAICandidate, setSelectedAICandidate] = useState(null);

  const { addToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [jobsRes, candidatesRes] = await Promise.all([
        api.get('/recruitment/jobs'),
        api.get('/recruitment/candidates'),
      ]);
      setJobs(jobsRes.data.data || []);
      const mappedCandidates = (candidatesRes.data.data || []).map(c => ({
        ...c,
        id: c._id,
        // Normalize backend status to frontend CANDIDATE_STAGES keys
        // Backend uses: applied, screening, interview-scheduled, offer, hired, rejected
        stage: (() => {
          const s = (c.status || 'applied').toLowerCase();
          if (s === 'interview-scheduled' || s === 'interview') return 'interview';
          return s.replace('-', '_');
        })(),
      }));
      setCandidates(mappedCandidates);
    } catch (err) {
      console.error('Failed to fetch recruitment data', err);
      addToast({ type: 'error', message: 'Failed to fetch recruitment data' });
    } finally {
      setLoading(false);
    }
  }

  // ── Form helpers ───────────────────────────────────────────────────
  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  }

  function validateForm() {
    const errors = {};
    if (!form.title.trim())      errors.title      = 'Job title is required';
    if (!form.department.trim()) errors.department = 'Department is required';
    if (!form.location.trim())   errors.location   = 'Location is required';
    return errors;
  }

  async function handlePostJob(e) {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/recruitment/jobs', form);
      const newJob = res.data.data;
      setJobs(prev => [newJob, ...prev]);
      addToast({ type: 'success', message: `"${newJob.title}" posted successfully!` });
      setShowModal(false);
      setForm(EMPTY_FORM);
      setFormErrors({});
      // Switch to Open Positions tab so user sees the new job
      setActiveTab('positions');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to post job. Please try again.';
      addToast({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  function handleCloseModal() {
    setShowModal(false);
    setForm(EMPTY_FORM);
    setFormErrors({});
  }

  // ── Add Candidate form helpers ────────────────────────────────────
  function handleCandidateFormChange(e) {
    const { name, value } = e.target;
    setCandidateForm(prev => ({ ...prev, [name]: value }));
    if (candidateFormErrors[name]) setCandidateFormErrors(prev => ({ ...prev, [name]: '' }));
  }

  function validateCandidateForm() {
    const errors = {};
    if (!candidateForm.name.trim()) errors.name = 'Name is required';
    if (!candidateForm.email.trim()) errors.email = 'Email is required';
    if (!candidateForm.positionAppliedFor) errors.positionAppliedFor = 'Position is required';
    return errors;
  }

  async function handleAddCandidate(e) {
    e.preventDefault();
    const errors = validateCandidateForm();
    if (Object.keys(errors).length) {
      setCandidateFormErrors(errors);
      return;
    }

    setCandidateSubmitting(true);
    try {
      // 1. Create Candidate
      const res = await api.post('/recruitment/candidates', candidateForm);
      const newCandidate = res.data.data;
      
      // 2. Upload Resume if exists
      if (candidateResume) {
        const formData = new FormData();
        formData.append('resume', candidateResume);
        const uploadRes = await api.post(`/recruitment/candidates/${newCandidate._id}/resume`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        newCandidate.resumeUrl = uploadRes.data.data.resumeUrl; // Use actual Cloudinary URL
      }

      const mappedCandidate = {
        ...newCandidate,
        id: newCandidate._id,
        stage: 'applied'
      };

      setCandidates(prev => [mappedCandidate, ...prev]);
      addToast({ type: 'success', message: 'Candidate added successfully!' });
      handleCloseCandidateModal();
      setActiveTab('pipeline');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add candidate. Please try again.';
      addToast({ type: 'error', message: msg });
    } finally {
      setCandidateSubmitting(false);
    }
  }

  function handleCloseCandidateModal() {
    setShowCandidateModal(false);
    setCandidateForm(EMPTY_CANDIDATE_FORM);
    setCandidateFormErrors({});
    setCandidateResume(null);
  }

  const [analyzingIds, setAnalyzingIds] = useState([]); // Track loading state for AI Analyze

  // ── Candidate actions ──────────────────────────────────────────────
  async function handleAnalyzeCandidate(candidate) {
    if (candidate.aiAnalysis?.overallScore) {
      // Already analyzed, just show modal
      setSelectedAICandidate(candidate);
      setShowAIModal(true);
      return;
    }

    const candidateId = candidate._id || candidate.id;
    setAnalyzingIds(prev => [...prev, candidateId]);

    try {
      // Call analyze endpoint
      addToast({ type: 'info', message: 'Analyzing candidate profile...' });
      const res = await api.post(`/recruitment/candidates/${candidateId}/analyze`);
      const updatedCandidate = { ...res.data.data, id: res.data.data._id };
      
      setCandidates(prev => prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c));
      setSelectedAICandidate(updatedCandidate);
      setShowAIModal(true);
    } catch (error) {
      console.error('Failed to analyze candidate:', error);
      addToast({ type: 'error', message: 'AI Analysis failed. Please try again.' });
    } finally {
      setAnalyzingIds(prev => prev.filter(id => id !== candidateId));
    }
  }

  async function handleAdvance(candidateId, newStage) {
    try {
      const status = newStage;
      await api.put(`/recruitment/candidates/${candidateId}/status`, { status });
      setCandidates(prev =>
        prev.map(c => (c.id === candidateId ? { ...c, stage: newStage } : c))
      );
      addToast({ type: 'success', message: `Candidate advanced to ${CANDIDATE_STAGE_LABELS[newStage]}.` });
    } catch {
      addToast({ type: 'error', message: 'Failed to update candidate status' });
    }
  }

  async function handleReject(candidateId) {
    try {
      await api.put(`/recruitment/candidates/${candidateId}/status`, { status: 'rejected' });
      setCandidates(prev =>
        prev.map(c => (c.id === candidateId ? { ...c, stage: CANDIDATE_STAGES.REJECTED } : c))
      );
      addToast({ type: 'warning', message: 'Candidate marked as rejected.' });
    } catch {
      addToast({ type: 'error', message: 'Failed to reject candidate' });
    }
  }

  const kanbanColumns = KANBAN_COLUMNS.map(col => ({
    ...col,
    items: candidates.filter(c => c.stage === col.key),
  }));

  const activeJobs = jobs.filter(j => j.status === 'active');

  return (
    <div className="recruitment-page">
      {/* ── Header ── */}
      <div className="recruitment-page__header">
        <h1 className="recruitment-page__title">Recruitment</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="secondary" onClick={() => setShowCandidateModal(true)}>
            + Add Candidate
          </Button>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Post Job
          </Button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="recruitment-page__tabs">
        <TabNav tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* ── Tab Content ── */}
      <div className="recruitment-page__content" role="tabpanel">
        {activeTab === 'positions' && (
          <div className="jobs-grid">
            {activeJobs.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)', gridColumn: '1/-1', textAlign: 'center', padding: '24px' }}>
                No open positions at the moment.
              </p>
            ) : (
              activeJobs.map(job => <JobCard key={job._id || job.id} job={job} />)
            )}
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div className="recruitment-page__kanban">
            <KanbanBoard
              columns={kanbanColumns}
              renderItem={(candidate, _col) => (
                <CandidateCard
                  candidate={candidate}
                  onAdvance={handleAdvance}
                  onReject={handleReject}
                  onAnalyze={handleAnalyzeCandidate}
                  isAnalyzing={analyzingIds.includes(candidate.id || candidate._id)}
                />
              )}
            />
          </div>
        )}
      </div>

      {/* ── Post Job Modal ── */}
      <Modal isOpen={showModal} onClose={handleCloseModal} title="Post a New Job">
        <form onSubmit={handlePostJob} className="post-job-form" noValidate>
          <div className="post-job-form__grid">
            {/* Job Title */}
            <div className="post-job-form__field post-job-form__field--full">
              <label htmlFor="pj-title" className="post-job-form__label">
                Job Title <span className="post-job-form__required">*</span>
              </label>
              <Input
                id="pj-title"
                name="title"
                placeholder="e.g. Senior Frontend Engineer"
                value={form.title}
                onChange={handleFormChange}
              />
              {formErrors.title && <p className="post-job-form__error">{formErrors.title}</p>}
            </div>

            {/* Department */}
            <div className="post-job-form__field">
              <label htmlFor="pj-dept" className="post-job-form__label">
                Department <span className="post-job-form__required">*</span>
              </label>
              <Input
                id="pj-dept"
                name="department"
                placeholder="e.g. Engineering"
                value={form.department}
                onChange={handleFormChange}
              />
              {formErrors.department && <p className="post-job-form__error">{formErrors.department}</p>}
            </div>

            {/* Location */}
            <div className="post-job-form__field">
              <label htmlFor="pj-location" className="post-job-form__label">
                Location <span className="post-job-form__required">*</span>
              </label>
              <Input
                id="pj-location"
                name="location"
                placeholder="e.g. Remote / New Delhi"
                value={form.location}
                onChange={handleFormChange}
              />
              {formErrors.location && <p className="post-job-form__error">{formErrors.location}</p>}
            </div>

            {/* Employment Type */}
            <div className="post-job-form__field">
              <label htmlFor="pj-type" className="post-job-form__label">Employment Type</label>
              <select
                id="pj-type"
                name="type"
                className="post-job-form__select"
                value={form.type}
                onChange={handleFormChange}
              >
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            {/* Status */}
            <div className="post-job-form__field">
              <label htmlFor="pj-status" className="post-job-form__label">Status</label>
              <select
                id="pj-status"
                name="status"
                className="post-job-form__select"
                value={form.status}
                onChange={handleFormChange}
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="post-job-form__actions">
            <Button type="button" variant="secondary" onClick={handleCloseModal} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {submitting ? 'Posting…' : 'Post Job'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Add Candidate Modal ── */}
      <Modal isOpen={showCandidateModal} onClose={handleCloseCandidateModal} title="Add Candidate">
        <form onSubmit={handleAddCandidate} className="post-job-form" noValidate>
          <div className="post-job-form__grid">
            <div className="post-job-form__field post-job-form__field--full">
              <label className="post-job-form__label">
                Name <span className="post-job-form__required">*</span>
              </label>
              <Input
                name="name"
                placeholder="Candidate Full Name"
                value={candidateForm.name}
                onChange={handleCandidateFormChange}
              />
              {candidateFormErrors.name && <p className="post-job-form__error">{candidateFormErrors.name}</p>}
            </div>

            <div className="post-job-form__field">
              <label className="post-job-form__label">
                Email <span className="post-job-form__required">*</span>
              </label>
              <Input
                name="email"
                type="email"
                placeholder="candidate@example.com"
                value={candidateForm.email}
                onChange={handleCandidateFormChange}
              />
              {candidateFormErrors.email && <p className="post-job-form__error">{candidateFormErrors.email}</p>}
            </div>

            <div className="post-job-form__field">
              <label className="post-job-form__label">Mobile</label>
              <Input
                name="mobile"
                placeholder="+1 234 567 890"
                value={candidateForm.mobile}
                onChange={handleCandidateFormChange}
              />
            </div>

            <div className="post-job-form__field post-job-form__field--full">
              <label className="post-job-form__label">
                Position Applied For <span className="post-job-form__required">*</span>
              </label>
              <select
                name="positionAppliedFor"
                className="post-job-form__select"
                value={candidateForm.positionAppliedFor}
                onChange={handleCandidateFormChange}
              >
                <option value="">Select a job position...</option>
                {activeJobs.map(job => (
                  <option key={job._id || job.id} value={job.title}>{job.title}</option>
                ))}
              </select>
              {candidateFormErrors.positionAppliedFor && <p className="post-job-form__error">{candidateFormErrors.positionAppliedFor}</p>}
            </div>

            <div className="post-job-form__field post-job-form__field--full">
              <label className="post-job-form__label">
                Resume (PDF/DOC)
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCandidateResume(e.target.files[0])}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-slate-800 dark:file:text-indigo-400"
              />
            </div>
          </div>

          <div className="post-job-form__actions">
            <Button type="button" variant="secondary" onClick={handleCloseCandidateModal} disabled={candidateSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={candidateSubmitting}>
              {candidateSubmitting ? 'Adding...' : 'Add Candidate'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── AI Analysis Modal ── */}
      <AIAnalysisModal 
        isOpen={showAIModal} 
        onClose={() => setShowAIModal(false)} 
        candidate={selectedAICandidate} 
      />
    </div>
  );
}
