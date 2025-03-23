import * as SecureStore from "expo-secure-store";
import axios from "axios";

const API_URL = `${process.env.EXPO_PUBLIC_DEVICE_IPV4}/api`;

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  passwordConfirmation: string
) => {
  // Replace with your actual backend URL

  try {
    const response = await axios.post(`${API_URL}/register/`, {
      username,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });

    return response.data; // Handle success response
  } catch (error: any) {
    throw error.response?.data || { message: "An error occurred" }; // Handle API errors
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, {
      email,
      password,
    });

    console.log("Login Response:", response.data); // Check if backend returns tokens

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
    await axios.post("/logout/");
  } catch (error) {
    console.error("Logout request failed", error);
  }

  await SecureStore.deleteItemAsync("access_token");
  await SecureStore.deleteItemAsync("refresh_token");
};
