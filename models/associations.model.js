const Film = require('./film.model');
const Actor = require('./actor.model');

Film.belongsToMany(Actor, {
  through: {
    model: 'film_actor',
    timestamps: false,
  },
  foreignKey: 'film_id',
  otherKey: 'actor_id',
});

Actor.belongsToMany(Film, {
  through: {
    model: 'film_actor',
    timestamps: false,
  },
  foreignKey: 'actor_id',
  otherKey: 'film_id',
});

module.exports = { Film, Actor };
