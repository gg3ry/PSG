import argon2 from 'argon2';
import { pool } from '../server.js';

export default async function registerController(req, res) {
    try {
        const { username, email, password, full_name, birth_date, gender, bio, latitude, longitude } = req.body;

        const password_hash = await argon2.hash(password);
        const [result] = await pool.query(
            'INSERT INTO users (username, email, password_hash, full_name, birth_date, gender, bio, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [username, email, password_hash, full_name, birth_date, gender, bio, latitude, longitude]
        );
        res.status(201).json({ message: 'User registered successfully.', userId: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.message.includes('username')) {
                return res.status(409).json({ error: 'Username already exists.' });
            }
            if (error.message.includes('email')) {
                return res.status(409).json({ error: 'Email already exists.' });
            }
        }
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}