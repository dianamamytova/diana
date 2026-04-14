import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import { toast } from 'react-toastify';

const inputStyle = {
  width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid #e7e5e4',
  fontSize: 14, background: '#fafaf9', boxSizing: 'border-box', outline: 'none',
  transition: 'border-color 0.2s',
};

const labelStyle = {
  display: 'block', fontSize: 13, fontWeight: 600, color: '#57534e',
  textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: 6,
};

const cardStyle = {
  background: '#fff', borderRadius: 16, padding: 32,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: 24,
};

const AdminSettingsPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ current: '', newPassword: '', confirm: '' });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isSuper = user?.role === 'SUPER_ADMIN';

  useEffect(() => {
    api.get('/api/auth/me')
      .then(res => setProfile({ name: res.data.name, email: res.data.email }))
      .catch(() => {});

    if (isSuper) {
      // Fetch all users for role management (we'll use reservations endpoint as proxy to get user data)
      // In a real app there'd be a /api/users endpoint. For now show branch count.
    }
    setLoading(false);
  }, [isSuper]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    toast.info('Password change is not yet implemented on the backend');
    setPasswords({ current: '', newPassword: '', confirm: '' });
  };

  if (loading) {
    return (
      <AdminLayout activeItem="settings">
        <div style={{ padding: 48, textAlign: 'center', color: '#78716c' }}>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeItem="settings">
      <div style={{ maxWidth: 800 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1c1917', marginBottom: 4 }}>Settings</h1>
        <p style={{ color: '#78716c', marginBottom: 32 }}>Manage your account and system preferences</p>

        {/* Profile Card */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1c1917', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>👤</span> Profile Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input style={inputStyle} value={profile.name} readOnly />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input style={inputStyle} value={profile.email} readOnly />
            </div>
            <div>
              <label style={labelStyle}>Role</label>
              <div style={{
                display: 'inline-block', padding: '6px 16px', borderRadius: 20,
                background: user?.role === 'SUPER_ADMIN' ? '#fecaca' : '#fef3c7',
                color: user?.role === 'SUPER_ADMIN' ? '#991b1b' : '#92400e',
                fontSize: 13, fontWeight: 600,
              }}>
                {user?.role?.replace('_', ' ')}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Member Since</label>
              <input style={inputStyle} value="2026" readOnly />
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1c1917', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>🔒</span> Change Password
          </h2>
          <form onSubmit={handlePasswordChange}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400 }}>
              <div>
                <label style={labelStyle}>Current Password</label>
                <input
                  style={inputStyle}
                  type="password"
                  value={passwords.current}
                  onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>New Password</label>
                <input
                  style={inputStyle}
                  type="password"
                  value={passwords.newPassword}
                  onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                  placeholder="Enter new password (min 6 characters)"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label style={labelStyle}>Confirm New Password</label>
                <input
                  style={inputStyle}
                  type="password"
                  value={passwords.confirm}
                  onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <button type="submit" style={{
                padding: '12px 24px', borderRadius: 12, border: 'none',
                background: '#6F4E37', color: '#fff', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', width: 'fit-content',
              }}>
                Update Password
              </button>
            </div>
          </form>
        </div>

        {/* System Info Card */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1c1917', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>ℹ️</span> System Information
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Application', value: 'CoffeeHub v1.0' },
              { label: 'Backend', value: 'Spring Boot 3.4.1' },
              { label: 'Frontend', value: 'React 18.2' },
              { label: 'Database', value: 'PostgreSQL 16' },
              { label: 'Domain', value: 'coffee-shop-diana.com' },
              { label: 'SSL', value: "Let's Encrypt" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f0eb' }}>
                <span style={{ color: '#78716c', fontSize: 14 }}>{label}</span>
                <span style={{ color: '#1c1917', fontSize: 14, fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        {isSuper && (
          <div style={{ ...cardStyle, border: '1px solid #fecaca' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#991b1b', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22 }}>⚠️</span> Danger Zone
            </h2>
            <p style={{ color: '#78716c', fontSize: 14, marginBottom: 16 }}>
              These actions are irreversible. Please be careful.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => toast.info('Database export is not yet implemented')}
                style={{
                  padding: '10px 20px', borderRadius: 10, border: '1px solid #d6d3d1',
                  background: '#fff', color: '#57534e', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>
                Export Database
              </button>
              <button
                onClick={() => toast.warn('This feature is disabled for safety')}
                style={{
                  padding: '10px 20px', borderRadius: 10, border: '1px solid #fecaca',
                  background: '#fff', color: '#991b1b', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>
                Clear All Data
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
