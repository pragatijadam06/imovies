const express = require('express');
const { getTheatres, getTheatre } = require('../controllers/theatreController');

const router = express.Router();

router.get('/', getTheatres);
router.get('/:id', getTheatre);

module.exports = router;
