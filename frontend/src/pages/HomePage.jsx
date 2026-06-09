import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { listProducts } from '../api';
import Navbar from '../components/Navbar';

const whatsappUrl = 'https://wa.me/5511973301436';

function formatPrice(price) {
  return Number(price).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await listProducts();
        setProducts(data);
      } catch (err) {
        setError('Nao foi possivel carregar os sabores.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <div style={styles.page}>
      <Navbar />

      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>Bea's Cake</h1>

          <p style={styles.subtitle}>
            Camadas de amor em cada colherada.
          </p>

          <p style={styles.text}>
            Bolos de pote artesanais feitos com carinho.
          </p>

          <a href={whatsappUrl} target="_blank" style={styles.button}>
            Fazer Pedido
          </a>
        </div>

        <img
          src="/assets/hero-bolos-de-pote.jpeg"
          alt="Bolos de pote Bea's Cake"
          style={styles.heroImage}
        />
      </section>

      <section style={styles.showcase}>
        <div style={styles.showcaseText}>
          <span style={styles.eyebrow}>Feito com carinho</span>

          <h2 style={styles.showcaseTitle}>
            Bolos de pote para presentear e saborear
          </h2>

          <p style={styles.showcaseDescription}>
            Camadas bem recheadas, sabores variados e aquele visual que ja da
            vontade de pedir.
          </p>

          <a href={whatsappUrl} target="_blank" style={styles.secondaryButton}>
            Pedir pelo WhatsApp
          </a>
        </div>

        <div style={styles.showcaseGallery}>
          <img
            src="/assets/vitrine-bolos-pote.jpeg"
            alt="Bolos de pote empilhados"
            style={styles.showcaseMainImage}
          />

          <img
            src="/assets/cardapio-bolos-pote.jpeg"
            alt="Cardapio de bolos de pote"
            style={styles.showcasePoster}
          />
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Nossos Sabores</h2>

        {loading && <p style={styles.message}>Carregando sabores...</p>}

        {!loading && error && <p style={styles.message}>{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p style={styles.message}>Nenhum sabor cadastrado ainda.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div style={styles.grid}>
            {products.map(product => (
              <article key={product.id} style={styles.card}>
                {product.image ? (
                  <img
                    src={`/uploads/${product.image}`}
                    alt={product.name}
                    style={styles.cardImage}
                  />
                ) : (
                  <div style={styles.noImage}>Sem imagem</div>
                )}

                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{product.name}</h3>

                  <p style={styles.cardDescription}>
                    {product.description || "Sabor artesanal Bea's Cake."}
                  </p>

                  <p style={styles.price}>{formatPrice(product.price)}</p>

                  <p style={styles.stock}>Estoque: {product.stock}</p>

                  <div style={styles.cardActions}>
                    <Link
                      to={`/product/${product.id}`}
                      style={styles.detailsButton}
                    >
                      Ver detalhes
                    </Link>

                    <a href={whatsappUrl} target="_blank" style={styles.cardButton}>
                      Pedir
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section style={styles.diferenciais}>
        <h2 style={styles.sectionTitle}>Diferenciais</h2>

        <div style={styles.diffGrid}>
          <div style={styles.diffCard}>Feito com amor</div>
          <div style={styles.diffCard}>Camadas úmidas e recheadas</div>
          <div style={styles.diffCard}>Ingredientes selecionados</div>
          <div style={styles.diffCard}>Conservado sob refrigeração</div>
        </div>
      </section>

      <footer style={styles.footer}>
        <h3>Bea's Cake</h3>
        <p>Camadas de amor em cada colherada</p>
        <p>(11) 97330-1436</p>
        <p>2026 Bea's Cake</p>
      </footer>

      <a href={whatsappUrl} target="_blank" style={styles.whatsapp}>
        Peça Agora
      </a>
    </div>
  );
}

const styles = {
  page: {
    background: '#FFF7F2',
    fontFamily: 'Poppins, sans-serif',
    color: '#4A2A1F',
  },

  hero: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '60px',
    background: '#F6D8D2',
    flexWrap: 'wrap',
  },

  heroContent: {
    maxWidth: '500px',
  },

  title: {
    fontSize: '52px',
    fontFamily: 'Playfair Display, serif',
    marginBottom: '20px',
  },

  subtitle: {
    fontSize: '24px',
    marginBottom: '15px',
  },

  text: {
    marginBottom: '30px',
    fontSize: '18px',
  },

  button: {
    background: '#D98F89',
    color: '#fff',
    padding: '14px 24px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },

  heroImage: {
    width: '360px',
    maxWidth: '100%',
    maxHeight: '520px',
    objectFit: 'contain',
    borderRadius: '0',
    marginTop: '20px',
  },

  showcase: {
    display: 'grid',
    gridTemplateColumns: 'minmax(260px, 0.85fr) minmax(320px, 1.4fr)',
    gap: '36px',
    alignItems: 'center',
    padding: '64px 60px',
    background: '#FFF7F2',
  },

  showcaseText: {
    maxWidth: '430px',
  },

  eyebrow: {
    display: 'inline-block',
    marginBottom: '12px',
    color: '#D16F6B',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: '13px',
    letterSpacing: '0.08em',
  },

  showcaseTitle: {
    fontSize: '38px',
    lineHeight: 1.15,
    margin: '0 0 16px',
    fontFamily: 'Playfair Display, serif',
  },

  showcaseDescription: {
    fontSize: '17px',
    lineHeight: 1.6,
    marginBottom: '24px',
  },

  secondaryButton: {
    display: 'inline-block',
    background: '#4A2A1F',
    color: '#fff',
    padding: '13px 20px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },

  showcaseGallery: {
    display: 'grid',
    gridTemplateColumns: '1.35fr 0.85fr',
    gap: '18px',
    alignItems: 'stretch',
  },

  showcaseMainImage: {
    width: '100%',
    height: '100%',
    minHeight: '360px',
    objectFit: 'cover',
    borderRadius: '0',
  },

  showcasePoster: {
    width: '100%',
    height: '100%',
    maxHeight: '520px',
    objectFit: 'cover',
    objectPosition: 'top center',
    borderRadius: '0',
  },

  section: {
    padding: '60px 40px',
  },

  sectionTitle: {
    textAlign: 'center',
    fontSize: '40px',
    marginBottom: '40px',
    fontFamily: 'Playfair Display, serif',
  },

  message: {
    textAlign: 'center',
    fontSize: '18px',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '25px',
  },

  card: {
    background: '#fff',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
  },

  cardImage: {
    width: '100%',
    height: '240px',
    objectFit: 'cover',
  },

  noImage: {
    height: '240px',
    background: '#F5E9E2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#7A5A50',
  },

  cardContent: {
    padding: '25px',
  },

  cardTitle: {
    fontSize: '24px',
    margin: '0 0 15px',
  },

  cardDescription: {
    marginBottom: '15px',
    color: '#555',
    minHeight: '48px',
  },

  price: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },

  stock: {
    marginBottom: '20px',
    color: '#7A5A50',
  },

  cardActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },

  detailsButton: {
    display: 'inline-block',
    background: '#4A2A1F',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },

  cardButton: {
    display: 'inline-block',
    background: '#D98F89',
    color: '#fff',
    padding: '10px 18px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },

  diferenciais: {
    padding: '60px 40px',
    background: '#F5E9E2',
  },

  diffGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
  },

  diffCard: {
    background: '#fff',
    padding: '25px',
    borderRadius: '15px',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  footer: {
    background: '#4A2A1F',
    color: '#fff',
    textAlign: 'center',
    padding: '40px 20px',
  },

  whatsapp: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: '#25D366',
    color: '#fff',
    padding: '15px 20px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  },
};

