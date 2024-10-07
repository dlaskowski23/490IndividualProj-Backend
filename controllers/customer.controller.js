const Customer = require('../models/customer.model');

exports.getAllCustomers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows: customers } = await Customer.findAndCountAll({
      offset,
      limit
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      customers,
      totalPages,
      currentPage: page,
      totalItems: count
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};