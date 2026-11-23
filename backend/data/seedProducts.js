/**
 * seedProducts.js
 *
 * Usage (from the backend/ folder):
 *   node data/seedProducts.js
 *
 * Or via package.json script:
 *   npm run seed
 *
 * This file also exports the raw seed array so productController.js
 * can reference it without triggering the DB seed logic.
 */

const seedProducts = [
  {
    id: 'kaju-premium',
    name: 'Royal Roasted Kaju (Cashew Nuts)',
    subtitle: 'Crisp Jumbo Oven-Roasted Cashews',
    category: 'nuts',
    badge: 'Super Saver Rate',
    badgeColor: 'bg-amber-600',
    rating: 4.9,
    reviewsCount: 148,
    pricePerKg: 4000,
    originalPricePerKg: 4600,
    image: '/kaju.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
    origin: 'Imported Grade-A Jumbo (W-240)',
    description: 'Crisp, jumbo-sized, slow dry-roasted cashews with a rich buttery crunch. 100% natural without any artificial chemicals or preservatives.',
    packaging: 'Airtight Vacuum-Sealed Foil Pouch for 100% freshness retention.',
    benefits: [
      'Rich in healthy monounsaturated fats & plant protein',
      'Supports heart health & regulates cholesterol levels',
      'High in magnesium, copper & zinc for radiant skin',
      'Natural instant energy booster for winter stamina',
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'pista-iranian',
    name: 'Super Green Pista (Iranian Pistachios)',
    subtitle: 'Emerald Green Lightly Salted Pistachios',
    category: 'nuts',
    badge: 'Special Rate',
    badgeColor: 'bg-emerald-700',
    rating: 5.0,
    reviewsCount: 182,
    pricePerKg: 5800,
    originalPricePerKg: 6500,
    image: '/pista.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=800&q=80',
    origin: 'Iranian Super Green / Afghani Border Harvest',
    description: 'Naturally smiling, open-shell roasted pistachios with vibrant green emerald kernels and light Himalayan pink salt roasting.',
    packaging: 'Nitrogen-flushed resealable zip-lock pouch.',
    benefits: [
      'One of the lowest-calorie, high-protein snack nuts',
      'Loaded with powerful antioxidants like lutein & zeaxanthin',
      'Promotes blood vessel health & smooth circulation',
      'Enhances gut microbiota and overall digestion',
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'chalgoza-special',
    name: 'King Chilgoza (Afghani Roasted Pine Nuts)',
    subtitle: 'Aromatic Fragrant Roasted Pine Nuts',
    category: 'nuts',
    badge: 'Winter King',
    badgeColor: 'bg-rose-700',
    rating: 5.0,
    reviewsCount: 96,
    pricePerKg: 8000,
    originalPricePerKg: 9000,
    image: '/chalgoza.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?auto=format&fit=crop&w=800&q=80',
    origin: 'Waziristan / Afghanistan Pine Forest Harvest',
    description: 'The prized crown jewel of dry fruits! Hand-picked authentic Chilgoza pine nuts roasted to delicate perfection with paper-thin shells.',
    packaging: 'Triple-layer insulated moisture-proof pouch.',
    benefits: [
      'Pinolenic acid naturally curbs excessive appetite',
      'Essential for boosting core winter warmth & vitality',
      'Exceptional source of vitamin E and zinc',
      'Strengthens immunity & cellular rejuvenation',
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'badam-giri',
    name: 'Sweet Badam Giri (Afghani Almond Kernels)',
    subtitle: '100% Sweet Kernels (Zero Bitter Nuts)',
    category: 'kernels',
    badge: '100% Sweet Guaranteed',
    badgeColor: 'bg-amber-700',
    rating: 4.8,
    reviewsCount: 220,
    pricePerKg: 3800,
    originalPricePerKg: 4300,
    image: '/badam giri.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1508061252224-417ff643ed40?auto=format&fit=crop&w=800&q=80',
    origin: 'Kandahar / Mazar-e-Sharif, Afghanistan',
    description: 'Freshly cracked 100% sweet almond kernels, overflowing with natural essential oils. Zero bitter almonds guaranteed.',
    packaging: 'Vacuum-sealed air-barrier protective pouch.',
    benefits: [
      'Renowned ancient brain & memory booster',
      'Rich in Vitamin E for glowing hair & skin',
      'Regulates healthy blood pressure levels',
      'Ideal for soaking in water overnight for morning vitality',
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'akhrot-magaz',
    name: 'Kashmiri Akhrot Magaz (White Walnut Kernels)',
    subtitle: 'Snow-White Unbroken Halves',
    category: 'kernels',
    badge: 'Brain Fuel',
    badgeColor: 'bg-yellow-800',
    rating: 4.9,
    reviewsCount: 165,
    pricePerKg: 3200,
    originalPricePerKg: 3700,
    image: '/akhrot magaz.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1589476993333-f55b843e695b?auto=format&fit=crop&w=800&q=80',
    origin: 'Swat Valley & Kashmir High Valleys',
    description: 'Snow-white unbroken walnut butterfly halves. Crispy, oil-rich, fresh season harvest without any chemical bleaching.',
    packaging: 'Oxygen-barrier fresh preservation packaging.',
    benefits: [
      'Supreme plant-based Omega-3 Alpha-Linolenic Acid (ALA)',
      'Supports cognitive function, focus & memory retention',
      'Naturally balances bad LDL cholesterol',
      'Reduces systemic inflammation in joints',
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'injeer-afghanistan',
    name: 'Golden Injeer (Afghani Dried Figs)',
    subtitle: 'Sun-Cured Golden Fig Garlands',
    category: 'dried-fruits',
    badge: 'Sun-Dried Special',
    badgeColor: 'bg-purple-800',
    rating: 4.9,
    reviewsCount: 134,
    pricePerKg: 3400,
    originalPricePerKg: 3950,
    image: '/injeer afghanistan.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    origin: 'Kandahar Sun Orchards, Afghanistan',
    description: 'Plump, naturally sun-dried golden figs threaded on traditional strings. Naturally sweet without added sugar or synthetic syrups.',
    packaging: 'Moisture-sealed hygienic protective pouch.',
    benefits: [
      'Super high dietary fiber for smooth digestive health',
      'Rich in natural iron to counter anemia & fatigue',
      'Abundant plant calcium for strong bones & teeth',
      'Wholesome superfood praised for natural healing',
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'khobani-goal',
    name: 'Khobani Goal (Sweet Round Dried Apricots)',
    subtitle: 'Natural Sun-Cured Golden Apricots',
    category: 'dried-fruits',
    badge: 'Natural Superfood',
    badgeColor: 'bg-orange-600',
    rating: 4.9,
    reviewsCount: 89,
    pricePerKg: 1600,
    originalPricePerKg: 1950,
    image: '/khobani goal.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    origin: 'Hunza & Gilgit Baltistan High Orchards',
    description: 'Naturally sun-cured round golden apricots. Sweet, tender, rich in beta-carotene and digestive enzymes.',
    packaging: 'Airtight food-grade zipper pack.',
    benefits: [
      'Rich in Vitamin A & Beta-Carotene for healthy eyesight',
      'High natural soluble fiber promotes smooth digestion',
      'Packed with potassium to support healthy blood pressure',
      'Clean natural energy source for an active lifestyle',
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 },
    ],
    inStock: true,
  },
  {
    id: 'khobani-jimri',
    name: 'Khobani Jimri (Soft Sweet Apricots Seedless)',
    subtitle: 'Extra-Soft Honey Caramel Variety',
    category: 'dried-fruits',
    badge: 'Deluxe Sweet',
    badgeColor: 'bg-amber-600',
    rating: 5.0,
    reviewsCount: 77,
    pricePerKg: 1800,
    originalPricePerKg: 2200,
    image: '/khobani jimri.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    origin: 'Skardu & Gilgit Valley Selection',
    description: 'Extra-soft Jimri variety of dried apricots with an exquisite honey-caramel taste. 100% seedless and ready to relish.',
    packaging: 'Vacuum-sealed moisture lock bag.',
    benefits: [
      'Natural blood purifier & hemoglobin booster',
      'Soothes digestive acidity & supports liver wellness',
      'Rich in antioxidants to protect cells against oxidative stress',
      'Wholesome delicious snack for both children and adults',
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 },
    ],
    inStock: true,
  },
  {
    id: 'ajwa-dates',
    name: 'Original Ajwa Dates (Madina Munawwarah)',
    subtitle: 'Authentic Certified Saudi Import',
    category: 'dates',
    badge: 'Holy City Import',
    badgeColor: 'bg-slate-900',
    rating: 5.0,
    reviewsCount: 230,
    pricePerKg: 3200,
    originalPricePerKg: 3800,
    image: '/ajwa dates.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1593443320739-77f74939d0da?auto=format&fit=crop&w=800&q=80',
    origin: 'Madina Munawwarah, Saudi Arabia (Direct Import)',
    description: 'Authentic Ajwa Al-Madinah dates with signature fine white striations and soft chewy texture. Renowned worldwide for spiritual blessings & wellness.',
    packaging: 'Luxury tamper-proof freshness seal box.',
    benefits: [
      'Celebrated ancient superfood supporting heart vitality',
      'Rich in dietary magnesium, potassium, and bioavailable iron',
      'Provides sustained natural glucose energy without sugar crash',
      'Supports healthy recovery and maternal wellbeing',
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'kishmish-special',
    name: 'Sundarkhani Kishmish (Green Raisins)',
    subtitle: 'Juicy Seedless Long Green Raisins',
    category: 'dried-fruits',
    badge: 'Fresh Crop',
    badgeColor: 'bg-emerald-600',
    rating: 4.8,
    reviewsCount: 104,
    pricePerKg: 1600,
    originalPricePerKg: 1950,
    image: '/sundari kishmish.jpg',
    fallbackImage: '/kishmish.jpg',
    origin: 'Chaman & Kandahar Vineyard Selection',
    description: 'Long green Sundarkhani raisins, naturally shade-dried. Juicy, seedless, intensely sweet and meticulously cleaned without sand or grit.',
    packaging: 'Hygienic sealed protective poly pouch.',
    benefits: [
      'High in dietary iron to counter anemia and morning sluggishness',
      'Natural oleanolic acid supports gum and dental health',
      'Assists in bone density and joint flexibility',
      'Delicious natural sweetener for breakfast bowls and shakes',
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'phool-makhana',
    name: 'Crispy Roasted Phool Makhana (Lotus Seeds)',
    subtitle: 'Light Crunchy Puffed Fox Nuts',
    category: 'nuts',
    badge: 'Low-Cal Superfood',
    badgeColor: 'bg-teal-700',
    rating: 4.9,
    reviewsCount: 68,
    pricePerKg: 2400,
    originalPricePerKg: 2800,
    image: '/phool makhna.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
    origin: 'Organic Lotus Lake Harvest',
    description: 'Crisp, light, high-protein puffed fox nuts / lotus seeds. Perfect low-calorie crunchy snack for health-conscious and diabetic-friendly diets.',
    packaging: 'Nitrogen-flushed freshness zipper bag.',
    benefits: [
      'Abundant natural calcium for strong bones & spine support',
      'Low glycemic index ideal for sugar regulation',
      'Substantial plant protein with zero saturated fats',
      'Calming evening snack promoting restorative sleep',
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 },
    ],
    inStock: true,
  },
  {
    id: 'pure-honey',
    name: 'Pure Sidr Wild Honey (Raw Beri Honey)',
    subtitle: 'Cold-Extracted Raw Forest Honey',
    category: 'honey',
    badge: '100% Lab Tested',
    badgeColor: 'bg-amber-500',
    rating: 5.0,
    reviewsCount: 210,
    pricePerKg: 3400,
    originalPricePerKg: 4000,
    image: '/honey.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=800&q=80',
    origin: 'Karak & Potohar Wild Sidr (Beri) Forests',
    description: 'Raw, unpasteurized, cold-extracted organic Sidr honey. Rich thick amber texture with sublime caramel floral aroma. 100% lab tested pure.',
    packaging: 'Food-grade leak-proof glass jar.',
    benefits: [
      'Powerful natural antibacterial & immune shield',
      'Effective soothing remedy for throat discomfort & cough',
      'Gentle glycemic response compared to refined sugars',
      'Natural stamina tonic for daily morning wellness',
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 },
    ],
    inStock: true,
    featured: true,
  },
  {
    id: 'royal-mix-box',
    name: 'Nayyab Royal Mix Dry Fruit Platter',
    subtitle: 'Signature VIP Presentation Gift Box',
    category: 'combos',
    badge: 'VIP Gift Choice',
    badgeColor: 'bg-emerald-800',
    rating: 5.0,
    reviewsCount: 112,
    pricePerKg: 4950,
    originalPricePerKg: 5800,
    image: '/dry fruit plater.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    origin: 'Curated Nayyab Dry Fruit Signature Selection',
    description: 'A luxurious regal assortment of Cashews, Pistachios, Badam Giri, Akhrot Magaz, and dried Figs presented in an exquisite gold-embossed gift box.',
    packaging: 'Luxury gold-embossed presentation gift platter.',
    benefits: [
      'All essential dry fruit nutrients in one daily dose',
      'Prestigious healthy gift for weddings, festivals & family',
      'Hand-selected A+ grade jumbo size harvest',
      'Balanced combination of plant proteins, oils & vitamins',
    ],
    weights: [
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 },
    ],
    inStock: true,
    featured: true,
  },
];

// ── Export the raw array (used by productController.js fallback) ──
module.exports = seedProducts;

// ── Runnable seed script ──────────────────────────────────
// Only executes when this file is run directly: node data/seedProducts.js
if (require.main === module) {
  const path   = require('path');
  const dotenv = require('dotenv');
  dotenv.config({ path: path.join(__dirname, '../.env') });

  const mongoose = require('mongoose');
  const Product  = require('../models/Product');

  (async () => {
    try {
      console.log('[Seed] Connecting to MongoDB Atlas…');
      await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
      console.log('[Seed] Connected.');

      await Product.deleteMany({});
      console.log('[Seed] Cleared existing products.');

      const inserted = await Product.insertMany(seedProducts);
      console.log(`[Seed] ✅ Inserted ${inserted.length} products into MongoDB Atlas.`);
    } catch (err) {
      console.error('[Seed] ❌ Failed:', err.message);
      process.exit(1);
    } finally {
      await mongoose.disconnect();
      console.log('[Seed] Disconnected.');
    }
  })();
}
