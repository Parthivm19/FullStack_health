const mongoose = require('mongoose');

const dietPlanSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:     { type: String, enum: ['Breakfast', 'Lunch', 'Snack', 'Dinner'] },
  time:     String,
  items:    [String],
  calories: Number,
  icon:     String,
  date:     { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('DietPlan', dietPlanSchema);