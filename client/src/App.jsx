import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EventFilters from './components/EventFilters';
import EventCard from './components/EventCard';
import EventModal from './components/EventModal';
import CreateEventModal from './components/CreateEventModal';
import ManageEventsModal from './components/ManageEventsModal';
import Toast from './components/Toast';
import { api } from './services/api';
import { Calendar, Sparkles, Plus, RefreshCw } from 'lucide-react';

export default function App() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [healthInfo, setHealthInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocationType, setSelectedLocationType] = useState('All');

  // Modals
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const eventsSectionRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load backend health and categories on mount
  useEffect(() => {
    const initApp = async () => {
      try {
        const [health, cats] = await Promise.allSettled([
          api.getHealth(),
          api.getCategories()
        ]);
        if (health.status === 'fulfilled') setHealthInfo(health.value);
        if (cats.status === 'fulfilled') setCategories(cats.value);
      } catch (err) {
        console.error('App init error:', err);
      }
    };
    initApp();
  }, []);

  // Fetch events when filters change
  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await api.getEvents({
        category: selectedCategory,
        search: searchQuery,
        location_type: selectedLocationType
      });
      setEvents(res.data || []);
    } catch (err) {
      console.error('Failed to load events:', err);
      showToast('Could not load events from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEvents();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedLocationType]);

  const handleEventCreated = (newEvent) => {
    setEvents(prev => [newEvent, ...prev]);
    // Refresh categories & counts
    api.getCategories().then(setCategories).catch(() => {});
  };

  const handleEventDeleted = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const scrollToEvents = () => {
    eventsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const totalAttendees = events.reduce((sum, e) => sum + (e.attendees_count || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        onOpenCreate={() => setIsCreateOpen(true)}
        onOpenManage={() => setIsManageOpen(true)}
        healthInfo={healthInfo}
      />

      {/* Main Hero Section */}
      <Hero
        onOpenCreate={() => setIsCreateOpen(true)}
        totalEvents={events.length}
        totalAttendees={totalAttendees}
        onExploreClick={scrollToEvents}
      />

      {/* Event Discovery & Feed Container */}
      <main ref={eventsSectionRef} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Explore Upcoming Events
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Find technical conferences, developer summits, and creative gatherings
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadEvents}
              title="Refresh event list"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-sm shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Event</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <EventFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedLocationType={selectedLocationType}
          setSelectedLocationType={setSelectedLocationType}
          categories={categories}
        />

        {/* Event Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 space-y-4 animate-pulse">
                <div className="aspect-[16/9] w-full bg-slate-800 rounded-xl" />
                <div className="h-4 bg-slate-800 rounded w-1/3" />
                <div className="h-6 bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 space-y-4 max-w-lg mx-auto my-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">No Events Found</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              We couldn't find any events matching your current filters. Try changing your search keywords or be the first to publish one!
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-md shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Publish New Event</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelect={(evt) => setSelectedEvent(evt)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-slate-300 font-semibold">EventSphere</span>
            <span>— Full-Stack Event Publisher Platform</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Powered by React + Node.js + Supabase</span>
            <span className="text-slate-400 hover:text-slate-200 cursor-pointer" onClick={() => setIsCreateOpen(true)}>
              Publish An Event
            </span>
            <span className="text-slate-400 hover:text-slate-200 cursor-pointer" onClick={() => setIsManageOpen(true)}>
              Publisher Dashboard
            </span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onRegisterSuccess={loadEvents}
        showToast={showToast}
      />

      <CreateEventModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onEventCreated={handleEventCreated}
        showToast={showToast}
        categories={categories}
      />

      <ManageEventsModal
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        events={events}
        onEventDeleted={handleEventDeleted}
        onSelectEvent={(evt) => setSelectedEvent(evt)}
        showToast={showToast}
      />

      {/* Toast Alert */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
