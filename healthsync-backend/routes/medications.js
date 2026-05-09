const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const Medication = require('../models/Medication');

router.get('/', protect, async (req, res) => {
  try {
    const meds = await Medication.find({ userId: req.user.id });
    res.json(meds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const med = await Medication.create({ ...req.body, userId: req.user.id });
    res.status(201).json(med);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const med = await Medication.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(med);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;