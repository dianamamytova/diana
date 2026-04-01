import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: '\uD83D\uDCCA', path: '/admin' },
  { key: 'menu', label: 'Menu', icon: '\uD83C\uDF7D\uFE0F', path: '/admin/menu' },
  { key: 'reservations', label: 'Reservations', icon: '\uD83D\uDCC5', path: '/admin/reservations' },
  { key: 'reviews', label: 'Reviews', icon: '\u2B50', path: '/admin/reviews' },
  { key: 'analytics', label: 'Analytics', icon: '\uD83D\uDCC8', path: '/admin/analytics' },
  { key: 'branches', label: 'Branches', icon: '\uD83C\uDFE0', path: '/admin/branches' },
];

const AdminLayout = ({ children, activeItem }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <h2>COFFEEHUB</h2>
          <span>Admin Portal</span>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`admin-sidebar-link ${activeItem === item.key ? 'admin-sidebar-link-active' : ''}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <Link to="/admin" className="admin-sidebar-link">
            <span className="sidebar-icon">{'\u2699\uFE0F'}</span>
            Settings
          </Link>
          <button className="admin-sidebar-link" onClick={handleLogout}>
            <span className="sidebar-icon">{'\uD83D\uDEAA'}</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
