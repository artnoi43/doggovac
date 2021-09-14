const express = require('express');
const passport = require('passport');
const router = express.Router();
const usersControllers = require('../controllers/users');

const auth = passport.authenticate("jwt", { session: false });

router.get('/', auth, usersControllers.getUsers);
router.post('/register', usersControllers.registerUser);
router.post('/login', usersControllers.loginUser);
router.patch('/changepassword', auth, usersControllers.changePassword);
router.delete('/', auth, usersControllers.deleteUser);

module.exports = router;