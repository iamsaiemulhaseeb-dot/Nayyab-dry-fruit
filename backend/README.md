# Nayyab Dry Fruit - Backend API (Local JSON Storage)
**Client:** Hafiz Yasir (0323-4382687)  
**Location:** Shalimar Degree College near Bahu Gym, Baghbanpura, Lahore  
**Architecture:** Node.js, Express.js, Local JSON File Storage (`fs` module), MVC Pattern  
**Zero-Database Setup:** MongoDB ki service ki zaroorat nahi hai. Sara data `backend/data/products.json` aur `backend/data/orders.json` mein save hota hai.

---

## 🚀 Quick Setup & Run

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start Backend Server
```bash
# Option A: Normal start
node server.js

# Option B: Via npm script
npm start

# Option C: With nodemon (auto-reload on code change)
npm run dev
```

Server chalte hi ye output aayega:
```
====================================================
  🥜 NAYYAB DRY FRUIT BACKEND SERVER RUNNING       
  Proprietor: Hafiz Yasir (Baghbanpura, Lahore)    
  Storage: Local JSON Files (backend/data/)        
  Port: 5000 | Environment: development 
  Health Check: http://localhost:5000/api/health 
  Products API: http://localhost:5000/api/products
  Orders API:   http://localhost:5000/api/orders  
====================================================
```

---

## 📡 API Endpoints

### 🥜 Products (`/api/products`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Tamam dry fruits JSON se lata hai (`?category=nuts`, `?search=kaju`, `?sort=price-low`) |
| `GET` | `/api/products/:id` | Single product by ID (e.g. `kaju-premium`) |
| `POST` | `/api/products/seed` | `products.json` ko 13 authentic catalog items ke sath reset/seed karta hai |
| `POST` | `/api/products` | Naya product add karne ke liye (Admin) |
| `PUT` | `/api/products/:id` | Product details / rates update karne ke liye (Admin) |
| `DELETE` | `/api/products/:id` | Product delete karne ke liye (Admin) |

### 📦 Orders (`/api/orders`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders` | Checkout modal se naya order `orders.json` mein save karta hai |
| `GET` | `/api/orders` | Admin ke liye tamam orders dikhata hai (`?status=pending`, `?search=0323`) |
| `GET` | `/api/orders/:id` | Single order details by `orderId` (e.g. `NYB-849201`) |
| `PATCH` | `/api/orders/:id/status` | Order status update (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`) |
| `GET` | `/api/orders/stats/summary` | Total orders, pending count, delivered count aur total revenue analytics |

---

## 📂 Data Storage Files
* **`backend/data/products.json`**: Tamam dry fruits ka live data (prices, weights, images, descriptions).
* **`backend/data/orders.json`**: Har customer ka checkout order yahan append hota hai.

---

## 🔗 Frontend Connection
Frontend automatically `src/services/api.js` ke zariye `http://localhost:5000/api` se connected hai.  
Agar backend offline bhi ho, toh frontend local fallback ke sath chalta rahega bina kisi crash ke!
