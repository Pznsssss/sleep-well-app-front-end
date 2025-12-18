// src/types/database.ts
export type SleepMonitoringRow = {
  id: number;
  sleep_quality_score: number;
  temperature: number;
  sound_level: number;
  light_level: number;
  movement_count: number;
  created_at: string; // ISO timestamp from Supabase (e.g. "2025-11-29T12:34:56Z")
};

// Jika ada tabel users, tambahkan tipe untuk insert/select users:
export type UserRow = {
  id: string;
  email: string;
  username: string | null;
  password_hash: string;
};
