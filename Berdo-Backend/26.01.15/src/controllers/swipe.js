import { pool } from '../server.js'

export async function getSwipeController(req, res) {
    const userId = req.userId;
    const searchingFor = req.cookies.searchingFor || 'female';
    try {
        const [rows] = await pool.query(
            `SELECT id, username, age, bio, gender FROM users
             WHERE id != ?
             AND gender = ?
             AND id NOT IN (
                 SELECT receiver_id FROM swipes WHERE sender_id = ?)`,
            [userId, searchingFor === 'all' ? '%' : searchingFor, userId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export async function postSwipeController(req, res) {
    const senderId = req.userId;
    const { receiverId, type } = req.body;
    if (!receiverId || !['like', 'dislike', 'superlike'].includes(type)) {
        return res.status(400).json({ message: 'Invalid input' });
    }
    try {
        await pool.query(
            `INSERT INTO swipes (sender_id, receiver_id, type) VALUES (?, ?, ?)`,
            [senderId, receiverId, type]
        );
        const [matchRows] = await pool.query(
            `SELECT * FROM swipes WHERE sender_id = ? AND receiver_id = ? AND type = 'like'`,
            [receiverId, senderId]
        );
        if (matchRows.length > 0 && type === 'like') {
            await pool.query(`INSERT INTO matches (user_one_id, user_two_id) VALUES (?, ?)`, [senderId, receiverId]);
            return res.json({ message: `It's a match!` });
        }
        return res.json({ message: 'Swipe recorded' });
    }
    catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'You have already swiped on this user' });
        }
        return res.status(500).json({ message: 'Server error' });
    }
}