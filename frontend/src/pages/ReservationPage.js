import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';

const labelStyle = {
  display: 'block',
  textTransform: 'uppercase',
  fontSize: '11px',
  letterSpacing: '0.5px',
  color: '#78716c',
  fontWeight: 600,
  marginBottom: '6px',
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  fontSize: '0.95rem',
  border: '1.5px solid #e7e5e4',
  borderRadius: '12px',
  outline: 'none',
  background: '#FFF8F6',
  color: '#1c1917',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const selectStyle = {
  ...inputStyle,
  appearance: 'auto',
};

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

  const decrementGuests = () => {
    setGuestsCount((prev) => Math.max(1, Number(prev) - 1));
  };

  const incrementGuests = () => {
    setGuestsCount((prev) => Math.min(20, Number(prev) + 1));
  };

  return (
    <div style={{ marginTop: 64, minHeight: '100vh', background: '#FFF8F6' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#6F4E37', marginBottom: '0.5rem', marginTop: 0 }}>
            Reserve Your Table
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#78716c', margin: '0 auto' }}>
            Find the perfect spot at your favorite branch
          </p>
        </div>

        {/* Centered form card */}
        <div
          style={{
            maxWidth: 560,
            margin: '0 auto',
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            padding: 40,
            borderLeft: '4px solid #D4A574',
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Branch Select */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Select Branch</label>
              <select
                style={selectStyle}
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
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Select Table</label>
              <select
                style={{
                  ...selectStyle,
                  opacity: !selectedBranch || loadingTables ? 0.6 : 1,
                }}
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

            {/* Reservation Date */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Reservation Date</label>
              <input
                type="date"
                style={inputStyle}
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Start Time | End Time side by side */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Start Time</label>
                <input
                  type="time"
                  style={inputStyle}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>End Time</label>
                <input
                  type="time"
                  style={inputStyle}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Number of Guests (stepper) */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Number of Guests</label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1.5px solid #e7e5e4',
                  borderRadius: 12,
                  overflow: 'hidden',
                  width: 'fit-content',
                }}
              >
                <button
                  type="button"
                  onClick={decrementGuests}
                  style={{
                    width: 44,
                    height: 44,
                    border: 'none',
                    background: '#FFF1EC',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: '#6F4E37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  &minus;
                </button>
                <div
                  style={{
                    width: 60,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#1c1917',
                    background: '#fff',
                    borderLeft: '1.5px solid #e7e5e4',
                    borderRight: '1.5px solid #e7e5e4',
                  }}
                >
                  {guestsCount}
                </div>
                <button
                  type="button"
                  onClick={incrementGuests}
                  style={{
                    width: 44,
                    height: 44,
                    border: 'none',
                    background: '#FFF1EC',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: '#6F4E37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  +
                </button>
              </div>
              <input type="hidden" name="guestsCount" value={guestsCount} />
            </div>

            {/* Special Requests */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Special Requests</label>
              <textarea
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: 80,
                }}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Any special requests or dietary requirements..."
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.95rem',
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
              {submitting ? 'Confirming...' : 'Confirm Reservation'}
            </button>
          </form>
        </div>

        {/* Info Banner */}
        <div
          style={{
            maxWidth: 560,
            margin: '1.5rem auto 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textAlign: 'left',
            background: '#FFF1EC',
            border: '1px solid #e7e5e4',
            borderRadius: 12,
            padding: '14px 18px',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#D4A574',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '1rem',
              color: '#fff',
            }}
          >
            &#9993;
          </div>
          <span style={{ fontSize: '0.9rem', color: '#78716c', lineHeight: 1.5 }}>
            Your reservation will be reviewed and confirmed by staff within 15 minutes.
          </span>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ReservationPage;
