import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

const HomePage = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await api.get('/api/branches');
        setBranches(response.data);
      } catch (error) {
        console.error('Failed to fetch branches:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  return (
    <div className="page-bg">
      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">Your Perfect Coffee Experience</h1>
        <p className="hero-subtitle">
          Discover artisan roasts and cozy corners at a CoffeeHub near you.
        </p>
        <div className="hero-cta">
          <Link to="/reservation" className="btn btn-primary">
            Book a Table
          </Link>
          <Link to="/menu" className="btn btn-outline">
            Explore Menu
          </Link>
        </div>
      </section>

      {/* Branches Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Our Neighborhood Branches</h2>
          <p className="section-subtitle">
            Find the perfect spot to enjoy your next cup of coffee.
          </p>
          <Link to="/branch/1" style={{ color: 'var(--primary)', fontWeight: 500 }}>
            View All Locations &rarr;
          </Link>

          {loading ? (
            <div className="loading">Loading branches...</div>
          ) : (
            <div className="card-grid-3">
              {branches.slice(0, 3).map((branch) => (
                <div className="card" key={branch.id}>
                  <div style={{ position: 'relative' }}>
                    {branch.imageUrl ? (
                      <img
                        src={branch.imageUrl}
                        alt={branch.name}
                        className="card-img"
                      />
                    ) : (
                      <div className="card-img" />
                    )}
                    {branch.city && (
                      <span style={{
                        position: 'absolute', top: '0.75rem', left: '0.75rem',
                        background: 'var(--primary)', color: '#fff',
                        padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem'
                      }}>{branch.city}</span>
                    )}
                  </div>
                  <div className="card-body">
                    <h3>{branch.name}</h3>
                    <p>{branch.address}</p>
                    <Link to={`/branch/${branch.id}`} className="btn btn-primary btn-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">The Ritual</h2>
          <p className="section-subtitle">
            Three simple steps to transition from your screen to our coffee machine.
          </p>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon">&#9906;</div>
              <span className="step-number">1</span>
              <h3 className="step-title">Choose Branch</h3>
              <p className="step-text">
                Browse our locations and pick the one closest to you or with your favorite vibe.
              </p>
            </div>
            <div className="step-card">
              <div className="step-icon">&#9749;</div>
              <span className="step-number">2</span>
              <h3 className="step-title">Browse Menu</h3>
              <p className="step-text">
                Explore our handcrafted drinks and seasonal specials before you arrive.
              </p>
            </div>
            <div className="step-card">
              <div className="step-icon">&#128197;</div>
              <span className="step-number">3</span>
              <h3 className="step-title">Reserve a Table</h3>
              <p className="step-text">
                Book your spot in seconds and skip the wait when you get there.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
