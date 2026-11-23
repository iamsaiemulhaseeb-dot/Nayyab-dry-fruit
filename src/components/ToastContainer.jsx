import React from 'react';
import { useCart } from '../context/CartContext';

export const ToastContainer = () => {
  const { toasts } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-gray-900/95 backdrop-blur-md text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl shadow-2xl border border-amber-500/40 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-200"
        >
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

