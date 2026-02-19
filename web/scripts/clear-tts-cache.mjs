import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env.local") });

async function clearCache() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn(
      "⚠️ Missing Supabase credentials in .env.local. Skipping cache clear.",
    );
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  const BUCKET_NAME = "tts-cache";

  try {
    console.log(`🧹 Clearing '${BUCKET_NAME}' bucket...`);

    // 1. List files (max 1000 per request, might need loop for huge buckets)
    const { data: files, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(undefined, { limit: 1000 });

    if (listError) {
      // If bucket doesn't exist, that's fine too
      console.warn("   List error (or bucket missing):", listError.message);
      return;
    }

    if (!files || files.length === 0) {
      console.log("   Bucket is already empty.");
      return;
    }

    const filePaths = files.map((f) => f.name);
    console.log(`   Found ${filePaths.length} files to delete.`);

    // 2. Delete files
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(filePaths);

    if (deleteError) {
      console.error("❌ Failed to delete files:", deleteError.message);
    } else {
      console.log("✅ Cache cleared successfully.");
    }
  } catch (err) {
    console.error("❌ Unexpected error clearing cache:", err);
  }
}

clearCache();
