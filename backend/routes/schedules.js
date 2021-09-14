const express = require('express');
const passport = require('passport');
const schedulesControllers = require('../controllers/schedules');

const auth = passport.authenticate("jwt", { session: false });
const router = express.Router();

router.get('/', auth, schedulesControllers.getSchedules);
router.get('/:due', auth, schedulesControllers.getDue);
router.put('/:id', auth, schedulesControllers.updateSchedule);

module.exports = router;