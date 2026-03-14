import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Demo store — seeded in schema.sql
export const STORE_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
