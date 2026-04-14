import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= rating ? '#F59E0B' : '#d6d3d1', fontSize: '1.1rem' }}>
        &#9733;
      </span>
    );
  }
  return <span style={{ display: 'inline-flex', gap: 2 }}>{stars}</span>;
};

const HERO_BG = '/images/branch-sf.jpg';
const BRANCH_IMAGES = {
  'The Bean Haven': '/images/branch-sf.jpg',
  'Roast & Relic': '/images/branch-london.jpg',
  'Sip & Solace': '/images/branch-tokyo.jpg',
  'Café Lumière': '/images/branch-paris.jpg',
  'Bottega del Caffè': '/images/branch-rome.jpg',
  'Gaudí Coffee House': '/images/branch-barcelona.jpg',
  'Berliner Bohne': '/images/branch-berlin.jpg',
  'Bosphorus Roastery': '/images/branch-istanbul.jpg',
  'Ala-Too Coffee Lab': '/images/branch-bishkek.jpg',
  'Desert Brew': '/images/branch-dubai.jpg',
};

const BranchPage = () => {
  const { branchId } = useParams();
  const [branch, setBranch] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchRes, reviewsRes] = await Promise.all([
          api.get(`/api/branches/${branchId}`),
          api.get(`/api/reviews/branch/${branchId}`),
        ]);
        setBranch(branchRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error('Failed to fetch branch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [branchId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFF8F6', marginTop: 64 }}>
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#78716c' }}>Loading...</div>
      </div>
    );
  }

  if (!branch) {
    return (
      <div style={{ minHeight: '100vh', background: '#FFF8F6', marginTop: 64 }}>
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#78716c' }}>
          <p>Branch not found.</p>
        </div>
      </div>
    );
  }

  const approvedReviews = reviews.filter((r) => r.approved !== false);
  const averageRating =
    approvedReviews.length > 0
      ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
      : null;

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const features = ['WiFi', 'Pet-friendly', 'Open late'];

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F6', marginTop: 64 }}>
      {/* Hero */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 400,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #2c1810, #6F4E37)',
      }}>
        <img
          src={branch.imageUrl || BRANCH_IMAGES[branch.name] || HERO_BG}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '2.5rem 3rem',
          color: '#fff',
        }}>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#fff' }}>
            {branch.name}
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
            {branch.city}{branch.address ? ` \u2022 ${branch.address}` : ''}
          </p>
        </div>
      </div>

      {/* Branch Info */}
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto', padding: '3rem 0 2rem' }}>
          {branch.description && (
            <p style={{
              fontSize: '1.05rem',
              color: '#57534e',
              lineHeight: 1.7,
              margin: '0 auto 1.5rem',
              maxWidth: '100%',
              textAlign: 'center',
            }}>
              {branch.description}
            </p>
          )}

          {/* Features */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
            {features.map((f) => (
              <span key={f} style={{
                background: '#FFF1EC',
                color: '#6F4E37',
                padding: '0.4rem 1rem',
                borderRadius: 9999,
                fontSize: '0.85rem',
                fontWeight: 500,
              }}>
                {f}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <Link to="/reservation" style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#6F4E37',
              color: '#fff',
              padding: '0.75rem 2rem',
              borderRadius: 12,
              fontSize: '0.95rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}>
              Reserve Your Spot
            </Link>
            <Link to={`/menu/${branchId}`} style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              color: '#6F4E37',
              padding: '0.75rem 2rem',
              borderRadius: 12,
              fontSize: '0.95rem',
              fontWeight: 600,
              textDecoration: 'none',
              border: '2px solid #6F4E37',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}>
              View Menu
            </Link>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ padding: '2rem 0 3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1c1917', margin: '0 0 0.5rem' }}>
              Guest Experiences
            </h2>
            {averageRating && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 700, color: '#2C1810' }}>{averageRating}</span>
                <div>
                  <StarRating rating={Math.round(Number(averageRating))} />
                  <p style={{ fontSize: '0.85rem', color: '#a8a29e', margin: '2px 0 0' }}>
                    {approvedReviews.length} review{approvedReviews.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}
          </div>

          {approvedReviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#78716c' }}>
              <p>No reviews yet for this branch.</p>
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.5rem',
              }}>
                {approvedReviews.slice(0, 3).map((review) => (
                  <div key={review.id} style={{
                    background: '#fff',
                    borderRadius: 24,
                    padding: '1.5rem',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    border: '1px solid #e7e5e4',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div style={{
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #D4A574, #6F4E37)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}>
                        {getInitials(review.userName)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#3D3028', fontSize: '0.95rem' }}>
                          {review.userName || 'Anonymous'}
                        </div>
                        {review.createdAt && (
                          <div style={{ fontSize: '0.825rem', color: '#A89E95' }}>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <StarRating rating={review.rating} />
                    </div>
                    {review.comment && (
                      <div style={{ fontSize: '0.9rem', color: '#57534e', lineHeight: 1.6 }}>
                        {review.comment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <Link
                  to={`/review?branch=${branchId}`}
                  style={{
                    color: '#6F4E37',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textDecoration: 'underline',
                  }}
                >
                  Leave a Review
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BranchPage;
