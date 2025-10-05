import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export async function register(req, res) {
  const { email, name, password, role = 'user' } = req.body;
  if (!email) return res.status(400).json({ error: { code: 'FIELD_REQUIRED', field: 'email', message: 'Email required' } });
  if (!password) return res.status(400).json({ error: { code: 'FIELD_REQUIRED', field: 'password', message: 'Password required' } });
  try {
    const hash = await bcrypt.hash(password, 10);
    const r = await pool.query(
      'INSERT INTO users (email,name,password_hash,role) VALUES($1,$2,$3,$4) RETURNING id,email,name,role',
      [email, name || email.split('@')[0], hash, role]
    );
    const user = r.rows[0];
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user });
  } catch (e) {
    if (e.code === '23505') return res.status(400).json({ error: { code: 'FIELD_UNIQUE', field: 'email', message: 'Email already exists' } });
    console.error(e);
    res.status(500).json({ error: { code: 'SERVER_ERROR' } });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: { code: 'FIELD_REQUIRED', message: 'email and password required' } });
  try {
    const r = await pool.query('SELECT id,email,name,password_hash,role FROM users WHERE email=$1', [email]);
    if (!r.rowCount) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS' } });
    const u = r.rows[0];
    const ok = await bcrypt.compare(password, u.password_hash);
    if (!ok) return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS' } });
    const token = jwt.sign({ id: u.id, role: u.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: u.id, email: u.email, name: u.name, role: u.role } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: { code: 'SERVER_ERROR' } });
  }
}
