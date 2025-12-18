import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard
} from "react-native";
import { useRouter } from "expo-router";

const RegistrationScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    Keyboard.dismiss();
    setRegistrationMessage("");

    if (!email.trim() || !password.trim()) {
      setRegistrationMessage("Email and Password are required!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setRegistrationMessage("Invalid email format!");
      return;
    }

    if (password.length < 6) {
      setRegistrationMessage("Password minimum 6 characters!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://sleepmonitor-backend.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          username: username.trim(),
        }),
      });

      const contentType = response.headers.get("content-type");
      const data = contentType?.includes("application/json")
        ? await response.json()
        : { message: "Unexpected response format" };

      if (response.ok) {
        setRegistrationMessage("Success! Account Created");

        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      } else {
        const errorMessage = data.message || "Failed to create account";
        setRegistrationMessage(`Error: ${errorMessage}`);
        console.error("Registration failed:", data);
      }
    } catch (error: any) {
      const errorMessage = error.message || "Network error occurred";
      setRegistrationMessage(`Error: ${errorMessage}`);
      console.error("Network Problem:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignIn = () => {
    router.push("/login");
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
        autoComplete="email"
        inputMode="email"
        returnKeyType="next"
        onSubmitEditing={() => Keyboard.dismiss()}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#aaa"
        autoComplete="new-password"
        returnKeyType="next"
      />

      <TextInput
        style={styles.input}
        placeholder="Username (optional)"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#aaa"
        autoComplete="username"
        returnKeyType="done"
        onSubmitEditing={handleRegister}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : (
        <Button title="Sign Up" onPress={handleRegister} color="#4CAF50" />
      )}

      {registrationMessage ? (
        <Text
          style={[
            styles.message,
            registrationMessage.startsWith("Success")
              ? styles.success
              : styles.error,
          ]}
        >
          {registrationMessage}
        </Text>
      ) : null}

      <TouchableOpacity
        style={styles.loginLinkContainer}
        onPress={goToSignIn}
      >
        <Text style={styles.loginLinkText}>
          Already have an account?{" "}
          <Text style={styles.loginLink}>Sign In</Text>
        </Text>
      </TouchableOpacity>
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
    height: 50,
    borderColor: "#555",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    color: "white",
    backgroundColor: "#222",
  },
  message: {
    marginTop: 20,
    padding: 10,
    textAlign: "center",
    fontWeight: "bold",
    borderRadius: 8,
  },
  success: {
    color: "green",
    backgroundColor: "#e8f5e9",
  },
  error: {
    color: "red",
    backgroundColor: "#ffebee",
  },
  loader: {
    marginVertical: 20,
  },
  loginLinkContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  loginLinkText: {
    color: "#aaa",
  },
  loginLink: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
});

export default RegistrationScreen;