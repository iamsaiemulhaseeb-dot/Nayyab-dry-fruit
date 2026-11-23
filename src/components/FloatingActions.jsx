import React, { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { STORE_INFO } from '../data/products';

export const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating WhatsApp Button */}
      <aside aria-label="Customer Support">
        <a
          href={`https://wa.me/${STORE_INFO.whatsappRaw}?text=Hello%20Hafiz%20Sumair!%20I%20would%20like%20to%20order%20from%20Nayyab%20Dry%20Fruit.`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center wa-pulse group"
          title="Chat with Hafiz Sumair on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 text-white fill-white" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs pl-0 group-hover:pl-2">
            WhatsApp: {STORE_INFO.phone}
          </span>
        </a>
      </aside>

      {/* Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 bg-white text-emerald-950 p-3 rounded-2xl shadow-xl border border-amber-200 transition-all duration-300 hover:bg-amber-50 active:scale-95 animate-in fade-in"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5 text-emerald-900" />
        </button>
      )}
    </>
  );
};

