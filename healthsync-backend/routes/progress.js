const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const Vitals = require('../models/Vitals');

router.get('/', protect, async (req, res) => {
  try {
    const data = await Vitals.find({ userId: req.user.id }).sort({ date: 1 }).limit(30);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;