const express = require('express');
const { getMovies, getMovie, getFilters } = require('../controllers/movieController');

const router = express.Router();

router.get('/filters', getFilters);
router.get('/', getMovies);
router.get('/:id', getMovie);

module.exports = router;
