const express = require('express');
const passport = require('passport');
const petsControllers = require('../controllers/pets')

const auth = passport.authenticate("jwt", { session: false });
const router = express.Router();

router.get('/', auth, petsControllers.getPets);
router.get('/:id', auth, petsControllers.getPet);
router.post('/', auth, petsControllers.createPet);
router.put('/:id', auth, petsControllers.updatePet);
router.delete('/:id', auth, petsControllers.deletePet);

module.exports = router;