import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const NotFoundPage = () => (
  <div className="page-bg" style={{paddingTop: '150px', textAlign: 'center', minHeight: '80vh'}}>
    <h1 style={{fontSize: '72px', color: 'var(--primary)', marginBottom: '16px'}}>404</h1>
    <p style={{fontSize: '20px', color: '#78716c', marginBottom: '32px'}}>Page not found</p>
    <Link to="/" className="btn btn-primary">Back to Home</Link>
  </div>
);

export default NotFoundPage;
