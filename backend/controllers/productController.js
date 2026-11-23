const path     = require('path');
const fs       = require('fs');
const Product  = require('../models/Product');
const seedData = require('../data/seedProducts');

// ── Image helpers (unchanged — images stay on disk) ───────
const UPLOADS_DIR = path.join(__dirname, '../../public/uploads');
const GENERIC_FALLBACK =
  'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80';

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const saveBase64Image = (base64String, filename) => {
  let data = base64String;
  let ext  = path.extname(filename).replace('.', '') || 'jpg';

  const match = base64String.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
  if (match) {
    ext  = match[1].replace('jpeg', 'jpg').replace('+xml', '').replace('svg', 'jpg');
    data = match[2];
  }

  const safe = filename
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .toLowerCase()
    .replace(/\.[^.]+$/, '') + '.' + ext;

  fs.writeFileSync(path.join(UPLOADS_DIR, safe), Buffer.from(data, 'base64'));
  return '/uploads/' + safe;
};

const deleteImageFile = (imagePath) => {
  if (!imagePath || !imagePath.startsWith('/uploads/')) return;
  try {
    const fp = path.join(UPLOADS_DIR, path.basename(imagePath));
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  } catch (err) {
    console.warn('[deleteImageFile]', err.message);
  }
};

const slugify = (str) =>
  str.toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// ── GET /api/products ─────────────────────────────────────
const getAllProducts = async (req, res) => {
  try {
    const { category, search, featured, sort } = req.query;
    const filter = {};

    if (category && category !== 'all') filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (search && search.trim()) {
      const q = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: q }, { subtitle: q }, { description: q }];
    }

    let query = Product.find(filter).lean();

    if      (sort === 'price-low')  query = query.sort({ pricePerKg:  1 });
    else if (sort === 'price-high') query = query.sort({ pricePerKg: -1 });
    else if (sort === 'rating')     query = query.sort({ rating:     -1 });
    else                            query = query.sort({ createdAt:  -1 });

    const products = await query;
    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    console.error('[getAllProducts]', err.message);
    res.status(500).json({ success: false, message: 'Failed to retrieve products', error: err.message });
  }
};

// ── GET /api/products/:id ─────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id }).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: `Product not found: ${req.params.id}` });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve product', error: err.message });
  }
};

// ── POST /api/products/seed ───────────────────────────────
const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    const inserted = await Product.insertMany(seedData);
    res.json({ success: true, message: `Seeded ${inserted.length} products.`, count: inserted.length });
  } catch (err) {
    console.error('[seedProducts]', err.message);
    res.status(500).json({ success: false, message: 'Failed to seed products', error: err.message });
  }
};

// ── POST /api/products ────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const {
      name, category, pricePerKg, originalPricePerKg,
      badge, badgeColor, description, subtitle, origin,
      inStock, featured, weights, imageBase64, imageName,
    } = req.body;

    if (!name || !category || !pricePerKg) {
      return res.status(400).json({ success: false, message: 'name, category, and pricePerKg are required.' });
    }

    const id = slugify(name) + '-' + Date.now();

    let imagePath = req.body.image || '';
    if (imageBase64 && imageBase64.trim()) {
      imagePath = saveBase64Image(imageBase64, imageName || (id + '.jpg'));
    }

    const defaultWeights = [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 },
    ];

    const product = await Product.create({
      id,
      name:               name.trim(),
      subtitle:           (subtitle || '').trim(),
      category:           (category || 'nuts').toLowerCase().trim(),
      badge:              (badge || '').trim(),
      badgeColor:         badgeColor || 'bg-amber-600',
      rating:             4.5,
      reviewsCount:       0,
      pricePerKg:         Number(pricePerKg),
      originalPricePerKg: Number(originalPricePerKg || pricePerKg),
      image:              imagePath || GENERIC_FALLBACK,
      fallbackImage:      GENERIC_FALLBACK,
      origin:             (origin || '').trim(),
      description:        (description || '').trim(),
      weights:            (Array.isArray(weights) && weights.length > 0) ? weights : defaultWeights,
      inStock:            inStock !== false && inStock !== 'false',
      featured:           featured === true || featured === 'true',
    });

    console.log(`[Product Created] ${product.name} (${product.id})`);
    res.status(201).json({ success: true, message: `Product "${product.name}" created.`, data: product });
  } catch (err) {
    console.error('[createProduct]', err.message);
    res.status(400).json({ success: false, message: 'Failed to create product', error: err.message });
  }
};

// ── PUT /api/products/:id ─────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Product.findOne({ id });
    if (!existing) {
      return res.status(404).json({ success: false, message: `Product not found: ${id}` });
    }

    const {
      name, category, pricePerKg, originalPricePerKg,
      badge, badgeColor, description, subtitle, origin,
      inStock, featured, weights, imageBase64, imageName,
    } = req.body;

    let imagePath = existing.image;
    if (imageBase64 && imageBase64.trim()) {
      const newPath = saveBase64Image(imageBase64, imageName || (id + '-' + Date.now() + '.jpg'));
      if (existing.image && existing.image.startsWith('/uploads/')) {
        deleteImageFile(existing.image);
      }
      imagePath = newPath;
    } else if (req.body.image && req.body.image !== existing.image) {
      imagePath = req.body.image;
    }

    const updates = {
      ...(name               !== undefined && { name:               name.trim() }),
      ...(subtitle           !== undefined && { subtitle:           subtitle.trim() }),
      ...(category           !== undefined && { category:           category.toLowerCase().trim() }),
      ...(badge              !== undefined && { badge:              badge.trim() }),
      ...(badgeColor         !== undefined && { badgeColor }),
      ...(pricePerKg         !== undefined && { pricePerKg:         Number(pricePerKg) }),
      ...(originalPricePerKg !== undefined && { originalPricePerKg: Number(originalPricePerKg) }),
      ...(description        !== undefined && { description:        description.trim() }),
      ...(origin             !== undefined && { origin:             origin.trim() }),
      ...(inStock            !== undefined && { inStock:            inStock !== false && inStock !== 'false' }),
      ...(featured           !== undefined && { featured:           featured === true || featured === 'true' }),
      ...(Array.isArray(weights) && weights.length > 0 && { weights }),
      image: imagePath,
    };

    const updated = await Product.findOneAndUpdate(
      { id },
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    console.log(`[Product Updated] ${updated.name} (${id})`);
    res.json({ success: true, message: `Product "${updated.name}" updated.`, data: updated });
  } catch (err) {
    console.error('[updateProduct]', err.message);
    res.status(400).json({ success: false, message: 'Failed to update product', error: err.message });
  }
};

// ── DELETE /api/products/:id ──────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOneAndDelete({ id });
    if (!product) {
      return res.status(404).json({ success: false, message: `Product not found: ${id}` });
    }
    deleteImageFile(product.image);
    console.log(`[Product Deleted] ${product.name} (${id})`);
    res.json({ success: true, message: `Product "${product.name}" deleted.` });
  } catch (err) {
    console.error('[deleteProduct]', err.message);
    res.status(500).json({ success: false, message: 'Failed to delete product', error: err.message });
  }
};

module.exports = { getAllProducts, getProductById, seedProducts, createProduct, updateProduct, deleteProduct };
