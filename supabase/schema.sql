-- ==============================================================================
-- Event Publisher - Supabase PostgreSQL Database Schema
-- ==============================================================================

-- 1. Create enum types for event status and location types
DO $$ BEGIN
    CREATE TYPE event_location_type AS ENUM ('in-person', 'virtual', 'hybrid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(30) DEFAULT 'Calendar',
    color VARCHAR(20) DEFAULT 'blue',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    location_type VARCHAR(20) DEFAULT 'in-person',
    location_venue VARCHAR(255),
    location_url TEXT,
    banner_url TEXT,
    price NUMERIC(10, 2) DEFAULT 0.00,
    is_free BOOLEAN DEFAULT TRUE,
    capacity INTEGER DEFAULT 100,
    organizer_name VARCHAR(100) NOT NULL,
    organizer_email VARCHAR(100) NOT NULL,
    organizer_phone VARCHAR(50),
    organizer_website TEXT,
    status VARCHAR(20) DEFAULT 'published',
    attendees_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create event registrations (RSVP) table
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    attendee_name VARCHAR(100) NOT NULL,
    attendee_email VARCHAR(100) NOT NULL,
    ticket_quantity INTEGER DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_event_attendee UNIQUE (event_id, attendee_email)
);

-- 5. Indexes for fast query and search performance
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON event_registrations(event_id);

-- 6. Function to automatically increment attendees_count when registration is added
CREATE OR REPLACE FUNCTION increment_event_attendees()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE events
    SET attendees_count = attendees_count + NEW.ticket_quantity,
        updated_at = timezone('utc'::text, now())
    WHERE id = NEW.event_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_increment_attendees ON event_registrations;
CREATE TRIGGER trigger_increment_attendees
AFTER INSERT ON event_registrations
FOR EACH ROW EXECUTE FUNCTION increment_event_attendees();

-- 7. Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories and published events
CREATE POLICY "Public categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Published events are viewable by everyone" ON events
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert events" ON events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update their event" ON events
    FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete their event" ON events
    FOR DELETE USING (true);

CREATE POLICY "Anyone can register for events" ON event_registrations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Event organizers can view registrations" ON event_registrations
    FOR SELECT USING (true);

-- 8. Seed Default Categories
INSERT INTO categories (name, slug, icon, color) VALUES
('Technology', 'technology', 'Cpu', 'indigo'),
('Business & Networking', 'business', 'Briefcase', 'blue'),
('Music & Concerts', 'music', 'Music', 'purple'),
('Design & Creativity', 'design', 'Palette', 'pink'),
('Health & Wellness', 'health', 'Heart', 'emerald'),
('Workshops & Education', 'workshops', 'BookOpen', 'amber'),
('Community & Social', 'community', 'Users', 'teal')
ON CONFLICT (name) DO NOTHING;

-- 9. Seed Sample Events
INSERT INTO events (
    title,
    tagline,
    description,
    category,
    start_date,
    end_date,
    location_type,
    location_venue,
    location_url,
    banner_url,
    price,
    is_free,
    capacity,
    organizer_name,
    organizer_email,
    organizer_website,
    status,
    tags
) VALUES
(
    'NextGen AI & Cloud Summit 2026',
    'Exploring the future of multimodal AI and distributed cloud architecture',
    'Join industry leaders, researchers, and developers for a premier 2-day conference diving into modern AI frameworks, production LLMs, edge computing, and real-time agent orchestration. Includes keynote presentations, interactive workshops, and VIP networking mixers.',
    'Technology',
    NOW() + INTERVAL '14 days',
    NOW() + INTERVAL '16 days',
    'in-person',
    'Silicon Valley Convention Center, San Jose, CA',
    'https://summit.example.com',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    199.00,
    false,
    500,
    'TechForward Media',
    'contact@techforward.io',
    'https://techforward.io',
    'published',
    ARRAY['AI', 'Cloud', 'Networking', 'Developer']
),
(
    'Global Design & Creative Sprint',
    'Hands-on masterclasses in modern UI/UX design and design systems',
    'A virtual interactive symposium for designers and product thinkers. Master typography, micro-interactions, Figma component architecture, and design-to-code workflows. Receive direct feedback on your portfolio from seasoned design directors.',
    'Design & Creativity',
    NOW() + INTERVAL '7 days',
    NOW() + INTERVAL '8 days',
    'virtual',
    'Online via High-Def Live Stream',
    'https://meet.example.com/design-sprint',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    0.00,
    true,
    300,
    'Studio Aurora',
    'hello@studioaurora.design',
    'https://studioaurora.design',
    'published',
    ARRAY['Design', 'UI/UX', 'Figma', 'Creative']
),
(
    'Indie Founders & Tech Meetup',
    'Casual evening networking and lightning pitches for indie hackers and creators',
    'Bring your side project, share lessons learned, and connect with fellow developers, designers, and bootstrapped startup founders. Refreshments and snacks provided. 5-minute open-mic demo slot for anyone building something cool.',
    'Business & Networking',
    NOW() + INTERVAL '3 days',
    NOW() + INTERVAL '3 days' + INTERVAL '3 hours',
    'hybrid',
    'Downtown Innovation Hub & Discord Voice',
    'https://discord.gg/example',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    0.00,
    true,
    80,
    'Indie Creators Club',
    'community@indiecreators.dev',
    'https://indiecreators.dev',
    'published',
    ARRAY['Startup', 'Bootstrapping', 'Meetup', 'Networking']
),
(
    'Acoustic Nights & Sunset Sessions',
    'An open-air evening celebrating indie singer-songwriters and ambient sounds',
    'Relax under the stars with live acoustic performances from emerging indie artists. Enjoy craft beverages, artisanal food trucks, and intimate musical storytelling in a beautiful amphitheater setting.',
    'Music & Concerts',
    NOW() + INTERVAL '10 days',
    NOW() + INTERVAL '10 days' + INTERVAL '4 hours',
    'in-person',
    'Harbor Park Amphitheater, Waterfront Plaza',
    NULL,
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    25.00,
    false,
    250,
    'Sunset Sounds Collective',
    'tickets@sunsetsounds.live',
    'https://sunsetsounds.live',
    'published',
    ARRAY['Live Music', 'Acoustic', 'Outdoor', 'Festival']
)
ON CONFLICT DO NOTHING;
