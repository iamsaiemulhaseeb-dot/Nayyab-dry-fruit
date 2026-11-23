import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { STORE_INFO } from '../data/products';
import { AnimateOnScroll } from './AnimateOnScroll';

const reviews = [
  {
    name: 'Muhammad Ali',
    location: 'Baghbanpura, Lahore',
    initials: 'MA',
    badge: 'Verified Store Buyer',
    comment:
      'I personally visited Hafiz Sumair\u2019s store near Shalimar Degree College. Both the roasted cashews and pine nuts were freshly roasted and super crispy. The pricing is genuinely the best in all of Lahore.'
  },
  {
    name: 'Fatima Khan',
    location: 'Clifton, Karachi',
    initials: 'FK',
    badge: 'Online Delivery Buyer',
    comment:
      'Ordered Khobani Jimri and Ajwa Dates for delivery in Karachi. Received the parcel within 2 days via TCS. Packaging was vacuum-sealed and the quality was absolutely five-star!'
  },
  {
    name: 'Tariq Zaman',
    location: 'Gulberg, Lahore',
    initials: 'TZ',
    badge: 'Verified Buyer',
    comment:
      'Every single almond kernel was 100% sweet and oil-rich. Hafiz Sumair confirmed my order over the phone and delivery was prompt. Exceptional standard and service!'
  }
];

export const Reviews = () => {
  return (
    <section id="customer-reviews" className="py-16 bg-white border-t border-amber-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <AnimateOnScroll animation="reveal" className="flex flex-col md:flex-row items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-3.5 py-1 rounded-full">
              Real Customer Feedback
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-gray-950 mt-3">
              What Customers Say About {STORE_INFO.proprietor}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-500" />
              ))}
            </div>
            <span className="font-bold text-gray-800 text-sm">
              4.9 / 5 Overall Rating (800+ Verified Orders)
            </span>
          </div>
        </AnimateOnScroll>

        {/* Review Cards — staggered scale-in */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <AnimateOnScroll key={idx} animation="reveal-scale" delay={idx * 150}>
              <div className="p-6 bg-[#fdfbf7] rounded-3xl border border-amber-200/70 shadow-xs flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition duration-300 h-full">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {rev.badge}
                    </span>
                  </div>
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-4">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-amber-100">
                  <div className="w-10 h-10 rounded-full bg-emerald-900 text-amber-300 font-bold flex items-center justify-center text-sm">
                    {rev.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">{rev.name}</h4>
                    <p className="text-[10px] text-gray-500">{rev.location}</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
};
