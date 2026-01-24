export default function loginMiddleware(req, res, next) {
    const { username, password, email } = req.body;
    if (!username && !email) {
        return res.status(400).json({ error: 'Username or email is required.' });
    }
    if (!password) {
        return res.status(400).json({ error: 'Password is required.' });
    }
    if ((username && typeof username !== 'string') || typeof password !== 'string' || (email && typeof email !== 'string')) {
        return res.status(400).json({ error: 'Invalid data types.' });
    }
    next();
}