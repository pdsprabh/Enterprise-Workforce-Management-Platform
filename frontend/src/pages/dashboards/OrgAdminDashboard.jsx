import React, { useState, useEffect } from 'react';
import { Globe, Building, Briefcase, Bell, Search, Filter, X } from 'lucide-react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './DashboardTheme.css';

const OrgAdminDashboard = () => {
  const [search, setSearch] = useState('');
  
  const [employeesCount, setEmployeesCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [departments, setDepartments] = useState([]);
  
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [budgetData, setBudgetData] = useState({ budget: 0, budgetSpent: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empRes, projRes, deptRes] = await Promise.allSettled([
        axios.get('/api/employees', { withCredentials: true }),
        axios.get('/api/projects', { withCredentials: true }),
        axios.get('/api/departments', { withCredentials: true })
      ]);
      
      if (empRes.status === 'fulfilled' && empRes.value.data.count) {
        setEmployeesCount(empRes.value.data.count);
      }
      if (projRes.status === 'fulfilled' && projRes.value.data.count) {
        setProjectsCount(projRes.value.data.count);
      }
      if (deptRes.status === 'fulfilled' && deptRes.value.data.data) {
        setDepartments(deptRes.value.data.data);
      }
    } catch (error) {
      console.error('Error fetching org data', error);
    }
  };

  const handleUpdateBudget = async (e) => {
    e.preventDefault();
    if (!selectedDept) return;
    try {
      const res = await axios.put(`/api/departments/${selectedDept._id}`, budgetData, { withCredentials: true });
      if (res.data.success) {
        setDepartments(departments.map(d => d._id === selectedDept._id ? res.data.data : d));
        setShowBudgetModal(false);
        setSelectedDept(null);
      }
    } catch (error) {
      console.error('Failed to update department budget', error);
    }
  };

  const openBudgetModal = (dept) => {
    setSelectedDept(dept);
    setBudgetData({ budget: dept.budget || 0, budgetSpent: dept.budgetSpent || 0 });
    setShowBudgetModal(true);
  };

  const filteredDepartments = departments.filter(d => 
    d.departmentName?.toLowerCase().includes(search.toLowerCase())
  );
  
  const totalBudget = departments.reduce((acc, d) => acc + (d.budget || 0), 0);

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>Organization Overview</h1>
          <button className="primary-action">New Announcement</button>
        </header>
        <div className="dashboard-grid">
          <div className="dashboard-card summary-card glow-blue">
            <h3>Total Headcount</h3>
            <p className="metric">{employeesCount}</p>
          </div>
          <div className="dashboard-card summary-card glow-purple">
            <h3>Active Projects</h3>
            <p className="metric">{projectsCount}</p>
          </div>
          <div className="dashboard-card summary-card glow-green">
            <h3>Total Budget</h3>
            <p className="metric">${(totalBudget).toLocaleString()}</p>
          </div>

          <div className="dashboard-card" style={{gridColumn: 'span 3'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h3>Department Overview</h3>
              <div className="header-controls">
                <Search size={18} color="rgba(255,255,255,0.5)" style={{position: 'absolute', marginLeft: '12px'}}/>
                <input 
                  type="text" 
                  className="kinetic-search" 
                  placeholder="Search departments..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{paddingLeft: '36px', width: '250px'}}
                />
              </div>
            </div>
            <table className="kinetic-table">
              <thead>
                <tr>
                  <th>Department Name</th>
                  <th>Manager</th>
                  <th>Budget</th>
                  <th>Budget Spent</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map(dept => (
                    <tr key={dept._id}>
                      <td>{dept.departmentName}</td>
                      <td>{dept.manager ? dept.manager.name : 'N/A'}</td>
                      <td>${(dept.budget || 0).toLocaleString()}</td>
                      <td>${(dept.budgetSpent || 0).toLocaleString()}</td>
                      <td>
                        <button className="secondary-action" onClick={() => openBudgetModal(dept)} style={{padding: '4px 8px', fontSize: '12px'}}>
                          Manage Budget
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', opacity: 0.5}}>No departments found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="dashboard-card" style={{gridColumn: 'span 3'}}>
            <h3>Budget Utilization per Department</h3>
            {departments.length > 0 ? (
              <div style={{ width: '100%', height: 350, marginTop: '16px' }}>
                <ResponsiveContainer>
                  <BarChart data={departments.map(d => ({ name: d.departmentName, Budget: d.budget || 0, Spent: d.budgetSpent || 0 }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value}`} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} formatter={(value) => `$${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="Budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Spent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-secondary)', marginTop: '16px' }}>No department data available.</p>
            )}
          </div>

          <div className="dashboard-card" style={{gridColumn: 'span 3'}}>
            <h3>Global Announcements</h3>
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

      {showBudgetModal && (
        <div className="modal-overlay">
          <div className="modal-content kinetic-modal">
            <div className="modal-header">
              <h2>Manage Budget: {selectedDept?.departmentName}</h2>
              <button onClick={() => setShowBudgetModal(false)} className="close-btn"><X size={20}/></button>
            </div>
            <form onSubmit={handleUpdateBudget} className="modal-form">
              <div className="form-group">
                <label>Total Budget ($)</label>
                <input type="number" value={budgetData.budget} onChange={(e) => setBudgetData({...budgetData, budget: Number(e.target.value)})} required className="kinetic-input" />
              </div>
              <div className="form-group">
                <label>Budget Spent ($)</label>
                <input type="number" value={budgetData.budgetSpent} onChange={(e) => setBudgetData({...budgetData, budgetSpent: Number(e.target.value)})} required className="kinetic-input" />
              </div>
              <button type="submit" className="primary-action" style={{width: '100%', marginTop: '15px'}}>Update Budget</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgAdminDashboard;
