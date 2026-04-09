import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';

const ReviewPage = () => {
  const [searchParams] = useSearchParams();
  const branchId = searchParams.get('branch');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [branchName, setBranchName] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (branchId) {
      api.get(`/api/branches/${branchId}`)
        .then((res) => setBranchName(res.data.name || res.data.branchName || ''))
        .catch(() => setBranchName(''));
    }
  }, [branchId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating.');
      return;
    }
    if (!branchId) {
      toast.error('Branch not specified.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/api/reviews', {
        branchId: parseInt(branchId, 10),
        rating,
        comment,
      });
      toast.success('Review submitted! Pending approval.');
      navigate(`/branch/${branchId}`);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        'Failed to submit review.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentChange = (e) => {
    if (e.target.value.length <= 500) {
      setComment(e.target.value);
    }
  };

  const renderStar = (star) => {
    const filled = star <= (hoverRating || rating);
    return (
      <span
        key={star}
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
        style={{
          cursor: 'pointer',
          fontSize: '2rem',
          color: filled ? '#D4A574' : '#e7e5e4',
          transition: 'transform 0.2s ease',
          display: 'inline-block',
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.15)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        &#9733;
      </span>
    );
  };

  if (!branchId) {
    return (
      <div style={{ marginTop: 64, minHeight: '100vh', background: '#FFF8F6' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '2rem 1.5rem' }}>
          <div style={{
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            padding: '3rem 2rem',
            maxWidth: 520,
            width: '100%',
            textAlign: 'center',
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#6F4E37', marginBottom: '0.75rem', marginTop: 0 }}>
              Leave a Review
            </h2>
            <p style={{ color: '#78716c', marginBottom: '1.5rem' }}>
              Please select a branch to leave a review.
            </p>
            <Link
              to="/branches"
              style={{
                display: 'inline-block',
                padding: '0.7rem 1.8rem',
                background: '#6F4E37',
                color: '#fff',
                borderRadius: 12,
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              Browse Branches
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ marginTop: 64, minHeight: '100vh', background: '#FFF8F6' }}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1.5rem' }}>
        <div style={{ maxWidth: 520, width: '100%' }}>
          {/* Review Card */}
          <div style={{
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            padding: 40,
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1c1917', marginBottom: '0.35rem', textAlign: 'center', marginTop: 0 }}>
              Leave a Review
            </h2>
            {branchName && (
              <p style={{ textAlign: 'center', color: '#6F4E37', fontWeight: 600, marginBottom: '1.5rem', fontSize: '1rem' }}>
                {branchName}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              {/* Star Rating */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: '#1c1917' }}>
                  Rating
                </label>
                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5].map(renderStar)}
                </div>
              </div>

              {/* Comment Textarea */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: '#1c1917' }}>
                  Your Review
                </label>
                <textarea
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '0.95rem',
                    border: '1.5px solid #e7e5e4',
                    borderRadius: 12,
                    outline: 'none',
                    background: '#FFF8F6',
                    color: '#1c1917',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder="Share your experience..."
                  rows={6}
                />
                <div style={{
                  textAlign: 'right',
                  fontSize: '0.8rem',
                  color: comment.length >= 480 ? '#D94452' : '#78716c',
                  marginTop: '0.35rem',
                }}>
                  {comment.length}/500
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#fff',
                  background: submitting ? '#a08068' : '#6F4E37',
                  border: 'none',
                  borderRadius: 12,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background 0.2s',
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>

          {/* Info Banner */}
          <div
            style={{
              marginTop: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: '#FFF1EC',
              border: '1px solid #e7e5e4',
              borderRadius: 12,
              padding: '14px 18px',
            }}
          >
            <span style={{ fontSize: '1.1rem', flexShrink: 0, color: '#D4A574' }}>&#9432;</span>
            <span style={{ fontSize: '0.9rem', color: '#78716c', lineHeight: 1.5 }}>
              Your review will be visible after admin approval
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReviewPage;
