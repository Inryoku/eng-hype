import { createClient } from "@supabase/supabase-js";

// Only for server-side usage (API Routes, getServerSideProps)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const isSupabaseServerEnabled = Boolean(
  supabaseUrl && supabaseServiceKey,
);

// Create a server-side client with the Service Role Key
// This bypasses Row Level Security (RLS) - USE CAREFULLY!
export const supabaseServer = isSupabaseServerEnabled
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;
