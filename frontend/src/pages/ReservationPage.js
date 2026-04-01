import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';

const ReservationPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [branches, setBranches] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingTables, setLoadingTables] = useState(false);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await api.get('/api/branches');
        setBranches(response.data);
      } catch (error) {
        console.error('Failed to fetch branches:', error);
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    if (!selectedBranch) {
      setTables([]);
      setSelectedTable('');
      return;
    }
    const fetchTables = async () => {
      setLoadingTables(true);
      try {
        const response = await api.get(`/api/tables/branch/${selectedBranch}/available`);
        setTables(response.data);
        setSelectedTable('');
      } catch (error) {
        console.error('Failed to fetch tables:', error);
        setTables([]);
      } finally {
        setLoadingTables(false);
      }
    };
    fetchTables();
  }, [selectedBranch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/reservations', {
        coffeeTableId: parseInt(selectedTable, 10),
        reservationDate,
        startTime,
        endTime,
        guestsCount: parseInt(guestsCount, 10),
        comment,
      });
      toast.success('Reservation created!');
      navigate('/dashboard');
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        'Failed to create reservation. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedBranchData = branches.find((b) => String(b.id) === String(selectedBranch));

  return (
    <div className="page-bg">
      <div className="container">
        {/* Header */}
        <div className="section" style={{ textAlign: 'center', paddingBottom: '1rem' }}>
          <h1 className="section-title">Reserve Your Table</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Secure your moment of artisan tranquility. Choose your preferred spot and time.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="reservation-page">
          {/* Left: Form Card */}
          <div className="reservation-form-card">
            <form onSubmit={handleSubmit}>
              {/* Branch Select */}
              <div className="form-group">
                <label className="form-label">Select Branch</label>
                <select
                  className="form-select"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  required
                >
                  <option value="">Choose a branch</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} - {b.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Table Select */}
              <div className="form-group">
                <label className="form-label">Select Table</label>
                <select
                  className="form-select"
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  required
                  disabled={!selectedBranch || loadingTables}
                >
                  <option value="">
                    {loadingTables
                      ? 'Loading tables...'
                      : !selectedBranch
                      ? 'Select a branch first'
                      : 'Choose a table'}
                  </option>
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      Table #{t.tableNumber || t.id} — Capacity: {t.capacity} guests
                    </option>
                  ))}
                </select>
              </div>

              {/* Date + Guests side by side */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Number of Guests</label>
                  <input
                    type="number"
                    className="form-input"
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(e.target.value)}
                    min="1"
                    max="20"
                    required
                  />
                </div>
              </div>

              {/* Time Range side by side */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    className="form-input"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    className="form-input"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div className="form-group">
                <label className="form-label">Special Requests</label>
                <textarea
                  className="form-textarea"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Any special requests or dietary requirements..."
                  rows={3}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                {submitting ? 'Confirming...' : 'Confirm Reservation'}
              </button>
            </form>
          </div>

          {/* Right: Sidebar */}
          <div className="reservation-sidebar">
            {/* Branch Photo */}
            <div className="reservation-sidebar-photo">
              {selectedBranchData?.imageUrl ? (
                <img src={selectedBranchData.imageUrl} alt={selectedBranchData.name} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #2C1810, #6F4E37)' }} />
              )}
              <div className="reservation-sidebar-photo-overlay">
                <span>{selectedBranchData ? selectedBranchData.name : 'The Downtown Experience'}</span>
              </div>
            </div>

            {/* Reservation Policies */}
            <div className="reservation-policies">
              <h4>Reservation Policies</h4>
              <div className="policy-item">
                <div className="policy-icon">&#9201;</div>
                <span>Tables are held for 15 minutes past the reservation time.</span>
              </div>
              <div className="policy-item">
                <div className="policy-icon">&#128101;</div>
                <span>For parties greater than 6, please contact us directly.</span>
              </div>
              <div className="policy-item">
                <div className="policy-icon">&#10060;</div>
                <span>Cancellations must be made at least 2 hours in advance.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="info-banner" style={{ display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '100%', textAlign: 'left', marginTop: '2rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#D4A574',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '1.1rem',
            color: '#fff'
          }}>
            &#9993;
          </div>
          <span>
            Your reservation will be confirmed by an administrator within 15 minutes via SMS and Email.
          </span>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReservationPage;
