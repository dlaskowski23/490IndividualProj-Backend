const sequelize = require('../config/db.config');
const Film = require('./film.model');
const Actor = require('./actor.model');
const Category = require('./category.model');
const Customer = require('./customer.model');
const Rental = require('./rental.model');
const Inventory = require('./inventory.model');
const Staff = require('./staff.model');

Customer.hasMany(Rental, { foreignKey: 'customer_id' });
Rental.belongsTo(Customer, { foreignKey: 'customer_id' });

Rental.belongsTo(Inventory, { foreignKey: 'inventory_id' });
Inventory.hasMany(Rental, { foreignKey: 'inventory_id' });

Rental.belongsTo(Staff, { foreignKey: 'staff_id' });
Staff.hasMany(Rental, { foreignKey: 'staff_id' });

Inventory.belongsTo(Film, { foreignKey: 'film_id' });
Film.hasMany(Inventory, { foreignKey: 'film_id' });

module.exports = {
  sequelize,
  Film,
  Actor,
  Category,
  Customer,
  Rental,
  Inventory,
  Staff,
};