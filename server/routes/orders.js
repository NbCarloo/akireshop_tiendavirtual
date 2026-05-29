const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const protect = require('../middleware/auth');
const { sendOrderConfirmation } = require('../utils/sendEmail');

// ─── PayPal helpers ─────────────────────────────────────────────────────────
const PAYPAL_API = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getPayPalToken() {
  const resp = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });
  const data = await resp.json();
  return data.access_token;
}

async function capturePayPalOrder(paypalOrderId) {
  const token = await getPayPalToken();
  const resp = await fetch(`${PAYPAL_API}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return resp.json();
}

// ─── Shared: build order items ───────────────────────────────────────────────
async function buildOrderItems(items) {
  return Promise.all(items.map(async (item) => {
    const product = await Product.findById(item.productId);
    if (!product) throw new Error(`Producto no encontrado: ${item.productId}`);
    return {
      product: product._id,
      name: product.name,
      image: product.colors?.[0]?.images?.[0] || '',
      color: item.color,
      size: item.size,
      qty: item.qty,
      price: product.salePrice || product.price,
    };
  }));
}

async function calcTotals(items) {
  let subtotal = 0;
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) throw new Error(`Producto no encontrado: ${item.productId}`);
    subtotal += (product.salePrice || product.price) * item.qty;
  }
  const shippingCost = subtotal >= 75 ? 0 : 5.99;
  return { subtotal, shippingCost, total: subtotal + shippingCost };
}

// ─── POST /api/orders/paypal/create-order ────────────────────────────────────
router.post('/paypal/create-order', async (req, res, next) => {
  try {
    const { items } = req.body;
    const { subtotal, shippingCost, total } = await calcTotals(items);

    const token = await getPayPalToken();
    const resp = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: total.toFixed(2),
            breakdown: {
              item_total: { currency_code: 'USD', value: subtotal.toFixed(2) },
              shipping: { currency_code: 'USD', value: shippingCost.toFixed(2) },
            },
          },
        }],
      }),
    });
    const data = await resp.json();
    res.json({ id: data.id, subtotal, shippingCost, total });
  } catch (err) { next(err); }
});

// ─── POST /api/orders/paypal/capture ─────────────────────────────────────────
router.post('/paypal/capture', async (req, res, next) => {
  try {
    const { paypalOrderId, items, shippingAddress, subtotal, shippingCost, total, userId, guestEmail } = req.body;

    const capture = await capturePayPalOrder(paypalOrderId);
    if (capture.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Pago no completado' });
    }

    const orderItems = await buildOrderItems(items);
    const order = await Order.create({
      user: userId || null,
      guestEmail: guestEmail || null,
      items: orderItems,
      shippingAddress,
      paymentIntentId: paypalOrderId,
      paymentMethod: 'paypal',
      status: 'paid',
      subtotal,
      shippingCost,
      total,
    });

    const emailTo = guestEmail || (userId ? (await User.findById(userId))?.email : null);
    if (emailTo) sendOrderConfirmation(emailTo, order).catch(console.error);

    res.status(201).json(order);
  } catch (err) { next(err); }
});

// ─── POST /api/orders/sinpe ──────────────────────────────────────────────────
router.post('/sinpe', async (req, res, next) => {
  try {
    const { items, shippingAddress, sinpeReference, userId, guestEmail } = req.body;
    const { subtotal, shippingCost, total } = await calcTotals(items);
    const orderItems = await buildOrderItems(items);

    const order = await Order.create({
      user: userId || null,
      guestEmail: guestEmail || null,
      items: orderItems,
      shippingAddress,
      paymentIntentId: sinpeReference || null,
      paymentMethod: 'sinpe',
      status: 'pending',           // admin manually confirms after verifying transfer
      subtotal,
      shippingCost,
      total,
    });

    res.status(201).json(order);
  } catch (err) { next(err); }
});

// ─── GET /api/orders/my-orders ───────────────────────────────────────────────
router.get('/my-orders', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { next(err); }
});

// ─── GET /api/orders/:id ─────────────────────────────────────────────────────
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name slug');
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
    if (order.user?.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Sin autorización' });
    res.json(order);
  } catch (err) { next(err); }
});

module.exports = router;
