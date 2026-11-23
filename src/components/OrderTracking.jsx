/**
 * OrderTracking.jsx
 * Live order tracking page — customer enters Order ID + Phone to see
 * a visual progress bar fetched from the backend.
 */
import React, { useState } from 'react';
import { Search, Package, CheckCircle2, Truck, Home, Clock, AlertCircle, ArrowLeft, Phone, MapPin, RefreshCw } from 'lucide-react';
import { STORE_INFO } from '../data/products';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/* ── Status pipeline in display order ── */
const PIPELINE = [
  { id: 'pending',   icon: Clock,         label: 'Order Received',    desc: 'Your order has been received and is awaiting confirmation.'   },
  { id: 'confirmed', icon: CheckCircle2,  label: 'Order Confirmed',   desc: 'Confirmed! Hafiz Sumair is preparing your fresh dry fruits.'  },
  { id: 'processing',icon: Package,       label: 'Being Packed',      desc: 'Your order is being carefully packed and quality-checked.'    },
  { id: 'shipped',   icon: Truck,         label: 'Dispatched',        desc: 'Your parcel has been handed over to the courier service.'     },
  { id: 'delivered', icon: Home,          label: 'Delivered',         desc: 'Delivered! Enjoy your premium Nayyab dry fruits. 🥜'          },
];

const STATUS_COLORS = {
  pending:    'bg-amber-500',
  confirmed:  'bg-blue-500',
  processing: 'bg-purple-500',
  shipped:    'bg-orange-500',
  delivered:  'bg-emerald-500',
  cancelled:  'bg-rose-500',
};

export const OrderTracking = ({ onBack }) => {
  const [orderId,  setOrderId]  = useState('');
  const [phone,    setPhone]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [order,    setOrder]    = useState(null);
  const [error,    setError]    = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setOrder(null);

    const id = orderId.trim().toUpperCase();
    const ph = phone.trim();

    if (!id)  { setError('Please enter your Order ID (e.g. NYB-356968).'); return; }
    if (!ph)  { setError('Please enter the phone number used at checkout.'); return; }

    setLoading(true);
    try {
      const res  = await fetch(`${API}/orders/${id}`);
      const data = await res.json();

      if (!data.success || !data.data) {
        setError('Order not found. Please check your Order ID and try again.');
        return;
      }

      const o   = data.data;
      const c   = o.customer || o;
      // Verify phone — strip non-digits for loose match
      const normalize = (p) => (p || '').replace(/\D/g, '').slice(-10);
      if (normalize(c.phone) !== normalize(ph)) {
        setError('Phone number does not match. Please use the number you provided at checkout.');
        return;
      }

      setOrder(o);
    } catch {
      setError('Could not connect to the server. Please try again later or call ' + STORE_INFO.phone);
    } finally {
      setLoading(false);
    }
  };

  /* Which pipeline step is active/done */
  const getStepState = (stepId, currentStatus) => {
    if (currentStatus === 'cancelled') return 'cancelled';
    const pipelineIds  = PIPELINE.map(p => p.id);
    const currentIdx   = pipelineIds.indexOf(currentStatus);
    const stepIdx      = pipelineIds.indexOf(stepId);
    if (stepIdx < currentIdx)  return 'done';
    if (stepIdx === currentIdx) return 'active';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7]">

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 text-white px-4 py-4 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button onClick={onBack}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-black text-lg tracking-tight">Track Your Order</h1>
            <p className="text-xs text-emerald-300">🥜 Nayyab Dry Fruit — {STORE_INFO.phone}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Search Form */}
        <div className="bg-white rounded-3xl border border-amber-200 shadow-md p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl">📦</div>
            <div>
              <h2 className="font-black text-gray-900">Order Tracking</h2>
              <p className="text-xs text-gray-500">Enter your Order ID and phone number to track live status</p>
            </div>
          </div>

          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Order ID <span className="text-gray-400 font-normal">(e.g. NYB-356968)</span>
              </label>
              <input
                type="text"
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                placeholder="NYB-XXXXXX"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-emerald-800/30 tracking-widest"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Mobile Number <span className="text-gray-400 font-normal">(used at checkout)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="03XX-XXXXXXX"
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800/30"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-rose-50 border border-rose-200 rounded-2xl p-3">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-rose-700">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white transition hover:opacity-90 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
              style={{ background: '#0F291E' }}>
              {loading
                ? <><RefreshCw className="w-4 h-4 animate-spin" />Tracking…</>
                : <><Search className="w-4 h-4" />Track My Order</>
              }
            </button>
          </form>
        </div>

        {/* Result */}
        {order && (() => {
          const c       = order.customer || order;
          const status  = (order.status || 'pending').toLowerCase();
          const isCancelled = status === 'cancelled';
          const activeIdx   = PIPELINE.findIndex(p => p.id === status);

          return (
            <div className="space-y-4">
              {/* Order summary card */}
              <div className="bg-white rounded-3xl border border-amber-200 shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Order ID</p>
                    <p className="text-xl font-black font-mono text-emerald-900">{order.orderId}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-PK', { weekday:'long', day:'2-digit', month:'long', year:'numeric' })}
                    </p>
                  </div>
                  <span className={`text-xs font-black px-3 py-1.5 rounded-full text-white ${STATUS_COLORS[status] || 'bg-gray-400'}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-gray-400 font-semibold mb-0.5">Customer</p>
                    <p className="font-bold text-gray-900">{c.name}</p>
                    <p className="text-emerald-700 font-semibold">{c.phone}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-gray-400 font-semibold mb-0.5">Delivery Address</p>
                    <p className="font-bold text-gray-900">{c.city}</p>
                    <p className="text-gray-600 text-[10px] leading-tight">{c.address}</p>
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">{(order.items||[]).length} item(s)</p>
                    <p className="text-xs text-gray-700">{(order.items||[]).map(i=>i.name.split('(')[0].trim()).join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="font-black text-emerald-900 text-sm">Rs. {Number(order.total||0).toLocaleString('en-PK')}</p>
                  </div>
                </div>
              </div>

              {/* Progress tracker */}
              {!isCancelled ? (
                <div className="bg-white rounded-3xl border border-amber-200 shadow-md p-6">
                  <h3 className="font-black text-gray-900 mb-6">Delivery Progress</h3>
                  <div className="relative">
                    {/* Connecting line */}
                    <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200 z-0" />
                    <div
                      className="absolute left-5 top-5 w-0.5 bg-emerald-500 z-0 transition-all duration-700"
                      style={{ height: activeIdx >= 0 ? `${(activeIdx / (PIPELINE.length - 1)) * 100}%` : '0%' }}
                    />

                    <div className="space-y-6 relative z-10">
                      {PIPELINE.map((step, idx) => {
                        const state = getStepState(step.id, status);
                        const Icon  = step.icon;
                        return (
                          <div key={step.id} className="flex items-start gap-4">
                            {/* Circle */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 ${
                              state === 'done'   ? 'bg-emerald-500 text-white' :
                              state === 'active' ? 'bg-emerald-700 text-white ring-4 ring-emerald-200' :
                              'bg-white border-2 border-gray-200 text-gray-400'
                            }`}>
                              {state === 'done'
                                ? <CheckCircle2 className="w-5 h-5 fill-white text-white" />
                                : <Icon className="w-5 h-5" />
                              }
                            </div>

                            {/* Text */}
                            <div className={`pt-2 ${state === 'upcoming' ? 'opacity-40' : ''}`}>
                              <p className={`text-sm font-black ${state === 'active' ? 'text-emerald-900' : 'text-gray-800'}`}>
                                {step.label}
                                {state === 'active' && (
                                  <span className="ml-2 text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Current</span>
                                )}
                              </p>
                              {(state === 'done' || state === 'active') && (
                                <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-50 rounded-3xl border border-rose-200 p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="w-6 h-6 text-rose-600" />
                  </div>
                  <p className="font-black text-rose-800">Order Cancelled</p>
                  <p className="text-xs text-rose-600 mt-1">This order has been cancelled. Contact us if you have any questions.</p>
                </div>
              )}

              {/* Contact card */}
              <div className="bg-emerald-900 rounded-3xl p-5 text-white">
                <p className="text-xs text-emerald-300 mb-1">Need Help?</p>
                <p className="font-black text-sm mb-3">Contact Hafiz Sumair directly</p>
                <div className="flex gap-3">
                  <a href={`tel:${STORE_INFO.phone}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition">
                    <Phone className="w-4 h-4" /> Call
                  </a>
                  <a href={`https://wa.me/${STORE_INFO.whatsappRaw}?text=Assalam-o-Alaikum! My Order ID is *${order.orderId}*. I need help.`}
                    target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#25D366]/80 hover:bg-[#25D366] rounded-xl text-xs font-bold transition">
                    <span>💬</span> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Info for new users */}
        {!order && !loading && (
          <div className="bg-white rounded-3xl border border-amber-100 p-5 text-center shadow-sm">
            <p className="text-xs text-gray-400">Your Order ID was sent to your WhatsApp after placement.<br/>
            It looks like <span className="font-bold text-emerald-800">NYB-XXXXXX</span></p>
            <div className="mt-3 flex justify-center">
              <a href={`https://wa.me/${STORE_INFO.whatsappRaw}`} target="_blank" rel="noreferrer"
                className="text-xs font-bold text-[#25D366] hover:underline flex items-center gap-1">
                💬 Ask on WhatsApp — {STORE_INFO.phone}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
