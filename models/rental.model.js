const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Rental = sequelize.define('Rental', {
    rental_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rental_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    return_date: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'rental',
    timestamps: false
});

module.exports = Rental;