import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "blue", 
      }}
    >
      <Tabs.Screen
        name="dashboard/index"
        options={{
          title: "Dashboard",
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sleep-solution/index"
        options={{
          title: "Sleep Solution",
          tabBarLabel: "Sleep Solution",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <FontAwesome name="lightbulb-o" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}