import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Eye, Sparkles, Pause, Play } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS_DATA, STORE_INFO } from '../data/products';

const HERO_SLIDES = [
  {
    id: 'chalgoza-special',
    tag: '👑 Hafiz Sumair Signature Selection',
    tagBg: 'bg-amber-500 text-emerald-950',
    title: 'Authentic Afghani King Chilgoza (Pine Nuts)',
    subtitle: 'Fragrant aroma, paper-thin shells, and core winter warmth from Afghanistan pine forests.',
    priceText: 'Rs. 8,000',
    unit: '/ kg',
    badge: 'Winter King',
    image: '/chalgoza and nuts.jpg',
    fallback: '/chalgoza.jpg'
  },
  {
    id: 'kaju-premium',
    tag: '🔥 Super Saver Special Rate',
    tagBg: 'bg-rose-600 text-white',
    title: 'Royal Jumbo Roasted Cashews (Kaju)',
    subtitle: 'W-240 grade crisp oven-roasted cashews with rich buttery crunch and zero chemicals.',
    priceText: 'Rs. 4,000',
    unit: '/ kg',
    oldPrice: 'Rs. 4,600',
    badge: 'Bestseller',
    image: '/kaju.jpg',
    fallback: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pista-iranian',
    tag: '⭐ Emerald Green Selection',
    tagBg: 'bg-emerald-700 text-white',
    title: 'Iranian Roasted Salted Pistachios (Pista)',
    subtitle: 'Naturally smiling open-shell emerald pistachios roasted with Himalayan pink salt.',
    priceText: 'Rs. 5,800',
    unit: '/ kg',
    badge: 'Special Rate',
    image: '/pista.jpg',
    fallback: 'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'badam-giri',
    tag: '🍯 100% Sweet Guarantee',
    tagBg: 'bg-amber-600 text-white',
    title: 'Sweet Afghani Almond Kernels (Badam Giri)',
    subtitle: 'Zero bitter almond policy. Packed with natural oils, vitamin E and brain nourishment.',
    priceText: 'Rs. 3,800',
    unit: '/ kg',
    badge: 'Organic Fresh',
    image: '/badam giri.jpg',
    fallback: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ajwa-dates',
    tag: '🕌 Sunnah Superfood',
    tagBg: 'bg-emerald-900 text-amber-300 border border-amber-400/30',
    title: 'Original Madinah Munawwarah Ajwa Dates',
    subtitle: 'Handpicked authentic soft black Ajwa dates with natural caramel notes and wellness benefits.',
    priceText: 'Rs. 3,200',
    unit: '/ kg',
    badge: 'Madinah Direct',
    image: '/ajwa dates.jpg',
    fallback: 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'injeer-afghani',
    tag: '✨ Pure Sun-Dried Energy',
    tagBg: 'bg-amber-700 text-white',
    title: 'Afghani Threaded Dried Figs (Injeer)',
    subtitle: 'Tender golden threaded figs rich in natural fiber, calcium, and digestive wellness.',
    priceText: 'Rs. 3,400',
    unit: '/ kg',
    badge: 'Top Grade',
    image: '/injeer afghanistan.jpg',
    fallback: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kishmish-special',
    tag: '🍇 Fresh Vineyard Crop',
    tagBg: 'bg-emerald-700 text-white',
    title: 'Sundarkhani Kishmish (Green Raisins)',
    subtitle: 'Juicy, long green Sundarkhani raisins, naturally shade-dried from Chaman & Kandahar vineyards.',
    priceText: 'Rs. 1,600',
    unit: '/ kg',
    oldPrice: 'Rs. 1,950',
    badge: 'Fresh Crop',
    image: '/sundari kishmish.jpg',
    fallback: '/kishmish.jpg'
  }
];

export const HeroSlideshow = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState('next');
  const timerRef = useRef(null);
  const { addToCart, setQuickViewProduct, setIsCartOpen } = useCart();

  const total = HERO_SLIDES.length;

  // Auto slide every 4.2 seconds
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setDirection('next');
        setCurrent(prev => (prev + 1) % total);
      }, 4200);
    }
    return () => clearInterval(timerRef.current);
  }, [isPaused, total]);

  const goToNext = () => {
    setDirection('next');
    setCurrent(prev => (prev + 1) % total);
  };

  const goToPrev = () => {
    setDirection('prev');
    setCurrent(prev => (prev - 1 + total) % total);
  };

  const currentSlide = HERO_SLIDES[current];
  const matchedProduct = PRODUCTS_DATA.find(p => p.id === currentSlide.id) || PRODUCTS_DATA[0];

  const handleOrderSlide = () => {
    addToCart(matchedProduct, '1 kg', 1);
    setIsCartOpen(true);
  };

  return (
    <div
      className="relative mx-auto max-w-md lg:max-w-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Slideshow Frame */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300/90 ring-4 ring-amber-400/20 bg-gray-950">
        
        {/* Sliding Image Carousel Container */}
        <div
          className="flex transition-transform duration-700 ease-out h-[440px] sm:h-[480px]"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {HERO_SLIDES.map((slide, idx) => (
            <div key={idx} className="w-full flex-shrink-0 relative h-full">
              <img
                src={slide.image}
                alt={slide.title}
                onError={(e) => {
                  e.currentTarget.src = slide.fallback;
                }}
                className="w-full h-full object-cover select-none"
              />
              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />
            </div>
          ))}
        </div>

        {/* Text Content Overlay with Slide-In Animation */}
        <div
          key={`text-slide-${current}`}
          className="absolute inset-0 flex flex-col justify-end p-5 sm:p-7 text-white pointer-events-none"
        >
          <div className="pointer-events-auto">
            {/* Tag Badge */}
            <div className="animate-slide-in-left">
              <span className={`inline-flex items-center gap-1.5 font-black text-[11px] sm:text-xs px-3.5 py-1 rounded-full shadow-lg uppercase tracking-wide ${currentSlide.tagBg}`}>
                <Sparkles className="w-3.5 h-3.5" />
                {currentSlide.tag}
              </span>
            </div>

            {/* Title with Slide-in from Left */}
            <h3 className="animate-slide-in-left animation-delay-100 font-serif text-2xl sm:text-3xl font-bold leading-tight mt-2 text-white drop-shadow-md">
              {currentSlide.title}
            </h3>

            {/* Subtitle with Slide-in */}
            <p className="animate-slide-in-left animation-delay-200 text-xs sm:text-sm text-amber-100/90 mt-1.5 line-clamp-2 max-w-lg">
              {currentSlide.subtitle}
            </p>

            {/* Bottom Bar: Price & CTA buttons with Slide-in from bottom */}
            <div className="animate-slide-in-bottom animation-delay-300 mt-4 flex items-center justify-between pt-3.5 border-t border-white/20">
              <div>
                <span className="text-[11px] text-amber-300 font-medium block">Special Client Rate</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-white">{currentSlide.priceText}</span>
                  <span className="text-xs text-gray-300 font-bold">{currentSlide.unit}</span>
                  {currentSlide.oldPrice && (
                    <span className="text-xs text-rose-300 line-through ml-1">{currentSlide.oldPrice}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuickViewProduct(matchedProduct)}
                  className="px-3 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-xl font-bold text-xs transition border border-white/30 flex items-center gap-1 shadow-md"
                  title="Quick View Details"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Details</span>
                </button>

                <button
                  onClick={handleOrderSlide}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-emerald-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/30 hover:scale-105 transition flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Order Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={goToPrev}
          aria-label="Previous Slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition hover:scale-110 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={goToNext}
          aria-label="Next Slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition hover:scale-110 shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Top Floating Controls: Counter & Pause/Play */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-xs">
          <span className="font-bold text-amber-300">
            0{current + 1} <span className="text-gray-400 font-normal">/ 0{total}</span>
          </span>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-gray-300 hover:text-white transition ml-1"
            title={isPaused ? "Play Slideshow" : "Pause Slideshow"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Bottom Slide Indicator Dots */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 'next' : 'prev');
                setCurrent(i);
              }}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-7 bg-amber-400 shadow-md' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

      </div>

      {/* Floating Badge: Owner Contact */}
      <div
        className="absolute -bottom-5 -left-4 sm:-left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-amber-200 max-w-[240px] hidden sm:block animate-bounce z-20"
        style={{ animationDuration: '4s' }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">👑</span>
          <div>
            <h4 className="font-bold text-xs text-gray-900 leading-tight">Hafiz Sumair</h4>
            <p className="text-[10px] text-emerald-700 font-bold">📞 {STORE_INFO.phone}</p>
            <p className="text-[9px] text-gray-500">Baghbanpura, Lahore</p>
          </div>
        </div>
      </div>

      {/* Floating Badge: Fast COD */}
      <div className="absolute -top-4 -right-4 bg-emerald-900 text-white p-3 rounded-2xl shadow-xl border border-amber-400/40 hidden sm:block z-20">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <div>
            <p className="text-[11px] font-bold text-amber-300">Fast Nationwide COD</p>
            <p className="text-[9px] text-emerald-200">Free over Rs. 5,000</p>
          </div>
        </div>
      </div>

    </div>
  );
};

