# EventSphere — Event Publisher Web Application

A modern, full-stack web application designed for event publishers, conference hosts, and community organizers to publish, manage, and promote their events, and for attendees to discover and register for events.

---

## 🛠️ Technologies Used
- **Frontend**: [React.js](https://react.dev/) + [Vite](https://vitejs.dev/) + [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **Backend**: [Node.js](https://nodejs.org/) + [Express.js](https://expressjs.com/) + `@supabase/supabase-js`
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL with Row-Level Security, automated triggers, and indexes)

---

## 📁 Project Structure

```
event-publisher/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Header with branding & status
│   │   │   ├── Hero.jsx            # Dynamic hero section with metrics
│   │   │   ├── EventCard.jsx       # Event card with format & price tags
│   │   │   ├── EventFilters.jsx    # Real-time search, category & format filters
│   │   │   ├── EventModal.jsx      # Event details, Google Calendar export & RSVP
│   │   │   ├── CreateEventModal.jsx# Comprehensive event publishing form
│   │   │   ├── ManageEventsModal.jsx# Publisher dashboard for managing & deleting
│   │   │   └── Toast.jsx           # Notification alerts
│   │   ├── services/
│   │   │   └── api.js              # API client for backend
│   │   ├── App.jsx                 # Main stateful application
│   │   ├── index.css               # Tailwind CSS & custom animations
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js         # Supabase client & fallback detection
│   │   ├── controllers/
│   │   │   └── eventController.js  # CRUD operations & registration logic
│   │   ├── routes/
│   │   │   └── eventRoutes.js      # REST API endpoints
│   │   ├── data/
│   │   │   └── fallbackStore.js    # In-memory store with sample events
│   │   └── index.js                # Server entry point
│   ├── .env.example
│   ├── .env
│   └── package.json
│
├── supabase/
│   └── schema.sql              # Complete PostgreSQL schema, RLS, and seed data
└── README.md
```

---

## ⚡ Quick Start

### 1. Start the Backend Server (Terminal 1)
```bash
cd server
npm install
npm run dev
```
> Server runs on **`http://localhost:5000`**

### 2. Start the Frontend Client (Terminal 2)
```bash
cd client
npm install
npm run dev
```
> Frontend runs on **`http://localhost:3000`**

*(Note: The server has an automatic built-in mock fallback store with realistic tech, design, and music events, so you can start testing immediately even before configuring Supabase!)*

---

## 🗄️ Setting Up Supabase Database

To connect your live Supabase cloud database:

1. Create a free account at [Supabase](https://supabase.com) and click **"New Project"**.
2. Go to **Project Settings** -> **API**:
   - Copy your **Project URL**
   - Copy your **anon public key** (or `service_role` secret key)
3. Open `server/.env` and update the values:
   ```env
   PORT=5000
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-supabase-anon-or-service-role-key
   ```
4. Open the **SQL Editor** in your Supabase Dashboard.
5. Copy all the contents from `supabase/schema.sql` and click **Run**.
6. Restart the backend server (`npm run dev` in `server`). The terminal will show:
   ```
   ✅ Supabase client initialized successfully
   ```
   And the frontend Navbar badge will turn green showing **"Supabase Connected"**!

---

## 🚀 Key Features

- **Full-featured Publishing Form**:
  - Title, Tagline, Category, Start & End Date/Time
  - Format selection: In-Person, Virtual stream, or Hybrid
  - Ticket pricing (Free vs Paid) and seating capacity
  - Curated high-resolution preset banner selection or custom URL
  - Organizer contact & website info
- **Dynamic Event Discovery**:
  - Real-time search by keyword, speaker, or topic
  - Category filtering (Technology, Design, Music, Business, Workshops, etc.)
  - Format filters (In-Person, Virtual, Hybrid)
- **Interactive Event Details & RSVP**:
  - Countdown timer to event start
  - One-click **"Add to Google Calendar"** link
  - Attendee registration (RSVP) with ticket quantity
  - Share link to clipboard
- **Publisher Dashboard**:
  - View all published events
  - Monitor registration numbers
  - Delete or unpublish events
