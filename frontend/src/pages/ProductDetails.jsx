import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storeProductAPI } from '../services/api';
import { useToast } from '../components/Toast';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

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

const DEFAULT_PRODUCT = { _id: '1', name: 'Whey Protein', category: 'Protein', description: 'Premium whey protein for muscle growth.', price: 4500, stock: 10, image: '/Whey Protein Isolate.webp', benefits: ['Builds muscle', 'Fast absorption', 'Delicious flavors'], isActive: true };

export default function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(DEFAULT_PRODUCT);
  const [qty, setQty] = useState(1);
  const { addToast } = useToast();

  useEffect(() => {
    if (productId) {
      storeProductAPI.getById(productId).then(r => setProduct(r.data.product || DEFAULT_PRODUCT)).catch(() => setProduct(DEFAULT_PRODUCT));
    }
  }, [productId]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('fw_cart') || '[]');
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ ...product, qty });
    }
    localStorage.setItem('fw_cart', JSON.stringify(cart));
    addToast('Added to cart!', 'success');
  };

  return (
    <div style={{ paddingTop: 'var(--navbar-height)' }}>
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <Link to="/store" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px', textDecoration: 'none', marginBottom: '24px' }}>
            ← Back to Store
          </Link>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', maxWidth: '900px', margin: '0 auto' }}>
            {/* Image */}
            {(() => {
              const productImage = product.image || PRODUCT_IMAGE_MAP[product.name];
              return productImage ? (
                <img 
                  src={productImage} 
                  alt={product.name} 
                  style={{
                    height: '400px',
                    width: '100%',
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-lg)',
                  }} 
                />
              ) : (
                <div style={{
                  height: '400px', background: 'linear-gradient(135deg, rgba(250,204,21,0.1), rgba(250,204,21,0.02))',
                  borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px',
                }}>🏋️</div>
              );
            })()}
            
            {/* Info */}
            <div>
              <div className="badge badge-yellow" style={{ marginBottom: '12px', display: 'inline-block' }}>{product.category}</div>
              <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '12px', fontFamily: 'Outfit' }}>{product.name}</h1>
              <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--yellow-primary)', marginBottom: '20px', fontFamily: 'Outfit' }}>
                Rs.{product.price.toLocaleString()}
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>{product.description}</p>
              
              {/* Benefits */}
              {product.benefits?.length > 0 && (
                <div style={{ marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', fontFamily: 'Outfit' }}>Benefits</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {product.benefits.map((b, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--yellow-primary)' }}><CheckIcon /></span>
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Stock & Qty */}
              <div style={{ marginBottom: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </div>
              
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input 
                  type="number" 
                  min="1" 
                  max={product.stock} 
                  value={qty} 
                  onChange={e => setQty(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))} 
                  className="form-input" 
                  style={{ width: '100px' }}
                />
                <button onClick={addToCart} className="btn btn-primary btn-lg" disabled={product.stock <= 0} style={{ flex: 1 }}>
                  Add to Cart
                </button>
                <Link to="/checkout" className="btn btn-outline btn-lg">Checkout</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <FloatingWhatsApp />
    </div>
  );
}
