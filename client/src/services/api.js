const API_BASE = '/api';

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    return data.data || [];
  },

  async getEvents({ category, search, location_type } = {}) {
    const query = new URLSearchParams();
    if (category && category !== 'All') query.append('category', category);
    if (search) query.append('search', search);
    if (location_type && location_type !== 'All') query.append('location_type', location_type);

    const res = await fetch(`${API_BASE}/events?${query.toString()}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch events');
    return data;
  },

  async getEventById(id) {
    const res = await fetch(`${API_BASE}/events/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to fetch event');
    return data.data;
  },

  async createEvent(eventData) {
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to create event');
    return data;
  },

  async updateEvent(id, eventData) {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to update event');
    return data;
  },

  async deleteEvent(id) {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed to delete event');
    return data;
  },

  async registerAttendee(id, registrationData) {
    const res = await fetch(`${API_BASE}/events/${id}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationData),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Registration failed');
    return data;
  }
};
