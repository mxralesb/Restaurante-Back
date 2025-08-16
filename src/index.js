const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// Simple in-memory "DB" for demo
const orders = [];
const reservations = [];

// Health
app.get('/api/health', (req, res) => res.status(200).json({ ok: true }));

// Auth (stub)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (email && password) {
    return res.json({ token: 'demo-token' });
  }
  return res.status(401).json({ error: 'Credenciales inválidas' });
});

// Orders
app.get('/api/orders', (req, res) => res.json(orders));
app.post('/api/orders', (req, res) => {
  const { items, type } = req.body || {};
  if (!Array.isArray(items) || !items.length || !['INTERNAL','DRIVE_THRU','DELIVERY'].includes(type)) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }
  const order = { id: String(Date.now()), items, type, status: 'PLACED' };
  orders.push(order);
  res.status(201).json(order);
});

// Reservations
app.get('/api/reservations', (req, res) => res.json(reservations));
app.post('/api/reservations', (req, res) => {
  const { branch_id, date_time, people, customer_name } = req.body || {};
  if (!branch_id || !date_time || !people || !customer_name) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }
  const reservation = { id: String(Date.now()), branch_id, date_time, people, customer_name, status: 'CONFIRMED' };
  reservations.push(reservation);
  res.status(201).json(reservation);
});

const port = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
}

module.exports = app; // for tests
