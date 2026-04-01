import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import AdminLayout from '../components/AdminLayout';

const AdminPanel = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalReservationsToday: 0,
    pendingReservations: 0,
    pendingReviews: 0,
    activeBranches: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [reservationsRes, pendingRes, reviewsRes, branchesRes] = await Promise.allSettled([
        api.get('/api/reservations'),
        api.get('/api/reservations', { params: { status: 'PENDING' } }),
        api.get('/api/reviews/pending'),
        api.get('/api/branches'),
      ]);

      const allRes = reservationsRes.status === 'fulfilled' && Array.isArray(reservationsRes.value.data)
        ? reservationsRes.value.data : [];
      const today = new Date().toISOString().split('T')[0];
      const todayCount = allRes.filter((r) => r.reservationDate === today).length;

      setStats({
        totalReservationsToday: todayCount,
        pendingReservations:
          pendingRes.status === 'fulfilled' && Array.isArray(pendingRes.value.data)
            ? pendingRes.value.data.length : 0,
        pendingReviews:
          reviewsRes.status === 'fulfilled' && Array.isArray(reviewsRes.value.data)
            ? reviewsRes.value.data.length : 0,
        activeBranches:
          branchesRes.status === 'fulfilled' && Array.isArray(branchesRes.value.data)
            ? branchesRes.value.data.length : 0,
      });
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout activeItem="dashboard">
        <div className="loading">Loading dashboard...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeItem="dashboard">
      <div className="admin-header">
        <h1>Welcome back, Roaster.</h1>
        <p>Manage your artisanal operations from one central dashboard.</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="admin-stat-card">
          <span className="stat-icon">{'\uD83D\uDCC5'}</span>
          <div className="stat-number">{stats.totalReservationsToday}</div>
          <div className="stat-label">Total Reservations Today</div>
          <span className="stat-change stat-change-up">{'\u2191'} +12%</span>
        </div>
        <div className="admin-stat-card">
          <span className="stat-icon">{'\u23F3'}</span>
          <div className="stat-number">{stats.pendingReservations}</div>
          <div className="stat-label">Pending Reservations</div>
          <span className="stat-change stat-change-orange">Action Required</span>
        </div>
        <div className="admin-stat-card">
          <span className="stat-icon">{'\u2B50'}</span>
          <div className="stat-number">{stats.pendingReviews}</div>
          <div className="stat-label">Pending Reviews</div>
          <span className="stat-change stat-change-blue">New</span>
        </div>
        <div className="admin-stat-card">
          <span className="stat-icon">{'\uD83C\uDFE0'}</span>
          <div className="stat-number">{stats.activeBranches}</div>
          <div className="stat-label">Active Branches</div>
          <span className="stat-change stat-change-green">Operational</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-quick-grid">
        <div className="admin-quick-card">
          <h3>{'\uD83C\uDF7D\uFE0F'} Menu Management</h3>
          <p>Create, update, and organize your artisanal coffee menu and food offerings.</p>
          <Link to="/admin/menu" className="quick-link">Manage Menu &gt;</Link>
        </div>
        <div className="admin-quick-card">
          <h3>{'\uD83D\uDCC5'} Reservation Management</h3>
          <p>View, confirm, or manage all incoming table reservation requests.</p>
          <Link to="/admin/reservations" className="quick-link">View Bookings &gt;</Link>
        </div>
        <div className="admin-quick-card">
          <h3>{'\u2B50'} Review Moderation</h3>
          <p>Approve or reject customer reviews to maintain quality and trust.</p>
          <Link to="/admin/reviews" className="quick-link">Go to Reviews &gt;</Link>
        </div>
        <div className="admin-quick-card">
          <h3>{'\uD83D\uDCC8'} Analytics</h3>
          <p>Dive into performance metrics, reservation trends, and customer insights.</p>
          <Link to="/admin/analytics" className="quick-link">Deep Insights &gt;</Link>
        </div>
      </div>

      {/* Revenue Section */}
      <div className="admin-revenue-card">
        <h3>Revenue Performance</h3>
        <div className="revenue-period">Last 7 Days</div>
        <div className="revenue-row">
          <div className="revenue-item">
            <div className="revenue-value">$4,280</div>
            <div className="revenue-label">Total Sales</div>
          </div>
          <div className="revenue-item">
            <div className="revenue-value">$18.50</div>
            <div className="revenue-label">Average Order</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPanel;
