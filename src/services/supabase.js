import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wpceloruqzrcmuqabtmh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwY2Vsb3J1cXpyY211cWFidG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NjE0ODYsImV4cCI6MjA4NjMzNzQ4Nn0.npubIkclMJKBwVGh-Rhx_RLor7AksI0ns3nZyS2IW3Y";

export const supabase = createClient(supabaseUrl, supabaseKey);