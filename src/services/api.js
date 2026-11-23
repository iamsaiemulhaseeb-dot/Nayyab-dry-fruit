import { PRODUCTS_DATA } from '../data/products';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch all dry fruits products from the backend API.
 * Gracefully falls back to local PRODUCTS_DATA if the backend is not running.
 */
export async function getProducts(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.sort) query.append('sort', params.sort);
    if (params.featured) query.append('featured', 'true');

    const url = `${API_BASE_URL}/products${query.toString() ? '?' + query.toString() : ''}`;
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.warn('[Backend Offline / Fallback]: Using local PRODUCTS_DATA', error.message);
    return PRODUCTS_DATA;
  }
}

/**
 * Fetch single product by ID
 */
export async function getProductById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!res.ok) throw new Error(`Product not found`);
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.warn(`[Backend Offline]: Finding ${id} in local catalog`);
    return PRODUCTS_DATA.find(p => p.id === id) || null;
  }
}

/**
 * Submit / Place a new Order to MongoDB Backend
 */
export async function placeOrder(orderData) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to place order in backend');
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.warn('[Backend Offline]: Order stored locally only:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch all orders (Admin / Store Management)
 */
export async function getOrders(status = '') {
  try {
    const url = status ? `${API_BASE_URL}/orders?status=${status}` : `${API_BASE_URL}/orders`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error getting orders from backend:', error);
    return [];
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId, status) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch Order Analytics / Summary Statistics
 */
export async function getOrderStats() {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/stats/summary`);
    if (!res.ok) throw new Error('Failed to fetch order stats');
    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error('Error getting stats from backend:', error);
    return null;
  }
}

/* ─────────────────────── Products Admin API ─────────────────────── */

/**
 * Create a new product.
 * Pass imageBase64 as a data-URL string if the user uploaded a file.
 */
export async function createProduct(productData) {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return await res.json();
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update an existing product by id.
 * Pass imageBase64 as a data-URL string to replace the image.
 */
export async function updateProduct(id, productData) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return await res.json();
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a product by id.
 */
export async function deleteProduct(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
    return await res.json();
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }
}

/* ─────────────────────── Admin Auth API ─────────────────────── */

/**
 * Log in as admin.
 * Returns { success, token, expiresIn } on success.
 */
export async function adminLogin(username, password) {
  try {
    const res  = await fetch(`${API_BASE_URL}/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ username, password }),
    });
    return await res.json();
  } catch (error) {
    console.error('Admin login error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verify that the token stored in localStorage is still valid.
 * Returns { success: true } when valid, { success: false } otherwise.
 */
export async function verifyAdminToken() {
  const token = localStorage.getItem('nayyab_admin_token');
  if (!token) return { success: false };
  try {
    const res  = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch {
    return { success: false };
  }
}
