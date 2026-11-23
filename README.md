# Nayyab Dry Fruit (نایاب ڈرائی فروٹ) - Premium React E-Commerce Application

An ultra-luxury, high-converting, mobile-first **React (Vite + Tailwind CSS + Lucide React)** web application built for **Nayyab Dry Fruit**.
- **Proprietor**: Hafiz Yasir (حافظ یاسر)
- **Store Location**: Shalimar Degree College near Bahu Gym, Baghbanpura, Lahore (شالیمار ڈگری کالج، نزد باہو جم، باغبانپورہ، لاہور)
- **Call / WhatsApp**: `0323-4382687` (+92 323 4382687)

---

## ⚡ Tech Stack & Architecture

- **React 19** with clean, modular functional components & hooks
- **Vite 6** for lightning-fast build & HMR dev experience
- **Tailwind CSS 3** with custom luxury emerald and gold color palette
- **Lucide React** for high-resolution vector iconography
- **React Context API** (`CartContext`) for global cart, wishlist, coupon, modal, and state persistence via `localStorage`
- **Web Audio API** synthesized tactile audio chimes when adding items to cart
- **Google Maps Embed API** showing physical store location in Baghbanpura, Lahore

---

## 🌟 Features & Functionalities

1. **Client Identity & Store Branding**:
   - Complete branding reflecting proprietor **Hafiz Yasir (حافظ یاسر)**.
   - Real store address at **Shalimar Degree College near Bahu Gym, Baghbanpura, Lahore**.
   - Direct Call & WhatsApp ordering linking directly to `0323-4382687`.

2. **Interactive Google Map & Direction Integration**:
   - Embedded Google Map iframe centered at **Shalimar Degree College, Baghbanpura, Lahore**.
   - One-click navigation link opening Google Maps route and directions.
   - Physical store hours (10:00 AM - 11:30 PM daily) and store amenities highlighted.

3. **Complete Product Catalog & Live Dynamic Pricing**:
   - **Kaju (Royal Roasted Cashew)**: Rs. 4,000 / kg
   - **Pista (Iranian Super Green Pistachios)**: Rs. 5,800 / kg
   - **Chalgoza (Afghani Roasted Pine Nuts)**: Rs. 8,000 / kg
   - **Badam Giri (Sweet Afghani Almond Kernels)**: Rs. 3,800 / kg
   - **Akhrot Magaz (Kashmiri Walnut Kernels)**: Rs. 3,200 / kg
   - **Injeer Afghanistan (Golden Afghani Dried Figs)**: Rs. 3,400 / kg
   - **Khobani Goal (Sweet Round Dried Apricots)**: Rs. 1,600 / kg
   - **Khobani Jimri (Special Soft Apricots Seedless)**: Rs. 1,800 / kg
   - **Ajwa Dates (Original Madinah Munawwarah)**: Rs. 3,200 / kg
   - **Kishmish (Sundarkhani Green Raisins)**: Rs. 1,600 / kg
   - **Phool Makhana (Crispy Roasted Lotus Seeds)**: Rs. 2,400 / kg
   - **Pure Natural Honey (Wild Sidr/Beri Honey)**: Rs. 3,400 / kg
   - **Royal Mix Dry Fruit Platter**: Rs. 4,950 / kg

4. **Dynamic Weight & Price Recalculation**:
   - Each product card offers real-time weight buttons: **250g**, **500g**, and **1 kg** with immediate price recalculation without page reload.

5. **Slide-Out Cart Drawer & Coupon Discounts**:
   - Persistent Cart Drawer via `localStorage`.
   - Free delivery progress tracker (Free shipping on orders above Rs. 5,000).
   - Promo coupon discounts (`NAYYAB10` for 10% off, `WELCOME5`, `FREESHIP`).
   - Cash on Delivery (COD) order form with unique order ID generation (`NYB-XXXXXX`).
   - Direct WhatsApp order generator sending formatted items, customer name, address, and total bill directly to Hafiz Yasir at `0323-4382687`.

6. **Quick View & Order Confirmation Modals**:
   - Detailed nutritional info and certified health benefits popup.
   - Printable order invoice receipt.

---

## 📂 Project Structure

```
nayyab drie fruit/
├── dist/                      # Production build output
├── public/                    # Static image assets (kaju.jpg, pista.jpg, etc.)
├── src/
│   ├── components/            # React modular components
│   │   ├── Navbar.jsx         # Header & announcement ticker
│   │   ├── Hero.jsx           # Luxury banner & rates teaser
│   │   ├── TrustFeatures.jsx  # Trust badges & perks
│   │   ├── ProductCatalog.jsx # Filters, search & category grid
│   │   ├── ProductCard.jsx    # Individual product card & weight chips
│   │   ├── QuickViewModal.jsx # Health benefits & nutrition popup
│   │   ├── CartDrawer.jsx     # Slide-out shopping cart
│   │   ├── CheckoutModal.jsx  # Cash on Delivery form
│   │   ├── OrderSuccessModal.jsx # Invoice & print receipt
│   │   ├── StoreLocation.jsx  # Interactive Google Map & timings
│   │   ├── WhyChooseUs.jsx    # Quality guarantee section
│   │   ├── HealthGuide.jsx    # Wellness & vitality superfoods
│   │   ├── Reviews.jsx        # Verified buyer testimonials
│   │   ├── FAQ.jsx            # Accordion FAQ
│   │   ├── Footer.jsx         # Footer & payment badges
│   │   ├── FloatingActions.jsx# WhatsApp & Scroll-to-Top buttons
│   │   └── ToastContainer.jsx # Toast notifications
│   ├── context/
│   │   └── CartContext.jsx    # Cart state & WhatsApp link generator
│   ├── data/
│   │   └── products.js        # Products catalog & store info
│   ├── App.jsx                # Main application component
│   ├── index.css              # Tailwind directives & luxury styling
│   └── main.jsx               # React entry point
├── index.html                 # Root HTML template
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
└── package.json               # Dependencies & scripts
```

---

## 🚀 How to Run

### Development Mode:
```bash
npm run dev
```
Opens live development server with Hot Module Replacement (HMR) at `http://localhost:3000`.

### Production Build:
```bash
npm run build
```
Generates optimized static assets in the `dist/` folder.

### Preview Production Build:
```bash
npm run preview
```
Previews the production build locally.
