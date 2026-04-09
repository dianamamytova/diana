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
        <span key={i} style={{ color: i <= rating ? '#F59E0B' : '#d6d3d1', fontSize: '1.1rem' }}>
          {'\u2605'}
        </span>
      );
    }
    return <div style={{ display: 'inline-flex', gap: 2, marginBottom: '0.5rem' }}>{stars}</div>;
  };

  const reviews = activeTab === 'pending' ? pendingReviews : allReviews;

  const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = reviews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const tabStyle = (isActive) => ({
    padding: '10px 24px',
    fontWeight: 600,
    fontSize: '0.9rem',
    color: isActive ? '#6F4E37' : '#78716c',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    borderBottom: isActive ? '2.5px solid #6F4E37' : '2.5px solid transparent',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  });

  if (loading) {
    return (
      <AdminLayout activeItem="reviews">
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#78716c' }}>Loading reviews...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeItem="reviews">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1c1917', margin: 0 }}>
          Review Moderation
        </h1>
        <p style={{ fontSize: '15px', color: '#78716c', margin: '6px 0 0 0' }}>
          Approve or reject customer reviews
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e7e5e4', marginBottom: '1.5rem' }}>
        <button
          style={tabStyle(activeTab === 'pending')}
          onClick={() => setActiveTab('pending')}
        >
          Pending
          {pendingReviews.length > 0 && (
            <span style={{
              background: '#D94452',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 9999,
              minWidth: 20,
              textAlign: 'center',
            }}>
              {pendingReviews.length}
            </span>
          )}
        </button>
        <button
          style={tabStyle(activeTab === 'approved')}
          onClick={() => setActiveTab('approved')}
        >
          All Reviews
        </button>
      </div>

      {/* Review Cards */}
      {paginated.length === 0 ? (
        <div style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          padding: '48px',
          textAlign: 'center',
          color: '#78716c',
          fontSize: '15px',
        }}>
          {activeTab === 'pending'
            ? 'No pending reviews.'
            : 'No reviews found.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {paginated.map((review) => {
            const name = review.userName || review.user?.name || 'Anonymous';
            const branch = review.branchName || review.branch?.name || '';
            return (
              <div key={review.id} style={{
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                padding: '1.25rem 1.5rem',
                border: '1px solid #e7e5e4',
              }}>
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.75rem' }}>
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
                    {getInitials(name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#1c1917', fontSize: '0.95rem' }}>{name}</div>
                    {branch && (
                      <div style={{ fontSize: '0.825rem', color: '#6F4E37', fontWeight: 500 }}>{branch}</div>
                    )}
                    <div style={{ fontSize: '0.8rem', color: '#a8a29e' }}>
                      {formatDate(review.createdAt || review.date)}
                    </div>
                  </div>
                </div>

                {/* Stars */}
                {renderStars(review.rating || 0)}

                {/* Comment */}
                <p style={{
                  fontSize: '0.9rem',
                  color: '#57534e',
                  lineHeight: 1.6,
                  margin: '0 0 0.75rem',
                }}>
                  {review.comment || review.text || '\u2014'}
                </p>

                {/* Actions for pending */}
                {activeTab === 'pending' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => moderateReview(review.id, true)}
                      style={{
                        padding: '6px 18px',
                        borderRadius: 8,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: 'none',
                        background: '#16a34a',
                        color: '#fff',
                        fontFamily: 'inherit',
                        transition: 'opacity 0.15s',
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => moderateReview(review.id, false)}
                      style={{
                        padding: '6px 18px',
                        borderRadius: 8,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: '1px solid #dc2626',
                        background: 'transparent',
                        color: '#dc2626',
                        fontFamily: 'inherit',
                        transition: 'opacity 0.15s',
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '24px',
        }}>
          <button
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid #d6d3d1',
              background: '#fff',
              color: currentPage <= 1 ? '#d6d3d1' : '#57534e',
              fontSize: '13px',
              fontWeight: 500,
              cursor: currentPage <= 1 ? 'default' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: p === currentPage ? 'none' : '1px solid #d6d3d1',
                background: p === currentPage ? '#422B22' : '#fff',
                color: p === currentPage ? '#fff' : '#57534e',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                minWidth: 38,
                fontFamily: 'inherit',
              }}
            >
              {p}
            </button>
          ))}
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid #d6d3d1',
              background: '#fff',
              color: currentPage >= totalPages ? '#d6d3d1' : '#57534e',
              fontSize: '13px',
              fontWeight: 500,
              cursor: currentPage >= totalPages ? 'default' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Next
          </button>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminReviewsPage;
