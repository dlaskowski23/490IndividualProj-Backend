const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Actor = sequelize.define('Actor', {
  actor_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  first_name: {
    type: DataTypes.STRING,
  },
  last_name: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'actor',
  timestamps: false,
});

module.exports = Actor;
