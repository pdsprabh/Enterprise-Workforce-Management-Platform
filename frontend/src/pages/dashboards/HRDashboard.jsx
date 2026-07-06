import React from 'react';
import './DashboardTheme.css';

const HRDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h2 className="sidebar-title">HR Manager</h2>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">Overview</a>
          <a href="#" className="nav-item">Directory</a>
          <a href="#" className="nav-item">Recruitment</a>
          <a href="#" className="nav-item">Approvals</a>
        </nav>
      </div>
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>HR Operations</h1>
        </header>
        <div className="dashboard-grid">
          <div className="dashboard-card summary-card">
            <h3>Total Employees</h3>
            <p className="metric">1,245</p>
          </div>
          <div className="dashboard-card summary-card">
            <h3>Pending Leaves</h3>
            <p className="metric warning">14</p>
          </div>
          <div className="dashboard-card">
            <h3>Recruitment Pipeline</h3>
            <div className="pipeline-bar"><div className="pipeline-fill" style={{width: '60%'}}></div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
