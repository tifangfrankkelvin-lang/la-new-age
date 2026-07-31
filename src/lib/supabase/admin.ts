import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// This client uses the service role key and must NEVER be imported into
// client-side ("use client") code — only inside Server Actions or Route Handlers.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}