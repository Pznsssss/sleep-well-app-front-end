// app/_layout.tsx

import React, { useEffect, useState } from "react";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initSupabase } from "../lib/supabaseClient";

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const start = async () => {
      try {
        await initSupabase();                        // ✅ WAJIB AWAIT
        console.log("Supabase initialized successfully");
      } catch (e) {
        console.error("Failed to init supabase:", e);
      } finally {
        setIsReady(true);                            // ⚠️ Pastikan UI baru render setelah Supabase siap
      }
    };

    start();
  }, []);

  if (!isReady) {
    return null;                                     // ⏳ Hindari render komponen sebelum supabase siap
  }

  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}
