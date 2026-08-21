import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { planAPI, trainerAPI } from '../services/api';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import OfferPopup from '../components/OfferPopup';

/* ── Tiny icon helpers ── */
const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const CheckIcon = () => <Icon d="M20 6L9 17l-5-5" />;
const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--yellow-primary)" stroke="var(--yellow-primary)" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

/* ── Static data ── */
const FEATURES = [
  { icon: '🏋️', title: 'State-of-the-Art Equipment', desc: 'Premium machines and free weights from top brands for every fitness level.' },
  { icon: '👨‍🏫', title: 'Expert Personal Trainers', desc: 'Certified trainers with years of experience to guide your fitness journey.' },
  { icon: '🧘', title: 'Diverse Class Programs', desc: 'From yoga and pilates to CrossFit and boxing — a class for every goal.' },
  { icon: '📊', title: 'Progress Tracking', desc: 'Advanced tracking tools to monitor your strength, cardio, and body metrics.' },
  { icon: '💊', title: 'Nutrition Supplements', desc: 'Premium supplements sourced from trusted brands available in-house.' },
  { icon: '🕐', title: 'Open 6AM – 10PM', desc: 'Extended hours to fit your schedule — morning, lunch, or evening workouts.' },
];

const TESTIMONIALS = [
  { name: 'Kasun Perera', role: 'Member since 2022', text: 'Fitness World completely transformed my lifestyle. Lost 18kg in 8 months with the guidance of an incredible trainer.', rating: 5, initials: 'KP' },
  { name: 'Dilani Silva', role: 'Member since 2023', text: 'The yoga and pilates classes are world-class. The atmosphere is motivating and the staff is always welcoming.', rating: 5, initials: 'DS' },
  { name: 'Ravin Fernando', role: 'Member since 2021', text: 'Best gym in Sri Lanka. The equipment is top quality and the personal training sessions are worth every penny.', rating: 5, initials: 'RF' },
];

const DEFAULT_PLANS = [
  { _id: '1', name: 'Starter', price: 2000, duration: 1, isPopular: false, features: ['Full gym access', 'Locker room', 'Cardio zone', '1 fitness assessment'], includesTrainer: false },
  { _id: '2', name: 'Pro', price: 5000, duration: 1, isPopular: true, features: ['Everything in Starter', '2 PT sessions/month', 'Group classes', 'Nutrition consultation', 'Progress tracking'], includesTrainer: true },
  { _id: '3', name: 'Elite', price: 14000, duration: 1, isPopular: false, features: ['Everything in Pro', 'Unlimited PT sessions', 'Priority booking', 'Supplement discounts', 'Body composition analysis', 'Dedicated trainer'], includesTrainer: true },
];

const DEFAULT_TRAINERS = [
  { _id: 'owner', name: 'MR. Harsha', specialization: 'Owner & Head Coach', experience: 15, bio: 'Founder of Fitness World with 15+ years of experience in fitness and strength training. Dedicated to transforming lives.', avatar: '/main_coach.jpeg', rating: 5.0 },
  { _id: '1', name: 'Ashan Mendis', specialization: 'Strength Training', experience: 8, bio: 'Former national powerlifter with 8+ years coaching experience.', avatar: '', rating: 4.9 },
  { _id: '2', name: 'Nisha Rajapaksa', specialization: 'Yoga', experience: 6, bio: 'Certified yoga instructor specializing in mindfulness and flexibility.', avatar: '', rating: 4.8 },
  { _id: '3', name: 'Tharaka Wijesiri', specialization: 'CrossFit', experience: 5, bio: 'CrossFit Level 2 trainer passionate about functional fitness.', avatar: '', rating: 4.7 },
];

/* ── Hero Slideshow Photos ── */
const HERO_PHOTOS = [
  '/gym-hero1.jpg',
  '/gym-hero2.jpg',
  '/gym-hero3.jpg',
  '/gym-hero4.webp',
  '/gym-hero5.webp',
  '/gym-hero6.webp',
];

/* ── Components ── */
function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_PHOTOS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 'var(--navbar-height)',
    }}>
      {/* Slideshow Background */}
      {HERO_PHOTOS.map((photo, index) => (
        <div key={index} style={{
          position: 'absolute', inset: 0,
          opacity: index === currentSlide ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          backgroundImage: `url(${photo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
          {/* Overlay for readability */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(5,5,5,0.9), rgba(5,5,5,0.4))',
          }} />
        </div>
      ))}

      {/* Background decorations */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(250,204,21,0.07) 0%, transparent 60%)',
      }} />
      <div style={{
        position: 'absolute', right: '-100px', top: '50%', transform: 'translateY(-50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(250,204,21,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Animated grid lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(250,204,21,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(250,204,21,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, padding: '60px 24px' }}>
        <div style={{ maxWidth: '700px' }}>
          <div className="badge badge-yellow" style={{ marginBottom: '24px', display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
            <span>🏆</span> Sri Lanka's #1 Premium Gym
          </div>
          <h1 style={{ fontSize: 'clamp(40px, 7vw, 76px)', fontWeight: 900, lineHeight: 1.05, marginBottom: '24px', fontFamily: 'Outfit' }}>
            Forge Your
            <br />
            <span className="gradient-text">Strongest</span>
            <br />
            Self Here.
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '520px', lineHeight: 1.7, marginBottom: '40px' }}>
            Join Fitness World — where elite equipment, expert trainers, and a powerful community push you beyond your limits every single day.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Start Your Journey →
            </Link>
            <a href="#plans" className="btn btn-outline btn-lg">
              View Plans
            </a>
          </div>
          {/* Stats */}
          <div style={{ display: 'flex', gap: '40px', marginTop: '56px', flexWrap: 'wrap' }}>
            {[['2,500+', 'Active Members'], ['50+', 'Expert Trainers'], ['15+', 'Years of Excellence'], ['98%', 'Member Satisfaction']].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--yellow-primary)', fontFamily: 'Outfit' }}>{val}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slideshow Indicators */}
      <div style={{
        position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '10px', zIndex: 2,
      }}>
        {HERO_PHOTOS.map((_, index) => (
          <button key={index} onClick={() => setCurrentSlide(index)} style={{
            width: '12px', height: '12px', borderRadius: '50%',
            border: 'none', cursor: 'pointer',
            background: index === currentSlide ? 'var(--yellow-primary)' : 'rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="section" style={{ background: 'var(--bg-secondary)' }} id="features">
      <div className="container">
        <h2 className="section-title">Why Choose <span>Fitness World?</span></h2>
        <p className="section-subtitle">Everything you need to reach your peak performance, all under one roof.</p>
        <div className="grid-3" style={{ gap: '20px' }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px', fontFamily: 'Outfit' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlansSection({ plans }) {
  return (
    <section className="section" style={{ background: 'var(--bg-primary)' }} id="plans">
      <div className="container">
        <h2 className="section-title">Membership <span>Plans</span></h2>
        <p className="section-subtitle">Choose the plan that fits your goals and budget. Upgrade anytime.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '960px', margin: '0 auto' }}>
          {plans.map((plan) => (
            <div key={plan._id} style={{
              background: plan.isPopular ? 'linear-gradient(135deg, rgba(250,204,21,0.1), rgba(245,158,11,0.05))' : 'var(--bg-card)',
              border: plan.isPopular ? '2px solid var(--yellow-primary)' : '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px 28px',
              position: 'relative',
              transition: 'var(--transition)',
              boxShadow: plan.isPopular ? 'var(--shadow-glow)' : 'none',
            }}>
              {plan.isPopular && (
                <div style={{
                  position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, var(--yellow-primary), var(--yellow-accent))',
                  color: '#000', padding: '4px 18px', borderRadius: '99px',
                  fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap',
                }}>MOST POPULAR</div>
              )}
              <div style={{ marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>{plan.duration} MONTH{plan.duration > 1 ? 'S' : ''}</div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit', marginBottom: '4px' }}>{plan.name}</h3>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '38px', fontWeight: 900, color: 'var(--yellow-primary)', fontFamily: 'Outfit' }}>
                  Rs.{plan.price.toLocaleString()}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>/mo</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                {plan.features?.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--yellow-primary)', flexShrink: 0 }}><CheckIcon /></span>
                    {f}
                  </div>
                ))}
              </div>
              <Link to="/register" className={`btn btn-full ${plan.isPopular ? 'btn-primary' : 'btn-outline'}`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrainersSection({ trainers }) {
  // Always add MR. Harsha at the top
  const MR_HARSHA = { _id: 'owner', name: 'MR. Harsha', specialization: 'Owner & Head Coach', experience: 15, bio: 'Founder of Fitness World with 15+ years of experience in fitness and strength training. Dedicated to transforming lives.', avatar: '/main_coach.jpeg', rating: 5.0 };
  const displayTrainers = [MR_HARSHA, ...trainers.filter(t => t._id !== 'owner')];

  return (
    <section className="section" style={{ background: 'var(--bg-secondary)' }} id="trainers">
      <div className="container">
        <h2 className="section-title">Meet Our <span>Expert Trainers</span></h2>
        <p className="section-subtitle">Certified professionals dedicated to your success.</p>
        <div className="grid-3" style={{ gap: '24px', maxWidth: '960px', margin: '0 auto' }}>
          {displayTrainers.map((trainer) => (
            <div key={trainer._id} className="card" style={{ textAlign: 'center' }}>
              {/* Avatar */}
              {trainer.avatar ? (
                <img src={trainer.avatar} alt={trainer.name} style={{
                  width: 80, height: 80, borderRadius: '50%',
                  objectFit: 'cover', margin: '0 auto 16px',
                  border: trainer._id === 'owner' ? '4px solid rgba(250,204,21,0.5)' : '3px solid rgba(250,204,21,0.3)',
                }} />
              ) : (
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--yellow-primary), var(--yellow-accent))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '28px', fontWeight: 900, color: '#000', fontFamily: 'Outfit',
                  border: '3px solid rgba(250,204,21,0.3)',
                }}>
                  {trainer.name.charAt(0)}
                </div>
              )}
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px', fontFamily: 'Outfit' }}>{trainer.name}</h3>
              <div className="badge badge-yellow" style={{ marginBottom: '12px' }}>{trainer.specialization}</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6, marginBottom: '12px' }}>{trainer.bio}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                {Array.from({ length: Math.floor(trainer.rating || 5) }).map((_, i) => <StarIcon key={i} />)}
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '4px' }}>{trainer.rating || 5.0}</span>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
                {trainer.experience} yrs experience
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        <h2 className="section-title">What Our <span>Members Say</span></h2>
        <p className="section-subtitle">Real results from real people who committed to the journey.</p>
        <div className="grid-3" style={{ gap: '24px' }}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card" style={{ position: 'relative' }}>
              <div style={{ fontSize: '48px', color: 'var(--yellow-primary)', opacity: 0.3, lineHeight: 1, marginBottom: '8px', fontFamily: 'Georgia' }}>"</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.8, marginBottom: '20px', fontStyle: 'italic' }}>{t.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--yellow-primary), var(--yellow-accent))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, color: '#000', fontSize: '15px', fontFamily: 'Outfit', flexShrink: 0,
                }}>{t.initials}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{t.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.role}</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '2px' }}>
                  {Array.from({ length: t.rating }).map((_, i) => <StarIcon key={i} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section className="section" style={{ background: 'var(--bg-secondary)' }} id="contact">
      <div className="container">
        <h2 className="section-title">Get In <span>Touch</span></h2>
        <p className="section-subtitle">Have a question? We'd love to hear from you. Send us a message.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', maxWidth: '900px', margin: '0 auto' }}>
          {/* Info */}
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px', fontFamily: 'Outfit' }}>Visit Us</h3>
            {[
              ['📍', 'Location', 'Rahula junction, Matara, Sri Lanka'],
              ['📞', 'Phone', '+94 71 805 5261'],
              ['✉️', 'Email', 'info@fitnessworld.lk'],
              ['🕐', 'Hours', 'Mon–: 5.00AM–1.00PM | Others day: 5.00AM–10.00PM'],
            ].map(([icon, label, val]) => (
              <div key={label} style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{label}</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{val}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sent && (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius)', padding: '12px 16px', color: '#4ADE80', fontSize: '14px' }}>
                ✓ Message sent! We'll get back to you soon.
              </div>
            )}
            <input className="form-input" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <input className="form-input" type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <textarea className="form-input" rows="4" placeholder="Your message..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required style={{ resize: 'vertical' }} />
            <button type="submit" className="btn btn-primary">Send Message →</button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border)', padding: '48px 0 24px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '40px' }}>
          <div>
            <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '22px', marginBottom: '12px' }}>
              Fitness <span style={{ color: 'var(--yellow-primary)' }}>World</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7 }}>
              Sri Lanka's premier fitness destination. Transforming lives through strength, discipline, and community.
            </p>
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Quick Links</div>
            {['Home', 'Plans', 'Trainers', 'Contact'].map(link => (
              <div key={link} style={{ marginBottom: '10px' }}>
                <a href={link === 'Home' ? '/' : `/#${link.toLowerCase()}`} style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--yellow-primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{link}</a>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Members</div>
            {[['Login', '/login'], ['Register', '/register'], ['Dashboard', '/dashboard']].map(([label, to]) => (
              <div key={label} style={{ marginBottom: '10px' }}>
                <a href={to} style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = 'var(--yellow-primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >{label}</a>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>Follow Us</div>
            {[['📘 Facebook', '#'], ['📸 Instagram', '#'], ['📺 YouTube', '#']].map(([label, href]) => (
              <div key={label} style={{ marginBottom: '10px' }}>
                <a href={href} style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none' }}>{label}</a>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            © {new Date().getFullYear()} Fitness World. All rights reserved.
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Made with 💪 in Sri Lanka
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Main Home Page ── */
export default function Home() {
  const [plans, setPlans] = useState(DEFAULT_PLANS);
  const [trainers, setTrainers] = useState(DEFAULT_TRAINERS);

  useEffect(() => {
    planAPI.getAll().then(r => { if (r.data.plans?.length) setPlans(r.data.plans); }).catch(() => {});
    trainerAPI.getAll().then(r => { if (r.data.trainers?.length) setTrainers(r.data.trainers); }).catch(() => {});
  }, []);

  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <PlansSection plans={plans} />
      <TrainersSection trainers={trainers} />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
      <FloatingWhatsApp />
      <OfferPopup />
    </div>
  );
}
