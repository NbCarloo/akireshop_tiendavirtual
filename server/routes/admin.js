const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.use(protect, adminOnly);

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalOrders, todayOrders, totalRevenue, totalCustomers, lowStock, recentOrders] = await Promise.all([
      Order.countDocuments({ status: { $ne: 'cancelled' } }),
      Order.countDocuments({ createdAt: { $gte: today }, status: { $ne: 'cancelled' } }),
      Order.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      User.countDocuments({ role: 'customer' }),
      Product.find({ 'sizes.stock': { $lt: 5 }, isActive: true }).select('name sizes').limit(10),
      Order.find().sort({ createdAt: -1 }).limit(10).populate('user', 'name email'),
    ]);

    res.json({
      totalOrders,
      todayOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalCustomers,
      lowStock,
      recentOrders,
    });
  } catch (err) { next(err); }
});

// GET /api/admin/orders
router.get('/orders', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 25 } = req.query;
    const filter = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('user', 'name email'),
      Order.countDocuments(filter),
    ]);
    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// PUT /api/admin/orders/:id
router.put('/orders/:id', async (req, res, next) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(trackingNumber && { trackingNumber }) },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) { next(err); }
});

// GET /api/admin/customers
router.get('/customers', async (req, res, next) => {
  try {
    const { page = 1, limit = 25 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [customers, total] = await Promise.all([
      User.find({ role: 'customer' }).select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments({ role: 'customer' }),
    ]);
    res.json({ customers, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

module.exports = router;
