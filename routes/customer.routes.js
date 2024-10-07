const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');

router.get('/customers', customerController.getAllCustomers);

module.exports = router;