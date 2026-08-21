import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storeOrderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import FileUploadPreview from '../components/FileUploadPreview';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const PRODUCT_IMAGE_MAP = {
  'Whey Protein': '/Whey Protein Isolate.webp',
  'Whey Protein Isolate': '/Whey Protein Isolate.webp',
  'Creatine Monohydrate': '/Micronized Creatine Monohydrate.jpg',
  'Micronized Creatine Monohydrate': '/Micronized Creatine Monohydrate.jpg',
  'Pre-Workout': '/Pre-Workout Energy Formula.webp',
  'Pre-Workout Energy Formula': '/Pre-Workout Energy Formula.webp',
  'Gym Gloves': '/Heavy Duty Weightlifting Gloves.webp',
  'Heavy Duty Weightlifting Gloves': '/Heavy Duty Weightlifting Gloves.webp',
  'Shaker Bottle': '/Leak-Proof Supplement Shaker.webp',
  'Leak-Proof Supplement Shaker': '/Leak-Proof Supplement Shaker.webp',
  'Fish Oil': '/Triple Strength Fish Oil.webp',
  'Triple Strength Fish Oil': '/Triple Strength Fish Oil.webp',
};

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    deliveryAddress: '',
    paymentSlip: null,
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('fw_cart') || '[]');
    setCart(savedCart);
    if (user) {
      setForm(prev => ({
        ...prev,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || '',
      }));
    }
  }, [user]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const removeItem = (productId) => {
    const newCart = cart.filter(item => item._id !== productId);
    setCart(newCart);
    localStorage.setItem('fw_cart', JSON.stringify(newCart));
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    const newCart = cart.map(item => item._id === productId ? { ...item, qty } : item);
    setCart(newCart);
    localStorage.setItem('fw_cart', JSON.stringify(newCart));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      addToast('Your cart is empty', 'error');
      return;
    }
    if (!form.paymentSlip || !form.paymentSlip.file) {
      addToast('Please upload your payment slip', 'error');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('items', JSON.stringify(cart.map(item => ({ product: item._id, qty: item.qty }))));
      formData.append('fullName', form.fullName);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('deliveryAddress', form.deliveryAddress);
      formData.append('paymentSlip', form.paymentSlip.file);

      await storeOrderAPI.create(formData);
      localStorage.setItem('fw_cart', '[]');
      addToast('Order placed successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ paddingTop: 'var(--navbar-height)' }}>
        <section className="section" style={{ background: 'var(--bg-primary)' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h1 className="section-title">Your <span>Cart</span> is Empty</h1>
            <p className="section-subtitle">Add some products to get started.</p>
            <Link to="/store" className="btn btn-primary btn-lg">Browse Store</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 'var(--navbar-height)' }}>
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <h1 className="section-title">Checkout</h1>
          <p className="section-subtitle">Complete your order below.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Form */}
            <div>
              {/* Bank Details */}
              <div className="card" style={{ marginBottom: '20px', background: 'rgba(250,204,21,0.05)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', fontFamily: 'Outfit' }}>Bank Transfer Details</h3>
                <div style={{ display: 'grid', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <div><strong>Bank:</strong> People's Bank</div>
                  <div><strong>Account Name:</strong> Fitness World (Pvt) Ltd</div>
                  <div><strong>Account Number:</strong> 1234567890</div>
                  <div><strong>Branch:</strong> Colombo 03</div>
                  <div><strong>Reference:</strong> Your Full Name</div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Full Name</label>
                  <input className="form-input" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Email</label>
                  <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Phone</label>
                  <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required placeholder="+94 77 123 4567" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Delivery Address</label>
                  <textarea className="form-input" rows="3" value={form.deliveryAddress} onChange={e => setForm({ ...form, deliveryAddress: e.target.value })} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>Upload Payment Slip</label>
                  <FileUploadPreview 
                    value={form.paymentSlip} 
                    onChange={(val) => setForm(prev => ({ ...prev, paymentSlip: val }))} 
                    accept="image/*,.pdf"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>
              </form>
            </div>

            {/* Cart Summary */}
            <div>
              <div className="card">
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', fontFamily: 'Outfit' }}>Order Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  {cart.map(item => {
                    const productImage = item.image || PRODUCT_IMAGE_MAP[item.name];
                    return (
                      <div key={item._id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {productImage && (
                          <img 
                            src={productImage} 
                            alt={item.name} 
                            style={{
                              width: '50px', height: '50px', objectFit: 'cover',
                              borderRadius: '6px',
                            }} 
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.name}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Rs.{item.price.toLocaleString()} x {item.qty}</div>
                        </div>
                        <input 
                          type="number" 
                          min="1" 
                          value={item.qty} 
                          onChange={e => updateQty(item._id, parseInt(e.target.value) || 1)} 
                          style={{ width: '60px', padding: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)' }}
                        />
                        <button onClick={() => removeItem(item._id)} style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none', fontSize: '18px' }}>×</button>
                      </div>
                    );
                  })}
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>Total</div>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--yellow-primary)', fontFamily: 'Outfit' }}>
                    Rs.{cartTotal.toLocaleString()}
                  </div>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <Link to="/store" style={{ color: 'var(--yellow-primary)', fontSize: '14px', textDecoration: 'none' }}>← Continue Shopping</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FloatingWhatsApp />
    </div>
  );
}
