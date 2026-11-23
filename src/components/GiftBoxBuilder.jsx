/**
 * GiftBoxBuilder.jsx
 * "Make Your Own Gift Box" section + modal for the Nayyab Dry Fruit storefront.
 * Customers pick a box size, choose up to 4 dry fruits, add a gift note,
 * then add the complete hamper to the cart in one click.
 */
import React, { useState, useMemo } from 'react';
import { X as XIcon, Gift, ShoppingCart, ChevronDown, CheckCircle2, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCTS_DATA, STORE_INFO } from '../data/products';
import { AnimateOnScroll } from './AnimateOnScroll';

/* ── Box options ── */
const BOX_SIZES = [
  {
    id: 'box-1kg',
    label: '1 kg · 4-Compartment Gift Box',
    slots: 4,
    totalWeight: 1,
    weightPerSlot: '250g',
    multiplierPerSlot: 0.25,
    price: 500,            // gift packaging surcharge on top of product prices
    emoji: '🎁',
  },
  {
    id: 'box-2kg',
    label: '2 kg · Luxury Presentation Box',
    slots: 4,
    totalWeight: 2,
    weightPerSlot: '500g',
    multiplierPerSlot: 0.50,
    price: 800,
    emoji: '🏆',
  },
  {
    id: 'box-4kg',
    label: '4 kg · Royal VIP Hamper',
    slots: 4,
    totalWeight: 4,
    weightPerSlot: '1 kg',
    multiplierPerSlot: 1.00,
    price: 1200,
    emoji: '👑',
  },
];

/* Only show dry fruits that are in stock */
const ELIGIBLE_PRODUCTS = PRODUCTS_DATA.filter(p => p.inStock && p.category !== 'combos');

/* ══════════════════════════════════════════════════════════
   SECTION ENTRY POINT  (placed inside ProductCatalog / App)
══════════════════════════════════════════════════════════ */
export const GiftBoxSection = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AnimateOnScroll animation="reveal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-3xl overflow-hidden relative flex flex-col md:flex-row items-center justify-between gap-6 p-8 md:p-10"
             style={{ background: 'linear-gradient(135deg, #0F291E 0%, #1a3d2b 60%, #0F291E 100%)' }}>

          {/* Decorative circles */}
          <span className="absolute top-4 right-4 text-6xl opacity-10 select-none pointer-events-none">🎁</span>
          <span className="absolute bottom-4 left-4 text-5xl opacity-10 select-none pointer-events-none">🥜</span>

          <div className="text-white z-10">
            <span className="text-xs font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
              Custom Gift Hamper
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-black mt-3 mb-2">
              Build Your Own Gift Box 🎁
            </h2>
            <p className="text-sm text-emerald-200/80 max-w-md leading-relaxed">
              Pick any dry fruits from our catalog, choose your box size, add a personal gift note,
              and we'll pack it beautifully. Perfect for weddings, Eid, and festivals.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="shrink-0 z-10 flex items-center gap-2.5 px-7 py-4 rounded-2xl font-black text-sm transition active:scale-95 shadow-xl hover:shadow-amber-400/30 hover:scale-105"
            style={{ background: '#f59e0b', color: '#0F291E' }}>
            <Gift className="w-5 h-5" />
            Make Your Gift Box
          </button>
        </div>
      </AnimateOnScroll>

      {open && <GiftBoxModal onClose={() => setOpen(false)} />}
    </>
  );
};

/* ══════════════════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════════════════ */
function GiftBoxModal({ onClose }) {
  const { addToCart, showToast } = useCart();

  const [step,       setStep]       = useState(1);   // 1=size, 2=pick fruits, 3=note+confirm
  const [boxSize,    setBoxSize]    = useState(null);
  const [selected,   setSelected]   = useState([]);  // array of product ids (up to slots)
  const [giftNote,   setGiftNote]   = useState('');
  const [recipientName, setRecipientName] = useState('');

  /* total price of this hamper */
  const totalPrice = useMemo(() => {
    if (!boxSize) return 0;
    const box = BOX_SIZES.find(b => b.id === boxSize);
    if (!box) return 0;
    const productsTotal = selected.reduce((sum, pid) => {
      const p = ELIGIBLE_PRODUCTS.find(x => x.id === pid);
      return sum + (p ? Math.round(p.pricePerKg * box.multiplierPerSlot) : 0);
    }, 0);
    return productsTotal + box.price;
  }, [boxSize, selected]);

  const box = BOX_SIZES.find(b => b.id === boxSize);

  /* toggle a product selection */
  const toggle = (pid) => {
    if (selected.includes(pid)) {
      setSelected(prev => prev.filter(id => id !== pid));
    } else {
      if (box && selected.length >= box.slots) {
        showToast(`This box holds only ${box.slots} items. Remove one to add another.`);
        return;
      }
      setSelected(prev => [...prev, pid]);
    }
  };

  /* add hamper to cart as individual cart items */
  const handleAddToCart = () => {
    if (!box || selected.length === 0) return;

    selected.forEach(pid => {
      const product = ELIGIBLE_PRODUCTS.find(x => x.id === pid);
      if (!product) return;
      const weightLabel = box.weightPerSlot;
      const weightObj   = product.weights.find(w => w.label === weightLabel)
                          || { label: weightLabel, multiplier: box.multiplierPerSlot };
      addToCart(product, weightLabel, 1);
    });

    showToast(`🎁 Gift Box added to cart! (${selected.length} items)`);
    if (giftNote.trim()) {
      showToast(`Gift note: "${giftNote.trim().slice(0, 60)}…"`, 'info');
    }
    onClose();
  };

  /* Step label helper */
  const stepLabel = ['', 'Choose Box Size', 'Select Dry Fruits', 'Gift Note & Confirm'];

  return (
    <div className="fixed inset-0 bg-black/70 z-[150] flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl my-4 shadow-2xl border border-amber-200 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 text-white"
             style={{ background: 'linear-gradient(135deg,#0F291E,#1a3d2b)' }}>
          <div className="flex items-center gap-3">
            <Gift className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-black">Build Your Gift Box</h2>
              <p className="text-[10px] text-emerald-300">Step {step} of 3 · {stepLabel[step]}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white p-1 rounded-lg transition">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        <div className="p-6">

          {/* ── STEP 1: Choose box size ── */}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Select your gift box:</p>
              {BOX_SIZES.map(b => (
                <label key={b.id}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all
                    ${boxSize === b.id ? 'border-emerald-700 bg-emerald-50/60' : 'border-gray-200 hover:border-amber-300 bg-white'}`}>
                  <input type="radio" name="boxSize" value={b.id}
                    checked={boxSize === b.id}
                    onChange={() => setBoxSize(b.id)}
                    className="sr-only" />
                  <span className="text-3xl shrink-0">{b.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-black text-gray-900">{b.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {b.slots} varieties · {b.weightPerSlot} each · Packaging: Rs. {b.price.toLocaleString('en-PK')}
                    </p>
                  </div>
                  {boxSize === b.id && <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />}
                </label>
              ))}
            </div>
          )}

          {/* ── STEP 2: Pick dry fruits ── */}
          {step === 2 && box && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Pick exactly {box.slots} dry fruits ({selected.length}/{box.slots} selected):
                </p>
                {selected.length > 0 && (
                  <button onClick={() => setSelected([])} className="text-xs text-rose-500 hover:underline">Clear all</button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
                {ELIGIBLE_PRODUCTS.map(p => {
                  const isChosen = selected.includes(p.id);
                  const price    = Math.round(p.pricePerKg * box.multiplierPerSlot);
                  return (
                    <button key={p.id} onClick={() => toggle(p.id)}
                      className={`relative flex flex-col items-center p-3 rounded-2xl border-2 transition-all text-left
                        ${isChosen ? 'border-emerald-700 bg-emerald-50/80 shadow-md' : 'border-gray-200 hover:border-amber-300 bg-white'}`}>
                      <img src={p.image} alt={p.name} loading="lazy"
                        onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = p.fallbackImage || ''; }}
                        className="w-14 h-14 rounded-xl object-cover mb-2 border border-gray-100" />
                      <p className="text-[11px] font-bold text-gray-900 text-center leading-tight line-clamp-2">{p.name}</p>
                      <p className="text-[10px] text-emerald-700 font-black mt-1">Rs. {price.toLocaleString('en-PK')}</p>
                      {isChosen && (
                        <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-black">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {selected.length > 0 && (
                <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-[10px] font-bold text-amber-800 mb-1">Selected items:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.map(pid => {
                      const p = ELIGIBLE_PRODUCTS.find(x => x.id === pid);
                      return p ? (
                        <span key={pid} className="text-[10px] bg-white border border-amber-300 text-amber-900 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                          {p.name.split(' ').slice(0, 2).join(' ')}
                          <button onClick={() => toggle(pid)} className="text-rose-400 hover:text-rose-600 ml-0.5">×</button>
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3: Gift note + confirm ── */}
          {step === 3 && box && (
            <div className="space-y-5">
              {/* Summary */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">Order Summary</p>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{box.emoji}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{box.label}</p>
                    <p className="text-xs text-gray-500">{selected.length} varieties · {box.weightPerSlot} each</p>
                  </div>
                </div>
                <div className="space-y-1.5 border-t border-gray-200 pt-3">
                  {selected.map(pid => {
                    const p = ELIGIBLE_PRODUCTS.find(x => x.id === pid);
                    if (!p) return null;
                    const price = Math.round(p.pricePerKg * box.multiplierPerSlot);
                    return (
                      <div key={pid} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img src={p.image} alt={p.name} className="w-6 h-6 rounded object-cover" />
                          <span className="text-gray-700">{p.name.split('(')[0].trim()} · {box.weightPerSlot}</span>
                        </div>
                        <span className="font-bold text-gray-900">Rs. {price.toLocaleString('en-PK')}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between text-xs pt-1 border-t border-gray-200">
                    <span className="text-gray-500">Gift packaging</span>
                    <span className="font-bold text-gray-700">Rs. {box.price.toLocaleString('en-PK')}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm pt-1 border-t border-gray-300">
                    <span>Estimated Total</span>
                    <span className="text-emerald-800">Rs. {totalPrice.toLocaleString('en-PK')}</span>
                  </div>
                </div>
              </div>

              {/* Recipient name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Recipient Name (optional)</label>
                <input type="text" value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  placeholder="e.g. For Uncle Tariq"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800/30" />
              </div>

              {/* Gift note */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Personal Gift Note (optional)</label>
                <textarea rows={3} value={giftNote}
                  onChange={e => setGiftNote(e.target.value)}
                  placeholder="e.g. Eid Mubarak! Wishing you health and happiness. — From Ahmed Family"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800/30 resize-none" />
                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Your note will be shared with Hafiz Sumair on WhatsApp after order placement.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer navigation */}
        <div className="px-6 pb-6 flex items-center gap-3">
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition">
              ← Back
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => {
                if (step === 1 && !boxSize) { showToast('Please select a box size first.'); return; }
                if (step === 2 && selected.length === 0) { showToast('Please select at least one dry fruit.'); return; }
                setStep(s => s + 1);
              }}
              className="flex-1 py-3 rounded-xl text-xs font-bold text-white transition hover:opacity-90 active:scale-95"
              style={{ background: '#0F291E' }}>
              Next →
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={selected.length === 0}
              className="flex-1 py-3 rounded-xl text-xs font-bold text-white transition hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: '#1f4d35' }}>
              <ShoppingCart className="w-4 h-4" />
              Add Gift Box to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
