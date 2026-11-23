import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Sparkles, Eye, Pause, Play, Star } from 'lucide-react';
import { PRODUCTS_DATA } from '../data/products';
import { useCart } from '../context/CartContext';

export const FeaturedSlider = () => {
  const {
    selectedWeights,
    setProductWeight,
    addToCart,
    setQuickViewProduct,
    setIsCartOpen
  } = useCart();

  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Selected flagship products featuring Sundarkhani Kishmish prominently
  const featuredIds = [
    'kaju-premium',
    'pista-iranian',
    'chalgoza-special',
    'badam-giri',
    'kishmish-special',
    'injeer-afghani',
    'ajwa-dates',
    'akhrot-magaz',
    'honey-beri',
    'combo-royal-mix'
  ];

  const featuredProducts = featuredIds
    .map(id => PRODUCTS_DATA.find(p => p.id === id))
    .filter(Boolean);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 15);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
      
      const approxIndex = Math.round(scrollLeft / 320);
      setActiveSlideIndex(Math.min(approxIndex, featuredProducts.length - 1));
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: index * 340, behavior: 'smooth' });
      setActiveSlideIndex(index);
    }
  };

  // Smooth auto-scroll that only advances gently when not hovered
  useEffect(() => {
    let interval;
    if (isAutoScrolling) {
      interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          if (scrollLeft >= scrollWidth - clientWidth - 30) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
          }
        }
      }, 4500);
    }
    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      checkScroll();
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, []);

  return (
    <section className="py-14 bg-gradient-to-b from-[#fdfbf7] via-white to-[#fbf7f0] border-b border-amber-200/60 overflow-hidden relative w-full">
      
      {/* Decorative ambient background glows - strictly clipped */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header with Heading & Slider Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/90 text-amber-900 font-bold text-xs mb-2 border border-amber-300 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Signature Winter Harvest Showcase</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-gray-950 leading-tight">
              Premium Fresh Harvest <span className="gold-gradient-text">Slideshow Showcase</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mt-1.5 max-w-xl">
              Handpicked Afghani Chilgoza, Jumbo Cashews, Iranian Pistachios &amp; Fresh <strong>Sundarkhani Kishmish</strong>. Slide left to right to discover our authentic mountain harvest.
            </p>
          </div>

          {/* Interactive Arrow Controls & Auto-slide toggle */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <button
              type="button"
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-200 flex items-center gap-1.5 shadow-2xs ${
                isAutoScrolling
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-500/20'
                  : 'bg-gray-100 text-gray-600 border-gray-300'
              }`}
              title={isAutoScrolling ? 'Pause Auto Slideshow' : 'Resume Auto Slideshow'}
            >
              {isAutoScrolling ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Auto Slide: ON</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-gray-700" />
                  <span>Auto Slide: OFF</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Slide Left"
              className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all duration-200 shadow-sm ${
                canScrollLeft
                  ? 'bg-white hover:bg-emerald-900 hover:text-white border-amber-300 text-gray-800 hover:scale-105 shadow-md cursor-pointer'
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Slide Right"
              className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all duration-200 shadow-sm ${
                canScrollRight
                  ? 'bg-white hover:bg-emerald-900 hover:text-white border-amber-300 text-gray-800 hover:scale-105 shadow-md cursor-pointer'
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sliding Boxes Carousel Track - perfectly contained, no horizontal spill */}
        <div className="relative w-full overflow-hidden rounded-3xl">
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsAutoScrolling(false)}
            onMouseLeave={() => setIsAutoScrolling(true)}
            className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4 pt-2 w-full snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {featuredProducts.map((product) => {
              const activeWeight = selectedWeights[product.id] || product.weights[0].label;
              const weightObj = product.weights.find(w => w.label === activeWeight) || product.weights[0];
              const activePrice = Math.round(product.pricePerKg * weightObj.multiplier);
              const originalPrice = Math.round(product.originalPricePerKg * weightObj.multiplier);
              const discountPercent = Math.round(
                ((product.originalPricePerKg - product.pricePerKg) / product.originalPricePerKg) * 100
              );

              return (
                <div
                  key={product.id}
                  className="w-[280px] sm:w-[320px] shrink-0 bg-white rounded-3xl overflow-hidden border border-amber-200/90 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group hover:-translate-y-1.5 snap-start relative"
                >
                  {/* Image Box with Badges */}
                  <div
                    className="relative h-52 overflow-hidden bg-amber-50/70 cursor-pointer shrink-0"
                    onClick={() => setQuickViewProduct(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = product.fallbackImage;
                      }}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
                      <span className={`${product.badgeColor} text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1`}>
                        ✨ {product.badge}
                      </span>
                      {discountPercent > 0 && (
                        <span className="bg-rose-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                          SAVE {discountPercent}%
                        </span>
                      )}
                    </div>

                    {/* Origin tag */}
                    <div className="absolute bottom-2.5 left-3 bg-black/65 backdrop-blur-md text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-md z-10">
                      📍 {product.origin.split('/')[0]}
                    </div>

                    {/* Quick View Button overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="px-3.5 py-2 bg-white/95 text-emerald-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                        <Eye className="w-4 h-4 text-emerald-700" />
                        Quick View Details
                      </span>
                    </div>
                  </div>

                  {/* Box Content with Sliding Text Elements */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Rating & Review */}
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{product.rating}</span>
                          <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {product.subtitle.split(' ')[0]} Fresh
                        </span>
                      </div>

                      {/* Product Title */}
                      <h3
                        onClick={() => setQuickViewProduct(product)}
                        className="font-serif font-bold text-base sm:text-lg text-gray-950 leading-snug hover:text-emerald-800 group-hover:translate-x-1 transition-all duration-200 cursor-pointer mt-1 line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Weight Selector Pills */}
                      <div className="mt-3.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-1">
                          <span>Select Weight:</span>
                          <span className="text-emerald-900 font-extrabold">{activeWeight}</span>
                        </div>
                        <div className="flex items-center gap-1.5 p-1 bg-amber-50/80 rounded-xl border border-amber-200/70">
                          {product.weights.map(weight => {
                            const isSelected = activeWeight === weight.label;
                            return (
                              <button
                                key={weight.label}
                                type="button"
                                onClick={() => setProductWeight(product.id, weight.label)}
                                className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all duration-200 border ${
                                  isSelected
                                    ? 'bg-emerald-900 text-amber-300 border-emerald-900 shadow-2xs scale-102 font-black'
                                    : 'bg-white/90 text-gray-700 border-amber-200/70 hover:bg-amber-100/70'
                                }`}
                              >
                                {weight.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Price and Add to Cart Section */}
                    <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-bold text-emerald-900">Rs.</span>
                          <span className="text-xl font-black text-gray-950">
                            {activePrice.toLocaleString('en-PK')}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 block line-through">
                          Rs. {originalPrice.toLocaleString('en-PK')}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          addToCart(product, activeWeight, 1);
                          setIsCartOpen(true);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-900 to-emerald-950 hover:from-emerald-950 hover:to-black text-white rounded-xl font-bold text-xs transition duration-200 flex items-center gap-1.5 shadow-md shadow-emerald-900/20 hover:scale-105 active:scale-95"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-amber-300" />
                        <span>Add to Cart</span>
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Progress Indicators */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {featuredProducts.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeSlideIndex
                  ? 'w-8 bg-amber-500 shadow-sm'
                  : 'w-2 bg-amber-200 hover:bg-amber-300'
              }`}
            />
          ))}
        </div>

        {/* Continuous Left-to-Right Moving Ribbon of Product Boxes */}
        <div className="mt-10 pt-6 border-t border-amber-200/60 w-full overflow-hidden">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
              Live Continuous Ticker • Complete Fresh Dry Fruits Catalog
            </span>
            <span className="text-[11px] text-gray-500 hidden sm:inline">
              Hover to pause
            </span>
          </div>

          {/* Marquee Wrapper with left & right gradient fade */}
          <div className="relative overflow-hidden rounded-2xl bg-amber-50/60 border border-amber-200/90 py-3 w-full">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#fbf7f0] to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#fbf7f0] to-transparent z-10" />

            {/* Marquee Track moving smoothly Left to Right */}
            <div className="animate-marquee-l2r flex items-center gap-4 cursor-pointer select-none">
              {[...PRODUCTS_DATA, ...PRODUCTS_DATA].map((prod, index) => (
                <div
                  key={`${prod.id}-marquee-${index}`}
                  onClick={() => setQuickViewProduct(prod)}
                  className="flex items-center gap-3 bg-white px-3.5 py-2.5 rounded-2xl border border-amber-200/80 shadow-2xs hover:shadow-md hover:border-amber-400 transition-all shrink-0 hover:scale-105"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    onError={(e) => {
                      e.currentTarget.src = prod.fallbackImage;
                    }}
                    className="w-11 h-11 rounded-xl object-cover border border-amber-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-gray-900 leading-tight whitespace-nowrap">
                      {prod.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-black text-emerald-800">
                        Rs. {prod.pricePerKg.toLocaleString('en-PK')} / kg
                      </span>
                      <span className="text-[9px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.5 rounded uppercase">
                        {prod.badge}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
