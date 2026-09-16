import app from './app.js';
import { isSupabaseConfigured } from './config/supabase.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Event Publisher Server running on http://localhost:${PORT}`);
  console.log(`📡 Database mode: ${isSupabaseConfigured ? 'Live Supabase' : 'Local Fallback'}`);
});
