const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('./bookings.controller'); // Changed

router.post('/request', auth, controller.requestBooking);
router.put('/respond', auth, controller.respondBooking);

module.exports = router;