const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const protect = require('../middleware/auth');

// GET /api/users/me
router.get('/me', protect, (req, res) => {
  res.json(req.user);
});

// PUT /api/users/me
router.put('/me', protect, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) updates.passwordHash = await bcrypt.hash(password, 12);

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-passwordHash');
    res.json(user);
  } catch (err) { next(err); }
});

// POST /api/users/wishlist/:productId — toggle
router.post('/wishlist/:productId', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const idx = user.wishlist.indexOf(req.params.productId);
    if (idx === -1) {
      user.wishlist.push(req.params.productId);
    } else {
      user.wishlist.splice(idx, 1);
    }
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) { next(err); }
});

// GET /api/users/wishlist
router.get('/wishlist', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (err) { next(err); }
});

// POST /api/users/addresses
router.post('/addresses', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.push(req.body);
    await user.save();
    res.json(user.addresses);
  } catch (err) { next(err); }
});

// DELETE /api/users/addresses/:addressId
router.delete('/addresses/:addressId', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addressId);
    await user.save();
    res.json(user.addresses);
  } catch (err) { next(err); }
});

// POST /api/users/newsletter
router.post('/newsletter', async (req, res, next) => {
  try {
    const { email } = req.body;
    await User.findOneAndUpdate({ email }, { newsletterSubscribed: true }, { upsert: false });
    res.json({ message: 'Subscribed!' });
  } catch (err) { next(err); }
});

module.exports = router;
