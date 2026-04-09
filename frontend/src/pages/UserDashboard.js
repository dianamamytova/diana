import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';

const statusStyles = {
  CONFIRMED: { background: '#dcfce7', color: '#166534' },
  PENDING: { background: '#fef3c7', color: '#92400e' },
  CANCELLED: { background: '#fecaca', color: '#991b1b' },
  COMPLETED: { background: '#e0e7ff', color: '#3730a3' },
};

const thStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: '0.8rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: '#78716c',
  borderBottom: '2px solid #e7e5e4',
  background: '#FFF8F6',
};

const tdStyle = {
  padding: '12px 16px',
  fontSize: '0.9rem',
  color: '#1c1917',
  borderBottom: '1px solid #e7e5e4',
};

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('reservations');
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingRes, setLoadingRes] = useState(true);
  const [loadingRev, setLoadingRev] = useState(true);

  const fetchReservations = async () => {
    try {
      const response = await api.get('/api/reservations/my');
      setReservations(response.data);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    } finally {
      setLoadingRes(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get('/api/reviews/my');
      setReviews(response.data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoadingRev(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchReviews();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await api.put(`/api/reservations/${id}/cancel`);
      toast.success('Reservation cancelled.');
      fetchReservations();
    } catch (error) {
      const message =
        error.response?.data?.message || error.response?.data || 'Failed to cancel reservation.';
      toast.error(message);
    }
  };

  const getStatusBadgeStyle = (status) => {
    const s = statusStyles[status] || { background: '#e7e5e4', color: '#1c1917' };
    return {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: 20,
      fontSize: '0.8rem',
      fontWeight: 600,
      background: s.background,
      color: s.color,
    };
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= rating ? '#D4A574' : '#e7e5e4',
            fontSize: '1.2rem',
          }}
        >
          &#9733;
        </span>
      );
    }
    return <span>{stars}</span>;
  };

  const renderAction = (reservation) => {
    if (reservation.status === 'PENDING' || reservation.status === 'CONFIRMED') {
      return (
        <button
          onClick={() => handleCancel(reservation.id)}
          style={{
            background: 'transparent',
            color: '#D94452',
            border: '1.5px solid #D94452',
            borderRadius: 8,
            padding: '4px 14px',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Cancel
        </button>
      );
    }
    return <span style={{ color: '#78716c' }}>&mdash;</span>;
  };

  const userName = user?.name || user?.email || 'User';

  const tabStyle = (isActive) => ({
    padding: '0.75rem 1.4rem',
    fontWeight: 600,
    fontSize: '0.925rem',
    color: isActive ? '#6F4E37' : '#78716c',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    borderBottom: isActive ? '2.5px solid #6F4E37' : '2.5px solid transparent',
    marginBottom: '-2px',
    fontFamily: 'inherit',
    transition: 'all 0.25s ease',
  });

  return (
    <div style={{ marginTop: 64, minHeight: '100vh', background: '#FFF8F6' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', paddingTop: '1rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1c1917', marginBottom: '0.25rem', marginTop: 0 }}>
            Hello, {userName} &#128075;
          </h1>
          <p style={{ fontSize: '1rem', color: '#78716c', margin: 0 }}>
            Manage your reservations and reviews
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #e7e5e4', marginBottom: '1.5rem' }}>
          <button
            style={tabStyle(activeTab === 'reservations')}
            onClick={() => setActiveTab('reservations')}
          >
            My Reservations
          </button>
          <button
            style={tabStyle(activeTab === 'reviews')}
            onClick={() => setActiveTab('reviews')}
          >
            My Reviews
          </button>
        </div>

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <section>
            {loadingRes ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#78716c' }}>Loading reservations...</div>
            ) : reservations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#78716c' }}>
                <p>You have no reservations yet.</p>
              </div>
            ) : (
              <div style={{
                background: '#fff',
                borderRadius: 20,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                overflow: 'hidden',
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Date</th>
                        <th style={thStyle}>Time</th>
                        <th style={thStyle}>Branch</th>
                        <th style={thStyle}>Table</th>
                        <th style={thStyle}>Guests</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((res) => (
                        <tr key={res.id}>
                          <td style={tdStyle}>{res.reservationDate}</td>
                          <td style={tdStyle}>{res.startTime} - {res.endTime}</td>
                          <td style={tdStyle}>{res.branchName || '-'}</td>
                          <td style={tdStyle}>#{res.tableNumber || res.tableId}</td>
                          <td style={tdStyle}>{res.guestsCount}</td>
                          <td style={tdStyle}>
                            <span style={getStatusBadgeStyle(res.status)}>
                              {res.status}
                            </span>
                          </td>
                          <td style={tdStyle}>{renderAction(res)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <section>
            {loadingRev ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#78716c' }}>Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#78716c' }}>
                <p>You have not written any reviews yet.</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    padding: '1.25rem 1.5rem',
                    marginBottom: '1rem',
                    border: '1px solid #e7e5e4',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 700, color: '#1c1917' }}>{review.branchName || 'Branch'}</span>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: review.approved ? '#dcfce7' : '#fef3c7',
                        color: review.approved ? '#166534' : '#92400e',
                      }}
                    >
                      {review.approved ? 'Published' : 'Pending Approval'}
                    </span>
                  </div>
                  {renderStars(review.rating)}
                  {review.comment && (
                    <p style={{ color: '#78716c', lineHeight: 1.6, marginTop: '0.5rem', marginBottom: '0.75rem' }}>
                      {review.comment}
                    </p>
                  )}
                  {review.createdAt && (
                    <span style={{ fontSize: '0.825rem', color: '#78716c' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))
            )}
          </section>
        )}

        {/* Stats Section */}
        <div style={{
          marginTop: '2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
        }}>
          {[
            { value: reservations.length, label: 'Total Reservations' },
            { value: reviews.length, label: 'Reviews Written' },
            { value: reservations.filter((r) => r.status === 'CONFIRMED').length, label: 'Confirmed' },
            { value: reservations.filter((r) => r.status === 'COMPLETED').length, label: 'Completed' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                padding: '1.25rem 1.5rem',
                textAlign: 'center',
                border: '1px solid #e7e5e4',
              }}
            >
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#6F4E37' }}>{stat.value}</div>
              <div style={{ fontSize: '0.85rem', color: '#78716c', marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
