import React from 'react';
import { Link } from 'react-router-dom';

const S = {
  footer: { background: '#FFF1EC', borderRadius: '32px 32px 0 0', padding: '64px 24px 32px' },
  inner: { maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40 },
  brand: { fontSize: 18, fontWeight: 700, color: '#6F4E37', marginBottom: 8 },
  desc: { fontSize: 14, color: '#78716c', lineHeight: 1.6 },
  title: { fontSize: 13, fontWeight: 600, color: '#1c1917', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },
  link: { fontSize: 14, color: '#78716c', textDecoration: 'none', display: 'block', marginBottom: 8 },
  bottom: { maxWidth: 1200, margin: '40px auto 0', paddingTop: 24, borderTop: '1px solid rgba(111,78,55,0.1)', textAlign: 'center' },
  copy: { fontSize: 13, color: '#a8a29e' },
};

const Footer = () => (
  <footer style={S.footer}>
    <div style={S.inner}>
      <div>
        <div style={S.brand}>CoffeeHub</div>
        <p style={S.desc}>Crafting the digital standard for high-end coffee retail and management.</p>
      </div>
      <div>
        <div style={S.title}>Discover</div>
        <Link to="/menu" style={S.link}>Menu</Link>
        <Link to="/branches" style={S.link}>Branches</Link>
      </div>
      <div>
        <div style={S.title}>Legal</div>
        <span style={S.link}>Privacy Policy</span>
        <span style={S.link}>Terms of Service</span>
      </div>
      <div>
        <div style={S.title}>Connect</div>
        <span style={S.link}>Contact</span>
        <span style={S.link}>Instagram</span>
      </div>
    </div>
    <div style={S.bottom}>
      <p style={S.copy}>© 2026 CoffeeHub. Crafted for the Digital Sommelier.</p>
    </div>
  </footer>
);

export default Footer;
