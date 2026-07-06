import React from 'react';
import './DashboardTheme.css';

const SuperAdminDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h2 className="sidebar-title">Super Admin</h2>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">Platform Health</a>
          <a href="#" className="nav-item">Tenants</a>
          <a href="#" className="nav-item">Billing</a>
          <a href="#" className="nav-item">Global Settings</a>
        </nav>
      </div>
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>Platform Operations</h1>
          <button className="primary-action warning">Suspend Tenant</button>
        </header>
        <div className="dashboard-grid">
          <div className="dashboard-card summary-card">
            <h3>Total Organizations</h3>
            <p className="metric">142</p>
          </div>
          <div className="dashboard-card summary-card">
            <h3>Active Users</h3>
            <p className="metric">1.2M</p>
          </div>
          <div className="dashboard-card">
            <h3>System Health</h3>
            <p className="success-text">All systems operational.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
