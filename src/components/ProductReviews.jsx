/**
 * ProductReviews.jsx
 * Customer-facing review submission + display component.
 * Used inside QuickViewModal (or any product detail view).
 */
import React, { useState, useEffect } from 'react';
import { Star, Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/* ── star rating input ── */
function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110 active:scale-95"
          aria-label={`${n} star${n !== 1 ? 's' : ''}`}>
          <Star className={`w-6 h-6 transition-colors ${
            n <= (hovered || value) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
          }`} />
        </button>
      ))}
      {value > 0 && (
        <span className="text-xs font-bold text-gray-600 ml-1">
          {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][value]}
        </span>
      )}
    </div>
  );
}

/* ── single review card ── */
function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black shrink-0">
            {review.customerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">{review.customerName}</p>
            <p className="text-[10px] text-gray-400">
              {new Date(review.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          {[1,2,3,4,5].map(n => (
            <Star key={n} className={`w-3.5 h-3.5 ${n <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`} />
          ))}
        </div>
      </div>
      {review.comment && (
        <p className="text-xs text-gray-600 leading-relaxed mt-1">{review.comment}</p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════ */
export function ProductReviews({ productId, productName }) {
  const [reviews,   setReviews]   = useState([]);
  const [loading,   setLoading]   = useState(true);

  /* form state */
  const [name,      setName]      = useState('');
  const [rating,    setRating]    = useState(0);
  const [comment,   setComment]   = useState('');
  const [submitting,setSubmitting]= useState(false);
  const [success,   setSuccess]   = useState(false);
  const [error,     setError]     = useState('');

  const fetchReviews = async () => {
    try {
      const res  = await fetch(`${API}/reviews?productId=${productId}&status=approved`);
      const data = await res.json();
      if (data.success) setReviews(data.data || []);
    } catch { /* backend offline */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, [productId]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim())   { setError('Please enter your name.');   return; }
    if (rating === 0)   { setError('Please select a star rating.'); return; }

    setSubmitting(true);
    try {
      const res  = await fetch(`${API}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, productName, customerName: name.trim(), rating, comment: comment.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setName(''); setRating(0); setComment('');
        setTimeout(() => setSuccess(false), 6000);
      } else {
        setError(data.message || 'Failed to submit. Please try again.');
      }
    } catch {
      setError('Could not connect to server. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-black text-gray-900">Customer Reviews</h4>
          {avgRating && (
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(n => (
                  <Star key={n} className={`w-4 h-4 ${n <= Math.round(Number(avgRating)) ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="text-sm font-black text-gray-900">{avgRating}</span>
              <span className="text-xs text-gray-500">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
            </div>
          )}
        </div>
      </div>

      {/* Existing reviews */}
      {loading ? (
        <div className="flex items-center gap-2 text-xs text-gray-500 py-4">
          <RefreshCw className="w-4 h-4 animate-spin" />Loading reviews…
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-xs text-gray-400 py-3 italic">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-3 mb-6 max-h-56 overflow-y-auto pr-1">
          {reviews.map(r => <ReviewCard key={r._id} review={r} />)}
        </div>
      )}

      {/* Submit form */}
      <div className="bg-amber-50/60 rounded-2xl border border-amber-200/70 p-4">
        <h5 className="text-xs font-black text-gray-800 mb-3">Write a Review</h5>

        {success ? (
          <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-800">Thank you for your review!</p>
              <p className="text-[10px] text-emerald-700 mt-0.5">It will appear after approval by our team.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Your Rating *</label>
              <StarInput value={rating} onChange={setRating} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Your Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Ahmed Khan"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/30 bg-white" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Review Comment (optional)</label>
              <textarea rows={2} value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Share your experience with this product…"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-800/30 bg-white resize-none" />
            </div>

            {error && (
              <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}
              </p>
            )}

            <button type="submit" disabled={submitting}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white transition hover:opacity-90 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: '#0F291E' }}>
              {submitting
                ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Submitting…</>
                : <><Send className="w-3.5 h-3.5" />Submit Review</>
              }
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
