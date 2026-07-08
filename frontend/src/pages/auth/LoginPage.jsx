import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../components/ui/Toast';
import './LoginPage.css';

import ReCAPTCHA from 'react-google-recaptcha';
import { useGoogleLogin } from '@react-oauth/google';
import { useMsal } from '@azure/msal-react';

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
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const recaptchaRef = useRef(null);
  const { instance } = useMsal();

  /* Mouse-tracking glow for the left panel */
  const [glow, setGlow] = useState({ x: 0, y: 0 });
  const [glowing, setGlowing] = useState(false);

  const { login, loginWithGoogle, loginWithMicrosoft } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  function handlePanelMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    setGlow({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setLoading(true);
      await loginWithGoogle(tokenResponse.access_token);
      addToast({ type: 'success', message: 'Google Login successful' });
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

  const handleMicrosoftLogin = async () => {
    try {
      setLoading(true);
      const loginResponse = await instance.loginPopup({ scopes: ["user.read"] });
      await loginWithMicrosoft(loginResponse.accessToken);
      addToast({ type: 'success', message: 'Microsoft Login successful' });
      navigate('/dashboard');
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Microsoft Auth Failed' });
    } finally {
      setLoading(false);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      addToast({ type: 'error', message: 'Please fill in all fields' });
      return;
    }
    if (!recaptchaToken) {
      addToast({ type: 'error', message: 'Please complete the reCAPTCHA' });
      return;
    }
    setLoading(true);
    try {
      await login(email, password, recaptchaToken);
      addToast({ type: 'success', message: 'Login successful' });
      navigate('/dashboard');
    } catch (err) {
      addToast({
        type: 'error',
        message: err.response?.data?.message || 'Invalid credentials',
      });
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
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
              <button type="button" onClick={() => loginGoogle()} className="login-social-btn" aria-label="Sign in with Google">
                <span className="login-social-btn__shimmer" />
                <span className="login-social-btn__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </span>
              </button>

              <button type="button" onClick={handleMicrosoftLogin} className="login-social-btn" aria-label="Sign in with Microsoft">
                <span className="login-social-btn__shimmer" />
                <span className="login-social-btn__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
                  </svg>
                </span>
              </button>
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

              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'}
                  onChange={(token) => setRecaptchaToken(token)}
                  theme="dark"
                />
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
