const mongoose = require('mongoose');

const birthSchema = new mongoose.Schema(
  {
    date: Number,
    month: Number,
    year: Number,
    hour: Number,
    minute: Number,
    latitude: Number,
    longitude: Number,
    timezone: Number,
    place: String
  },
  { _id: false }
);

const readingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    birth: birthSchema,
    astroNatal: { type: Object },
    destinyMatrix: { type: Object },
    promptContext: { type: Object },
    aiModel: { type: String, default: 'gpt-4o-mini' },
    aiResponse: { type: String },
    meta: { type: Object }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reading', readingSchema);