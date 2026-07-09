import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import api from '../../api/axiosInstance';
import JobCard from '../../components/recruitment/JobCard';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

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

export default function InternalJobBoard() {
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const isHR = user?.role === 'HR Manager' || user?.role === 'Super Admin' || user?.role === 'Organization Admin';
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Application Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [form, setForm] = useState({ mobile: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // HR Post Job Modal
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [postForm, setPostForm] = useState(EMPTY_FORM);
  const [postFormErrors, setPostFormErrors] = useState({});
  const [postSubmitting, setPostSubmitting] = useState(false);

  // HR Add Candidate Modal
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [candidateForm, setCandidateForm] = useState(EMPTY_CANDIDATE_FORM);
  const [candidateFormErrors, setCandidateFormErrors] = useState({});
  const [candidateResume, setCandidateResume] = useState(null);
  const [candidateSubmitting, setCandidateSubmitting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const res = await api.get('/recruitment/jobs');
      setJobs(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
      addToast({ type: 'error', message: 'Failed to fetch job openings' });
    } finally {
      setLoading(false);
    }
  }

  function handleApplyClick(job) {
    setSelectedJob(job);
    setForm({ mobile: '' });
    setResumeFile(null);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setSelectedJob(null);
    setForm({ mobile: '' });
    setResumeFile(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!resumeFile) {
      addToast({ type: 'error', message: 'Please attach a resume document.' });
      return;
    }
    
    setSubmitting(true);
    try {
      // 1. Create candidate record
      const candidatePayload = {
        name: user.name,
        email: user.email,
        mobile: form.mobile,
        positionAppliedFor: selectedJob.title
      };
      
      const candidateRes = await api.post('/recruitment/candidates', candidatePayload);
      const newCandidate = candidateRes.data.data;
      
      // 2. Upload Resume
      const formData = new FormData();
      formData.append('resume', resumeFile);
      
      await api.post(`/recruitment/candidates/${newCandidate._id}/resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      addToast({ type: 'success', message: `Application submitted for ${selectedJob.title}!` });
      handleCloseModal();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application. Please try again.';
      addToast({ type: 'error', message: msg });
    } finally {
      setSubmitting(false);
    }
  }

  // --- HR: POST JOB ---
  function handlePostFormChange(e) {
    const { name, value } = e.target;
    setPostForm(prev => ({ ...prev, [name]: value }));
    if (postFormErrors[name]) setPostFormErrors(prev => ({ ...prev, [name]: '' }));
  }

  async function handlePostJob(e) {
    e.preventDefault();
    const errors = {};
    if (!postForm.title.trim())      errors.title      = 'Job title is required';
    if (!postForm.department.trim()) errors.department = 'Department is required';
    if (!postForm.location.trim())   errors.location   = 'Location is required';
    
    if (Object.keys(errors).length) {
      setPostFormErrors(errors);
      return;
    }

    setPostSubmitting(true);
    try {
      const res = await api.post('/recruitment/jobs', postForm);
      setJobs(prev => [res.data.data, ...prev]);
      addToast({ type: 'success', message: 'Job posted successfully!' });
      setShowPostJobModal(false);
      setPostForm(EMPTY_FORM);
      setPostFormErrors({});
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to post job' });
    } finally {
      setPostSubmitting(false);
    }
  }

  // --- HR: ADD CANDIDATE ---
  function handleAddCandidateClick(job) {
    setCandidateForm({ ...EMPTY_CANDIDATE_FORM, positionAppliedFor: job.title });
    setCandidateResume(null);
    setCandidateFormErrors({});
    setShowCandidateModal(true);
  }

  function handleCandidateFormChange(e) {
    const { name, value } = e.target;
    setCandidateForm(prev => ({ ...prev, [name]: value }));
    if (candidateFormErrors[name]) setCandidateFormErrors(prev => ({ ...prev, [name]: '' }));
  }

  async function handleAddCandidate(e) {
    e.preventDefault();
    const errors = {};
    if (!candidateForm.name.trim()) errors.name = 'Name is required';
    if (!candidateForm.email.trim()) errors.email = 'Email is required';
    if (!candidateForm.positionAppliedFor) errors.positionAppliedFor = 'Position is required';
    
    if (Object.keys(errors).length) {
      setCandidateFormErrors(errors);
      return;
    }

    setCandidateSubmitting(true);
    try {
      const res = await api.post('/recruitment/candidates', candidateForm);
      const newCandidate = res.data.data;
      
      if (candidateResume) {
        const formData = new FormData();
        formData.append('resume', candidateResume);
        const uploadRes = await api.post(`/recruitment/candidates/${newCandidate._id}/resume`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        newCandidate.resumeUrl = uploadRes.data.data.resumeUrl;
      }

      addToast({ type: 'success', message: 'Candidate added successfully!' });
      setShowCandidateModal(false);
    } catch (err) {
      addToast({ type: 'error', message: 'Failed to add candidate' });
    } finally {
      setCandidateSubmitting(false);
    }
  }

  const activeJobs = jobs.filter(j => j.status === 'active');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Internal Job Openings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Explore and apply for new opportunities within the organization.
          </p>
        </div>
        {isHR && (
          <Button variant="primary" onClick={() => setShowPostJobModal(true)}>
            + Post New Role
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : activeJobs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <p className="text-slate-500 dark:text-slate-400">No open positions at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeJobs.map(job => (
            <div key={job._id || job.id} className="relative">
              <JobCard job={job} />
              <div className="mt-4 absolute bottom-6 right-6">
                 {isHR ? (
                   <Button variant="secondary" onClick={() => handleAddCandidateClick(job)}>
                     + Add Candidate
                   </Button>
                 ) : (
                   <Button variant="primary" onClick={() => handleApplyClick(job)}>
                      Apply Now
                   </Button>
                 )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Modal */}
      <Modal isOpen={showModal} onClose={handleCloseModal} title={`Apply for ${selectedJob?.title}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Name
              </label>
              <Input value={user?.name || ''} disabled />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <Input value={user?.email || ''} disabled />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number
              </label>
              <Input 
                value={form.mobile} 
                onChange={(e) => setForm({ ...form, mobile: e.target.value })} 
                placeholder="e.g. +1 234 567 890" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Resume (PDF/DOC) <span className="text-red-500">*</span>
              </label>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-slate-800 dark:file:text-indigo-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={handleCloseModal} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* HR Post Job Modal */}
      <Modal isOpen={showPostJobModal} onClose={() => setShowPostJobModal(false)} title="Post a New Job">
        <form onSubmit={handlePostJob} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Title *</label>
              <Input name="title" value={postForm.title} onChange={handlePostFormChange} placeholder="e.g. Senior Frontend Engineer" />
              {postFormErrors.title && <p className="text-red-500 text-xs mt-1">{postFormErrors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department *</label>
              <Input name="department" value={postForm.department} onChange={handlePostFormChange} placeholder="e.g. Engineering" />
              {postFormErrors.department && <p className="text-red-500 text-xs mt-1">{postFormErrors.department}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location *</label>
              <Input name="location" value={postForm.location} onChange={handlePostFormChange} placeholder="e.g. Remote" />
              {postFormErrors.location && <p className="text-red-500 text-xs mt-1">{postFormErrors.location}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
              <select name="type" value={postForm.type} onChange={handlePostFormChange} className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white">
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setShowPostJobModal(false)} disabled={postSubmitting}>Cancel</Button>
            <Button type="submit" variant="primary" loading={postSubmitting}>Post Job</Button>
          </div>
        </form>
      </Modal>

      {/* HR Add Candidate Modal */}
      <Modal isOpen={showCandidateModal} onClose={() => setShowCandidateModal(false)} title="Add Candidate">
        <form onSubmit={handleAddCandidate} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name *</label>
              <Input name="name" value={candidateForm.name} onChange={handleCandidateFormChange} placeholder="Candidate Name" />
              {candidateFormErrors.name && <p className="text-red-500 text-xs mt-1">{candidateFormErrors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
              <Input name="email" type="email" value={candidateForm.email} onChange={handleCandidateFormChange} placeholder="candidate@example.com" />
              {candidateFormErrors.email && <p className="text-red-500 text-xs mt-1">{candidateFormErrors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Position Applied For *</label>
              <Input name="positionAppliedFor" value={candidateForm.positionAppliedFor} onChange={handleCandidateFormChange} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Resume</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCandidateResume(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-slate-800 dark:file:text-indigo-400" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setShowCandidateModal(false)} disabled={candidateSubmitting}>Cancel</Button>
            <Button type="submit" variant="primary" loading={candidateSubmitting}>Add Candidate</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
