import React, { useState } from 'react';
import { Activity, Ticket, Monitor, Shield, Search } from 'lucide-react';
import './DashboardTheme.css';

const ITDashboard = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h2 className="sidebar-title">IT Admin</h2>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active"><Activity size={18} style={{marginRight:'8px', verticalAlign:'middle'}}/> System Status</a>
          <a href="#" className="nav-item"><Ticket size={18} style={{marginRight:'8px', verticalAlign:'middle'}}/> Tickets</a>
          <a href="#" className="nav-item"><Monitor size={18} style={{marginRight:'8px', verticalAlign:'middle'}}/> Assets</a>
          <a href="#" className="nav-item"><Shield size={18} style={{marginRight:'8px', verticalAlign:'middle'}}/> Security</a>
        </nav>
      </div>
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>IT Operations Center</h1>
          <button className="primary-action">Provision Account</button>
        </header>
        <div className="dashboard-grid">
          <div className="dashboard-card summary-card glow-green">
            <h3>System Uptime</h3>
            <p className="metric success">99.99%</p>
          </div>
          <div className="dashboard-card summary-card glow-blue">
            <h3>Active Servers</h3>
            <p className="metric">124</p>
          </div>
          <div className="dashboard-card summary-card glow-purple">
            <h3>Avg Latency</h3>
            <p className="metric">42ms</p>
          </div>
          
          <div className="dashboard-card" style={{gridColumn: 'span 3'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h3>Asset Management</h3>
              <div className="header-controls">
                <Search size={18} color="rgba(255,255,255,0.5)" style={{position: 'absolute', marginLeft: '12px'}}/>
                <input 
                  type="text" 
                  className="kinetic-search" 
                  placeholder="Search assets..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{paddingLeft: '36px', width: '200px'}}
                />
              </div>
            </div>
            <table className="kinetic-table">
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Type</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>LPT-4921</td>
                  <td>MacBook Pro</td>
                  <td>Sarah Jenkins</td>
                  <td><span className="badge badge-low">Assigned</span></td>
                </tr>
                <tr>
                  <td>MNT-104</td>
                  <td>Dell UltraSharp</td>
                  <td>IT Inventory</td>
                  <td><span className="badge badge-info">Available</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="dashboard-card" style={{gridColumn: 'span 3'}}>
            <h3>Recent Security Logs</h3>
            <div className="alert-feed">
              <div className="alert-item warning">
                <div>
                  <p><strong>Failed Login Attempt</strong></p>
                  <span>10:42 AM | IP: 192.168.1.105 | User: admin_test</span>
                </div>
              </div>
              <div className="alert-item critical">
                <div>
                  <p><strong>Multiple Account Lockouts</strong></p>
                  <span>09:15 AM | IP: 10.0.0.52 | Severity: High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ITDashboard;
