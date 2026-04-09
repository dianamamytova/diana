import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN');
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  const close = () => setOpen(false);

  const linkStyle = (active) => ({
    padding: '8px 14px', fontSize: 14, fontWeight: 500, textDecoration: 'none', borderRadius: 8,
    color: active ? '#6F4E37' : '#57534e', background: active ? 'rgba(111,78,55,0.08)' : 'transparent',
    display: 'block', whiteSpace: 'nowrap',
  });

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(80,69,62,0.1)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '0 16px', height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link to="/" style={{ fontSize: 20, fontWeight: 700, color: '#6F4E37', textDecoration: 'none' }} onClick={close}>
            CoffeeHub
          </Link>

          {/* Desktop links */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Link to="/" style={linkStyle(isActive('/'))} onClick={close}>Home</Link>
            <Link to="/menu" style={linkStyle(isActive('/menu'))} onClick={close}>Menu</Link>
            <Link to="/branches" style={linkStyle(isActive('/branch'))} onClick={close}>Branches</Link>
            {user && (
              <>
                <Link to="/reservation" style={linkStyle(isActive('/reservation'))} onClick={close}>Book a Table</Link>
                <Link to="/dashboard" style={linkStyle(isActive('/dashboard'))} onClick={close}>Dashboard</Link>
                {isAdmin && <Link to="/admin" style={linkStyle(isActive('/admin'))} onClick={close}>Admin Panel</Link>}
              </>
            )}
          </div>

          {/* Desktop actions */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', background: '#D4A574', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600,
                  }}>{initials}</div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#1c1917' }}>{user.name}</span>
                </div>
                <button onClick={() => { logout(); navigate('/'); }} style={{
                  padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  background: 'transparent', color: '#6F4E37', border: '1px solid #d6d3d1',
                }}>Logout</button>
              </>
            ) : (
              <Link to="/login" style={{
                padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                background: '#6F4E37', color: 'white', textDecoration: 'none',
              }}>Sign In</Link>
            )}
          </div>

          {/* Hamburger button */}
          <button className="nav-hamburger" onClick={() => setOpen(!open)} style={{
            display: 'none', background: 'none', border: 'none', cursor: 'pointer',
            flexDirection: 'column', gap: 5, padding: 8,
          }}>
            <span style={{ width: 22, height: 2, background: '#6F4E37', borderRadius: 2, transition: 'all 0.3s',
              transform: open ? 'rotate(45deg) translateY(7px)' : 'none' }} />
            <span style={{ width: 22, height: 2, background: '#6F4E37', borderRadius: 2, transition: 'all 0.3s',
              opacity: open ? 0 : 1 }} />
            <span style={{ width: 22, height: 2, background: '#6F4E37', borderRadius: 2, transition: 'all 0.3s',
              transform: open ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="nav-mobile-menu" style={{
            padding: '8px 16px 16px', background: 'white',
            borderTop: '1px solid #f5f0eb', display: 'none',
          }}>
            <Link to="/" style={linkStyle(isActive('/'))} onClick={close}>Home</Link>
            <Link to="/menu" style={linkStyle(isActive('/menu'))} onClick={close}>Menu</Link>
            <Link to="/branches" style={linkStyle(isActive('/branch'))} onClick={close}>Branches</Link>
            {user && (
              <>
                <Link to="/reservation" style={linkStyle(isActive('/reservation'))} onClick={close}>Book a Table</Link>
                <Link to="/dashboard" style={linkStyle(isActive('/dashboard'))} onClick={close}>Dashboard</Link>
                {isAdmin && <Link to="/admin" style={linkStyle(isActive('/admin'))} onClick={close}>Admin Panel</Link>}
              </>
            )}
            <div style={{ borderTop: '1px solid #f5f0eb', marginTop: 8, paddingTop: 12 }}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', background: '#D4A574', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600,
                    }}>{initials}</div>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{user.name}</span>
                  </div>
                  <button onClick={() => { logout(); navigate('/'); close(); }} style={{
                    padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    background: '#6F4E37', color: 'white', border: 'none',
                  }}>Logout</button>
                </div>
              ) : (
                <Link to="/login" onClick={close} style={{
                  display: 'block', textAlign: 'center', padding: '10px', borderRadius: 10,
                  background: '#6F4E37', color: 'white', textDecoration: 'none', fontWeight: 600,
                }}>Sign In</Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* CSS for responsive toggle */}
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-mobile-menu { display: block !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
