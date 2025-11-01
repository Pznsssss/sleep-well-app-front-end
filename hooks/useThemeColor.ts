import { useColorScheme } from "./useColorScheme";
import { Colors } from "../constants/Colors";

// Pastikan theme hanya berupa 'light' atau 'dark'
type Theme = 'light' | 'dark';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const scheme = useColorScheme();
  // Pastikan theme hanya 'light' atau 'dark'
  const theme: Theme = scheme === 'dark' ? 'dark' : 'light';
  
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }
  
  return Colors[theme][colorName];
}