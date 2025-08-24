import { createClient } from '@supabase/supabase-js';

const supabaseUrl = `https://nzerxszeqetoyujuyfkk.supabase.co`;
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56ZXJ4c3plcWV0b3l1anV5ZmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NjczNjAsImV4cCI6MjA3MTM0MzM2MH0.0qm08NSxqhyuLdUHtIZPWUByEv11WHc5O5wHNI_ktCE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper function to check if user is admin
export const isAdmin = (email: string | undefined) => {
  return email === 'rayaanm5409@gmail.com';
};

// Helper function to get user's session
export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return session;
};

