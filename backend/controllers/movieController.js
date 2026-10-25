const Movie = require('../models/Movie');

// Verified working TMDB poster URLs to self-heal outdated database entries
const POSTER_FIXES = {
  'Interstellar': 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  'RRR': 'https://image.tmdb.org/t/p/w500/u0XUBNQWlOvrh0Gd97ARGpIkL0.jpg',
  'Avengers: Endgame': 'https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg',
  'Parasite': 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
  'The Dark Knight': 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
  'Inception': 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
  'Oppenheimer': 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
  'Spider-Man: No Way Home': 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
};

// @desc  Get all movies (with search & filter)
// @route GET /api/movies
// @access Public
const getMovies = async (req, res, next) => {
  try {
    const { search, genre, language, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (genre) query.genre = { $in: [genre] };
    if (language) query.languages = { $in: [language] };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Movie.countDocuments(query);
    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Self-heal any broken poster URLs in memory & DB
    movies.forEach((m) => {
      if (POSTER_FIXES[m.title] && m.poster !== POSTER_FIXES[m.title]) {
        m.poster = POSTER_FIXES[m.title];
        Movie.updateOne({ _id: m._id }, { poster: POSTER_FIXES[m.title] }).exec();
      }
    });

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single movie
// @route GET /api/movies/:id
// @access Public
const getMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie || !movie.isActive) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }

    if (POSTER_FIXES[movie.title] && movie.poster !== POSTER_FIXES[movie.title]) {
      movie.poster = POSTER_FIXES[movie.title];
      Movie.updateOne({ _id: movie._id }, { poster: POSTER_FIXES[movie.title] }).exec();
    }

    res.json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

// @desc  Get distinct genres & languages (for filter dropdowns)
// @route GET /api/movies/filters
// @access Public
const getFilters = async (req, res, next) => {
  try {
    const genres = await Movie.distinct('genre', { isActive: true });
    const languages = await Movie.distinct('languages', { isActive: true });
    res.json({ success: true, genres, languages });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMovies, getMovie, getFilters };
