import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const OAuth2Redirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleOAuth2 = async () => {
      const token = searchParams.get('token');
      if (token) {
        localStorage.setItem('token', token);
        try {
          // Reload the page to trigger AuthContext to pick up the new token
          // and load user data via GET /api/auth/me
          window.location.href = '/dashboard';
        } catch (error) {
          console.error('OAuth2 redirect failed:', error);
          navigate('/login');
        }
      } else {
        console.error('No token found in OAuth2 redirect URL');
        navigate('/login');
      }
    };
    handleOAuth2();
  }, [searchParams, navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.spinner} />
      <p style={styles.text}>Signing you in...</p>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #eee',
    borderTop: '4px solid #6b4226',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  text: {
    color: '#666',
    fontSize: '1.1rem',
  },
};

export default OAuth2Redirect;
