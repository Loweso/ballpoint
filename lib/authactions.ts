import * as SecureStore from "expo-secure-store";
import axios from "axios";
import api from "@/utils/api";

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  passwordConfirmation: string
) => {
  try {
    console.log("Current API URL:", process.env.EXPO_PUBLIC_DEVICE_IPV4);
    const response = await api.post("/register", {
      username,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });

    return response.data;
  } catch (error: any) {
    console.log("like JENNIE: " + JSON.stringify(error, null, 2));
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post("/login", {
      email,
      password,
    });

    console.log("Login Response:", response.data);

    const { access, refresh } = response.data;

    await SecureStore.setItemAsync("access_token", access);
    await SecureStore.setItemAsync("refresh_token", refresh);

    return response.data;
  } catch (error: any) {
    console.error("Login failed", error.response?.data || error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await axios.post("/logout");
  } catch (error) {
    console.error("Logout request failed", error);
  }

  await SecureStore.deleteItemAsync("access_token");
  await SecureStore.deleteItemAsync("refresh_token");
};
