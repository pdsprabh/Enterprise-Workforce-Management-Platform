import React, { useState } from 'react';
import { Database, Server, Settings, Users, Search, CreditCard, AlertTriangle } from 'lucide-react';
import './DashboardTheme.css';

const SuperAdminDashboard = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <h2 className="sidebar-title">Super Admin</h2>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active"><Database size={18} style={{marginRight:'8px', verticalAlign:'middle'}}/> Tenants</a>
          <a href="#" className="nav-item"><Server size={18} style={{marginRight:'8px', verticalAlign:'middle'}}/> Infrastructure</a>
          <a href="#" className="nav-item"><Settings size={18} style={{marginRight:'8px', verticalAlign:'middle'}}/> Settings</a>
          <a href="#" className="nav-item"><Users size={18} style={{marginRight:'8px', verticalAlign:'middle'}}/> Global Users</a>
        </nav>
      </div>
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>Platform Administration</h1>
          <button className="primary-action">Onboard New Tenant</button>
        </header>
        <div className="dashboard-grid">
          <div className="dashboard-card summary-card glow-blue">
            <h3>Active Tenants</h3>
            <p className="metric">42</p>
          </div>
          <div className="dashboard-card summary-card glow-green">
            <h3>Global Platform Uptime</h3>
            <p className="metric success">99.999%</p>
          </div>
          <div className="dashboard-card summary-card glow-purple">
            <h3>MRR</h3>
            <p className="metric">$450K</p>
          </div>

          <div className="dashboard-card" style={{gridColumn: 'span 2'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h3>Active Tenants View</h3>
              <div className="header-controls">
                <Search size={18} color="rgba(255,255,255,0.5)" style={{position: 'absolute', marginLeft: '12px'}}/>
                <input 
                  type="text" 
                  className="kinetic-search" 
                  placeholder="Search tenants..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{paddingLeft: '36px', width: '200px'}}
                />
              </div>
            </div>
            <table className="kinetic-table">
              <thead>
                <tr>
                  <th>Tenant Name</th>
                  <th>Region</th>
                  <th>Users</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Acme Corp</td>
                  <td>US-East</td>
                  <td>1,500</td>
                  <td><span className="badge badge-low">Healthy</span></td>
                </tr>
                <tr>
                  <td>Globex Inc</td>
                  <td>EU-West</td>
                  <td>850</td>
                  <td><span className="badge badge-medium">Warning</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="dashboard-card" style={{gridColumn: 'span 1', display: 'flex', flexDirection: 'column'}}>
            <h3><CreditCard size={18} style={{marginRight:'8px', verticalAlign:'middle'}}/> Manage Billing</h3>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '12px', marginTop: '16px'}}>
              <div style={{background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)'}}>
                <p style={{fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px'}}>Next Invoice Run</p>
                <p style={{fontSize: '18px', fontWeight: 'bold'}}>Nov 1st, 2026</p>
              </div>
              <button className="secondary-action" style={{width: '100%', justifyContent: 'center'}}>View Invoices</button>
            </div>
          </div>

          <div className="dashboard-card" style={{gridColumn: 'span 3'}}>
            <h3><AlertTriangle size={18} style={{marginRight:'8px', verticalAlign:'middle'}}/> System Alerts Feed</h3>
            <div className="alert-feed">
              <div className="alert-item critical">
                <div>
                  <p><strong>Database CPU Spike</strong></p>
                  <span>DB Cluster US-East-1 experiencing 95% CPU utilization for &gt; 5 minutes.</span>
                </div>
                <button className="secondary-action">Acknowledge</button>
              </div>
              <div className="alert-item warning">
                <div>
                  <p><strong>Storage Capacity Warning</strong></p>
                  <span>S3 Bucket backups-eu nearing 85% capacity.</span>
                </div>
                <button className="secondary-action">Review</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
