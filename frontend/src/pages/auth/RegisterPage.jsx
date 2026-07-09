import { useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../components/ui/Toast';
import './LoginPage.css'; // Reusing the login page styles
import { useGoogleLogin } from '@react-oauth/google';
import { useLinkedIn } from 'react-linkedin-login-oauth2';

/* ── Magnetic Input ───────────────────────────────────────── */
function MagneticInput({ label, ...props }) {
  const [hovering, setHovering] = useState(false);
  const innerRef = useRef(null);

  function handleMouseMove(e) {
    if (!innerRef.current) return;
    const rect = innerRef.current.getBoundingClientRect();
    innerRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    innerRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }

  return (
    <div className="login-input-wrap">
      {label && <label className="login-input-label">{label}</label>}
      <div
        ref={innerRef}
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
                background: `radial-gradient(30px circle at var(--mouse-x, 0px) 0px, #c7d1db 0%, transparent 70%)`,
              }}
            />
            <div
              className="login-input-beam login-input-beam--bottom"
              style={{
                background: `radial-gradient(30px circle at var(--mouse-x, 0px) 2px, #c7d1db 0%, transparent 70%)`,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

/* ── Magnetic Select ──────────────────────────────────────── */
function MagneticSelect({ label, options, ...props }) {
  const [hovering, setHovering] = useState(false);
  const innerRef = useRef(null);

  function handleMouseMove(e) {
    if (!innerRef.current) return;
    const rect = innerRef.current.getBoundingClientRect();
    innerRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    innerRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }

  return (
    <div className="login-input-wrap">
      {label && <label className="login-input-label">{label}</label>}
      <div
        ref={innerRef}
        className="login-input-inner"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <select className="login-input" {...props} style={{ appearance: 'none', cursor: 'pointer' }}>
          <option value="" disabled>Select requested role...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {hovering && (
          <>
            <div
              className="login-input-beam login-input-beam--top"
              style={{
                background: `radial-gradient(30px circle at var(--mouse-x, 0px) 0px, #c7d1db 0%, transparent 70%)`,
              }}
            />
            <div
              className="login-input-beam login-input-beam--bottom"
              style={{
                background: `radial-gradient(30px circle at var(--mouse-x, 0px) 2px, #c7d1db 0%, transparent 70%)`,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

/* ── Social Icon Button ───────────────────────────────────── */
function SocialBtn({ onClick, children, label }) {
  return (
    <button type="button" onClick={onClick} className="login-social-btn" aria-label={label}>
      <span className="login-social-btn__shimmer" />
      <span className="login-social-btn__icon">{children}</span>
    </button>
  );
}

/* ── Main Register Page ───────────────────────────────────── */
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);

  const [glowing, setGlowing] = useState(false);
  const leftPanelRef = useRef(null);

  const { register, loginWithGoogle, loginWithLinkedIn } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setLoading(true);
      await loginWithGoogle(tokenResponse.access_token);
      addToast({ type: 'success', message: 'Google Sign-up successful' });
      navigate('/dashboard');
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.message || 'Google Auth Failed' });
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
  });

  const handleLinkedInSuccess = useCallback(async (code) => {
    try {
      setLoading(true);
      await loginWithLinkedIn(code);
      addToast({ type: 'success', message: 'LinkedIn Sign-up successful' });
      navigate('/dashboard');
    } catch (err) {
      addToast({ type: 'error', message: err.response?.data?.message || 'LinkedIn Auth Failed' });
    } finally {
      setLoading(false);
    }
  }, [loginWithLinkedIn, addToast, navigate]);

  const handleLinkedInError = useCallback((error) => {
    console.error(error);
    addToast({ type: 'error', message: 'LinkedIn Auth Failed' });
  }, [addToast]);

  const { linkedInLogin } = useLinkedIn({
    clientId: '86txy4kow730t4',
    redirectUri: `${window.location.origin}/linkedin`,
    scope: 'openid profile email',
    onSuccess: handleLinkedInSuccess,
    onError: handleLinkedInError,
  });

  function handlePanelMove(e) {
    if (!leftPanelRef.current) return;
    const rect = leftPanelRef.current.getBoundingClientRect();
    leftPanelRef.current.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
    leftPanelRef.current.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, role } = formData;
    
    if (!name || !email || !password || !confirmPassword || !role) {
      addToast({ type: 'error', message: 'Please fill in all fields including requested role' });
      return;
    }

    if (password !== confirmPassword) {
      addToast({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password, role });
      addToast({ type: 'success', message: 'Registration request submitted successfully' });
      navigate('/dashboard');
    } catch (err) {
      addToast({ 
        type: 'error', 
        message: err.response?.data?.message || 'Registration failed' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* ── Aurora background ── */}
      <div className="login-aurora" aria-hidden="true" />

      <div className="login-card">

        {/* ── Left: Form panel ── */}
        <div
          ref={leftPanelRef}
          className="login-left"
          onMouseMove={handlePanelMove}
          onMouseEnter={() => setGlowing(true)}
          onMouseLeave={() => setGlowing(false)}
        >
          {/* Radial glow blob */}
          <div
            className={`login-glow${glowing ? ' login-glow--visible' : ''}`}
            style={{ transform: `translate(calc(var(--glow-x, 0px) - 250px), calc(var(--glow-y, 0px) - 250px))` }}
          />

          <div className="login-form-wrap">
            {/* Brand */}
            <div className="login-brand">
              <div className="login-brand__icon">W</div>
              <span className="login-brand__name">Workforce.io</span>
            </div>

            <h1 className="login-heading">Request Access</h1>
            <p className="login-subheading">Apply for a role to manage your workforce</p>

            <div className="login-socials">
              <SocialBtn onClick={linkedInLogin} label="Sign up with LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.94 5a2 2 0 1 1-4-.002A2 2 0 0 1 6.94 5M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z" />
                </svg>
              </SocialBtn>

              <SocialBtn onClick={() => loginGoogle()} label="Sign up with Google">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a5.95 5.95 0 1 1 0-11.9 5.6 5.6 0 0 1 3.945 1.574l2.834-2.834a9.9 9.9 0 1 0-6.779 17.208 9.96 9.96 0 0 0 9.771-9.972c0-.528-.052-1.042-.143-1.542h-9.628z"/>
                </svg>
              </SocialBtn>
            </div>

            <p className="login-divider-text">or request access with email</p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form" noValidate>
              <div style={{ display: 'flex', gap: '10px' }}>
                <MagneticInput
                  placeholder="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <MagneticSelect
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  options={[
                    { value: 'Employee', label: 'Employee' },
                    { value: 'HR Manager', label: 'HR Manager' },
                    { value: 'IT Administrator', label: 'IT Administrator' },
                    { value: 'Organization Admin', label: 'Organization Admin' },
                    { value: 'Super Admin', label: 'Super Admin' },
                  ]}
                  required
                />
              </div>
              <MagneticInput
                placeholder="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <MagneticInput
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <MagneticInput
                  placeholder="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="login-submit-btn" disabled={loading} style={{ marginTop: '10px' }}>
                {loading ? (
                  <span className="login-submit-btn__spinner" />
                ) : (
                  <span>Sign Up</span>
                )}
                <span className="login-submit-btn__shimmer" />
              </button>
            </form>

            <p className="login-register-link">
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>

        {/* ── Right: Cover image panel ── */}
        <div className="login-right">
          <img
            src="https://images.pexels.com/photos/7102037/pexels-photo-7102037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Register cover"
            className="login-right__img"
          />
          <div className="login-right__overlay">
            <div className="login-right__text">
              <h2>Join Workforce.io<br />today</h2>
              <p>Streamline your operations and manage teams seamlessly.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
