import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import Footer from '../components/Footer';

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? 'star-filled' : 'star-empty'}>
        &#9733;
      </span>
    );
  }
  return <span className="stars">{stars}</span>;
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
      <div className="page-bg">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="page-bg">
        <div className="empty-state">
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
    <div className="page-bg">
      {/* Hero */}
      <div className="branch-hero">
        {branch.imageUrl ? (
          <img src={branch.imageUrl} alt={branch.name} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #2C1810, #6F4E37)' }} />
        )}
        <div className="branch-hero-overlay" />
        <div className="branch-hero-text">
          <h1>{branch.name}</h1>
          <p>{branch.city}{branch.address ? ` \u2022 ${branch.address}` : ''}</p>
        </div>
      </div>

      {/* Branch Info */}
      <div className="container">
        <div className="section" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
          {branch.description && (
            <p className="section-subtitle" style={{ margin: '0 auto 1.5rem', maxWidth: '100%', textAlign: 'center' }}>
              {branch.description}
            </p>
          )}

          {/* Features */}
          <div className="features-row" style={{ justifyContent: 'center' }}>
            {features.map((f) => (
              <span key={f} className="feature-badge">
                {f}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <Link to="/reservation" className="btn btn-primary">
              Reserve Your Spot
            </Link>
            <Link to={`/menu/${branchId}`} className="btn-outline">
              View Menu
            </Link>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="section">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 className="section-title">Guest Experiences</h2>
            {averageRating && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2C1810' }}>{averageRating}</span>
                <div>
                  <StarRating rating={Math.round(Number(averageRating))} />
                  <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '2px' }}>
                    {approvedReviews.length} review{approvedReviews.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}
          </div>

          {approvedReviews.length === 0 ? (
            <div className="empty-state">
              <p>No reviews yet for this branch.</p>
            </div>
          ) : (
            <>
              <div className="card-grid-3">
                {approvedReviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-card-header">
                      <div className="review-card-avatar">
                        {getInitials(review.userName)}
                      </div>
                      <div>
                        <div className="review-author">{review.userName || 'Anonymous'}</div>
                        {review.createdAt && (
                          <div className="review-date">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <StarRating rating={review.rating} />
                    </div>
                    {review.comment && (
                      <div className="review-card-body">{review.comment}</div>
                    )}
                  </div>
                ))}
              </div>
              {approvedReviews.length > 3 && (
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <Link to={`/review`} className="section-link" style={{ display: 'inline' }}>
                    Read All Reviews
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BranchPage;
