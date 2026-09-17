import React from 'react';
import { Calendar, Plus, Database, Sparkles, SlidersHorizontal } from 'lucide-react';

export default function Navbar({ onOpenCreate, onOpenManage, healthInfo }) {
  const isSupabase = healthInfo?.supabaseConnected;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 p-[1px] shadow-lg shadow-indigo-500/20 flex-shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent truncate">
                EventSphere
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 hidden xs:inline-block">
                Publisher
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block truncate">Where extraordinary gatherings happen</p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* Database Status Pill (Full on desktop, compact on mobile) */}
          <div 
            title={isSupabase ? 'Connected to Supabase PostgreSQL' : 'Operating in local fallback mode.'}
            className={`flex items-center gap-1.5 text-xs font-medium px-2 sm:px-3 py-1.5 rounded-full border ${
              isSupabase 
                ? 'bg-emerald-950/60 border-emerald-800/50 text-emerald-300' 
                : 'bg-amber-950/50 border-amber-800/50 text-amber-300'
            }`}
          >
            <Database className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current animate-pulse"></span>
            <span className="hidden sm:inline">{isSupabase ? 'Supabase Connected' : 'Local Fallback'}</span>
          </div>

          {/* Manage Events Button */}
          <button
            onClick={onOpenManage}
            title="Manage Events"
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
            <span className="hidden md:inline">Manage Events</span>
            <span className="hidden sm:inline md:hidden">Manage</span>
          </button>

          {/* Publish Event CTA */}
          <button
            onClick={onOpenCreate}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/25 transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden xs:inline">Publish Event</span>
            <span className="xs:hidden">Publish</span>
          </button>
        </div>

      </div>
    </header>
  );
}
