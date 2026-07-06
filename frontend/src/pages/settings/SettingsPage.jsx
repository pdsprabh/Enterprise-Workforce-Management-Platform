import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../components/ui/Toast';
import { ROLES } from '../../utils/constants';
import './SettingsPage.css';

export default function SettingsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Dummy form states
  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    timezone: 'UTC',
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    emailAlerts: true,
    pushNotifications: false,
    weeklyDigest: true,
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  });

  const [orgData, setOrgData] = useState({
    companyName: 'Acme Corp',
    supportEmail: 'support@acmecorp.com',
    maxEmployees: 1000,
  });

  const [hrData, setHrData] = useState({
    defaultLeaveAllowance: 20,
    probationPeriodMonths: 3,
  });
  
  const [itData, setItData] = useState({
    ssoEnabled: true,
    ssoProvider: 'Azure AD',
    sessionTimeoutMins: 60,
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotifToggle = (key) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecurityData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleOrgChange = (e) => {
    const { name, value } = e.target;
    setOrgData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleHrChange = (e) => {
    const { name, value } = e.target;
    setHrData(prev => ({ ...prev, [name]: value }));
  };

  const handleItChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsSaving(false);
      
      let message = 'Settings saved successfully!';
      if (activeTab === 'profile') message = 'Profile updated successfully!';
      else if (activeTab === 'security') message = 'Security settings updated!';
      else if (activeTab === 'notifications') message = 'Notification preferences saved!';
      else if (activeTab === 'organization') message = 'Organization details updated!';
      else if (activeTab === 'hr_policies') message = 'HR policies updated!';
      else if (activeTab === 'it_system') message = 'System settings updated!';
      
      addToast({
        type: 'success',
        message: message
      });
    }, 600);
  };

  // Determine available tabs based on role
  const tabs = [
    { id: 'profile', label: 'My Profile' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
  ];

  if (user?.role === ROLES.SUPER_ADMIN || user?.role === ROLES.ORG_ADMIN) {
    tabs.push({ id: 'organization', label: 'Organization Settings' });
  }
  
  if (user?.role === ROLES.SUPER_ADMIN || user?.role === ROLES.HR_MANAGER) {
    tabs.push({ id: 'hr_policies', label: 'HR & Leave Policies' });
  }

  if (user?.role === ROLES.SUPER_ADMIN || user?.role === ROLES.IT_ADMIN) {
    tabs.push({ id: 'it_system', label: 'System & Security (IT)' });
  }

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account settings and preferences.</p>
      </div>

      <div className="settings-layout">
        <aside className="settings-sidebar">
          <nav className="settings-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="settings-content">
          <form className="settings-form" onSubmit={handleSubmit}>
            
            {/* ── Profile Section ── */}
            {activeTab === 'profile' && (
              <section className="settings-section">
                <h2>Profile Information</h2>
                <div className="settings-grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" name="firstName" value={profileData.firstName} onChange={handleProfileChange} />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" name="lastName" value={profileData.lastName} onChange={handleProfileChange} />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" value={profileData.email} disabled className="disabled-input" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} />
                  </div>
                  <div className="form-group">
                    <label>Timezone</label>
                    <select name="timezone" value={profileData.timezone} onChange={handleProfileChange}>
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="EST">EST (Eastern Standard Time)</option>
                      <option value="PST">PST (Pacific Standard Time)</option>
                      <option value="IST">IST (Indian Standard Time)</option>
                    </select>
                  </div>
                </div>
              </section>
            )}

            {/* ── Security Section ── */}
            {activeTab === 'security' && (
              <section className="settings-section">
                <h2>Security Settings</h2>
                <div className="settings-grid">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" name="currentPassword" value={securityData.currentPassword} onChange={handleSecurityChange} />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" name="newPassword" value={securityData.newPassword} onChange={handleSecurityChange} />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" value={securityData.confirmPassword} onChange={handleSecurityChange} />
                  </div>
                </div>
                
                <div className="toggle-group mt-4">
                  <div className="toggle-info">
                    <strong>Two-Factor Authentication (2FA)</strong>
                    <p>Add an extra layer of security to your account.</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" name="twoFactorEnabled" checked={securityData.twoFactorEnabled} onChange={handleSecurityChange} />
                    <span className="slider round"></span>
                  </label>
                </div>
              </section>
            )}

            {/* ── Notifications Section ── */}
            {activeTab === 'notifications' && (
              <section className="settings-section">
                <h2>Notification Preferences</h2>
                <div className="toggle-list">
                  <div className="toggle-group">
                    <div className="toggle-info">
                      <strong>Email Alerts</strong>
                      <p>Receive important updates and notifications via email.</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={notificationPrefs.emailAlerts} onChange={() => handleNotifToggle('emailAlerts')} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  
                  <div className="toggle-group">
                    <div className="toggle-info">
                      <strong>Push Notifications</strong>
                      <p>Receive notifications in your browser.</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={notificationPrefs.pushNotifications} onChange={() => handleNotifToggle('pushNotifications')} />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div className="toggle-group">
                    <div className="toggle-info">
                      <strong>Weekly Digest</strong>
                      <p>Receive a weekly summary of your activity.</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" checked={notificationPrefs.weeklyDigest} onChange={() => handleNotifToggle('weeklyDigest')} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              </section>
            )}

            {/* ── Organization Settings (Admin) ── */}
            {activeTab === 'organization' && (
              <section className="settings-section">
                <h2>Organization Settings</h2>
                <div className="settings-grid">
                  <div className="form-group">
                    <label>Company Name</label>
                    <input type="text" name="companyName" value={orgData.companyName} onChange={handleOrgChange} />
                  </div>
                  <div className="form-group">
                    <label>Support Email</label>
                    <input type="email" name="supportEmail" value={orgData.supportEmail} onChange={handleOrgChange} />
                  </div>
                  <div className="form-group">
                    <label>Max Employees</label>
                    <input type="number" name="maxEmployees" value={orgData.maxEmployees} onChange={handleOrgChange} />
                  </div>
                </div>
              </section>
            )}

            {/* ── HR & Leave Policies ── */}
            {activeTab === 'hr_policies' && (
              <section className="settings-section">
                <h2>HR & Leave Policies</h2>
                <div className="settings-grid">
                  <div className="form-group">
                    <label>Default Annual Leave Allowance (Days)</label>
                    <input type="number" name="defaultLeaveAllowance" value={hrData.defaultLeaveAllowance} onChange={handleHrChange} />
                  </div>
                  <div className="form-group">
                    <label>Standard Probation Period (Months)</label>
                    <input type="number" name="probationPeriodMonths" value={hrData.probationPeriodMonths} onChange={handleHrChange} />
                  </div>
                </div>
              </section>
            )}

            {/* ── System & Security (IT) ── */}
            {activeTab === 'it_system' && (
              <section className="settings-section">
                <h2>System & Security Configuration</h2>
                <div className="settings-grid">
                  <div className="form-group">
                    <label>SSO Provider</label>
                    <select name="ssoProvider" value={itData.ssoProvider} onChange={handleItChange}>
                      <option value="Azure AD">Azure AD</option>
                      <option value="Okta">Okta</option>
                      <option value="Google Workspace">Google Workspace</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Session Timeout (Minutes)</label>
                    <input type="number" name="sessionTimeoutMins" value={itData.sessionTimeoutMins} onChange={handleItChange} />
                  </div>
                </div>
                
                <div className="toggle-group mt-4">
                  <div className="toggle-info">
                    <strong>Enable SSO Enforcement</strong>
                    <p>Require users to log in via SSO.</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" name="ssoEnabled" checked={itData.ssoEnabled} onChange={handleItChange} />
                    <span className="slider round"></span>
                  </label>
                </div>
              </section>
            )}

            <div className="settings-actions">
              <button type="submit" className="btn btn-primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
