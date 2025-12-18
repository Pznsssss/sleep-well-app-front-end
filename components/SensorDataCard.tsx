import React from "react";
import { View, Text, StyleSheet } from "react-native";

type SensorDataCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  badgeText?: string;
  badgeType?: "blue" | "default";
};

export default function SensorDataCard({
  icon,
  title,
  value,
  badgeText,
  badgeType = "default",
}: SensorDataCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      {badgeText && (
        <View style={badgeType === "blue" ? styles.badgeBlue : styles.badge}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(44, 62, 120, 0.85)",
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 4,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: 150,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 6,
  },
  value: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 4,
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
  },
  badgeBlue: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});