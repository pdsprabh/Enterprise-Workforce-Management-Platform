import React, { useState, useEffect } from 'react';
import { Search, Users, FileText, UserPlus, FileSignature, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import './DashboardTheme.css';
import ClockAction from '../../components/attendance/ClockAction';
import CreateTicketModal from '../../components/helpdesk/CreateTicketModal';
import { useToast } from '../../components/ui/Toast';

const MOCK_RECRUITMENT = { applied: 14, screening: 8, interview: 5, offer: 3 };
const MOCK_ATTENDANCE = { present: 138, leave: 11, absent: 7 };

const HRDashboard = () => {
  const [search, setSearch] = useState('');
  
  const [employeesCount, setEmployeesCount] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [recruitment, setRecruitment] = useState(MOCK_RECRUITMENT);
  const [attendance, setAttendance] = useState(MOCK_ATTENDANCE);
  const [attendanceRoster, setAttendanceRoster] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
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
      const [empRes, leavesRes, recRes, attRes, jobsRes] = await Promise.allSettled([
        axiosInstance.get('/employees'),
        axiosInstance.get('/leaves'),
        axiosInstance.get('/recruitment/candidates'),
        axiosInstance.get('/attendance'),
        axiosInstance.get('/recruitment/jobs')
      ]);
      
      let loadedEmployees = [];
      if (empRes.status === 'fulfilled' && empRes.value.data.data) {
        loadedEmployees = empRes.value.data.data;
        setEmployeesCount(empRes.value.data.count || loadedEmployees.length);
      } else {
        setEmployeesCount(156);
      }

      if (leavesRes.status === 'fulfilled' && leavesRes.value.data.data) {
        const pending = leavesRes.value.data.data.filter(l => l.status === 'Pending').length;
        setPendingLeaves(pending || 8);
      } else {
        setPendingLeaves(8);
      }

      if (recRes.status === 'fulfilled' && recRes.value.data.data) {
        const candidates = recRes.value.data.data;
        const parsed = {
          applied:   candidates.filter(c => c.status === 'applied').length,
          screening: candidates.filter(c => c.status === 'screening').length,
          interview: candidates.filter(c => c.status === 'interview').length,
          offer:     candidates.filter(c => c.status === 'offer').length
        };
        const total = parsed.applied + parsed.screening + parsed.interview + parsed.offer;
        setRecruitment(total > 0 ? parsed : MOCK_RECRUITMENT);
      }

      if (jobsRes && jobsRes.status === 'fulfilled' && jobsRes.value.data.data) {
        setJobs(jobsRes.value.data.data.filter(j => j.status === 'active').slice(0, 3));
      }
      setJobsLoading(false);

      // Process real attendance data
      let todayAttendance = [];
      if (attRes.status === 'fulfilled' && attRes.value.data.data) {
         const todayStr = new Date().toISOString().split('T')[0];
         todayAttendance = attRes.value.data.data.filter(r => {
           if (!r.date) return false;
           return r.date.startsWith(todayStr) || new Date(r.date).toISOString().split('T')[0] === todayStr;
         });
      }

      let presentCount = 0;
      let absentCount = 0;
      let leaveCount = 0;

      const roster = loadedEmployees.map(emp => {
         // Sort by clockIn descending to get the latest record if multiple exist
         const empRecords = todayAttendance
           .filter(a => a.employee && a.employee._id === emp._id)
           .sort((a, b) => new Date(b.clockIn || 0) - new Date(a.clockIn || 0));
         
         const attRecord = empRecords[0];
         let status = 'Absent';
         let clockIn = null;
         let clockOut = null;
         
         if (attRecord) {
            if (attRecord.status === 'present' || attRecord.clockIn) {
                status = 'Present';
                if (attRecord.clockIn) {
                    clockIn = new Date(attRecord.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
                if (attRecord.clockOut) {
                    clockOut = new Date(attRecord.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
            } else if (attRecord.status === 'leave') {
                status = 'Leave';
            }
         }
         
         if (status === 'Present') presentCount++;
         else if (status === 'Leave') leaveCount++;
         else absentCount++;

         return {
            id: emp._id,
            employeeId: emp.employeeId,
            name: emp.name,
            status,
            clockIn,
            clockOut
         };
      });

      setAttendanceRoster(roster);
      if (loadedEmployees.length > 0) {
        setAttendance({ present: presentCount, leave: leaveCount, absent: absentCount });
      }

    } catch (error) {
      console.error('Error fetching HR data', error);
      setEmployeesCount(156);
      setPendingLeaves(8);
      setJobsLoading(false);
    }
  };

  const totalCandidates = recruitment.applied + recruitment.screening + recruitment.interview + recruitment.offer || 1;

  // Filter roster by search
  const filteredRoster = attendanceRoster.filter(r => 
    (r.name && r.name.toLowerCase().includes(search.toLowerCase())) || 
    (r.employeeId && r.employeeId.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>HR Operations</h1>
          <div className="header-controls" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
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
            <Button variant="secondary" onClick={() => setShowCreateModal(true)}>Raise Ticket</Button>
            <ClockAction />
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

          {/* Latest Job Openings */}
          <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={20} className="text-pink-400" />
                <h3 style={{ margin: 0 }}>Latest Job Openings</h3>
              </div>
              <Link to="/recruitment" style={{ fontSize: '14px', color: '#6366f1', textDecoration: 'none' }}>View All</Link>
            </div>
            {jobsLoading ? (
               <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
            ) : jobs.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {jobs.map(job => (
                  <div key={job._id || job.id} style={{ padding: '12px', backgroundColor: 'var(--color-surface-hover)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', color: 'var(--color-text-primary)' }}>{job.title}</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                          {job.department} • {job.location}
                        </p>
                      </div>
                      <Link to="/recruitment" style={{ textDecoration: 'none' }}>
                        <Button variant="secondary" size="sm" style={{ padding: '4px 12px', fontSize: '12px' }}>Manage</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-text-secondary)' }}>No active job openings.</p>
            )}
          </div>

          {/* Employee Attendance Roster */}
          <div className="dashboard-card glow-blue" style={{ gridColumn: '1 / -1', marginTop: '12px' }}>
            <h3>Employee Attendance Roster</h3>
            <div style={{ marginTop: '16px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>Emp ID</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>Clock In</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>Clock Out</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoster.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-secondary)' }}>
                        No employees found.
                      </td>
                    </tr>
                  ) : (
                    filteredRoster.map(row => (
                      <tr key={row.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '12px 16px', color: 'var(--color-text-primary)' }}>{row.employeeId}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--color-text-primary)', fontWeight: 500 }}>{row.name}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <Badge color={row.status === 'Present' ? 'success' : row.status === 'Leave' ? 'warning' : 'danger'}>
                            {row.status}
                          </Badge>
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>{row.clockIn || '—'}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)' }}>{row.clockOut || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
      
      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleNewTicket}
      />
    </div>
  );
};

export default HRDashboard;

