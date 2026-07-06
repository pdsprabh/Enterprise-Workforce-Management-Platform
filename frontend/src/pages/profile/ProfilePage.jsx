import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getInitials } from '../../utils/formatters';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <div className="profile-page__header-bg"></div>
        <div className="profile-page__user-info">
          <div className="profile-page__avatar">
            {getInitials(user.name)}
          </div>
          <div className="profile-page__details">
            <h1 className="profile-page__name">{user.name}</h1>
            <p className="profile-page__role">{user.role}</p>
          </div>
        </div>
      </div>
      
      <div className="profile-page__content">
        <div className="profile-card">
          <h2 className="profile-card__title">Personal Information</h2>
          <div className="profile-card__grid">
            <div className="profile-field">
              <label>Full Name</label>
              <p>{user.name}</p>
            </div>
            <div className="profile-field">
              <label>Email Address</label>
              <p>{user.email}</p>
            </div>
            <div className="profile-field">
              <label>Mobile Number</label>
              <p>{user.mobile || 'Not provided'}</p>
            </div>
            <div className="profile-field">
              <label>Role</label>
              <p>{user.role}</p>
            </div>
            <div className="profile-field">
              <label>Joined Date</label>
              <p>{new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="profile-field">
              <label>Status</label>
              <p><span className={`status-badge ${user.isLocked ? 'status-locked' : 'status-active'}`}>{user.isLocked ? 'Locked' : 'Active'}</span></p>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h2 className="profile-card__title">Role Details</h2>
          <div className="profile-card__body">
            <p className="role-description">
              {user.role === 'Super Admin' && "You have full access to all modules and configurations across the entire platform. Please manage responsibly."}
              {user.role === 'Organization Admin' && "You can manage users, settings, and general configurations within your organization's scope."}
              {user.role === 'HR Manager' && "You have access to recruitment, performance, payroll, and employee records for HR operations."}
              {user.role === 'Employee' && "You have access to your personal details, attendance, leave requests, and assigned projects."}
              {user.role === 'IT Administrator' && "You can manage assets, helpdesk tickets, and system health monitoring."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
