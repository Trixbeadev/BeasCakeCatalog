import React from 'react';

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <h1 style={styles.logo}>
        🍰 Bea's Cake
      </h1>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#D98F89',
    padding: '20px 40px',
  },

  logo: {
    color: '#fff',
    fontFamily: 'Playfair Display, serif',
    fontSize: '32px',
  },
};