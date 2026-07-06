import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Clock, Calendar, CheckSquare, X } from 'lucide-react';
import api from '../../api/axiosInstance';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import './DashboardTheme.css';

const EmployeeDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('it');
  const [ticketDescription, setTicketDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleTicketSubmit = async () => {
    if (!ticketSubject || !ticketDescription) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.post('/helpdesk', {
        title: ticketSubject,
        category: ticketCategory,
        description: ticketDescription
      });
      showToast('Ticket submitted successfully', 'success');
      setIsModalOpen(false);
      // Reset form
      setTicketSubject('');
      setTicketCategory('it');
      setTicketDescription('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit ticket', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome back!</h1>
          <div className="header-controls">
            <Button variant="secondary" onClick={() => setIsModalOpen(true)}>Raise Ticket</Button>
            <Link to="/attendance" style={{ textDecoration: 'none' }}>
              <Button variant="primary">Clock In</Button>
            </Link>
          </div>
        </header>
        <div className="dashboard-grid">
          <Link to="/tasks" id="tasks" className="dashboard-card" style={{ gridColumn: 'span 2', textDecoration: 'none', display: 'block' }}>
            <h3>Recent Tasks</h3>
            <div className="task-list">
              <div className="task-item priority-high">
                <div>
                  <h4 style={{margin: '0 0 4px 0', color: '#fff'}}>Complete Q3 Compliance Training</h4>
                  <span style={{fontSize: '12px', color: 'rgba(255,255,255,0.5)'}}>Due: Today</span>
                </div>
                <span className="badge badge-high">High</span>
              </div>
              <div className="task-item priority-medium">
                <div>
                  <h4 style={{margin: '0 0 4px 0', color: '#fff'}}>Submit Expense Report</h4>
                  <span style={{fontSize: '12px', color: 'rgba(255,255,255,0.5)'}}>Due: Friday</span>
                </div>
                <span className="badge badge-medium">Medium</span>
              </div>
            </div>
          </Link>
          <Link to="/leave" className="dashboard-card glow-blue" style={{ textDecoration: 'none', display: 'block' }}>
            <h3>Leave Balance</h3>
            <p className="metric">12</p>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Days Available</p>
          </Link>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="kinetic-modal">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{margin: 0}}>Raise Support Ticket</h2>
              <X size={24} style={{cursor: 'pointer'}} onClick={() => setIsModalOpen(false)} />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input 
                type="text" 
                className="kinetic-input" 
                placeholder="E.g., VPN Access Issue" 
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select className="kinetic-input" value={ticketCategory} onChange={(e) => setTicketCategory(e.target.value)}>
                <option value="it">IT Support</option>
                <option value="hr">HR Inquiry</option>
                <option value="facilities">Facilities</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                className="kinetic-input" 
                rows="4" 
                placeholder="Describe the issue..."
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="modal-actions">
              <button className="secondary-action" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</button>
              <button className="primary-action" onClick={handleTicketSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
