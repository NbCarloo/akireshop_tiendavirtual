const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const protect = require('../middleware/auth');

// GET /api/reviews/:productId
router.get('/:productId', async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { next(err); }
});

// POST /api/reviews/:productId
router.post('/:productId', protect, async (req, res, next) => {
  try {
    const { rating, body } = req.body;
    const existing = await Review.findOne({ product: req.params.productId, user: req.user._id });
    if (existing) return res.status(409).json({ message: 'You already reviewed this product' });

    const review = await Review.create({ product: req.params.productId, user: req.user._id, rating, body });

    // recalculate product rating
    const allReviews = await Review.find({ product: req.params.productId });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Product.findByIdAndUpdate(req.params.productId, {
      'ratings.average': Math.round(avg * 10) / 10,
      'ratings.count': allReviews.length,
    });

    await review.populate('user', 'name');
    res.status(201).json(review);
  } catch (err) { next(err); }
});

module.exports = router;
