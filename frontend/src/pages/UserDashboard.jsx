import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { listProducts } from '../api.js';

const styles = {
  page: { minHeight: '100vh', background: '#f0f2f5' },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: '#4f46e5', color: '#fff', padding: '1rem 2rem',
  },
  headerTitle: { margin: 0, fontSize: '1.25rem' },
  logoutBtn: {
    background: 'transparent', border: '1px solid #fff', color: '#fff',
    padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer',
  },
  content: { padding: '2rem' },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1rem', marginTop: '1.5rem',
  },
  card: {
    background: '#fff', borderRadius: '8px', padding: '1rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
  cardName: { margin: '0 0 0.5rem', color: '#333' },
  cardDesc: { color: '#666', fontSize: '0.875rem', marginBottom: '0.75rem' },
  cardPrice: { fontWeight: 'bold', color: '#4f46e5' },
  cardStock: { fontSize: '0.8rem', color: '#888', marginTop: '0.25rem' },
  error: { color: '#dc2626' },
};

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError]       = useState('');

  useEffect(() => {
    listProducts()
      .then(setProducts)
      .catch(err => setError(err.message));
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Catálogo de Produtos</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>Olá, {user.username}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Sair</button>
        </div>
      </header>

      <div style={styles.content}>
        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.grid}>
          {products.map(p => (
            <div key={p.id} style={styles.card}>
              <h3 style={styles.cardName}>{p.name}</h3>
              <p style={styles.cardDesc}>{p.description}</p>
              <p style={styles.cardPrice}>R$ {p.price.toFixed(2)}</p>
              <p style={styles.cardStock}>Estoque: {p.stock} un.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
