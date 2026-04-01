import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import AdminLayout from '../components/AdminLayout';

const STATUS_FILTERS = ['All', 'Pending', 'Confirmed', 'Cancelled', 'Completed'];
const PAGE_SIZE = 10;

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await api.get('/api/reservations');
      setReservations(response.data || []);
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

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const getBadgeClass = (status) => {
    const s = status?.toLowerCase();
    if (s === 'pending') return 'badge badge-pending';
    if (s === 'confirmed') return 'badge badge-confirmed';
    if (s === 'cancelled') return 'badge badge-cancelled';
    if (s === 'completed') return 'badge badge-completed';
    return 'badge';
  };

  // Filtering
  let filtered = reservations;
  if (filter !== 'All') {
    filtered = filtered.filter((r) => r.status?.toLowerCase() === filter.toLowerCase());
  }
  if (dateFilter) {
    filtered = filtered.filter((r) => r.reservationDate === dateFilter);
  }
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter((r) => {
      const name = (r.userName || r.user?.name || '').toLowerCase();
      const branch = (r.branchName || r.branch?.name || '').toLowerCase();
      return name.includes(q) || branch.includes(q);
    });
  }

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (loading) {
    return (
      <AdminLayout activeItem="reservations">
        <div className="loading">Loading reservations...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeItem="reservations">
      <div className="admin-header-row">
        <h1>Reservation Management</h1>
        <button className="btn btn-secondary">Export</button>
      </div>

      {/* Filter Bar */}
      <div className="admin-filter-row">
        <div className="status-pills">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              className={`status-pill ${filter === s ? 'status-pill-active' : ''}`}
              onClick={() => { setFilter(s); setPage(1); }}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="date"
          className="form-input"
          value={dateFilter}
          onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
        />
        <input
          type="text"
          className="search-input"
          placeholder="Search customer or branch..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="empty-state"><p>No reservations found.</p></div>
      ) : (
        <div className="admin-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Branch</th>
                <th>Date & Time</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r) => {
                const name = r.userName || r.user?.name || 'Unknown';
                return (
                  <tr key={r.id}>
                    <td>#{r.id}</td>
                    <td>
                      <div className="avatar-name-cell">
                        <div className="avatar-circle">{getInitials(name)}</div>
                        <span>{name}</span>
                      </div>
                    </td>
                    <td>{r.branchName || r.branch?.name || '\u2014'}</td>
                    <td>{r.reservationDate || '\u2014'} {r.startTime || ''}</td>
                    <td>{r.guestsCount || '\u2014'}</td>
                    <td>
                      <span className={getBadgeClass(r.status)}>{r.status}</span>
                    </td>
                    <td>
                      <div className="btn-group">
                        {r.status?.toLowerCase() === 'pending' && (
                          <>
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => updateStatus(r.id, 'CONFIRMED')}
                            >
                              Confirm
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => updateStatus(r.id, 'CANCELLED')}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {r.status?.toLowerCase() === 'confirmed' && (
                          <>
                            <button
                              className="btn btn-sm btn-info"
                              onClick={() => updateStatus(r.id, 'COMPLETED')}
                            >
                              Complete
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => updateStatus(r.id, 'CANCELLED')}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {!['pending', 'confirmed'].includes(r.status?.toLowerCase()) && (
                          <span>{'\u2014'}</span>
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

export default AdminReservationsPage;
