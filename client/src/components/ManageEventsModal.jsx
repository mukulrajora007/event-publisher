import React, { useState } from 'react';
import { X, Trash2, Calendar, Users, Eye, SlidersHorizontal } from 'lucide-react';
import { api } from '../services/api';

export default function ManageEventsModal({ isOpen, onClose, events = [], onEventDeleted, onSelectEvent, showToast }) {
  const [deletingId, setDeletingId] = useState(null);

  if (!isOpen) return null;

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete or unpublish "${title}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await api.deleteEvent(id);
      showToast('Event removed successfully', 'success');
      onEventDeleted(id);
    } catch (err) {
      showToast(err.message || 'Failed to delete event', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl my-auto flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex-shrink-0">
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white leading-tight">Publisher Dashboard</h2>
              <p className="text-[11px] sm:text-xs text-slate-400">Manage your published events and track attendee numbers</p>
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

        {/* Event List Table / Cards */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6">
          {events.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <p className="text-sm">No events published yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {events.map((evt) => {
                const startDate = new Date(evt.start_date);
                const isFree = evt.is_free || Number(evt.price) === 0;

                return (
                  <div key={evt.id} className="py-3.5 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    {/* Event Thumbnail & Info */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full sm:w-auto">
                      <img
                        src={evt.banner_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=300&q=80'}
                        alt={evt.title}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover flex-shrink-0 bg-slate-950 border border-slate-800"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-800 text-indigo-300">
                            {evt.category}
                          </span>
                          <span className="text-[11px] sm:text-xs text-slate-400">
                            {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-sm sm:max-w-md">{evt.title}</h4>
                        <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 flex-shrink-0" />
                            <span>{evt.attendees_count || 0} RSVPs</span>
                          </span>
                          <span>•</span>
                          <span>{isFree ? 'Free' : `$${Number(evt.price).toFixed(2)}`}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0 w-full sm:w-auto justify-end pt-1 sm:pt-0">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectEvent(evt);
                        }}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => handleDelete(evt.id, evt.title)}
                        disabled={deletingId === evt.id}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/80 border border-rose-800/40 transition disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{deletingId === evt.id ? 'Deleting...' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
          <span>Showing {events.length} published {events.length === 1 ? 'event' : 'events'}</span>
          <button
            onClick={onClose}
            className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
