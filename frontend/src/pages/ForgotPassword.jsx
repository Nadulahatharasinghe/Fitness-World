import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useToast } from '../components/Toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await authAPI.forgotPassword(email.trim());
      setSent(true);
      addToast('OTP sent! Check your email (or server console in dev mode).', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to send OTP.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{
            width: 52, height: 52, borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--yellow-primary), var(--yellow-accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px', fontWeight: 900, fontSize: '22px', color: '#000', fontFamily: 'Outfit',
          }}>🔐</div>
          <div className="auth-logo-text">Reset <span>Password</span></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>
            We'll send a 6-digit OTP to your email
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading || !email.trim()}>
              {loading ? 'Sending OTP...' : 'Send OTP Code →'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', fontFamily: 'Outfit' }}>OTP Sent!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, marginBottom: '28px' }}>
              Check your inbox at <strong style={{ color: 'var(--yellow-primary)' }}>{email}</strong>.<br />
              In development mode, the OTP is also logged to the server console.
            </p>
            <Link to="/reset-password" className="btn btn-primary btn-full btn-lg">
              Enter OTP & Reset Password →
            </Link>
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--border)', marginTop: '28px', paddingTop: '20px', textAlign: 'center' }}>
          <Link to="/login" style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
