import React from 'react';

const TermsOfService = () => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Terms of Service</h1>

        <p style={styles.text}>
          By accessing and using <strong>Crypto Pulse</strong>, you agree to comply with and be bound by the following terms and conditions.
        </p>

        <h2 style={styles.subheading}>1. Use of Service</h2>
        <p style={styles.text}>
          Crypto Pulse is provided for informational purposes only. You understand and agree that any use of the data or insights is at your own risk. We do not provide investment, financial, or legal advice.
        </p>

        <h2 style={styles.subheading}>2. User Responsibilities</h2>
        <p style={styles.text}>
          You are responsible for maintaining the confidentiality of your account (if applicable), and you accept responsibility for all activities that occur under your credentials.
        </p>

        <h2 style={styles.subheading}>3. Data Accuracy</h2>
        <p style={styles.text}>
          While we strive to provide accurate and real-time cryptocurrency data, we cannot guarantee the accuracy, completeness, or timeliness of the information. Crypto markets are volatile and rapidly changing.
        </p>

        <h2 style={styles.subheading}>4. Modification of Terms</h2>
        <p style={styles.text}>
          We reserve the right to update or change these terms at any time without notice. Continued use of the service after such modifications constitutes your acknowledgment and acceptance of the revised terms.
        </p>

        <h2 style={styles.subheading}>5. Termination</h2>
        <p style={styles.text}>
          We reserve the right to suspend or terminate your access to the platform at our sole discretion, without prior notice or liability, for any reason.
        </p>

        <p style={styles.text}>
          If you do not agree to these Terms of Service, please refrain from using Crypto Pulse.
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
    fontSize: '2.5em',
    marginBottom: '30px',
    textAlign: 'center',
    color: '#FFD700',
  },
  subheading: {
    fontSize: '1.5em',
    marginTop: '30px',
    marginBottom: '10px',
    color: '#FFD700',
  },
  text: {
    fontSize: '1.15em',
    marginBottom: '20px',
  },
};

export default TermsOfService;
