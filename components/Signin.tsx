import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { getSupabase } from "../lib/supabaseClient";

export default function SignInScreen() {
  const router = useRouter();
  const supabase = getSupabase(); // ✅ FIX PENTING: Supabase DI DALAM KOMPONEN

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setLoginMessage("");
    setIsLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        setLoginMessage("Email dan password wajib diisi.");
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginMessage(`Login gagal: ${error.message}`);
      } else {
        setLoginMessage("Login berhasil! Mengalihkan...");
        setTimeout(() => {
          router.replace("/(tabs)/dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginMessage("Gagal terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#aaa"
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : (
        <Button title="Sign In" onPress={handleLogin} />
      )}

      {loginMessage ? (
        <Text
          style={[
            styles.message,
            loginMessage.includes("berhasil")
              ? styles.success
              : styles.error,
          ]}
        >
          {loginMessage}
        </Text>
      ) : null}

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Belum punya akun?</Text>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.signUpLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "black",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "white",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    color: "white",
    backgroundColor: "#222",
  },
  loader: {
    marginVertical: 20,
  },
  message: {
    marginTop: 20,
    textAlign: "center",
    fontWeight: "bold",
    padding: 10,
  },
  success: {
    color: "green",
    backgroundColor: "#e8f5e9",
  },
  error: {
    color: "red",
    backgroundColor: "#ffebee",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    alignItems: "center",
  },
  signUpText: {
    color: "white",
  },
  signUpLink: {
    fontWeight: "bold",
    color: "#4CAF50",
    textDecorationLine: "underline",
    marginLeft: 5,
  },
});
