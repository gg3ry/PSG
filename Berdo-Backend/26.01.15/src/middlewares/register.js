export default function registerMiddleware(req, res, next) {
    const { username, email, password, full_name, birth_date, gender, bio, latitude, longitude } = req.body;
    if (!username || !email || !password || !full_name || !birth_date || !gender || !bio || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string' || typeof full_name !== 'string' || typeof bio !== 'string') {
        return res.status(400).json({ error: 'Invalid data types.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }
    const birthDateObj = new Date(birth_date);
    if (isNaN(birthDateObj.getTime())) {
        return res.status(400).json({ error: 'Invalid birth date.' });
    }
    const validGenders = ['male', 'female', 'other'];
    if (!validGenders.includes(gender.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid gender value.' });
    }
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ error: 'Invalid location coordinates.' });
    }
    next();
}