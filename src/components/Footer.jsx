import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, Heart } from 'lucide-react';
import { STORE_INFO } from '../data/products';
import { AnimateOnScroll } from './AnimateOnScroll';

export const Footer = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-emerald-950 text-amber-100/90 pt-16 pb-8 border-t border-amber-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand Info */}
          <AnimateOnScroll animation="reveal" delay={0}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-emerald-950 flex items-center justify-center font-bold text-xl">
                  🥜
                </div>
                <div>
                  <span className="font-serif text-xl font-bold tracking-tight text-white">{STORE_INFO.name}</span>
                  <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 block -mt-1">
                    LAHORE OUTLET
                  </span>
                </div>
              </div>
              <p className="text-xs text-amber-200/70 leading-relaxed">
                Proprietor: <strong>{STORE_INFO.proprietor}</strong>. Premium harvest dried fruits, fresh oven-roasted nuts, and certified Madinah dates delivered direct to your home.
              </p>
              <div className="flex items-center gap-3 text-amber-400">
                <a href={`https://wa.me/${STORE_INFO.whatsappRaw}`} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition shadow-sm" title="WhatsApp">
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a href={`tel:${STORE_INFO.phone}`}
                  className="w-9 h-9 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-500 hover:text-emerald-950 transition shadow-sm" title="Phone Call">
                  <Phone className="w-4 h-4" />
                </a>
                <a href={STORE_INFO.googleMapsUrl} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-500 hover:text-emerald-950 transition shadow-sm" title="Map Location">
                  <MapPin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Quick Links */}
          <AnimateOnScroll animation="reveal" delay={100}>
            <div>
              <h4 className="font-serif font-bold text-white text-base mb-4 border-b border-emerald-800 pb-2">
                Quick Navigation
              </h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#products-section" className="hover:text-amber-400 transition">All Dry Fruits Catalog</a></li>
                <li>
                  <a href="#store-location" className="hover:text-amber-400 transition font-bold text-amber-300">
                    📍 Google Map & Store Address
                  </a>
                </li>
                <li><a href="#why-choose-us" className="hover:text-amber-400 transition">Our 100% Quality Guarantee</a></li>
                <li><a href="#health-guide" className="hover:text-amber-400 transition">Winter Health Benefits</a></li>
                <li><a href="#customer-reviews" className="hover:text-amber-400 transition">Customer Reviews</a></li>
                <li><a href="#faq-section" className="hover:text-amber-400 transition">Frequently Asked Questions</a></li>
                <li className="pt-1 border-t border-emerald-900">
                  <button 
                    type="button" 
                    onClick={onOpenAdmin} 
                    className="hover:text-amber-300 text-amber-400 font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    🔒 Hafiz Sumair Admin Dashboard
                  </button>
                </li>
              </ul>
            </div>
          </AnimateOnScroll>

          {/* Rates List */}
          <AnimateOnScroll animation="reveal" delay={200}>
            <div>
              <h4 className="font-serif font-bold text-white text-base mb-4 border-b border-emerald-800 pb-2">
                Today's Rates (Per Kg)
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-200/80">
                <li>Cashews (Kaju): <strong>Rs. 4,000 / kg</strong></li>
                <li>Pistachios (Pista): <strong>Rs. 5,800 / kg</strong></li>
                <li>Pine Nuts (Chalgoza): <strong>Rs. 8,000 / kg</strong></li>
                <li>Almonds (Badam Giri): <strong>Rs. 3,800 / kg</strong></li>
                <li>Walnuts (Akhrot Magaz): <strong>Rs. 3,200 / kg</strong></li>
                <li>Figs (Injeer): <strong>Rs. 3,400 / kg</strong></li>
                <li>Round Apricots (Khobani Goal): <strong>Rs. 1,600 / kg</strong></li>
                <li>Soft Apricots (Khobani Jimri): <strong>Rs. 1,800 / kg</strong></li>
                <li>Madinah Ajwa Dates: <strong>Rs. 3,200 / kg</strong></li>
                <li>Green Raisins (Kishmish): <strong>Rs. 1,600 / kg</strong></li>
              </ul>
            </div>
          </AnimateOnScroll>

          {/* Store & Contact */}
          <AnimateOnScroll animation="reveal" delay={300}>
            <div>
              <h4 className="font-serif font-bold text-white text-base mb-4 border-b border-emerald-800 pb-2">
                Store & Contact
              </h4>
              <div className="space-y-3 text-xs">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>{STORE_INFO.address}</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-amber-400 text-sm">👤</span>
                  <span>Proprietor: <strong>{STORE_INFO.proprietor}</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Call / WhatsApp:{' '}
                    <a href={`tel:${STORE_INFO.phone}`} className="font-bold text-amber-300 hover:underline">
                      {STORE_INFO.phone}
                    </a>
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{STORE_INFO.timings}</span>
                </p>
                <div className="pt-2">
                  <span className="block text-[11px] font-bold text-amber-400 mb-1">Payment Methods:</span>
                  <div className="flex flex-wrap gap-1.5 text-[10px] text-gray-300">
                    <span className="bg-emerald-900 px-2 py-0.5 rounded">Cash on Delivery</span>
                    <span className="bg-emerald-900 px-2 py-0.5 rounded">JazzCash</span>
                    <span className="bg-emerald-900 px-2 py-0.5 rounded">EasyPaisa</span>
                    <span className="bg-emerald-900 px-2 py-0.5 rounded">Bank Transfer</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

        </div>

        {/* Copyright */}
        <AnimateOnScroll animation="reveal-fade">
          <div className="pt-8 border-t border-emerald-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-200/60 gap-4">
            <p>© 2026 {STORE_INFO.name} • {STORE_INFO.proprietor} ({STORE_INFO.address}). All rights reserved.</p>
            <p className="flex items-center gap-1">
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
              <span>for Nayyab Dry Fruit Lovers</span>
            </p>
          </div>
        </AnimateOnScroll>

      </div>
    </footer>
  );
};
