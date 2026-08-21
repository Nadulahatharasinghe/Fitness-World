import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-height)' }}>
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <h1 className="section-title">Get In <span>Touch</span></h1>
          <p className="section-subtitle">Have questions? We're here to help!</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', maxWidth: '900px', margin: '0 auto' }}>
            {/* Info */}
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px', fontFamily: 'Outfit' }}>Contact Information</h3>
              {[
                ['📍', 'Location', 'Rahula junction, Matara, Sri Lanka'],
                ['📞', 'Phone', '+94 71 805 5261'],
                ['✉️', 'Email', 'info@fitnessworld.lk'],
                ['🕐', 'Hours', 'Mon–Fri: 5.00AM–1.00PM | Others day: 5.00AM–10.00PM'],
                ['💬', 'WhatsApp', '+94 71 805 5261'],
              ].map(([icon, label, val]) => (
                <div key={label} style={{ display: 'flex', gap: '14px', marginBottom: '20px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{label}</div>
                    {label === 'WhatsApp' ? (
                      <a 
                        href="https://wa.me/94718055261" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ fontSize: '14px', color: 'var(--yellow-primary)', textDecoration: 'none' }}
                      >
                        {val} (Chat Now)
                      </a>
                    ) : (
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{val}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sent && (
                  <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius)', padding: '12px 16px', color: '#4ADE80', fontSize: '14px' }}>
                    ✓ Message sent! We'll get back to you soon.
                  </div>
                )}
                <input className="form-input" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input className="form-input" type="email" placeholder="Your Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                <textarea className="form-input" rows="5" placeholder="Your Message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required style={{ resize: 'vertical' }} />
                <button type="submit" className="btn btn-primary btn-lg">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
