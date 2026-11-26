/**
 * authController.js
 * Admin authentication using MongoDB Atlas User model (with .env fallback).
 * Tokens are HMAC-SHA256 signed payloads — no external library required.
 */
const crypto = require('crypto');
const User   = require('../models/User');

const TOKEN_TTL_HOURS = 24;

/* ── helpers ─────────────────────────────────────────────── */
const b64url = (obj) =>
  Buffer.from(JSON.stringify(obj)).toString('base64url');

const sign = (header, payload, secret) => {
  const data = `${b64url(header)}.${b64url(payload)}`;
  const sig  = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  return `${data}.${sig}`;
};

const verify = (token, secret) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [h, p, sig] = parts;
    const expected = crypto.createHmac('sha256', secret).update(`${h}.${p}`).digest('base64url');
    const eSig = Buffer.from(expected);
    const rSig = Buffer.from(sig);
    if (eSig.length !== rSig.length) return null;
    if (!crypto.timingSafeEqual(eSig, rSig)) return null;
    const payload = JSON.parse(Buffer.from(p, 'base64url').toString('utf8'));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null; // expired
    return payload;
  } catch {
    return null;
  }
};

/* ── Auto-seed default admin into MongoDB Atlas ───────────── */
const ensureDefaultAdmin = async () => {
  try {
    const defaultUser = (process.env.ADMIN_USERNAME || 'hafiz_sumair').trim().toLowerCase();
    const defaultPass = process.env.ADMIN_PASSWORD || 'nayyab@2026';

    const existing = await User.findOne({ username: defaultUser });
    if (!existing) {
      await User.create({
        username: defaultUser,
        password: defaultPass,
        name:     'Hafiz Sumair',
        role:     'admin',
      });
      console.log(`[Auth] Default admin '${defaultUser}' saved in MongoDB Atlas 'users' collection.`);
    }
  } catch (err) {
    console.warn('[Auth] ensureDefaultAdmin warning:', err.message);
  }
};

/* ── POST /api/auth/login ────────────────────────────────── */
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  const cleanUser = username.trim().toLowerCase();
  const secret    = process.env.JWT_SECRET || 'nayyab_dry_fruit_super_secret_key_2026_hafiz_sumair';

  try {
    // 1. Search in MongoDB Atlas 'users' collection
    let user = await User.findOne({ username: cleanUser });

    // 2. If table is empty or first run, auto-populate from env credentials
    if (!user) {
      const defaultUser = (process.env.ADMIN_USERNAME || 'hafiz_sumair').trim().toLowerCase();
      const defaultPass = process.env.ADMIN_PASSWORD || 'nayyab@2026';

      if (cleanUser === defaultUser && password === defaultPass) {
        user = await User.create({
          username: defaultUser,
          password: defaultPass,
          name:     'Hafiz Sumair',
          role:     'admin',
        });
        console.log(`[Auth] Created user in MongoDB Atlas: ${defaultUser}`);
      }
    }

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Incorrect username or password.' });
    }

    const now     = Math.floor(Date.now() / 1000);
    const header  = { alg: 'HS256', typ: 'NAYYAB' };
    const payload = {
      sub:      user._id,
      username: user.username,
      role:     user.role,
      iat:      now,
      exp:      now + TOKEN_TTL_HOURS * 3600,
    };
    const token = sign(header, payload, secret);

    return res.json({
      success:   true,
      message:   'Login successful.',
      token,
      expiresIn: TOKEN_TTL_HOURS * 3600, // seconds
      admin:     { username: user.username, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error('[Auth Error]', err.message);

    // Fallback authentication via .env if database is temporarily unreachable
    const validUser = (process.env.ADMIN_USERNAME || 'hafiz_sumair').trim().toLowerCase();
    const validPass = process.env.ADMIN_PASSWORD || 'nayyab@2026';

    if (cleanUser === validUser && password === validPass) {
      const now     = Math.floor(Date.now() / 1000);
      const header  = { alg: 'HS256', typ: 'NAYYAB' };
      const payload = {
        sub:      'admin',
        username: validUser,
        role:     'admin',
        iat:      now,
        exp:      now + TOKEN_TTL_HOURS * 3600,
      };
      const token = sign(header, payload, secret);

      return res.json({
        success:   true,
        message:   'Login successful (env fallback).',
        token,
        expiresIn: TOKEN_TTL_HOURS * 3600,
        admin:     { username: validUser, name: 'Hafiz Sumair', role: 'admin' },
      });
    }

    return res.status(500).json({ success: false, message: 'Server auth error: ' + err.message });
  }
};

/* ── POST /api/auth/verify ───────────────────────────────── */
const verifyToken = (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token      = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided.' });
  }

  const payload = verify(token, process.env.JWT_SECRET || 'nayyab_dry_fruit_super_secret_key_2026_hafiz_sumair');
  if (!payload) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired.' });
  }

  res.json({ success: true, message: 'Token is valid.', payload });
};

module.exports = { login, verifyToken, verify, ensureDefaultAdmin };
