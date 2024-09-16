// models/film.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Film = sequelize.define('Film', {
  film_id: { type: DataTypes.INTEGER, primaryKey: true },
  title: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  release_year: { type: DataTypes.INTEGER }
}, {
  tableName: 'film',
  timestamps: false
});

module.exports = Film;
