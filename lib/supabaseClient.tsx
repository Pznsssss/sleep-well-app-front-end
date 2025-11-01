import 'react-native-url-polyfill/auto';
import { createClient } from "@supabase/supabase-js";
import Constants from "expo-constants";

// Aman untuk development dan production
const extra = Constants.expoConfig?.extra ?? Constants.expoConfig?.extra;

const supabaseUrl = extra?.supabaseUrl;
const supabaseAnonKey = extra?.supabaseAnonKey;

// Tambal structuredClone jika belum tersedia (untuk Android Hermes)
if (typeof global.structuredClone !== 'function') {
  global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("supabaseUrl or supabaseAnonKey is missing.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
