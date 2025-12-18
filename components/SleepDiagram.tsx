import React from "react";
import { View, Text, Dimensions, StyleSheet, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

type Props = {
  data: {
    sleepQuality: number[];
    temperature: number[];
    soundLevel: number[];
    lightLevel: number[];
    motionLevel: number[];
    labels: string[];
  };
  title: string;
};

function isValidChartData(data: Props["data"]) {
  return (
    Array.isArray(data.sleepQuality) &&
    data.sleepQuality.length > 0 &&
    data.sleepQuality.every(x => typeof x === "number" && !isNaN(x)) &&
    Array.isArray(data.temperature) &&
    data.temperature.length > 0 &&
    data.temperature.every(x => typeof x === "number" && !isNaN(x)) &&
    Array.isArray(data.soundLevel) &&
    data.soundLevel.length > 0 &&
    data.soundLevel.every(x => typeof x === "number" && !isNaN(x)) &&
    Array.isArray(data.lightLevel) &&
    data.lightLevel.length > 0 &&
    data.lightLevel.every(x => typeof x === "number" && !isNaN(x)) &&
    Array.isArray(data.motionLevel) &&
    data.motionLevel.length > 0 &&
    data.motionLevel.every(x => typeof x === "number" && !isNaN(x)) &&
    Array.isArray(data.labels) &&
    data.labels.length > 0
  );
}

export default function SleepDiagram({ data, title }: Props) {
  if (!isValidChartData(data)) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.chartWrapper}>
          <Text style={{ color: "#fff", textAlign: "center", marginVertical: 20 }}>
            Chart data invalid or incomplete
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={{
              labels: data.labels,
              datasets: [
                { data: data.sleepQuality, color: () => "#3b82f6", strokeWidth: 2 },
                { data: data.temperature, color: () => "#f59e42", strokeWidth: 2 },
                { data: data.soundLevel, color: () => "#ef4444", strokeWidth: 2 },
                { data: data.lightLevel, color: () => "#fbbf24", strokeWidth: 2 },
                { data: data.motionLevel, color: () => "#a855f7", strokeWidth: 2 },
              ],
              legend: ["Quality", "Temp", "Sound", "Light", "Motion"],
            }}
            width={1000}
            height={240}
            fromZero={true}
            segments={4} 
            yAxisInterval={1}
            yLabelsOffset={10}
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: "#000",
              backgroundGradientFrom: "#1e3a8a",
              backgroundGradientTo: "#1e40af",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: () => "#fff",
              propsForDots: {
                r: "3",
                strokeWidth: "1",
                stroke: "#fff",
              },
            }}
            bezier
            style={{ borderRadius: 8 }}
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  chartWrapper: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "rgba(44, 62, 120, 0.85)",
    alignItems: "flex-start",
  },
});