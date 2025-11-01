import { Link } from 'expo-router';
import { Text, View, Button } from 'react-native';

export default function NotFound() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>404 - Page Not Found</Text>
      <Link href="/" asChild>
        <Button title="Go to Home" />
      </Link>
    </View>
  );
}
