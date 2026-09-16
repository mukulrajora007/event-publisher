import React from 'react';
import { Calendar, Plus, Database, Sparkles, SlidersHorizontal } from 'lucide-react';

export default function Navbar({ onOpenCreate, onOpenManage, healthInfo }) {
  const isSupabase = healthInfo?.supabaseConnected;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                EventSphere
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                Publisher
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Where extraordinary gatherings happen</p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-3">
          {/* Database Status Pill */}
          <div 
            title={isSupabase ? 'Connected to Supabase PostgreSQL' : 'Operating in local in-memory store. Connect Supabase by setting server/.env'}
            className={`hidden md:flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border ${
              isSupabase 
                ? 'bg-emerald-950/60 border-emerald-800/50 text-emerald-300' 
                : 'bg-amber-950/50 border-amber-800/50 text-amber-300'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="inline-block w-2 h-2 rounded-full bg-current animate-pulse"></span>
            <span>{isSupabase ? 'Supabase Connected' : 'Local Fallback Mode'}</span>
          </div>

          {/* Manage Events Button */}
          <button
            onClick={onOpenManage}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Manage Events</span>
          </button>

          {/* Publish Event CTA */}
          <button
            onClick={onOpenCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/25 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Event</span>
          </button>
        </div>

      </div>
    </header>
  );
}
