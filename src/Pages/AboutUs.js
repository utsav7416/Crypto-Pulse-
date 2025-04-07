import React from 'react';

const AboutUs = () => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.heading}>About Us</h1>

        <img
          src="https://t3.ftcdn.net/jpg/12/31/58/14/240_F_1231581434_boVgpE7vi2ybSIypddNemcskQ7rDYcJ6.jpg"
          alt="Crypto Illustration"
          style={styles.heroImage}
        />

        <p style={styles.text}>
          Welcome to <span style={styles.brand}>Crypto Pulse</span> – your ultimate companion in navigating the fast-paced world of cryptocurrency!
        </p>

        <p style={styles.text}>
          Our platform delivers real-time price tracking, historical data, and market trends for thousands of cryptocurrencies. Whether you're a curious beginner or a seasoned trader, we provide accurate and reliable insights to support your decisions.
        </p>

        <img
          src="https://as2.ftcdn.net/v2/jpg/10/79/29/43/1000_F_1079294339_h10foZ63Rr9Utio5ozcJhzWDZtN05UKO.jpg"
          alt="Crypto Team"
          style={styles.sectionImage}
        />

        <p style={styles.text}>
          Our team is made up of blockchain developers, financial analysts, and data engineers who are passionate about decentralization and innovation. Together, we aim to simplify crypto for everyone.
        </p>

        <p style={styles.text}>
          We’re constantly building, evolving, and listening to our community. If you have feedback or feature requests, don’t hesitate to <a href="mailto:info@cryptotracker.com" style={styles.link}>reach out</a>.
        </p>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundColor: '#14161a',
    color: '#fff',
    minHeight: '100vh',
    padding: '40px 20px',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: 'Segoe UI, sans-serif',
    lineHeight: '1.8',
  },
  heading: {
    fontSize: '2.7em',
    marginBottom: '30px',
    textAlign: 'center',
    color: '#FFD700',
  },
  text: {
    fontSize: '1.25em',
    marginBottom: '25px',
  },
  heroImage: {
    width: '100%',
    maxHeight: '350px',
    objectFit: 'cover',
    borderRadius: '16px',
    marginBottom: '30px',
  },
  sectionImage: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'cover',
    borderRadius: '12px',
    margin: '40px 0 30px',
  },
  link: {
    color: '#FFD700',
    textDecoration: 'underline',
  },
  brand: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
};

export default AboutUs;
