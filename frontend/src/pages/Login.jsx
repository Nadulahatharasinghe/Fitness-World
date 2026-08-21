import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { authAPI } from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // 2FA state
  const [twoFAStep, setTwoFAStep] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [otp, setOtp] = useState('');

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Email or username is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const result = await login(form);
      if (result.twofaRequired) {
        setTempToken(result.tempToken);
        setTwoFAStep(true);
        addToast(result.message, 'info');
      } else {
        addToast('Welcome back! 💪', 'success');
        navigate(result.user?.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      addToast(msg, 'error');
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const handle2FA = async (e) => {
    e.preventDefault();
    if (!otp.trim()) return;
    setLoading(true);
    try {
      const { data } = await authAPI.verify2FA({ tempToken, otp });
      localStorage.setItem('fw_token', data.token);
      localStorage.setItem('fw_user', JSON.stringify(data.user));
      addToast('2FA verified! Welcome back 💪', 'success');
      navigate(data.user?.role === 'admin' ? '/admin' : '/dashboard');
      window.location.reload();
    } catch (err) {
      addToast(err.response?.data?.message || '2FA verification failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inp = (field) => ({
    className: `form-input${errors[field] ? ' error' : ''}`,
    value: form[field] || '',
    onChange: (e) => { setForm({ ...form, [field]: e.target.value }); setErrors({ ...errors, [field]: '' }); },
  });

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <img src="/gym_logo.jpeg" alt="Fitness World Logo" style={{
            width: 52, height: 52, borderRadius: '14px',
            objectFit: 'cover',
            margin: '0 auto 12px',
          }} />
          <div className="auth-logo-text">Fitness <span>World</span></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>
            {twoFAStep ? 'Enter your 2FA code' : 'Sign in to your account'}
          </p>
        </div>

        {!twoFAStep ? (
          <form onSubmit={handleSubmit} noValidate>
            {errors.general && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)', padding: '12px 16px', color: '#F87171', fontSize: '14px', marginBottom: '20px' }}>
                {errors.general}
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email or Username</label>
              <input {...inp('username')} type="text" placeholder="your@email.com or username" autoComplete="username" />
              {errors.username && <div className="form-error">{errors.username}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input {...inp('password')} type={showPassword ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password"
                  style={{ paddingRight: '48px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px' }}>
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>
            <div style={{ textAlign: 'right', marginBottom: '24px', marginTop: '-12px' }}>
              <Link to="/forgot-password" style={{ color: 'var(--yellow-primary)', fontSize: '13px', textDecoration: 'none' }}>
                Forgot Password?
              </Link>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <><span className="animate-spin" style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid #000', borderTopColor: 'transparent', borderRadius: '50%' }} /> Signing in...</> : 'Sign In →'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>or continue with</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            {/* Social buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
              <button type="button" className="btn btn-ghost" onClick={() => addToast('Google login requires GOOGLE_CLIENT_ID in .env', 'warning')}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => addToast('Facebook login requires FACEBOOK_APP_ID in .env', 'warning')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </div>

            <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--yellow-primary)', fontWeight: 600, textDecoration: 'none' }}>
                Join Fitness World
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handle2FA}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', textAlign: 'center', lineHeight: 1.7 }}>
              A 6-digit code has been sent to your email. Enter it below.
            </p>
            <div className="form-group">
              <label className="form-label">2FA Code</label>
              <input className="form-input" type="text" placeholder="000000" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6}
                style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px', fontFamily: 'Outfit', fontWeight: 700 }} />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading || otp.length < 6}>
              {loading ? 'Verifying...' : 'Verify Code →'}
            </button>
            <button type="button" className="btn btn-ghost btn-full" style={{ marginTop: '12px' }} onClick={() => { setTwoFAStep(false); setOtp(''); }}>
              ← Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
