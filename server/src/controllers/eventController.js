import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { defaultCategories, eventsData, registrationsData } from '../data/fallbackStore.js';
import { randomUUID } from 'crypto';

// GET /api/events
export const getEvents = async (req, res) => {
  try {
    const { category, search, location_type, status } = req.query;

    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('events').select('*').order('start_date', { ascending: true });

      if (category && category !== 'All') {
        query = query.ilike('category', `%${category}%`);
      }
      if (status) {
        query = query.eq('status', status);
      } else {
        query = query.neq('status', 'cancelled');
      }
      if (location_type && location_type !== 'All') {
        query = query.eq('location_type', location_type);
      }
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,organizer_name.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.json({ success: true, count: data.length, source: 'supabase', data });
    }

    // Fallback store handling
    let filtered = [...eventsData];

    if (category && category !== 'All') {
      filtered = filtered.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }
    if (status) {
      filtered = filtered.filter(e => e.status === status);
    } else {
      filtered = filtered.filter(e => e.status !== 'cancelled');
    }
    if (location_type && location_type !== 'All') {
      filtered = filtered.filter(e => e.location_type === location_type);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        (e.tagline && e.tagline.toLowerCase().includes(q)) ||
        e.organizer_name.toLowerCase().includes(q) ||
        (e.tags && e.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    filtered.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
    return res.json({ success: true, count: filtered.length, source: 'in-memory', data: filtered });
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/events/:id
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
      if (error) return res.status(404).json({ success: false, message: 'Event not found' });
      return res.json({ success: true, source: 'supabase', data });
    }

    const event = eventsData.find(e => e.id === id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    return res.json({ success: true, source: 'in-memory', data: event });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/events
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      tagline,
      description,
      category,
      start_date,
      end_date,
      location_type = 'in-person',
      location_venue,
      location_url,
      banner_url,
      price = 0,
      is_free = true,
      capacity = 100,
      organizer_name,
      organizer_email,
      organizer_phone,
      organizer_website,
      tags = []
    } = req.body;

    if (!title || !description || !category || !start_date || !organizer_name || !organizer_email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, category, start_date, organizer_name, organizer_email'
      });
    }

    const newEvent = {
      id: randomUUID(),
      title,
      tagline: tagline || null,
      description,
      category,
      start_date: new Date(start_date).toISOString(),
      end_date: end_date ? new Date(end_date).toISOString() : null,
      location_type,
      location_venue: location_venue || null,
      location_url: location_url || null,
      banner_url: banner_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80',
      price: is_free ? 0 : Number(price) || 0,
      is_free: Boolean(is_free),
      capacity: Number(capacity) || 100,
      attendees_count: 0,
      organizer_name,
      organizer_email,
      organizer_phone: organizer_phone || null,
      organizer_website: organizer_website || null,
      status: 'published',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('events').insert([newEvent]).select().single();
      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Event published successfully!', data });
    }

    eventsData.unshift(newEvent);
    return res.status(201).json({
      success: true,
      message: 'Event published successfully! (Saved to in-memory store)',
      data: newEvent
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/events/:id
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updated_at: new Date().toISOString() };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('events').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.json({ success: true, message: 'Event updated successfully', data });
    }

    const index = eventsData.findIndex(e => e.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    eventsData[index] = { ...eventsData[index], ...updates };
    return res.json({ success: true, message: 'Event updated successfully', data: eventsData[index] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/events/:id
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      return res.json({ success: true, message: 'Event deleted successfully' });
    }

    const index = eventsData.findIndex(e => e.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    eventsData.splice(index, 1);
    return res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/events/:id/register (RSVP)
export const registerAttendee = async (req, res) => {
  try {
    const { id } = req.params;
    const { attendee_name, attendee_email, ticket_quantity = 1, notes } = req.body;

    if (!attendee_name || !attendee_email) {
      return res.status(400).json({ success: false, message: 'Name and email are required to register.' });
    }

    const registration = {
      id: randomUUID(),
      event_id: id,
      attendee_name,
      attendee_email,
      ticket_quantity: Number(ticket_quantity) || 1,
      notes: notes || null,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('event_registrations').insert([registration]);
      if (error) throw error;
      return res.status(201).json({ success: true, message: 'Registration confirmed!', data: registration });
    }

    const event = eventsData.find(e => e.id === id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    event.attendees_count = (event.attendees_count || 0) + (Number(ticket_quantity) || 1);
    registrationsData.push(registration);

    return res.status(201).json({
      success: true,
      message: 'Registration confirmed! See you at the event.',
      data: registration
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/categories
export const getCategories = async (req, res) => {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      return res.json({ success: true, data });
    }

    return res.json({ success: true, data: defaultCategories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
