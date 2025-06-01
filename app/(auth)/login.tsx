import React, { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { images } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { loginUser, clearError } from "@/lib/redux/slices/authSlice";
import GoogleSignInButton from "@/components/google/SignInWithGoogle";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    console.log("sdsd");
  }, []);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate form fields
  const validateForm = () => {
    let isValid = true;
    let newErrors = {
      email: "",
      password: "",
    };

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailPattern.test(email)) {
      newErrors.email = "Enter a valid email.";
      isValid = false;
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
      isValid = false;
    }

    setValidationErrors(newErrors);
    setGeneralError(""); // Clear any general errors when validating
    return isValid;
  };

  const handleSignin = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      router.replace("/(root)/home");
    } catch (err: any) {
      console.error("Login failed:", err);

      // Handle backend validation errors
      if (err.email || err.password || err.non_field_errors) {
        const backendErrors = {
          email: err.email?.[0] || "",
          password: err.password?.[0] || "",
        };
        setValidationErrors(backendErrors);
        setGeneralError(err.non_field_errors?.[0] || "");
      } else if (err.message) {
        // Handle general error messages
        setGeneralError(err.message);
        setValidationErrors({ email: "", password: "" });
      } else {
        // Handle network or unexpected errors
        setGeneralError("An unexpected error occurred. Please try again.");
        setValidationErrors({ email: "", password: "" });
      }
    }
  };

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
      setGeneralError("");
      setValidationErrors({ email: "", password: "" });
    };
  }, [dispatch]);

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <View className="p-3 bg-white rounded-lg shadow-md w-[75%]">
        <View className="items-center">
          <Image
            source={images.ballpointLogo}
            className="w-56 h-32"
            resizeMode="cover"
          />
        </View>

        <TextInput
          placeholder="Email"
          value={email}
          className="border border-gray-300 p-3 m-2 rounded-md"
          onChangeText={(email) => setEmail(email)}
        />
        {validationErrors.email ? (
          <Text className="text-red-500 mx-3 flex-wrap text-xs text-justify">
            {validationErrors.email}
          </Text>
        ) : null}

        <View>
          <TextInput
            placeholder="Password"
            value={password}
            secureTextEntry={!showPassword}
            className="border border-gray-300 p-3 m-2 rounded-md"
            onChangeText={(password) => setPassword(password)}
          />
          <TouchableOpacity
            className="absolute right-4 top-5"
            onPress={() => setShowPassword(!showPassword)}
          >
            <FontAwesome
              name={showPassword ? "eye-slash" : "eye"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {validationErrors.password ? (
          <Text className="text-red-500 mx-3 flex-wrap text-xs text-justify">
            {validationErrors.password}
          </Text>
        ) : null}

        {generalError ? (
          <Text className="text-red-500 mx-3 flex-wrap text-xs text-justify">
            {generalError}
          </Text>
        ) : null}

        <TouchableOpacity
          className="bg-tertiary-buttonGreen p-2 rounded-md m-2"
          onPress={handleSignin}
          disabled={loading}
        >
          <Text className="text-white text-center font-bold">
            {loading ? "Logging in..." : "Log In"}
          </Text>
        </TouchableOpacity>

        <View className="items-center m-1">
          <Link href="/forgot-password" asChild>
            <Text className="text-sm text-black">Forgot Password?</Text>
          </Link>
        </View>

        <View className="flex-row items-center m-4">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="px-2 text-gray-500">OR</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        <GoogleSignInButton />

        <TouchableOpacity
          onPress={async () => {
            await SecureStore.setItemAsync("authState", "signup");
            router.replace("/(auth)/signup");
          }}
        >
          <Text className="border border-gray-300 text-center text-gray-500 p-3 mt-8">
            Don't have an account?{" "}
            <Text className="text-tertiary-buttonGreen font-semibold">
              Sign up!
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;
