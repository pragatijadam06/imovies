const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie is required'],
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre is required'],
    },
    date: {
      type: Date,
      required: [true, 'Show date is required'],
    },
    time: {
      type: String, // e.g. "10:30 AM"
      required: [true, 'Show time is required'],
    },
    price: {
      type: Number,
      required: [true, 'Ticket price is required'],
      min: [0, 'Price cannot be negative'],
    },
    bookedSeats: {
      type: [String], // e.g. ["A1", "A2", "B3"]
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound index for querying shows by movie + date
showSchema.index({ movie: 1, date: 1 });
showSchema.index({ theatre: 1, date: 1 });

module.exports = mongoose.model('Show', showSchema);
