const express = require('express');
const passport = require('passport');
const customersControllers = require('../controllers/customers');

const auth = passport.authenticate("jwt", { session: false });
const router = express.Router();

router.post('/', auth, customersControllers.createCustomer);
router.get('/', auth, customersControllers.getCustomers);
router.get('/:id', auth, customersControllers.getCustomer);
router.put('/:id', auth, customersControllers.updateCustomer);
router.delete('/:id', auth, customersControllers.deleteCustomer);

module.exports = router;