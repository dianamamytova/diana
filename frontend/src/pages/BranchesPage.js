import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

const BRANCH_PLACEHOLDER = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80';

const BranchesPage = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/branches')
      .then(res => setBranches(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFF8F6', marginTop: 64 }}>
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#78716c' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F6', marginTop: 64 }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#6F4E37', margin: '0 0 0.5rem' }}>
            Our Branches
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#78716c', margin: 0 }}>
            Find a CoffeeHub near you
          </p>
        </div>

        {/* Branch Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem',
          paddingBottom: '3rem',
        }}>
          {branches.map((branch) => (
            <Link
              to={`/branch/${branch.id}`}
              key={branch.id}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                borderRadius: 24,
                background: '#fff',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                border: '1px solid #e7e5e4',
              }}>
                {/* Image */}
                <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                  <img
                    src={branch.imageUrl || BRANCH_PLACEHOLDER}
                    alt={branch.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    background: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: '0.8rem',
                    fontWeight: 500,
                  }}>
                    {branch.city}
                  </span>
                </div>

                {/* Info */}
                <div style={{ padding: '1.25rem 1.5rem' }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#6F4E37',
                    margin: '0 0 0.5rem',
                  }}>
                    {branch.name}
                  </h3>
                  {branch.address && (
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#78716c',
                      margin: '0 0 0.35rem',
                      lineHeight: 1.5,
                    }}>
                      {branch.address}
                    </p>
                  )}
                  {branch.phone && (
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#78716c',
                      margin: 0,
                    }}>
                      {branch.phone}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BranchesPage;
