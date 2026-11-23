import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Phone, MessageCircle, MapPin, Menu, X, Sparkles, Package, Navigation } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { STORE_INFO } from '../data/products';
import { BulkOrderModal } from './BulkOrderModal';

export const Navbar = ({ onOpenAdmin, onOpenTracking }) => {
  const { 
    getCartCount, 
    getSubtotal, 
    wishlist, 
    setIsCartOpen, 
    searchQuery, 
    setSearchQuery 
  } = useCart();
  const [mobileMenuOpen,  setMobileMenuOpen]  = useState(false);
  const [bulkModalOpen,   setBulkModalOpen]   = useState(false);

  return (
    <>
      {/* Bulk Order Modal */}
      {bulkModalOpen && <BulkOrderModal onClose={() => setBulkModalOpen(false)} />}

      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-amber-200 text-xs py-2 px-4 border-b border-amber-600/30 nav-entrance" style={{ animationDelay: '0ms' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 font-medium">
            <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full text-[11px] font-bold border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Proprietor: {STORE_INFO.proprietor}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{STORE_INFO.address}</span>
            </span>
            <span className="hidden lg:inline text-amber-400 font-bold">• Free Nationwide Delivery on Rs. 5,000+ Orders</span>
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px]">
            <a 
              href={`https://wa.me/${STORE_INFO.whatsappRaw}`} 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1.5 transition font-bold text-amber-300"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Call / WhatsApp: <strong>{STORE_INFO.phone}</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER & NAVBAR */}
      <header className="sticky top-0 z-40 glass-nav border-b border-amber-200/50 shadow-xs nav-entrance" style={{ animationDelay: '50ms' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">

            {/* Logo */}
            <a href="#" className="flex items-center gap-3 shrink-0 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-900 to-emerald-700 flex items-center justify-center text-amber-300 shadow-md group-hover:scale-105 transition-transform duration-300 border border-amber-400/30 text-2xl">
                🥜
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-2xl font-black tracking-tight text-emerald-950 group-hover:text-emerald-800 transition">
                    NAYYAB
                  </span>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-amber-700">
                    DRY FRUIT
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 font-medium -mt-0.5 tracking-tight">
                  Premium Quality & Pure Harvest • Lahore Outlet
                </p>
              </div>
            </a>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Cashews, Pistachios, Pine Nuts, Apricots, Dates..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-amber-50/60 border border-amber-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-800/30 focus:border-emerald-800 transition shadow-inner placeholder:text-gray-400"
                />
                <div className="absolute left-3.5 top-3 text-amber-700 pointer-events-none">
                  <Search className="w-4 h-4" />
                </div>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Navigation Links & Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <nav className="hidden xl:flex items-center gap-5 text-sm font-semibold text-gray-700 mr-2">
                <a href="#products-section" className="hover:text-emerald-800 transition">Products</a>
                <a href="#store-location" className="hover:text-emerald-800 transition text-amber-800 font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  Store Location
                </a>
                <a href="#why-choose-us" className="hover:text-emerald-800 transition">Why Nayyab</a>
                <a href="#health-guide" className="hover:text-emerald-800 transition">Health Benefits</a>
                <a href="#customer-reviews" className="hover:text-emerald-800 transition">Reviews</a>
                <button
                  onClick={() => onOpenTracking && onOpenTracking()}
                  className="hover:text-emerald-800 transition flex items-center gap-1 text-blue-700 font-bold"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Track Order
                </button>
              </nav>

              {/* Wholesale Button */}
              <button
                onClick={() => setBulkModalOpen(true)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-emerald-900 text-amber-300 hover:bg-emerald-800 rounded-xl font-bold text-xs border border-emerald-700 transition shadow-xs"
                title="Wholesale / Bulk Order"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Wholesale</span>
              </button>

              {/* Direct Phone Call */}
              <a
                href={`tel:${STORE_INFO.phone}`}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl font-bold text-xs border border-amber-300 transition shadow-xs"
                title="Call Store"
              >
                <Phone className="w-3.5 h-3.5 text-amber-800" />
                <span>{STORE_INFO.phone}</span>
              </a>

              {/* Direct WhatsApp */}
              <a
                href={`https://wa.me/${STORE_INFO.whatsappRaw}?text=Hello%20Hafiz%20Sumair!%20I%20would%20like%20to%20order%20from%20Nayyab%20Dry%20Fruit.`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-emerald-800 text-white hover:bg-emerald-900 rounded-xl font-bold text-xs border border-emerald-700 transition shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>WhatsApp</span>
              </a>

              {/* Wishlist Button */}
              <button
                onClick={() => {
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="relative p-2.5 rounded-xl bg-amber-50/80 hover:bg-amber-100 text-gray-700 border border-amber-200 transition"
                title="Wishlist"
              >
                <Heart className="w-5 h-5 text-rose-600" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-sm shadow-md hover:shadow-emerald-900/20 active:scale-95 transition"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-amber-500 text-emerald-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                      {getCartCount()}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Cart</span>
                <span className="hidden md:inline text-amber-300 font-extrabold text-xs ml-1 pl-2 border-l border-emerald-700">
                  Rs. {getSubtotal().toLocaleString('en-PK')}
                </span>
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-xl text-gray-700 hover:bg-amber-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Cashews, Pistachios, Pine Nuts, Apricots..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-amber-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-800"
              />
              <div className="absolute left-3 top-2.5 text-amber-700 pointer-events-none">
                <Search className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="xl:hidden py-4 border-t border-amber-200/60 flex flex-col gap-3 text-sm font-semibold">
              <a 
                href="#products-section" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-amber-100/60"
              >
                All Products Catalog
              </a>
              <a 
                href="#store-location" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-amber-100/60 text-emerald-900 font-bold flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-amber-700" />
                Store Location & Direction Map
              </a>
              <a 
                href="#why-choose-us" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-amber-100/60"
              >
                Our 100% Quality Guarantee
              </a>
              <a 
                href="#health-guide" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-amber-100/60"
              >
                Certified Health Benefits
              </a>
              <a 
                href="#customer-reviews" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-amber-100/60"
              >
                Customer Reviews
              </a>
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenTracking && onOpenTracking(); }}
                className="px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-700 font-bold flex items-center gap-2 text-left"
              >
                <Navigation className="w-4 h-4" />
                Track My Order
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); setBulkModalOpen(true); }}
                className="px-3 py-2 rounded-lg bg-emerald-900 text-amber-300 font-bold flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Wholesale / Bulk Order
              </button>
              <div className="flex gap-2 pt-2">
                <a
                  href={`tel:${STORE_INFO.phone}`}
                  className="flex-1 py-2 text-center bg-amber-100 text-amber-950 rounded-xl font-bold text-xs"
                >
                  Call: {STORE_INFO.phone}
                </a>
                <a
                  href={`https://wa.me/${STORE_INFO.whatsappRaw}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 text-center bg-[#25D366] text-white rounded-xl font-bold text-xs"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          )}

        </div>
      </header>
    </>
  );
};
