import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { getSupabase } from "../lib/supabaseClient";
import * as Crypto from "expo-crypto";

export default function RegistrationScreen() {
  const router = useRouter();
  const supabase = getSupabase();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const hashPassword = async (password: string) => {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      password
    );
  };

  const handleRegister = async () => {
    if (isLoading) return;

    setRegistrationMessage("");

    if (!email || !password) {
      setRegistrationMessage("Email dan password wajib diisi.");
      return;
    }

    if (!isValidEmail(email)) {
      setRegistrationMessage("Format email tidak valid.");
      return;
    }

    if (password.length < 6) {
      setRegistrationMessage("Password minimal 6 karakter.");
      return;
    }

    setIsLoading(true);

    try {
      const passwordHash = await hashPassword(password);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (error) {
        setRegistrationMessage(`Registrasi gagal: ${error.message}`);
      } else if (data?.user) {
        // ⬇️ Jika tidak punya kolom password_hash, hapus bagian ini
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: data.user.id,
            email: email,
            username: username || null,
            password_hash: passwordHash,
          },
        ]);

        if (insertError) {
          console.error("Insert error:", insertError);
          setRegistrationMessage("Akun dibuat, tetapi gagal menyimpan data user.");
        } else {
          setRegistrationMessage("Akun berhasil dibuat!");
          setTimeout(() => {
            router.replace("/login");
          }, 1500);
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setRegistrationMessage("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Username (optional)"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginVertical: 20 }} />
      ) : (
        <Button title="SIGN UP" onPress={handleRegister} />
      )}

      {registrationMessage !== "" && (
        <Text
          style={[
            styles.message,
            registrationMessage.toLowerCase().includes("berhasil")
              ? styles.success
              : styles.error,
          ]}
        >
          {registrationMessage}
        </Text>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Sudah punya akun?</Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.footerLink}>Sign In</Text>
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
    backgroundColor: "#000",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 45,
    backgroundColor: "#222",
    borderColor: "#555",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    color: "#fff",
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
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  footerText: {
    color: "#fff",
  },
  footerLink: {
    color: "#4CAF50",
    marginLeft: 5,
    textDecorationLine: "underline",
  },
});
