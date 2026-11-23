import React from 'react';
import { Printer, MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { STORE_INFO } from '../data/products';

export const OrderSuccessModal = () => {
  const { lastOrder, setLastOrder } = useCart();

  if (!lastOrder) return null;

  const handleSendWhatsApp = () => {
    let text = `Hello Hafiz Sumair (Nayyab Dry Fruit)! 🌟\n`;
    text += `My order has been placed on the website:\n\n`;
    text += `🔖 *ORDER TRACKING ID:* ${lastOrder.orderId}\n`;
    text += `📅 *Date:* ${lastOrder.date}\n`;
    text += `---------------------------\n`;
    text += `📦 *ITEMS:*\n`;

    lastOrder.items.forEach((item, index) => {
      text += `${index + 1}. *${item.name}* (${item.weightLabel})\n   Qty: ${item.quantity} x Rs. ${item.unitPrice.toLocaleString('en-PK')} = *Rs. ${(item.unitPrice * item.quantity).toLocaleString('en-PK')}*\n`;
    });

    text += `---------------------------\n`;
    text += `💵 *Subtotal:* Rs. ${lastOrder.subtotal.toLocaleString('en-PK')}\n`;
    text += `🚚 *Delivery:* ${lastOrder.deliveryFee === 0 ? 'FREE' : `Rs. ${lastOrder.deliveryFee.toLocaleString('en-PK')}`}\n`;
    if (lastOrder.discount > 0) {
      text += `🏷️ *Discount:* - Rs. ${lastOrder.discount.toLocaleString('en-PK')}\n`;
    }
    text += `💰 *TOTAL AMOUNT:* Rs. ${lastOrder.total.toLocaleString('en-PK')}\n\n`;

    text += `👤 *CUSTOMER DETAILS:*\n`;
    text += `• Name: ${lastOrder.name}\n`;
    text += `• Phone: ${lastOrder.phone}\n`;
    text += `• City: ${lastOrder.city}\n`;
    text += `• Address: ${lastOrder.address}\n`;
    if (lastOrder.notes) {
      text += `• Special Instructions: ${lastOrder.notes}\n`;
    }
    text += `• Payment: ${lastOrder.paymentMethod}\n\n`;
    text += `Please confirm my order and share the courier dispatch tracking details. Thank you! ✨`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${STORE_INFO.whatsappRaw}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div 
        id="printable-receipt"
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-amber-200 p-8 text-center relative my-auto animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner">
          🎉
        </div>

        <span className="bg-emerald-100 text-emerald-900 text-xs font-extrabold px-3 py-1 rounded-full">
          Congratulations! Order Placed
        </span>
        <h3 className="font-serif text-2xl font-black text-gray-900 mt-2 mb-1">
          Thank you, {lastOrder.name}!
        </h3>
        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          Your order has been received successfully. Hafiz Sumair's team will contact you shortly to confirm courier dispatch.
        </p>

        {/* Invoice Summary Box */}
        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/80 text-left text-xs space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-500">Order Tracking ID:</span>
            <strong className="text-emerald-950 font-mono text-sm">{lastOrder.orderId}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Customer Phone:</span>
            <span className="font-bold text-gray-900">{lastOrder.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery City:</span>
            <span className="font-bold text-gray-900">{lastOrder.city}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Store Support:</span>
            <span className="font-bold text-emerald-900">{STORE_INFO.proprietor} ({STORE_INFO.phone})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Estimated Dispatch:</span>
            <span className="font-bold text-emerald-800">Within 24 Hours 🚚</span>
          </div>
          <div className="flex justify-between border-t border-amber-200/60 pt-2">
            <span className="text-gray-500">Total Payable:</span>
            <span className="font-extrabold text-sm text-emerald-950">Rs. {lastOrder.total.toLocaleString('en-PK')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleSendWhatsApp}
            className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send Invoice to Hafiz Sumair on WhatsApp</span>
          </button>

          <button
            onClick={() => window.print()}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={() => setLastOrder(null)}
            className="w-full py-2.5 bg-emerald-900 text-white rounded-xl font-bold text-xs hover:bg-emerald-950 transition flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

      </div>
    </div>
  );
};
