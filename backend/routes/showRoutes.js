const express = require('express');
const { getShowsByMovie, getShow } = require('../controllers/showController');

const router = express.Router();

router.get('/movie/:movieId', getShowsByMovie);
router.get('/:showId', getShow);

module.exports = router;
