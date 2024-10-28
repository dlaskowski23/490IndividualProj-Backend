const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Film = require('./film.model');

const Inventory = sequelize.define('Inventory', {
    inventory_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    film_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'inventory',
    timestamps: false
});

const Rental = require('./rental.model');
Inventory.hasMany(Rental, { foreignKey: 'inventory_id', as: 'Rentals' });
Rental.belongsTo(Inventory, { foreignKey: 'inventory_id' });

module.exports = Inventory;