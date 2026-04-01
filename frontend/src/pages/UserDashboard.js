import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';

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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'badge badge-confirmed';
      case 'PENDING': return 'badge badge-pending';
      case 'CANCELLED': return 'badge badge-cancelled';
      case 'COMPLETED': return 'badge badge-completed';
      default: return 'badge';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star-filled' : 'star-empty'}>
          &#9733;
        </span>
      );
    }
    return <span className="star-rating">{stars}</span>;
  };

  const renderAction = (reservation) => {
    if (reservation.status === 'PENDING' || reservation.status === 'CONFIRMED') {
      return (
        <button
          className="btn btn-danger btn-sm btn-outlined"
          onClick={() => handleCancel(reservation.id)}
        >
          Cancel
        </button>
      );
    }
    if (reservation.status === 'COMPLETED') {
      return <span className="btn btn-sm btn-secondary">View Details</span>;
    }
    return <span>&mdash;</span>;
  };

  const userName = user?.name || user?.email || 'User';

  return (
    <div className="page-bg">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-greeting">Hello, {userName} &#128075;</h1>
          <p className="dashboard-subtitle">Manage your reservations and reviews</p>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'reservations' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            My Reservations
          </button>
          <button
            className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            My Reviews
          </button>
        </div>

        {activeTab === 'reservations' && (
          <section>
            {loadingRes ? (
              <div className="loading">Loading reservations...</div>
            ) : reservations.length === 0 ? (
              <div className="empty-state">
                <p>You have no reservations yet.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Branch</th>
                      <th>Table</th>
                      <th>Guests</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((res) => (
                      <tr key={res.id}>
                        <td>{res.reservationDate}</td>
                        <td>{res.startTime} - {res.endTime}</td>
                        <td>{res.branchName || '-'}</td>
                        <td>#{res.tableNumber || res.tableId}</td>
                        <td>{res.guestsCount}</td>
                        <td>
                          <span className={getStatusBadgeClass(res.status)}>
                            {res.status}
                          </span>
                        </td>
                        <td>{renderAction(res)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === 'reviews' && (
          <section>
            {loadingRev ? (
              <div className="loading">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="empty-state">
                <p>You have not written any reviews yet.</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <span className="review-author">{review.branchName || 'Branch'}</span>
                    <span className={`badge ${review.approved ? 'badge-confirmed' : 'badge-pending'}`}>
                      {review.approved ? 'Published' : 'Pending Approval'}
                    </span>
                  </div>
                  {renderStars(review.rating)}
                  {review.comment && (
                    <p className="review-comment">{review.comment}</p>
                  )}
                  {review.createdAt && (
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))
            )}
          </section>
        )}

        <div className="stats-grid" style={{ marginTop: '2rem' }}>
          <div className="stat-card">
            <div className="stat-number">{reservations.length}</div>
            <div className="stat-label">Total Visits</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{reviews.length}</div>
            <div className="stat-label">Reviews Written</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {reservations.filter((r) => r.status === 'CONFIRMED').length}
            </div>
            <div className="stat-label">Confirmed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {reservations.filter((r) => r.status === 'COMPLETED').length}
            </div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
