import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  SignUp: undefined;
  SignIn: undefined;
  Dashboard: undefined; // Tambahkan jika diperlukan
};

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Home"
>;
export type SignUpScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "SignUp"
>;
export type SignInScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "SignIn"
>;