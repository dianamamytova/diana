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
      const [reservationsRes, reviewsRes, branchesRes] = await Promise.allSettled([
        api.get('/api/reservations'),
        api.get('/api/reviews/pending'),
        api.get('/api/branches'),
      ]);

      const allRes =
        reservationsRes.status === 'fulfilled' && Array.isArray(reservationsRes.value.data)
          ? reservationsRes.value.data
          : [];
      const today = new Date().toISOString().split('T')[0];
      const todayCount = allRes.filter((r) => r.reservationDate === today).length;
      const pendingCount = allRes.filter((r) => r.status?.toLowerCase() === 'pending').length;

      setStats({
        totalReservationsToday: todayCount,
        pendingReservations: pendingCount,
        pendingReviews:
          reviewsRes.status === 'fulfilled' && Array.isArray(reviewsRes.value.data)
            ? reviewsRes.value.data.length
            : 0,
        activeBranches:
          branchesRes.status === 'fulfilled' && Array.isArray(branchesRes.value.data)
            ? branchesRes.value.data.length
            : 0,
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            fontSize: 16,
            color: '#78716c',
          }}
        >
          Loading dashboard...
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      icon: '📅',
      iconBg: '#dbeafe',
      value: stats.totalReservationsToday,
      label: 'Total Reservations today',
      status: { text: '+12%', color: '#16a34a', bg: '#dcfce7' },
    },
    {
      icon: '⏰',
      iconBg: '#fef3c7',
      value: stats.pendingReservations,
      label: 'Pending Reservations',
      status: { text: 'Action Required', color: '#d97706', bg: '#fef3c7' },
    },
    {
      icon: '⭐',
      iconBg: '#dcfce7',
      value: stats.pendingReviews,
      label: 'Pending Reviews',
      status: { text: 'New', color: '#2563eb', bg: '#dbeafe' },
    },
    {
      icon: '📍',
      iconBg: '#f3e8ff',
      value: stats.activeBranches,
      label: 'Active Branches',
      status: { text: 'Operational', color: '#16a34a', bg: '#dcfce7' },
    },
  ];

  const quickActions = [
    {
      icon: '🍽️',
      title: 'Menu Management',
      desc: 'Create, update, and organize your artisanal coffee menu and food offerings.',
      link: '/admin/menu',
      linkText: 'Manage Menu',
    },
    {
      icon: '📅',
      title: 'Reservation Management',
      desc: 'View, confirm, or manage all incoming table reservation requests.',
      link: '/admin/reservations',
      linkText: 'View Bookings',
    },
    {
      icon: '⭐',
      title: 'Review Moderation',
      desc: 'Approve or reject customer reviews to maintain quality and trust.',
      link: '/admin/reviews',
      linkText: 'Go to Reviews',
    },
    {
      icon: '📈',
      title: 'Analytics',
      desc: 'Dive into performance metrics, reservation trends, and customer insights.',
      link: '/admin/analytics',
      linkText: 'Deep Insights',
    },
  ];

  return (
    <AdminLayout activeItem="dashboard">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1c1917',
            margin: 0,
          }}
        >
          Welcome back, Roaster.
        </h1>
        <p
          style={{
            fontSize: 15,
            color: '#78716c',
            margin: '8px 0 0 0',
          }}
        >
          Manage your artisanal operations from one central dashboard.
        </p>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 24,
          marginBottom: 40,
        }}
      >
        {statCards.map((card, i) => (
          <div
            key={i}
            style={{
              background: '#ffffff',
              borderRadius: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              padding: 24,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: card.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                }}
              >
                {card.icon}
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: card.status.color,
                  background: card.status.bg,
                  padding: '2px 10px',
                  borderRadius: 9999,
                }}
              >
                {card.status.text}
              </span>
            </div>
            <div
              style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#1c1917',
                marginTop: 12,
                lineHeight: 1.1,
              }}
            >
              {card.value}
            </div>
            <div
              style={{
                color: '#78716c',
                fontSize: 14,
                marginTop: 4,
              }}
            >
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: '#1c1917',
          marginBottom: 16,
          marginTop: 0,
        }}
      >
        Quick Actions
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 24,
          marginBottom: 40,
        }}
      >
        {quickActions.map((action, i) => (
          <div
            key={i}
            style={{
              background: '#ffffff',
              borderRadius: 16,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>{action.icon}</div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#1c1917',
                marginBottom: 6,
              }}
            >
              {action.title}
            </div>
            <div
              style={{
                fontSize: 14,
                color: '#78716c',
                lineHeight: 1.5,
                flex: 1,
                marginBottom: 16,
              }}
            >
              {action.desc}
            </div>
            <Link
              to={action.link}
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#6F4E37',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {action.linkText} &rsaquo;
            </Link>
          </div>
        ))}
      </div>

      {/* Analytics CTA */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FFF8F6 0%, #f0e8dc 100%)',
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          border: '1px solid #e7e5e4',
          padding: 32,
          textAlign: 'center',
        }}
      >
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#1c1917',
            margin: '0 0 8px 0',
          }}
        >
          Want detailed reports?
        </h3>
        <p
          style={{
            fontSize: 14,
            color: '#78716c',
            margin: '0 0 16px 0',
          }}
        >
          Go to Analytics for detailed reports on reservations, reviews, and more.
        </p>
        <Link
          to="/admin/analytics"
          style={{
            display: 'inline-block',
            background: '#6F4E37',
            color: '#ffffff',
            padding: '10px 28px',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Go to Analytics &rsaquo;
        </Link>
      </div>
    </AdminLayout>
  );
};

export default AdminPanel;
