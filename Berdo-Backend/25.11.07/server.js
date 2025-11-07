import mysql from 'mysql2/promise';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3030;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10
};
const pool = mysql.createPool(dbConfig);
app.get('/music', async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        conn.release();
    }
});
app.get('/music/:id', async (req, res) => {
    const id = req.params.id;
    const conn = await pool.getConnection();
    if (Object.keys(req.query).length == 0) {
        res.status(400).json({ error: 'Hiányzik a paraméter' });
        return;
    }
    else if (isNaN(id)) {
        res.status(400).json({ error: 'Az id-nek számnak kell lennie' });
        return;
    }
    else if (Object.keys(req.params).length > 1) {
        res.status(400).json({ error: 'Csak az id paraméter engedélyezett' });
        return;
    }
    else if (!id) {
        res.status(400).json({ error: 'Az ID megadása kötelező' });
        return;
    }    
    else {
        try {
        const [rows] = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
        conn.release();
        if (rows.length === 0) {
            res.status(404).json({ error: 'Zene nem létezik ezen az IDn' });
        } else {
            res.json(rows[0]);
        }
    } catch (error) {
        conn.release();
        res.status(500).json({ error: error.message });
    }
}
});
app.get('/music/:band', async (req, res) => {
    const band = req.params.band;
    const conn = await pool.getConnection();
    if (Object.keys(req.query).length > 0) {
        res.status(400).json({ error: 'Csak a band paraméter engedélyezett' });
        return;
    }
    else if (typeof band !== 'string') {
        res.status(400).json({ error: 'A bandnek szövegnek kell lennie' });
        return;
    }
    else if (Object.keys(req.params).length > 1) {
        res.status(400).json({ error: 'Csak a band paraméter engedélyezett' });
        return;
    }
    else if (!band) {
        res.status(400).json({ error: 'A zenekar megadása kötelező' });
        return;
    }
    else {
        try {
        const [rows] = await conn.query('SELECT * FROM users WHERE band = ?', [band]);
        conn.release();
        if (rows.length === 0) {
            res.status(404).json({ error: 'Nincs ilyen zenekar' });
        } else {
            res.json(rows);
        }
    } catch (error) {
        conn.release();
        res.status(500).json({ error: error.message });
    }
}
});
app.get('/music/:name', async (req, res) => {
    const name = req.params.name;
    const conn = await pool.getConnection();
    if (!name) {
        res.status(400).json({ error: 'A név megadása kötelező' });
        return;
    }
    else if (Object.keys(req.query).length > 0) {
        res.status(400).json({ error: 'Csak a név paraméter engedélyezett' });
        return;
    }
    else if (typeof name !== 'string') {
        res.status(400).json({ error: 'A névnek szövegnek kell lennie' });
        return;
    }
    else if (Object.keys(req.params).length > 1) {
        res.status(400).json({ error: 'Csak a név paraméter engedélyezett' });
        return;
    }
    else {
    try {
        const [rows] = await conn.query('SELECT * FROM users WHERE name = ?', [name]);
        conn.release();
        if (rows.length === 0) {
            res.status(404).json({ error: 'Nincs ilyen nevű zene' });
        } else {
            res.json(rows);
        }
    } catch (error) {
        conn.release();
        res.status(500).json({ error: error.message });
    }
}});
app.delete('/music/:id', async (req, res) => {
    const id = req.params.id;
    const conn = await pool.getConnection();
    if (isNaN(id)) {
        res.status(400).json({ error: 'Az id-nek számnak kell lennie' });
        conn.release();
    }
    else if (Object.keys(req.params).length > 1) {
        res.status(400).json({ error: 'Csak az id paraméter engedélyezett' });
        conn.release();
    }
    else if (!id) {
        res.status(400).json({ error: 'Az ID megadása kötelező' });
        conn.release();
    }
    else {
    try {
        const [result] = await conn.query('DELETE FROM users WHERE id = ?', [id]);
        conn.release();
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Zene nem létezik ezen az IDn' });
        } else {
            res.json({ message: 'Zene sikeresen törölve' });
        }
    } 
    catch (error) {
        conn.release();
        res.status(500).json({ error: error.message });
    }
}}
);


app.post('/music', async (req, res) => {
    const {name, viewing, band} = req.body;
    const conn = await pool.getConnection();
    if (!name || !viewing || !band) {
        res.status(400).json({ error: 'Minden mező kitöltése kötelező' });
        conn.release();
    }
    else if (typeof name !== 'string' || typeof band !== 'string') {
        res.status(400).json({ error: 'A name és band mezőknek szövegnek kell lennie' });
        conn.release();
    }
    else if (Object.keys(req.query).length !== 3) {
        res.status(400).json({ error: 'Csak a name, viewing és band mezők engedélyezettek' });
        conn.release();
    }
    else if (isNaN(viewing)) {
        res.status(400).json({ error: 'A viewing mezőnek számnak kell lennie' });
        conn.release();
    }
    else {
    try {
        const [result] = await conn.query(
            'INSERT INTO users (name, viewing, band) VALUES (?, ?, ?)',
            [name, viewing, band]
        );
        conn.release();
        res.status(201).json({ id: result.insertId, name, viewing, band });
    } catch (error) {
        conn.release();
        res.status(500).json({ error: error.message });
    }
}
});

app.patch('/music/:id', async (req, res) => {
    const id = req.params.id;
    const {name, viewing, band} = req.body;
    const conn = await pool.getConnection();
    if (isNaN(id)) {
        res.status(400).json({ error: 'Az id-nek számnak kell lennie' });
        conn.release();
    }
    else if (Object.keys(req.body).length !== 3) {
        res.status(400).json({ error: 'Legalább egy mező megadása kötelező' });
        conn.release();
    }
    else if (!name || !viewing || !band) {
        res.status(400).json({ error: 'Minden mező kitöltése kötelező' });
        conn.release();
    }
    else if (typeof name !== 'string' || typeof band !== 'string') {
        res.status(400).json({ error: 'A name és band mezőknek szövegnek kell lennie' });
        conn.release();
    }
    else if (isNaN(viewing)) {
        res.status(400).json({ error: 'A viewing mezőnek számnak kell lennie' });
        conn.release();
    }
    else {
    try {
        const [result] = await conn.query(
            'UPDATE users SET name = ?, viewing = ?, band = ? WHERE id = ?',
            [name, viewing, band, id]
        );
        conn.release();
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Zene nem létezik ezen az IDn' });
        } else {
            res.json({ id, name, viewing, band });
        }
    } catch (error) {
        conn.release();
        res.status(500).json({ error: error.message });
    }
}});

app.put('/music/:id', async (req, res) => {
    const id = req.params.id;
    const {name, viewing, band} = req.body;
    const conn = await pool.getConnection();
    if (isNaN(id)) {
        res.status(400).json({ error: 'Az id-nek számnak kell lennie' });
        conn.release();
    }
    else if (Object.keys(req.body).length !== 3) {
        res.status(400).json({ error: 'Minden mező kitöltése kötelező' });
        conn.release();
    }
    else if (!name || !viewing || !band) {
        res.status(400).json({ error: 'Minden mező kitöltése kötelező' });
        conn.release();
    }
    else if (typeof name !== 'string' || typeof band !== 'string') {
        res.status(400).json({ error: 'A name és band mezőknek szövegnek kell lennie' });
        conn.release();
    }
    else if (isNaN(viewing)) {
        res.status(400).json({ error: 'A viewing mezőnek számnak kell lennie' });
        conn.release();
    }
    else {
    try {
        const [result] = await conn.query(
            'UPDATE users SET name = ?, viewing = ?, band = ? WHERE id = ?',
            [name, viewing, band, id]
        );
        conn.release();
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Zene nem létezik ezen az IDn' });
        } else {
            res.json({ id, name, viewing, band });
        }
    } catch (error) {
        conn.release();
        res.status(500).json({ error: error.message });
    }
}});

app._router.use((req, res) => {
    res.status(404).json({ error: 'Az adott útvonal nem található' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});