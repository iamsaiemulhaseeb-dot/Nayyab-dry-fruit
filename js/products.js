// Nayyab Dry Fruit - Product Catalog Data
// Client: Hafiz Sumair (0323-4382687) - Shalimar Degree College near Bahu Gym, Baghbanpura, Lahore

const PRODUCTS_DATA = [
  {
    id: 'kaju-premium',
    name: 'Royal Roasted Kaju (Cashew Nuts)',
    category: 'nuts',
    badge: 'Super Saver',
    badgeColor: 'bg-amber-600',
    rating: 4.9,
    reviewsCount: 148,
    pricePerKg: 4000,
    originalPricePerKg: 4600,
    image: 'kaju.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
    origin: 'Imported Grade-A Jumbo (W-240)',
    description: 'Crisp, jumbo-sized, slow dry-roasted cashews with a rich buttery crunch. 100% natural without any artificial chemicals or preservatives.',
    packaging: 'Airtight Vacuum Sealed Foil Pouch for 100% freshness retention.',
    benefits: [
      'Rich in healthy monounsaturated fats & plant protein',
      'Supports heart health & regulates cholesterol',
      'High in magnesium, copper & zinc for radiant skin',
      'Natural instant energy booster for winters'
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 }
    ],
    inStock: true
  },
  {
    id: 'pista-iranian',
    name: 'Super Green Pista (Iranian Pistachios)',
    category: 'nuts',
    badge: 'Special Rate',
    badgeColor: 'bg-emerald-700',
    rating: 5.0,
    reviewsCount: 182,
    pricePerKg: 5800,
    originalPricePerKg: 6500,
    image: 'pista.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=800&q=80',
    origin: 'Iranian Super Green / Afghani Border Harvest',
    description: 'Naturally smiling, open-shell roasted pistachios with vibrant green emerald kernels and light Himalayan pink salt roasting.',
    packaging: 'Nitrogen-flushed resealable zip-lock pouch.',
    benefits: [
      'One of the lowest-calorie, high-protein snack nuts',
      'Loaded with powerful antioxidants like lutein & zeaxanthin',
      'Promotes blood vessel health & circulation',
      'Enhances gut microbiota and overall digestion'
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 }
    ],
    inStock: true
  },
  {
    id: 'chalgoza-special',
    name: 'King Chilgoza (Afghani Roasted Pine Nuts)',
    category: 'nuts',
    badge: 'Winter King',
    badgeColor: 'bg-rose-700',
    rating: 5.0,
    reviewsCount: 96,
    pricePerKg: 8000,
    originalPricePerKg: 9000,
    image: 'chalgoza.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?auto=format&fit=crop&w=800&q=80',
    origin: 'Waziristan / Afghanistan Pine Forest Harvest',
    description: 'The prized crown jewel of dry fruits! Hand-picked authentic Chilgoza pine nuts roasted to delicate perfection with paper-thin shell.',
    packaging: 'Triple-layer insulated moisture-proof pouch.',
    benefits: [
      'Pinolenic acid naturally curbs excessive appetite',
      'Vital for boosting winter warmth & vitality',
      'Exceptional source of vitamin E and zinc',
      'Strengthens immunity & cellular rejuvenation'
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 }
    ],
    inStock: true
  },
  {
    id: 'badam-giri',
    name: 'Sweet Badam Giri (Afghani Almond Kernels)',
    category: 'kernels',
    badge: '100% Sweet Guaranteed',
    badgeColor: 'bg-amber-700',
    rating: 4.8,
    reviewsCount: 220,
    pricePerKg: 3800,
    originalPricePerKg: 4300,
    image: 'badam giri.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1508061252224-417ff643ed40?auto=format&fit=crop&w=800&q=80',
    origin: 'Kandahar / Mazar-e-Sharif, Afghanistan',
    description: 'Freshly cracked 100% sweet almond kernels, overflowing with natural essential oils. Zero bitter almonds guaranteed.',
    packaging: 'Vacuum-sealed air-barrier pouch.',
    benefits: [
      'Renowned ancient brain booster (Dimaaghi Taqat)',
      'Rich in Vitamin E for glowing hair & skin',
      'Regulates blood pressure and supports memory',
      'Perfect for soaking in water overnight'
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 }
    ],
    inStock: true
  },
  {
    id: 'akhrot-magaz',
    name: 'Kashmiri Akhrot Magaz (White Walnut Kernels)',
    category: 'kernels',
    badge: 'Brain Fuel',
    badgeColor: 'bg-yellow-800',
    rating: 4.9,
    reviewsCount: 165,
    pricePerKg: 3200,
    originalPricePerKg: 3700,
    image: 'akhrot magaz.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1589476993333-f55b843e695b?auto=format&fit=crop&w=800&q=80',
    origin: 'Swat Valley & Kashmir Valley',
    description: 'Snow-white unbroken walnut butterfly halves. Crispy, oil-rich, fresh season harvest without any chemical bleaching.',
    packaging: 'Oxygen-barrier fresh packaging.',
    benefits: [
      'Supreme plant-based Omega-3 Alpha-Linolenic Acid (ALA)',
      'Supports cognitive function, focus & memory',
      'Lowers bad LDL cholesterol naturally',
      'Reduces systemic inflammation in joints'
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 }
    ],
    inStock: true
  },
  {
    id: 'injeer-afghanistan',
    name: 'Golden Injeer (Afghani Dried Figs)',
    category: 'dried-fruits',
    badge: 'Sun-Dried Special',
    badgeColor: 'bg-purple-800',
    rating: 4.9,
    reviewsCount: 134,
    pricePerKg: 3400,
    originalPricePerKg: 3950,
    image: 'injeer afghanistan.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    origin: 'Kandahar Sun Orchards, Afghanistan',
    description: 'Plump, naturally sun-dried golden figs threaded on traditional strings. Naturally sweet without added sugar or synthetic syrups.',
    packaging: 'Moisture-sealed hygienic protective pouch.',
    benefits: [
      'Super high dietary fiber for smooth digestive health',
      'Rich in natural iron to counter anemia & fatigue',
      'Abundant plant calcium for strong bones & teeth',
      'Sunnah food mentioned for remarkable healing'
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 }
    ],
    inStock: true
  },
  {
    id: 'khobani-goal',
    name: 'Khobani Goal (Sweet Round Dried Apricots)',
    category: 'dried-fruits',
    badge: 'Sunnah Fruit',
    badgeColor: 'bg-orange-600',
    rating: 4.9,
    reviewsCount: 89,
    pricePerKg: 1600,
    originalPricePerKg: 1950,
    image: 'khobani goal.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    origin: 'Hunza & Gilgit Baltistan High Orchards',
    description: 'Naturally sun-cured round golden apricots. Sweet, tender, rich in beta-carotene and digestive enzymes.',
    packaging: 'Airtight food-grade zipper pack.',
    benefits: [
      'Rich in Vitamin A & Beta-Carotene for eyesight health',
      'High natural soluble fiber promotes effortless digestion',
      'Packed with potassium to manage healthy blood pressure',
      'Natural energy booster for active lifestyle'
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 }
    ],
    inStock: true
  },
  {
    id: 'khobani-jimri',
    name: 'Khobani Jimri (Soft Sweet Apricots Seedless)',
    category: 'dried-fruits',
    badge: 'Deluxe Sweet',
    badgeColor: 'bg-amber-600',
    rating: 5.0,
    reviewsCount: 77,
    pricePerKg: 1800,
    originalPricePerKg: 2200,
    image: 'khobani jimri.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    origin: 'Skardu & Gilgit Valley Selection',
    description: 'Extra-soft Jimri variety of dried apricots with an exquisite honey-caramel taste. 100% seedless and ready to relish.',
    packaging: 'Vacuum-sealed moisture lock bag.',
    benefits: [
      'Natural blood purifier & hemoglobin booster',
      'Relieves stomach acid & enhances liver health',
      'Rich in antioxidants to protect cells against aging',
      'Wholesome snack for children and adults'
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 }
    ],
    inStock: true
  },
  {
    id: 'ajwa-dates',
    name: 'Original Ajwa Dates',
    category: 'dates',
    badge: 'Shifa & Sunnah',
    badgeColor: 'bg-slate-900',
    rating: 5.0,
    reviewsCount: 230,
    pricePerKg: 3200,
    originalPricePerKg: 3800,
    image: 'ajwa dates.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=80',
    origin: 'Madina Munawwarah, Saudi Arabia (Direct Import)',
    description: 'Authentic Ajwa Al-Madinah dates with signature fine white lines and soft chewy texture. Renowned for spiritual healing & wellness.',
    packaging: 'Luxury tamper-proof freshness seal box.',
    benefits: [
      'Mentioned in Hadith for protection & heart health (Shifa)',
      'Rich in dietary magnesium, potassium and iron',
      'Provides safe sustained natural glucose energy',
      'Supports healthy pregnancy & maternal recovery'
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 }
    ],
    inStock: true
  },
  {
    id: 'kishmish-special',
    name: 'Sundarkhani Kishmish (Green Raisins)',
    category: 'dried-fruits',
    badge: 'Fresh Crop',
    badgeColor: 'bg-emerald-600',
    rating: 4.8,
    reviewsCount: 104,
    pricePerKg: 1600,
    originalPricePerKg: 1950,
    image: "sundari kishmish.jpg",
    fallbackImage: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=800&q=80',
    origin: 'Chaman & Kandahar Vineyard Selection',
    description: 'Long green Sundarkhani raisins, naturally shade-dried. Juicy, seedless, intensely sweet and clean without grit.',
    packaging: 'Hygienic sealed poly pouch.',
    benefits: [
      'High in natural iron to treat anemia and fatigue',
      'Oleic acid in raisins prevents cavities & gum decay',
      'Assists in bone density and joint mobility',
      'Great for kids milk shakes & breakfast cereals'
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 }
    ],
    inStock: true
  },
  {
    id: 'phool-makhana',
    name: 'Crispy Roasted Phool Makhana (Lotus Seeds)',
    category: 'nuts',
    badge: 'Superfood',
    badgeColor: 'bg-teal-700',
    rating: 4.9,
    reviewsCount: 68,
    pricePerKg: 2400,
    originalPricePerKg: 2800,
    image: 'phool makhna.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
    origin: 'Organic Lotus Lake Harvest',
    description: 'Crisp, light, high-protein puffed fox nuts / lotus seeds. Perfect low-calorie crunchy snack for health-conscious individuals.',
    packaging: 'Nitrogen-flushed freshness zipper bag.',
    benefits: [
      'Immense calcium for strong joints & backache relief',
      'Low glycemic index ideal for sugar patients',
      'Abundant natural plant protein & zero cholesterol',
      'Calming evening snack promoting sound sleep'
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 }
    ],
    inStock: true
  },
  {
    id: 'pure-honey',
    name: 'Pure Sidr Wild Honey',
    category: 'honey',
    badge: '100% Lab Tested',
    badgeColor: 'bg-amber-500',
    rating: 5.0,
    reviewsCount: 210,
    pricePerKg: 3400,
    originalPricePerKg: 4000,
    image: 'honey.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=800&q=80',
    origin: 'Karak & Potohar Wild Sidr (Beri) Forests',
    description: 'Raw, unpasteurized, cold-extracted organic Sidr honey. Rich thick amber texture with sublime caramel floral aroma. Tested 100% pure.',
    packaging: 'Food-grade leak-proof glass jar.',
    benefits: [
      'Powerful natural antibacterial & antiviral shield',
      'Effective remedy for sore throat, cough & immunity',
      'Gentle on blood sugar compared to refined sweeteners',
      'Natural stamina tonic for daily morning energy'
    ],
    weights: [
      { label: '250g', multiplier: 0.25 },
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 }
    ],
    inStock: true
  },
  {
    id: 'royal-mix-box',
    name: 'Nayyab Royal Mix Dry Fruit Platter',
    category: 'combos',
    badge: 'VIP Gift Choice',
    badgeColor: 'bg-emerald-800',
    rating: 5.0,
    reviewsCount: 112,
    pricePerKg: 4950,
    originalPricePerKg: 5800,
    image: 'dry fruit plater.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1596797882870-8c33deeac224?auto=format&fit=crop&w=800&q=80',
    origin: 'Curated Nayyab Dry Fruit Signature Selection',
    description: 'A luxurious regal assortment of Kaju, Pistachios, Badam Giri, Akhrot Magaz, and dried Injeer in an exquisite gift package.',
    packaging: 'Luxury gold-embossed presentation gift box.',
    benefits: [
      'All essential dry fruit nutrients in one daily dose',
      'Perfect healthy gift for weddings, Eid & family',
      'Premium hand-picked A+ grade quality',
      'Balanced combination of proteins, oils & vitamins'
    ],
    weights: [
      { label: '500g', multiplier: 0.50 },
      { label: '1 kg', multiplier: 1.00 }
    ],
    inStock: true
  }
];
