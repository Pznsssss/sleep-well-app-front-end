// lib/supabaseClient.ts

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

let supabaseClient: SupabaseClient | null = null;

export async function initSupabase() {
  try {
    if (!supabaseClient) {
      // Ambil extra dari expoConfig / manifest (runtime)
      const extra =
        (Constants.expoConfig?.extra as any) ||
        ((Constants.manifest as any)?.extra as any) ||
        null;

      const url = extra?.supabaseUrl;
      const anonKey = extra?.supabaseAnonKey;

      if (!url || !anonKey) {
        console.error("❌ ERROR: Supabase env missing!", extra);
        throw new Error(
          "Supabase URL or Anon Key missing in app.json (extra section)"
        );
      }

      supabaseClient = createClient(url, anonKey);
      console.log("✅ Supabase initialized");
    }

    return supabaseClient;
  } catch (err) {
    console.error("❌ Supabase init failed:", err);
    throw err;
  }
}

export function getSupabase() {
  if (!supabaseClient) {
    console.warn("⚠️ Supabase was not initialized. Auto-initializing...");

    const extra =
      (Constants.expoConfig?.extra as any) ||
      ((Constants.manifest as any)?.extra as any) ||
      null;

    return createClient(extra?.supabaseUrl!, extra?.supabaseAnonKey!);
  }

  return supabaseClient;
}
