const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const MedHistory = require('../models/MedHistory');

router.get('/', protect, async (req, res) => {
  try {
    let history = await MedHistory.findOne({ userId: req.user.id });
    if (!history) history = await MedHistory.create({ userId: req.user.id, conditions: [], reports: [] });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/conditions', protect, async (req, res) => {
  try {
    const history = await MedHistory.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { conditions: req.body } },
      { new: true, upsert: true }
    );
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/reports', protect, async (req, res) => {
  try {
    const history = await MedHistory.findOneAndUpdate(
      { userId: req.user.id },
      { $push: { reports: req.body } },
      { new: true, upsert: true }
    );
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;