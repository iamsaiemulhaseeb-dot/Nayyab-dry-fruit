import React, { useState } from 'react';
import { Heart, ShoppingCart, Zap, Eye, Star, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

/* Trust badges shown on every product card */
const TRUST_BADGES = [
  { icon: '🌿', label: '100% Fresh Crop' },
  { icon: '🚫', label: 'No Preservatives' },
  { icon: '⚡', label: 'Same-Day Lahore' },
];

/* Urdu descriptions keyed by product id — fallback to empty string */
const URDU_DESCRIPTIONS = {
  'kaju-premium':     'عمدہ قسم کے کاجو، تازہ اور قدرتی۔ لاہور میں اسی دن ترسیل۔',
  'pista-iranian':    'ایرانی سبز پستہ، ہلکا نمکین اور تازہ۔ قدرتی ذائقہ۔',
  'chalgoza-special': 'افغانی چلغوزہ، قدرتی روسٹڈ — سردیوں کا بہترین خشک میوہ۔',
  'badam-giri':       'افغانی میٹھے بادام گری — 100% میٹھے، کوئی کڑوا نہیں۔',
  'akhrot-magaz':     'کشمیری اخروٹ مغز — سفید اور تازہ، دماغ کے لیے بہترین۔',
  'injeer-afghanistan':'سنہری سورج خشک افغانی انجیر — قدرتی میٹھاس کے ساتھ۔',
  'khobani-goal':     'گول خوبانی — سورج میں خشک، قدرتی وٹامن اے سے بھرپور۔',
  'khobani-jimri':    'جِمری خوبانی — نرم اور میٹھی، بغیر گٹھلی کے۔',
  'ajwa-dates':       'مدینہ منورہ کی اصلی عجوہ کھجوریں — براہ راست درآمد۔',
  'kishmish-special': 'سندرخانی کشمش — سبز، بیج کے بغیر اور تازہ فصل۔',
  'phool-makhana':    'قدرتی پھول مکھانہ — ہلکا، کرسپی اور صحت بخش۔',
  'pure-honey':       'خالص سدر شہد — ٹھنڈا نکالا ہوا، 100% قدرتی اور ٹیسٹڈ۔',
  'royal-mix-box':    'نیاب رائل مکس پلیٹر — شادی اور تحفے کے لیے بہترین۔',
};

export const ProductCard = ({ product }) => {
  const {
    selectedWeights,
    setProductWeight,
    addToCart,
    wishlist,
    toggleWishlist,
    setQuickViewProduct,
    setIsCartOpen
  } = useCart();

  const [showUrdu, setShowUrdu] = useState(false);

  const isWishlisted = wishlist.includes(product.id);
  const activeWeight = selectedWeights[product.id] || product.weights[0].label;
  const weightObj = product.weights.find(w => w.label === activeWeight) || product.weights[0];
  const activePrice = Math.round(product.pricePerKg * weightObj.multiplier);
  const originalPrice = Math.round(product.originalPricePerKg * weightObj.multiplier);
  const discountPercent = Math.round(
    ((product.originalPricePerKg - product.pricePerKg) / product.originalPricePerKg) * 100
  );
  const urduDesc = URDU_DESCRIPTIONS[product.id] || '';

  const handleBuyNow = () => {
    addToCart(product, activeWeight, 1);
    setIsCartOpen(true);
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-amber-200/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-1.5 relative h-full">
      
      {/* Top Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
        <span className={`${product.badgeColor} text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1`}>
          ✨ {product.badge}
        </span>
        {discountPercent > 0 && (
          <span className="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
            SAVE {discountPercent}%
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-gray-400 hover:text-rose-500 hover:scale-110 transition duration-200"
        title="Save to Wishlist"
      >
        <Heart className={`w-5 h-5 ${isWishlisted ? 'text-rose-500 fill-rose-500' : 'text-gray-400'}`} />
      </button>

      {/* Image Container — fixed height for uniform cards */}
      <div
        className="relative w-full h-52 overflow-hidden bg-amber-50 cursor-pointer shrink-0"
        onClick={() => setQuickViewProduct(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = product.fallbackImage;
          }}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
        />
        
        {/* Hover Quick View Overlay */}
        {/* Quick View Hover Button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="bg-white/95 backdrop-blur-sm text-emerald-950 font-bold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 hover:bg-emerald-900 hover:text-white transition-all transform translate-y-3 group-hover:translate-y-0 duration-300">
            <Eye className="w-4 h-4" />
            Quick View Details
          </span>
        </div>

        {/* Origin tag */}
        <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-md text-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-md">
          📍 {product.origin.split(',')[0]}
        </div>
      </div>

      {/* Product Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Ratings & Subtitle */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>{product.rating}</span>
              <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800">
              {product.subtitle || 'Grade-A Quality'}
            </span>
          </div>

          {/* Product Title with smooth slide-hover */}
          <h3 
            onClick={() => setQuickViewProduct(product)}
            className="font-serif font-bold text-gray-900 text-lg leading-snug group-hover:text-emerald-800 group-hover:translate-x-1 transition-all duration-200 line-clamp-1 mb-1 cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-1 mb-2">
            {TRUST_BADGES.map(b => (
              <span key={b.label} className="inline-flex items-center gap-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                {b.icon} {b.label}
              </span>
            ))}
          </div>

          {/* Bilingual toggle */}
          {urduDesc && (
            <div className="mb-3">
              <button
                type="button"
                onClick={() => setShowUrdu(v => !v)}
                className="text-[10px] font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 transition"
              >
                <span>{showUrdu ? '🇬🇧 English' : '🇵🇰 اردو میں پڑھیں'}</span>
              </button>
              {showUrdu && (
                <p className="mt-1.5 text-xs text-gray-700 bg-amber-50 border border-amber-200 rounded-xl p-2.5 leading-relaxed font-medium text-right" dir="rtl" lang="ur">
                  {urduDesc}
                </p>
              )}
            </div>
          )}

          {/* Weight Selector Chips */}
          <div className="mb-4">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
              <span>Select Weight:</span>
              <span className="text-emerald-800 font-bold">{weightObj.label}</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-amber-50/70 rounded-xl border border-amber-200/60">
              {product.weights.map(w => {
                const isSelected = w.label === activeWeight;
                return (
                  <button
                    key={w.label}
                    type="button"
                    onClick={() => setProductWeight(product.id, w.label)}
                    className={`py-1.5 px-2 text-xs font-bold rounded-lg transition-all text-center ${
                      isSelected
                        ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-800/20'
                        : 'text-gray-700 hover:bg-white/80'
                    }`}
                  >
                    {w.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Price & Actions Section */}
        <div className="pt-3 border-t border-amber-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-2xl font-extrabold text-emerald-950 font-sans tracking-tight">
                Rs. {activePrice.toLocaleString('en-PK')}
              </span>
              <span className="text-xs text-gray-400 line-through ml-1.5">
                Rs. {originalPrice.toLocaleString('en-PK')}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              Fresh In Stock
            </span>
          </div>

          {/* Button Pair: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addToCart(product, activeWeight, 1)}
              className="w-full py-2.5 px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-emerald-900/10"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
