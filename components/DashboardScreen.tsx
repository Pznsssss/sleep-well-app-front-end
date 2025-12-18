// components/DashboardScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import SleepDiagram from "../components/SleepDiagram";
import { getSupabase } from "../lib/supabaseClient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.floor((width - 48 - 16) / 2);

// ---------------- TYPES ----------------
type SensorData = {
  sleepQuality: number;
  temperature: number;
  soundLevel: number;
  lightLevel: number;
  motionLevel: number;
};

type ChartData = {
  sleepQuality: number[];
  temperature: number[];
  soundLevel: number[];
  lightLevel: number[];
  motionLevel: number[];
  labels: string[];
};

// ---------------- COMPONENT ----------------
export default function DashboardScreen() {
  const supabase = getSupabase(); // aman karena sudah init di _layout

  const [sensor, setSensor] = useState<SensorData>({
    sleepQuality: 0,
    temperature: 0,
    soundLevel: 0,
    lightLevel: 0,
    motionLevel: 0,
  });

  const [chartData, setChartData] = useState<ChartData>({
    sleepQuality: [],
    temperature: [],
    soundLevel: [],
    lightLevel: [],
    motionLevel: [],
    labels: [],
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ---------------- FETCH DATA ----------------
  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("sleep_monitoring")
        .select("*")
        .order("id", { ascending: false })
        .limit(1);

      if (error) {
        console.warn("Supabase error:", error);
        return;
      }

      // 🟢 Jika tabel kosong → tampilkan UI default, tidak error
      if (!data || data.length === 0) {
        console.log("No data available — showing default values.");
        setSensor({
          sleepQuality: 0,
          temperature: 0,
          soundLevel: 0,
          lightLevel: 0,
          motionLevel: 0,
        });
        setChartData({
          sleepQuality: [],
          temperature: [],
          soundLevel: [],
          lightLevel: [],
          motionLevel: [],
          labels: [],
        });
        return;
      }

      // 🟢 Ada data → gunakan data terbaru
      const latest = data[0];

      setSensor({
        sleepQuality: latest.sleep_quality_score ?? 0,
        temperature: latest.temperature ?? 0,
        soundLevel: latest.sound_level ?? 0,
        lightLevel: latest.light_level ?? 0,
        motionLevel: latest.movement_count ?? 0,
      });

      const timestamp = new Date(latest.created_at).toLocaleTimeString();

      setChartData((prev) => {
        const maxLength = 10;

        return {
          sleepQuality: [...prev.sleepQuality.slice(-maxLength + 1), latest.sleep_quality_score],
          temperature: [...prev.temperature.slice(-maxLength + 1), latest.temperature],
          soundLevel: [...prev.soundLevel.slice(-maxLength + 1), latest.sound_level],
          lightLevel: [...prev.lightLevel.slice(-maxLength + 1), latest.light_level],
          motionLevel: [...prev.motionLevel.slice(-maxLength + 1), latest.movement_count],
          labels:
            prev.labels.length >= maxLength
              ? [...prev.labels.slice(1), timestamp]
              : [...prev.labels, timestamp],
        };
      });
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSleepQualityStatus = (score: number) => {
    if (score >= 80) return { status: "Excellent", color: "#10B981" };
    if (score >= 60) return { status: "Good", color: "#F59E42" };
    return { status: "Poor", color: "#EF4444" };
  };

  const sleepQualityStatus = getSleepQualityStatus(sensor.sleepQuality);

  // ---------------- UI ----------------
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <ScrollView
        style={styles.page}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
        }
      >
        <Text style={styles.header}>
          <FontAwesome5 name="moon" size={24} color="#b3cfff" /> Sleep Monitor Quality
        </Text>
        <Text style={styles.subHeader}>Real-time environmental monitoring for optimal health</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* ---------------- SLEEP QUALITY CARD ---------------- */}
            <View style={styles.cardsRow}>
              <View style={styles.card}>
                <View style={styles.row}>
                  <FontAwesome5 name="bed" size={18} color="#fff" />
                  <Text style={styles.title}>Sleep Quality</Text>
                </View>
                <Text style={styles.value}>{sensor.sleepQuality} %</Text>
                <View style={[styles.badge, { backgroundColor: sleepQualityStatus.color }]}>
                  <Text style={styles.badgeText}>{sleepQualityStatus.status}</Text>
                </View>
              </View>

              {/* ---------------- TEMPERATURE CARD ---------------- */}
              <View style={styles.card}>
                <View style={styles.row}>
                  <MaterialCommunityIcons name="thermometer" size={18} color="#fff" />
                  <Text style={styles.title}>Temperature</Text>
                </View>
                <Text style={styles.value}>{sensor.temperature}°C</Text>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor:
                        sensor.temperature >= 18 && sensor.temperature <= 22 ? "#10B981" : "#EF4444",
                    },
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {sensor.temperature >= 18 && sensor.temperature <= 22
                      ? "Optimal"
                      : "Not Optimal"}
                  </Text>
                </View>
              </View>
            </View>

            {/* ---------------- SOUND & LIGHT CARDS ---------------- */}
            <View style={styles.cardsRow}>
              <View style={styles.card}>
                <View style={styles.row}>
                  <MaterialIcons name="volume-up" size={18} color="#fff" />
                  <Text style={styles.title}>Sound Level</Text>
                </View>
                <Text style={styles.value}>{sensor.soundLevel} dB</Text>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: sensor.soundLevel < 40 ? "#10B981" : "#EF4444" },
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {sensor.soundLevel < 40 ? "Optimal" : "Too Loud"}
                  </Text>
                </View>
              </View>

              <View style={styles.card}>
                <View style={styles.row}>
                  <MaterialCommunityIcons name="weather-night" size={18} color="#fff" />
                  <Text style={styles.title}>Light Level</Text>
                </View>
                <Text style={styles.value}>{sensor.lightLevel} lux</Text>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: sensor.lightLevel < 5 ? "#10B981" : "#EF4444" },
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {sensor.lightLevel < 5 ? "Optimal" : "Too Bright"}
                  </Text>
                </View>
              </View>
            </View>

            {/* ---------------- MOTION CARD ---------------- */}
            <View style={styles.cardsRow}>
              <View style={styles.card}>
                <View style={styles.row}>
                  <MaterialIcons name="directions-run" size={18} color="#fff" />
                  <Text style={styles.title}>Motion Level</Text>
                </View>
                <Text style={styles.value}>{sensor.motionLevel}</Text>
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: sensor.motionLevel <= 2 ? "#10B981" : "#EF4444" },
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {sensor.motionLevel <= 2 ? "Stable" : "Restless"}
                  </Text>
                </View>
              </View>
            </View>

            {/* ---------------- CHART ---------------- */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Environmental Conditions</Text>

              {chartData.labels.length > 0 ? (
                <SleepDiagram data={chartData} title="Real-time Sensor Chart" />
              ) : (
                <Text style={{ color: "#fff", textAlign: "center" }}>
                  No chart data available
                </Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

// ---------------- STYLE ----------------
const styles = StyleSheet.create({
  page: { backgroundColor: "#000", padding: 24 },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
    marginTop: 8,
  },
  subHeader: { color: "#b3cfff", fontSize: 14, marginBottom: 18 },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "rgba(44, 62, 120, 0.85)",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  title: { color: "#fff", fontSize: 15, fontWeight: "bold", marginLeft: 6 },
  value: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 6 },
  badge: {
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
  },
  badgeText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  section: {
    backgroundColor: "rgba(44, 62, 120, 0.85)",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: { color: "#fff", fontSize: 17, fontWeight: "bold", marginBottom: 10 },
});
