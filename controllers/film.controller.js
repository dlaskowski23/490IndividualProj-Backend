const Film = require('../models/film.model');
const Actor = require('../models/actor.model');
const Category = require('../models/category.model');
const sequelize = require('../config/db.config');
const { QueryTypes, Op } = require('sequelize');

exports.searchFilms = async (req, res) => {
  const { query, actor, category } = req.query;
  try {
    let films = [];

    console.log(`Search Query: ${query}, Actor: ${actor}, Category: ${category}`);

    if (actor) {
      const [firstName, lastName] = actor.split(' ');
      let actorCondition = {};

      if (firstName && lastName) {
        actorCondition = {
          [Op.and]: [
            { first_name: { [Op.like]: `%${firstName}%` } },
            { last_name: { [Op.like]: `%${lastName}%` } },
          ],
        };
      } else if (firstName) {
        actorCondition = {
          [Op.or]: [
            { first_name: { [Op.like]: `%${firstName}%` } },
            { last_name: { [Op.like]: `%${firstName}%` } },
          ],
        };
      }

      films = await Film.findAll({
        include: [
          {
            model: Actor,
            where: actorCondition,
            attributes: ['first_name', 'last_name'],
            through: { attributes: [] },
          },
        ],
      });
    } else if (query) {
      films = await Film.findAll({
        where: {
          title: {
            [Op.like]: `%${query}%`,
          },
        },
      });
    } else if (category) {
      films = await Film.findAll({
        include: [
          {
            model: Category,
            where: {
              name: {
                [Op.like]: `%${category}%`,
              },
            },
            through: { attributes: [] },
          },
        ],
      });
    }

    if (films.length === 0) {
      return res.status(404).json({ message: 'No films found' });
    }

    res.json(films);
  } catch (err) {
    console.error('Error fetching films:', err);
    res.status(500).json({ error: 'Failed to fetch films' });
  }
};

exports.getAllFilms = async (req, res) => {
  try {
      const films = await Film.findAll();
      res.json(films);
  } catch (err) {
      console.error('Error fetching all films:', err);
      res.status(500).json({ error: 'Failed to fetch films' });
  }
};

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
        {
          model: Category,
          attributes: ['name'],
          through: { attributes: [] },
        }
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
      category: film.Categories.map(category => category.name).join(', '),
      actors: film.Actors.map(actor => `${actor.first_name} ${actor.last_name}`),
    });
  } catch (err) {
    console.error('Error fetching movie details:', err);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
};

exports.getTop5Actors = async (req, res) => {
  try {
    const topActors = await sequelize.query(
      `SELECT a.actor_id, a.first_name, a.last_name, 
              COUNT(r.rental_id) AS rental_count,
              COUNT(DISTINCT fa.film_id) AS movie_count
       FROM actor a
       JOIN film_actor fa ON a.actor_id = fa.actor_id
       JOIN inventory i ON fa.film_id = i.film_id
       JOIN rental r ON i.inventory_id = r.inventory_id
       GROUP BY a.actor_id, a.first_name, a.last_name
       ORDER BY rental_count DESC
       LIMIT 5;`,
      { type: QueryTypes.SELECT }
    );

    res.json(topActors);
  } catch (err) {
    console.error('Error fetching top actors:', err);
    res.status(500).json({ error: 'Failed to fetch top actors' });
  }
};

exports.getActorDetailsWithTopFilms = async (req, res) => {
  const { id } = req.params;
  try {
    const actorFilms = await sequelize.query(
      `SELECT f.film_id, f.title, COUNT(r.rental_id) AS rental_count
       FROM actor a
       JOIN film_actor fa ON a.actor_id = fa.actor_id
       JOIN film f ON fa.film_id = f.film_id
       JOIN inventory i ON f.film_id = i.film_id
       JOIN rental r ON i.inventory_id = r.inventory_id
       WHERE a.actor_id = :actorId
       GROUP BY f.film_id, f.title
       ORDER BY rental_count DESC
       LIMIT 5;`,
      { 
        replacements: { actorId: id },
        type: QueryTypes.SELECT 
      }
    );

    const actor = await Actor.findOne({ where: { actor_id: id } });
    if (!actor) return res.status(404).json({ message: 'Actor not found' });

    res.json({
      actor: {
        actor_id: actor.actor_id,
        name: `${actor.first_name} ${actor.last_name}`,
      },
      films: actorFilms
    });
  } catch (err) {
    console.error('Error fetching actor details and top films:', err);
    res.status(500).json({ error: 'Failed to fetch actor details' });
  }
};
