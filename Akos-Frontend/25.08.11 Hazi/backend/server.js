import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3000;
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
};

app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} FROM ${req.ip}`);
    })
    next();
})

const pool = mysql.createPool(dbConfig);
app.post('/regUser', async (req, res) => {
  const conn = await pool.getConnection();
  const { username, email, password, address, phone_number } = req.body;
  if (Object.keys(req.body).length !== 5) {
    conn.release();
    return res.status(400).json({ message: 'Invalid request body' });
  }
  else if (!username || !email || !password || !address || !phone_number) {
    conn.release();
    return res.status(400).json({ message: 'All fields are required' });
  }
  else if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string' || typeof address !== 'string' || typeof phone_number !== 'string') {
    conn.release();
    return res.status(400).json({ message: 'Invalid data types' });
  }
  else if (password.length < 6) {
    conn.release();
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }
  else {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ? OR username = ? OR phone_number = ?', [email, username, phone_number]);
        if (rows.length > 0) {
            conn.release();
            return res.status(409).json({ message: 'User with this email, username or phone number already exists' });
        }
    } catch (error) {
        conn.release();
        console.error('Error checking for existing user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
        try {
        const [result] = await pool.query('INSERT INTO users (username, email, password, address, phone_number) VALUES (?, ?, ?, ?, ?)', [username, email, password, address, phone_number]);
        conn.release();
        return res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        conn.release();
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    }
});

app.get('/logUser', async (req, res) => {
    const conn = await pool.getConnection();
    const { info, password } = req.query;
    if (Object.keys(req.query).length !== 2) {
        conn.release();
        return res.status(400).json({ message: 'Invalid request parameters' });
    }
    else if (!password || !info) {
        conn.release();
        return res.status(400).json({ message: 'Missing required fields' });
  }
  else if (typeof password !== 'string' || (info && typeof info !== 'string')) {
    conn.release();
    return res.status(400).json({ message: 'Invalid data types' });
  }
  else {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE (email = ? OR username = ? OR phone_number = ?) AND password = ?', [info, info, info, password]);
        if (rows.length == 0) {
          console.log('No user found with provided credentials');  
          conn.release();
          return res.status(401).json({ message: 'Invalid credentials' });
        }
        else {
          console.log('User logged in successfully:', rows[0]);
            conn.release();
            return res.status(200).json( rows[0] );
        }
    } catch (error) {
        conn.release();
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
app.use((req, res) => {
  res.status(404).json({ error: 'Nem található' });
});