export default function setSearchController(req, res) {
    const { searchingFor } = req.body;
    res.cookie('searchingFor', searchingFor, { httpOnly: true, maxAge: 360 * 24 * 60 * 60 * 1000 });
    res.status(200).json({ message: 'Search preference set successfully' });
}