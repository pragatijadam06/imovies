const Show = require('../models/Show');
const Theatre = require('../models/Theatre');

const POSTER_FIXES = {
  'Interstellar': 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  'RRR': 'https://image.tmdb.org/t/p/w500/u0XUBNQWlOvrh0Gd97ARGpIkL0.jpg',
  'Avengers: Endgame': 'https://image.tmdb.org/t/p/w500/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg',
};

// Check if a showtime is in the past relative to current local time
const isShowExpired = (dateInput, timeStr) => {
  if (!dateInput || !timeStr) return false;
  const showDate = new Date(dateInput);
  const now = new Date();

  const showYear = showDate.getFullYear();
  const showMonth = showDate.getMonth();
  const showDay = showDate.getDate();

  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth();
  const nowDay = now.getDate();

  // Past day
  if (
    showYear < nowYear ||
    (showYear === nowYear && showMonth < nowMonth) ||
    (showYear === nowYear && showMonth === nowMonth && showDay < nowDay)
  ) {
    return true;
  }

  // Future day
  if (
    showYear > nowYear ||
    (showYear === nowYear && showMonth > nowMonth) ||
    (showYear === nowYear && showMonth === nowMonth && showDay > nowDay)
  ) {
    return false;
  }

  // Same day: parse time string (e.g., "01:30 PM", "10:00 AM")
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return false;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  const showDateTime = new Date(showYear, showMonth, showDay, hours, minutes, 0, 0);
  return showDateTime <= now;
};

// @desc  Get shows for a specific movie (grouped by date)
// @route GET /api/shows/movie/:movieId
// @access Public
const getShowsByMovie = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let shows = await Show.find({
      movie: req.params.movieId,
      date: { $gte: today },
      isActive: true,
    })
      .populate('theatre', 'name location city')
      .sort({ date: 1, time: 1 });

    // If no upcoming shows exist (e.g. days passed since database seeding),
    // automatically roll shows forward starting from today so demo shows are always available!
    if (shows.length === 0) {
      const existingShows = await Show.find({ movie: req.params.movieId, isActive: true });
      if (existingShows.length > 0) {
        const bulkOps = existingShows.map((s, idx) => {
          const newDate = new Date(today);
          newDate.setDate(today.getDate() + (idx % 7)); // spread shows over next 7 days
          return {
            updateOne: {
              filter: { _id: s._id },
              update: { $set: { date: newDate } },
            },
          };
        });
        await Show.bulkWrite(bulkOps);

        shows = await Show.find({
          movie: req.params.movieId,
          date: { $gte: today },
          isActive: true,
        })
          .populate('theatre', 'name location city')
          .sort({ date: 1, time: 1 });
      }
    }

    // Attach accurate expiration flag to each show
    const showsWithStatus = shows.map((s) => {
      const showObj = s.toObject();
      showObj.isExpired = isShowExpired(s.date, s.time);
      return showObj;
    });

    res.json({ success: true, shows: showsWithStatus });
  } catch (error) {
    next(error);
  }
};

// @desc  Get a single show with full details (including seat availability)
// @route GET /api/shows/:showId
// @access Public
const getShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.showId)
      .populate('movie', 'title poster duration genre languages')
      .populate('theatre', 'name location city rows seatsPerRow totalSeats');

    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found.' });
    }

    const showObj = show.toObject();
    showObj.isExpired = isShowExpired(show.date, show.time);

    if (showObj.movie && POSTER_FIXES[showObj.movie.title] && showObj.movie.poster !== POSTER_FIXES[showObj.movie.title]) {
      showObj.movie.poster = POSTER_FIXES[showObj.movie.title];
    }

    res.json({ success: true, show: showObj });
  } catch (error) {
    next(error);
  }
};

module.exports = { getShowsByMovie, getShow, isShowExpired };
