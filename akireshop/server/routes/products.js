const express = require('express');
const router = express.Router();
const slugify = require('slugify');
const Product = require('../models/Product');
const protect = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const { upload } = require('../utils/cloudinary');

// GET /api/products — public, supports query filters
router.get('/', async (req, res, next) => {
  try {
    const { category, size, color, minPrice, maxPrice, sort, search, tag, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (size) filter['sizes.size'] = size;
    if (color) filter['colors.name'] = { $regex: color, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.$text = { $search: search };

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
    };
    const sortOption = sortMap[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

// GET /api/products/:slug — single product
router.get('/:slug', async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { next(err); }
});

// POST /api/products — admin
router.post('/', protect, adminOnly, upload.array('images', 10), async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    data.slug = slugify(data.name, { lower: true, strict: true });

    // attach uploaded image URLs to the first color if provided
    if (req.files?.length && data.colors?.length) {
      data.colors[0].images = req.files.map(f => f.path);
    }

    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (err) { next(err); }
});

// PUT /api/products/:id — admin
router.put('/:id', protect, adminOnly, upload.array('images', 10), async (req, res, next) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    if (data.name) data.slug = slugify(data.name, { lower: true, strict: true });
    if (req.files?.length && data.colors?.length) {
      data.colors[0].images = [
        ...(data.colors[0].images || []),
        ...req.files.map(f => f.path),
      ];
    }
    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { next(err); }
});

// DELETE /api/products/:id — admin (soft delete)
router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Product removed' });
  } catch (err) { next(err); }
});

module.exports = router;
