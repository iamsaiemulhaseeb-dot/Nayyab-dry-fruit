/**
 * AdminLoginPage.jsx
 * Luxury dark-green and gold admin login page for Nayyab Dry Fruit.
 * Authenticates against POST /api/auth/login on the backend.
 * On success stores the JWT in localStorage and redirects to /admin.
 */
import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, User, AlertCircle, ArrowLeft, ShieldCheck, Loader2 } from 'lucide-react';
import { adminLogin } from '../services/api';
import { STORE_INFO } from '../data/products';

/* ── brand colours ── */
const DARK  = '#0F291E';
const MID   = '#1a3d2b';
const GOLD  = '#f59e0b';
const GOLD2 = '#d97706';

/* ── auth token helpers (kept here so the page is self-contained) ── */
export const TOKEN_KEY     = 'nayyab_admin_token';
export const AUTH_FLAG_KEY = 'nayyab_admin_authenticated';

export const saveSession = (token) => {
  localStorage.setItem(TOKEN_KEY,     token);
  localStorage.setItem(AUTH_FLAG_KEY, 'true');
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(AUTH_FLAG_KEY);
};

export const isSessionValid = () =>
  localStorage.getItem(AUTH_FLAG_KEY) === 'true' &&
  !!localStorage.getItem(TOKEN_KEY);

/* ═══════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════ */
export const AdminLoginPage = ({ onLoginSuccess, onBackToStore }) => {
  const [username,    setUsername]    = useState('');
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [verifying,   setVerifying]   = useState(true);  // checking existing session on mount

  /* ── On mount: if a valid session already exists, skip login ── */
  useEffect(() => {
    if (isSessionValid()) {
      onLoginSuccess();
    } else {
      setVerifying(false);
    }
  }, []);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: `linear-gradient(135deg, ${DARK} 0%, #0a1f16 60%, #000 100%)` }}>
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  /* ── Form submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) { setError('Please enter your admin username.'); return; }
    if (!password)        { setError('Please enter your password.');        return; }

    setLoading(true);
    try {
      const res = await adminLogin(username.trim(), password);

      if (res.success && res.token) {
        saveSession(res.token);
        onLoginSuccess();
      } else {
        setError(res.message || 'Incorrect username or password. Please try again.');
        // Clear password on failure for security
        setPassword('');
      }
    } catch {
      setError('Could not reach the server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${DARK} 0%, #0a1f16 55%, #000 100%)` }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none"
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #f59e0b 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      {/* Floating decorative orbs */}
      <div className="absolute top-20 left-16 w-56 h-56 rounded-full opacity-5 blur-3xl"
           style={{ background: GOLD }} />
      <div className="absolute bottom-20 right-16 w-72 h-72 rounded-full opacity-5 blur-3xl"
           style={{ background: '#10b981' }} />

      {/* Back to store */}
      <button
        onClick={onBackToStore}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        Back to Storefront
      </button>

      {/* Card */}
      <div className="relative w-full max-w-md z-10">

        {/* Glowing border ring */}
        <div className="absolute -inset-px rounded-3xl opacity-40 blur-sm"
             style={{ background: `linear-gradient(135deg, ${GOLD}, transparent, ${GOLD2})` }} />

        <div className="relative rounded-3xl overflow-hidden shadow-2xl"
             style={{ background: 'linear-gradient(145deg, #1a2e22 0%, #0f1f17 100%)', border: '1px solid rgba(245,158,11,0.2)' }}>

          {/* Top gold accent bar */}
          <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, ${GOLD2}, transparent)` }} />

          <div className="px-8 pt-8 pb-10">

            {/* Logo + heading */}
            <div className="text-center mb-8">
              <div className="relative inline-flex">
                <div className="absolute inset-0 rounded-2xl blur-md opacity-50"
                     style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})` }} />
                <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-4"
                     style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})` }}>
                  🥜
                </div>
              </div>

              <div className="mt-1 mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border"
                      style={{ color: GOLD, borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.08)' }}>
                  Proprietor Panel
                </span>
              </div>

              <h1 className="font-serif text-2xl font-black text-white mt-3 tracking-tight">
                NAYYAB DRY FRUIT
              </h1>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Admin Dashboard — {STORE_INFO.proprietor}
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-7">
              <div className="flex-1 h-px" style={{ background: 'rgba(245,158,11,0.15)' }} />
              <ShieldCheck className="w-4 h-4" style={{ color: 'rgba(245,158,11,0.5)' }} />
              <div className="flex-1 h-px" style={{ background: 'rgba(245,158,11,0.15)' }} />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Username */}
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Admin Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5" style={{ color: 'rgba(245,158,11,0.6)' }} />
                  <input
                    type="text"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setError(''); }}
                    placeholder="Enter admin username"
                    autoComplete="username"
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border:     '1px solid rgba(245,158,11,0.2)',
                    }}
                    onFocus={e  => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.6)'; e.currentTarget.style.background = 'rgba(245,158,11,0.06)'; }}
                    onBlur={e   => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5" style={{ color: 'rgba(245,158,11,0.6)' }} />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border:     '1px solid rgba(245,158,11,0.2)',
                    }}
                    onFocus={e  => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.6)'; e.currentTarget.style.background = 'rgba(245,158,11,0.06)'; }}
                    onBlur={e   => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3.5 top-3 transition"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 rounded-xl px-3.5 py-3"
                     style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-rose-400 leading-snug">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-black text-sm transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2.5 shadow-xl mt-2"
                style={{
                  background:  loading ? MID : `linear-gradient(135deg, ${GOLD} 0%, ${GOLD2} 100%)`,
                  color:       DARK,
                  boxShadow:   `0 8px 24px rgba(245,158,11,0.3)`,
                }}
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" style={{ color: DARK }} /> Verifying…</>
                  : <><ShieldCheck className="w-4 h-4" /> Unlock Dashboard</>
                }
              </button>
            </form>

            {/* Footer note */}
            <p className="text-center text-[10px] mt-6" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Secure admin portal · {STORE_INFO.name} · Baghbanpura, Lahore
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
