import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div style={styles.card}>
      {product.image ? (
        <img
          src={`/uploads/${product.image}`}
          alt={product.name}
          style={styles.image}
        />
      ) : (
        <div style={styles.noImage}>
          Sem imagem
        </div>
      )}

      <div style={styles.content}>
        <h2 style={styles.name}>
          {product.name}
        </h2>

        <p style={styles.description}>
          {product.description}
        </p>

        <p style={styles.price}>
          R$ {product.price.toFixed(2)}
        </p>

        <p style={styles.stock}>
          Estoque: {product.stock}
        </p>

        <Link
          to={`/product/${product.id}`}
          style={styles.button}
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },

  image: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
  },

  noImage: {
    height: '220px',
    background: '#ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    padding: '20px',
  },

  name: {
    marginBottom: '10px',
  },

  description: {
    color: '#555',
    minHeight: '60px',
  },

  price: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#4f46e5',
  },

  stock: {
    marginBottom: '20px',
  },

  button: {
    display: 'inline-block',
    background: '#4f46e5',
    color: '#fff',
    padding: '10px 15px',
    borderRadius: '6px',
    textDecoration: 'none',
  },
};