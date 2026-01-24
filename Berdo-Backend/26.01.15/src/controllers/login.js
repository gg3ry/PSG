import argon from 'argon2';
import { pool } from '../server.js'
import jwt from 'jsonwebtoken';

export default async function loginController(req, res) {
  const { email, password, username } = req.body;
    try {
    const [rows] = await pool.query('SELECT id, password_hash, username FROM users WHERE email = ? OR username = ?', [email, username]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = rows[0];
    const validPassword = await argon.verify(user.password_hash, password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, 'supersecret', { expiresIn: '1h' });
    res.json({ token, username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}