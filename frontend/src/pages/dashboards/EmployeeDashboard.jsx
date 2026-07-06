import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Clock, Calendar, CheckSquare, X } from 'lucide-react';
import './DashboardTheme.css';

const EmployeeDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome back!</h1>
          <div className="header-controls">
            <button className="secondary-action" onClick={() => setIsModalOpen(true)}>Raise Ticket</button>
            <button className="primary-action">Clock In</button>
          </div>
        </header>
        <div className="dashboard-grid">
          <div id="tasks" className="dashboard-card" style={{ gridColumn: 'span 2' }}>
            <h3>Recent Tasks</h3>
            <div className="task-list">
              <div className="task-item priority-high">
                <div>
                  <h4 style={{margin: '0 0 4px 0'}}>Complete Q3 Compliance Training</h4>
                  <span style={{fontSize: '12px', color: 'rgba(255,255,255,0.5)'}}>Due: Today</span>
                </div>
                <span className="badge badge-high">High</span>
              </div>
              <div className="task-item priority-medium">
                <div>
                  <h4 style={{margin: '0 0 4px 0'}}>Submit Expense Report</h4>
                  <span style={{fontSize: '12px', color: 'rgba(255,255,255,0.5)'}}>Due: Friday</span>
                </div>
                <span className="badge badge-medium">Medium</span>
              </div>
            </div>
          </div>
          <div className="dashboard-card glow-blue">
            <h3>Leave Balance</h3>
            <p className="metric">12</p>
            <p>Days Available</p>
          </div>
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
              <input type="text" className="kinetic-input" placeholder="E.g., VPN Access Issue" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select className="kinetic-input">
                <option>IT Support</option>
                <option>HR Inquiry</option>
                <option>Facilities</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="kinetic-input" rows="4" placeholder="Describe the issue..."></textarea>
            </div>
            <div className="modal-actions">
              <button className="secondary-action" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="primary-action" onClick={() => setIsModalOpen(false)}>Submit Ticket</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
