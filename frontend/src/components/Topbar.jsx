import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { getInitials } from '../utils/formatters';
import NotificationPanel from './notifications/NotificationPanel';
import './Topbar.css';

export default function Topbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const bellRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar__left">
        {/* Left padding spacer so the search doesn't overlap the floating menu toggle pill */}
        <div className="topbar__menu-spacer" aria-hidden="true" />

        <div className="topbar__search">
          <svg className="topbar__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Search..." aria-label="Global search" />
        </div>
      </div>

      <div className="topbar__right">
        {/* Theme toggle */}
        <button className="topbar__icon-btn" onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
          {theme === 'light' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>

        {/* Notifications bell */}
        <div className="topbar__notification-wrapper" ref={bellRef} style={{ position: 'relative' }}>
          <button
            className="topbar__icon-btn"
            title="Notifications"
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
            onClick={() => setShowNotifications(v => !v)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="topbar__badge" aria-hidden="true">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <NotificationPanel onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* User avatar + dropdown */}
        <div className="topbar__profile">
          <button
            className="topbar__avatar-btn"
            onClick={() => setShowDropdown(v => !v)}
            aria-expanded={showDropdown}
            aria-label="User menu"
          >
            <div className="avatar">{getInitials(user?.name)}</div>
          </button>

          {showDropdown && (
            <div className="topbar__dropdown">
              <div className="topbar__dropdown-header">
                <p className="topbar__dropdown-name">{user?.name || 'User'}</p>
                <p className="topbar__dropdown-email">{user?.email || 'user@example.com'}</p>
              </div>
              <div className="topbar__dropdown-menu">
                <button onClick={() => setShowDropdown(false)}>Profile</button>
                <button onClick={() => setShowDropdown(false)}>Settings</button>
                <button onClick={handleLogout} className="text-danger">Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
