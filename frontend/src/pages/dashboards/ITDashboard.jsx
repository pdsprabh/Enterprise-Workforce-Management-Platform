import React from 'react';
import './DashboardTheme.css';

const ITDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h2 className="sidebar-title">IT Admin</h2>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">System Status</a>
          <a href="#" className="nav-item">Tickets</a>
          <a href="#" className="nav-item">Assets</a>
          <a href="#" className="nav-item">Security</a>
        </nav>
      </div>
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>IT Operations Center</h1>
          <button className="primary-action">Provision Account</button>
        </header>
        <div className="dashboard-grid">
          <div className="dashboard-card summary-card">
            <h3>System Uptime</h3>
            <p className="metric success">99.99%</p>
          </div>
          <div className="dashboard-card">
            <h3>Active Support Tickets</h3>
            <p>3 Open, 1 In Progress</p>
          </div>
          <div className="dashboard-card">
            <h3>Recent Security Logs</h3>
            <p>No critical events.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ITDashboard;
