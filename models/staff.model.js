const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Staff = sequelize.define('Staff', {
    staff_id: {
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
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'staff',
    timestamps: false
});

module.exports = Staff;