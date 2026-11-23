import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, Phone, User, FileText, CheckCircle2, MessageCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { STORE_INFO } from '../data/products';
import { placeOrder } from '../services/api';

// Build a pre-filled WhatsApp notification link for a successfully placed order.
// Recipient is the store owner (Hafiz Sumair) so the shop is alerted instantly.
const buildOrderWhatsAppMessage = (order) => {
  const unitPriceOf = (item) => Number(item.unitPrice || item.price || 0);

  let text = `Hello Hafiz Sumair (Nayyab Dry Fruit)! 🌟\n`;
  text += `A new order has just been placed on your website.\n\n`;
  text += `🔖 *Order ID:* ${order.orderId}\n`;
  text += `---------------------------\n`;
  text += `📦 *Ordered Items:*\n`;
  order.items.forEach((item, index) => {
    const price = unitPriceOf(item);
    const qty = Number(item.quantity || 1);
    text += `${index + 1}. *${item.name}* (${item.weightLabel})\n   Qty: ${qty} x Rs. ${price.toLocaleString('en-PK')} = *Rs. ${(price * qty).toLocaleString('en-PK')}*\n`;
  });
  text += `---------------------------\n`;
  text += `💰 *Total Price:* Rs. ${Number(order.total || 0).toLocaleString('en-PK')}\n`;
  text += `• Payment: ${order.paymentMethod || 'Cash on Delivery (COD)'}\n\n`;
  text += `👤 *Customer Details:*\n`;
  text += `• Name: ${order.name || 'N/A'}\n`;
  text += `• Phone: ${order.phone || 'N/A'}\n`;
  text += `• Address: ${order.city ? order.city + ' — ' : ''}${order.address || 'N/A'}\n`;
  if (order.notes && order.notes.trim()) {
    text += `• Notes: ${order.notes.trim()}\n`;
  }
  text += `\nPlease confirm this order and arrange courier dispatch. Thank you! ✨`;

  return `https://wa.me/${STORE_INFO.whatsappRaw}?text=${encodeURIComponent(text)}`;
};

export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    getSubtotal,
    getDeliveryFee,
    getDiscount,
    getTotal,
    clearCart,
    setLastOrder,
    generateWhatsAppLink,
    showToast
  } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
    paymentMethod: 'Cash on Delivery (COD)'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Payment proof (JazzCash/EasyPaisa screenshot) */
  const [paymentProof,        setPaymentProof]        = useState(null);   // base64 data-URL
  const [paymentProofName,    setPaymentProofName]    = useState('');
  const [paymentProofPreview, setPaymentProofPreview] = useState('');

  const handleProofFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('Screenshot must be under 5 MB.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPaymentProof(ev.target.result);
      setPaymentProofPreview(ev.target.result);
      setPaymentProofName(file.name);
    };
    reader.readAsDataURL(file);
  };

  if (!isCheckoutOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.city.trim() || !formData.address.trim()) {
      showToast('Please fill in all required shipping fields!');
      return;
    }

    setIsSubmitting(true);

    const orderId = 'NYB-' + Math.floor(100000 + Math.random() * 900000);
    const formattedCartItems = cart.map(item => {
      const itemPrice = Number(item.unitPrice || item.price || 0);
      const qty = Number(item.quantity || 1);
      return {
        id: item.productId || item.id,
        productId: item.productId || item.id,
        name: item.name,
        subtitle: item.subtitle || '',
        weightLabel: item.weightLabel,
        multiplier: item.multiplier,
        price: itemPrice,
        unitPrice: itemPrice,
        quantity: qty,
        itemTotal: itemPrice * qty,
        image: item.image || ''
      };
    });

    const orderDetails = {
      orderId,
      ...formData,
      items: formattedCartItems,
      subtotal: getSubtotal(),
      deliveryFee: getDeliveryFee(),
      discount: getDiscount(),
      total: getTotal(),
      paymentProof: paymentProof || '',           // base64 screenshot
      paymentProofName: paymentProofName || '',
      date: new Date().toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Save to Backend JSON API (http://localhost:5000/api/orders)
    let backendSaved = false;
    try {
      const res = await placeOrder(orderDetails);
      if (res && res.success) {
        backendSaved = true;
        showToast(`Order #${orderDetails.orderId} saved to database!`);
      } else if (res && res.error) {
        showToast(`Backend note: ${res.error}`, 'error');
      }
    } catch (err) {
      console.warn('Backend order recording skipped/offline:', err);
    }

    // Automatically open a pre-filled WhatsApp chat to notify the store owner
    // once the order has been successfully saved to the backend.
    if (backendSaved) {
      window.open(buildOrderWhatsAppMessage(orderDetails), '_blank', 'noopener,noreferrer');
    }

    setIsSubmitting(false);
    setLastOrder(orderDetails);
    setIsCheckoutOpen(false);
    clearCart();
  };

  const handleWhatsAppDirect = () => {
    const waLink = generateWhatsAppLink(formData);
    window.open(waLink, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-amber-200 p-6 sm:p-8 relative my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={() => setIsCheckoutOpen(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secure Doorstep Checkout • {STORE_INFO.proprietor}
          </span>
          <h3 className="font-serif text-2xl font-black text-gray-900 mt-1">Delivery & Shipping Details</h3>
          <p className="text-xs text-gray-500">Please provide your address for Cash on Delivery across Pakistan.</p>
        </div>

        {/* Order Summary Box */}
        <div className="mb-6 bg-amber-50/70 p-4 rounded-2xl border border-amber-200/70">
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">Order Items:</h4>
          <div className="space-y-1.5 max-h-36 overflow-y-auto mb-3 pr-1">
            {cart.map(item => (
              <div key={item.key} className="flex items-center justify-between py-1.5 border-b border-amber-200/50 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{item.quantity}x</span>
                  <span className="text-gray-800 font-medium">{item.name} ({item.weightLabel})</span>
                </div>
                <span className="font-bold text-emerald-950">
                  Rs. {(item.unitPrice * item.quantity).toLocaleString('en-PK')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-amber-200/80 flex items-baseline justify-between">
            <span className="text-xs font-semibold text-gray-600">Total Payable upon Delivery:</span>
            <span className="text-xl font-extrabold text-emerald-950">
              Rs. {getTotal().toLocaleString('en-PK')}
            </span>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-700" />
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Tariq Mehmood"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-800 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-700" />
                Mobile / WhatsApp Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. 0323 1234567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Lahore / Karachi / Islamabad"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-800 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              Complete Delivery Address *
            </label>
            <textarea
              required
              rows="2"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="House/Street #, Sector, Colony, Landmark..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              Special Delivery Instructions (Optional)
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Deliver between 2 PM to 5 PM / Please call before arriving"
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-800 focus:outline-hidden"
            />
          </div>

          {/* Payment Method Radio */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-gray-700 mb-2">Payment Option:</label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 p-3 rounded-xl border border-emerald-800 bg-emerald-50/50 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery (COD)"
                  checked={formData.paymentMethod === 'Cash on Delivery (COD)'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="text-emerald-800 focus:ring-emerald-800"
                />
                <div>
                  <span className="block text-xs font-bold text-emerald-950">Cash on Delivery</span>
                  <span className="text-[10px] text-gray-500">Pay cash upon parcel delivery</span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="JazzCash / EasyPaisa / Bank"
                  checked={formData.paymentMethod === 'JazzCash / EasyPaisa / Bank'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="text-emerald-800 focus:ring-emerald-800"
                />
                <div>
                  <span className="block text-xs font-bold text-gray-900">JazzCash / EasyPaisa</span>
                  <span className="text-[10px] text-gray-500">Bank Transfer confirmation</span>
                </div>
              </label>
            </div>

            {/* JazzCash / EasyPaisa details + proof upload */}
            {formData.paymentMethod === 'JazzCash / EasyPaisa / Bank' && (
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
                <div>
                  <p className="text-xs font-black text-blue-900 mb-2 flex items-center gap-1.5">
                    <span>📱</span> Send payment to Hafiz Sumair:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white rounded-xl p-2.5 border border-blue-200">
                      <p className="text-[10px] text-gray-400 font-semibold">JazzCash</p>
                      <p className="font-black text-gray-900 tracking-wide">{STORE_INFO.phone}</p>
                      <p className="text-[10px] text-gray-500">{STORE_INFO.proprietor}</p>
                    </div>
                    <div className="bg-white rounded-xl p-2.5 border border-blue-200">
                      <p className="text-[10px] text-gray-400 font-semibold">EasyPaisa / Meezan</p>
                      <p className="font-black text-gray-900 tracking-wide">{STORE_INFO.phone}</p>
                      <p className="text-[10px] text-gray-500">{STORE_INFO.proprietor}</p>
                    </div>
                  </div>
                </div>

                {/* Screenshot upload */}
                <div>
                  <p className="text-xs font-bold text-blue-900 mb-1.5 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Upload Payment Screenshot
                    <span className="text-blue-500 font-normal">(recommended)</span>
                  </p>

                  {paymentProofPreview ? (
                    <div className="flex items-center gap-3 bg-white border border-blue-200 rounded-xl p-2.5">
                      <img src={paymentProofPreview} alt="Payment proof"
                        className="w-14 h-14 rounded-lg object-cover border border-blue-200 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-green-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Screenshot uploaded
                        </p>
                        <p className="text-[10px] text-gray-500 truncate">{paymentProofName}</p>
                        <button type="button"
                          onClick={() => { setPaymentProof(null); setPaymentProofPreview(''); setPaymentProofName(''); }}
                          className="text-[10px] text-rose-500 hover:underline mt-0.5">
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-16 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 cursor-pointer bg-white hover:bg-blue-50/30 transition">
                      <ImageIcon className="w-5 h-5 text-blue-400 mb-1" />
                      <span className="text-[10px] font-semibold text-blue-600">Tap to upload JazzCash/EasyPaisa screenshot</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleProofFile} />
                    </label>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-emerald-900 hover:bg-emerald-950 disabled:bg-emerald-950/70 text-white rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isSubmitting ? 'Recording Order...' : 'Confirm Order Now'}</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppDirect}
              className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-2xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order Directly via WhatsApp ({STORE_INFO.phone})</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
