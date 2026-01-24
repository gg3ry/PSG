export default function setSearchMiddleware(req, res, next) {
  const { searchingFor } = req.body;
    allowedSearches = ['male', 'female', 'other', 'all'];
    if (!allowedSearches.includes(searchingFor)) {
      return res.status(400).json({ message: 'Invalid searchingFor value' });
    }
    next();
}