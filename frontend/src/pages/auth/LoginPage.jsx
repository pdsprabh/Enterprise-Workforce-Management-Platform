import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../components/ui/Toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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
        message: err.response?.data?.message || 'Invalid credentials' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h3 style={{ marginBottom: '24px', textAlign: 'center' }}>Sign in to your account</h3>
      
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
        
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" />
            <span style={{ color: 'var(--color-text-secondary)' }}>Remember me</span>
          </label>
          <Link to="/forgot-password" style={{ color: 'var(--color-primary)', fontWeight: '500' }}>
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={loading} style={{ marginTop: '8px' }}>
          Sign In
        </Button>
      </form>

      <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: '500' }}>
          Request access
        </Link>
      </p>
    </div>
  );
}
