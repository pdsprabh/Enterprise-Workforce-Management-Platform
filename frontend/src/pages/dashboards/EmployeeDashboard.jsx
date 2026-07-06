import React from 'react';
import './DashboardTheme.css';

const EmployeeDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h2 className="sidebar-title">Employee</h2>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">Overview</a>
          <a href="#" className="nav-item">Attendance</a>
          <a href="#" className="nav-item">Leave</a>
          <a href="#" className="nav-item">Tasks</a>
        </nav>
      </div>
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome back!</h1>
          <button className="primary-action">Clock In</button>
        </header>
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Recent Tasks</h3>
            <p>No active tasks.</p>
          </div>
          <div className="dashboard-card">
            <h3>Leave Balance</h3>
            <p>12 Days Available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
