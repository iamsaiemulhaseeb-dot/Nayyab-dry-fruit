import React from 'react';
import { Truck, ShieldCheck, MapPin, PackageCheck } from 'lucide-react';
import { AnimateOnScroll } from './AnimateOnScroll';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const TrustFeatures = () => {
  const features = [
    {
      icon: Truck,
      bg: 'bg-amber-100 text-amber-800',
      title: 'Free Express Delivery',
      desc: 'Orders above Rs. 5,000 get free door delivery across Pakistan'
    },
    {
      icon: ShieldCheck,
      bg: 'bg-emerald-100 text-emerald-800',
      title: '100% Sweet Guarantee',
      desc: 'Zero bitter almonds policy with instant exchange or money back'
    },
    {
      icon: MapPin,
      bg: 'bg-amber-100 text-amber-800',
      title: 'Store Visit Available',
      desc: 'Shalimar Degree College near Bahu Gym, Baghbanpura, Lahore'
    },
    {
      icon: PackageCheck,
      bg: 'bg-rose-100 text-rose-800',
      title: 'Vacuum Airtight Packs',
      desc: 'Protects natural crunch, volatile aroma and essential oils'
    }
  ];

  const delays = [0, 100, 200, 300];

  return (
    <section className="py-8 bg-white border-b border-amber-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <AnimateOnScroll key={idx} animation="reveal-scale" delay={delays[idx]}>
                <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-amber-50/50 transition duration-200">
                  <div className={`w-12 h-12 rounded-2xl ${feat.bg} flex items-center justify-center text-2xl shrink-0 shadow-2xs`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{feat.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
};
