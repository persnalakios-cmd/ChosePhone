import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import Database from 'better-sqlite3';
import cors from 'cors';

const db = new Database(':memory:');

// Seed script
function seedDb() {
  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      wallet_balance REAL DEFAULT 0.0,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      specs TEXT NOT NULL,
      price_pkr REAL NOT NULL,
      stock_count INTEGER NOT NULL,
      image_url TEXT
    );

    CREATE TABLE orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      price_pkr REAL NOT NULL,
      buyer_name TEXT,
      buyer_email TEXT,
      buyer_phone TEXT,
      buyer_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    );
  `);

  const insertUser = db.prepare('INSERT INTO users (full_name, email, wallet_balance) VALUES (?, ?, ?)');
  const insertProduct = db.prepare('INSERT INTO products (brand, model, specs, price_pkr, stock_count, image_url) VALUES (?, ?, ?, ?, ?, ?)');

  // Seed Users
  for (let i = 1; i <= 55; i++) {
    insertUser.run(`User ${i}`, `user${i}@example.pk`, Math.floor(Math.random() * 999500) + 500);
  }

  // Current selected user mock (admin testing)
  insertUser.run('Admin Mode', 'admin@example.pk', 5000000);

  // Seed Products
  const modelsData = {
    "Apple": [
      { name: "iPhone 13", price: 150000 }, { name: "iPhone 13 Pro", price: 200000 },
      { name: "iPhone 14", price: 180000 }, { name: "iPhone 14 Pro Max", price: 250000 },
      { name: "iPhone 15", price: 220000 }, { name: "iPhone 15 Pro Max", price: 320000 },
      { name: "iPhone 16", price: 280000 }, { name: "iPhone 16 Pro Max", price: 400000 },
      { name: "iPhone 17", price: 350000 }, { name: "iPhone 17 Pro Max", price: 550000 }
    ],
    "Samsung": [
      { name: "Galaxy S22", price: 120000 }, { name: "Galaxy S22 Ultra", price: 200000 },
      { name: "Galaxy S23", price: 180000 }, { name: "Galaxy S23 Ultra", price: 280000 },
      { name: "Galaxy S24", price: 220000 }, { name: "Galaxy S24 Ultra", price: 380000 },
      { name: "Galaxy A54", price: 80000 }, { name: "Galaxy A55", price: 110000 }
    ],
    "Xiaomi": [
      { name: "Redmi Note 12", price: 40000 }, { name: "Redmi Note 12 Pro", price: 60000 },
      { name: "Redmi Note 13", price: 50000 }, { name: "Redmi Note 13 Pro", price: 80000 },
      { name: "Xiaomi 13", price: 120000 }, { name: "Xiaomi 14 Ultra", price: 220000 }
    ],
    "Google": [
      { name: "Pixel 7", price: 120000 }, { name: "Pixel 7 Pro", price: 160000 },
      { name: "Pixel 8", price: 150000 }, { name: "Pixel 8 Pro", price: 210000 },
      { name: "Pixel 9", price: 190000 }, { name: "Pixel 9 Pro XL", price: 280000 }
    ],
    "Tecno": [
      { name: "Camon 20", price: 45000 }, { name: "Camon 20 Pro", price: 60000 },
      { name: "Spark 10", price: 30000 }, { name: "Spark 20 Pro", price: 55000 }
    ],
    "Infinix": [
      { name: "Note 30", price: 40000 }, { name: "Note 30 Pro", price: 65000 },
      { name: "Zero 30", price: 80000 }, { name: "Note 40 Pro", price: 85000 }
    ],
    "iTel": [
      { name: "S23", price: 25000 }, { name: "S23+", price: 35000 },
      { name: "P40", price: 22000 }, { name: "A70", price: 20000 }
    ]
  };

  const phoneImages = [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598327105666-5b89351cb315?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621330396167-147ee7452d59?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1533228100845-08145b01de14?q=80&w=800&auto=format&fit=crop'
  ];

  for (const [brand, models] of Object.entries(modelsData)) {
    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      const stock = Math.floor(Math.random() * 45) + 5;
      const imageUrl = phoneImages[(i + brand.length) % phoneImages.length];
      insertProduct.run(
        brand,
        model.name,
        JSON.stringify({
          display: 'AMOLED/IPS LCD',
          battery: '4000-5000mAh',
          camera: 'High Res Camera',
          chipset: brand === 'Apple' ? 'Bionic/A-series' : 'Snapdragon/Mediatek'
        }),
        model.price,
        stock,
        imageUrl
      );
    }
  }
}

seedDb();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // ----------- API ROUTES -----------

  app.get('/api/products', (req, res) => {
    const { search, brand } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    let params: any[] = [];
    if (search) {
      query += ' AND (model LIKE ? OR brand LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (brand && brand !== 'All') {
      query += ' AND brand = ?';
      params.push(brand);
    }
    query += ' LIMIT 100'; // Hard limit for demo
    const stmt = db.prepare(query);
    const rows = stmt.all(params);
    res.json(rows);
  });

  app.get('/api/products/:id', (req, res) => {
    const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
    const row = stmt.get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });

  app.post('/api/products', (req, res) => {
    const { brand, model, specs, price_pkr, stock_count, image_url } = req.body;
    try {
      const stmt = db.prepare('INSERT INTO products (brand, model, specs, price_pkr, stock_count, image_url) VALUES (?, ?, ?, ?, ?, ?)');
      const info = stmt.run(brand, model, JSON.stringify(specs), price_pkr, stock_count, image_url);
      res.json({ success: true, id: info.lastInsertRowid });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get('/api/users/me', (req, res) => {
    // Mock user for frontend wallet testing
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const row = stmt.get('admin@example.pk');
    res.json(row);
  });

  // Analytics endpoints
  app.get('/api/admin/stats', (req, res) => {
    const totalUsers = db.prepare('SELECT COUNT(*) as c FROM users').get() as {c: number};
    const systemLiability = db.prepare('SELECT SUM(wallet_balance) as s FROM users').get() as {s: number};
    const totalSales = db.prepare('SELECT SUM(price_pkr) as s FROM orders').get() as {s: number};
    res.json({
      totalUsers: totalUsers.c,
      systemLiability: systemLiability.s || 0,
      totalSales: totalSales.s || 0
    });
  });

  app.get('/api/admin/users', (req, res) => {
      const stmt = db.prepare('SELECT id, full_name, email, wallet_balance, is_active FROM users ORDER BY id DESC LIMIT 50');
      res.json(stmt.all());
  });

  app.get('/api/admin/inventory', (req, res) => {
      const stmt = db.prepare('SELECT id, brand, model, price_pkr, stock_count FROM products ORDER BY id DESC LIMIT 50');
      res.json(stmt.all());
  });

  // Transaction lock logic
  app.post('/api/purchase/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const { userId, buyerName, buyerEmail, buyerPhone, buyerAddress } = req.body;

    if (!userId) return res.status(400).json({ error: 'User ID required' });
    if (!buyerName || !buyerEmail || !buyerPhone || !buyerAddress) return res.status(400).json({ error: 'Buyer details required' });

    // Begin transaction
    try {
      db.transaction(() => {
        const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId) as any;
        if (!product) throw new Error('Product not found');
        if (product.stock_count <= 0) throw new Error('Out of stock');

        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
        if (!user) throw new Error('User not found');
        if (user.wallet_balance < product.price_pkr) throw new Error('Insufficient wallet balance');

        // Execute changes
        db.prepare('UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?').run(product.price_pkr, userId);
        db.prepare('UPDATE products SET stock_count = stock_count - 1 WHERE id = ?').run(productId);
        db.prepare('INSERT INTO orders (user_id, product_id, price_pkr, buyer_name, buyer_email, buyer_phone, buyer_address) VALUES (?, ?, ?, ?, ?, ?, ?)').run(userId, productId, product.price_pkr, buyerName, buyerEmail, buyerPhone, buyerAddress);
      })();
      res.json({ success: true, message: 'Purchase successful' });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });


  app.get('/api/admin/orders', (req, res) => {
    try {
      const orders = db.prepare(`
        SELECT orders.*, products.brand, products.model, users.email as user_email
        FROM orders 
        JOIN products ON orders.product_id = products.id
        JOIN users ON orders.user_id = users.id
        ORDER BY orders.created_at DESC
      `).all();
      res.json(orders);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ----------- VITE SETUP -----------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
