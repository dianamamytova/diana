import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-brand">CoffeeHub</div>
          <p>Crafted for the Digital Sommelier</p>
        </div>

        <div className="footer-section">
          <div className="footer-title">Discover</div>
          <ul>
            <li><Link to="/menu" className="footer-link">Menu</Link></li>
            <li><Link to="/branch/1" className="footer-link">Branches</Link></li>
            <li><span className="footer-link">Careers</span></li>
          </ul>
        </div>

        <div className="footer-section">
          <div className="footer-title">Support</div>
          <ul>
            <li><span className="footer-link">Contact Us</span></li>
            <li><span className="footer-link">Privacy Policy</span></li>
            <li><span className="footer-link">Terms of Service</span></li>
          </ul>
        </div>

        <div className="footer-section">
          <div className="footer-title">Connect</div>
          <ul>
            <li><span className="footer-link">Instagram</span></li>
            <li><span className="footer-link">Twitter</span></li>
            <li><span className="footer-link">Facebook</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; 2024 CoffeeHub. Crafted for the Digital Sommelier.
      </div>
    </footer>
  );
};

export default Footer;
