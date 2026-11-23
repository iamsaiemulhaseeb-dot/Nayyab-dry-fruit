/**
 * BulkOrderModal.jsx
 * Wholesale / Bulk Order inquiry modal.
 * Sends inquiry to Hafiz Sumair's WhatsApp AND saves to backend.
 */
import React, { useState } from 'react';
import { X as XIcon, Package, Send, CheckCircle2, AlertCircle, RefreshCw, Phone } from 'lucide-react';
import { STORE_INFO } from '../data/products';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DRY_FRUIT_OPTIONS = [
  'Cashews (Kaju)', 'Pistachios (Pista)', 'Pine Nuts (Chalgoza)',
  'Almonds (Badam Giri)', 'Walnuts (Akhrot Magaz)', 'Figs (Injeer)',
  'Apricots (Khobani)', 'Ajwa Dates', 'Raisins (Kishmish)',
  'Lotus Seeds (Makhana)', 'Sidr Honey', 'Mixed Dry Fruits',
];

export const BulkOrderModal = ({ onClose }) => {
  const [form, setForm] = useState({
    name:         '',
    phone:        '',
    city:         '',
    shopName:     '',
    eventName:    '',
    items:        [],   // selected dry fruits
    quantityKg:   '',
    notes:        '',
  });
  const [submitting, setSubmitting]   = useState(false);
  const [submitted,  setSubmitted]    = useState(false);
  const [error,      setError]        = useState('');

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setError('');
  };

  const toggleItem = (item) => {
    setForm(f => ({
      ...f,
      items: f.items.includes(item) ? f.items.filter(x => x !== item) : [...f.items, item],
    }));
  };

  const validate = () => {
    if (!form.name.trim())    return 'Please enter your name.';
    if (!form.phone.trim())   return 'Please enter your phone number.';
    if (!form.city.trim())    return 'Please enter your city.';
    if (form.items.length === 0) return 'Please select at least one product.';
    if (!form.quantityKg)     return 'Please enter the required quantity in KG.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setSubmitting(true);
    setError('');

    // 1. Save to backend
    try {
      await fetch(`${API}/bulk-inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          createdAt: new Date().toISOString(),
        }),
      });
    } catch { /* backend offline — still send WA */ }

    // 2. Build WhatsApp message
    const itemsList = form.items.join(', ');
    let msg = `*WHOLESALE / BULK INQUIRY — Nayyab Dry Fruit* 🥜\n\n`;
    msg += `👤 *Name:* ${form.name}\n`;
    msg += `📞 *Phone:* ${form.phone}\n`;
    msg += `📍 *City:* ${form.city}\n`;
    if (form.shopName) msg += `🏪 *Shop/Business:* ${form.shopName}\n`;
    if (form.eventName) msg += `🎉 *Event:* ${form.eventName}\n`;
    msg += `\n📦 *Required Products:* ${itemsList}\n`;
    msg += `⚖️ *Total Quantity:* ${form.quantityKg} KG\n`;
    if (form.notes) msg += `\n📝 *Additional Notes:* ${form.notes}\n`;
    msg += `\nPlease share your best wholesale rates. JazakAllah! ✨`;

    window.open(
      `https://wa.me/${STORE_INFO.whatsappRaw}?text=${encodeURIComponent(msg)}`,
      '_blank', 'noopener,noreferrer'
    );

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[150] flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl my-4 shadow-2xl border border-amber-200 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4"
             style={{ background: 'linear-gradient(135deg,#0F291E,#1a3d2b)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-xl">🏪</div>
            <div>
              <h2 className="text-sm font-black text-white">Wholesale / Bulk Order</h2>
              <p className="text-[10px] text-emerald-300">Best rates for shops, restaurants & events</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white p-1 rounded-lg transition">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            /* Success state */
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-black text-gray-900 text-lg mb-2">Inquiry Sent!</h3>
              <p className="text-xs text-gray-500 mb-1">Your WhatsApp app has opened with your inquiry pre-filled.</p>
              <p className="text-xs text-gray-500 mb-6">Hafiz Sumair will respond with wholesale rates shortly. JazakAllah!</p>
              <div className="flex gap-3">
                <a href={`tel:${STORE_INFO.phone}`}
                  className="flex-1 py-3 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 flex items-center justify-center gap-1.5 transition hover:bg-amber-200">
                  <Phone className="w-4 h-4" /> Call Now
                </a>
                <button onClick={onClose}
                  className="flex-1 py-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition hover:opacity-90"
                  style={{ background: '#0F291E' }}>
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Name *</label>
                  <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="e.g. Ahmed Khan"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/30" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone / WhatsApp *</label>
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/30" />
                </div>
              </div>

              {/* City + Shop name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City *</label>
                  <input type="text" value={form.city} onChange={e => set('city', e.target.value)}
                    placeholder="Lahore / Karachi…"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/30" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Shop / Business Name</label>
                  <input type="text" value={form.shopName} onChange={e => set('shopName', e.target.value)}
                    placeholder="e.g. Ahmed Dry Fruits"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/30" />
                </div>
              </div>

              {/* Event name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Event Name (if for wedding/event)</label>
                <input type="text" value={form.eventName} onChange={e => set('eventName', e.target.value)}
                  placeholder="e.g. Wedding ceremony — 300 guests"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/30" />
              </div>

              {/* Product selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Required Dry Fruits * <span className="text-gray-400 font-normal">({form.items.length} selected)</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {DRY_FRUIT_OPTIONS.map(item => (
                    <button key={item} type="button" onClick={() => toggleItem(item)}
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition-all
                        ${form.items.includes(item) ? 'text-white border-transparent' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-amber-300'}`}
                      style={form.items.includes(item) ? { background: '#0F291E' } : {}}>
                      {form.items.includes(item) ? '✓ ' : ''}{item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Total Quantity Required (KG) *</label>
                <div className="relative">
                  <input type="number" min="1" value={form.quantityKg} onChange={e => set('quantityKg', e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/30 pr-12" />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-gray-400">KG</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Additional Notes (Optional)</label>
                <textarea rows={2} value={form.notes} onChange={e => set('notes', e.target.value)}
                  placeholder="Delivery preference, specific variety, packaging requirements…"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/30 resize-none" />
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <p className="text-xs font-semibold text-rose-700">{error}</p>
                </div>
              )}

              <button type="submit" disabled={submitting}
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-white transition hover:opacity-90 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
                style={{ background: '#25D366' }}>
                {submitting
                  ? <><RefreshCw className="w-4 h-4 animate-spin" />Sending…</>
                  : <><Send className="w-4 h-4" />Send Inquiry via WhatsApp</>
                }
              </button>

              <p className="text-[10px] text-gray-400 text-center">
                Your WhatsApp will open with the inquiry pre-filled. {STORE_INFO.proprietor} will respond with best rates.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
