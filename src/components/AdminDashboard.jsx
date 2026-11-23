import React, { useState, useEffect, useMemo } from 'react';
import {
  Lock, Eye, EyeOff, ShoppingBag, TrendingUp, Clock, CheckCircle2,
  Truck, XCircle, RefreshCw, Search, Phone, MessageCircle, MapPin,
  Calendar, DollarSign, ArrowLeft, LogOut, AlertCircle, Package,
  ShieldCheck, FileText, LayoutDashboard, Users, BarChart2,
  ChevronDown, ExternalLink, Box, Menu, X as XIcon, Star,
  Tag, Layers, Activity, ArrowUpRight, ArrowDownRight, Award,
  Zap, Heart, Filter, ChevronRight, Edit, Trash2, Eye as EyeIcon,
  Printer, Download, ThumbsUp, ThumbsDown, MessageSquare, Globe
} from 'lucide-react';
import { getOrders, updateOrderStatus } from '../services/api';
import { STORE_INFO, PRODUCTS_DATA } from '../data/products';

/* ─────────────────────── constants ─────────────────────── */
const S   = '#0F291E'; // sidebar bg
const SH  = '#1a3d2b'; // sidebar hover
const SA  = '#1f4d35'; // sidebar active
const AMB = '#f59e0b'; // amber accent

const GENERIC_FALLBACK =
  'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=200&q=80';

const resolveItemImage = (item) => {
  if (item?.image && String(item.image).trim()) return item.image;
  const p = PRODUCTS_DATA.find((x) => x.id === item?.productId);
  return p?.image || p?.fallbackImage || GENERIC_FALLBACK;
};

const STATUS_MAP = {
  pending:    { pill: 'bg-amber-100  text-amber-800  border-amber-300',    dot: 'bg-amber-500 animate-pulse',  label: 'Pending'    },
  confirmed:  { pill: 'bg-blue-100   text-blue-800   border-blue-300',     dot: 'bg-blue-500',                 label: 'Confirmed'  },
  processing: { pill: 'bg-purple-100 text-purple-800 border-purple-300',   dot: 'bg-purple-500',               label: 'Processing' },
  shipped:    { pill: 'bg-orange-100 text-orange-800 border-orange-300',   dot: 'bg-orange-500',               label: 'Shipped'    },
  delivered:  { pill: 'bg-emerald-100 text-emerald-800 border-emerald-300',dot: 'bg-emerald-500',              label: 'Delivered'  },
  cancelled:  { pill: 'bg-rose-100   text-rose-800   border-rose-300',     dot: 'bg-rose-500',                 label: 'Cancelled'  },
};
const getStatus = (s = 'pending') => STATUS_MAP[s.toLowerCase()] || STATUS_MAP.pending;

const NAV = [
  { id: 'dashboard',       label: 'Dashboard',      icon: LayoutDashboard },
  { id: 'orders',          label: 'Orders',         icon: ShoppingBag     },
  { id: 'products',        label: 'Products',       icon: Box             },
  { id: 'customers',       label: 'Customers',      icon: Users           },
  { id: 'analytics',       label: 'Analytics',      icon: BarChart2       },
  { id: 'reviews',         label: 'Reviews',        icon: MessageSquare   },
  { id: 'bulk-inquiries',  label: 'Bulk Inquiries', icon: Package         },
];

/* ══════════════════════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════════════════════ */
export const AdminDashboard = ({ onBackToStore, onLogout }) => {
  const [isAuthenticated] = useState(true); // auth is handled by App.jsx / AdminLoginPage

  const [orders,          setOrders]          = useState([]);
  const [loading,         setLoading]         = useState(false);
  const [notification,    setNotification]    = useState(null);
  const [activeNav,       setActiveNav]       = useState('dashboard');
  const [sidebarOpen,     setSidebarOpen]     = useState(false);

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getOrders();
      if (Array.isArray(data)) setOrders(data);
    } catch (err) {
      if (!silent) notify('Failed to load orders', 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const iv  = setInterval(() => loadOrders(true), 20000);
    const onF = () => loadOrders(true);
    window.addEventListener('focus', onF);
    return () => { clearInterval(iv); window.removeEventListener('focus', onF); };
  }, []);

  /* ── logout: delegates to App.jsx which clears session ── */
  const handleLogout = () => {
    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      // Fallback if called without the prop (should not happen)
      localStorage.removeItem('nayyab_admin_token');
      localStorage.removeItem('nayyab_admin_authenticated');
      window.location.pathname = '/admin/login';
    }
  };

  const stats = useMemo(() => {
    const totalOrders     = orders.length;
    const pendingOrders   = orders.filter(o => o.status === 'pending').length;
    const confirmedOrders = orders.filter(o => o.status === 'confirmed').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
    const shippedOrders   = orders.filter(o => o.status === 'shipped').length;
    const totalRevenue    = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (Number(o.total) || 0), 0);
    const avgOrder        = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const topCity = (() => {
      const map = {};
      orders.forEach(o => { const c = o.customer?.city || o.city || ''; if (c) map[c] = (map[c] || 0) + 1; });
      return Object.entries(map).sort((a,b)=>b[1]-a[1])[0]?.[0] || '—';
    })();
    return { totalOrders, pendingOrders, confirmedOrders, deliveredOrders, cancelledOrders, shippedOrders, totalRevenue, avgOrder, topCity };
  }, [orders]);

  /* ══════════════════════════════════════════
     LOGIN SCREEN
  ══════════════════════════════════════════ */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
           style={{ background: `linear-gradient(135deg, ${S} 0%, #0a1f16 50%, #000 100%)` }}>
        <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg"
                 style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>🥜</div>
            <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                  style={{ color: S, background: '#fef3c7', borderColor: '#fcd34d' }}>
              Hafiz Sumair · Owner Portal
            </span>
            <h2 className="text-2xl font-black text-gray-900 mt-3">Admin Dashboard</h2>
            <p className="text-xs text-gray-500 mt-1">Enter your master password to access the panel.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input type={showPassword ? 'text' : 'password'} value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)} placeholder="Admin password" autoFocus
                className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-900/40" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-700">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {authError && (
              <p className="text-xs font-semibold text-rose-600 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />{authError}
              </p>
            )}
            <button type="submit" className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg transition hover:opacity-90 flex items-center justify-center gap-2"
                    style={{ background: S }}>
              <ShieldCheck className="w-4 h-4 text-amber-400" />Unlock Dashboard
            </button>
          </form>
          <div className="mt-6 text-center border-t border-gray-100 pt-5">
            <button onClick={onBackToStore} className="text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center justify-center gap-1.5 mx-auto transition">
              <ArrowLeft className="w-3.5 h-3.5" />Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════
     SHELL LAYOUT
  ══════════════════════════════════════════ */
  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#f4f6f9]">

      {/* Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[200] px-4 py-3 rounded-xl shadow-2xl border text-xs font-bold flex items-center gap-2 max-w-xs
          ${notification.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: notification.type === 'error' ? '#e11d48' : '#059669' }} />
          {notification.msg}
        </div>
      )}

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ═══ SIDEBAR ═══ */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 flex flex-col w-60 shrink-0 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: S }}>

        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shrink-0 shadow"
               style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>🥜</div>
          <div className="min-w-0">
            <p className="text-white font-black text-xs tracking-widest truncate">NAYYAB DRY FRUIT</p>
            <p className="text-xs mt-0.5 font-medium truncate" style={{ color: AMB }}>Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/50 hover:text-white">
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-black uppercase tracking-widest px-3 py-2" style={{ color: '#6b9e82' }}>MAIN MENU</p>
          {NAV.map(item => {
            const Icon     = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button key={item.id} onClick={() => { setActiveNav(item.id); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={{ background: isActive ? SA : 'transparent', color: isActive ? '#fff' : '#9dc4ae' }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = SH; e.currentTarget.style.color = '#fff'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9dc4ae'; } }}>
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === 'orders' && stats.pendingOrders > 0 && (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full" style={{ background: AMB, color: S }}>
                    {stats.pendingOrders}
                  </span>
                )}
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </button>
            );
          })}
        </nav>

        {/* Profile badge */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: SA }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                 style={{ background: AMB, color: S }}>HS</div>
            <div className="min-w-0">
              <p className="text-white text-xs font-bold truncate">{STORE_INFO.proprietor}</p>
              <p className="text-[10px] truncate" style={{ color: '#6b9e82' }}>Proprietor</p>
            </div>
            <button onClick={handleLogout} className="ml-auto text-rose-400 hover:text-rose-300 transition" title="Logout">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ═══ MAIN COLUMN ═══ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center gap-3 shrink-0 shadow-sm z-20">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-900 mr-1">
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="font-semibold text-gray-800">{NAV.find(n => n.id === activeNav)?.label}</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => loadOrders()} disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition border border-gray-200">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button onClick={onBackToStore}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-lg transition shadow-sm"
              style={{ background: S }}>
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Publish</span>
            </button>
            <button onClick={handleLogout}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition">
              <LogOut className="w-3.5 h-3.5" />Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {activeNav === 'dashboard'      && <DashboardPage       stats={stats} orders={orders} onBackToStore={onBackToStore} setActiveNav={setActiveNav} />}
          {activeNav === 'orders'         && <OrdersPage          stats={stats} orders={orders} loading={loading} loadOrders={loadOrders} notify={notify} setOrders={setOrders} />}
          {activeNav === 'products'       && <ProductsPage        />}
          {activeNav === 'customers'      && <CustomersPage       orders={orders} />}
          {activeNav === 'analytics'      && <AnalyticsPage       stats={stats} orders={orders} />}
          {activeNav === 'reviews'        && <ReviewsPage         />}
          {activeNav === 'bulk-inquiries' && <BulkInquiriesPage   />}
        </main>

        <footer className="bg-white border-t border-gray-200 px-6 py-2 text-[10px] text-gray-400 shrink-0">
          © 2026 {STORE_INFO.name} · Admin Portal · {STORE_INFO.proprietor} · {STORE_INFO.phone}
        </footer>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   PAGE: DASHBOARD
══════════════════════════════════════════════════════════ */
function DashboardPage({ stats, orders, onBackToStore, setActiveNav }) {
  const recentOrders = orders.slice(0, 5);
  const topProducts  = useMemo(() => {
    const map = {};
    orders.forEach(o => (o.items || []).forEach(item => {
      map[item.name] = (map[item.name] || 0) + Number(item.quantity || 1);
    }));
    return Object.entries(map).sort((a,b) => b[1]-a[1]).slice(0, 5);
  }, [orders]);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl p-5 text-white flex items-center justify-between"
           style={{ background: `linear-gradient(135deg, ${S} 0%, #1f4d35 100%)` }}>
        <div>
          <p className="text-xs font-semibold opacity-70">Welcome back,</p>
          <h1 className="text-xl font-black mt-0.5">{STORE_INFO.proprietor} 👋</h1>
          <p className="text-xs opacity-60 mt-1">{STORE_INFO.address}</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs opacity-60">Today</p>
          <p className="text-sm font-bold">{new Date().toLocaleDateString('en-PK',{weekday:'long',day:'2-digit',month:'short'})}</p>
          <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: AMB, color: S }}>🟢 Store Live</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard icon={<DollarSign className="w-3.5 h-3.5" style={{color:AMB}} />}  iconBg={SA}  label="Revenue"    value={`Rs.${(stats.totalRevenue/1000).toFixed(0)}k`} sub="All time"       dark />
        <KpiCard icon={<ShoppingBag className="w-3.5 h-3.5 text-blue-600" />}       iconBg="bg-blue-100"    label="Total Orders"  value={stats.totalOrders}    sub="All time"            />
        <KpiCard icon={<Clock className="w-3.5 h-3.5 text-amber-600" />}            iconBg="bg-amber-100"   label="Pending"       value={stats.pendingOrders}  sub="Needs action" valueColor="text-amber-700" />
        <KpiCard icon={<CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}      iconBg="bg-blue-100"    label="Confirmed"     value={stats.confirmedOrders} sub="Packing ready"      />
        <KpiCard icon={<Truck className="w-3.5 h-3.5 text-emerald-600" />}          iconBg="bg-emerald-100" label="Delivered"     value={stats.deliveredOrders} sub="Completed" valueColor="text-emerald-700" />
        <KpiCard icon={<XCircle className="w-3.5 h-3.5 text-rose-600" />}           iconBg="bg-rose-100"    label="Cancelled"     value={stats.cancelledOrders} sub="Refunded"  valueColor="text-rose-600"    />
      </div>

      {/* Two column: recent orders + top products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-black text-gray-900">Recent Orders</h3>
            <button onClick={() => setActiveNav('orders')} className="text-xs font-semibold flex items-center gap-1 hover:underline" style={{color: SA}}>
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {recentOrders.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">No orders yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map(order => {
                const c  = order.customer || order;
                const st = getStatus(order.status);
                return (
                  <div key={order.orderId || order._id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/60 transition">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm"
                         style={{ background: '#fef3c7' }}>📦</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{c.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{order.orderId}</p>
                    </div>
                    <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border ${st.pill}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{st.label}
                    </span>
                    <span className="text-xs font-black text-gray-900 ml-2">Rs.&nbsp;{Number(order.total||0).toLocaleString('en-PK')}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-black text-gray-900">Top Products</h3>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          {topProducts.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">No data yet</div>
          ) : (
            <div className="p-4 space-y-3">
              {topProducts.map(([name, qty], i) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                        style={{ background: i === 0 ? AMB : '#e5e7eb', color: i === 0 ? S : '#6b7280' }}>{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{name}</p>
                    <div className="mt-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(100,(qty/topProducts[0][1])*100)}%`, background: i === 0 ? AMB : SA }} />
                    </div>
                  </div>
                  <span className="text-xs font-black text-gray-700 shrink-0">{qty} sold</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-100">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Avg Order Value</p>
            <p className="text-lg font-black text-gray-900">Rs. {stats.avgOrder.toLocaleString('en-PK')}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-blue-100">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Top City</p>
            <p className="text-lg font-black text-gray-900">{stats.topCity}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-purple-100">
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Products</p>
            <p className="text-lg font-black text-gray-900">{PRODUCTS_DATA.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE: ORDERS
══════════════════════════════════════════════════════════ */
function OrdersPage({ stats, orders, loading, loadOrders, notify, setOrders }) {
  const [selectedStatus,  setSelectedStatus]  = useState('all');
  const [searchQuery,     setSearchQuery]     = useState('');
  const [expandedRow,     setExpandedRow]     = useState(null);
  const [openStatusMenu,  setOpenStatusMenu]  = useState(null);
  const [updatingId,      setUpdatingId]      = useState(null);
  const [printOrder,      setPrintOrder]      = useState(null);  // order to print

  useEffect(() => {
    const close = () => setOpenStatusMenu(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setOpenStatusMenu(null);
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (res?.success) {
        setOrders(prev => prev.map(o => (o.orderId === orderId || o._id === orderId ? { ...o, status: newStatus } : o)));
        notify(`Order ${orderId} → ${newStatus.toUpperCase()}`);
      } else {
        notify(res?.message || 'Failed to update', 'error');
      }
    } catch { notify('Server error', 'error'); }
    finally { setUpdatingId(null); }
  };

  /* ── Smart status-based WhatsApp message ── */
  const openWhatsApp = (order) => {
    const c  = order.customer || order;
    let ph   = (c.phone || '').replace(/[^0-9]/g, '');
    if (ph.startsWith('0')) ph = '92' + ph.slice(1);
    const id    = order.orderId;
    const total = `Rs. ${Number(order.total || 0).toLocaleString('en-PK')}`;
    const name  = c.name || 'Customer';
    const status= (order.status || 'pending').toLowerCase();

    const msgMap = {
      pending:
        `Assalam-o-Alaikum *${name}* Sahib/Sahiba! 🌟\n` +
        `Yeh Hafiz Sumair hain *Nayyab Dry Fruit* (Baghbanpura, Lahore) se.\n\n` +
        `Aap ka Order *#${id}* (${total}) hamare paas aa gaya hai.\n` +
        `Hum jald hi aap se confirm karen ge. Shukriya! 🥜`,

      confirmed:
        `Assalam-o-Alaikum *${name}* Sahib/Sahiba! ✅\n` +
        `*Nayyab Dry Fruit* (Hafiz Sumair) ki taraf se khushkhabri!\n\n` +
        `Aap ka Order *#${id}* (${total}) *Confirm* ho gaya hai! 🎉\n` +
        `Hum ab aap ka parcel fresh dry fruits se pack kar rahe hain.`,

      processing:
        `Assalam-o-Alaikum *${name}* Sahib/Sahiba! 📦\n` +
        `*Nayyab Dry Fruit* — Aap ka Order *#${id}* (${total}) ab *Pack ho raha hai*.\n` +
        `Jaldi aap ke courier ko hand over kar diya jaaye ga.`,

      shipped:
        `Assalam-o-Alaikum *${name}* Sahib/Sahiba! 🚚\n` +
        `*Nayyab Dry Fruit* (Hafiz Sumair):\n\n` +
        `Aap ka Order *#${id}* (${total}) *Dispatch ho gaya hai!*\n` +
        `Courier parcel le kar rawan ho chuka hai, inshaAllah jald pohunch jaaye ga.`,

      delivered:
        `Assalam-o-Alaikum *${name}* Sahib/Sahiba! 🌟\n` +
        `*Nayyab Dry Fruit* (Hafiz Sumair):\n\n` +
        `Aap ka Order *#${id}* (${total}) *Deliver ho gaya hai*. ✅\n` +
        `Umeed hai aap ko hamare dry fruits pasand aaye hain!\n` +
        `Dobara zaroor order karain. Jazak Allah Khair! 🥜`,

      cancelled:
        `Assalam-o-Alaikum *${name}* Sahib/Sahiba.\n` +
        `*Nayyab Dry Fruit* (Hafiz Sumair):\n\n` +
        `Aap ka Order *#${id}* (${total}) *Cancel* ho gaya hai.\n` +
        `Koi masla ho to please humse rabta karen: 0323-4382687`,
    };

    const msg = msgMap[status] || msgMap.pending;
    window.open(`https://wa.me/${ph}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  /* ── Export filtered orders to CSV ── */
  const exportCSV = () => {
    if (filtered.length === 0) { notify('No orders to export.', 'error'); return; }

    const headers = ['Order ID','Date','Customer Name','Phone','City','Address','Items','Total (Rs.)','Payment Method','Status'];
    const rows = filtered.map(o => {
      const c     = o.customer || o;
      const items = (o.items || []).map(i => `${i.name}(${i.weightLabel}×${i.quantity})`).join(' | ');
      const date  = o.createdAt ? new Date(o.createdAt).toLocaleString('en-PK') : '';
      const esc   = (v) => `"${String(v || '').replace(/"/g, '""')}"`;
      return [
        esc(o.orderId), esc(date), esc(c.name), esc(c.phone),
        esc(c.city),    esc(c.address), esc(items),
        esc(o.total),   esc(o.paymentMethod), esc(o.status),
      ].join(',');
    });

    const csv     = [headers.join(','), ...rows].join('\n');
    const blob    = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement('a');
    a.href        = url;
    a.download    = `nayyab-orders-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notify(`Exported ${filtered.length} orders to CSV.`);
  };

  const filtered = useMemo(() => orders.filter(o => {
    if (selectedStatus !== 'all' && (o.status||'pending').toLowerCase() !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (o.orderId||'').toLowerCase().includes(q)
        || (o.customer?.name||o.name||'').toLowerCase().includes(q)
        || (o.customer?.phone||o.phone||'').toLowerCase().includes(q)
        || (o.customer?.city||o.city||'').toLowerCase().includes(q);
    }
    return true;
  }), [orders, selectedStatus, searchQuery]);

  return (
    <div className="p-4 sm:p-6 space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-gray-900">Orders Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">{STORE_INFO.name} · {STORE_INFO.phone}</p>
        </div>
        <button onClick={() => loadOrders()} disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white rounded-xl transition"
          style={{ background: SA }}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />Refresh
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <KpiCard icon={<DollarSign className="w-3.5 h-3.5" style={{color:AMB}} />} iconBg={SA}       label="Revenue"   value={`Rs.${(stats.totalRevenue/1000).toFixed(0)}k`} sub="" dark />
        <KpiCard icon={<ShoppingBag className="w-3.5 h-3.5 text-blue-600" />}     iconBg="bg-blue-100"    label="Total"     value={stats.totalOrders}     sub="" />
        <KpiCard icon={<Clock className="w-3.5 h-3.5 text-amber-600" />}          iconBg="bg-amber-100"   label="Pending"   value={stats.pendingOrders}   sub="" valueColor="text-amber-700" />
        <KpiCard icon={<CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}    iconBg="bg-blue-100"    label="Confirmed" value={stats.confirmedOrders} sub="" />
        <KpiCard icon={<Truck className="w-3.5 h-3.5 text-emerald-600" />}        iconBg="bg-emerald-100" label="Delivered" value={stats.deliveredOrders} sub="" valueColor="text-emerald-700" />
        <KpiCard icon={<XCircle className="w-3.5 h-3.5 text-rose-600" />}         iconBg="bg-rose-100"    label="Cancelled" value={stats.cancelledOrders} sub="" valueColor="text-rose-600" />
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 border-b border-gray-100">
          <div className="flex flex-wrap gap-1">
            {[
              { id:'all',       label:'All',       count: stats.totalOrders      },
              { id:'pending',   label:'Pending',   count: stats.pendingOrders    },
              { id:'confirmed', label:'Confirmed', count: stats.confirmedOrders  },
              { id:'shipped',   label:'Shipped',   count: stats.shippedOrders    },
              { id:'delivered', label:'Delivered', count: stats.deliveredOrders  },
              { id:'cancelled', label:'Cancelled', count: stats.cancelledOrders  },
            ].map(tab => (
              <button key={tab.id} onClick={() => setSelectedStatus(tab.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition border
                  ${selectedStatus === tab.id ? 'text-white border-transparent' : 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                style={selectedStatus === tab.id ? { background: S } : {}}>
                {tab.label}
                <span className={`text-[10px] font-black px-1 rounded-full ${selectedStatus === tab.id ? 'bg-amber-400 text-gray-900' : 'bg-gray-200 text-gray-700'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <div className="relative sm:ml-auto">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search orders, customers…"
              className="w-full sm:w-64 pl-9 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900/30" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2 text-gray-400 text-xs">✕</button>
            )}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-20 text-center"><RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-emerald-700" /><p className="text-sm text-gray-500">Loading…</p></div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center"><Package className="w-10 h-10 text-gray-200 mx-auto mb-2" /><p className="text-sm text-gray-500">No orders found</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-wider text-gray-400 bg-gray-50/70 border-b border-gray-100">
                  {['Order ID','Customer','City / Address','Items','Total','Payment','Date','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(order => {
                  const c          = order.customer || order;
                  const st         = getStatus(order.status);
                  const isUpdating = updatingId === (order.orderId || order._id);
                  const isExpanded = expandedRow === (order.orderId || order._id);
                  const oid        = order.orderId || order._id;
                  const items      = order.items || [];

                  return (
                    <React.Fragment key={oid}>
                      <tr className="hover:bg-amber-50/20 transition-colors">

                        {/* Order ID */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button onClick={() => setExpandedRow(isExpanded ? null : oid)}
                            className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-black text-emerald-800">{order.orderId}</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                          <span className="text-[10px] text-gray-400">{items.length} item{items.length!==1?'s':''}</span>
                        </td>

                        {/* Customer */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-xs font-bold text-gray-900 max-w-[120px] truncate">{c.name}</p>
                          <p className="text-[11px] text-emerald-700 font-semibold">{c.phone}</p>
                        </td>

                        {/* City/Address */}
                        <td className="px-4 py-3">
                          <p className="text-xs font-bold text-gray-800">{c.city}</p>
                          <p className="text-[10px] text-gray-500 max-w-[140px] truncate">{c.address}</p>
                        </td>

                        {/* Items thumbnails */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            {items.slice(0,3).map((item,i) => (
                              <div key={i} className="relative" title={`${item.name} ×${item.quantity}`}>
                                <img src={resolveItemImage(item)} alt={item.name} loading="lazy"
                                  onError={e => { e.currentTarget.onerror=null; e.currentTarget.src=GENERIC_FALLBACK; }}
                                  className="w-8 h-8 rounded-lg object-cover border-2 border-white shadow-sm" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[8px] font-black text-white flex items-center justify-center shadow">
                                  {item.quantity}
                                </span>
                              </div>
                            ))}
                            {items.length > 3 && (
                              <span className="w-8 h-8 rounded-lg bg-gray-100 border flex items-center justify-center text-[10px] font-black text-gray-600">
                                +{items.length-3}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Total */}
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <p className="text-sm font-black text-gray-900">Rs.&nbsp;{Number(order.total||0).toLocaleString('en-PK')}</p>
                          <p className="text-[10px] text-gray-400">{Number(order.deliveryFee)===0?'Free del.':`+Rs.${order.deliveryFee}`}</p>
                        </td>

                        {/* Payment + Receipt */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded-md block mb-1">
                            {(order.paymentMethod||'COD').replace('Cash on Delivery (COD)','COD').replace('JazzCash / EasyPaisa / Bank','JazzCash')}
                          </span>
                          {order.paymentProof && (
                            <a href={order.paymentProof} target="_blank" rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-md hover:bg-blue-100 transition"
                              title="View Payment Screenshot">
                              🧾 View Receipt
                            </a>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <p className="text-[11px] text-gray-700 font-medium">
                            {new Date(order.createdAt).toLocaleDateString('en-PK',{day:'2-digit',month:'short',year:'2-digit'})}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {new Date(order.createdAt).toLocaleTimeString('en-PK',{hour:'2-digit',minute:'2-digit'})}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2 py-1 rounded-full border ${st.pill}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{st.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            {/* Status dropdown */}
                            <div className="relative">
                              <button onClick={e => { e.stopPropagation(); setOpenStatusMenu(openStatusMenu===oid?null:oid); }}
                                disabled={isUpdating}
                                className="flex items-center gap-1 px-2 py-1.5 text-[10px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition">
                                {isUpdating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <ChevronDown className="w-3 h-3" />}
                                <span className="hidden sm:inline">Status</span>
                              </button>
                              {openStatusMenu === oid && (
                                <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                                  {[
                                    {id:'pending',label:'⏳ Pending'},
                                    {id:'confirmed',label:'✅ Confirm'},
                                    {id:'shipped',label:'📦 Ship'},
                                    {id:'delivered',label:'🚚 Deliver'},
                                    {id:'cancelled',label:'❌ Cancel'},
                                  ].map(opt => (
                                    <button key={opt.id} onClick={e => { e.stopPropagation(); handleStatusChange(oid, opt.id); }}
                                      disabled={(order.status||'').toLowerCase()===opt.id}
                                      className={`w-full text-left px-3 py-2 text-xs font-semibold transition
                                        ${(order.status||'').toLowerCase()===opt.id ? 'bg-emerald-50 text-emerald-800 font-black' : 'hover:bg-gray-50 text-gray-700'}`}>
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            {/* WhatsApp */}
                            <button onClick={() => openWhatsApp(order)}
                              className="p-1.5 rounded-lg text-white transition hover:opacity-80" style={{background:'#25D366'}}
                              title="WhatsApp">
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                            {/* Call */}
                            <a href={`tel:${c.phone}`}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                              title="Call">
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>

                      </tr>

                      {/* Expanded Items Row */}
                      {isExpanded && (
                        <tr className="bg-amber-50/40">
                          <td colSpan={9} className="px-6 py-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Items in {order.orderId}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {items.map((item,idx) => {
                                const price = Number(item.price||item.unitPrice||0);
                                const qty   = Number(item.quantity||1);
                                return (
                                  <div key={idx} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-amber-100 shadow-sm">
                                    <img src={resolveItemImage(item)} alt={item.name} loading="lazy"
                                      onError={e => { e.currentTarget.onerror=null; e.currentTarget.src=GENERIC_FALLBACK; }}
                                      className="w-12 h-12 rounded-lg object-cover border border-amber-200 shrink-0" />
                                    <div className="min-w-0">
                                      <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                                      <p className="text-[10px] text-gray-500 mt-0.5">
                                        <span className="bg-amber-100 text-amber-800 font-bold px-1 rounded">{item.weightLabel}</span>
                                        {' · '}qty {qty}
                                      </p>
                                      <p className="text-[11px] font-black text-emerald-800 mt-0.5">
                                        Rs.{price.toLocaleString('en-PK')} × {qty} = Rs.{(price*qty).toLocaleString('en-PK')}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-amber-200/60 text-xs text-gray-600">
                              <span>Subtotal: <strong>Rs.{Number(order.subtotal||0).toLocaleString('en-PK')}</strong></span>
                              <span>Delivery: <strong>{Number(order.deliveryFee)===0?'FREE':`Rs.${order.deliveryFee}`}</strong></span>
                              {Number(order.discount)>0 && <span className="text-rose-600">Discount: <strong>-Rs.{order.discount}</strong></span>}
                              {c.notes && <span className="text-amber-800 bg-amber-100 px-2 py-px rounded-md">📝 {c.notes}</span>}
                              <span className="font-black text-emerald-900 text-sm ml-auto">Total: Rs.{Number(order.total||0).toLocaleString('en-PK')}</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <span>Showing <strong className="text-gray-700">{filtered.length}</strong> of <strong className="text-gray-700">{stats.totalOrders}</strong> orders</span>
            <span>Auto-refreshes every 20 s</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE: PRODUCTS
══════════════════════════════════════════════════════════ */
function ProductsPage() {
  /* ── local state ── */
  const [products,     setProducts]     = useState([]);
  const [loadingProds, setLoadingProds] = useState(true);
  const [search,       setSearch]       = useState('');
  const [category,     setCategory]     = useState('all');
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editProduct,  setEditProduct]  = useState(null);   // null = add mode
  const [notify,       setNotify]       = useState(null);
  const [confirmDel,   setConfirmDel]   = useState(null);   // product id pending deletion

  const toast = (msg, type = 'success') => {
    setNotify({ msg, type });
    setTimeout(() => setNotify(null), 4000);
  };

  /* ── load products from backend ── */
  const loadProducts = async () => {
    setLoadingProds(true);
    try {
      const res  = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
      }
    } catch {
      // backend offline → fall back to static catalog
      setProducts(PRODUCTS_DATA);
    } finally {
      setLoadingProds(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  /* ── derived ── */
  const categories = useMemo(() => ['all', ...new Set(products.map(p => p.category))], [products]);

  const filtered = useMemo(() =>
    products.filter(p => {
      if (category !== 'all' && p.category !== category) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || (p.subtitle || '').toLowerCase().includes(q);
      }
      return true;
    }), [products, search, category]);

  /* ── delete ── */
  const handleDelete = async (id) => {
    setConfirmDel(null);
    try {
      const { deleteProduct } = await import('../services/api');
      const res = await deleteProduct(id);
      if (res.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        toast(`Product deleted successfully.`);
      } else {
        toast(res.message || 'Failed to delete product', 'error');
      }
    } catch {
      toast('Server error while deleting', 'error');
    }
  };

  /* ── open add modal ── */
  const openAdd  = () => { setEditProduct(null); setModalOpen(true); };
  /* ── open edit modal ── */
  const openEdit = (p) => { setEditProduct(p);   setModalOpen(true); };

  /* ── after save ── */
  const onSaved = (product, isEdit) => {
    if (isEdit) {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else {
      setProducts(prev => [product, ...prev]);
    }
    toast(`Product "${product.name}" ${isEdit ? 'updated' : 'added'} successfully!`);
  };

  /* ── render ── */
  return (
    <div className="p-4 sm:p-6 space-y-4">

      {/* Toast */}
      {notify && (
        <div className={`fixed top-4 right-4 z-[200] px-4 py-3 rounded-xl shadow-2xl border text-xs font-bold flex items-center gap-2 max-w-xs
          ${notify.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {notify.msg}
        </div>
      )}

      {/* Delete confirmation dialog */}
      {confirmDel && (
        <div className="fixed inset-0 bg-black/60 z-[150] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-rose-200">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="font-black text-gray-900 text-base">Delete Product?</h3>
              <p className="text-xs text-gray-500 mt-1">
                This will permanently remove the product from the catalog and cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDel(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition">
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmDel)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {modalOpen && (
        <ProductFormModal
          product={editProduct}
          onClose={() => setModalOpen(false)}
          onSaved={onSaved}
        />
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-gray-900">Products Catalog</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {products.length} products · {products.filter(p => p.inStock).length} in stock
          </p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition hover:opacity-90 active:scale-95"
          style={{ background: SA }}>
          <span className="text-base leading-none">+</span>
          Add New Product
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Products', value: products.length,                                    icon: <Box className="w-4 h-4 text-blue-600" />,      bg: 'bg-blue-100'    },
          { label: 'In Stock',       value: products.filter(p => p.inStock).length,              icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />, bg: 'bg-emerald-100' },
          { label: 'Featured',       value: products.filter(p => p.featured).length,             icon: <Star className="w-4 h-4 text-amber-600" />,    bg: 'bg-amber-100'   },
          { label: 'Categories',     value: new Set(products.map(p => p.category)).size,          icon: <Layers className="w-4 h-4 text-purple-600" />, bg: 'bg-purple-100'  },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.bg}`}>{s.icon}</div>
            <div>
              <p className="text-[10px] text-gray-500 font-semibold">{s.label}</p>
              <p className="text-xl font-black text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 border-b border-gray-100">
          <div className="flex flex-wrap gap-1">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition border capitalize
                  ${category === cat ? 'text-white border-transparent' : 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                style={category === cat ? { background: S } : {}}>
                {cat}
              </button>
            ))}
          </div>
          <div className="relative sm:ml-auto">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full sm:w-56 pl-9 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900/30" />
            {search && <button onClick={() => setSearch('')} className="absolute right-2.5 top-2 text-gray-400 text-xs">✕</button>}
          </div>
        </div>

        {/* Table */}
        {loadingProds ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-emerald-700" />
            <p className="text-sm text-gray-500">Loading products…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Box className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-wider text-gray-400 bg-gray-50/70 border-b border-gray-100">
                  {['Product', 'Category', 'Price / kg', 'Orig. Price', 'Rating', 'Stock', 'Badge', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">

                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = p.fallbackImage || GENERIC_FALLBACK; }}
                          className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-sm shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate max-w-[180px]">{p.name}</p>
                          <p className="text-[10px] text-gray-500 truncate max-w-[180px]">{p.subtitle}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded-md capitalize">{p.category}</span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-black text-emerald-800">Rs. {p.pricePerKg?.toLocaleString('en-PK')}</span>
                    </td>

                    {/* Original price */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-gray-400 line-through">Rs. {p.originalPricePerKg?.toLocaleString('en-PK')}</span>
                      {p.originalPricePerKg && p.pricePerKg && p.originalPricePerKg > p.pricePerKg && (
                        <span className="ml-2 text-[10px] font-bold text-rose-600">
                          -{Math.round(100 - (p.pricePerKg / p.originalPricePerKg * 100))}%
                        </span>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-gray-700">{p.rating}</span>
                        <span className="text-[10px] text-gray-400">({p.reviewsCount})</span>
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full ${p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {p.inStock ? '✓ In Stock' : '✗ Out'}
                      </span>
                    </td>

                    {/* Badge */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {p.badge && (
                        <span className="text-[10px] font-semibold bg-amber-100 text-amber-900 px-2 py-1 rounded-md">{p.badge}</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(p)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
                          title="Edit product">
                          <Edit className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button onClick={() => setConfirmDel(p.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition"
                          title="Delete product">
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-4 py-3 border-t border-gray-100 text-[11px] text-gray-400 flex items-center justify-between">
          <span>Showing {filtered.length} of {products.length} products</span>
          <button onClick={loadProducts} className="flex items-center gap-1 text-emerald-700 hover:underline font-semibold">
            <RefreshCw className="w-3 h-3" />Reload from backend
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PRODUCT FORM MODAL  (Add / Edit)
══════════════════════════════════════════════════════════ */
const CATEGORIES = ['nuts', 'kernels', 'dried-fruits', 'dates', 'honey', 'combos'];
const BADGE_COLORS = [
  { label: 'Amber',  value: 'bg-amber-600'  },
  { label: 'Green',  value: 'bg-emerald-700'},
  { label: 'Rose',   value: 'bg-rose-700'   },
  { label: 'Blue',   value: 'bg-blue-700'   },
  { label: 'Purple', value: 'bg-purple-800' },
  { label: 'Slate',  value: 'bg-slate-900'  },
  { label: 'Teal',   value: 'bg-teal-700'   },
];

// GENERIC_FALLBACK is declared at the top of this file — reuse it here.

function ProductFormModal({ product, onClose, onSaved }) {
  const isEdit = Boolean(product);

  const [form, setForm] = useState({
    name:               product?.name               || '',
    subtitle:           product?.subtitle           || '',
    category:           product?.category           || 'nuts',
    pricePerKg:         product?.pricePerKg         || '',
    originalPricePerKg: product?.originalPricePerKg || '',
    badge:              product?.badge              || '',
    badgeColor:         product?.badgeColor         || 'bg-amber-600',
    description:        product?.description        || '',
    origin:             product?.origin             || '',
    inStock:            product?.inStock            !== false,
    featured:           product?.featured           || false,
  });

  const [imagePreview,  setImagePreview]  = useState(product?.image || '');
  const [imageBase64,   setImageBase64]   = useState('');   // new upload data-URL
  const [imageName,     setImageName]     = useState('');
  const [saving,        setSaving]        = useState(false);
  const [errors,        setErrors]        = useState({});

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  /* handle file pick */
  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5 MB.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageBase64(ev.target.result);        // full data-URL
      setImagePreview(ev.target.result);       // preview
      setImageName(file.name);
    };
    reader.readAsDataURL(file);
  };

  /* validate */
  const validate = () => {
    const e = {};
    if (!form.name.trim())         e.name        = 'Product name is required.';
    if (!form.pricePerKg)          e.pricePerKg  = 'Price per kg is required.';
    if (Number(form.pricePerKg) <= 0) e.pricePerKg = 'Price must be greater than 0.';
    return e;
  };

  /* submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      const { createProduct, updateProduct } = await import('../services/api');

      const payload = {
        ...form,
        pricePerKg:         Number(form.pricePerKg),
        originalPricePerKg: Number(form.originalPricePerKg || form.pricePerKg),
        imageBase64:        imageBase64 || undefined,
        imageName:          imageName   || undefined,
      };

      const res = isEdit
        ? await updateProduct(product.id, payload)
        : await createProduct(payload);

      if (res.success) {
        onSaved(res.data, isEdit);
        onClose();
      } else {
        alert(res.message || 'Save failed. Please try again.');
      }
    } catch (err) {
      alert('Network error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  /* field helper */
  const Field = ({ label, error, children }) => (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-[10px] text-rose-600 mt-1 font-semibold">{error}</p>}
    </div>
  );

  const inputCls = (err) =>
    `w-full px-3 py-2.5 text-xs rounded-xl border ${err ? 'border-rose-400' : 'border-gray-200'} bg-white focus:outline-none focus:ring-2 focus:ring-emerald-800/30 transition`;

  return (
    <div className="fixed inset-0 bg-black/70 z-[150] flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-4 shadow-2xl border border-gray-200">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100" style={{ background: S }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,.2)' }}>
              {isEdit ? <Edit className="w-4 h-4 text-amber-400" /> : <span className="text-amber-400 font-black text-lg leading-none">+</span>}
            </div>
            <div>
              <h2 className="text-sm font-black text-white">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
              <p className="text-[10px] text-emerald-300">{isEdit ? `Editing: ${product.name}` : 'Add to Nayyab Dry Fruit catalog'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition rounded-lg p-1">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Image upload */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Product Image</label>
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="preview"
                    onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = GENERIC_FALLBACK; }}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-2">
                    <span className="text-2xl block">🖼️</span>
                    <p className="text-[9px] text-gray-400 mt-1">No image</p>
                  </div>
                )}
              </div>

              {/* Upload area */}
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center w-full h-24 rounded-2xl border-2 border-dashed border-gray-200 hover:border-emerald-400 cursor-pointer bg-gray-50 hover:bg-emerald-50/30 transition">
                  <span className="text-2xl mb-1">📁</span>
                  <span className="text-xs font-semibold text-gray-600">Click to upload image</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WEBP · Max 5 MB</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
                </label>
                {imageName && (
                  <p className="text-[10px] text-emerald-700 font-semibold mt-1.5">✓ {imageName}</p>
                )}
                {!imageName && isEdit && product?.image && (
                  <p className="text-[10px] text-gray-400 mt-1.5">Current: {product.image}</p>
                )}
              </div>
            </div>
          </div>

          {/* Name + Subtitle row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Product Name *" error={errors.name}>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="e.g. Royal Roasted Kaju" className={inputCls(errors.name)} />
            </Field>
            <Field label="Subtitle / Short Description">
              <input type="text" value={form.subtitle} onChange={e => set('subtitle', e.target.value)}
                placeholder="e.g. Crisp Jumbo Cashews" className={inputCls()} />
            </Field>
          </div>

          {/* Category + Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category *">
              <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls()}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </Field>
            <Field label="Badge Text">
              <input type="text" value={form.badge} onChange={e => set('badge', e.target.value)}
                placeholder="e.g. Special Rate / New Arrival" className={inputCls()} />
            </Field>
          </div>

          {/* Badge color */}
          <Field label="Badge Color">
            <div className="flex flex-wrap gap-2 mt-1">
              {BADGE_COLORS.map(bc => (
                <button key={bc.value} type="button"
                  onClick={() => set('badgeColor', bc.value)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition
                    ${form.badgeColor === bc.value ? 'border-gray-800 ring-2 ring-offset-1 ring-gray-800' : 'border-gray-200 hover:border-gray-400'}`}>
                  <span className={`w-3.5 h-3.5 rounded-full ${bc.value}`} />
                  {bc.label}
                </button>
              ))}
            </div>
          </Field>

          {/* Price / kg + Original price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Price per KG (Rs.) *" error={errors.pricePerKg}>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">Rs.</span>
                <input type="number" min="1" value={form.pricePerKg} onChange={e => set('pricePerKg', e.target.value)}
                  placeholder="4000" className={inputCls(errors.pricePerKg) + ' pl-9'} />
              </div>
            </Field>
            <Field label="Original / MRP Price (Rs.) — for discount display">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">Rs.</span>
                <input type="number" min="1" value={form.originalPricePerKg} onChange={e => set('originalPricePerKg', e.target.value)}
                  placeholder="4600" className={inputCls() + ' pl-9'} />
              </div>
            </Field>
          </div>

          {/* Origin */}
          <Field label="Origin / Source">
            <input type="text" value={form.origin} onChange={e => set('origin', e.target.value)}
              placeholder="e.g. Kandahar, Afghanistan" className={inputCls()} />
          </Field>

          {/* Description */}
          <Field label="Description">
            <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Brief product description for the storefront…"
              className={inputCls() + ' resize-none'} />
          </Field>

          {/* In Stock + Featured toggles */}
          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div onClick={() => set('inStock', !form.inStock)}
                className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${form.inStock ? 'bg-emerald-600' : 'bg-gray-300'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.inStock ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
              <span className="text-xs font-bold text-gray-700">In Stock</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <div onClick={() => set('featured', !form.featured)}
                className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${form.featured ? 'bg-amber-500' : 'bg-gray-300'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.featured ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
              <span className="text-xs font-bold text-gray-700">Featured on Storefront</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-xl text-xs font-bold text-white shadow-md transition hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: SA }}>
              {saving
                ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Saving…</>
                : <><CheckCircle2 className="w-3.5 h-3.5" />{isEdit ? 'Save Changes' : 'Add Product'}</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



/* ══════════════════════════════════════════════════════════
   PAGE: CUSTOMERS
══════════════════════════════════════════════════════════ */
function CustomersPage({ orders }) {
  const [search, setSearch] = useState('');

  const customers = useMemo(() => {
    const map = {};
    orders.forEach(o => {
      const c   = o.customer || o;
      const key = (c.phone || '').replace(/\s/g,'');
      if (!key) return;
      if (!map[key]) {
        map[key] = { name: c.name, phone: c.phone, city: c.city, orders: 0, totalSpent: 0, lastOrder: o.createdAt, status: o.status };
      }
      map[key].orders++;
      map[key].totalSpent += Number(o.total || 0);
      if (new Date(o.createdAt) > new Date(map[key].lastOrder)) {
        map[key].lastOrder = o.createdAt;
        map[key].status    = o.status;
      }
    });
    return Object.values(map).sort((a,b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filtered = useMemo(() =>
    customers.filter(c => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return c.name?.toLowerCase().includes(q) || c.phone?.includes(q) || c.city?.toLowerCase().includes(q);
    }), [customers, search]);

  const topSpender = customers[0];

  return (
    <div className="p-4 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-gray-900">Customers</h1>
          <p className="text-xs text-gray-500 mt-0.5">{customers.length} unique customers from orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'Total Customers', value: customers.length,                                                     icon:<Users className="w-4 h-4 text-blue-600" />,    bg:'bg-blue-100'    },
          { label:'Top City',        value: customers.length ? (customers.sort((a,b)=>b.totalSpent-a.totalSpent)[0]?.city||'—') : '—', icon:<MapPin className="w-4 h-4 text-purple-600" />, bg:'bg-purple-100'  },
          { label:'Top Spender',     value: topSpender ? `Rs.${(topSpender.totalSpent/1000).toFixed(1)}k` : '—', icon:<Award className="w-4 h-4 text-amber-600" />,   bg:'bg-amber-100'   },
          { label:'Repeat Buyers',   value: customers.filter(c=>c.orders>1).length,                               icon:<Heart className="w-4 h-4 text-rose-600" />,    bg:'bg-rose-100'    },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.bg}`}>{s.icon}</div>
            <div>
              <p className="text-[10px] text-gray-500 font-semibold">{s.label}</p>
              <p className="text-lg font-black text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-black text-gray-900">Customer List</h3>
          <div className="relative ml-auto">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search customers…"
              className="w-56 pl-9 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900/30" />
            {search && <button onClick={() => setSearch('')} className="absolute right-2.5 top-2 text-gray-400 text-xs">✕</button>}
          </div>
        </div>

        {customers.length === 0 ? (
          <div className="py-20 text-center"><Users className="w-10 h-10 text-gray-200 mx-auto mb-2" /><p className="text-sm text-gray-500">No customer data yet</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-wider text-gray-400 bg-gray-50/70 border-b border-gray-100">
                  {['#','Customer Name','Phone','City','Total Orders','Total Spent','Last Order','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((c, i) => (
                  <tr key={c.phone} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {i === 0
                        ? <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black" style={{background:AMB,color:S}}>1</span>
                        : <span className="text-xs text-gray-500 font-semibold">{i+1}</span>
                      }
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                             style={{ background: SA, color: '#fff' }}>
                          {(c.name||'?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">{c.name}</p>
                          {c.orders > 1 && <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1 rounded">Repeat</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-xs font-semibold text-gray-700">{c.phone}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-gray-700 font-medium">{c.city || '—'}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black"
                            style={{background:'#f0fdf4',color:'#166534',border:'1px solid #bbf7d0'}}>
                        {c.orders}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-black text-emerald-800">Rs. {c.totalSpent.toLocaleString('en-PK')}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-xs text-gray-600">
                        {new Date(c.lastOrder).toLocaleDateString('en-PK',{day:'2-digit',month:'short',year:'2-digit'})}
                      </p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <a href={`tel:${c.phone}`} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition" title="Call">
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <a href={`https://wa.me/${(c.phone||'').replace(/[^0-9]/g,'').replace(/^0/,'92')}`} target="_blank" rel="noreferrer"
                           className="p-1.5 rounded-lg text-white transition hover:opacity-80" style={{background:'#25D366'}} title="WhatsApp">
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-3 border-t border-gray-100 text-[11px] text-gray-400">
          {filtered.length} of {customers.length} customers
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE: ANALYTICS
══════════════════════════════════════════════════════════ */
function AnalyticsPage({ stats, orders }) {
  /* Revenue by status */
  const revenueBreakdown = useMemo(() => [
    { label:'Delivered', value: orders.filter(o=>o.status==='delivered').reduce((s,o)=>s+Number(o.total||0),0),  color:'#059669' },
    { label:'Confirmed', value: orders.filter(o=>o.status==='confirmed').reduce((s,o)=>s+Number(o.total||0),0),  color:'#2563eb' },
    { label:'Pending',   value: orders.filter(o=>o.status==='pending').reduce((s,o)=>s+Number(o.total||0),0),    color:AMB       },
    { label:'Shipped',   value: orders.filter(o=>o.status==='shipped').reduce((s,o)=>s+Number(o.total||0),0),    color:'#7c3aed' },
    { label:'Cancelled', value: orders.filter(o=>o.status==='cancelled').reduce((s,o)=>s+Number(o.total||0),0),  color:'#e11d48' },
  ].filter(x=>x.value>0), [orders]);

  /* Orders by city */
  const byCity = useMemo(() => {
    const map = {};
    orders.forEach(o => { const c = o.customer?.city||o.city||'Unknown'; map[c]=(map[c]||0)+1; });
    return Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,8);
  }, [orders]);

  /* Orders by payment method */
  const byPayment = useMemo(() => {
    const map = {};
    orders.forEach(o => { const p=(o.paymentMethod||'COD').replace('Cash on Delivery (COD)','COD').replace('JazzCash / EasyPaisa / Bank','JazzCash'); map[p]=(map[p]||0)+1; });
    return Object.entries(map).sort((a,b)=>b[1]-a[1]);
  }, [orders]);

  /* Products sold count */
  const topProducts = useMemo(() => {
    const map = {};
    orders.forEach(o=>(o.items||[]).forEach(item=>{
      map[item.name]=(map[item.name]||0)+Number(item.quantity||1);
    }));
    return Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,8);
  }, [orders]);

  const maxCity    = byCity[0]?.[1]    || 1;
  const maxProduct = topProducts[0]?.[1] || 1;

  const deliveryRate = stats.totalOrders > 0
    ? ((stats.deliveredOrders / stats.totalOrders) * 100).toFixed(1)
    : 0;
  const cancellationRate = stats.totalOrders > 0
    ? ((stats.cancelledOrders / stats.totalOrders) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg font-black text-gray-900">Analytics & Insights</h1>
        <p className="text-xs text-gray-500 mt-0.5">Business performance overview for {STORE_INFO.name}</p>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Total Revenue</p>
          <p className="text-2xl font-black text-emerald-800 mt-1">Rs. {stats.totalRevenue.toLocaleString('en-PK')}</p>
          <p className="text-[10px] text-gray-400 mt-1">Excl. cancelled orders</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Avg Order Value</p>
          <p className="text-2xl font-black text-blue-800 mt-1">Rs. {stats.avgOrder.toLocaleString('en-PK')}</p>
          <p className="text-[10px] text-gray-400 mt-1">Per order average</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Delivery Rate</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">{deliveryRate}%</p>
          <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500" style={{width:`${deliveryRate}%`}} />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">Cancellation Rate</p>
          <p className="text-2xl font-black text-rose-700 mt-1">{cancellationRate}%</p>
          <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full bg-rose-500" style={{width:`${cancellationRate}%`}} />
          </div>
        </div>
      </div>

      {/* 2-col section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Revenue by Status */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-black text-gray-900 mb-4">Revenue by Order Status</h3>
          {revenueBreakdown.length === 0
            ? <p className="text-sm text-gray-400 text-center py-8">No revenue data</p>
            : (
              <div className="space-y-3">
                {revenueBreakdown.map(item => {
                  const pct = stats.totalRevenue > 0 ? (item.value/stats.totalRevenue*100).toFixed(1) : 0;
                  return (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{background:item.color}} />
                          <span className="text-xs font-semibold text-gray-700">{item.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-gray-900">Rs. {item.value.toLocaleString('en-PK')}</span>
                          <span className="text-[10px] text-gray-400 ml-1">({pct}%)</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{width:`${pct}%`, background:item.color}} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          }
        </div>

        {/* Orders by Status donut-like summary */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-black text-gray-900 mb-4">Order Status Distribution</h3>
          <div className="space-y-2.5">
            {[
              { label:'Pending',   value: stats.pendingOrders,   color:'bg-amber-500',  textColor:'text-amber-700'  },
              { label:'Confirmed', value: stats.confirmedOrders, color:'bg-blue-500',   textColor:'text-blue-700'   },
              { label:'Shipped',   value: stats.shippedOrders,   color:'bg-purple-500', textColor:'text-purple-700' },
              { label:'Delivered', value: stats.deliveredOrders, color:'bg-emerald-500',textColor:'text-emerald-700'},
              { label:'Cancelled', value: stats.cancelledOrders, color:'bg-rose-500',   textColor:'text-rose-700'   },
            ].map(item => {
              const pct = stats.totalOrders > 0 ? Math.round(item.value/stats.totalOrders*100) : 0;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-gray-600 w-20 shrink-0">{item.label}</span>
                  <div className="flex-1 h-6 rounded-lg bg-gray-100 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-lg flex items-center px-2 transition-all duration-500`}
                         style={{width: `${Math.max(pct,4)}%`}}>
                      {pct >= 10 && <span className="text-[9px] font-black text-white">{pct}%</span>}
                    </div>
                  </div>
                  <span className={`text-sm font-black w-6 text-right ${item.textColor}`}>{item.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Orders by City */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-black text-gray-900 mb-4">Top Delivery Cities</h3>
          {byCity.length === 0
            ? <p className="text-sm text-gray-400 text-center py-8">No data yet</p>
            : (
              <div className="space-y-2.5">
                {byCity.map(([city, count], i) => (
                  <div key={city} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
                          style={{background: i===0 ? AMB : '#e5e7eb', color: i===0 ? S : '#6b7280'}}>{i+1}</span>
                    <span className="text-xs font-semibold text-gray-700 w-20 shrink-0 truncate">{city}</span>
                    <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{width:`${(count/maxCity)*100}%`, background: SA}} />
                    </div>
                    <span className="text-xs font-black text-gray-700 w-8 text-right shrink-0">{count}</span>
                  </div>
                ))}
              </div>
            )
          }
        </div>

        {/* Top Products Sold */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-black text-gray-900 mb-4">Top Products by Quantity Sold</h3>
          {topProducts.length === 0
            ? <p className="text-sm text-gray-400 text-center py-8">No data yet</p>
            : (
              <div className="space-y-2.5">
                {topProducts.map(([name, qty], i) => (
                  <div key={name} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
                          style={{background: i===0 ? AMB : '#e5e7eb', color: i===0 ? S : '#6b7280'}}>{i+1}</span>
                    <span className="text-xs font-semibold text-gray-700 flex-1 truncate">{name}</span>
                    <div className="w-20 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{width:`${(qty/maxProduct)*100}%`, background:AMB}} />
                    </div>
                    <span className="text-xs font-black text-gray-700 w-8 text-right shrink-0">{qty}</span>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>

      {/* Payment Method breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-black text-gray-900 mb-4">Payment Method Breakdown</h3>
        {byPayment.length === 0
          ? <p className="text-sm text-gray-400">No payment data</p>
          : (
            <div className="flex flex-wrap gap-4">
              {byPayment.map(([method, count]) => (
                <div key={method} className="flex-1 min-w-[140px] bg-gray-50 rounded-xl border border-gray-200 p-4 text-center">
                  <p className="text-2xl font-black text-gray-900">{count}</p>
                  <p className="text-xs font-semibold text-gray-600 mt-1">{method}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {stats.totalOrders > 0 ? ((count/stats.totalOrders)*100).toFixed(1) : 0}% of orders
                  </p>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
/* ══════════════════════════════════════════════════════════
   PAGE: BULK INQUIRIES
══════════════════════════════════════════════════════════ */
function BulkInquiriesPage() {
  const [inquiries,  setInquiries]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [notify,     setNotify]     = useState(null);

  const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

  const toast = (msg, type = 'success') => {
    setNotify({ msg, type });
    setTimeout(() => setNotify(null), 4000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/bulk-inquiries`);
      const data = await res.json();
      if (data.success) setInquiries(data.data || []);
    } catch { /* backend offline */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API}/bulk-inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setInquiries(prev => prev.map(i => i._id === id ? { ...i, status } : i));
      toast(`Inquiry marked as ${status}.`);
    } catch { toast('Update failed.', 'error'); }
  };

  const deleteInquiry = async (id) => {
    try {
      await fetch(`${API}/bulk-inquiries/${id}`, { method: 'DELETE' });
      setInquiries(prev => prev.filter(i => i._id !== id));
      toast('Inquiry deleted.');
    } catch { toast('Delete failed.', 'error'); }
  };

  const STATUS_PILL = {
    new:       'bg-blue-100 text-blue-800 border-blue-300',
    contacted: 'bg-amber-100 text-amber-800 border-amber-300',
    closed:    'bg-gray-100 text-gray-700 border-gray-300',
  };

  const filtered = inquiries.filter(i => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (i.name||'').toLowerCase().includes(q)
      || (i.phone||'').includes(q)
      || (i.city||'').toLowerCase().includes(q)
      || (i.shopName||'').toLowerCase().includes(q);
  });

  return (
    <div className="p-4 sm:p-6 space-y-4">
      {notify && (
        <div className={`fixed top-4 right-4 z-[200] px-4 py-3 rounded-xl shadow-2xl border text-xs font-bold flex items-center gap-2 max-w-xs
          ${notify.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {notify.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-gray-900">Wholesale / Bulk Inquiries</h1>
          <p className="text-xs text-gray-500 mt-0.5">{inquiries.length} total inquiries</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white rounded-xl transition"
          style={{ background: SA }}>
          <RefreshCw className="w-3.5 h-3.5" />Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'New',       value: inquiries.filter(i=>i.status==='new').length,       color: 'bg-blue-100 text-blue-700'   },
          { label: 'Contacted', value: inquiries.filter(i=>i.status==='contacted').length, color: 'bg-amber-100 text-amber-700' },
          { label: 'Closed',    value: inquiries.filter(i=>i.status==='closed').length,    color: 'bg-gray-100 text-gray-700'   },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 ${s.color} border border-current/20`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Search */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, phone, city…"
              className="w-full pl-9 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900/30" />
            {search && <button onClick={() => setSearch('')} className="absolute right-2.5 top-2 text-gray-400 text-xs">✕</button>}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center"><RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-emerald-700" /><p className="text-sm text-gray-500">Loading…</p></div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center"><Package className="w-10 h-10 text-gray-200 mx-auto mb-2" /><p className="text-sm text-gray-500">No bulk inquiries yet.</p></div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(inq => (
              <div key={inq._id} className="p-4 hover:bg-gray-50/60 transition">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black text-gray-900">{inq.name}</p>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${STATUS_PILL[inq.status] || STATUS_PILL.new}`}>
                        {(inq.status||'new').charAt(0).toUpperCase() + (inq.status||'new').slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 font-semibold">{inq.phone} · {inq.city}</p>
                    {inq.shopName && <p className="text-[10px] text-gray-500">🏪 {inq.shopName}</p>}
                    {inq.eventName && <p className="text-[10px] text-gray-500">🎉 {inq.eventName}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-gray-700">{inq.quantityKg} KG required</p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(inq.createdAt).toLocaleDateString('en-PK',{day:'2-digit',month:'short',year:'2-digit'})}
                    </p>
                  </div>
                </div>

                {inq.items && inq.items.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {inq.items.map(item => (
                      <span key={item} className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-semibold">{item}</span>
                    ))}
                  </div>
                )}
                {inq.notes && <p className="text-xs text-gray-600 italic mb-2">"{inq.notes}"</p>}

                <div className="flex items-center gap-2 mt-2">
                  <a href={`https://wa.me/${(inq.phone||'').replace(/\D/g,'').replace(/^0/,'92')}`}
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white transition hover:opacity-80"
                    style={{ background: '#25D366' }}>
                    💬 WhatsApp
                  </a>
                  <a href={`tel:${inq.phone}`}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                    <Phone className="w-3.5 h-3.5" /> Call
                  </a>
                  {inq.status === 'new' && (
                    <button onClick={() => updateStatus(inq._id, 'contacted')}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 transition">
                      Mark Contacted
                    </button>
                  )}
                  {inq.status === 'contacted' && (
                    <button onClick={() => updateStatus(inq._id, 'closed')}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
                      Close
                    </button>
                  )}
                  <button onClick={() => deleteInquiry(inq._id)}
                    className="ml-auto px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="px-4 py-3 border-t border-gray-100 text-[11px] text-gray-400">
          {filtered.length} of {inquiries.length} inquiries
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE: REVIEWS
   Loads from GET /api/reviews, lets admin approve/reject/delete.
   Every data access is guarded so a blank screen is impossible.
══════════════════════════════════════════════════════════ */
function ReviewsPage() {
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const [reviews,   setReviews]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filterTab, setFilterTab] = useState('all');   // all | pending | approved | rejected
  const [search,    setSearch]    = useState('');
  const [toast,     setToast]     = useState(null);    // { msg, type }

  /* ── toast helper ── */
  const notify = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  /* ── fetch all reviews (no status filter — admin sees everything) ── */
  const loadReviews = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/reviews`);
      const data = await res.json();
      /* ✅ safe: always fall back to [] */
      setReviews(Array.isArray(data?.data) ? data.data : []);
    } catch {
      setReviews([]);
      notify('Could not load reviews — backend may be offline.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReviews(); }, []);

  /* ── approve / reject / pending ── */
  const updateStatus = async (id, status) => {
    try {
      const res  = await fetch(`${API}/reviews/${id}/status`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data?.success) {
        setReviews(prev =>
          Array.isArray(prev)
            ? prev.map(r => r._id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r)
            : []
        );
        notify(`Review marked as ${status}.`);
      } else {
        notify(data?.message || 'Update failed.', 'error');
      }
    } catch {
      notify('Server error — could not update status.', 'error');
    }
  };

  /* ── delete ── */
  const deleteReview = async (id) => {
    try {
      const res  = await fetch(`${API}/reviews/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data?.success) {
        setReviews(prev => Array.isArray(prev) ? prev.filter(r => r._id !== id) : []);
        notify('Review deleted.');
      } else {
        notify(data?.message || 'Delete failed.', 'error');
      }
    } catch {
      notify('Server error — could not delete.', 'error');
    }
  };

  /* ── derived: filtered list ── */
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  const filtered = safeReviews.filter(r => {
    if (!r || typeof r !== 'object') return false;
    if (filterTab !== 'all' && (r.status || 'pending') !== filterTab) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (r.customerName || '').toLowerCase().includes(q)
          || (r.productName  || '').toLowerCase().includes(q)
          || (r.comment      || '').toLowerCase().includes(q);
    }
    return true;
  });

  /* ── counts ── */
  const counts = {
    all:      safeReviews.length,
    pending:  safeReviews.filter(r => (r?.status || 'pending') === 'pending').length,
    approved: safeReviews.filter(r => r?.status === 'approved').length,
    rejected: safeReviews.filter(r => r?.status === 'rejected').length,
  };

  /* ── status pill styles ── */
  const PILL = {
    pending:  'bg-amber-100 text-amber-800 border-amber-300',
    approved: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    rejected: 'bg-rose-100 text-rose-800 border-rose-300',
  };

  /* ── star renderer ── */
  const Stars = ({ rating }) => (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(n => (
        <Star key={n}
          className={`w-3.5 h-3.5 ${n <= (Number(rating) || 0) ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`}
        />
      ))}
    </span>
  );

  /* ── render ── */
  return (
    <div className="p-4 sm:p-6 space-y-4">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[200] px-4 py-3 rounded-xl shadow-2xl border text-xs font-bold flex items-center gap-2 max-w-xs
          ${toast.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'}`}>
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-gray-900">Customer Reviews</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Approve or reject product reviews before they appear on the storefront.
          </p>
        </div>
        <button onClick={loadReviews}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white rounded-xl transition hover:opacity-90"
          style={{ background: SA }}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Reviews', value: counts.all,      icon: <MessageSquare className="w-4 h-4 text-blue-600" />,    bg: 'bg-blue-100'    },
          { label: 'Pending',       value: counts.pending,  icon: <Clock className="w-4 h-4 text-amber-600" />,           bg: 'bg-amber-100',  valueColor: 'text-amber-700' },
          { label: 'Approved',      value: counts.approved, icon: <ThumbsUp className="w-4 h-4 text-emerald-600" />,      bg: 'bg-emerald-100',valueColor: 'text-emerald-700' },
          { label: 'Rejected',      value: counts.rejected, icon: <ThumbsDown className="w-4 h-4 text-rose-600" />,       bg: 'bg-rose-100',   valueColor: 'text-rose-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.bg}`}>{s.icon}</div>
            <div>
              <p className="text-[10px] text-gray-500 font-semibold">{s.label}</p>
              <p className={`text-xl font-black ${s.valueColor || 'text-gray-900'}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Filter tabs + search */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 border-b border-gray-100">
          <div className="flex flex-wrap gap-1">
            {(['all','pending','approved','rejected']).map(tab => (
              <button key={tab} onClick={() => setFilterTab(tab)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition border capitalize
                  ${filterTab === tab ? 'text-white border-transparent' : 'text-gray-600 bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                style={filterTab === tab ? { background: S } : {}}>
                {tab}
                <span className={`text-[10px] font-black px-1 rounded-full ${filterTab === tab ? 'bg-amber-400 text-gray-900' : 'bg-gray-200 text-gray-700'}`}>
                  {counts[tab]}
                </span>
              </button>
            ))}
          </div>

          <div className="relative sm:ml-auto">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search customer, product, comment…"
              className="w-full sm:w-64 pl-9 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900/30" />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-2 text-gray-400 text-xs">✕</button>
            )}
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-7 h-7 text-emerald-700 animate-spin mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-500">Loading reviews…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-500">No reviews found</p>
            <p className="text-xs text-gray-400 mt-1">
              {safeReviews.length === 0
                ? 'No customers have submitted reviews yet.'
                : `No reviews match the current filter or search.`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map(review => {
              /* ✅ guard every field access */
              const id          = review?._id          || '';
              const name        = review?.customerName || 'Anonymous';
              const product     = review?.productName  || 'Unknown Product';
              const rating      = Number(review?.rating) || 0;
              const comment     = review?.comment      || '';
              const status      = review?.status       || 'pending';
              const createdAt   = review?.createdAt    || '';

              return (
                <div key={id} className="p-4 hover:bg-gray-50/60 transition">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    {/* Left: reviewer info */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                           style={{ background: SA, color: '#fff' }}>
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{name}</p>
                        <p className="text-[10px] text-gray-500 truncate">on <span className="font-semibold text-gray-700">{product}</span></p>
                        <div className="flex items-center gap-2 mt-1">
                          <Stars rating={rating} />
                          <span className="text-[10px] text-gray-400 font-semibold">{rating}/5</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: status + date */}
                    <div className="shrink-0 text-right">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border ${PILL[status] || PILL.pending}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                      {createdAt && (
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: '2-digit' })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Comment */}
                  {comment && (
                    <p className="text-xs text-gray-600 bg-gray-50 rounded-xl px-3 py-2 mb-3 leading-relaxed border border-gray-100">
                      "{comment}"
                    </p>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {status !== 'approved' && (
                      <button onClick={() => updateStatus(id, 'approved')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition">
                        <ThumbsUp className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}
                    {status !== 'rejected' && (
                      <button onClick={() => updateStatus(id, 'rejected')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition">
                        <ThumbsDown className="w-3.5 h-3.5" /> Reject
                      </button>
                    )}
                    {status !== 'pending' && (
                      <button onClick={() => updateStatus(id, 'pending')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition">
                        <Clock className="w-3.5 h-3.5" /> Reset to Pending
                      </button>
                    )}
                    <button onClick={() => deleteReview(id)}
                      className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-gray-200 transition">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {!loading && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <span>
              Showing <strong className="text-gray-700">{filtered.length}</strong> of{' '}
              <strong className="text-gray-700">{safeReviews.length}</strong> reviews
            </span>
            <span>Auto-moderated — only Approved reviews appear on the storefront</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SHARED: KPI Card
────────────────────────────────────────────── */
function KpiCard({ icon, iconBg, label, value, sub, valueColor = 'text-gray-900', dark = false }) {
  if (dark) {
    return (
      <div className="rounded-2xl p-4 text-white shadow-md" style={{background:`linear-gradient(135deg,${S} 0%,${SA} 100%)`}}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'rgba(245,158,11,.18)'}}>{icon}</div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">{label}</span>
        </div>
        <p className="text-xl font-black text-white">{value}</p>
        {sub && <p className="text-[10px] mt-0.5 text-emerald-400">{sub}</p>}
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}>{icon}</div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</span>
      </div>
      <p className={`text-2xl font-black ${valueColor}`}>{value}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}
