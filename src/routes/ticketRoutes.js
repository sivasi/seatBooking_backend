const express = require('express');
const { getSeat, bookTicket, resetSeat } = require('../controllers/ticketController');
const router = express.Router();

router.post('/', bookTicket);
router.get('/', getSeat);
router.delete('/', resetSeat);

module.exports = router;
