import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../components/ui/Toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { forgotPassword } from '../../api/authApi';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      addToast({ type: 'error', message: 'Please enter your email address' });
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
      addToast({ type: 'success', message: 'Password reset link sent!' });
    } catch (err) {
      addToast({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to send reset link' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h3 style={{ marginBottom: '8px', textAlign: 'center' }}>Reset Password</h3>
      
      {submitted ? (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
            We've sent a password reset link to <strong>{email}</strong>.
            Please check your inbox.
          </p>
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '500' }}>
            Return to sign in
          </Link>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" fullWidth loading={loading} style={{ marginTop: '8px' }}>
              Send Reset Link
            </Button>
          </form>

          <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            Remember your password?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '500' }}>
              Sign in
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
