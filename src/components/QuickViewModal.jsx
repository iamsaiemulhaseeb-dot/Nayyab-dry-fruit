import React from 'react';
import { X, Star, ShoppingCart, Zap, Check, Package, Sparkles, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ProductReviews } from './ProductReviews';

export const QuickViewModal = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    selectedWeights,
    setProductWeight,
    addToCart,
    setIsCartOpen
  } = useCart();

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const activeWeight = selectedWeights[product.id] || product.weights[0].label;
  const weightObj = product.weights.find(w => w.label === activeWeight) || product.weights[0];
  const activePrice = Math.round(product.pricePerKg * weightObj.multiplier);
  const originalPrice = Math.round(product.originalPricePerKg * weightObj.multiplier);

  const handleCheckoutNow = () => {
    addToCart(product, activeWeight, 1);
    setQuickViewProduct(null);
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-amber-200 p-6 sm:p-8 relative my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-amber-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Image Side */}
          <div className="rounded-3xl overflow-hidden bg-amber-50 relative aspect-4/3 border border-amber-200 shadow-md">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src = product.fallbackImage;
              }}
              className="w-full h-full object-cover"
            />
            <span className={`absolute top-4 left-4 ${product.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}>
              {product.badge}
            </span>
            <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-amber-200 text-xs px-3 py-1 rounded-lg flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Origin: {product.origin}
            </span>
          </div>

          {/* Info Side */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Rating and Subtitle */}
              <div className="flex items-center justify-between text-xs text-amber-600 font-bold mb-1">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {product.rating} ({product.reviewsCount} customer reviews)
                </span>
                <span className="text-xs text-emerald-800 font-bold">
                  {product.subtitle || '100% Sweet Guaranteed'}
                </span>
              </div>

              <h2 className="text-2xl font-serif font-extrabold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Health Benefits Box */}
              <div className="mb-5 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
                <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  Key Health Benefits & Nutrition:
                </h4>
                <ul className="text-xs text-emerald-900 space-y-1.5">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Packaging */}
              <div className="text-xs text-gray-500 mb-5 flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-700 shrink-0" />
                <span><strong>Packaging:</strong> {product.packaging}</span>
              </div>
            </div>

            {/* Price & Actions in Modal */}
            <div className="pt-4 border-t border-amber-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs text-gray-500 block">Total Price:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-emerald-950">
                      Rs. {activePrice.toLocaleString('en-PK')}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      Rs. {originalPrice.toLocaleString('en-PK')}
                    </span>
                  </div>
                </div>

                {/* Modal Weight Selector */}
                <div className="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200">
                  {product.weights.map(w => (
                    <button
                      key={w.label}
                      type="button"
                      onClick={() => setProductWeight(product.id, w.label)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                        w.label === activeWeight ? 'bg-emerald-800 text-white shadow-xs' : 'text-gray-700 hover:bg-white'
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    addToCart(product, activeWeight, 1);
                    setQuickViewProduct(null);
                  }}
                  className="w-full py-3 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
                <button
                  onClick={handleCheckoutNow}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  Checkout Now
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-6 pt-6 border-t border-amber-100">
          <ProductReviews productId={product.id} productName={product.name} />
        </div>
      </div>
    </div>
  );
};
