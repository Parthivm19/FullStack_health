const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  status:        { type: String, enum: ['active', 'managed'], default: 'active' },
  diagnosedDate: String,
  color:         String
});

const reportSchema = new mongoose.Schema({
  name: String,
  date: String,
  type: String,
  image: String
});

const medHistorySchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  conditions: [conditionSchema],
  reports:    [reportSchema]
}, { timestamps: true });

module.exports = mongoose.model('MedHistory', medHistorySchema);