import { Outlet } from 'react-router-dom';
import './AuthLayout.css';

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-layout__container">
        <div className="auth-layout__logo">
          <div className="logo-icon">W</div>
          <h2>Workforce.io</h2>
        </div>
        <div className="auth-layout__content">
          <Outlet />
        </div>
        <p className="auth-layout__footer">
          &copy; {new Date().getFullYear()} Workforce.io. All rights reserved.
        </p>
      </div>
    </div>
  );
}
