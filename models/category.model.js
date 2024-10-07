const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Category = sequelize.define('Category', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_update: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'category',
  timestamps: false,
});

module.exports = Category;