import React, { useState, useEffect } from 'react';
import { Activity, Ticket, Monitor, Shield, Search, X } from 'lucide-react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './DashboardTheme.css';

const MOCK_METRICS = { uptime: '99.97%', activeServers: 12, avgLatency: '38ms' };
const MOCK_ASSETS = [
  { _id: 'ast-1', assetId: 'LAPTOP-001', assetType: 'Laptop',  assignedTo: { name: 'Aarav Sharma'  }, status: 'Assigned' },
  { _id: 'ast-2', assetId: 'LAPTOP-002', assetType: 'Laptop',  assignedTo: { name: 'Rohan Gupta'   }, status: 'Assigned' },
  { _id: 'ast-3', assetId: 'MOUSE-045',  assetType: 'Mouse',   assignedTo: { name: 'Sneha Reddy'   }, status: 'Assigned' },
  { _id: 'ast-4', assetId: 'LAPTOP-003', assetType: 'Laptop',  assignedTo: null,                       status: 'Available' },
  { _id: 'ast-5', assetId: 'MONITOR-12', assetType: 'Monitor', assignedTo: { name: 'Vikram Singh'  }, status: 'Assigned' },
  { _id: 'ast-6', assetId: 'LAPTOP-004', assetType: 'Laptop',  assignedTo: null,                       status: 'Available' },
  { _id: 'ast-7', assetId: 'KEYBOARD-8', assetType: 'Keyboard',assignedTo: { name: 'Arjun Kumar'   }, status: 'Assigned' },
];

const MOCK_ALERTS = [
  { _id: 'ital-1', message: 'Firewall rule updated successfully',       type: 'Security',    severity: 'Warning',  ip: '10.0.0.1',     createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { _id: 'ital-2', message: 'SSL certificate expires in 14 days',        type: 'Security',    severity: 'Critical', ip: '203.0.113.5',  createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
  { _id: 'ital-3', message: 'Database disk usage at 82%',                type: 'Performance', severity: 'Warning',  ip: '172.16.0.50',  createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString() },
];

const ITDashboard = () => {
  const [search, setSearch] = useState('');
  const [metrics, setMetrics] = useState(MOCK_METRICS);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [assets, setAssets] = useState(MOCK_ASSETS);
  
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  
  const [metricData, setMetricData] = useState({ uptime: '', activeServers: '', avgLatency: '' });
  const [alertData, setAlertData] = useState({ type: 'Security', message: '', severity: 'Warning', ip: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [metricsRes, alertsRes, assetsRes] = await Promise.allSettled([
        axios.get('/api/system/metrics', { withCredentials: true }),
        axios.get('/api/system/alerts', { withCredentials: true }),
        axios.get('/api/assets', { withCredentials: true })
      ]);
      
      if (metricsRes.status === 'fulfilled' && metricsRes.value.data.data) {
        const d = metricsRes.value.data.data;
        setMetrics(d.uptime ? d : MOCK_METRICS);
      }
      if (alertsRes.status === 'fulfilled' && alertsRes.value.data.data) {
        const d = alertsRes.value.data.data;
        setAlerts(d.length > 0 ? d : MOCK_ALERTS);
      }
      if (assetsRes.status === 'fulfilled' && assetsRes.value.data.data) {
        const d = assetsRes.value.data.data;
        setAssets(d.length > 0 ? d : MOCK_ASSETS);
      }
    } catch (error) {
      console.error('Error fetching IT data', error);
      // Mocks already set as initial state — no action needed
    }
  };

  const handleUpdateMetrics = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('/api/system/metrics', metricData, { withCredentials: true });
      if (res.data.success) {
        setMetrics(res.data.data);
        setShowMetricsModal(false);
      }
    } catch (error) {
      console.error('Failed to update metrics', error);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/system/alerts', alertData, { withCredentials: true });
      if (res.data.success) {
        setAlerts([res.data.data, ...alerts].slice(0, 10));
        setShowAlertModal(false);
        setAlertData({ type: 'Security', message: '', severity: 'Warning', ip: '' });
      }
    } catch (error) {
      console.error('Failed to create alert', error);
    }
  };

  const filteredAssets = assets.filter(a => 
    a.assetName?.toLowerCase().includes(search.toLowerCase()) || 
    a.assetId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>IT Operations Center</h1>
          <div style={{display: 'flex', gap: '10px'}}>
            <button className="primary-action" onClick={() => { setMetricData(metrics); setShowMetricsModal(true); }}>Manage Metrics</button>
            <button className="primary-action" onClick={() => setShowAlertModal(true)}>Log Alert</button>
          </div>
        </header>
        <div className="dashboard-grid">
          <div className="dashboard-card summary-card glow-green">
            <h3>System Uptime</h3>
            <p className="metric success">{metrics.uptime}</p>
          </div>
          <div className="dashboard-card summary-card glow-blue">
            <h3>Active Servers</h3>
            <p className="metric">{metrics.activeServers}</p>
          </div>
          <div className="dashboard-card summary-card glow-purple">
            <h3>Avg Latency</h3>
            <p className="metric">{metrics.avgLatency}</p>
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
                {filteredAssets.length > 0 ? (
                  filteredAssets.slice(0, 5).map(asset => (
                    <tr key={asset._id}>
                      <td>{asset.assetId}</td>
                      <td>{asset.assetType}</td>
                      <td>{asset.assignedTo ? asset.assignedTo.name : 'Unassigned'}</td>
                      <td>
                        <span className={`badge ${asset.status === 'Assigned' ? 'badge-low' : 'badge-info'}`}>
                          {asset.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{textAlign: 'center', opacity: 0.5}}>No assets found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="dashboard-card" style={{gridColumn: 'span 3'}}>
            <h3>Asset Distribution by Status</h3>
            {assets.length > 0 ? (
              <div style={{ width: '100%', height: 300, marginTop: '16px' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={assets.reduce((acc, curr) => {
                        const status = curr.status || 'Unknown';
                        const existing = acc.find(item => item.name === status);
                        if (existing) {
                          existing.value += 1;
                        } else {
                          acc.push({ name: status, value: 1 });
                        }
                        return acc;
                      }, [])}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {assets.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-secondary)', marginTop: '16px' }}>No assets available to chart.</p>
            )}
          </div>

          <div className="dashboard-card" style={{gridColumn: 'span 3'}}>
            <h3>Recent Security Logs</h3>
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

      {showMetricsModal && (
        <div className="modal-overlay">
          <div className="modal-content kinetic-modal">
            <div className="modal-header">
              <h2>Manage System Metrics</h2>
              <button onClick={() => setShowMetricsModal(false)} className="close-btn"><X size={20}/></button>
            </div>
            <form onSubmit={handleUpdateMetrics} className="modal-form">
              <div className="form-group">
                <label>Uptime</label>
                <input type="text" value={metricData.uptime} onChange={(e) => setMetricData({...metricData, uptime: e.target.value})} required className="kinetic-input" />
              </div>
              <div className="form-group">
                <label>Active Servers</label>
                <input type="number" value={metricData.activeServers} onChange={(e) => setMetricData({...metricData, activeServers: e.target.value})} required className="kinetic-input" />
              </div>
              <div className="form-group">
                <label>Avg Latency</label>
                <input type="text" value={metricData.avgLatency} onChange={(e) => setMetricData({...metricData, avgLatency: e.target.value})} required className="kinetic-input" />
              </div>
              <button type="submit" className="primary-action" style={{width: '100%', marginTop: '15px'}}>Update Metrics</button>
            </form>
          </div>
        </div>
      )}

      {showAlertModal && (
        <div className="modal-overlay">
          <div className="modal-content kinetic-modal">
            <div className="modal-header">
              <h2>Log System Alert</h2>
              <button onClick={() => setShowAlertModal(false)} className="close-btn"><X size={20}/></button>
            </div>
            <form onSubmit={handleCreateAlert} className="modal-form">
              <div className="form-group">
                <label>Alert Type</label>
                <select value={alertData.type} onChange={(e) => setAlertData({...alertData, type: e.target.value})} className="kinetic-input">
                  <option>Security</option>
                  <option>Performance</option>
                  <option>System</option>
                </select>
              </div>
              <div className="form-group">
                <label>Severity</label>
                <select value={alertData.severity} onChange={(e) => setAlertData({...alertData, severity: e.target.value})} className="kinetic-input">
                  <option>Critical</option>
                  <option>Warning</option>
                  <option>Info</option>
                </select>
              </div>
              <div className="form-group">
                <label>Message</label>
                <input type="text" value={alertData.message} onChange={(e) => setAlertData({...alertData, message: e.target.value})} required className="kinetic-input" />
              </div>
              <div className="form-group">
                <label>IP Address</label>
                <input type="text" value={alertData.ip} onChange={(e) => setAlertData({...alertData, ip: e.target.value})} className="kinetic-input" />
              </div>
              <button type="submit" className="primary-action" style={{width: '100%', marginTop: '15px'}}>Log Alert</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ITDashboard;
