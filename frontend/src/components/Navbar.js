import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN');

  const isActive = (path) => location.pathname === path;

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          CoffeeHub
        </Link>

        <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links${menuOpen ? ' open' : ''}`}>
          <Link
            to="/"
            className={`nav-link${isActive('/') ? ' active' : ''}`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            to="/menu"
            className={`nav-link${isActive('/menu') ? ' active' : ''}`}
            onClick={closeMenu}
          >
            Menu
          </Link>
          <Link
            to="/branch/1"
            className={`nav-link${location.pathname.startsWith('/branch') ? ' active' : ''}`}
            onClick={closeMenu}
          >
            Branches
          </Link>

          {user && (
            <>
              <Link
                to="/reservation"
                className={`nav-link${isActive('/reservation') ? ' active' : ''}`}
                onClick={closeMenu}
              >
                Book a Table
              </Link>
              <Link
                to="/dashboard"
                className={`nav-link${isActive('/dashboard') ? ' active' : ''}`}
                onClick={closeMenu}
              >
                Dashboard
              </Link>
              <Link
                to="/review"
                className={`nav-link${isActive('/review') ? ' active' : ''}`}
                onClick={closeMenu}
              >
                Reviews
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`nav-link${location.pathname.startsWith('/admin') ? ' active' : ''}`}
                  onClick={closeMenu}
                >
                  Admin Panel
                </Link>
              )}
            </>
          )}

          <div className="navbar-actions">
            {user ? (
              <>
                <div className="navbar-user">
                  <div className="navbar-avatar">{getInitials(user.name)}</div>
                  <span>{user.name}</span>
                </div>
                <button className="navbar-logout" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-signin-btn" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="navbar-register-btn" onClick={closeMenu}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
