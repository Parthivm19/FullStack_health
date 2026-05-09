const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true },
  duration:    String,
  difficulty:  { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  calories:    Number,
  description: String,
  image:       String,
  completed:   { type: Boolean, default: false },
  date:        { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Exercise', exerciseSchema);