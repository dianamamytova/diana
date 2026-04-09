import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import AdminLayout from '../components/AdminLayout';

const STATUS_FILTERS = ['All', 'Pending', 'Confirmed', 'Cancelled', 'Completed'];
const PAGE_SIZE = 10;

const statusBadgeStyles = {
  pending: { color: '#d97706', bg: '#fef3c7' },
  confirmed: { color: '#16a34a', bg: '#dcfce7' },
  cancelled: { color: '#dc2626', bg: '#fee2e2' },
  completed: { color: '#2563eb', bg: '#dbeafe' },
};

const AdminReservationsPage = () => {
  const [allReservations, setAllReservations] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await api.get('/api/reservations');
      setAllReservations(response.data || []);
    } catch (error) {
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/reservations/${id}/status`, { status });
      toast.success(`Reservation ${status.toLowerCase()}`);
      fetchReservations();
    } catch (error) {
      toast.error('Failed to update reservation status');
    }
  };

  const handlePillClick = (s) => {
    setFilter(s);
    setSearch('');
    setPage(1);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Client-side filtering
  let filtered = allReservations;
  if (filter !== 'All') {
    filtered = filtered.filter((r) => r.status?.toLowerCase() === filter.toLowerCase());
  }
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter((r) => {
      const name = (r.userName || r.user?.name || '').toLowerCase();
      const email = (r.userEmail || r.user?.email || '').toLowerCase();
      const branch = (r.branchName || r.branch?.name || '').toLowerCase();
      return name.includes(q) || email.includes(q) || branch.includes(q);
    });
  }

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (loading) {
    return (
      <AdminLayout activeItem="reservations">
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#78716c' }}>Loading reservations...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeItem="reservations">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1c1917', margin: 0 }}>
          Reservation Management
        </h1>
        <p style={{ fontSize: '15px', color: '#78716c', margin: '6px 0 0 0' }}>
          Manage and track all guest bookings across branches
        </p>
      </div>

      {/* Filter Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => handlePillClick(s)}
              style={{
                padding: '8px 20px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                border: filter === s ? 'none' : '1px solid #d6d3d1',
                background: filter === s ? '#422B22' : '#fff',
                color: filter === s ? '#fff' : '#57534e',
                outline: 'none',
                transition: 'all 0.15s',
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search customer or branch..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            padding: '9px 16px',
            borderRadius: '9999px',
            border: '1px solid #d6d3d1',
            fontSize: '13px',
            minWidth: '240px',
            outline: 'none',
            color: '#1c1917',
          }}
        />
      </div>

      {/* Table Card */}
      {filtered.length === 0 ? (
        <div
          style={{
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            padding: '48px',
            textAlign: 'center',
            color: '#78716c',
            fontSize: '15px',
          }}
        >
          No reservations found.
        </div>
      ) : (
        <div
          style={{
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fafaf9' }}>
                {['ORDER ID', 'CUSTOMER', 'DATE & TIME', 'GUESTS', 'STATUS', 'ACTIONS'].map(
                  (col) => (
                    <th
                      key={col}
                      style={{
                        padding: '14px 20px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#78716c',
                        textTransform: 'uppercase',
                        textAlign: 'left',
                        borderBottom: '1px solid #e7e5e4',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {paginated.map((r) => {
                const name = r.userName || r.user?.name || 'Unknown';
                const email = r.userEmail || r.user?.email || '';
                const statusKey = r.status?.toLowerCase() || '';
                const badge = statusBadgeStyles[statusKey] || {
                  color: '#78716c',
                  bg: '#f5f5f4',
                };

                return (
                  <tr
                    key={r.id}
                    style={{
                      borderBottom: '1px solid #f5f5f4',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#fafaf9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Order ID */}
                    <td
                      style={{
                        padding: '16px 20px',
                        fontSize: '14px',
                        color: '#1c1917',
                        fontWeight: 500,
                      }}
                    >
                      #{r.id}
                    </td>

                    {/* Customer */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: '#f0e7e0',
                            color: '#78350f',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '13px',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {getInitials(name)}
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#1c1917',
                            }}
                          >
                            {name}
                          </div>
                          {email && (
                            <div
                              style={{
                                fontSize: '12px',
                                color: '#a8a29e',
                                marginTop: '2px',
                              }}
                            >
                              {email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td
                      style={{
                        padding: '16px 20px',
                        fontSize: '14px',
                        color: '#1c1917',
                      }}
                    >
                      <div>{r.reservationDate || '\u2014'}</div>
                      {r.startTime && (
                        <div style={{ fontSize: '12px', color: '#a8a29e', marginTop: '2px' }}>
                          {r.startTime}
                        </div>
                      )}
                    </td>

                    {/* Guests */}
                    <td
                      style={{
                        padding: '16px 20px',
                        fontSize: '14px',
                        color: '#1c1917',
                      }}
                    >
                      {r.guestsCount || '\u2014'}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 14px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: badge.color,
                          background: badge.bg,
                          textTransform: 'capitalize',
                        }}
                      >
                        {r.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {r.status?.toLowerCase() === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(r.id, 'CONFIRMED')}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                border: 'none',
                                background: '#16a34a',
                                color: '#fff',
                                transition: 'opacity 0.15s',
                              }}
                              onMouseEnter={(e) => (e.target.style.opacity = '0.85')}
                              onMouseLeave={(e) => (e.target.style.opacity = '1')}
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => updateStatus(r.id, 'CANCELLED')}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                border: '1px solid #dc2626',
                                background: 'transparent',
                                color: '#dc2626',
                                transition: 'opacity 0.15s',
                              }}
                              onMouseEnter={(e) => (e.target.style.opacity = '0.85')}
                              onMouseLeave={(e) => (e.target.style.opacity = '1')}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {r.status?.toLowerCase() === 'confirmed' && (
                          <>
                            <button
                              onClick={() => updateStatus(r.id, 'COMPLETED')}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                border: 'none',
                                background: '#2563eb',
                                color: '#fff',
                                transition: 'opacity 0.15s',
                              }}
                              onMouseEnter={(e) => (e.target.style.opacity = '0.85')}
                              onMouseLeave={(e) => (e.target.style.opacity = '1')}
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => updateStatus(r.id, 'CANCELLED')}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                border: '1px solid #dc2626',
                                background: 'transparent',
                                color: '#dc2626',
                                transition: 'opacity 0.15s',
                              }}
                              onMouseEnter={(e) => (e.target.style.opacity = '0.85')}
                              onMouseLeave={(e) => (e.target.style.opacity = '1')}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {!['pending', 'confirmed'].includes(r.status?.toLowerCase()) && (
                          <span style={{ color: '#a8a29e', fontSize: '14px' }}>{'\u2014'}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '24px',
          }}
        >
          <button
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #d6d3d1',
              background: '#fff',
              color: currentPage <= 1 ? '#d6d3d1' : '#57534e',
              fontSize: '13px',
              fontWeight: 500,
              cursor: currentPage <= 1 ? 'default' : 'pointer',
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
                borderRadius: '8px',
                border: p === currentPage ? 'none' : '1px solid #d6d3d1',
                background: p === currentPage ? '#422B22' : '#fff',
                color: p === currentPage ? '#fff' : '#57534e',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                minWidth: '38px',
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
              borderRadius: '8px',
              border: '1px solid #d6d3d1',
              background: '#fff',
              color: currentPage >= totalPages ? '#d6d3d1' : '#57534e',
              fontSize: '13px',
              fontWeight: 500,
              cursor: currentPage >= totalPages ? 'default' : 'pointer',
            }}
          >
            Next
          </button>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminReservationsPage;
