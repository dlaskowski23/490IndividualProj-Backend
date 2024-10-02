const Film = require('../models/film.model');
const Actor = require('../models/actor.model');
const sequelize = require('../config/db.config');
const { QueryTypes } = require('sequelize');


exports.getTop5Movies = async (req, res) => {
  try {
    const topMovies = await sequelize.query(
      `SELECT f.film_id, f.title, COUNT(r.rental_id) AS rental_count
       FROM rental r
       JOIN inventory i ON r.inventory_id = i.inventory_id
       JOIN film f ON i.film_id = f.film_id
       GROUP BY f.film_id, f.title
       ORDER BY rental_count DESC
       LIMIT 5;`,
      { type: QueryTypes.SELECT }
    );

    res.json(topMovies);
  } catch (err) {
    console.error('Error fetching top movies:', err);
    res.status(500).json({ error: 'Failed to fetch top movies' });
  }
};

exports.getMovieById = async (req, res) => {
  const { id } = req.params;
  try {
    const film = await Film.findOne({
      where: { film_id: id },
      include: [
        {
          model: Actor,
          through: { attributes: [] },
          attributes: ['actor_id', 'first_name', 'last_name'],
        },
      ],
      attributes: [
        'title',
        'description',
        'release_year',
        'rating',
        [sequelize.literal
          (`(SELECT COUNT(rental.rental_id) FROM rental 
          JOIN inventory ON rental.inventory_id = inventory.inventory_id 
          WHERE inventory.film_id = film.film_id)`), 'rental_count'
        ]
      ]
    });

    if (!film) return res.status(404).json({ message: 'Film not found' });

    res.json({
      title: film.title,
      rental_count: film.get('rental_count'),
      description: film.description,
      release_year: film.release_year,
      rating: film.rating,
      actors: film.Actors.map(actor => `${actor.first_name} ${actor.last_name}`),
    });
  } catch (err) {
    console.error('Error fetching movie details:', err);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
};

