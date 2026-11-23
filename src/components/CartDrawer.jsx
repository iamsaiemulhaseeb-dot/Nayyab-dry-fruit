import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ArrowRight, MessageCircle, Tag, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { STORE_INFO } from '../data/products';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    getSubtotal,
    getDeliveryFee,
    getDiscount,
    getTotal,
    coupon,
    applyCouponCode,
    removeCoupon,
    setIsCheckoutOpen,
    generateWhatsAppLink
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const subtotal = getSubtotal();
  const delivery = getDeliveryFee();
  const discount = getDiscount();
  const total = getTotal();
  const deliveryThreshold = 5000;
  const remainingForFreeDelivery = Math.max(0, deliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / deliveryThreshold) * 100));

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCouponCode(couponInput);
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleInstantWhatsApp = () => {
    const waLink = generateWhatsAppLink({
      name: 'Valued Customer',
      phone: 'N/A',
      city: 'Pakistan',
      address: 'Express WhatsApp Checkout',
      paymentMethod: 'Cash on Delivery / Direct WhatsApp Order'
    });
    window.open(waLink, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity animate-in fade-in"
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-amber-200 bg-amber-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🛒</span>
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-lg">Your Shopping Cart</h3>
              <p className="text-xs text-amber-800">Selected Premium Harvest</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-9 h-9 rounded-full bg-white border border-amber-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-amber-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Tracker */}
        <div className="px-5 py-3 bg-amber-100/60 border-b border-amber-200/60 text-xs">
          <div className="flex items-center justify-between text-amber-950 font-medium mb-1.5">
            <span className="flex items-center gap-1.5 font-bold">
              <Truck className="w-4 h-4 text-emerald-800" />
              {remainingForFreeDelivery === 0 ? (
                <span className="text-emerald-800 font-extrabold">Congratulations! You unlocked FREE Delivery!</span>
              ) : (
                <span>Add <strong>Rs. {remainingForFreeDelivery.toLocaleString('en-PK')}</strong> more for <strong>FREE Delivery</strong></span>
              )}
            </span>
            <span className="font-mono font-bold text-amber-900">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-amber-200/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-700 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                🧺
              </div>
              <h4 className="font-bold text-gray-800 text-base mb-1">Your Cart is Empty</h4>
              <p className="text-gray-500 text-xs max-w-xs mx-auto mb-6">
                Explore our fresh harvest collection and add your favorite dry fruits to your cart!
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-2.5 bg-emerald-800 text-white rounded-xl font-bold text-xs hover:bg-emerald-900 transition shadow-md"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            cart.map(item => {
              const lineTotal = item.unitPrice * item.quantity;
              return (
                <div
                  key={item.key}
                  className="flex items-center gap-3 p-3.5 bg-amber-50/50 rounded-2xl border border-amber-100 hover:border-amber-200 transition-all duration-200 shadow-2xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.src = item.fallbackImage || '/dry fruit plater.jpg';
                    }}
                    className="w-16 h-16 object-cover rounded-xl border border-amber-200 shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{item.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-amber-800 font-medium mt-0.5">
                      <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
                        {item.weightLabel}
                      </span>
                      <span>Rs. {item.unitPrice.toLocaleString('en-PK')}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.key, -1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-amber-100 hover:text-amber-900 transition font-bold"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.key, 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-amber-100 hover:text-amber-900 transition font-bold"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Total & Remove */}
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-emerald-800 text-sm">
                          Rs. {lineTotal.toLocaleString('en-PK')}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.key)}
                          className="text-gray-400 hover:text-rose-600 transition p-1"
                          title="Remove Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-amber-200 bg-amber-50/50 space-y-3.5">
            
            {/* Coupon Code Section */}
            {coupon ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs">
                <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Coupon applied: <strong>{coupon.code}</strong></span>
                </span>
                <button
                  onClick={removeCoupon}
                  className="text-rose-600 hover:underline font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Promo code (e.g. NAYYAB10)"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-amber-200 uppercase bg-white focus:outline-hidden focus:ring-1 focus:ring-emerald-800"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-xs rounded-xl transition"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-amber-200/60">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-gray-900">Rs. {subtotal.toLocaleString('en-PK')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Delivery Charges:</span>
                <span className="font-bold text-gray-900">
                  {delivery === 0 ? (
                    <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full text-xs">
                      FREE Delivery
                    </span>
                  ) : (
                    `Rs. ${delivery.toLocaleString('en-PK')}`
                  )}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Coupon Discount:</span>
                  <span>- Rs. {discount.toLocaleString('en-PK')}</span>
                </div>
              )}

              <div className="flex justify-between text-base font-extrabold text-emerald-950 pt-2 border-t border-amber-200">
                <span>Total Amount:</span>
                <span>Rs. {total.toLocaleString('en-PK')}</span>
              </div>
            </div>

            {/* Checkout Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-950/20 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleInstantWhatsApp}
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-2xl font-extrabold text-xs shadow-md active:scale-95 transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Order ({STORE_INFO.proprietor})</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </>
  );
};
