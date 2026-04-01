import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
        className={`star-clickable ${filled ? 'star-filled' : 'star-empty'}`}
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
      >
        &#9733;
      </span>
    );
  };

  return (
    <div className="page-bg">
      <div className="container">
        <div className="form-card">
          <h2>Leave a Review</h2>
          {branchName && <p className="branch-name">{branchName}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Rating</label>
              <div className="stars">
                {[1, 2, 3, 4, 5].map(renderStar)}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Review</label>
              <textarea
                className="form-textarea"
                value={comment}
                onChange={handleCommentChange}
                placeholder="Share your experience..."
                rows={6}
              />
              <div className="char-counter">{comment.length} / 500</div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>

        <div className="info-banner">
          Your review will be visible after admin approval
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ReviewPage;
