const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  email:         { type: String, required: true, unique: true },
  password:      { type: String, required: true },
  age:           Number,
  gender:        String,
  height:        Number,
  weight:        Number,
  activityLevel: { type: String, default: 'moderate' },
  profilePic:    String,
  notifications: {
    medicationReminders: { type: Boolean, default: true },
    dailyActivityGoals:  { type: Boolean, default: true },
    healthInsights:      { type: Boolean, default: true },
    weeklyReports:       { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);