import React from 'react';
import { useNavigate } from 'react-router-dom';

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

export default function CartDrawer({ isOpen, onClose, cart, setCart }) {
  const navigate = useNavigate();

  const updateQty = (productId, newQty) => {
    if (newQty <= 0) {
      setCart(cart.filter(item => item._id !== productId));
    } else {
      setCart(cart.map(item => item._id === productId ? { ...item, qty: newQty } : item));
    }
  };

  const removeItem = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.7)',
          zIndex: 9998,
          cursor: 'pointer'
        }} onClick={onClose} />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: isOpen ? 0 : '-420px',
        width: '420px',
        maxWidth: '100%',
        height: '100%',
        background: 'var(--bg-card)',
        borderLeft: '1px solid var(--border)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        transition: 'right 0.35s ease'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'Outfit' }}>Shopping Cart</h3>
          <button onClick={onClose} style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '24px',
            cursor: 'pointer'
          }}>✕</button>
        </div>

        {/* Cart items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Your cart is empty</p>
              <button onClick={onClose} className="btn btn-primary">Browse Store</button>
            </div>
          ) : (
            cart.map((item) => {
              const productImage = item.image || PRODUCT_IMAGE_MAP[item.name];
              return (
                <div key={item._id} style={{
                  display: 'flex',
                  gap: '16px',
                  paddingBottom: '20px',
                  marginBottom: '20px',
                  borderBottom: '1px solid var(--border)'
                }}>
                  {productImage && (
                    <img src={productImage} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '6px' }}>{item.name}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      Rs.{item.price.toLocaleString()} x {item.qty}
                    </p>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={() => updateQty(item._id, item.qty - 1)} style={{
                          width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border)',
                          background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '16px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>−</button>
                        <span style={{ width: '30px', textAlign: 'center', fontSize: '14px' }}>{item.qty}</span>
                        <button onClick={() => updateQty(item._id, item.qty + 1)} style={{
                          width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--border)',
                          background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '16px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>+</button>
                      </div>
                      <button onClick={() => removeItem(item._id)} style={{
                        background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '18px'
                      }}>🗑️</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Total:</span>
              <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--yellow-primary)', fontFamily: 'Outfit' }}>
                Rs.{cartTotal.toLocaleString()}
              </span>
            </div>
            <button onClick={() => { onClose(); navigate('/checkout'); }} className="btn btn-primary btn-full btn-lg">
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}