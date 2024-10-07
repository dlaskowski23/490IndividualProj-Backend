const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Actor = sequelize.define('Actor', {
    actor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'actor',
    timestamps: false
});

module.exports = Actor;