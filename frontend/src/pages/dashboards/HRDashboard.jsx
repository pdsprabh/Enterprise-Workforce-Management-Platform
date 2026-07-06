import React, { useState } from 'react';
import { Search, Users, FileText, UserPlus, FileSignature } from 'lucide-react';
import './DashboardTheme.css';

const HRDashboard = () => {
  const [search, setSearch] = useState('');

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
            <p className="metric">1,245</p>
          </div>
          <div className="dashboard-card summary-card glow-green">
            <h3>Pending Leaves</h3>
            <p className="metric warning">14</p>
          </div>
          
          <div className="dashboard-card" style={{gridColumn: 'span 2'}}>
            <h3>Recruitment Pipeline</h3>
            <div className="pipeline-multi">
              <div className="pipeline-stage" style={{width: '40%', background: '#3B82F6'}} title="Applied"></div>
              <div className="pipeline-stage" style={{width: '30%', background: '#8B5CF6'}} title="Screening"></div>
              <div className="pipeline-stage" style={{width: '20%', background: '#F59E0B'}} title="Interview"></div>
              <div className="pipeline-stage" style={{width: '10%', background: '#10B981'}} title="Offer"></div>
            </div>
            <div className="pipeline-labels">
              <span>Applied (40)</span>
              <span>Screening (30)</span>
              <span>Interview (20)</span>
              <span>Offer (10)</span>
            </div>
          </div>

          <div className="dashboard-card" style={{gridColumn: 'span 2'}}>
            <h3>Today's Attendance</h3>
            <div className="pipeline-multi" style={{height: '24px', borderRadius: '4px'}}>
              <div className="pipeline-stage" style={{width: '85%', background: '#10B981', display: 'flex', alignItems:'center', paddingLeft: '8px', fontSize: '12px', fontWeight: 'bold'}}>85% Present</div>
              <div className="pipeline-stage" style={{width: '10%', background: '#F59E0B', display: 'flex', alignItems:'center', justifyContent: 'center', fontSize: '12px'}}>10% Leave</div>
              <div className="pipeline-stage" style={{width: '5%', background: '#EF4444'}}></div>
            </div>
            <p style={{marginTop: '12px', fontSize: '14px'}}>5% Absent</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
