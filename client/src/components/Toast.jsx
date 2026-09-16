import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-lg ${
        isSuccess 
          ? 'bg-slate-900/90 text-emerald-300 border-emerald-500/40' 
          : 'bg-slate-900/90 text-rose-300 border-rose-500/40'
      }`}>
        {isSuccess ? <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
        <span className="text-xs font-semibold text-white">{toast.message}</span>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
