import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const COFFEE_SHOP = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (error) {
      const message =
        error.response?.data?.message || error.response?.data || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    border: '1px solid #e7e5e4',
    borderRadius: 12,
    padding: '14px 16px',
    paddingLeft: '2.5rem',
    fontSize: '0.95rem',
    color: '#1c1917',
    outline: 'none',
    background: '#fff',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: '0.5px',
    color: '#78716c',
    fontWeight: 600,
    marginBottom: '0.4rem',
  };

  const iconStyle = {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#A89E95',
    fontSize: '1rem',
    pointerEvents: 'none',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'row' }}>
      {/* Left: Image Panel */}
      <div
        style={{
          width: '50%',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img
          src={COFFEE_SHOP}
          alt="Coffee shop interior"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(44,24,16,0.85) 0%, rgba(44,24,16,0.3) 100%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '3rem',
          zIndex: 1,
        }}>
          <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
            The Art of Perfect Brewing
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', maxWidth: 360, margin: 0 }}>
            Your journey to the perfect cup starts here.
          </p>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div
        style={{
          width: '50%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem 2rem',
          background: '#fff',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: 420, width: '100%' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#6F4E37', marginBottom: '2rem' }}>
            CoffeeHub
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1c1917', margin: '0 0 0.4rem' }}>
            Create Your Account
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#78716c', margin: '0 0 2rem' }}>
            Join CoffeeHub for seamless reservations
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle}>&#128100;</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your full name"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Email</label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle}>&#9993;</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={iconStyle}>&#128274;</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a password"
                  style={inputStyle}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                background: '#6F4E37',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '0.75rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
                transition: 'background 0.2s',
              }}
            >
              {submitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            margin: '1.5rem 0',
          }}>
            <div style={{ flex: 1, height: 1, background: '#e7e5e4' }} />
            <span style={{ fontSize: '0.8rem', color: '#a8a29e', whiteSpace: 'nowrap' }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: '#e7e5e4' }} />
          </div>

          <button
            type="button"
            onClick={() => { const base = (process.env.REACT_APP_API_URL || '').replace('/api', ''); window.location.href = base + '/oauth2/authorization/google'; }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: '#fff',
              color: '#1c1917',
              border: '1px solid #e7e5e4',
              borderRadius: 12,
              padding: '0.75rem',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59a14.5 14.5 0 010-9.18l-7.98-6.19a24.003 24.003 0 000 21.56l7.98-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Sign in with Google
          </button>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#78716c' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6F4E37', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>

        {/* Footer links pinned to bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '1.5rem',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            fontSize: '0.8rem',
            color: '#A89E95',
          }}
        >
          <Link to="/privacy" style={{ color: '#A89E95', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: '#A89E95', textDecoration: 'none' }}>Terms of Service</Link>
          <Link to="/contact" style={{ color: '#A89E95', textDecoration: 'none' }}>Contact Us</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
