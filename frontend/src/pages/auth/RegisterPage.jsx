import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useToast } from '../../components/ui/Toast';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;
    
    if (!name || !email || !password || !confirmPassword) {
      addToast({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    if (password !== confirmPassword) {
      addToast({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      addToast({ type: 'success', message: 'Registration successful' });
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
    <div className="auth-form-container">
      <h3 style={{ marginBottom: '24px', textAlign: 'center' }}>Request Platform Access</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Input
          label="Full Name"
          type="text"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="you@company.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <Button type="submit" fullWidth loading={loading} style={{ marginTop: '8px' }}>
          Submit Request
        </Button>
      </form>

      <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '500' }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
