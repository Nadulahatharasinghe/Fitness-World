import React from 'react';

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

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--yellow-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function ProductQuickView({ product, onClose, onAddToCart }) {
  if (!product) return null;

  const productImage = product.image || PRODUCT_IMAGE_MAP[product.name];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 9999
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-yellow)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        maxWidth: '800px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '28px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        position: 'relative'
      }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          fontSize: '24px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          zIndex: 1
        }} onMouseOver={(e) => e.target.style.color = 'var(--yellow-primary)'}
          onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>
          ✕
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(250,204,21,0.08), rgba(250,204,21,0.02))',
          borderRadius: 'var(--radius)',
          minHeight: '300px'
        }}>
          {productImage ? (
            <img src={productImage} alt={product.name} style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', borderRadius: 'var(--radius)' }} />
          ) : (
            <span style={{ fontSize: '120px' }}>🏋️</span>
          )}
        </div>

        <div>
          <div className="badge badge-yellow" style={{ marginBottom: '12px' }}>{product.category}</div>
          <h3 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit', marginBottom: '8px' }}>{product.name}</h3>
          <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--yellow-primary)', marginBottom: '16px', fontFamily: 'Outfit' }}>
            Rs.{product.price.toLocaleString()}
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>{product.description}</p>

          {product.benefits && product.benefits.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>Benefits:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {product.benefits.map((benefit, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <CheckIcon /> {benefit}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ fontSize: '14px', color: product.stock > 0 ? 'var(--success)' : 'var(--error)', marginBottom: '20px' }}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </div>

          <button onClick={() => onAddToCart(product)} className="btn btn-primary btn-full" disabled={product.stock <= 0}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}