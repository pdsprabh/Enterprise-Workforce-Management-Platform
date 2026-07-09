import React, { useState, useEffect } from 'react';
import { AlertTriangle, Search, X } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import './DashboardTheme.css';
import ClockAction from '../../components/attendance/ClockAction';
import CreateTicketModal from '../../components/helpdesk/CreateTicketModal';
import { useToast } from '../../components/ui/Toast';
import Button from '../../components/ui/Button';

const MOCK_ORGANIZATIONS = [
  { _id: 'org-1', name: 'Acme Technologies',      industry: 'Technology',   status: 'Active',   createdAt: '2024-01-15T00:00:00.000Z' },
  { _id: 'org-2', name: 'FinEdge Capital',         industry: 'Finance',      status: 'Active',   createdAt: '2024-02-20T00:00:00.000Z' },
  { _id: 'org-3', name: 'HealthFirst Clinics',     industry: 'Healthcare',   status: 'Active',   createdAt: '2024-03-10T00:00:00.000Z' },
  { _id: 'org-4', name: 'BuildRight Construction', industry: 'Real Estate',  status: 'Inactive', createdAt: '2024-04-05T00:00:00.000Z' },
  { _id: 'org-5', name: 'EduSpark Learning',       industry: 'Education',    status: 'Active',   createdAt: '2024-05-18T00:00:00.000Z' },
  { _id: 'org-6', name: 'GreenLeaf Retail',        industry: 'Retail',       status: 'Active',   createdAt: '2024-06-01T00:00:00.000Z' },
];

const MOCK_ALERTS = [
  { _id: 'al-1', message: 'Unusual login attempt detected',    type: 'Security',    severity: 'Critical', ip: '192.168.4.22',  createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { _id: 'al-2', message: 'CPU usage > 90% on prod-server-2', type: 'Performance', severity: 'Warning',  ip: '10.0.0.45',    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { _id: 'al-3', message: 'Database backup completed',         type: 'System',      severity: 'Warning',  ip: 'N/A',          createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
];

const SuperAdminDashboard = () => {
  const [search, setSearch] = useState('');
  
  const [organizations, setOrganizations] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [orgData, setOrgData] = useState({ name: '', industry: 'Technology', status: 'Active' });
  const [createError, setCreateError] = useState('');
  const [creating, setCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { addToast } = useToast();

  const handleNewTicket = async (ticketData) => {
    try {
      await axiosInstance.post('/helpdesk', ticketData);
      addToast({ type: 'success', message: 'Ticket created successfully!' });
      setShowCreateModal(false);
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.message || 'Failed to create ticket' });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [orgRes, alertRes] = await Promise.allSettled([
        axiosInstance.get('/organizations'),
        axiosInstance.get('/system/alerts'),
      ]);
      
      if (orgRes.status === 'fulfilled' && orgRes.value.data.data) {
        const data = orgRes.value.data.data;
        setOrganizations(data.length > 0 ? data : MOCK_ORGANIZATIONS);
      } else {
        setOrganizations(MOCK_ORGANIZATIONS);
      }

      if (alertRes.status === 'fulfilled' && alertRes.value.data.data) {
        const data = alertRes.value.data.data;
        setAlerts(data.length > 0 ? data : MOCK_ALERTS);
      } else {
        setAlerts(MOCK_ALERTS);
      }
    } catch (error) {
      console.error('Error fetching super admin data', error);
      setOrganizations(MOCK_ORGANIZATIONS);
      setAlerts(MOCK_ALERTS);
    }
  };

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    if (!orgData.name.trim()) {
      setCreateError('Organization name is required.');
      return;
    }
    setCreating(true);
    setCreateError('');
    try {
      const res = await axiosInstance.post('/organizations', orgData);
      if (res.data.success) {
        setOrganizations(prev => [...prev, res.data.data]);
        setShowOrgModal(false);
        setOrgData({ name: '', industry: 'Technology', status: 'Active' });
      }
    } catch (error) {
      console.error('Failed to create organization', error);
      setCreateError(error.response?.data?.message || 'Failed to create tenant. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const filteredOrgs = organizations.filter(org => 
    org.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>Platform Administration</h1>
          <div className="header-controls" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button variant="secondary" onClick={() => setShowCreateModal(true)}>Raise Ticket</Button>
            <button className="primary-action" onClick={() => setShowOrgModal(true)}>Onboard New Tenant</button>
            <ClockAction />
          </div>
        </header>
        <div className="dashboard-grid">
          <div className="dashboard-card summary-card glow-blue">
            <h3>Active Tenants</h3>
            <p className="metric">{organizations.length}</p>
          </div>
          <div className="dashboard-card summary-card glow-green">
            <h3>Global Platform Uptime</h3>
            <p className="metric success">99.999%</p>
          </div>
          <div className="dashboard-card summary-card glow-purple">
            <h3>MRR</h3>
            <p className="metric">${(organizations.length * 1500).toLocaleString()}</p>
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
                  <th>Industry</th>
                  <th>Created At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrgs.length > 0 ? (
                  filteredOrgs.map(org => (
                    <tr key={org._id}>
                      <td>{org.name}</td>
                      <td>{org.industry}</td>
                      <td>{new Date(org.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${org.status === 'Active' ? 'badge-low' : 'badge-medium'}`}>
                          {org.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{textAlign: 'center', opacity: 0.5}}>No organizations found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="dashboard-card" style={{gridColumn: 'span 1'}}>
            <h3>Tenant Industry</h3>
            <div style={{ width: '100%', height: 250, marginTop: '16px' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={organizations.reduce((acc, curr) => {
                      const industry = curr.industry || 'Other';
                      const existing = acc.find(item => item.name === industry);
                      if (existing) {
                        existing.value += 1;
                      } else {
                        acc.push({ name: industry, value: 1 });
                      }
                      return acc;
                    }, [])}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {organizations.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-card" style={{gridColumn: 'span 3'}}>
            <h3>Tenant Status</h3>
            <div style={{ width: '100%', height: 250, marginTop: '16px' }}>
              <ResponsiveContainer>
                <BarChart data={[
                  { name: 'Active', count: organizations.filter(o => o.status === 'Active').length },
                  { name: 'Inactive', count: organizations.filter(o => o.status === 'Inactive').length }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" allowDecimals={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-card" style={{gridColumn: 'span 3'}}>
            <h3><AlertTriangle size={18} style={{marginRight:'8px', verticalAlign:'middle'}}/> System Alerts Feed</h3>
            <div className="alert-feed">
              {alerts.length > 0 ? alerts.map(alert => (
                <div key={alert._id} className={`alert-item ${alert.severity === 'Critical' ? 'critical' : 'warning'}`}>
                  <div>
                    <p><strong>{alert.message}</strong> - {alert.type}</p>
                    <span>{new Date(alert.createdAt).toLocaleTimeString()} | IP: {alert.ip || 'N/A'} | Severity: {alert.severity}</span>
                  </div>
                </div>
              )) : (
                <div style={{opacity: 0.5, marginTop: '10px'}}>No recent alerts</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showOrgModal && (
        <div className="modal-overlay">
          <div className="modal-content kinetic-modal">
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0 }}>Onboard New Tenant</h2>
              <button
                onClick={() => { setShowOrgModal(false); setCreateError(''); }}
                className="close-btn"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}
              >
                <X size={20}/>
              </button>
            </div>
            <form onSubmit={handleCreateOrg} className="modal-form">
              <div className="form-group">
                <label style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 6 }}>Organization Name *</label>
                <input
                  type="text"
                  value={orgData.name}
                  onChange={(e) => setOrgData({...orgData, name: e.target.value})}
                  required
                  className="kinetic-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  placeholder="e.g. Acme Technologies"
                />
              </div>
              <div className="form-group" style={{ marginTop: 14 }}>
                <label style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 6 }}>Industry *</label>
                <input
                  type="text"
                  value={orgData.industry}
                  onChange={(e) => setOrgData({...orgData, industry: e.target.value})}
                  required
                  className="kinetic-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  placeholder="e.g. Technology"
                />
              </div>
              <div className="form-group" style={{ marginTop: 14 }}>
                <label style={{ fontSize: 14, fontWeight: 500, display: 'block', marginBottom: 6 }}>Status</label>
                <select
                  value={orgData.status}
                  onChange={(e) => setOrgData({...orgData, status: e.target.value})}
                  className="kinetic-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {createError && (
                <p style={{ color: '#ef4444', fontSize: 13, marginTop: 12, marginBottom: 0 }}>
                  {createError}
                </p>
              )}

              <button
                type="submit"
                className="primary-action"
                style={{ width: '100%', marginTop: '20px' }}
                disabled={creating}
              >
                {creating ? 'Creating…' : 'Create Tenant'}
              </button>
            </form>
          </div>
        </div>
      )}

      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleNewTicket}
      />
    </div>
  );
};

export default SuperAdminDashboard;
