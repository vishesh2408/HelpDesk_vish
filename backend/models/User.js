import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export const createUser = async ({ name, email, password, role }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const res = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4) RETURNING id, name, email, role`,
    [name, email, hashedPassword, role]
  );
  return res.rows[0];
};

export const findUserByEmail = async (email) => {
  const res = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return res.rows[0];
};

export const findUserById = async (id) => {
  const res = await pool.query(`SELECT id, name, email, role FROM users WHERE id = $1`, [id]);
  return res.rows[0];
};
