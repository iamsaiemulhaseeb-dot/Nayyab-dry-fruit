import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCTS_DATA } from '../data/products';
import { ProductCard } from './ProductCard';
import { useCart } from '../context/CartContext';
import { AnimateOnScroll } from './AnimateOnScroll';
import { Sparkles, Package } from 'lucide-react';
import { getProducts } from '../services/api';

export const ProductCatalog = () => {
  const [productsList, setProductsList] = useState(PRODUCTS_DATA);

  // Load latest products from Backend API (JSON storage), fallback to PRODUCTS_DATA
  useEffect(() => {
    let isMounted = true;
    getProducts().then(data => {
      if (isMounted && data && Array.isArray(data) && data.length > 0) {
        setProductsList(data);
      }
    }).catch(err => {
      console.warn('Backend products fetch skipped:', err.message);
    });
    return () => { isMounted = false; };
  }, []);

  const {
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy
  } = useCart();

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'nuts', label: 'Roasted Nuts' },
    { id: 'kernels', label: 'Almonds & Walnuts' },
    { id: 'dried-fruits', label: 'Figs & Apricots' },
    { id: 'dates', label: 'Ajwa Dates' },
    { id: 'honey', label: 'Sidr Honey' },
    { id: 'combos', label: 'Gift Platters' },
  ];

  const filteredProducts = useMemo(() => {
    let list = [...productsList];

    if (activeCategory !== 'all') {
      list = list.filter(p => p.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-low') {
      list.sort((a, b) => a.pricePerKg - b.pricePerKg);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.pricePerKg - a.pricePerKg);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [activeCategory, searchQuery, sortBy]);

  // stagger delays cycle for product cards
  const staggerDelays = [0, 75, 150, 225, 300, 375, 150, 225, 300, 375, 450, 525];

  return (
    <section id="products-section" className="py-16 bg-[#fdfbf7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <AnimateOnScroll animation="reveal" className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-amber-700 bg-amber-100/80 px-3.5 py-1 rounded-full border border-amber-300 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            A+ Grade Handpicked Selection • Hafiz Sumair
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-emerald-950 mt-3 mb-2">
            Our Fresh Harvest & Premium Dried Fruits
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mx-auto">
            Explore our curated range of authentic Afghani pine nuts, jumbo cashews, green pistachios, sweet almond kernels, Kashmiri walnuts, sun-dried figs, organic apricots, Madinah Ajwa dates, and wild forest honey.
          </p>
        </AnimateOnScroll>

        {/* Filter & Sort Bar */}
        <AnimateOnScroll animation="reveal" delay={100}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-3.5 rounded-2xl border border-amber-200/80 shadow-xs">

            {/* Categories Tab Strip */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat.id
                      ? 'bg-emerald-800 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-amber-50 border border-gray-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Select & Counter */}
            <div className="flex items-center justify-between w-full md:w-auto gap-4">
              <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                {filteredProducts.length} Products Found
              </span>

              <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="text-xs font-bold text-gray-500 whitespace-nowrap">
                  Sort By:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-bold text-gray-800 bg-amber-50/70 border border-amber-200 rounded-xl px-3 py-2 focus:outline-hidden focus:ring-1 focus:ring-emerald-800 cursor-pointer"
                >
                  <option value="featured">Featured / Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                </select>
              </div>
            </div>

          </div>
        </AnimateOnScroll>

        {/* Product Cards Grid — each card staggered, auto-rows stretch for equal heights */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
            {filteredProducts.map((product, idx) => (
              <AnimateOnScroll
                key={product.id}
                animation="reveal-scale"
                delay={staggerDelays[idx % staggerDelays.length]}
                className="h-full"
              >
                <ProductCard product={product} />
              </AnimateOnScroll>
            ))}
          </div>
        ) : (
          <AnimateOnScroll animation="reveal-fade">
            <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-amber-200 p-8 shadow-xs">
              <div className="w-20 h-20 mx-auto mb-4 bg-amber-50 rounded-full flex items-center justify-center text-3xl">
                <Package className="w-8 h-8 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Dry Fruits Found!</h3>
              <p className="text-gray-500 max-w-md mx-auto text-sm">
                We could not find any products matching your search criteria. Please try a different search keyword or reset filters.
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setSearchQuery('');
                  setSortBy('featured');
                }}
                className="mt-5 px-6 py-2.5 bg-emerald-800 text-white rounded-xl font-medium hover:bg-emerald-900 transition shadow-md"
              >
                View All Products
              </button>
            </div>
          </AnimateOnScroll>
        )}

      </div>
    </section>
  );
};
