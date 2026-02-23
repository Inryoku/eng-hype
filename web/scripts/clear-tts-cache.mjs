import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env.local") });

function getJstDateKey(timestamp) {
  if (!timestamp) return null;

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return null;

  return new Date(date.getTime() + 9 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
}

function getThresholdJst(daysAgo) {
  const now = new Date();
  return new Date(
    now.getTime() - daysAgo * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000,
  )
    .toISOString()
    .split("T")[0];
}

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

    // 2. Filter files to delete
    // Keep if:
    // - created/updated within the last 7 days (JST), OR
    // - last accessed within the last 14 days (JST)
    const createdThresholdJST = getThresholdJst(7);
    const accessThresholdJST = getThresholdJst(14);

    console.log(
      `   Keeping files created/updated on or after: ${createdThresholdJST} (JST)`,
    );
    console.log(
      `   Keeping files accessed on or after: ${accessThresholdJST} (JST)`,
    );

    const filePaths = files
      .filter((f) => {
        // created_at / updated_at should be UTC ISO strings, but guard invalid values.
        const fileDateJST = getJstDateKey(f.created_at || f.updated_at);
        const lastAccessedDateJST = getJstDateKey(f.last_accessed_at);

        if (!fileDateJST) {
          console.warn(
            `   Skipping deletion for '${f.name}' due to invalid timestamp.`,
          );
          return false;
        }

        // Keep recently created/updated files.
        if (fileDateJST >= createdThresholdJST) {
          return false;
        }

        // Keep older files if they were accessed recently.
        if (lastAccessedDateJST && lastAccessedDateJST >= accessThresholdJST) {
          return false;
        }

        // Delete only if file is old and not recently accessed (or never accessed).
        return true;
      })
      .map((f) => f.name);

    if (filePaths.length === 0) {
      console.log(
        "   No cache files to delete (all are recent or recently accessed).",
      );
      return;
    }

    console.log(`   Found ${filePaths.length} old files to delete.`);

    // 3. Delete files
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(filePaths);

    if (deleteError) {
      console.error("❌ Failed to delete files:", deleteError.message);
    } else {
      console.log("✅ Old cache cleared successfully.");
    }
  } catch (err) {
    console.error("❌ Unexpected error clearing cache:", err);
  }
}

clearCache();
