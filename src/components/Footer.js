import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.links}>
          <Link to="/about-us" style={styles.link}>
            About Us
          </Link>
          <Link to="/terms-of-service" style={styles.link}>
            Terms of Service
          </Link>
          <Link to="/disclaimer" style={styles.link}>
            Disclaimer
          </Link>
        </div>

        <div style={styles.contact}>
          <a href="mailto:info@cryptopulse.com" style={styles.email}>
            info@cryptopulse.com
          </a>
        </div>

        <div style={styles.copy}>
          &copy; 2025 Crypto Pulse. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '30px 0',
    marginTop: 'auto',
  },
  container: {
    width: '90%',
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
  },
  links: {
    marginBottom: '15px',
  },
  link: {
    color: '#FFD700',
    textDecoration: 'none',
    margin: '0 20px',
    fontWeight: 'bold',
    fontSize: '1.2em',
  },
  contact: {
    marginBottom: '15px',
  },
  email: {
    color: '#FFD700',
    textDecoration: 'underline',
    fontSize: '1.1em',
  },
  copy: {
    fontSize: '1em',
  },
};

export default Footer;
