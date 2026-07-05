import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../components/ui/Toast';
import './LoginPage.css';

/* ── Magnetic Input ───────────────────────────────────────── */
function MagneticInput({ label, ...props }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <div className="login-input-wrap">
      {label && <label className="login-input-label">{label}</label>}
      <div
        className="login-input-inner"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <input className="login-input" {...props} />

        {hovering && (
          <>
            <div
              className="login-input-beam login-input-beam--top"
              style={{
                background: `radial-gradient(30px circle at ${mouse.x}px 0px, #c7d1db 0%, transparent 70%)`,
              }}
            />
            <div
              className="login-input-beam login-input-beam--bottom"
              style={{
                background: `radial-gradient(30px circle at ${mouse.x}px 2px, #c7d1db 0%, transparent 70%)`,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

/* ── Social Icon Button ───────────────────────────────────── */
function SocialBtn({ href, children, label }) {
  return (
    <a href={href} className="login-social-btn" aria-label={label}>
      <span className="login-social-btn__shimmer" />
      <span className="login-social-btn__icon">{children}</span>
    </a>
  );
}

/* ── Main Login Page ──────────────────────────────────────── */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  /* Mouse-tracking glow for the left panel */
  const [glow, setGlow] = useState({ x: 0, y: 0 });
  const [glowing, setGlowing] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  function handlePanelMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    setGlow({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      addToast({ type: 'error', message: 'Please fill in all fields' });
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      addToast({ type: 'success', message: 'Login successful' });
      navigate('/dashboard');
    } catch (err) {
      addToast({
        type: 'error',
        message: err.response?.data?.message || 'Invalid credentials',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      {/* ── Aurora background ── */}
      <div className="login-aurora" aria-hidden="true" />

      <div className="login-card">

        {/* ── Left: Form panel ── */}
        <div
          className="login-left"
          onMouseMove={handlePanelMove}
          onMouseEnter={() => setGlowing(true)}
          onMouseLeave={() => setGlowing(false)}
        >
          {/* Radial glow blob */}
          <div
            className={`login-glow${glowing ? ' login-glow--visible' : ''}`}
            style={{ transform: `translate(${glow.x - 250}px, ${glow.y - 250}px)` }}
          />

          <div className="login-form-wrap">
            {/* Brand */}
            <div className="login-brand">
              <div className="login-brand__icon">W</div>
              <span className="login-brand__name">Workforce.io</span>
            </div>

            <h1 className="login-heading">Sign in</h1>
            <p className="login-subheading">Welcome back — sign in to your account</p>

            {/* Social icons */}
            <div className="login-socials">
              {/* LinkedIn */}
              <SocialBtn href="#" label="Sign in with LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.94 5a2 2 0 1 1-4-.002A2 2 0 0 1 6.94 5M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z" />
                </svg>
              </SocialBtn>

              {/* Instagram */}
              <SocialBtn href="#" label="Sign in with Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10A5 5 0 0 1 12 7m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                </svg>
              </SocialBtn>

              {/* Facebook */}
              <SocialBtn href="#" label="Sign in with Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396z" />
                </svg>
              </SocialBtn>
            </div>

            <p className="login-divider-text">or use your account</p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form" noValidate>
              <MagneticInput
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <MagneticInput
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

              <div className="login-form__row">
                <label className="login-remember">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="login-forgot">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? (
                  <span className="login-submit-btn__spinner" />
                ) : (
                  <span>Sign In</span>
                )}
                <span className="login-submit-btn__shimmer" />
              </button>
            </form>

            <p className="login-register-link">
              Don&apos;t have an account?{' '}
              <Link to="/register">Request access</Link>
            </p>
          </div>
        </div>

        {/* ── Right: Cover image panel ── */}
        <div className="login-right">
          <img
            src="https://images.pexels.com/photos/7102037/pexels-photo-7102037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Login cover"
            className="login-right__img"
          />
          <div className="login-right__overlay">
            <div className="login-right__text">
              <h2>Manage your workforce<br />smarter</h2>
              <p>One platform for attendance, payroll, performance, and more.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
