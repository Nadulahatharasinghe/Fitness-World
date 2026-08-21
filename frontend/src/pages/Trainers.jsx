import React, { useEffect, useState } from 'react';
import { trainerAPI } from '../services/api';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--yellow-primary)" stroke="var(--yellow-primary)" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const DEFAULT_TRAINERS = [
  { _id: 'owner', name: 'MR. Harsha', specialization: 'Owner & Head Coach', experience: 15, bio: 'Founder of Fitness World with 15+ years of experience in fitness and strength training. Dedicated to transforming lives.', avatar: '/main_coach.jpeg', rating: 5.0 },
  { _id: '1', name: 'Ashan Mendis', specialization: 'Strength Training', experience: 8, bio: 'Former national powerlifter with 8+ years coaching experience.', avatar: '', rating: 4.9 },
  { _id: '2', name: 'Nisha Rajapaksa', specialization: 'Yoga', experience: 6, bio: 'Certified yoga instructor specializing in mindfulness and flexibility.', avatar: '', rating: 4.8 },
  { _id: '3', name: 'Tharaka Wijesiri', specialization: 'CrossFit', experience: 5, bio: 'CrossFit Level 2 trainer passionate about functional fitness.', avatar: '', rating: 4.7 },
  { _id: '4', name: 'Samanthi Perera', specialization: 'Nutrition', experience: 10, bio: 'Certified nutritionist helping members achieve their goals through diet.', avatar: '', rating: 4.9 },
];

export default function Trainers() {
  const [trainers, setTrainers] = useState(DEFAULT_TRAINERS);

  useEffect(() => {
    trainerAPI.getAll().then(r => { 
      if (r.data.trainers?.length) {
        // Always keep MR. Harsha at the top, then add the API trainers
        setTrainers([
          { _id: 'owner', name: 'MR. Harsha', specialization: 'Owner & Head Coach', experience: 15, bio: 'Founder of Fitness World with 15+ years of experience in fitness and strength training. Dedicated to transforming lives.', avatar: '/main_coach.jpeg', rating: 5.0 },
          ...r.data.trainers.filter(t => t._id !== 'owner')
        ]);
      }
    }).catch(() => {});
  }, []);

  return (
    <div style={{ paddingTop: 'var(--navbar-height)' }}>
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <h1 className="section-title">Our <span>Expert Trainers</span></h1>
          <p className="section-subtitle">Certified professionals dedicated to helping you reach your fitness goals.</p>
          <div className="grid-3" style={{ gap: '24px', maxWidth: '960px', margin: '0 auto' }}>
            {trainers.map((trainer) => (
              <div key={trainer._id} className="card" style={{ textAlign: 'center' }}>
                {/* Avatar */}
                {trainer.avatar ? (
                  <img src={trainer.avatar} alt={trainer.name} style={{
                    width: 100, height: 100, borderRadius: '50%',
                    objectFit: 'cover', margin: '0 auto 20px',
                    border: trainer._id === 'owner' ? '5px solid rgba(250,204,21,0.5)' : '4px solid rgba(250,204,21,0.3)',
                  }} />
                ) : (
                  <div style={{
                    width: 100, height: 100, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--yellow-primary), var(--yellow-accent))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontSize: '36px', fontWeight: 900, color: '#000', fontFamily: 'Outfit',
                    border: '4px solid rgba(250,204,21,0.3)',
                  }}>
                    {trainer.name.charAt(0)}
                  </div>
                )}
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px', fontFamily: 'Outfit' }}>{trainer.name}</h3>
                <div className="badge badge-yellow" style={{ marginBottom: '14px' }}>{trainer.specialization}</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>{trainer.bio}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '8px' }}>
                  {Array.from({ length: Math.floor(trainer.rating || 5) }).map((_, i) => <StarIcon key={i} />)}
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginLeft: '6px' }}>{trainer.rating || 5.0}</span>
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                  {trainer.experience} years experience
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <FloatingWhatsApp />
    </div>
  );
}
