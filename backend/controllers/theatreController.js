const Theatre = require('../models/Theatre');

// @desc  Get all theatres
// @route GET /api/theatres
// @access Public
const getTheatres = async (req, res, next) => {
  try {
    const theatres = await Theatre.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, theatres });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single theatre
// @route GET /api/theatres/:id
// @access Public
const getTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre || !theatre.isActive) {
      return res.status(404).json({ success: false, message: 'Theatre not found.' });
    }
    res.json({ success: true, theatre });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTheatres, getTheatre };
