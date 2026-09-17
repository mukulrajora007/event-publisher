import React, { useState } from 'react';
import { X, Sparkles, Image as ImageIcon, MapPin, Video, Laptop, DollarSign, Calendar, Clock, User, Mail, Tag } from 'lucide-react';
import { api } from '../services/api';

const PRESET_BANNERS = [
  { label: 'Tech Conference', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Creative / Design', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Networking Meetup', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Music & Concert', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Hackathon / Code', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Startup Pitch', url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80' },
];

export default function CreateEventModal({ isOpen, onClose, onEventCreated, showToast, categories = [] }) {
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Technology');
  
  // Default start date: tomorrow at 10:00 AM
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);
  const defaultStart = tomorrow.toISOString().slice(0, 16);

  // Default end date: tomorrow at 16:00
  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(16, 0, 0, 0);
  const defaultEnd = tomorrowEnd.toISOString().slice(0, 16);

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [locationType, setLocationType] = useState('in-person');
  const [locationVenue, setLocationVenue] = useState('');
  const [locationUrl, setLocationUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState(PRESET_BANNERS[0].url);
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState(0);
  const [capacity, setCapacity] = useState(100);
  const [organizerName, setOrganizerName] = useState('');
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [organizerWebsite, setOrganizerWebsite] = useState('');
  const [tagsInput, setTagsInput] = useState('Conference, Community');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Event title is required', 'error');
      return;
    }
    if (!description.trim()) {
      showToast('Event description is required', 'error');
      return;
    }
    if (!organizerName.trim() || !organizerEmail.trim()) {
      showToast('Organizer name and email are required', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const tagsArray = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const eventPayload = {
        title,
        tagline,
        description,
        category,
        start_date: new Date(startDate).toISOString(),
        end_date: endDate ? new Date(endDate).toISOString() : null,
        location_type: locationType,
        location_venue: locationType !== 'virtual' ? locationVenue : null,
        location_url: locationType !== 'in-person' ? locationUrl : null,
        banner_url: bannerUrl,
        is_free: isFree,
        price: isFree ? 0 : Number(price),
        capacity: Number(capacity),
        organizer_name: organizerName,
        organizer_email: organizerEmail,
        organizer_website: organizerWebsite,
        tags: tagsArray
      };

      const result = await api.createEvent(eventPayload);
      showToast('Event successfully published to the website!', 'success');
      onEventCreated(result.data);
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to publish event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl my-auto flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white leading-tight">Publish a New Event</h2>
              <p className="text-[11px] sm:text-xs text-slate-400">Share your event with attendees worldwide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          
          {/* Section 1: Basic Event Details */}
          <div className="space-y-3.5 sm:space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">1. Basic Information</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Event Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AI & Multimodal Intelligence Summit 2026"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Short Tagline / Catchphrase
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. A 2-day deep dive into next-generation intelligent workflows"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                >
                  {(categories.length > 0 ? categories : [
                    { name: 'Technology' }, { name: 'Business & Networking' }, 
                    { name: 'Music & Concerts' }, { name: 'Design & Creativity' }, 
                    { name: 'Workshops & Education' }
                  ]).map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="AI, Cloud, Networking, Developers"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed overview, speaker lineup, expectations, and agenda..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition leading-relaxed"
              />
            </div>
          </div>

          {/* Section 2: Banner Image */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>2. Banner Image</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Image URL</label>
              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* Quick Presets (2 cols on small mobile, 3 cols on sm, 6 cols on md) */}
            <div>
              <div className="text-[11px] text-slate-400 mb-2">Or choose from curated presets:</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {PRESET_BANNERS.map((preset, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setBannerUrl(preset.url)}
                    className={`group relative aspect-[16/10] rounded-lg overflow-hidden border transition ${
                      bannerUrl === preset.url ? 'border-indigo-500 ring-2 ring-indigo-500/40' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center p-1 text-center">
                      <span className="text-[10px] font-semibold text-white leading-tight">{preset.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Schedule & Dates */}
          <div className="space-y-3.5 sm:space-y-4 pt-2 border-t border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>3. Date & Time</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Start Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">End Date & Time (Optional)</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Format & Venue */}
          <div className="space-y-3.5 sm:space-y-4 pt-2 border-t border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>4. Format & Location</span>
            </h3>

            {/* Format selector buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'in-person', label: 'In-Person', icon: MapPin },
                { id: 'virtual', label: 'Virtual', icon: Video },
                { id: 'hybrid', label: 'Hybrid', icon: Laptop },
              ].map(f => {
                const Icon = f.icon;
                const isSelected = locationType === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setLocationType(f.id)}
                    className={`flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-xl border text-xs font-semibold transition ${
                      isSelected 
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>

            {locationType !== 'virtual' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Physical Venue Address
                </label>
                <input
                  type="text"
                  value={locationVenue}
                  onChange={(e) => setLocationVenue(e.target.value)}
                  placeholder="e.g. Silicon Valley Center, 150 West San Carlos St, San Jose, CA"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            )}

            {locationType !== 'in-person' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Virtual Stream / Meeting URL
                </label>
                <input
                  type="url"
                  value={locationUrl}
                  onChange={(e) => setLocationUrl(e.target.value)}
                  placeholder="e.g. https://meet.google.com/xyz or https://zoom.us/j/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            )}
          </div>

          {/* Section 5: Pricing & Capacity */}
          <div className="space-y-3.5 sm:space-y-4 pt-2 border-t border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" />
              <span>5. Tickets & Capacity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pricing Model</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFree(true)}
                    className={`flex-1 py-2 sm:py-2.5 text-xs font-bold rounded-xl border transition ${
                      isFree ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Free
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFree(false)}
                    className={`flex-1 py-2 sm:py-2.5 text-xs font-bold rounded-xl border transition ${
                      !isFree ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Paid
                  </button>
                </div>
              </div>

              {!isFree && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ticket Price ($ USD)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Maximum Capacity</label>
                <input
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Organizer Details */}
          <div className="space-y-3.5 sm:space-y-4 pt-2 border-t border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>6. Organizer Contact</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Organizer Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  placeholder="e.g. Apex Global Media"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Contact Email <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={organizerEmail}
                  onChange={(e) => setOrganizerEmail(e.target.value)}
                  placeholder="events@apexmedia.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Website (Optional)</label>
                <input
                  type="url"
                  value={organizerWebsite}
                  onChange={(e) => setOrganizerWebsite(e.target.value)}
                  placeholder="https://apexmedia.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Footer Submit Button (Stacked full-width on small screens) */}
          <div className="pt-4 sm:pt-6 border-t border-slate-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 active:scale-95 text-center"
            >
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span>{submitting ? 'Publishing Event...' : 'Publish Event Now'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
