import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import AdminLayout from '../components/AdminLayout';

const PAGE_SIZE = 8;

const AdminReviewsPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingReviews, setPendingReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const fetchReviews = async () => {
    try {
      const [pendingRes, allRes] = await Promise.allSettled([
        api.get('/api/reviews/pending'),
        api.get('/api/reviews'),
      ]);

      if (pendingRes.status === 'fulfilled') {
        setPendingReviews(pendingRes.value.data || []);
      }
      if (allRes.status === 'fulfilled') {
        setAllReviews(allRes.value.data || []);
      }
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const moderateReview = async (id, approved) => {
    try {
      await api.put(`/api/reviews/${id}/moderate`, { approved });
      toast.success(`Review ${approved ? 'approved' : 'rejected'}`);
      fetchReviews();
    } catch (error) {
      toast.error('Failed to moderate review');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '\u2014';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star star-gold' : 'star'}>
          {'\u2605'}
        </span>
      );
    }
    return <div className="admin-review-stars">{stars}</div>;
  };

  const reviews = activeTab === 'pending' ? pendingReviews : allReviews;

  // Pagination
  const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = reviews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (loading) {
    return (
      <AdminLayout activeItem="reviews">
        <div className="loading">Loading reviews...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeItem="reviews">
      <div className="admin-header">
        <h1>Review Moderation</h1>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
          {pendingReviews.length > 0 && (
            <span className="tab-badge">{pendingReviews.length}</span>
          )}
        </button>
        <button
          className={`tab ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved
        </button>
        <button
          className={`tab ${activeTab === 'flagged' ? 'active' : ''}`}
          onClick={() => setActiveTab('flagged')}
        >
          Flagged
        </button>
      </div>

      {/* Review Cards */}
      {paginated.length === 0 ? (
        <div className="empty-state">
          <p>
            {activeTab === 'pending'
              ? 'No pending reviews.'
              : 'No reviews found.'}
          </p>
        </div>
      ) : (
        paginated.map((review) => {
          const name = review.userName || review.user?.name || 'Anonymous';
          const branch = review.branchName || review.branch?.name || '';
          return (
            <div className="admin-review-card" key={review.id}>
              <div className="admin-review-header">
                <div className="avatar-circle">{getInitials(name)}</div>
                <div className="admin-review-meta">
                  <div className="review-name">{name}</div>
                  {branch && <div className="review-branch-name">{branch}</div>}
                  <div className="review-date">{formatDate(review.createdAt || review.date)}</div>
                </div>
              </div>
              {renderStars(review.rating || 0)}
              <p className="admin-review-text">{review.comment || review.text || '\u2014'}</p>
              {activeTab === 'pending' && (
                <div className="admin-review-actions">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => moderateReview(review.id, true)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-sm btn-danger btn-outlined"
                    onClick={() => moderateReview(review.id, false)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`pagination-btn ${p === currentPage ? 'pagination-btn-active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="pagination-btn"
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminReviewsPage;
