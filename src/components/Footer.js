import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .footer-link:hover {
            color: #fff700;
            transform: scale(1.05);
          }

          .footer-email:hover {
            opacity: 0.8;
          }
        `}
      </style>
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.links}>
            <Link to="/about-us" style={styles.link} className="footer-link">
              About Us
            </Link>
            <Link to="/terms-of-service" style={styles.link} className="footer-link">
              Terms of Service
            </Link>
            <Link to="/disclaimer" style={styles.link} className="footer-link">
              Disclaimer
            </Link>
          </div>

          <div style={styles.contact}>
            <a href="mailto:info@cryptopulse.com" style={styles.email} className="footer-email">
              info@cryptopulse.com
            </a>
          </div>

          <div style={styles.copy}>
            &copy; 2025 Crypto Pulse. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

const styles = {
  footer: {
    width: '100%',
    backgroundColor: '#000',
    color: '#fff',
    padding: '60px 0', 
    marginTop: 'auto',
    animation: 'fadeIn 1s ease-in-out',
    boxShadow: '0 -6px 25px rgba(255, 215, 0, 0.25)',
    borderTop: '2px solid #FFD700',
  },
  container: {
    width: '90%',
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
  },
  links: {
    marginBottom: '30px',
  },
  link: {
    color: '#FFD700',
    textDecoration: 'none',
    margin: '0 30px',
    fontWeight: 'bold',
    fontSize: '1.5em',
    transition: 'color 0.3s ease, transform 0.3s ease',
  },
  contact: {
    marginBottom: '25px',
  },
  email: {
    color: '#FFD700',
    textDecoration: 'underline',
    fontSize: '1.3em',
    transition: 'opacity 0.3s ease',
  },
  copy: {
    fontSize: '1.2em',
    opacity: 0.85,
  },
};

export default Footer;
