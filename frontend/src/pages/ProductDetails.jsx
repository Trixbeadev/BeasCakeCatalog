import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { listProducts } from '../api';
import Navbar from '../components/Navbar';

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      const products = await listProducts();

      const found = products.find(
        p => p.id === Number(id)
      );

      setProduct(found);
    }

    fetchProduct();
  }, [id]);

  if (!product) {
    return <p>Produto nÃ£o encontrado.</p>;
  }

  return (
    <div>
      <Navbar />

      <div style={styles.container}>
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

        <div style={styles.info}>
          <h1>{product.name}</h1>

          <p style={styles.description}>
            {product.description}
          </p>

          <p style={styles.price}>
            R$ {product.price.toFixed(2)}
          </p>

          <p>
            Estoque disponÃ­vel: {product.stock}
          </p>

          <Link to="/" style={styles.button}>
            Voltar
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '40px',
    padding: '40px',
    alignItems: 'center',
  },

  image: {
    width: '400px',
    borderRadius: '0',
  },

  noImage: {
    width: '400px',
    height: '400px',
    background: '#ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  info: {
    flex: 1,
  },

  description: {
    margin: '20px 0',
    color: '#555',
  },

  price: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#4A2A1F',
  },

  button: {
    display: 'inline-block',
    marginTop: '20px',
    background: '#D98F89',
    color: '#fff',
    padding: '10px 15px',
    borderRadius: '6px',
    textDecoration: 'none',
  },
};

