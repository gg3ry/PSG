import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
const app = express();
const PORT = 3030;
app.use(cors());
app.use(express.json());
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
app.listen(PORT, () => {
    console.log(`A szerver a ${PORT} porton fut.`);
});
app.get('/products', async (req, res) => {
    const category = req.query.category;
    const conn = await db.getConnection();
    if (category) {
        try {
            const [rows] = await conn.query('SELECT * FROM products WHERE category = ?', [category]);
            if (rows.length === 0) {
                conn.release();
                return res.status(404).json({ error: 'Nincs ilyen kategóriájú termék.' });
            }
            else {
                conn.release();
                res.json(rows);
            }
        } catch (error) {
            conn.release();
            console.error(error);
            res.status(500).json({ error: 'Hiba a kategória lekérése során.' });
        }
    }
    else 
    {
        try {
            const [rows] = await conn.query('SELECT * FROM products');
            conn.release();
            res.json(rows);
        } catch (error) {
            conn.release();
            console.error(error);
            res.status(500).json({ error: 'Hiba a termékek lekérése során.' });
        }
    }
});
app.post('/products', async (req, res) => {
    const { name, price, category } = req.body;
    const conn = await db.getConnection();
    if (!name || !price || !category) {
        conn.release();
        return res.status(400).json({ error: 'Hiányzó kötelező mezők.' });
    }
    else if (isNaN(price) || price <= 0) {
        conn.release();
        return res.status(400).json({ error: 'Az árnak pozitív számnak kell lennie.' });
    }
    else if (Object.keys(req.body).length !== 3) {
        conn.release();
        return res.status(400).json({ error: 'Kizárólag 3 adat adható meg' });
    }
    else {
        const [results] = await conn.query('SELECT * FROM products WHERE name = ?', [name]);
        if (results.length > 0) {
            conn.release();
            return res.status(409).json({ error: 'Már létezik a termék' });
        }
        else {
            try {
                const [result] = await conn.query('INSERT INTO products (name, price, category) VALUES (?, ?, ?)', [name, price, category]);
                conn.release();
                res.status(201).json({ message: 'Termék sikeresen hozzáadva.'});
            } catch (error) {
                conn.release();
                console.error(error);
                res.status(500).json({ error: 'Hiba a termék hozzáadása során.' });
            } 
        }
    }
});
app.get('/products/:id', async (req, res) => {
    const id = req.params.id;
    const conn = await db.getConnection();
    if (!id) {
        conn.release();
        return res.status(400).json({ error: 'Hiányzó kategória.' });
    }
    else if (Object.keys(req.params).length !== 1) {
        conn.release();
        return res.status(400).json({ error: 'Kizárólag 1 paraméter adható meg' });
    }
    else if (isNaN(id)) {
        conn.release();
        return res.status(400).json({ error: 'Az ID kizárólag szám lehet' });
    }
    else {
        try {
            const [rows] = await conn.query('SELECT * FROM products WHERE id = ?', [id]);
            conn.release();
            res.json(rows);
        } catch (error) {
            conn.release();
            console.error(error);
            res.status(500).json({ error: 'Hiba a kategória lekérése során.' });
        }
    }
});