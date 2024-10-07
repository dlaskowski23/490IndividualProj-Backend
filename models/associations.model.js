const Film = require('./film.model');
const Actor = require('./actor.model');
const Category = require('./category.model');

Film.belongsToMany(Actor, {
  through: 'film_actor',
  foreignKey: 'film_id',
  otherKey: 'actor_id',
  timestamps: false,
});

Actor.belongsToMany(Film, {
  through: 'film_actor',
  foreignKey: 'actor_id',
  otherKey: 'film_id',
  timestamps: false,
});

Film.belongsToMany(Category, { 
  through: 'film_category',
  foreignKey: 'film_id',
  timestamps: false,
});

Category.belongsToMany(Film, { 
  through: 'film_category',
  foreignKey: 'category_id',
  timestamps: false,         
});

module.exports = {
  Film,
  Actor,
  Category,
};