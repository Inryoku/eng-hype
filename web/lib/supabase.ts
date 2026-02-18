import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseEnabled = Boolean(supabaseUrl && supabaseKey);

// Keep client nullable so callers can guard safely when env vars are missing.
export const supabase = isSupabaseEnabled
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false, // We don't use Supabase Auth, prevents localStorage errors
      },
    })
  : null;
