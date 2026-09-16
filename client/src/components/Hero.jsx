import React from 'react';
import { Sparkles, Calendar, Users, Globe, ArrowRight } from 'lucide-react';

export default function Hero({ onOpenCreate, totalEvents, totalAttendees, onExploreClick }) {
  return (
    <div className="relative overflow-hidden pt-12 pb-16 border-b border-slate-900 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-tr from-indigo-600/15 via-violet-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Subtle announcement pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Powering Next-Gen Conferences, Summits & Meetups</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Publish & Discover <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Unforgettable Events
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            The modern platform for event organizers and creators to announce conferences, masterclasses, and community meetups to attendees worldwide.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenCreate}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
            >
              <span>Publish Your Event</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreClick}
              className="px-6 py-3 rounded-xl font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
            >
              Browse All Events
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-8 max-w-lg mx-auto border-t border-slate-900">
            <div className="p-3">
              <div className="text-2xl font-black text-white">{totalEvents || 4}</div>
              <div className="text-xs text-slate-400 font-medium">Published Events</div>
            </div>
            <div className="p-3 border-x border-slate-800/60">
              <div className="text-2xl font-black text-indigo-400">{totalAttendees || '330+'}</div>
              <div className="text-xs text-slate-400 font-medium">Active RSVPs</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-black text-violet-400">100%</div>
              <div className="text-xs text-slate-400 font-medium">Free To Host</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
