import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Clock, Calendar, Briefcase, AlertCircle, X } from 'lucide-react';
import api from '../../api/axiosInstance';
import Button from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import './DashboardTheme.css';

const EmployeeDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('it');
  const [ticketDescription, setTicketDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();
  // Compatibility shim so existing showToast('msg', 'type') calls work
  const showToast = (message, type = 'info') => addToast({ type, message });

  const [leaveBalance, setLeaveBalance] = useState(0);
  const [recentTickets, setRecentTickets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [leaveRes, ticketsRes, projectsRes, attendanceRes] = await Promise.allSettled([
          api.get('/leaves/balance'),   // backend mounted at /api/leaves (not /api/leave)
          api.get('/helpdesk'),
          api.get('/projects'),
          api.get('/attendance/me')
        ]);
        
        if (leaveRes.status === 'fulfilled') {
          setLeaveBalance(leaveRes.value.data?.balance || leaveRes.value.data?.data?.balance || 0);
        }
        
        if (ticketsRes.status === 'fulfilled') {
          const tickets = Array.isArray(ticketsRes.value.data) ? ticketsRes.value.data : (ticketsRes.value.data?.data || []);
          setRecentTickets(tickets.slice(0, 3));
        }
        
        if (projectsRes.status === 'fulfilled') {
          const projs = Array.isArray(projectsRes.value.data) ? projectsRes.value.data : (projectsRes.value.data?.data || []);
          setProjects(projs.slice(0, 3));
        }
        
        if (attendanceRes.status === 'fulfilled') {
          const atts = Array.isArray(attendanceRes.value.data) ? attendanceRes.value.data : (attendanceRes.value.data?.data || []);
          if (atts.length > 0) {
            setAttendance(atts[0]); // get latest
          }
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleTicketSubmit = async () => {
    if (!ticketSubject || !ticketDescription) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.post('/helpdesk', {
        title: ticketSubject,
        category: ticketCategory,
        description: ticketDescription
      });
      showToast('Ticket submitted successfully', 'success');
      setIsModalOpen(false);
      // Reset form
      setTicketSubject('');
      setTicketCategory('it');
      setTicketDescription('');
      
      // Refresh tickets list
      const ticketsRes = await api.get('/helpdesk');
      const tickets = Array.isArray(ticketsRes.data) ? ticketsRes.data : (ticketsRes.data?.data || []);
      setRecentTickets(tickets.slice(0, 3));
      
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit ticket', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome back!</h1>
          <div className="header-controls">
            <Button variant="secondary" onClick={() => setIsModalOpen(true)}>Raise Ticket</Button>
            <Link to="/attendance" style={{ textDecoration: 'none' }}>
              <Button variant="primary">Clock In</Button>
            </Link>
          </div>
        </header>
        <div className="dashboard-grid">
          
          {/* Task Distribution Chart */}
          <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Briefcase size={20} className="text-indigo-400" />
              <h3 style={{ margin: 0 }}>Task Distribution</h3>
            </div>
            {isLoading ? (
              <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
            ) : projects.length > 0 ? (
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={projects.reduce((acc, curr) => {
                        const status = curr.status || 'Pending';
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
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {projects.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
               <p style={{ color: 'var(--color-text-secondary)' }}>No active projects.</p>
            )}
          </div>

          {/* Leave Balances Chart */}
          <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Calendar size={20} className="text-blue-400" />
              <h3 style={{ margin: 0 }}>Leave Balances</h3>
            </div>
            {isLoading ? (
               <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
            ) : (
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <BarChart data={[
                    { name: 'Total', days: 24 },
                    { name: 'Used', days: 24 - leaveBalance },
                    { name: 'Available', days: leaveBalance }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Bar dataKey="days" radius={[4, 4, 0, 0]}>
                      {
                        [0, 1, 2].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#64748b', '#f43f5e', '#3b82f6'][index % 3]} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="kinetic-modal">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{margin: 0}}>Raise Support Ticket</h2>
              <X size={24} style={{cursor: 'pointer'}} onClick={() => setIsModalOpen(false)} />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input 
                type="text" 
                className="kinetic-input" 
                placeholder="E.g., VPN Access Issue" 
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select className="kinetic-input" value={ticketCategory} onChange={(e) => setTicketCategory(e.target.value)} style={{ width: '100%', marginBottom: '16px' }}>
                <option value="it">IT Support</option>
                <option value="hr">HR Inquiry</option>
                <option value="facilities">Facilities</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                className="kinetic-input" 
                rows="4" 
                placeholder="Describe the issue..."
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                style={{ width: '100%' }}
              ></textarea>
            </div>
            <div className="modal-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button variant="primary" onClick={handleTicketSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
