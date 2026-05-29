import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { listProducts, createProduct, updateProduct, deleteProduct } from '../api.js';

const empty = { name: '', description: '', price: '', stock: '', imageFile: null };

const s = {
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
  newBtn: {
    background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '4px',
    padding: '0.5rem 1rem', cursor: 'pointer', marginBottom: '1rem',
  },
  formBox: {
    background: '#fff', padding: '1.5rem', borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)', marginBottom: '1.5rem', maxWidth: '520px',
  },
  formTitle: { margin: '0 0 1rem', color: '#333' },
  label: { display: 'block', marginBottom: '0.2rem', fontSize: '0.875rem', color: '#555' },
  input: {
    width: '100%', padding: '0.4rem 0.6rem', marginBottom: '0.75rem',
    border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box',
  },
  fileArea: {
    border: '2px dashed #c7d2fe', borderRadius: '6px', padding: '1rem',
    textAlign: 'center', marginBottom: '0.75rem', cursor: 'pointer',
    background: '#f5f3ff', color: '#6366f1', fontSize: '0.875rem',
  },
  preview: {
    display: 'block', maxWidth: '100%', maxHeight: '140px',
    margin: '0.5rem auto 0', borderRadius: '4px',
  },
  currentImg: {
    display: 'block', maxWidth: '100%', maxHeight: '100px',
    margin: '0.4rem 0', borderRadius: '4px', border: '1px solid #e5e7eb',
  },
  removeImgBtn: {
    background: 'none', border: 'none', color: '#dc2626',
    cursor: 'pointer', fontSize: '0.8rem', padding: 0, marginBottom: '0.5rem',
  },
  formActions: { display: 'flex', gap: '0.5rem' },
  saveBtn: {
    background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px',
    padding: '0.45rem 1rem', cursor: 'pointer',
  },
  cancelBtn: {
    background: '#6b7280', color: '#fff', border: 'none', borderRadius: '4px',
    padding: '0.45rem 1rem', cursor: 'pointer',
  },
  table: {
    width: '100%', borderCollapse: 'collapse', background: '#fff',
    borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
  th: { background: '#4f46e5', color: '#fff', padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.875rem' },
  td: { padding: '0.6rem 1rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem', color: '#374151', verticalAlign: 'middle' },
  thumb: { width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' },
  noImg: {
    width: '48px', height: '48px', background: '#f3f4f6', borderRadius: '4px',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    color: '#9ca3af', fontSize: '20px',
  },
  editBtn: {
    background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '4px',
    padding: '0.3rem 0.6rem', cursor: 'pointer', marginRight: '0.4rem',
  },
  deleteBtn: {
    background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px',
    padding: '0.3rem 0.6rem', cursor: 'pointer',
  },
  error: { color: '#dc2626', marginBottom: '1rem' },
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const fileInputRef     = useRef(null);

  const [products, setProducts]     = useState([]);
  const [showForm, setShowForm]     = useState(false);
  const [editingId, setEditingId]   = useState(null);
  const [form, setForm]             = useState(empty);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [keepImage, setKeepImage]   = useState(true);
  const [error, setError]           = useState('');

  useEffect(() => { loadProducts(); }, []);

  async function loadProducts() {
    try { setProducts(await listProducts()); }
    catch (err) { setError(err.message); }
  }

  function openNew() {
    setEditingId(null);
    setForm(empty);
    setPreviewUrl(null);
    setKeepImage(false);
    setShowForm(true);
    setError('');
  }

  function openEdit(product) {
    setEditingId(product.id);
    setForm({ name: product.name, description: product.description || '', price: String(product.price), stock: String(product.stock), imageFile: null });
    setPreviewUrl(null);
    setKeepImage(true);
    setShowForm(true);
    setError('');
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(empty);
    setPreviewUrl(null);
    setKeepImage(false);
    setError('');
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, imageFile: file }));
    setPreviewUrl(URL.createObjectURL(file));
    setKeepImage(false);
  }

  function removeImage() {
    setForm(f => ({ ...f, imageFile: null }));
    setPreviewUrl(null);
    setKeepImage(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('price', form.price);
    fd.append('stock', form.stock);

    if (form.imageFile) {
      fd.append('image', form.imageFile);
    } else {
      fd.append('keepImage', String(keepImage));
    }

    try {
      if (editingId) {
        const updated = await updateProduct(editingId, fd);
        setProducts(prev => prev.map(p => (p.id === editingId ? updated : p)));
      } else {
        const created = await createProduct(fd);
        setProducts(prev => [...prev, created]);
      }
      cancelForm();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Confirma exclusão do produto?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/backoffice', { replace: true });
  }

  const editingProduct = editingId ? products.find(p => p.id === editingId) : null;

  return (
    <div style={s.page}>
      <header style={s.header}>
        <h1 style={s.headerTitle}>Gerência de Produtos</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>Olá, {user.username}</span>
          <button style={s.logoutBtn} onClick={handleLogout}>Sair</button>
        </div>
      </header>

      <div style={s.content}>
        {error && <p style={s.error}>{error}</p>}

        {!showForm && (
          <button style={s.newBtn} onClick={openNew}>+ Novo Produto</button>
        )}

        {showForm && (
          <div style={s.formBox}>
            <h3 style={s.formTitle}>{editingId ? 'Editar Produto' : 'Novo Produto'}</h3>

            <form onSubmit={handleSubmit}>
              <label style={s.label}>Nome *</label>
              <input style={s.input} value={form.name} required
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />

              <label style={s.label}>Descrição</label>
              <input style={s.input} value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />

              <label style={s.label}>Preço (R$) *</label>
              <input style={s.input} type="number" step="0.01" min="0" value={form.price} required
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />

              <label style={s.label}>Estoque *</label>
              <input style={s.input} type="number" min="0" value={form.stock} required
                onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />

              <label style={s.label}>Imagem do produto</label>

              {/* Imagem atual (modo edição) */}
              {editingProduct?.image && keepImage && !previewUrl && (
                <div>
                  <img src={`/uploads/${editingProduct.image}`} alt="imagem atual" style={s.currentImg} />
                  <button type="button" style={s.removeImgBtn} onClick={removeImage}>
                    ✕ Remover imagem
                  </button>
                </div>
              )}

              {/* Preview da nova imagem selecionada */}
              {previewUrl && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <img src={previewUrl} alt="preview" style={s.currentImg} />
                  <button type="button" style={s.removeImgBtn} onClick={removeImage}>
                    ✕ Cancelar seleção
                  </button>
                </div>
              )}

              {/* Área de upload */}
              {!previewUrl && !(editingProduct?.image && keepImage) && (
                <div style={s.fileArea} onClick={() => fileInputRef.current?.click()}>
                  Clique aqui para escolher uma imagem
                </div>
              )}

              {/* Botão para trocar imagem mesmo quando já há uma */}
              {(editingProduct?.image && keepImage) && !previewUrl && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <button type="button" style={{ ...s.removeImgBtn, color: '#4f46e5' }}
                    onClick={() => fileInputRef.current?.click()}>
                    Trocar imagem
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              <div style={s.formActions}>
                <button style={s.saveBtn} type="submit">Salvar</button>
                <button style={s.cancelBtn} type="button" onClick={cancelForm}>Cancelar</button>
              </div>
            </form>
          </div>
        )}

        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>ID</th>
              <th style={s.th}>Imagem</th>
              <th style={s.th}>Nome</th>
              <th style={s.th}>Descrição</th>
              <th style={s.th}>Preço</th>
              <th style={s.th}>Estoque</th>
              <th style={s.th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td style={s.td}>{p.id}</td>
                <td style={s.td}>
                  {p.image
                    ? <img src={`/uploads/${p.image}`} alt={p.name} style={s.thumb} />
                    : <span style={s.noImg}><i className="fas fa-box" /></span>
                  }
                </td>
                <td style={s.td}>{p.name}</td>
                <td style={s.td}>{p.description}</td>
                <td style={s.td}>R$ {p.price.toFixed(2)}</td>
                <td style={s.td}>{p.stock}</td>
                <td style={s.td}>
                  <button style={s.editBtn} onClick={() => openEdit(p)}>Editar</button>
                  <button style={s.deleteBtn} onClick={() => handleDelete(p.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
