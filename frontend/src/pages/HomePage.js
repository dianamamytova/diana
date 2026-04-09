import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

const BRANCH_IMAGES = {
  'The Bean Haven': '/images/branch-sf.jpg',
  'Roast & Relic': '/images/branch-london.jpg',
  'Sip & Solace': '/images/branch-tokyo.jpg',
};

const HomePage = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/branches')
      .then(res => setBranches(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#FFF8F6', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{
        marginTop: 64,
        minHeight: 600,
        background: `linear-gradient(90deg, rgba(42,23,15,0.85) 0%, rgba(42,23,15,0.4) 50%, rgba(42,23,15,0) 100%), url(/images/hero-bg.jpg) center/cover no-repeat`,
        backgroundColor: '#2c1810',
        borderRadius: '0 0 32px 32px',
        display: 'flex',
        alignItems: 'center',
        padding: '80px 48px',
        color: 'white',
      }}>
        <div style={{ maxWidth: 650 }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>
            Your Perfect<br />Coffee Experience
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#FFF1EC', marginTop: 20, lineHeight: 1.5, maxWidth: 500 }}>
            Discover artisanal roasts and cozy corners at a CoffeeHub near you. Crafted for the digital sommelier.
          </p>
          <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
            <Link to="/reservation" style={{
              background: '#553722', color: 'white', padding: '16px 32px', borderRadius: 12,
              fontWeight: 700, fontSize: 17, textDecoration: 'none',
              boxShadow: '0 8px 20px -5px rgba(42,23,15,0.3)',
            }}>Book a Table</Link>
            <Link to="/menu" style={{
              background: 'rgba(255,255,255,0.1)', color: 'white', padding: '16px 32px', borderRadius: 12,
              fontWeight: 700, fontSize: 17, textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)',
            }}>Explore Menu</Link>
          </div>
        </div>
      </section>

      {/* Branches */}
      <section style={{ padding: '96px 24px', maxWidth: 1232, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48 }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#1c1917' }}>Our Neighborhood Branches</h2>
            <p style={{ color: '#78716c', marginTop: 8, fontSize: 15 }}>
              Every branch is uniquely designed to reflect the soul of its city — stop commuting, start experiencing the CoffeeHub doctrine of excellence.
            </p>
          </div>
          <Link to="/branches" style={{ color: '#6F4E37', fontWeight: 600, fontSize: 14, textDecoration: 'none', whiteSpace: 'nowrap', marginTop: 8 }}>
            View All Locations →
          </Link>
        </div>

        {loading ? (
          <p style={{ color: '#78716c' }}>Loading branches...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {branches.slice(0, 3).map(branch => {
              const img = BRANCH_IMAGES[branch.name] || null;
              return (
                <div key={branch.id} style={{
                  background: 'white', borderRadius: 24, overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
                >
                  <div style={{ position: 'relative', height: 280 }}>
                    {img ? (
                      <img src={img} alt={branch.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #6F4E37, #A0785A)' }} />
                    )}
                    <span style={{
                      position: 'absolute', top: 16, left: 16,
                      background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
                      color: '#553722', padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                    }}>{branch.city}</span>
                  </div>
                  <div style={{ padding: 32 }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2A170F', marginBottom: 6 }}>{branch.name}</h3>
                    <p style={{ fontSize: 14, color: '#50453E', marginBottom: 20 }}>{branch.address}</p>
                    <Link to={`/branch/${branch.id}`} style={{
                      display: 'block', textAlign: 'center', padding: '12px 16px',
                      border: '1px solid #D4C3BA', borderRadius: 12, fontSize: 16, fontWeight: 700,
                      color: '#553722', textDecoration: 'none',
                    }}>View Details</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* The Ritual */}
      <section style={{ background: '#FFF1EC', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1232, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#1c1917' }}>The Ritual</h2>
          <p style={{ color: '#78716c', marginTop: 8, marginBottom: 60, fontSize: 15 }}>
            Three simple steps to transition from your screen to our coffee machine.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
            {[
              { icon: '🏠', title: 'Choose Branch', text: 'Select your preferred sanctuary from our global network of curated coffee spaces.' },
              { icon: '☕', title: 'Browse Menu', text: 'Explore our seasonal single-origin selections and artisan pastries crafted fresh daily.' },
              { icon: '📅', title: 'Reserve a Table', text: 'Book your spot instantly and skip the wait — your corner is waiting for your arrival.' },
            ].map((step, i) => (
              <div key={i}>
                <div style={{
                  width: 80, height: 80, margin: '0 auto 20px', background: 'rgba(212,165,116,0.15)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
                }}>{step.icon}</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#1c1917', marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: '#78716c', lineHeight: 1.6 }}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
