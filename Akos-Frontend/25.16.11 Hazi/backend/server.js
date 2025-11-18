import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });
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
    const { info, password } = req.headers;
    if (!password || !info) {
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
app.get('/getUserID', async (req, res) => {
    const conn = await pool.getConnection();
    const { username } = req.headers;
    if (!username) {
        conn.release();
        return res.status(400).json({ message: 'Missing username' });
  }
  else if (typeof username !== 'string') {
    conn.release();
    return res.status(400).json({ message: 'Invalid data types' });
  }
  else {
    try {
        const [rows] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
        if (rows.length == 0) {
          console.log('No user found with provided username');  
          conn.release();
          return res.status(404).json({ message: 'User not found' });
        }
        else {
          console.log('User ID fetched successfully:', rows[0]);
            conn.release();
            return res.status(200).json( rows[0] );
        }
    } catch (error) {
        conn.release();
        console.error('Error fetching user ID:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    }
});
app.patch('/updateUser/:id', async (req, res) => {
  const conn = await pool.getConnection();
  const userId = req.params.id;
  const { username, email, password, address, phone_number } = req.body;
  if (Object.keys(req.body).length === 0) {
    conn.release();
    return res.status(400).json({ message: 'No fields to update' });
  }
  try {
    const [result] = await pool.query('UPDATE users SET username = ?, email = ?, address = ?, phone_number = ? WHERE id = ?', [username, email, address, phone_number, userId]);
    conn.release();
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    conn.release();
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
app.delete('/deleteUser/:id', async (req, res) => {
  const conn = await pool.getConnection();
  const userId = req.params.id;
  if (!userId) {
    conn.release();
    return res.status(400).json({ message: 'Missing user ID' });
  }
  if (isNaN(userId)) {
    conn.release();
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    conn.release();
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    conn.release();
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
app.put('/changePassword/:id', async (req, res) => {
  const conn = await pool.getConnection();
  const userId = req.params.id;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    conn.release();
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (typeof oldPassword !== 'string' || typeof newPassword !== 'string') {
    conn.release();
    return res.status(400).json({ message: 'Invalid data types' });
  }
  try {
    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      conn.release();
      return res.status(404).json({ message: 'User not found' });
    }
    if (rows[0].password !== oldPassword) {
      conn.release();
      return res.status(401).json({ message: 'Old password is incorrect' });
    }
    const [result] = await pool.query('UPDATE users SET password = ? WHERE id = ?', [newPassword, userId]);
    conn.release();
    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    conn.release();
    console.error('Error changing password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`port ${PORT}`);
});
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});