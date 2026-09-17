import React from 'react';
import { Calendar, MapPin, Video, Laptop, Users, ArrowUpRight, Clock } from 'lucide-react';

export default function EventCard({ event, onSelect }) {
  const startDate = new Date(event.start_date);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const isFree = event.is_free || Number(event.price) === 0;

  const getLocationIcon = () => {
    switch (event.location_type) {
      case 'virtual':
        return <Video className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />;
      case 'hybrid':
        return <Laptop className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />;
      default:
        return <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />;
    }
  };

  const getLocationLabel = () => {
    if (event.location_type === 'virtual') return 'Online / Virtual';
    if (event.location_venue) return event.location_venue;
    return 'In-person Event';
  };

  return (
    <div 
      onClick={() => onSelect(event)}
      className="group flex flex-col bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer"
    >
      {/* Banner image with overlay */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
        <img
          src={event.banner_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80'}
          alt={event.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-2">
          <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase bg-slate-950/80 backdrop-blur-md text-indigo-300 border border-indigo-500/30">
            {event.category}
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3">
          <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold backdrop-blur-md border ${
            isFree 
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30' 
              : 'bg-indigo-950/80 text-indigo-200 border-indigo-500/30'
          }`}>
            {isFree ? 'FREE' : `$${Number(event.price).toFixed(2)}`}
          </span>
        </div>

        {/* Format Badge */}
        <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium bg-slate-950/85 backdrop-blur-md text-slate-200 border border-slate-800 max-w-[85%] truncate">
          {getLocationIcon()}
          <span className="truncate">{getLocationLabel()}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-3.5 sm:space-y-4">
        <div className="space-y-1.5 sm:space-y-2">
          {/* Date & Time */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-medium text-indigo-400">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{formattedDate}</span>
            <span>•</span>
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{formattedTime}</span>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 leading-snug">
            {event.title}
          </h3>

          {/* Tagline / Snippet */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {event.tagline || event.description}
          </p>
        </div>

        {/* Footer info: Organizer & Attendees */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="truncate max-w-[130px] sm:max-w-[160px]">
            <span className="text-slate-500">By </span>
            <span className="text-slate-300 font-medium">{event.organizer_name}</span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            <div className="flex items-center gap-1 text-slate-400" title="Registered Attendees">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>{event.attendees_count || 0}</span>
            </div>

            <div className="flex items-center text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">
              <span>View</span>
              <ArrowUpRight className="w-4 h-4 ml-0.5" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
