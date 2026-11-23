import React from 'react';
import { Brain, Flame, HeartHandshake } from 'lucide-react';
import { AnimateOnScroll } from './AnimateOnScroll';

const cards = [
  {
    icon: Brain,
    iconBg: 'bg-amber-100 text-amber-800',
    title: 'Brain & Memory Booster',
    body: (
      <>
        <strong>Sweet Almond Kernels</strong> and <strong>Kashmiri Walnuts</strong> are packed with Alpha-Linolenic Acid (plant Omega-3) and Vitamin E. Ideal for students and professionals to sharpen focus, memory, and cognitive speed.
      </>
    ),
    tag: 'Key Superfoods: Almonds & Walnuts',
    tagClass: 'text-emerald-800 bg-emerald-50'
  },
  {
    icon: Flame,
    iconBg: 'bg-rose-100 text-rose-800',
    title: 'Winter Warmth & Stamina',
    body: (
      <>
        <strong>Chilgoza (Pine Nuts)</strong> and <strong>Roasted Cashews</strong> generate deep internal warmth during chilly seasons. They provide long-lasting, slow-burning caloric energy and naturally curb unhealthy appetite.
      </>
    ),
    tag: 'Key Superfoods: Pine Nuts & Cashews',
    tagClass: 'text-amber-800 bg-amber-50'
  },
  {
    icon: HeartHandshake,
    iconBg: 'bg-emerald-100 text-emerald-800',
    title: 'Heart, Healing & Digestion',
    body: (
      <>
        <strong>Ajwa Dates</strong> provide natural cardiovascular and cellular support, while <strong>Sun-Dried Figs & Apricots</strong> restore gut motility with abundant bioavailable iron, potassium, and plant enzymes.
      </>
    ),
    tag: 'Key Superfoods: Ajwa Dates, Figs & Honey',
    tagClass: 'text-emerald-800 bg-emerald-50'
  }
];

export const HealthGuide = () => {
  return (
    <section id="health-guide" className="py-16 bg-gradient-to-b from-[#fdfbf7] to-[#f4ebe0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <AnimateOnScroll animation="reveal" className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-800 bg-amber-100 px-3.5 py-1 rounded-full">
            Wellness & Vitality
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-emerald-950 mt-3 mb-2">
            Certified Health Benefits & Nutritional Value
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Discover how incorporating these organic superfoods into your daily diet boosts immune defense, sustained physical energy, brainpower, and cardiovascular wellbeing.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <AnimateOnScroll key={idx} animation="reveal-scale" delay={idx * 150}>
                <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-md hover:-translate-y-1.5 transition duration-300 h-full">
                  <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">{card.body}</p>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${card.tagClass}`}>
                    {card.tag}
                  </span>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

      </div>
    </section>
  );
};
