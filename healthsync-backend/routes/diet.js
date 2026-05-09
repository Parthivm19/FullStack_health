const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const DietPlan = require('../models/DietPlan');

router.get('/', protect, async (req, res) => {
  try {
    const meals = await DietPlan.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const meal = await DietPlan.create({ ...req.body, userId: req.user.id });
    res.status(201).json(meal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await DietPlan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Meal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;