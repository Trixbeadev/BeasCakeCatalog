# Projeto Catálogo de Produtos

Projeto base para a atividade de **Programação Web para Front-End (AC4)**.

O backend já está pronto e fornece uma API REST para gerenciar um catálogo de produtos. A sua tarefa é **desenvolver o site do catálogo** utilizando as rotas disponíveis.

---

## Estrutura do projeto

```
projeto_catalogo/
├── backend/      → API Node.js + Express (não altere)
└── frontend/     → Aplicação React (aqui você vai trabalhar)
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior

---

## Instalação e execução

Abra **dois terminais** — um para o backend e outro para o frontend.

### Terminal 1 — Backend

```bash
cd backend
npm install
node server.js
```

O backend ficará disponível em `http://localhost:3001`.

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend ficará disponível em `http://localhost:5173`.

---

## Acessos

| URL | Descrição |
|---|---|
| `http://localhost:5173/` | Site do catálogo (sua área de trabalho) |
| `http://localhost:5173/backoffice` | Painel administrativo |

### Login do backoffice

| Usuário | Senha |
|---|---|
| `admin` | `admin123` |

---

## O que você deve fazer

Você deve desenvolver o site do catálogo dentro do arquivo:

```
frontend/src/pages/
```

A rota `/` já existe em [frontend/src/App.jsx](frontend/src/App.jsx) e está em branco — é por ali que você começa.

Sugestão de páginas para desenvolver:

- **Listagem de produtos** — exibe todos os produtos em cards ou tabela
- **Detalhe do produto** — exibe informações completas de um produto
- **Página inicial** — banner, destaques, chamada para ação

Sinta-se livre para criar novos componentes, estilos e páginas. O único requisito é consumir a API documentada abaixo.

---

## API do backend

O Vite está configurado para redirecionar chamadas de `/api` e `/uploads` para o backend, então você pode usar caminhos relativos sem se preocupar com CORS.

### Autenticação

> A rota de listagem de produtos é **pública**. As demais rotas de escrita exigem autenticação de administrador e são usadas exclusivamente pelo backoffice.

---

### `GET /api/products`

Retorna todos os produtos cadastrados. **Não requer autenticação.**

**Resposta**
```json
[
  {
    "id": 1,
    "name": "Notebook Pro",
    "description": "Processador i7, 16GB RAM, SSD 512GB",
    "price": 4999.90,
    "stock": 10,
    "image": "1716900000000.jpg"
  }
]
```

> O campo `image` pode ser `null` quando o produto não tem imagem.  
> Para exibir a imagem: `<img src="/uploads/1716900000000.jpg" />`

---

### `GET /api/me`

Retorna os dados do usuário logado. Útil para verificar se há uma sessão ativa.

**Resposta**
```json
{ "id": 1, "username": "admin", "role": "admin" }
```

---

### `POST /api/login`

Autentica um usuário e cria uma sessão via cookie.

**Body (JSON)**
```json
{ "username": "admin", "password": "admin123" }
```

**Resposta**
```json
{ "user": { "id": 1, "username": "admin", "role": "admin" } }
```

---

### `POST /api/logout`

Encerra a sessão do usuário.

---

### `POST /api/products` *(admin)*

Cria um produto. Aceita `multipart/form-data` para permitir o envio de imagem.

**Campos**
| Campo | Tipo | Obrigatório |
|---|---|---|
| `name` | texto | sim |
| `description` | texto | não |
| `price` | número | sim |
| `stock` | inteiro | sim |
| `image` | arquivo | não |

---

### `PUT /api/products/:id` *(admin)*

Atualiza um produto existente. Mesmos campos do POST.

Campos adicionais para controlar a imagem:
- Enviar um novo arquivo no campo `image` → substitui a imagem atual
- Enviar `keepImage=true` sem arquivo → mantém a imagem atual
- Enviar `keepImage=false` sem arquivo → remove a imagem

---

### `DELETE /api/products/:id` *(admin)*

Exclui um produto e remove a imagem do disco.

---

## Imagens dos produtos

As imagens enviadas pelo backoffice ficam salvas na pasta `backend/uploads/` e são servidas publicamente em `/uploads/<arquivo>`.

**Exemplo de uso no React:**
```jsx
{produto.image ? (
  <img src={`/uploads/${produto.image}`} alt={produto.name} />
) : (
  <span>Sem imagem</span>
)}
```

---

## Dicas

- Use `fetch('/api/products')` ou crie funções em `src/api.js` para chamar a API
- Os produtos já vêm com dados de exemplo para você visualizar o resultado
- Você pode adicionar novas imagens pelo backoffice e vê-las aparecer no site em tempo real
- `react-router-dom` já está instalado — use `<Link>` e `useParams` para navegação
