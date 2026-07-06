import React from 'react';
import './DashboardTheme.css';

const OrgAdminDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h2 className="sidebar-title">Org Admin</h2>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">Enterprise View</a>
          <a href="#" className="nav-item">Departments</a>
          <a href="#" className="nav-item">Projects</a>
          <a href="#" className="nav-item">Announcements</a>
        </nav>
      </div>
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>Organization Overview</h1>
          <button className="primary-action">New Announcement</button>
        </header>
        <div className="dashboard-grid">
          <div className="dashboard-card summary-card">
            <h3>Total Headcount</h3>
            <p className="metric">5,200</p>
          </div>
          <div className="dashboard-card summary-card">
            <h3>Active Projects</h3>
            <p className="metric">87</p>
          </div>
          <div className="dashboard-card">
            <h3>Department Overview</h3>
            <p>Engineering: 1200 | Sales: 800</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgAdminDashboard;
