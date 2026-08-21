import React, { useState } from 'react';

export default function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = useState(false);
  const whatsappUrl = "https://wa.me/94711701408?text=Hello%20Fitness%20World,%20I%20want%20to%20know%20about%20your%20gym%20memberships.";

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: '9998' }}>
      {/* Tooltip */}
      <div
        style={{
          position: 'absolute',
        bottom: '70px',
        right: 0,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-yellow)',
        padding: '8px 16px',
        borderRadius: 'var(--radius)',
        color: 'var(--text-primary)',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        whiteSpace: 'nowrap',
        opacity: showTooltip ? 1 : 0,
        transform: showTooltip ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.25s ease',
        pointerEvents: showTooltip ? 'auto' : 'none',
        zIndex: 9997
      }}>
        Chat with us
      </div>

      {/* Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onTouchStart={() => setShowTooltip(true)}
        onTouchEnd={() => setTimeout(() => setShowTooltip(false), 1500)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--yellow-primary), var(--yellow-accent))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 30px rgba(250,204,21,0.4)',
          border: '3px solid var(--bg-primary)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          textDecoration: 'none'
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="#000">
          <path d="M17.472 14.382c-.297-.148-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.781-1.48-1.742-1.653-2.037-.173-.297-.018-.458.13-.606.135-.135.298-.354.447-.531.148-.177.198-.296.297-.495.1-.198.05-.37-.025-.518-.075-.148-.67-1.61-.92-2.205-.247-.588-.495-.508-.67-.518h-.578c-.198 0-.52.074-.792.371-.272.296-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.486.71.306 1.262.489 1.694.626.712.227 1.36.195 1.879.118.571-.084 1.758-.717 2.006-1.412.247-.695.247-1.288.172-1.412-.073-.123-.27-.197-.567-.345l-.296-.172zM12.004 0C5.373 0 0 5.373 0 12.004c0 2.105.546 4.14 1.588 5.943L0 24l6.18-1.655c1.77.976 3.794 1.482 5.824 1.482h.01 0 0 0 .01 0 6.631 0 12.003-5.373 12.003-12.004C24.017 5.373 18.636 0 12.004 0zm0 21.601c-1.828 0-3.62-.495-5.188-1.433l-.373-.222-3.83 1.03 1.05-3.72-.241-.386A9.548 9.548 0 012.42-6.677c5.28-5.279 13.85-5.273 19.136.007 2.773 2.774 4.303 6.458 4.303 10.362 0 3.902-1.53 7.587-4.306 10.36z"/>
        </svg>
      </a>

      {/* Pulse animation ring */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(250,204,21,0.3) 0%, transparent 70%)',
        animation: 'pulse 1.5s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
    </div>
  );
}