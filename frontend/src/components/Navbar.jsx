import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/memberships', label: 'Memberships' },
    { to: '/trainers', label: 'Trainers' },
    { to: '/store', label: 'Store' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      height: 'var(--navbar-height)',
      background: scrolled ? 'rgba(5,5,5,0.97)' : 'rgba(5,5,5,0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: scrolled ? '1px solid var(--border-yellow)' : '1px solid rgba(255,255,255,0.05)',
      transition: 'all 0.3s ease',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/gym_logo.jpeg" alt="Fitness World Logo" style={{
            width: 38, height: 38, borderRadius: '10px',
            objectFit: 'cover',
          }} />
          <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '20px', color: '#fff' }}>
            Fitness <span style={{ color: 'var(--yellow-primary)' }}>World</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-nav">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} style={{
              color: location.pathname === l.to ? 'var(--yellow-primary)' : 'var(--text-secondary)',
              fontWeight: 500, fontSize: '14px', transition: 'color 0.2s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--yellow-primary)'}
            onMouseLeave={e => e.target.style.color = location.pathname === l.to ? 'var(--yellow-primary)' : 'var(--text-secondary)'}
            >{l.label}</Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="btn btn-outline btn-sm" style={{ display: 'none' }}>Admin</Link>
              )}
              <Link to={isAdmin ? '/admin' : '/dashboard'} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500, textDecoration: 'none',
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--yellow-primary), var(--yellow-accent))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#000', fontWeight: 700, fontSize: '13px', fontFamily: 'Outfit',
                  flexShrink: 0,
                }}>
                  {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.firstName}
                </span>
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join Now</Link>
            </>
          )}
          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer',
            display: 'none', padding: '4px',
          }} className="mobile-menu-btn">
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(10,10,10,0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-yellow)',
          padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} style={{
              color: 'var(--text-secondary)', fontWeight: 500, fontSize: '16px', padding: '8px 0',
              borderBottom: '1px solid var(--border)',
            }}>{l.label}</Link>
          ))}
          {isLoggedIn ? (
            <>
              <Link to={isAdmin ? '/admin' : '/dashboard'} style={{ color: 'var(--yellow-primary)', fontWeight: 600, fontSize: '16px' }}>
                {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-full">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-full">Login</Link>
              <Link to="/register" className="btn btn-primary btn-full">Join Now</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
