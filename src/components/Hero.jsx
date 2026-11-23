import React from 'react';
import { ShoppingCart, MessageCircle, MapPin, Sparkles, ShieldCheck, Truck, Banknote, ArrowDown } from 'lucide-react';
import { STORE_INFO } from '../data/products';
import { HeroSlideshow } from './HeroSlideshow';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f5ede1] via-[#fbf7f0] to-[#fdfbf7] pt-8 pb-16 lg:py-20 border-b border-amber-200/50">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Content — slides in from left on page load */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left hero-entrance-left">

            {/* Quality Badge & Store Info */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-amber-300 shadow-sm shimmer-badge text-emerald-950 font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              <span>Nayyab Dry Fruit • Proprietor: {STORE_INFO.proprietor}</span>
              <span className="text-amber-700">• Baghbanpura, Lahore</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 leading-tight">
              Natural Sweetness, <br className="hidden sm:inline" />
              <span className="gold-gradient-text">Premium Fresh Dry Fruits</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
              Welcome to <strong>{STORE_INFO.name}</strong> by <strong>Hafiz Sumair</strong>. Authentic Kandahari Almonds, Afghani Chilgoza Pine Nuts, Jumbo Roasted Cashews, Sun-Dried Apricots, Original Madinah Ajwa Dates &amp; Wild Sidr Honey. Visit our retail store near Bahu Gym, Baghbanpura Lahore or order online with Cash on Delivery nationwide!
            </p>

            {/* Pricing Teaser Strip */}
            <div className="p-3 bg-amber-50/90 rounded-2xl border border-amber-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-emerald-950 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Today's Special Rates:
              </span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200 font-bold text-amber-900 shadow-2xs">Cashews: Rs. 4,000/kg</span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200 font-bold text-amber-900 shadow-2xs">Pistachios: Rs. 5,800/kg</span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200 font-bold text-amber-900 shadow-2xs">Pine Nuts: Rs. 8,000/kg</span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200 font-bold text-amber-900 shadow-2xs">Almonds: Rs. 3,800/kg</span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-200 font-bold text-amber-900 shadow-2xs">Apricots: Rs. 1,600/kg</span>
            </div>

            {/* Key Trust Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 bg-white/80 rounded-2xl border border-amber-200/60 shadow-2xs text-center">
                <ShieldCheck className="w-6 h-6 text-emerald-700 mx-auto mb-1" />
                <p className="font-bold text-xs text-gray-900">100% Organic</p>
                <p className="text-[10px] text-gray-500">Chemical Free</p>
              </div>
              <div className="p-3 bg-white/80 rounded-2xl border border-amber-200/60 shadow-2xs text-center">
                <MapPin className="w-6 h-6 text-amber-700 mx-auto mb-1" />
                <p className="font-bold text-xs text-gray-900">Lahore Outlet</p>
                <p className="text-[10px] text-gray-500">Baghbanpura</p>
              </div>
              <div className="p-3 bg-white/80 rounded-2xl border border-amber-200/60 shadow-2xs text-center">
                <Truck className="w-6 h-6 text-emerald-700 mx-auto mb-1" />
                <p className="font-bold text-xs text-gray-900">Free Delivery</p>
                <p className="text-[10px] text-gray-500">Orders Rs. 5,000+</p>
              </div>
              <div className="p-3 bg-white/80 rounded-2xl border border-amber-200/60 shadow-2xs text-center">
                <Banknote className="w-6 h-6 text-amber-700 mx-auto mb-1" />
                <p className="font-bold text-xs text-gray-900">Cash On Delivery</p>
                <p className="text-[10px] text-gray-500">Doorstep Payment</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
              <a
                href="#products-section"
                className="w-full sm:w-auto px-8 py-4 bg-emerald-900 hover:bg-emerald-950 text-white rounded-2xl font-bold text-base shadow-xl shadow-emerald-950/20 hover:-translate-y-0.5 transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Shop Fresh Harvest</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${STORE_INFO.whatsappRaw}?text=Hello%20Hafiz%20Yasir!%20I%20would%20like%20to%20order%20from%20Nayyab%20Dry%20Fruit.`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-7 py-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-2xl font-extrabold text-base shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Order on WhatsApp</span>
              </a>

              <a
                href="#store-location"
                className="w-full sm:w-auto px-5 py-4 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-2xl font-bold text-sm border border-amber-300 transition flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-4 h-4 text-amber-800" />
                <span>Google Map Location</span>
              </a>
            </div>

          </div>

          {/* Right Hero Visual Showcase — slides in from right on page load */}
          <div className="lg:col-span-5 relative hero-entrance-right">
            <HeroSlideshow />
          </div>

        </div>
      </div>
    </section>
  );
};
