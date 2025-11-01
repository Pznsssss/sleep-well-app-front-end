import { View, type ViewProps } from "react-native";

// Ganti path alias dengan path relatif
import { useThemeColor } from "../hooks/useThemeColor"; // Naik satu level ke src, lalu masuk hooks

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}