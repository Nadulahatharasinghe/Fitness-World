import React from 'react';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

export default function About() {
  return (
    <div style={{ paddingTop: 'var(--navbar-height)' }}>
      {/* Hero */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <h1 className="section-title">About <span>Fitness World</span></h1>
          <p className="section-subtitle">
            Our mission is to create a space where everyone can unlock their full potential.
          </p>
        </div>
      </section>

      {/* Owner & Main Coach */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 className="section-title">Meet Our <span>Owner & Head Coach</span></h2>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
              <img src="/main_coach.jpeg" alt="MR. Harsha - Owner & Head Coach" style={{
                width: 160, height: 160, borderRadius: '50%',
                objectFit: 'cover', marginBottom: '20px',
                border: '5px solid rgba(250,204,21,0.4)',
              }} />
              <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: 'var(--yellow-primary)', fontFamily: 'Outfit' }}>MR. Harsha</h3>
              <div className="badge badge-yellow" style={{ marginBottom: '16px', display: 'inline-block' }}>Owner & Head Coach</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.8, maxWidth: '600px', margin: '0 auto' }}>
                MR. Harsha is the founder and driving force behind Fitness World. With over 15 years of experience in the fitness industry, he has dedicated his life to helping people transform their lives through fitness. His passion, expertise, and commitment to excellence have made Fitness World the trusted destination for fitness enthusiasts across Sri Lanka.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '20px', fontFamily: 'Outfit' }}>Our Story</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '20px' }}>
              Founded in 2009 by MR. Harsha, Fitness World started as a small gym with a big dream: to make fitness accessible and enjoyable for everyone. Over the years, we've grown into Sri Lanka's premier fitness destination, but our core values remain the same — dedication, community, and results.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '20px' }}>
              We believe that fitness is about more than just physical strength — it's about building confidence, discipline, and a support system that pushes you to be your best self every single day.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 className="section-title">Our <span>Values</span></h2>
          <div className="grid-3" style={{ gap: '24px', maxWidth: '960px', margin: '0 auto' }}>
            {[
              { title: 'Excellence', desc: 'We strive for excellence in everything we do, from our equipment to our customer service.' },
              { title: 'Community', desc: 'We foster a supportive, inclusive community where everyone feels welcome and motivated.' },
              { title: 'Integrity', desc: 'We operate with honesty, transparency, and respect for all our members and staff.' },
            ].map((v, i) => (
              <div key={i} className="card">
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: 'var(--yellow-primary)', fontFamily: 'Outfit' }}>{v.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FloatingWhatsApp />
    </div>
  );
}
