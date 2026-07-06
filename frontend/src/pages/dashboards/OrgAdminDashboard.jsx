import React, { useState } from 'react';
import { Globe, Building, Briefcase, Bell, Search, Filter } from 'lucide-react';
import './DashboardTheme.css';

const OrgAdminDashboard = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h2 className="sidebar-title">Org Admin</h2>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active"><Globe size={18} style={{marginRight:'8px', verticalAlign:'middle'}}/> Enterprise View</a>
          <a href="#" className="nav-item"><Building size={18} style={{marginRight:'8px', verticalAlign:'middle'}}/> Departments</a>
          <a href="#" className="nav-item"><Briefcase size={18} style={{marginRight:'8px', verticalAlign:'middle'}}/> Projects</a>
          <a href="#" className="nav-item"><Bell size={18} style={{marginRight:'8px', verticalAlign:'middle'}}/> Announcements</a>
        </nav>
      </div>
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>Organization Overview</h1>
          <button className="primary-action">New Announcement</button>
        </header>
        <div className="dashboard-grid">
          <div className="dashboard-card summary-card glow-blue">
            <h3>Total Headcount</h3>
            <p className="metric">5,200</p>
          </div>
          <div className="dashboard-card summary-card glow-purple">
            <h3>Active Projects</h3>
            <p className="metric">87</p>
          </div>
          <div className="dashboard-card summary-card glow-green">
            <h3>Monthly Cost</h3>
            <p className="metric">$1.2M</p>
          </div>

          <div className="dashboard-card" style={{gridColumn: 'span 3'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h3>Department Overview</h3>
              <button className="secondary-action" style={{padding: '8px 16px', fontSize: '14px'}}><Filter size={16} style={{marginRight:'8px', verticalAlign:'middle'}}/> Filter</button>
            </div>
            <table className="kinetic-table">
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Headcount</th>
                  <th>Attendance Rate</th>
                  <th>Manager</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Engineering</td>
                  <td>1,200</td>
                  <td><span className="badge badge-low">92%</span></td>
                  <td>Sarah Connor</td>
                </tr>
                <tr>
                  <td>Sales</td>
                  <td>800</td>
                  <td><span className="badge badge-medium">85%</span></td>
                  <td>John Smith</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="dashboard-card" style={{gridColumn: 'span 3'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h3>Global Announcements</h3>
              <div className="header-controls">
                <Search size={18} color="rgba(255,255,255,0.5)" style={{position: 'absolute', marginLeft: '12px'}}/>
                <input 
                  type="text" 
                  className="kinetic-search" 
                  placeholder="Search announcements..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{paddingLeft: '36px', width: '250px'}}
                />
              </div>
            </div>
            <div className="alert-feed">
              <div className="alert-item warning">
                <div>
                  <p><strong>Scheduled Maintenance Window</strong></p>
                  <span>Starts: Saturday 12:00 AM | Affects: Payroll System</span>
                </div>
              </div>
              <div className="alert-item info" style={{borderLeft: '3px solid #3B82F6'}}>
                <div>
                  <p><strong>Q3 All-Hands Meeting</strong></p>
                  <span>Starts: Tomorrow 10:00 AM | Link: meet.google.com/xyz</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgAdminDashboard;
