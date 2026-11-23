import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { STORE_INFO } from '../data/products';
import { AnimateOnScroll } from './AnimateOnScroll';

const faqs = [
  {
    q: 'Can I visit the store in person to inspect and purchase items?',
    a: `Yes, absolutely! Our physical retail outlet is located at ${STORE_INFO.address}. We are open 7 days a week from 10:00 AM to 11:30 PM. You can visit in person to taste, inspect, and have items freshly weighed and packed right in front of you.`
  },
  {
    q: 'Is Cash on Delivery (COD) available in Lahore and across Pakistan?',
    a: 'Yes, we provide Cash on Delivery across Pakistan. In Lahore, we offer same-day or next-day delivery. For all other cities (Karachi, Islamabad, Rawalpindi, Peshawar, Faisalabad, Multan, etc.), parcels are delivered within 2 to 3 business days via premier courier services.'
  },
  {
    q: 'Can I place my order directly with Hafiz Sumair via WhatsApp or phone call?',
    a: `Yes! You can call or send a WhatsApp message directly to ${STORE_INFO.phone}. Our team will immediately record your requirements, calculate your total bill, and confirm your courier dispatch.`
  },
  {
    q: 'What is your guarantee on sweet almonds and freshness?',
    a: 'We maintain a strict zero-tolerance policy for bitter (kadwi) almonds. All our dry fruits are fresh crop and vacuum sealed. If you ever encounter any bitter nuts or freshness issues, simply let us know on WhatsApp for an immediate free replacement or full refund.'
  }
];

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq-section" className="py-16 bg-[#fbf7f0] border-t border-amber-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <AnimateOnScroll animation="reveal" className="text-center mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800 bg-amber-100 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            Frequently Asked Questions
          </span>
          <h2 className="font-serif text-3xl font-black text-emerald-950 mt-3 mb-2">
            Got Questions? We Have Answers
          </h2>
          <p className="text-gray-600 text-sm">
            Everything you need to know about deliveries, store visits, and our 100% freshness guarantee.
          </p>
        </AnimateOnScroll>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <AnimateOnScroll key={idx} animation="reveal" delay={idx * 100}>
                <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-2xs transition-all duration-200">
                  <button
                    type="button"
                    onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                    className="w-full p-4 text-left font-bold text-sm text-gray-900 flex items-center justify-between hover:bg-amber-50/50 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-amber-700 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-amber-100 bg-amber-50/20">
                      {faq.a}
                    </div>
                  )}
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

      </div>
    </section>
  );
};
