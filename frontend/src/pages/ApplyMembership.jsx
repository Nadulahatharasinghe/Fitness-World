import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { planAPI, membershipPurchaseAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import FileUploadPreview from '../components/FileUploadPreview';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const DEFAULT_PLAN = { _id: '1', name: 'Starter', price: 3500, duration: 1, features: [] };

export default function ApplyMembership() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState(DEFAULT_PLAN);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    startDate: new Date().toISOString().split('T')[0],
    paymentSlip: null,
  });

  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || '',
      }));
    }
    if (planId) {
      planAPI.getById(planId).then(r => setPlan(r.data.plan || DEFAULT_PLAN)).catch(() => setPlan(DEFAULT_PLAN));
    }
  }, [planId, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.paymentSlip || !form.paymentSlip.file) {
      addToast('Please upload your payment slip', 'error');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('planId', plan._id);
      formData.append('fullName', form.fullName);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('startDate', form.startDate);
      formData.append('paymentSlip', form.paymentSlip.file);

      await membershipPurchaseAPI.apply(formData);
      addToast('Membership application submitted successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit application', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-height)' }}>
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <h1 className="section-title">Apply for <span>{plan.name}</span> Membership</h1>
          <p className="section-subtitle">Complete the form below to join {plan.name}.</p>
          
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {/* Plan Summary */}
            <div className="card" style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', fontFamily: 'Outfit' }}>Plan Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--yellow-primary)', fontFamily: 'Outfit' }}>{plan.name}</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{plan.duration} month(s)</div>
                </div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--yellow-primary)', fontFamily: 'Outfit' }}>
                  Rs.{plan.price.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="card" style={{ marginBottom: '24px', background: 'rgba(250,204,21,0.05)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', fontFamily: 'Outfit' }}>Bank Transfer Details</h3>
              <div style={{ display: 'grid', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <div><strong>Bank:</strong> People's Bank</div>
                <div><strong>Account Name:</strong> Fitness World (Pvt) Ltd</div>
                <div><strong>Account Number:</strong> 1234567890</div>
                <div><strong>Branch:</strong> Colombo 03</div>
                <div><strong>Reference:</strong> Your Full Name</div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Full Name</label>
                <input 
                  className="form-input" 
                  value={form.fullName} 
                  onChange={e => setForm({ ...form, fullName: e.target.value })} 
                  required 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Email</label>
                <input 
                  className="form-input" 
                  type="email" 
                  value={form.email} 
                  onChange={e => setForm({ ...form, email: e.target.value })} 
                  required 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Phone Number</label>
                <input 
                  className="form-input" 
                  value={form.phone} 
                  onChange={e => setForm({ ...form, phone: e.target.value })} 
                  required 
                  placeholder="+94 77 123 4567"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Start Date</label>
                <input 
                  className="form-input" 
                  type="date" 
                  value={form.startDate} 
                  onChange={e => setForm({ ...form, startDate: e.target.value })} 
                  required 
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Upload Payment Slip (JPG, PNG, PDF - Max 5MB)</label>
                <FileUploadPreview 
                  value={form.paymentSlip} 
                  onChange={(val) => setForm(prev => ({ ...prev, paymentSlip: val }))}
                  accept="image/*,.pdf"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ marginTop: '8px' }}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </section>
      <FloatingWhatsApp />
    </div>
  );
}
