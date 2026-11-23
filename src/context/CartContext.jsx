import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS_DATA, STORE_INFO } from '../data/products';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Load initial cart and wishlist from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('nayyab_react_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('nayyab_react_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('nayyab_react_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modal & Drawer visibility states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);

  // Selected weights map for dynamic pricing: { [productId]: '250g' | '500g' | '1 kg' }
  const [selectedWeights, setSelectedWeights] = useState(() => {
    const map = {};
    PRODUCTS_DATA.forEach(p => {
      map[p.id] = p.weights[p.weights.length - 1].label; // default to 1 kg
    });
    return map;
  });

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nayyab_react_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('nayyab_react_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      if (coupon) {
        localStorage.setItem('nayyab_react_coupon', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('nayyab_react_coupon');
      }
    } catch (e) {
      console.error(e);
    }
  }, [coupon]);

  // Audio tactile chime
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880.00, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Audio context might be restricted
    }
  };

  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const setProductWeight = (productId, weightLabel) => {
    setSelectedWeights(prev => ({
      ...prev,
      [productId]: weightLabel
    }));
  };

  const addToCart = (product, weightLabel, quantity = 1) => {
    const weightObj = product.weights.find(w => w.label === weightLabel) || product.weights[0];
    const key = `${product.id}___${weightObj.label}`;
    const unitPrice = Math.round(product.pricePerKg * weightObj.multiplier);

    setCart(prev => {
      const existing = prev.find(item => item.key === key);
      if (existing) {
        return prev.map(item =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          subtitle: product.subtitle,
          weightLabel: weightObj.label,
          multiplier: weightObj.multiplier,
          pricePerKg: product.pricePerKg,
          unitPrice,
          image: product.image,
          fallbackImage: product.fallbackImage,
          quantity
        }
      ];
    });

    playChime();
    showToast(`"${product.name} (${weightObj.label})" added to cart!`);
  };

  const updateQuantity = (key, delta) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.key === key) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = key => {
    const item = cart.find(i => i.key === key);
    setCart(prev => prev.filter(i => i.key !== key));
    if (item) {
      showToast(`"${item.name}" removed from cart.`);
    }
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const toggleWishlist = productId => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast('Item removed from your wishlist.');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Item added to your wishlist!');
        return [...prev, productId];
      }
    });
  };

  const applyCouponCode = code => {
    const clean = code.trim().toUpperCase();
    const subtotal = getSubtotal();

    if (subtotal === 0) {
      showToast('Cart is currently empty. Please add items first!');
      return false;
    }

    if (clean === 'NAYYAB10') {
      setCoupon({ code: clean, type: 'percentage', value: 10, label: '10% Nayyab Special Discount' });
      showToast('Coupon applied: 10% discount added to your bill!');
      return true;
    } else if (clean === 'FREESHIP') {
      setCoupon({ code: clean, type: 'shipping', value: 250, label: 'Free Delivery Voucher' });
      showToast('Coupon applied: Free Delivery voucher activated!');
      return true;
    } else if (clean === 'WELCOME5') {
      setCoupon({ code: clean, type: 'percentage', value: 5, label: '5% Welcome Offer' });
      showToast('Coupon applied: 5% welcome discount added!');
      return true;
    } else {
      showToast('Invalid coupon code. Try NAYYAB10 for 10% off.');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    showToast('Coupon code removed.');
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  };

  const getDeliveryFee = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    if (coupon?.type === 'shipping') return 0;
    return subtotal >= 5000 ? 0 : 250;
  };

  const getDiscount = () => {
    const subtotal = getSubtotal();
    if (!coupon || subtotal === 0) return 0;
    if (coupon.type === 'percentage') {
      return Math.round((subtotal * coupon.value) / 100);
    }
    return Math.min(coupon.value, subtotal);
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    const delivery = getDeliveryFee();
    const discount = getDiscount();
    return Math.max(0, subtotal + delivery - discount);
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // WhatsApp Order Link Generator in English
  const generateWhatsAppLink = orderDetails => {
    const { name, phone, city, address, notes, paymentMethod } = orderDetails;

    let text = `Hello Hafiz Sumair (Nayyab Dry Fruit)! 🌟\n`;
    text += `I would like to place an order from your website:\n\n`;
    text += `📦 *ORDER DETAILS:*\n`;
    text += `---------------------------\n`;

    cart.forEach((item, index) => {
      text += `${index + 1}. *${item.name}* (${item.weightLabel})\n   Qty: ${item.quantity} x Rs. ${item.unitPrice.toLocaleString('en-PK')} = *Rs. ${(item.unitPrice * item.quantity).toLocaleString('en-PK')}*\n`;
    });

    const subtotal = getSubtotal();
    const delivery = getDeliveryFee();
    const discount = getDiscount();
    const total = getTotal();

    text += `---------------------------\n`;
    text += `💵 *Subtotal:* Rs. ${subtotal.toLocaleString('en-PK')}\n`;
    text += `🚚 *Delivery:* ${delivery === 0 ? 'FREE' : `Rs. ${delivery.toLocaleString('en-PK')}`}\n`;
    if (discount > 0) {
      text += `🏷️ *Discount (${coupon?.code || 'Promo'}):* - Rs. ${discount.toLocaleString('en-PK')}\n`;
    }
    text += `💰 *TOTAL AMOUNT:* Rs. ${total.toLocaleString('en-PK')}\n\n`;

    text += `👤 *CUSTOMER DETAILS:*\n`;
    text += `• Name: ${name || 'Valued Customer'}\n`;
    text += `• Phone: ${phone || 'N/A'}\n`;
    text += `• City: ${city || 'Pakistan'}\n`;
    text += `• Shipping Address: ${address || 'As confirmed on chat'}\n`;
    if (notes && notes.trim()) {
      text += `• Special Instructions: ${notes.trim()}\n`;
    }
    text += `• Payment Method: ${paymentMethod || 'Cash on Delivery (COD)'}\n\n`;
    text += `Please confirm my order and share the courier dispatch tracking details. Thank you! ✨`;

    const encoded = encodeURIComponent(text);
    return `https://wa.me/${STORE_INFO.whatsappRaw}?text=${encoded}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        coupon,
        selectedWeights,
        activeCategory,
        searchQuery,
        sortBy,
        isCartOpen,
        isCheckoutOpen,
        quickViewProduct,
        lastOrder,
        toasts,
        setIsCartOpen,
        setIsCheckoutOpen,
        setQuickViewProduct,
        setLastOrder,
        setActiveCategory,
        setSearchQuery,
        setSortBy,
        setProductWeight,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        applyCouponCode,
        removeCoupon,
        getSubtotal,
        getDeliveryFee,
        getDiscount,
        getTotal,
        getCartCount,
        generateWhatsAppLink,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
