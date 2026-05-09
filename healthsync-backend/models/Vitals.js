const mongoose = require('mongoose');

const vitalsSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  heartRate: Number,
  steps:     Number,
  sleep:     Number,
  calories:  Number,
  water:     Number,
  date:      { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Vitals', vitalsSchema);