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
import { supabase } from "../lib/supabaseClient";
import * as Crypto from "expo-crypto";

const RegistrationScreen = () => {
  const router = useRouter();

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
    setRegistrationMessage("");

    if (!email || !password) {
      setRegistrationMessage("Email and password are required.");
      return;
    }

    if (!isValidEmail(email)) {
      setRegistrationMessage("Invalid email format.");
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
        setRegistrationMessage(`Failed to register: ${error.message}`);
      } else if (data?.user) {
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
          setRegistrationMessage("Account created, but failed to save profile.");
        } else {
          setRegistrationMessage("Account created successfully!");
          setTimeout(() => {
            router.replace("/login");
          }, 2000);
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setRegistrationMessage("Network error occurred.");
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
            registrationMessage.toLowerCase().includes("success")
              ? styles.success
              : styles.error,
          ]}
        >
          {registrationMessage}
        </Text>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.footerLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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

export default RegistrationScreen;
