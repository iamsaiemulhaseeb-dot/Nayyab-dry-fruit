/**
 * authController.js
 * Admin authentication using credentials stored in .env.
 * Tokens are HMAC-SHA256 signed payloads — no external library required.
 *
 * Token format (base64url-encoded):
 *   header.payload.signature
 * where header = { alg:'HS256', typ:'NAYYAB' }
 *       payload = { sub:'admin', iat:<epoch-seconds>, exp:<epoch-seconds> }
 */
const crypto = require('crypto');

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
    // Constant-time comparison to prevent timing attacks
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

/* ── POST /api/auth/login ────────────────────────────────── */
const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  const validUser = process.env.ADMIN_USERNAME;
  const validPass = process.env.ADMIN_PASSWORD;
  const secret    = process.env.JWT_SECRET;

  if (!validUser || !validPass || !secret) {
    console.error('[Auth] ADMIN_USERNAME, ADMIN_PASSWORD or JWT_SECRET missing from .env');
    return res.status(500).json({ success: false, message: 'Server auth config error.' });
  }

  // Constant-time comparison to prevent timing attacks
  const userMatch = crypto.timingSafeEqual(
    Buffer.from(username, 'utf8'),
    Buffer.from(validUser, 'utf8').length === Buffer.from(username, 'utf8').length
      ? Buffer.from(validUser, 'utf8')
      : Buffer.from(username, 'utf8')  // same-length dummy so timingSafeEqual doesn't throw
  ) && username === validUser;

  const passMatch = crypto.timingSafeEqual(
    Buffer.from(password, 'utf8'),
    Buffer.from(validPass, 'utf8').length === Buffer.from(password, 'utf8').length
      ? Buffer.from(validPass, 'utf8')
      : Buffer.from(password, 'utf8')
  ) && password === validPass;

  if (!userMatch || !passMatch) {
    return res.status(401).json({ success: false, message: 'Incorrect username or password.' });
  }

  const now     = Math.floor(Date.now() / 1000);
  const header  = { alg: 'HS256', typ: 'NAYYAB' };
  const payload = { sub: 'admin', iat: now, exp: now + TOKEN_TTL_HOURS * 3600 };
  const token   = sign(header, payload, secret);

  res.json({
    success:   true,
    message:   'Login successful.',
    token,
    expiresIn: TOKEN_TTL_HOURS * 3600, // seconds
    admin:     { username: validUser },
  });
};

/* ── POST /api/auth/verify ───────────────────────────────── */
// Lightweight endpoint the frontend can call to check if a stored token is still valid.
const verifyToken = (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token      = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided.' });
  }

  const payload = verify(token, process.env.JWT_SECRET || '');
  if (!payload) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired.' });
  }

  res.json({ success: true, message: 'Token is valid.', payload });
};

module.exports = { login, verifyToken, verify };
