// The anon key is safe for browser use when the SQL schema's RLS policies are enabled.
// Never expose the Supabase service-role key in this file.
window.RIFTTRADE_SUPABASE_URL = window.RIFTTRADE_SUPABASE_URL || 'https://rdsseyfwxfexiueegcaa.supabase.co/';
window.RIFTTRADE_SUPABASE_ANON_KEY = window.RIFTTRADE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkc3NleWZ3eGZleGl1ZWVnY2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MjI2NTUsImV4cCI6MjEwNjE5ODY1NX0.7d_wTjsm0MyXqX2LmkJs5CXFFUOF1-TdZiRCQ-VlHaA';

if (window.supabase && window.RIFTTRADE_SUPABASE_URL && window.RIFTTRADE_SUPABASE_ANON_KEY) {
  window.riftTradeSupabase = window.supabase.createClient(
    window.RIFTTRADE_SUPABASE_URL,
    window.RIFTTRADE_SUPABASE_ANON_KEY,
  );
}