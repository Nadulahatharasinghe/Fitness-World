import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Register() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '', email: '', password: '', confirmPassword: '', phoneNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.username.trim() || form.username.length < 3) e.username = 'Username must be at least 3 characters';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      const result = await register(data);
      addToast('Welcome to Fitness World! 🏋️ Registration successful.', 'success');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      addToast(msg, 'error');
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className={`form-input${errors[name] ? ' error' : ''}`}
        type={type}
        placeholder={placeholder}
        value={form[name]}
        onChange={e => { setForm({ ...form, [name]: e.target.value }); setErrors({ ...errors, [name]: '' }); }}
        autoComplete={name}
      />
      {errors[name] && <div className="form-error">{errors[name]}</div>}
    </div>
  );

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    const score = [p.length >= 8, /[A-Z]/.test(p), /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;
    const levels = [
      { label: 'Weak', color: '#EF4444' },
      { label: 'Fair', color: '#F59E0B' },
      { label: 'Good', color: '#EAB308' },
      { label: 'Strong', color: '#22C55E' },
    ];
    return levels[score - 1] || levels[0];
  };
  const strength = passwordStrength();

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '90px', paddingBottom: '40px' }}>
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        <div className="auth-logo">
          <img src="/gym_logo.jpeg" alt="Fitness World Logo" style={{
            width: 52, height: 52, borderRadius: '14px',
            objectFit: 'cover',
            margin: '0 auto 12px',
          }} />
          <div className="auth-logo-text">Join Fitness <span>World</span></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>Create your account and start your fitness journey</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)', padding: '12px 16px', color: '#F87171', fontSize: '14px', marginBottom: '20px' }}>
              {errors.general}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            {field('firstName', 'First Name', 'text', 'John')}
            {field('lastName', 'Last Name', 'text', 'Doe')}
          </div>
          {field('username', 'Username', 'text', 'johndoe123')}
          {field('email', 'Email Address', 'email', 'john@example.com')}
          {field('phoneNumber', 'Phone Number (Optional)', 'tel', '+94 71 234 5678')}

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className={`form-input${errors.password ? ' error' : ''}`}
                type={showPass ? 'text' : 'password'}
                placeholder="Min 6 characters"
                value={form.password}
                onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                style={{ paddingRight: '48px' }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }}>
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
            {errors.password && <div className="form-error">{errors.password}</div>}
            {strength && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i <= [null,'Weak','Fair','Good','Strong'].indexOf(strength.label) ? strength.color : 'var(--border)' }} />
                ))}
                <span style={{ fontSize: '12px', color: strength.color, whiteSpace: 'nowrap' }}>{strength.label}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              className={`form-input${errors.confirmPassword ? ' error' : ''}`}
              type="password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={e => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }); }}
            />
            {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
            By registering, you agree to our Terms of Service and Privacy Policy.
          </p>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account 💪'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', marginTop: '20px' }}>
            Already a member?{' '}
            <Link to="/login" style={{ color: 'var(--yellow-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
