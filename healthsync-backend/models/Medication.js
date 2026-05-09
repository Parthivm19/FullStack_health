const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:    { type: String, required: true },
  dosage:  { type: String, required: true },
  time:    { type: String, required: true },
  status:  { type: String, enum: ['taken', 'pending'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Medication', medicationSchema);