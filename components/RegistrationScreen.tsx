import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { useRouter } from "expo-router";

const RegistrationScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [registrationMessage, setRegistrationMessage] = useState("");

  const router = useRouter();

  const handleRegister = async () => {
    console.log("handleRegister dipanggil!");

    if (!email || !password) {
      setRegistrationMessage("Email dan Password wajib diisi!");
      return;
    }

    try {
      const response = await fetch("http://10.0.2.2:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await response.json();

      if (response.ok) {
        setRegistrationMessage("Success! Account Created");
        console.log("Success! Account Created:", data);

        setTimeout(() => {
          console.log("DEBUG: Akan mencoba navigasi ke /auth/signIn...");
          try {
            router.replace("./auth/signIn"); // pastikan path ini valid di expo-router
            console.log("DEBUG: Navigasi berhasil ke /auth/signIn!");
          } catch (error) {
            console.error("DEBUG: Gagal melakukan navigasi!", error);
          }
        }, 2000);
      } else {
        setRegistrationMessage(
          `Failed! Create Account: ${data.message || "Failed to create account"}`
        );
        console.error("Failed! Create Account:", data);
      }
    } catch (error) {
      let errorMessage = "Network Problem: Unknown error";
      if (error instanceof Error) {
        errorMessage = `Network Problem: ${error.message}`;
      }
      setRegistrationMessage(errorMessage);
      console.error("Network Problem:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Username (optional)"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#aaa"
      />
      <Button title="Sign Up" onPress={handleRegister} />
      {registrationMessage ? (
        <Text style={styles.message}>{registrationMessage}</Text>
      ) : null}
    </View>
  );
};

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
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: "white",
    backgroundColor: "#222",
  },
  message: {
    marginTop: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "green",
  },
});

export default RegistrationScreen;
