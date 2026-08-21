import React, { useEffect, useState, createContext, useContext } from 'react';
import { Link } from 'react-router-dom';
import { storeProductAPI } from '../services/api';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import CartDrawer from '../components/CartDrawer';
import ProductQuickView from '../components/ProductQuickView';
import { useToast } from '../components/Toast';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

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

const DEFAULT_PRODUCTS = [
  { _id: '1', name: 'Whey Protein', category: 'Protein', price: 4500, stock: 10, image: '/Whey Protein Isolate.webp', benefits: ['Builds muscle', 'Fast absorption', 'Delicious flavors'], isActive: true },
  { _id: '2', name: 'Creatine Monohydrate', category: 'Creatine', price: 1800, stock: 20, image: '/Micronized Creatine Monohydrate.jpg', benefits: ['Improves strength', 'Increases muscle volume', 'Affordable'], isActive: true },
  { _id: '3', name: 'Pre-Workout', category: 'Pre-workout', price: 3200, stock: 8, image: '/Pre-Workout Energy Formula.webp', benefits: ['Boosts energy', 'Enhances focus', 'Great pumps'], isActive: true },
  { _id: '4', name: 'Gym Gloves', category: 'Gym gloves', price: 1200, stock: 25, image: '/Heavy Duty Weightlifting Gloves.webp', benefits: ['Protects hands', 'Better grip', 'Comfortable'], isActive: true },
  { _id: '5', name: 'Shaker Bottle', category: 'Shakers', price: 800, stock: 30, image: '/Leak-Proof Supplement Shaker.webp', benefits: ['Leak-proof', 'Easy to clean', 'BPA-free'], isActive: true },
  { _id: '6', name: 'Fish Oil', category: 'Protein', price: 2500, stock: 15, image: '/Triple Strength Fish Oil.webp', benefits: ['Heart health', 'Joint support', 'Omega-3'], isActive: true },
];

function CartIcon({ count }) {
  return (
    <div style={{ position: 'relative' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
      {count > 0 && (
        <div style={{
          position: 'absolute', top: '-8px', right: '-8px',
          width: '18px', height: '18px', borderRadius: '50%',
          background: 'var(--yellow-primary)', color: '#000',
          fontSize: '11px', fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{count}</div>
      )}
    </div>
  );
}

export default function Store() {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fw_cart') || '[]');
    } catch {
      return [];
    }
  });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('fw_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    storeProductAPI.getAll().then(r => { if (r.data.products?.length) setProducts(r.data.products); }).catch(() => {});
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item => item._id === product._id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    addToast(`${product.name} added to cart!`, 'success');
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item._id !== productId));
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item._id === productId ? { ...item, qty } : item));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory && p.isActive;
  });

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, cartTotal }}>
      <div style={{ paddingTop: 'var(--navbar-height)' }}>
        {/* Header with search & filters */}
        <section className="section" style={{ background: 'var(--bg-primary)', paddingBottom: '16px' }}>
          <div className="container">
            <h1 className="section-title">Fitness <span>Store</span></h1>
            <p className="section-subtitle">Premium supplements and gym gear to support your journey.</p>

            {/* Search & Filters */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px', maxWidth: '700px' }}>
              <input 
                className="form-input" 
                placeholder="Search products..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                style={{ flex: 1, minWidth: '200px' }}
              />
              <select 
                className="form-input" 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                style={{ width: '180px' }}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {/* Cart button */}
              <button onClick={() => setIsCartOpen(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CartIcon count={cart.reduce((sum, i) => sum + i.qty, 0)} />
                View Cart
              </button>
            </div>

            {/* Products grid */}
            <div className="grid-3" style={{ gap: '20px' }}>
              {filteredProducts.map(product => {
                // Use the mapped image if product.image is empty
                const productImage = product.image || PRODUCT_IMAGE_MAP[product.name];
                return (
                  <div key={product._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Product image */}
                    {productImage ? (
                      <img 
                        src={productImage} 
                        alt={product.name} 
                        style={{
                          height: '160px', 
                          width: '100%',
                          objectFit: 'cover',
                          borderRadius: 'var(--radius)', 
                          marginBottom: '16px',
                        }} 
                      />
                    ) : (
                      <div style={{
                        height: '160px', background: 'linear-gradient(135deg, rgba(250,204,21,0.1), rgba(250,204,21,0.02))',
                        borderRadius: 'var(--radius)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '48px',
                      }}>🏋️</div>
                    )}
                    <div className="badge badge-yellow" style={{ marginBottom: '8px', alignSelf: 'flex-start' }}>{product.category}</div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px', fontFamily: 'Outfit' }}>{product.name}</h3>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--yellow-primary)', marginBottom: '12px', fontFamily: 'Outfit' }}>
                      Rs.{product.price.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                      <button onClick={() => setQuickViewProduct(product)} className="btn btn-outline btn-full">Quick View</button>
                      <button 
                        onClick={() => addToCart(product)} 
                        className="btn btn-primary btn-full"
                        disabled={product.stock <= 0}
                      >Add to Cart</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} setCart={setCart} />
      <ProductQuickView 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
        onAddToCart={(p) => { addToCart(p); setQuickViewProduct(null); }} 
      />
      <FloatingWhatsApp />
    </CartContext.Provider>
  );
}
