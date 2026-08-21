import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { planAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const DEFAULT_PLANS = [
  { _id: '1', name: 'Starter', price: 2000, duration: 1, isPopular: false, features: ['Full gym access', 'Locker room', 'Cardio zone', '1 fitness assessment'], includesTrainer: false },
  { _id: '2', name: 'Pro', price: 7500, duration: 1, isPopular: true, features: ['Everything in Starter', '2 PT sessions/month', 'Group classes', 'Nutrition consultation', 'Progress tracking'], includesTrainer: true },
  { _id: '3', name: 'Elite', price: 14000, duration: 1, isPopular: false, features: ['Everything in Pro', 'Unlimited PT sessions', 'Priority booking', 'Supplement discounts', 'Body composition analysis', 'Dedicated trainer'], includesTrainer: true },
];

export default function Memberships() {
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    planAPI.getAll().then(r => { if (r.data.plans?.length) setPlans(r.data.plans); }).catch(() => {});
  }, []);

  return (
    <div style={{ paddingTop: 'var(--navbar-height)' }}>
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <h1 className="section-title">Choose Your <span>Membership</span></h1>
          <p className="section-subtitle">Select the perfect plan to kickstart your fitness journey.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', maxWidth: '1000px', margin: '0 auto' }}>
            {plans.map((plan) => (
              <div key={plan._id} style={{
                background: plan.isPopular ? 'linear-gradient(135deg, rgba(250,204,21,0.12), rgba(245,158,11,0.06))' : 'var(--bg-card)',
                border: plan.isPopular ? '2px solid var(--yellow-primary)' : '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '36px 32px',
                position: 'relative',
                transition: 'var(--transition)',
                boxShadow: plan.isPopular ? 'var(--shadow-glow)' : 'none',
                display: 'flex', flexDirection: 'column',
              }}>
                {plan.isPopular && (
                  <div style={{
                    position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, var(--yellow-primary), var(--yellow-accent))',
                    color: '#000', padding: '6px 24px', borderRadius: '99px',
                    fontSize: '13px', fontWeight: 800, whiteSpace: 'nowrap',
                  }}>MOST POPULAR</div>
                )}
                <div style={{ marginBottom: '10px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 600 }}>{plan.duration} MONTH{plan.duration > 1 ? 'S' : ''}</div>
                <h3 style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Outfit', marginBottom: '6px' }}>{plan.name}</h3>
                <div style={{ marginBottom: '28px' }}>
                  <span style={{ fontSize: '44px', fontWeight: 900, color: 'var(--yellow-primary)', fontFamily: 'Outfit' }}>
                    Rs.{plan.price.toLocaleString()}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '16px' }}>/mo</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', flex: 1 }}>
                  {plan.features?.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--yellow-primary)', flexShrink: 0 }}><CheckIcon /></span>
                      {f}
                    </div>
                  ))}
                </div>
                <Link 
                  to={isLoggedIn ? `/apply-membership/${plan._id}` : '/register'} 
                  className={`btn btn-full btn-lg ${plan.isPopular ? 'btn-primary' : 'btn-outline'}`}
                >
                  {isLoggedIn ? 'Apply Now' : 'Join Now'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FloatingWhatsApp />
    </div>
  );
}
