import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OfferPopup() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('fitnessWorldOfferSeen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('fitnessWorldOfferSeen', 'true');
    setShow(false);
  };

  const handleMemberships = () => {
    handleClose();
    navigate('/memberships');
  };

  const handleStore = () => {
    handleClose();
    navigate('/store');
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 9999
    }} onClick={handleClose}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(20,20,20,0.95), rgba(10,10,10,0.95))',
        border: '1px solid var(--border-yellow)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 36px',
        maxWidth: '520px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(250,204,21,0.15)',
        position: 'relative',
        animation: 'fadeIn 0.4s ease',
      }} onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          fontSize: '24px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }} onMouseOver={(e) => e.target.style.color = 'var(--yellow-primary)'}
          onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>
          ✕
        </button>

        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--yellow-primary), var(--yellow-accent))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '32px',
          boxShadow: '0 0 30px rgba(250,204,21,0.3)'
        }}>
          🏋️
        </div>

        <h2 style={{
          fontSize: '28px',
          fontWeight: 800,
          fontFamily: 'Outfit',
          marginBottom: '8px'
        }}>Welcome to <span style={{ color: 'var(--yellow-primary)' }}>Fitness World</span></h2>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '15px',
          marginBottom: '28px',
          lineHeight: 1.6
        }}>
          Start your fitness journey with our premium trainers, memberships, and supplements.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={handleMemberships} className="btn btn-primary">View Memberships</button>
          <button onClick={handleStore} className="btn btn-outline">Shop Supplements</button>
        </div>
      </div>
    </div>
  );
}