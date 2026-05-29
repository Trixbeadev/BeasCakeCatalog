import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

const styles = {
  page: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', background: '#f0f2f5',
  },
  card: {
    background: '#fff', padding: '2rem', borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)', width: '100%', maxWidth: '360px',
  },
  title: { textAlign: 'center', marginBottom: '0.25rem', color: '#333' },
  subtitle: { textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#888' },
  label: { display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem', color: '#555' },
  input: {
    width: '100%', padding: '0.5rem 0.75rem', marginBottom: '1rem',
    border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%', padding: '0.6rem', background: '#4f46e5', color: '#fff',
    border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer',
  },
  error: { color: '#dc2626', marginBottom: '1rem', fontSize: '0.875rem' },
  hint: {
    marginTop: '1.25rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem',
    fontSize: '0.8rem', color: '#9ca3af', textAlign: 'center',
  },
  hintCode: {
    display: 'inline-block', background: '#f3f4f6', borderRadius: '3px',
    padding: '0.1rem 0.4rem', fontFamily: 'monospace', color: '#374151',
  },
};

export default function LoginPage() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(username, password);
      if (user.role === 'admin') {
        navigate('/backoffice/dashboard', { replace: true });
      } else {
        setError('Acesso restrito a administradores.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Backoffice</h2>
        <p style={styles.subtitle}>Área exclusiva para administradores</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Usuário</label>
          <input
            style={styles.input}
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            required
          />

          <label style={styles.label}>Senha</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={styles.hint}>
          Credenciais padrão:&nbsp;
          <span style={styles.hintCode}>admin</span> /&nbsp;
          <span style={styles.hintCode}>admin123</span>
        </div>
      </div>
    </div>
  );
}
