import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

/** FIX FABRIC CRASH — SAFE LAYOUT ANIMATION SETUP */
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  try {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  } catch (e) {
    console.warn("LayoutAnimation not supported on this Android version:", e);
  }
}

const sleepTips = [
  {
    id: "1",
    problem: "Sulit tidur (Insomnia)",
    solution:
      "Coba dengarkan musik menenangkan, hindari layar gadget sebelum tidur, lakukan relaksasi napas dalam, dan buat rutinitas tidur yang konsisten.",
  },
  {
    id: "2",
    problem: "Sering terbangun di malam hari",
    solution:
      "Pastikan suhu kamar nyaman, hindari minum kafein atau banyak air sebelum tidur, gunakan lampu redup, dan coba teknik relaksasi.",
  },
  {
    id: "3",
    problem: "Tidur gelisah atau sering bergerak",
    solution:
      "Coba lakukan olahraga ringan di sore hari, hindari makan berat sebelum tidur, dan pastikan kasur serta bantal nyaman.",
  },
  {
    id: "4",
    problem: "Mimpi buruk atau tidur tidak nyenyak",
    solution:
      "Kurangi stres sebelum tidur, hindari menonton film horor, dan lakukan meditasi ringan atau journaling sebelum tidur.",
  },
  {
    id: "5",
    problem: "Sulit bangun pagi",
    solution:
      "Tidur lebih awal, hindari begadang, dan gunakan alarm dengan suara lembut. Coba paparan cahaya matahari pagi.",
  },
];

export default function TipsScreen() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handlePress = (id: string) => {
    // SAFE ANIMATION
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sleep Solution</Text>
      <Text style={styles.subHeader}>
        Having trouble sleeping? Discover solutions to your sleep issues for a more restful night.
      </Text>

      <FlatList
        data={sleepTips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity style={styles.row} onPress={() => handlePress(item.id)}>
              <Text style={styles.problem}>{item.problem}</Text>
              <MaterialIcons
                name={expandedId === item.id ? "expand-less" : "expand-more"}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>

            {expandedId === item.id && (
              <View style={styles.solutionBox}>
                <Text style={styles.solution}>{item.solution}</Text>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  subHeader: {
    color: "#b3cfff",
    fontSize: 14,
    marginBottom: 18,
  },
  card: {
    backgroundColor: "rgba(44, 62, 120, 0.85)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  problem: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  solutionBox: {
    marginTop: 10,
    backgroundColor: "rgba(30, 64, 175, 0.7)",
    borderRadius: 8,
    padding: 10,
  },
  solution: {
    color: "#b3cfff",
    fontSize: 15,
  },
});
