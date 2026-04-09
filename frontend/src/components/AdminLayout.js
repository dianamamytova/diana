import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin' },
  { key: 'menu', label: 'Menu', icon: '🍽️', path: '/admin/menu' },
  { key: 'reservations', label: 'Reservations', icon: '📅', path: '/admin/reservations' },
  { key: 'reviews', label: 'Reviews', icon: '⭐', path: '/admin/reviews' },
  { key: 'analytics', label: 'Analytics', icon: '📈', path: '/admin/analytics' },
  { key: 'qr', label: 'QR Codes', icon: '📱', path: '/admin/qr' },
  { key: 'branches', label: 'Branches', icon: '🏠', path: '/admin/branches' },
];

const BOTTOM_ITEMS = [
  { key: 'settings', label: 'Settings', icon: '⚙️', path: '/admin/settings' },
];

const NavItem = ({ item, isActive, onClick, isButton }) => {
  const [hovered, setHovered] = useState(false);

  const style = {
    padding: '12px 24px',
    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: 500,
    textDecoration: 'none',
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    borderRadius: '0 24px 24px 0',
    background: isActive
      ? 'rgba(255,255,255,0.1)'
      : hovered
        ? 'rgba(255,255,255,0.05)'
        : 'transparent',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'background 0.2s',
  };

  const iconStyle = {
    width: 20,
    display: 'inline-block',
    textAlign: 'center',
    fontSize: 16,
    flexShrink: 0,
  };

  if (isButton) {
    return (
      <button
        style={style}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span style={iconStyle}>{item.icon}</span>
        {item.label}
      </button>
    );
  }

  return (
    <Link
      to={item.path}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={iconStyle}>{item.icon}</span>
      {item.label}
    </Link>
  );
};

const AdminLayout = ({ children, activeItem }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: 256,
          height: '100vh',
          background: '#422B22',
          borderRadius: '0 32px 32px 0',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 0',
          boxShadow: '20px 0 40px -10px rgba(42,23,15,0.08)',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ paddingLeft: 24, marginBottom: 32 }}>
            <h2
              style={{
                color: '#ffffff',
                fontSize: 18,
                fontWeight: 700,
                margin: 0,
                letterSpacing: '0.05em',
              }}
            >
              COFFEEHUB
            </h2>
            <span
              style={{
                color: '#D4A574',
                fontSize: 12,
                fontWeight: 400,
                marginTop: 4,
                display: 'block',
              }}
            >
              Admin Portal
            </span>
          </div>

          {/* Navigation */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {NAV_ITEMS.map((item) => (
              <NavItem
                key={item.key}
                item={item}
                isActive={activeItem === item.key}
              />
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {BOTTOM_ITEMS.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              isActive={activeItem === item.key}
            />
          ))}
          <NavItem
            item={{ key: 'logout', label: 'Logout', icon: '🚪' }}
            isActive={false}
            isButton
            onClick={handleLogout}
          />
        </div>
      </aside>

      {/* Content */}
      <main
        style={{
          marginLeft: 256,
          padding: '32px 40px',
          minHeight: '100vh',
          background: '#FFF8F6',
          flex: 1,
          boxSizing: 'border-box',
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
