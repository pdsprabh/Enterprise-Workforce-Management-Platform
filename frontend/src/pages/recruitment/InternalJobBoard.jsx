import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';
import api from '../../api/axiosInstance';
import JobCard from '../../components/recruitment/JobCard';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function InternalJobBoard() {
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();
  
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Application Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [form, setForm] = useState({ mobile: '' });
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  const activeJobs = jobs.filter(j => j.status === 'active');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Internal Job Openings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Explore and apply for new opportunities within the organization.
        </p>
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
                 <Button variant="primary" onClick={() => handleApplyClick(job)}>
                    Apply Now
                 </Button>
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
    </div>
  );
}
