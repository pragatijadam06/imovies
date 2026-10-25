const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required'],
    },
    languages: {
      type: [String],
      required: [true, 'At least one language is required'],
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Duration is required'],
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    releaseDate: {
      type: Date,
    },
    cast: {
      type: [String],
      default: [],
    },
    director: {
      type: String,
      default: '',
    },
    poster: {
      type: String, // URL
      default: '',
    },
    trailer: {
      type: String, // YouTube URL
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

movieSchema.index({ title: 1 });

module.exports = mongoose.model('Movie', movieSchema);
