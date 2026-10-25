const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats are required'],
    },
    rows: {
      type: Number,
      required: [true, 'Number of rows is required'],
    },
    seatsPerRow: {
      type: Number,
      required: [true, 'Seats per row is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Theatre', theatreSchema);
