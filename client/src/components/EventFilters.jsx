import React from 'react';
import { Search, MapPin, Video, Laptop, X } from 'lucide-react';

export default function EventFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLocationType,
  setSelectedLocationType,
  categories = []
}) {
  const allCategories = ['All', ...categories.map(c => c.name)];

  const locationTypes = [
    { label: 'All Formats', value: 'All', icon: null },
    { label: 'In-Person', value: 'in-person', icon: MapPin },
    { label: 'Virtual', value: 'virtual', icon: Video },
    { label: 'Hybrid', value: 'hybrid', icon: Laptop },
  ];

  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || selectedLocationType !== 'All';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLocationType('All');
  };

  return (
    <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
      {/* Search & Location Type bar */}
      <div className="flex flex-col md:flex-row gap-2.5 sm:gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by event title, speaker, or location..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 sm:pl-11 pr-10 py-2.5 sm:py-3 text-base sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Location Type Filter (Scrollable on small mobile, flex on larger) */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto scrollbar-none max-w-full">
          {locationTypes.map(t => {
            const Icon = t.icon;
            const isSelected = selectedLocationType === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setSelectedLocationType(t.value)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition flex-shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1.5 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {allCategories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-medium transition flex-shrink-0 ${
                  isSelected
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 shadow-sm shadow-indigo-500/10'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 whitespace-nowrap pl-2 font-medium flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
