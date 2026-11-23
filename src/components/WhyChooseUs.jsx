import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { STORE_INFO } from '../data/products';
import { AnimateOnScroll } from './AnimateOnScroll';

const reasons = [
  {
    color: 'bg-emerald-800',
    iconColor: 'text-amber-300',
    title: 'Oven-Fresh Roasting & Nitrogen Fresh Packing',
    desc: 'We utilize food-grade nitrogen-flush vacuum packaging to preserve natural crunch, prevent oxidation, and keep volatile essential oils intact.'
  },
  {
    color: 'bg-amber-600',
    iconColor: 'text-white',
    title: '100% Sweet Almonds (Zero Bitter Nuts Policy)',
    desc: 'Our Afghani Badam is rigorously screened with zero tolerance for bitter kernels. If you ever find a bitter nut, we replace your order free of cost!'
  },
  {
    color: 'bg-rose-700',
    iconColor: 'text-white',
    title: 'Authentic Madinah Ajwa Dates & Wild Sidr Honey',
    desc: 'Direct certified imports of sacred Ajwa dates from Madinah Munawwarah, paired with 100% cold-extracted pure forest Beri (Sidr) honey.'
  }
];

export const WhyChooseUs = () => {
  return (
    <section id="why-choose-us" className="py-16 bg-white border-y border-amber-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left text — slides from left */}
          <div className="lg:col-span-6 space-y-6">

            <AnimateOnScroll animation="reveal-left" delay={0}>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-3.5 py-1 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Our Quality Promise & Standards
              </span>
            </AnimateOnScroll>

            <AnimateOnScroll animation="reveal-left" delay={100}>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-gray-950 leading-tight">
                Why Nayyab Dry Fruit Stands Out
              </h2>
            </AnimateOnScroll>

            <AnimateOnScroll animation="reveal-left" delay={150}>
              <p className="text-gray-600 text-sm leading-relaxed">
                At <strong>{STORE_INFO.name}</strong>, <strong>Hafiz Sumair</strong> personally inspects and guarantees zero old warehouse stock. Every single batch is sourced directly from original high-altitude orchards in Kandahar, Waziristan, Hunza, Swat, and Madinah Munawwarah. Each grain is visually inspected, graded, and vacuum packed for unmatched crunch and vitality.
              </p>
            </AnimateOnScroll>

            <div className="space-y-4 pt-2">
              {reasons.map((r, idx) => (
                <AnimateOnScroll key={idx} animation="reveal-left" delay={200 + idx * 100}>
                  <div className="flex items-start gap-3.5 p-4 bg-amber-50/60 rounded-2xl border border-amber-200/50">
                    <div className={`w-10 h-10 rounded-xl ${r.color} flex items-center justify-center shrink-0`}>
                      <Check className={`w-5 h-5 ${r.iconColor}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{r.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{r.desc}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

          </div>

          {/* Right image grid — slides from right */}
          <AnimateOnScroll animation="reveal-right" delay={200} className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden shadow-lg aspect-4/5 border border-amber-200">
                  <img
                    src="/kaju.jpg"
                    alt="Kaju Selection"
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="bg-emerald-950 text-white p-6 rounded-3xl text-center shadow-lg">
                  <span className="text-3xl font-black text-amber-400">100%</span>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-200 mt-1">Chemical & Bleach Free</p>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="bg-amber-500 text-emerald-950 p-6 rounded-3xl text-center shadow-lg">
                  <span className="text-2xl font-black">{STORE_INFO.proprietor}</span>
                  <p className="text-xs font-extrabold uppercase tracking-wider mt-1">Baghbanpura, Lahore Store</p>
                </div>
                <div className="rounded-3xl overflow-hidden shadow-lg aspect-4/5 border border-amber-200">
                  <img
                    src="/pista.jpg"
                    alt="Pista Selection"
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                </div>
              </div>
            </div>
          </AnimateOnScroll>

        </div>

      </div>
    </section>
  );
};
