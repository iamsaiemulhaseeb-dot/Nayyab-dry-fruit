// Nayyab Dry Fruit - Main Application Logic & Interactivity

document.addEventListener('DOMContentLoaded', () => {
  // Global App State
  const state = {
    activeCategory: 'all',
    searchQuery: '',
    sortBy: 'featured',
    selectedWeights: {}, // Map productId -> selected weight label
    wishlist: JSON.parse(localStorage.getItem('nayyab_wishlist') || '[]'),
    activeProductModal: null
  };

  // Initialize selected weights for each product to default (1 kg or first)
  PRODUCTS_DATA.forEach(p => {
    state.selectedWeights[p.id] = p.weights[p.weights.length - 1].label; // default to 1 kg
  });

  // DOM Elements
  const productsGrid = document.getElementById('products-grid');
  const productsCountEl = document.getElementById('products-count');
  const searchInput = document.getElementById('search-input');
  const categoryFilters = document.querySelectorAll('.category-filter-btn');
  const sortSelect = document.getElementById('sort-select');
  
  // Cart Drawer Elements
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const openCartBtns = document.querySelectorAll('.open-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const applyCouponBtn = document.getElementById('apply-coupon-btn');
  const couponInput = document.getElementById('coupon-input');

  // Checkout Modal Elements
  const checkoutModal = document.getElementById('checkout-modal');
  const closeCheckoutBtn = document.getElementById('close-checkout-btn');
  const openCheckoutBtn = document.getElementById('open-checkout-btn');
  const checkoutForm = document.getElementById('checkout-form');
  const whatsappDirectBtn = document.getElementById('whatsapp-direct-checkout');

  // Quick View Modal
  const quickViewModal = document.getElementById('quick-view-modal');
  const closeQuickViewBtn = document.getElementById('close-quick-view-btn');

  // Order Success Modal
  const successModal = document.getElementById('order-success-modal');
  const closeSuccessBtn = document.getElementById('close-success-btn');

  // Floating Back to Top & WhatsApp
  const backToTopBtn = document.getElementById('back-to-top');

  // ----------------------------------------------------
  // Product Rendering
  // ----------------------------------------------------
  function filterAndSortProducts() {
    let list = [...PRODUCTS_DATA];

    // Category filter
    if (state.activeCategory !== 'all') {
      list = list.filter(p => p.category === state.activeCategory);
    }

    // Search query
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.urduName.includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (state.sortBy === 'price-low') {
      list.sort((a, b) => a.pricePerKg - b.pricePerKg);
    } else if (state.sortBy === 'price-high') {
      list.sort((a, b) => b.pricePerKg - a.pricePerKg);
    } else if (state.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }

  function renderProducts() {
    if (!productsGrid) return;

    const list = filterAndSortProducts();
    if (productsCountEl) {
      productsCountEl.textContent = `${list.length} Products Found`;
    }

    if (list.length === 0) {
      productsGrid.innerHTML = `
        <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-amber-200 p-8 shadow-xs">
          <div class="w-20 h-20 mx-auto mb-4 bg-amber-50 rounded-full flex items-center justify-center text-4xl">
            🥜
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">Koi dry fruit nahi mila!</h3>
          <p class="text-gray-500 max-w-md mx-auto text-sm">Aapki talash ke mutabiq koi product dastiyaab nahi hai. Barah-e-karam search term badlein ya filters reset karein.</p>
          <button onclick="window.resetFilters()" class="mt-5 px-6 py-2.5 bg-emerald-800 text-white rounded-xl font-medium hover:bg-emerald-900 transition shadow-md">
            Saray Products Dekhein
          </button>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = list.map(product => {
      const isWishlisted = state.wishlist.includes(product.id);
      const activeWeight = state.selectedWeights[product.id] || product.weights[0].label;
      const weightObj = product.weights.find(w => w.label === activeWeight) || product.weights[0];
      const activePrice = Math.round(product.pricePerKg * weightObj.multiplier);
      const originalPrice = Math.round(product.originalPricePerKg * weightObj.multiplier);
      const discountPercent = Math.round(((product.originalPricePerKg - product.pricePerKg) / product.originalPricePerKg) * 100);

      return `
        <div class="group bg-white rounded-3xl overflow-hidden border border-amber-100/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-1.5 relative" id="card-${product.id}">
          
          <!-- Product Badge & Wishlist -->
          <div class="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
            <span class="${product.badgeColor} text-white text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              ✨ ${product.badge}
            </span>
            ${discountPercent > 0 ? `
              <span class="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                SAVE ${discountPercent}%
              </span>
            ` : ''}
          </div>

          <button onclick="window.toggleWishlist('${product.id}')" class="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-gray-400 hover:text-rose-500 hover:scale-110 transition duration-200" title="Wishlist">
            <svg class="w-5 h-5 ${isWishlisted ? 'text-rose-500 fill-rose-500' : 'fill-none stroke-currentColor'}" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </button>

          <!-- Product Image Container -->
          <div class="relative w-full aspect-4/3 overflow-hidden bg-amber-50 cursor-pointer" onclick="window.openQuickView('${product.id}')">
            <img 
              src="${product.image}" 
              alt="${product.name}" 
              loading="lazy"
              class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              onerror="this.src='${product.fallbackImage}'"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
              <span class="bg-white/95 backdrop-blur-sm text-emerald-950 font-bold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 hover:bg-emerald-900 hover:text-white transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                Quick View تفاصیل
              </span>
            </div>
            
            <!-- Origin tag -->
            <div class="absolute bottom-2 left-3 bg-black/60 backdrop-blur-md text-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-md">
              📍 ${product.origin.split(',')[0]}
            </div>
          </div>

          <!-- Product Details Body -->
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <!-- Ratings & Urdu Subtitle -->
              <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <span>★</span>
                  <span>${product.rating}</span>
                  <span class="text-gray-400 font-normal">(${product.reviewsCount})</span>
                </div>
                <span class="text-xs font-nastaliq text-emerald-900 font-bold" dir="rtl">${product.urduName}</span>
              </div>

              <!-- Product Title -->
              <h3 class="font-serif font-bold text-gray-900 text-lg leading-snug group-hover:text-emerald-800 transition line-clamp-1 mb-1">
                ${product.name}
              </h3>

              <p class="text-gray-500 text-xs line-clamp-2 mb-3">
                ${product.description}
              </p>

              <!-- Weight Selector Chips (250g, 500g, 1kg) -->
              <div class="mb-4">
                <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                  <span>Select Weight (وزن منتخب کریں):</span>
                  <span class="text-emerald-700 font-semibold" id="weight-label-${product.id}">${weightObj.label}</span>
                </label>
                <div class="grid grid-cols-3 gap-1.5 p-1 bg-amber-50/70 rounded-xl border border-amber-200/60">
                  ${product.weights.map(w => {
                    const isSelected = w.label === activeWeight;
                    return `
                      <button 
                        type="button"
                        onclick="window.setProductWeight('${product.id}', '${w.label}')"
                        class="py-1.5 px-2 text-xs font-bold rounded-lg transition-all text-center ${
                          isSelected 
                            ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-800/20' 
                            : 'text-gray-700 hover:bg-white/80'
                        }"
                      >
                        ${w.label}
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>

            <!-- Price & Actions Section -->
            <div class="pt-3 border-t border-amber-100">
              <div class="flex items-baseline justify-between mb-3">
                <div>
                  <span class="text-2xl font-extrabold text-emerald-950 font-sans tracking-tight" id="price-display-${product.id}">
                    Rs. ${activePrice.toLocaleString('en-PK')}
                  </span>
                  <span class="text-xs text-gray-400 line-through ml-1.5" id="orig-price-display-${product.id}">
                    Rs. ${originalPrice.toLocaleString('en-PK')}
                  </span>
                </div>
                <span class="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  In Stock Fresh
                </span>
              </div>

              <!-- Button Pair: Add to Cart & Buy Now -->
              <div class="grid grid-cols-2 gap-2">
                <button 
                  onclick="window.handleAddToCart('${product.id}')"
                  class="w-full py-2.5 px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                  <span>Add to Cart</span>
                </button>

                <button 
                  onclick="window.handleBuyNow('${product.id}')"
                  class="w-full py-2.5 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-emerald-900/10"
                >
                  <span>⚡ Buy Now</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      `;
    }).join('');
  }

  // ----------------------------------------------------
  // Interactive Helper Functions (attached to window)
  // ----------------------------------------------------
  window.setProductWeight = (productId, weightLabel) => {
    state.selectedWeights[productId] = weightLabel;
    
    // Update active UI on card without re-rendering whole list for smooth performance
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const weightObj = product.weights.find(w => w.label === weightLabel) || product.weights[0];
    const newPrice = Math.round(product.pricePerKg * weightObj.multiplier);
    const newOrigPrice = Math.round(product.originalPricePerKg * weightObj.multiplier);

    const priceEl = document.getElementById(`price-display-${productId}`);
    const origPriceEl = document.getElementById(`orig-price-display-${productId}`);
    const labelEl = document.getElementById(`weight-label-${productId}`);

    if (priceEl) priceEl.textContent = `Rs. ${newPrice.toLocaleString('en-PK')}`;
    if (origPriceEl) origPriceEl.textContent = `Rs. ${newOrigPrice.toLocaleString('en-PK')}`;
    if (labelEl) labelEl.textContent = weightLabel;

    // Refresh active button styles on that card
    const card = document.getElementById(`card-${productId}`);
    if (card) {
      const buttons = card.querySelectorAll('button[type="button"]');
      buttons.forEach(btn => {
        if (btn.textContent.trim() === weightLabel) {
          btn.className = 'py-1.5 px-2 text-xs font-bold rounded-lg transition-all text-center bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-800/20';
        } else {
          btn.className = 'py-1.5 px-2 text-xs font-bold rounded-lg transition-all text-center text-gray-700 hover:bg-white/80';
        }
      });
    }
  };

  window.handleAddToCart = (productId) => {
    const weightLabel = state.selectedWeights[productId];
    cartManager.addItem(productId, weightLabel, 1);
  };

  window.handleBuyNow = (productId) => {
    const weightLabel = state.selectedWeights[productId];
    cartManager.addItem(productId, weightLabel, 1);
    openCartDrawer();
  };

  window.toggleWishlist = (productId) => {
    const idx = state.wishlist.indexOf(productId);
    if (idx > -1) {
      state.wishlist.splice(idx, 1);
      cartManager.showToast('Product wishlist se hata diya gaya.');
    } else {
      state.wishlist.push(productId);
      cartManager.showToast('❤️ Product wishlist mein shamil kar liya gaya!');
    }
    localStorage.setItem('nayyab_wishlist', JSON.stringify(state.wishlist));
    renderProducts();
    updateWishlistBadge();
  };

  function updateWishlistBadge() {
    const badges = document.querySelectorAll('.wishlist-count-badge');
    badges.forEach(b => {
      b.textContent = state.wishlist.length;
      if (state.wishlist.length > 0) {
        b.classList.remove('hidden');
      } else {
        b.classList.add('hidden');
      }
    });
  }

  window.resetFilters = () => {
    state.activeCategory = 'all';
    state.searchQuery = '';
    state.sortBy = 'featured';
    if (searchInput) searchInput.value = '';
    categoryFilters.forEach(btn => {
      if (btn.dataset.category === 'all') {
        btn.classList.add('bg-emerald-800', 'text-white', 'shadow-md');
        btn.classList.remove('bg-white', 'text-gray-700');
      } else {
        btn.classList.remove('bg-emerald-800', 'text-white', 'shadow-md');
        btn.classList.add('bg-white', 'text-gray-700');
      }
    });
    renderProducts();
  };

  // ----------------------------------------------------
  // Quick View Modal
  // ----------------------------------------------------
  window.openQuickView = (productId) => {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product || !quickViewModal) return;

    state.activeProductModal = product;
    const modalContent = document.getElementById('quick-view-content');
    if (!modalContent) return;

    const activeWeight = state.selectedWeights[product.id] || product.weights[0].label;
    const weightObj = product.weights.find(w => w.label === activeWeight) || product.weights[0];
    const price = Math.round(product.pricePerKg * weightObj.multiplier);

    modalContent.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <!-- Image & Gallery -->
        <div class="rounded-3xl overflow-hidden bg-amber-50 relative aspect-4/3 border border-amber-200">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover" onerror="this.src='${product.fallbackImage}'" />
          <span class="absolute top-4 left-4 ${product.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            ${product.badge}
          </span>
          <span class="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-amber-200 text-xs px-3 py-1 rounded-lg">
            Origin: ${product.origin}
          </span>
        </div>

        <!-- Info -->
        <div class="flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-amber-600 font-bold mb-1">
              <span>★ ${product.rating} (${product.reviewsCount} verified customer reviews)</span>
              <span class="text-sm font-nastaliq text-emerald-900 font-bold">${product.urduName}</span>
            </div>
            
            <h2 class="text-2xl font-serif font-extrabold text-gray-900 mb-2">${product.name}</h2>
            <p class="text-gray-600 text-sm leading-relaxed mb-4">${product.description}</p>

            <!-- Health Benefits -->
            <div class="mb-5 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
              <h4 class="font-bold text-emerald-950 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                🌿 Tibbi Fawaid (Health Benefits):
              </h4>
              <ul class="text-xs text-emerald-900 space-y-1.5">
                ${product.benefits.map(b => `<li class="flex items-start gap-2"><span>✔</span><span>${b}</span></li>`).join('')}
              </ul>
            </div>

            <!-- Packaging Details -->
            <div class="text-xs text-gray-500 mb-5 flex items-center gap-2">
              <span class="font-semibold text-gray-700">📦 Packaging:</span>
              <span>${product.packaging}</span>
            </div>
          </div>

          <!-- Dynamic Pricing & Add To Cart in Modal -->
          <div class="pt-4 border-t border-amber-100">
            <div class="flex items-center justify-between mb-4">
              <div>
                <span class="text-xs text-gray-500 block">Total Price:</span>
                <span class="text-3xl font-extrabold text-emerald-950" id="modal-price">
                  Rs. ${price.toLocaleString('en-PK')}
                </span>
              </div>

              <!-- Modal Weight Selector -->
              <div class="flex items-center gap-1 bg-amber-50 p-1 rounded-xl border border-amber-200">
                ${product.weights.map(w => `
                  <button 
                    type="button"
                    onclick="window.setModalWeight('${product.id}', '${w.label}')"
                    class="px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                      w.label === activeWeight ? 'bg-emerald-800 text-white' : 'text-gray-700 hover:bg-white'
                    }"
                    id="modal-weight-btn-${w.label}"
                  >
                    ${w.label}
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <button 
                onclick="cartManager.addItem('${product.id}', state.selectedWeights['${product.id}']); window.closeQuickView();"
                class="w-full py-3 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition"
              >
                🛒 Add to Cart
              </button>
              <button 
                onclick="cartManager.addItem('${product.id}', state.selectedWeights['${product.id}']); window.closeQuickView(); openCartDrawer();"
                class="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
              >
                ⚡ Checkout Now
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    quickViewModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  };

  window.setModalWeight = (productId, weightLabel) => {
    window.setProductWeight(productId, weightLabel);
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;
    const weightObj = product.weights.find(w => w.label === weightLabel) || product.weights[0];
    const newPrice = Math.round(product.pricePerKg * weightObj.multiplier);
    
    const priceEl = document.getElementById('modal-price');
    if (priceEl) priceEl.textContent = `Rs. ${newPrice.toLocaleString('en-PK')}`;

    product.weights.forEach(w => {
      const btn = document.getElementById(`modal-weight-btn-${w.label}`);
      if (btn) {
        if (w.label === weightLabel) {
          btn.className = 'px-3 py-1.5 text-xs font-bold rounded-lg transition bg-emerald-800 text-white';
        } else {
          btn.className = 'px-3 py-1.5 text-xs font-bold rounded-lg transition text-gray-700 hover:bg-white';
        }
      }
    });
  };

  window.closeQuickView = () => {
    if (quickViewModal) {
      quickViewModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  };

  if (closeQuickViewBtn) {
    closeQuickViewBtn.addEventListener('click', window.closeQuickView);
  }

  // ----------------------------------------------------
  // Cart Drawer Controls
  // ----------------------------------------------------
  function openCartDrawer() {
    if (!cartDrawer || !cartOverlay) return;
    cartManager.renderDrawer();
    cartOverlay.classList.remove('hidden');
    cartDrawer.classList.remove('translate-x-full');
    document.body.classList.add('overflow-hidden');
  }

  function closeCartDrawer() {
    if (!cartDrawer || !cartOverlay) return;
    cartDrawer.classList.add('translate-x-full');
    setTimeout(() => {
      cartOverlay.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }, 300);
  }

  openCartBtns.forEach(btn => btn.addEventListener('click', openCartDrawer));
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

  // Apply Coupon
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      const val = couponInput.value.trim();
      if (!val) {
        cartManager.showToast('Barah-e-karam coupon code darj karein!');
        return;
      }
      const res = cartManager.applyCouponCode(val);
      cartManager.showToast(res.message);
      if (res.success) {
        couponInput.value = '';
      }
    });
  }

  // ----------------------------------------------------
  // Checkout Modal & Direct WhatsApp
  // ----------------------------------------------------
  function openCheckout() {
    if (cartManager.getCount() === 0) {
      cartManager.showToast('Aapka cart khali hai! Pehle kuch add karein.');
      return;
    }
    closeCartDrawer();
    if (checkoutModal) {
      checkoutModal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
      renderCheckoutSummary();
    }
  }

  function closeCheckout() {
    if (checkoutModal) {
      checkoutModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  }

  function renderCheckoutSummary() {
    const listEl = document.getElementById('checkout-items-list');
    const totalEl = document.getElementById('checkout-summary-total');
    const subtotalEl = document.getElementById('checkout-summary-subtotal');
    const deliveryEl = document.getElementById('checkout-summary-delivery');

    if (!listEl) return;

    listEl.innerHTML = cartManager.cart.map(item => `
      <div class="flex items-center justify-between py-2 border-b border-gray-100 text-xs">
        <div class="flex items-center gap-2">
          <span class="font-bold text-gray-900">${item.quantity}x</span>
          <span class="text-gray-700">${item.name} (${item.weightLabel})</span>
        </div>
        <span class="font-semibold text-emerald-950">Rs. ${(item.unitPrice * item.quantity).toLocaleString('en-PK')}</span>
      </div>
    `).join('');

    if (subtotalEl) subtotalEl.textContent = `Rs. ${cartManager.getSubtotal().toLocaleString('en-PK')}`;
    if (deliveryEl) deliveryEl.textContent = cartManager.getDeliveryFee() === 0 ? 'FREE' : `Rs. ${cartManager.getDeliveryFee()}`;
    if (totalEl) totalEl.textContent = `Rs. ${cartManager.getTotal().toLocaleString('en-PK')}`;
  }

  if (openCheckoutBtn) openCheckoutBtn.addEventListener('click', openCheckout);
  if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckout);

  // Direct WhatsApp from cart or checkout modal
  if (whatsappDirectBtn) {
    whatsappDirectBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('checkout-name');
      const phoneInput = document.getElementById('checkout-phone');
      const cityInput = document.getElementById('checkout-city');
      const addressInput = document.getElementById('checkout-address');

      const customerDetails = {
        name: nameInput?.value || 'Valued Customer',
        phone: phoneInput?.value || 'N/A',
        city: cityInput?.value || 'Pakistan',
        address: addressInput?.value || 'As confirmed on chat',
        paymentMethod: 'Cash on Delivery / Direct WhatsApp Order'
      };

      const waLink = cartManager.generateWhatsAppLink(customerDetails);
      window.open(waLink, '_blank');
    });
  }

  // Handle Checkout Form Submission (COD)
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('checkout-name').value.trim();
      const phone = document.getElementById('checkout-phone').value.trim();
      const city = document.getElementById('checkout-city').value.trim();
      const address = document.getElementById('checkout-address').value.trim();
      const notes = document.getElementById('checkout-notes')?.value.trim() || '';
      const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'Cash on Delivery';

      if (!name || !phone || !city || !address) {
        cartManager.showToast('❌ Barah-e-karam saray zaroori fields pur karein!');
        return;
      }

      // Generate random order ID
      const orderId = 'NYB-' + Math.floor(100000 + Math.random() * 900000);

      // Show success modal
      closeCheckout();
      showOrderSuccess(orderId, { name, phone, city, address, paymentMethod });

      // Trigger automatic WhatsApp backup message in new tab optionally
      const waLink = cartManager.generateWhatsAppLink({ name, phone, city, address, notes, paymentMethod });
      
      const sendWaBtn = document.getElementById('success-send-whatsapp');
      if (sendWaBtn) {
        sendWaBtn.onclick = () => window.open(waLink, '_blank');
      }

      // Clear the cart
      cartManager.clearCart();
    });
  }

  function showOrderSuccess(orderId, details) {
    if (!successModal) return;
    document.getElementById('success-order-id').textContent = orderId;
    document.getElementById('success-customer-name').textContent = details.name;
    document.getElementById('success-phone').textContent = details.phone;
    document.getElementById('success-city').textContent = details.city;

    successModal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => {
      successModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    });
  }

  // ----------------------------------------------------
  // Category Filters & Search Listeners
  // ----------------------------------------------------
  categoryFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryFilters.forEach(b => {
        b.classList.remove('bg-emerald-800', 'text-white', 'shadow-md');
        b.classList.add('bg-white', 'text-gray-700');
      });
      btn.classList.add('bg-emerald-800', 'text-white', 'shadow-md');
      btn.classList.remove('bg-white', 'text-gray-700');

      state.activeCategory = btn.dataset.category;
      renderProducts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderProducts();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderProducts();
    });
  }

  // ----------------------------------------------------
  // FAQ Accordion Interactivity
  // ----------------------------------------------------
  const faqButtons = document.querySelectorAll('.faq-toggle-btn');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Toggle state
      btn.setAttribute('aria-expanded', !isExpanded);
      if (content) {
        content.classList.toggle('hidden');
      }
      if (icon) {
        icon.classList.toggle('rotate-180');
      }
    });
  });

  // ----------------------------------------------------
  // Scroll to Top Listener
  // ----------------------------------------------------
  window.addEventListener('scroll', () => {
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.add('opacity-100');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
        backToTopBtn.classList.remove('opacity-100');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Initial rendering
  renderProducts();
  cartManager.updateBadges();
  updateWishlistBadge();
});

