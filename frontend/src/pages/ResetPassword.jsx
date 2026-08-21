import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useToast } from '../components/Toast';

export default function ResetPassword() {
  const [form, setForm] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.otp.trim() || form.otp.length !== 6) e.otp = 'Enter the 6-digit OTP';
    if (!form.newPassword || form.newPassword.length < 6) e.newPassword = 'Password must be at least 6 characters';
    if (form.newPassword !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await authAPI.resetPassword({ email: form.email, otp: form.otp, newPassword: form.newPassword });
      setDone(true);
      addToast('Password reset successful! You can now log in.', 'success');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      addToast(err.response?.data?.message || 'Reset failed. Check your OTP and try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontFamily: 'Outfit', fontSize: '24px', marginBottom: '12px' }}>Password Reset!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Redirecting you to login...</p>
        <Link to="/login" className="btn btn-primary btn-full">Go to Login</Link>
      </div>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{
            width: 52, height: 52, borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--yellow-primary), var(--yellow-accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px', fontWeight: 900, fontSize: '22px', color: '#000', fontFamily: 'Outfit',
          }}>🔑</div>
          <div className="auth-logo-text">New <span>Password</span></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>Enter your OTP and new password</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {[
            ['email', 'Email Address', 'email', 'your@email.com'],
            ['otp', '6-Digit OTP', 'text', '000000'],
          ].map(([name, label, type, placeholder]) => (
            <div className="form-group" key={name}>
              <label className="form-label">{label}</label>
              <input
                className={`form-input${errors[name] ? ' error' : ''}`}
                type={type}
                placeholder={placeholder}
                value={form[name]}
                maxLength={name === 'otp' ? 6 : undefined}
                style={name === 'otp' ? { textAlign: 'center', fontSize: '20px', letterSpacing: '6px', fontFamily: 'Outfit', fontWeight: 700 } : {}}
                onChange={e => { setForm({ ...form, [name]: e.target.value }); setErrors({ ...errors, [name]: '' }); }}
              />
              {errors[name] && <div className="form-error">{errors[name]}</div>}
            </div>
          ))}

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              className={`form-input${errors.newPassword ? ' error' : ''}`}
              type="password" placeholder="Min 6 characters"
              value={form.newPassword}
              onChange={e => { setForm({ ...form, newPassword: e.target.value }); setErrors({ ...errors, newPassword: '' }); }}
            />
            {errors.newPassword && <div className="form-error">{errors.newPassword}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              className={`form-input${errors.confirmPassword ? ' error' : ''}`}
              type="password" placeholder="Repeat new password"
              value={form.confirmPassword}
              onChange={e => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }); }}
            />
            {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password →'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/forgot-password" style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none' }}>
            ← Resend OTP
          </Link>
        </div>
      </div>
    </div>
  );
}
