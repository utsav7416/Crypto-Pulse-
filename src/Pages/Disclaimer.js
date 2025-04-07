import React from 'react';

const Disclaimer = () => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Disclaimer</h1>

        <img
          src="https://t4.ftcdn.net/jpg/10/98/39/59/240_F_1098395974_Mv1Q6VRE4VUq2xNv2OQyZs6X4SnIllGc.jpg"
          alt="Crypto Risk"
          style={styles.image}
        />

        <p style={styles.text}>
          The content provided by <strong>Crypto Pulse</strong> is intended for informational purposes only and should not be interpreted as investment advice, financial guidance, or legal counsel.
        </p>

        <p style={styles.text}>
          Although we aim to keep our data timely and accurate, cryptocurrency markets are volatile, and the information displayed may not reflect real-time prices or events. Always verify data independently before making financial decisions.
        </p>

        <p style={styles.text}>
          You acknowledge that any reliance on the service is at your own risk. <strong>Crypto Pulse</strong> shall not be held liable for any losses, damages, or legal issues arising from the use of the platform.
        </p>

        <p style={styles.text}>
          We highly recommend consulting a certified financial advisor or conducting personal due diligence before making any investment or trading decisions in the crypto space.
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
  text: {
    fontSize: '1.15em',
    marginBottom: '25px',
  },
  image: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'cover',
    borderRadius: '16px',
    marginBottom: '30px',
  },
};

export default Disclaimer;
