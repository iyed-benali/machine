const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
    },
    favorites: {
      type: [String],
      default: [],
    },
    recent_search: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      default: '',
    },
    lat_long: {
      type: [Number], // Could represent [latitude, longitude]
      default: [],
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    block_reason: {
      type: String,
      default: '',
    },
    blocked_at: {
      type: Date,
      default: null,
    },
  }, { timestamps: true });
  
  module.exports = mongoose.model('Client', clientSchema);
  