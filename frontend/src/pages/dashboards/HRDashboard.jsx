import React, { useState, useEffect } from 'react';
import { Search, Users, FileText, UserPlus, FileSignature } from 'lucide-react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import './DashboardTheme.css';

const HRDashboard = () => {
  const [search, setSearch] = useState('');
  
  const [employeesCount, setEmployeesCount] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [recruitment, setRecruitment] = useState({ applied: 0, screening: 0, interview: 0, offer: 0 });
  
  // Hardcode attendance for now or try to parse
  const [attendance, setAttendance] = useState({ present: 85, leave: 10, absent: 5 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [empRes, leavesRes, recRes] = await Promise.allSettled([
        axios.get('/api/employees', { withCredentials: true }),
        axios.get('/api/leaves', { withCredentials: true }),
        axios.get('/api/recruitment/candidates', { withCredentials: true })
      ]);
      
      if (empRes.status === 'fulfilled' && empRes.value.data.count !== undefined) {
        setEmployeesCount(empRes.value.data.count);
      }
      if (leavesRes.status === 'fulfilled' && leavesRes.value.data.data) {
        const pending = leavesRes.value.data.data.filter(l => l.status === 'Pending').length;
        setPendingLeaves(pending);
      }
      if (recRes.status === 'fulfilled' && recRes.value.data.data) {
        const candidates = recRes.value.data.data;
        setRecruitment({
          applied: candidates.filter(c => c.status === 'Applied').length || 0,
          screening: candidates.filter(c => c.status === 'Screening').length || 0,
          interview: candidates.filter(c => c.status === 'Interviewing').length || 0,
          offer: candidates.filter(c => c.status === 'Offered').length || 0
        });
      }
    } catch (error) {
      console.error('Error fetching HR data', error);
    }
  };

  const totalCandidates = recruitment.applied + recruitment.screening + recruitment.interview + recruitment.offer || 1; // avoid /0

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>HR Operations</h1>
          <div className="header-controls">
            <Search size={20} color="rgba(255,255,255,0.5)" style={{position: 'absolute', marginLeft: '12px'}}/>
            <input 
              type="text" 
              className="kinetic-search" 
              placeholder="Quick search employee..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{paddingLeft: '40px', width: '250px'}}
            />
          </div>
        </header>
        <div className="dashboard-grid">
          <div className="dashboard-card summary-card glow-blue">
            <h3>Total Employees</h3>
            <p className="metric">{employeesCount}</p>
          </div>
          <div className="dashboard-card summary-card glow-green">
            <h3>Pending Leaves</h3>
            <p className="metric warning">{pendingLeaves}</p>
          </div>
          
          <div className="dashboard-card" style={{gridColumn: 'span 2'}}>
            <h3>Recruitment Pipeline</h3>
            <div style={{ width: '100%', height: 250, marginTop: '16px' }}>
              <ResponsiveContainer>
                <BarChart data={[
                  { name: 'Applied', candidates: recruitment.applied },
                  { name: 'Screening', candidates: recruitment.screening },
                  { name: 'Interview', candidates: recruitment.interview },
                  { name: 'Offer', candidates: recruitment.offer }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" allowDecimals={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Bar dataKey="candidates" radius={[4, 4, 0, 0]}>
                    {
                      [0, 1, 2, 3].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981'][index % 4]} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dashboard-card" style={{gridColumn: 'span 2'}}>
            <h3>Today's Attendance</h3>
            <div style={{ width: '100%', height: 250, marginTop: '16px' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Present', value: attendance.present },
                      { name: 'Leave', value: attendance.leave },
                      { name: 'Absent', value: attendance.absent }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
