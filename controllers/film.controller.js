const Film = require('../models/film.models');

exports.getTop5Films = async (req, res) => {
  try {
    const films = await Film.findAll({ limit: 5, order: [['rental_rate', 'DESC']] });
    res.json(films);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch films' });
  }
};

exports.getFilmById = async (req, res) => {
  const { id } = req.params;
  try {
    const film = await Film.findByPk(id);
    if (!film) return res.status(404).json({ message: 'Film not found' });
    res.json(film);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch film' });
  }
};
