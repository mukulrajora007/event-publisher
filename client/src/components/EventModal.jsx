import React, { useState } from 'react';
import { 
  X, Calendar, Clock, MapPin, Video, Laptop, Users, ExternalLink, 
  CheckCircle2, Share2, Mail, Globe, Ticket, User, ArrowRight 
} from 'lucide-react';
import { api } from '../services/api';

export default function EventModal({ event, onClose, onRegisterSuccess, showToast }) {
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!event) return null;

  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : null;
  const isFree = event.is_free || Number(event.price) === 0;

  // Calculate days remaining
  const now = new Date();
  const diffTime = startDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!attendeeName.trim() || !attendeeEmail.trim()) {
      showToast('Please enter both your name and email address', 'error');
      return;
    }

    try {
      setSubmitting(true);
      await api.registerAttendee(event.id, {
        attendee_name: attendeeName,
        attendee_email: attendeeEmail,
        ticket_quantity: ticketQuantity
      });
      setRegistered(true);
      showToast('Registration successful! Confirmation sent.', 'success');
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    showToast('Event link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = () => {
    const formatTime = (d) => d.toISOString().replace(/-|:|\.\d+/g, '');
    const startStr = formatTime(startDate);
    const endStr = endDate ? formatTime(endDate) : formatTime(new Date(startDate.getTime() + 2 * 3600 * 1000));
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(`${event.tagline || ''}\n\n${event.description}`);
    const location = encodeURIComponent(event.location_venue || event.location_url || '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl my-auto max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-700/60 shadow-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero image banner */}
        <div className="relative h-44 sm:h-64 md:h-72 w-full flex-shrink-0 overflow-hidden bg-slate-950">
          <img
            src={event.banner_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Badges on hero */}
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-6 sm:right-6 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-indigo-600/90 text-white backdrop-blur-md shadow-sm">
                {event.category}
              </span>
              <span className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold backdrop-blur-md ${
                isFree ? 'bg-emerald-600/90 text-white' : 'bg-slate-950/80 text-indigo-300 border border-indigo-500/30'
              }`}>
                {isFree ? 'FREE ADMISSION' : `$${Number(event.price).toFixed(2)}`}
              </span>
            </div>

            {diffDays > 0 && (
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-medium bg-slate-950/85 text-slate-300 border border-slate-700/80 backdrop-blur-md">
                Starts in {diffDays} {diffDays === 1 ? 'day' : 'days'}
              </span>
            )}
          </div>
        </div>

        {/* Modal content body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          
          {/* Header Title & Share */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight">
                {event.title}
              </h2>
              <button
                onClick={copyShareLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 border border-slate-700/80 transition flex-shrink-0"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Copied!' : 'Share'}</span>
              </button>
            </div>

            {event.tagline && (
              <p className="text-sm sm:text-base text-indigo-300 font-medium leading-relaxed">
                {event.tagline}
              </p>
            )}
          </div>

          {/* Quick Date, Time, Venue Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/60 border border-slate-800/80">
            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex-shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-xs font-semibold uppercase text-slate-400">Date & Time</div>
                <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                  {startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                  {startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  {endDate && ` - ${endDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}
                </div>
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 mt-1"
                >
                  <span>Add to Google Calendar</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Location / Stream */}
            <div className="flex items-start gap-3">
              <div className="p-2 sm:p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex-shrink-0">
                {event.location_type === 'virtual' ? <Video className="w-4 h-4 sm:w-5 sm:h-5" /> : <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] sm:text-xs font-semibold uppercase text-slate-400">
                  {event.location_type === 'virtual' ? 'Virtual Stream' : 'Location Venue'}
                </div>
                <div className="text-xs sm:text-sm font-bold text-white mt-0.5 break-words">
                  {event.location_venue || (event.location_type === 'virtual' ? 'Online Live Stream' : 'Location TBD')}
                </div>
                {event.location_url && (
                  <a
                    href={event.location_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 mt-1 truncate max-w-full"
                  >
                    <span className="truncate">{event.location_url}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300">About this event</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {event.tags.map((tag, i) => (
                <span key={i} className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[11px] sm:text-xs font-medium bg-slate-800 text-slate-300">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Organizer Info Box */}
          <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/40 border border-slate-800 flex flex-col xs:flex-row xs:items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <div className="text-[11px] text-slate-400">Organized by</div>
              <div className="text-xs sm:text-sm font-bold text-white truncate">{event.organizer_name}</div>
              <div className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1.5 truncate">
                <Mail className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{event.organizer_email}</span>
              </div>
            </div>

            {event.organizer_website && (
              <a
                href={event.organizer_website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 transition flex-shrink-0"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Website</span>
              </a>
            )}
          </div>

          {/* RSVP / Registration Section */}
          <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-violet-950/30 border border-indigo-500/20 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5 sm:gap-2">
                  <Ticket className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>Reserve Your Spot</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                  {Math.max(0, event.capacity - (event.attendees_count || 0))} of {event.capacity} spots remaining
                </p>
              </div>

              <div className="text-right">
                <div className="text-base sm:text-lg font-black text-white">
                  {isFree ? 'FREE' : `$${Number(event.price).toFixed(2)}`}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400">Per attendee</div>
              </div>
            </div>

            {registered ? (
              <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-950/50 border border-emerald-800/60 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="text-xs sm:text-sm font-bold text-emerald-300">You are officially registered!</div>
                  <div className="text-[11px] sm:text-xs text-emerald-400/80">
                    We've saved your spot for {attendeeName}. Check your email for joining instructions.
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full px-3 py-2 text-base sm:text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full px-3 py-2 text-base sm:text-sm bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-400">Tickets:</label>
                    <select
                      value={ticketQuantity}
                      onChange={(e) => setTicketQuantity(Number(e.target.value))}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value={1}>1 ticket</option>
                      <option value={2}>2 tickets</option>
                      <option value={3}>3 tickets</option>
                      <option value={4}>4 tickets</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition disabled:opacity-50 shadow-md shadow-indigo-600/30 active:scale-95"
                  >
                    <span>{submitting ? 'Confirming...' : 'Confirm Registration'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
