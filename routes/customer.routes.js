const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');

router.get('/customers', customerController.getAllCustomers);

router.post('/customers', customerController.addCustomer);

router.put('/customers/:id', customerController.updateCustomer);

router.delete('/customers/:id', customerController.deleteCustomer);

router.get('/customers/:id/details', customerController.getCustomerDetails);

router.put('/rentals/:rental_id/return', customerController.returnRental);

module.exports = router;