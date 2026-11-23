// Nayyab Dry Fruit - Cart & Order State Management

class CartManager {
  constructor() {
    this.storageKey = 'nayyab_cart_v1';
    this.couponKey = 'nayyab_coupon';
    this.cart = this.loadCart();
    this.coupon = this.loadCoupon();
    this.deliveryThreshold = 5000;
    this.standardDelivery = 250;
    this.whatsappNumber = '923234382687'; // Hafiz Sumair - Nayyab Dry Fruit
  }

  loadCart() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse cart data', e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
      this.updateBadges();
      this.renderDrawer();
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }

  loadCoupon() {
    try {
      const saved = localStorage.getItem(this.couponKey);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  saveCoupon(coupon) {
    this.coupon = coupon;
    if (coupon) {
      localStorage.setItem(this.couponKey, JSON.stringify(coupon));
    } else {
      localStorage.removeItem(this.couponKey);
    }
    this.renderDrawer();
  }

  // Create unique key for item + weight combination
  getItemKey(productId, weightLabel) {
    return `${productId}___${weightLabel}`;
  }

  addItem(productId, weightLabel, quantity = 1) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const weightObj = product.weights.find(w => w.label === weightLabel) || product.weights[0];
    const key = this.getItemKey(productId, weightObj.label);
    const unitPrice = Math.round(product.pricePerKg * weightObj.multiplier);

    const existingIndex = this.cart.findIndex(item => item.key === key);

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        key,
        productId,
        name: product.name,
        urduName: product.urduName,
        weightLabel: weightObj.label,
        multiplier: weightObj.multiplier,
        pricePerKg: product.pricePerKg,
        unitPrice,
        image: product.image,
        quantity
      });
    }

    this.saveCart();
    this.playAudioFeedback();
    this.showToast(`✅ "${product.name} (${weightObj.label})" cart mein shamil hogaya!`);
  }

  updateQuantity(key, delta) {
    const item = this.cart.find(i => i.key === key);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(key);
    } else {
      this.saveCart();
    }
  }

  removeItem(key) {
    const item = this.cart.find(i => i.key === key);
    this.cart = this.cart.filter(i => i.key !== key);
    this.saveCart();
    if (item) {
      this.showToast(`🗑️ "${item.name}" cart se hata diya gaya.`);
    }
  }

  clearCart() {
    this.cart = [];
    this.saveCoupon(null);
    this.saveCart();
  }

  getCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal() {
    return this.cart.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  }

  getDeliveryFee() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= this.deliveryThreshold ? 0 : this.standardDelivery;
  }

  getDiscount() {
    const subtotal = this.getSubtotal();
    if (!this.coupon || subtotal === 0) return 0;
    if (this.coupon.type === 'percentage') {
      return Math.round((subtotal * this.coupon.value) / 100);
    }
    return Math.min(this.coupon.value, subtotal);
  }

  getTotal() {
    const subtotal = this.getSubtotal();
    if (subtotal === 0) return 0;
    const delivery = this.getDeliveryFee();
    const discount = this.getDiscount();
    return Math.max(0, subtotal + delivery - discount);
  }

  applyCouponCode(code) {
    const clean = code.trim().toUpperCase();
    const subtotal = this.getSubtotal();

    if (subtotal === 0) {
      return { success: false, message: 'Cart khali hai, pehle koi cheez add karein!' };
    }

    if (clean === 'NAYYAB10') {
      this.saveCoupon({ code: clean, type: 'percentage', value: 10, label: '10% Nayyab Special Discount' });
      return { success: true, message: '🎉 Mubarak! 10% Special Discount lag gaya hai!' };
    } else if (clean === 'FREESHIP') {
      this.saveCoupon({ code: clean, type: 'shipping', value: 250, label: 'Free Delivery Voucher' });
      return { success: true, message: '🚚 Free Delivery Voucher apply hogaya!' };
    } else if (clean === 'WELCOME5') {
      this.saveCoupon({ code: clean, type: 'percentage', value: 5, label: '5% Welcome Offer' });
      return { success: true, message: '🌟 5% Welcome discount lag gaya!' };
    } else {
      return { success: false, message: '❌ Invalid coupon code. Try NAYYAB10 for 10% off.' };
    }
  }

  removeCoupon() {
    this.saveCoupon(null);
    this.showToast('Coupon code remove kar diya gaya.');
  }

  // Update floating count badge in navbar
  updateBadges() {
    const count = this.getCount();
    const badges = document.querySelectorAll('.cart-badge-count');
    badges.forEach(badge => {
      badge.textContent = count;
      if (count > 0) {
        badge.classList.remove('hidden');
        badge.classList.add('inline-flex');
      } else {
        badge.classList.add('hidden');
        badge.classList.remove('inline-flex');
      }
    });

    const subtotalElements = document.querySelectorAll('.cart-nav-subtotal');
    subtotalElements.forEach(el => {
      el.textContent = `Rs. ${this.getSubtotal().toLocaleString('en-PK')}`;
    });
  }

  // Render the slide-out cart drawer
  renderDrawer() {
    const container = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty-state');
    const footer = document.getElementById('cart-drawer-footer');
    if (!container || !emptyState || !footer) return;

    if (this.cart.length === 0) {
      container.innerHTML = '';
      emptyState.classList.remove('hidden');
      footer.classList.add('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    footer.classList.remove('hidden');

    container.innerHTML = this.cart.map(item => {
      const lineTotal = item.unitPrice * item.quantity;
      return `
        <div class="flex items-center gap-3 p-3.5 bg-amber-50/50 rounded-2xl border border-amber-100 hover:border-amber-200 transition-all duration-200">
          <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl border border-amber-200 shadow-sm shrink-0" onerror="this.src='https://images.unsplash.com/photo-1596797882948-4cb984534f3c?auto=format&fit=crop&w=200&q=80'" />
          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-gray-900 text-sm truncate">${item.name}</h4>
            <div class="flex items-center gap-2 text-xs text-amber-800 font-medium mt-0.5">
              <span class="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-semibold">${item.weightLabel}</span>
              <span>Rs. ${item.unitPrice.toLocaleString('en-PK')}</span>
            </div>
            
            <div class="flex items-center justify-between mt-2">
              <!-- Quantity Controls -->
              <div class="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-xs">
                <button onclick="cartManager.updateQuantity('${item.key}', -1)" class="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-amber-100 hover:text-amber-900 transition font-bold" aria-label="Decrease quantity">−</button>
                <span class="w-8 text-center text-xs font-bold text-gray-900">${item.quantity}</span>
                <button onclick="cartManager.updateQuantity('${item.key}', 1)" class="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-amber-100 hover:text-amber-900 transition font-bold" aria-label="Increase quantity">+</button>
              </div>

              <!-- Line Total & Delete -->
              <div class="flex items-center gap-3">
                <span class="font-bold text-emerald-800 text-sm">Rs. ${lineTotal.toLocaleString('en-PK')}</span>
                <button onclick="cartManager.removeItem('${item.key}')" class="text-gray-400 hover:text-rose-600 transition p-1" title="Remove Item">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Summary calculations
    const subtotal = this.getSubtotal();
    const delivery = this.getDeliveryFee();
    const discount = this.getDiscount();
    const total = this.getTotal();

    document.getElementById('cart-subtotal').textContent = `Rs. ${subtotal.toLocaleString('en-PK')}`;

    const deliveryEl = document.getElementById('cart-delivery');
    if (delivery === 0) {
      deliveryEl.innerHTML = '<span class="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full text-xs">FREE Delivery</span>';
    } else {
      deliveryEl.textContent = `Rs. ${delivery.toLocaleString('en-PK')}`;
    }

    const discountRow = document.getElementById('cart-discount-row');
    if (discount > 0 && discountRow) {
      discountRow.classList.remove('hidden');
      document.getElementById('cart-discount').textContent = `- Rs. ${discount.toLocaleString('en-PK')}`;
    } else if (discountRow) {
      discountRow.classList.add('hidden');
    }

    document.getElementById('cart-total').textContent = `Rs. ${total.toLocaleString('en-PK')}`;

    // Free delivery progress bar
    const freeDeliveryBanner = document.getElementById('free-delivery-progress-banner');
    if (freeDeliveryBanner) {
      const remaining = this.deliveryThreshold - subtotal;
      const percent = Math.min(100, Math.round((subtotal / this.deliveryThreshold) * 100));
      const progressBar = document.getElementById('free-delivery-bar');
      const progressText = document.getElementById('free-delivery-text');

      if (progressBar) progressBar.style.width = `${percent}%`;
      if (progressText) {
        if (remaining <= 0) {
          progressText.innerHTML = `🎉 <strong>Mubarak!</strong> Aapko Free Delivery mil chuki hai!`;
        } else {
          progressText.innerHTML = `🚚 Aur <strong>Rs. ${remaining.toLocaleString('en-PK')}</strong> ki shopping karein aur <strong>Free Delivery</strong> payein!`;
        }
      }
    }
  }

  // Synthesize pleasant gentle audio chime
  playAudioFeedback() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880.00, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch {
      // Audio might be blocked by browser policy without prior interaction
    }
  }

  // Toast notification
  showToast(message) {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto bg-gray-900/95 backdrop-blur-md text-white text-sm font-medium px-4 py-3 rounded-xl shadow-2xl border border-amber-500/40 transform transition-all duration-300 translate-y-4 opacity-0 flex items-center justify-between gap-3';
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <span>${message}</span>
      </div>
      <button class="text-gray-400 hover:text-white" onclick="this.parentElement.remove()">✕</button>
    `;

    toastContainer.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
    });

    // Auto dismiss
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  // Generate WhatsApp Order Link
  generateWhatsAppLink(orderDetails) {
    const { name, phone, city, address, notes, paymentMethod } = orderDetails;

    let text = `Salam Hafiz Sumair Bhai (Nayyab Dry Fruit)! 🌟\n`;
    text += `Mujhe website se yeh order place karna hai:\n\n`;
    text += `📦 *ORDER DETAILS:*\n`;
    text += `---------------------------\n`;

    this.cart.forEach((item, index) => {
      const line = `${index + 1}. *${item.name}* (${item.weightLabel})\n   Qty: ${item.quantity} x Rs. ${item.unitPrice.toLocaleString('en-PK')} = *Rs. ${(item.unitPrice * item.quantity).toLocaleString('en-PK')}*\n`;
      text += line;
    });

    const subtotal = this.getSubtotal();
    const delivery = this.getDeliveryFee();
    const discount = this.getDiscount();
    const total = this.getTotal();

    text += `---------------------------\n`;
    text += `💵 *Subtotal:* Rs. ${subtotal.toLocaleString('en-PK')}\n`;
    text += `🚚 *Delivery:* ${delivery === 0 ? 'FREE (مفت)' : `Rs. ${delivery.toLocaleString('en-PK')}`}\n`;
    if (discount > 0) {
      text += `🏷️ *Discount (${this.coupon?.code || 'Promo'}):* - Rs. ${discount.toLocaleString('en-PK')}\n`;
    }
    text += `💰 *TOTAL AMOUNT:* Rs. ${total.toLocaleString('en-PK')}\n\n`;

    text += `👤 *CUSTOMER DETAILS:*\n`;
    text += `• Name: ${name}\n`;
    text += `• Mobile: ${phone}\n`;
    text += `• City: ${city}\n`;
    text += `• Delivery Address: ${address}\n`;
    if (notes && notes.trim()) {
      text += `• Special Notes: ${notes.trim()}\n`;
    }
    text += `• Payment: ${paymentMethod || 'Cash on Delivery (COD)'}\n\n`;
    text += `Barah-e-karam mera order confirm karein aur tracking details share karein. Shukriya! ✨`;

    const encoded = encodeURIComponent(text);
    return `https://wa.me/${this.whatsappNumber}?text=${encoded}`;
  }
}

const cartManager = new CartManager();
window.cartManager = cartManager;

