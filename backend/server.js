require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const cookieParser = require('cookie-parser');
const jwt        = require('jsonwebtoken');
const bcrypt     = require('bcrypt');
const Database   = require('better-sqlite3');
const path       = require('path');
const multer     = require('multer');
const fs         = require('fs');

const app  = express();
const PORT = 3001;
const JWT_SECRET = process.env.JWT_SECRET;

// ─── Pasta de uploads ─────────────────────────────────────────────────────────

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5 MB

// ─── Banco de dados ───────────────────────────────────────────────────────────

const db = new Database(path.join(__dirname, 'database.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image TEXT
  );
`);

// Migração: adiciona coluna image se ainda não existir
try { db.exec('ALTER TABLE products ADD COLUMN image TEXT'); } catch (_) {}

// Remove usuários com role 'user' (não suportado)
db.prepare("DELETE FROM users WHERE role = 'user'").run();

// Seed: cria admin + produtos de exemplo apenas se não houver nenhum admin
const adminExists = db.prepare("SELECT id FROM users WHERE role = 'admin'").get();
if (!adminExists) {
  const hashAdmin = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run('admin', hashAdmin, 'admin');

  const ins = db.prepare('INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)');
  ins.run('Notebook Pro',     'Processador i7, 16GB RAM, SSD 512GB',   4999.90, 10);
  ins.run('Mouse Gamer',      'RGB, 12000 DPI, sensor óptico',           299.90, 50);
  ins.run('Teclado Mecânico', 'Switch Brown, ABNT2, retroiluminado',     499.90, 30);
  ins.run('Monitor 27"',      '4K, 144Hz, IPS, HDR400',                2199.90,  8);
  ins.run('Headset USB',      'Surround 7.1, microfone retrátil',        399.90, 20);

  console.log('Seed executado: admin e produtos criados.');
}

// ─── Middlewares globais ──────────────────────────────────────────────────────

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Imagens de produtos acessíveis publicamente
app.use('/uploads', express.static(uploadsDir));

// ─── Middlewares de autenticação ──────────────────────────────────────────────

function authenticate(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Não autenticado.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Sessão expirada. Faça login novamente.' });
    }
    return res.status(401).json({ error: 'Token inválido.' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acesso negado.' });
  next();
}

// ─── Rotas de autenticação ────────────────────────────────────────────────────

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha obrigatórios.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
  }

  const token = jwt.sign(
    { sub: user.id, role: user.role, username: user.username },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false });
  return res.json({ user: { id: user.id, username: user.username, role: user.role } });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ ok: true });
});

app.get('/api/me', authenticate, (req, res) => {
  return res.json({ id: req.user.sub, username: req.user.username, role: req.user.role });
});

// ─── Rotas de produtos ────────────────────────────────────────────────────────

// Listagem pública — alunos podem usar no site sem autenticação
app.get('/api/products', (req, res) => {
  const products = db.prepare('SELECT * FROM products').all();
  return res.json(products);
});

// POST — cria produto (multipart/form-data para suportar upload de imagem)
app.post('/api/products', authenticate, requireAdmin, upload.single('image'), (req, res) => {
  const { name, description, price, stock } = req.body;
  if (!name || price == null || stock == null) {
    return res.status(400).json({ error: 'Campos name, price e stock são obrigatórios.' });
  }

  const image = req.file ? req.file.filename : null;

  const result = db
    .prepare('INSERT INTO products (name, description, price, stock, image) VALUES (?, ?, ?, ?, ?)')
    .run(name, description || '', parseFloat(price), parseInt(stock, 10), image);

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json(product);
});

// PUT — atualiza produto (multipart/form-data para suportar troca de imagem)
app.put('/api/products/:id', authenticate, requireAdmin, upload.single('image'), (req, res) => {
  const { name, description, price, stock, keepImage } = req.body;
  const { id } = req.params;

  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Produto não encontrado.' });

  // Nova imagem enviada → usa a nova; keepImage='true' → mantém a antiga; senão → remove
  const image = req.file
    ? req.file.filename
    : keepImage === 'true'
      ? existing.image
      : null;

  // Deleta arquivo antigo se foi substituído
  if (req.file && existing.image) {
    const old = path.join(uploadsDir, existing.image);
    if (fs.existsSync(old)) fs.unlinkSync(old);
  }

  db.prepare(`
    UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image = ? WHERE id = ?
  `).run(
    name        ?? existing.name,
    description ?? existing.description,
    price  != null ? parseFloat(price)     : existing.price,
    stock  != null ? parseInt(stock, 10)   : existing.stock,
    image,
    id
  );

  return res.json(db.prepare('SELECT * FROM products WHERE id = ?').get(id));
});

// DELETE — exclui produto e remove a imagem do disco
app.delete('/api/products/:id', authenticate, requireAdmin, (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Produto não encontrado.' });

  if (existing.image) {
    const imgPath = path.join(uploadsDir, existing.image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
  }

  db.prepare('DELETE FROM products WHERE id = ?').run(id);
  return res.json({ ok: true });
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
  console.log(`Imagens disponíveis em http://localhost:${PORT}/uploads/<arquivo>`);
});
