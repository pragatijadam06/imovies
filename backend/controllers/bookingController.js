const { customAlphabet } = require('nanoid');
const Booking = require('../models/Booking');
const Show = require('../models/Show');
const { isShowExpired } = require('./showController');

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

// @desc  Create a new booking (atomic seat reservation)
// @route POST /api/bookings
// @access Private
const createBooking = async (req, res, next) => {
  try {
    const { showId, seats } = req.body;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, message: 'Show ID and seats are required.' });
    }

    // Check if show has already started/expired
    const targetShow = await Show.findById(showId);
    if (!targetShow || !targetShow.isActive) {
      return res.status(404).json({ success: false, message: 'Show not found.' });
    }

    if (isShowExpired(targetShow.date, targetShow.time)) {
      return res.status(400).json({
        success: false,
        message: `This show (${targetShow.time}) has already started or ended. Bookings are closed.`,
      });
    }

    // Atomically add seats only if none are already booked
    const updatedShow = await Show.findOneAndUpdate(
      {
        _id: showId,
        isActive: true,
        bookedSeats: { $not: { $elemMatch: { $in: seats } } }, // none of the seats already booked
      },
      { $addToSet: { bookedSeats: { $each: seats } } },
      { new: true }
    );

    if (!updatedShow) {
      // Either show not found, or one or more seats already taken
      const show = await Show.findById(showId);
      if (!show) {
        return res.status(404).json({ success: false, message: 'Show not found.' });
      }
      const conflict = seats.filter((s) => show.bookedSeats.includes(s));
      return res.status(409).json({
        success: false,
        message: `Seat(s) ${conflict.join(', ')} already booked. Please select different seats.`,
      });
    }

    const totalPrice = updatedShow.price * seats.length;
    const bookingRef = 'IMOV-' + nanoid();

    const booking = await Booking.create({
      user: req.user._id,
      show: showId,
      seats,
      totalPrice,
      bookingRef,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate({ path: 'show', populate: [{ path: 'movie', select: 'title poster' }, { path: 'theatre', select: 'name location city' }] });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed!',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get logged-in user's bookings
// @route GET /api/bookings/my
// @access Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'show',
        populate: [
          { path: 'movie', select: 'title poster genre languages duration' },
          { path: 'theatre', select: 'name location city' },
        ],
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

// @desc  Get a single booking by ID (owner only)
// @route GET /api/bookings/:id
// @access Private
const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: 'show',
      populate: [
        { path: 'movie', select: 'title poster genre languages duration rating' },
        { path: 'theatre', select: 'name location city' },
      ],
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Only the booking owner can view it
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc  Cancel a booking
// @route PUT /api/bookings/:id/cancel
// @access Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Release the seats back
    await Show.findByIdAndUpdate(booking.show, {
      $pullAll: { bookedSeats: booking.seats },
    });

    res.json({ success: true, message: 'Booking cancelled successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getMyBookings, getBooking, cancelBooking };
