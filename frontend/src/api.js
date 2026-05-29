// Requisições JSON simples
async function apiFetch(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Erro ${res.status}`);
  }

  return res.json();
}

// Requisições multipart/form-data (upload de arquivos)
// Não define Content-Type — o browser insere o boundary automaticamente
async function apiFetchForm(path, method, formData) {
  const res = await fetch(path, {
    method,
    credentials: 'include',
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Erro ${res.status}`);
  }

  return res.json();
}

export function login(username, password) {
  return apiFetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function logout() {
  return apiFetch('/api/logout', { method: 'POST' });
}

export function me() {
  return apiFetch('/api/me');
}

export function listProducts() {
  return apiFetch('/api/products');
}

// Cria produto com suporte a imagem via FormData
export function createProduct(formData) {
  return apiFetchForm('/api/products', 'POST', formData);
}

// Atualiza produto com suporte a troca de imagem via FormData
export function updateProduct(id, formData) {
  return apiFetchForm(`/api/products/${id}`, 'PUT', formData);
}

export function deleteProduct(id) {
  return apiFetch(`/api/products/${id}`, { method: 'DELETE' });
}
