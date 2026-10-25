const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: [true, 'Show is required'],
    },
    seats: {
      type: [String],
      required: [true, 'Seats are required'],
      validate: {
        validator: (v) => v.length > 0,
        message: 'At least one seat must be selected',
      },
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
    },
    bookingRef: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['demo', 'paid', 'refunded'],
      default: 'demo',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
