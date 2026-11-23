import React from 'react';
import { MapPin, Phone, Clock, Navigation, MessageCircle, CheckCircle2 } from 'lucide-react';
import { STORE_INFO } from '../data/products';
import { AnimateOnScroll } from './AnimateOnScroll';

export const StoreLocation = () => {
  return (
    <section id="store-location" className="py-16 bg-gradient-to-b from-[#fbf7f0] to-[#f4ebe0] border-y border-amber-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <AnimateOnScroll animation="reveal" className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-900 bg-emerald-100 px-4 py-1.5 rounded-full border border-emerald-300 inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-800" />
            Visit Our Physical Store • Lahore Outlet
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-emerald-950 mt-3 mb-2">
            Store Location & Direction Map
          </h2>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            You are warmly welcome to visit our physical outlet in Baghbanpura, Lahore to inspect and select fresh dry fruits in person, or order online for express doorstep delivery.
          </p>
        </AnimateOnScroll>

        {/* Grid: Store Info Cards + Map Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left: Details & Timings — slides from left */}
          <AnimateOnScroll animation="reveal-left" delay={0} className="lg:col-span-5 flex flex-col justify-between space-y-5">

            {/* Store Card */}
            <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md">
              <div className="flex items-center gap-3.5 pb-4 border-b border-amber-100 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-emerald-950 flex items-center justify-center text-2xl font-black shadow-sm">
                  🏪
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                    Nayyab Dry Fruit Outlet
                  </span>
                  <h3 className="font-serif font-black text-xl text-gray-900">
                    Proprietor: {STORE_INFO.proprietor}
                  </h3>
                </div>
              </div>

              {/* Address Details */}
              <div className="space-y-3.5 text-xs text-gray-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gray-900 text-sm">Store Address:</strong>
                    <p className="text-gray-700 font-medium mt-0.5">{STORE_INFO.address}</p>
                    <p className="text-gray-500 font-sans mt-0.5">{STORE_INFO.city}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gray-900 text-sm">Contact & Support:</strong>
                    <a href={`tel:${STORE_INFO.phone}`} className="text-emerald-800 font-extrabold text-sm hover:underline block">
                      {STORE_INFO.phone}
                    </a>
                    <span className="text-[11px] text-gray-500">Direct phone call & WhatsApp support available daily</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-gray-900 text-sm">Business Timings:</strong>
                    <p className="text-gray-600 mt-0.5">{STORE_INFO.timings}</p>
                  </div>
                </div>
              </div>

              {/* In-Store Features */}
              <div className="mt-5 pt-4 border-t border-amber-100 grid grid-cols-2 gap-2 text-[11px] font-semibold text-emerald-950">
                <span className="flex items-center gap-1.5 bg-emerald-50 p-2 rounded-xl">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> In-Person Quality Check
                </span>
                <span className="flex items-center gap-1.5 bg-emerald-50 p-2 rounded-xl">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Fresh Packing on Demand
                </span>
                <span className="flex items-center gap-1.5 bg-amber-50 p-2 rounded-xl">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" /> Cash, Cards & Transfers
                </span>
                <span className="flex items-center gap-1.5 bg-amber-50 p-2 rounded-xl">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" /> Wholesale & Retail Rates
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={STORE_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 bg-emerald-900 hover:bg-emerald-950 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95 hover:-translate-y-0.5"
              >
                <Navigation className="w-4 h-4 text-amber-300" />
                <span>View on Google Maps</span>
              </a>

              <a
                href={`https://wa.me/${STORE_INFO.whatsappRaw}?text=Hello%20Hafiz%20Yasir!%20I%20would%20like%20to%20visit%20your%20store%20in%20Baghbanpura%20Lahore.`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95 hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

          </AnimateOnScroll>

          {/* Right: Interactive Google Map — slides from right */}
          <AnimateOnScroll animation="reveal-right" delay={150} className="lg:col-span-7 flex flex-col">
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-4 border-amber-200/80 flex-1 min-h-[420px] relative">
              <iframe
                title="Nayyab Dry Fruit Location - Shalimar Degree College Baghbanpura Lahore"
                src={STORE_INFO.mapEmbedUrl}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[420px] border-0"
              />

              {/* Map Floating Pill */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-amber-300 text-xs text-gray-900 pointer-events-none hidden sm:flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                <div>
                  <strong>{STORE_INFO.name} ({STORE_INFO.proprietor})</strong>
                  <p className="text-[10px] text-gray-500">{STORE_INFO.address}</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

        </div>

      </div>
    </section>
  );
};
