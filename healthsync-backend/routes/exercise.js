const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const Exercise = require('../models/Exercise');

router.get('/', protect, async (req, res) => {
  try {
    const exercises = await Exercise.find({ userId: req.user.id });
    res.json(exercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const exercise = await Exercise.create({ ...req.body, userId: req.user.id });
    res.status(201).json(exercise);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(exercise);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;