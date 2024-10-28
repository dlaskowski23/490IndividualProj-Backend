const { Op } = require('sequelize');
const { Customer, Rental, Inventory, Film } = require('../models');

exports.getAllCustomers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const { customerId, firstName, lastName } = req.query;

  try {
    let whereClause = {};
    if (customerId) {
      whereClause.customer_id = customerId;
    } else if (firstName) {
      whereClause.first_name = { [Op.like]: `%${firstName}%` };
    } else if (lastName) {
      whereClause.last_name = { [Op.like]: `%${lastName}%` };
    }

    const { count, rows: customers } = await Customer.findAndCountAll({
      where: whereClause,
      offset,
      limit,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      customers,
      totalPages,
      currentPage: page,
      totalItems: count,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

exports.addCustomer = async (req, res) => {
  const { firstName, lastName, email, storeId, addressId } = req.body;

  try {
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const newCustomer = await Customer.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      store_id: storeId || 1,
      address_id: addressId || 1,
    });

    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ error: 'Failed to add customer' });
  }
};

exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;

  try {
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'First name, last name, and email are required' });
    }

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    customer.first_name = firstName;
    customer.last_name = lastName;
    customer.email = email;

    await customer.save();

    res.status(200).json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
};

exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    await customer.destroy();

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
};

exports.getCustomerDetails = async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const customer = await Customer.findByPk(id, {
      include: {
        model: Rental,
        limit: limit,
        offset: offset,
        include: {
          model: Inventory,
          include: {
            model: Film,
            attributes: ['title', 'description'],
          },
        },
      },
    });

    const rentalCount = await Rental.count({ where: { customer_id: id } });
    const totalPages = Math.ceil(rentalCount / limit);

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({
      customer,
      totalPages,
      currentPage: page,
      totalRentals: rentalCount,
    });
  } catch (error) {
    console.error('Error fetching customer details:', error);
    res.status(500).json({ error: 'Failed to fetch customer details' });
  }
};

exports.returnRental = async (req, res) => {
  const { rental_id } = req.params;
  const { return_date } = req.body;

  try {
    const rental = await Rental.findByPk(rental_id);
    if (!rental) {
      return res.status(404).json({ error: 'Rental not found' });
    }

    rental.return_date = return_date || new Date();
    await rental.save();

    res.json({ message: 'Rental marked as returned', rental });
  } catch (error) {
    console.error('Error marking rental as returned:', error);
    res.status(500).json({ error: 'Failed to mark rental as returned' });
  }
};