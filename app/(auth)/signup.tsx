import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { images } from "@/constants";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { registerUser, clearError } from "@/lib/redux/slices/authSlice";
import * as SecureStore from "expo-secure-store";

const SignupPage = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [generalError, setGeneralError] = useState("");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    let isValid = true;
    let newErrors = {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    };

    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (!/^[a-zA-Z]\w{4,20}$/.test(username)) {
      newErrors.username =
        "Username must only contain alphanumeric characters that starts with a letter and be 4-20 characters long";
      isValid = false;
    }

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

    if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = "Passwords do not match.";
      isValid = false;
    }

    setValidationErrors(newErrors);
    setGeneralError(""); // Clear any general errors when validating
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(
        registerUser({
          username,
          email,
          password,
          passwordConfirmation,
        })
      ).unwrap();
      await SecureStore.setItemAsync("authState", "login");
      router.push("/(auth)/login");
    } catch (err: any) {
    

      // Handle backend validation errors
      if (
        err.username ||
        err.email ||
        err.password ||
        err.password_confirmation ||
        err.non_field_errors
      ) {
        const backendErrors = {
          username: err.username?.[0] || "",
          email: err.email?.[0] || "",
          password: err.password?.[0] || "",
          passwordConfirmation: err.password_confirmation?.[0] || "",
        };
        setValidationErrors(backendErrors);
        setGeneralError(err.non_field_errors?.[0] || "");
      } else if (err.message) {
        // Handle general error messages
        setGeneralError(err.message);
        setValidationErrors({
          username: "",
          email: "",
          password: "",
          passwordConfirmation: "",
        });
      } else {
        // Handle network or unexpected errors
        setGeneralError("An unexpected error occurred. Please try again.");
        setValidationErrors({
          username: "",
          email: "",
          password: "",
          passwordConfirmation: "",
        });
      }
    }
  };

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
      setGeneralError("");
      setValidationErrors({
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
      });
    };
  }, [dispatch]);

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white border border-black">
      <View className="p-3 bg-white rounded-lg shadow-md border border-black w-[75%]">
        <View className="items-center">
          <Image
            source={images.ballpointLogo}
            className="w-56 h-32"
            resizeMode="cover"
          />
        </View>

        <TextInput
          placeholder="Username"
          value={username}
          className="border border-gray-300 p-3 m-2 rounded-md"
          onChangeText={(username) => setUsername(username)}
        />
        {validationErrors.username ? (
          <Text className="text-red-500 mx-3 flex-wrap text-xs text-justify">
            {validationErrors.username}
          </Text>
        ) : null}

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

        <View>
          <TextInput
            placeholder="Confirm Password"
            value={passwordConfirmation}
            secureTextEntry={!showConfirmPassword}
            className="border border-gray-300 p-3 m-2 rounded-md pr-10"
            onChangeText={(password_confirmation) =>
              setPasswordConfirmation(password_confirmation)
            }
          />
          <TouchableOpacity
            className="absolute right-4 top-5"
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <FontAwesome
              name={showConfirmPassword ? "eye-slash" : "eye"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {validationErrors.passwordConfirmation ? (
          <Text className="text-red-500 mx-3 flex-wrap text-xs text-justify">
            {validationErrors.passwordConfirmation}
          </Text>
        ) : null}

        {generalError ? (
          <Text className="text-red-500 mx-3 flex-wrap text-xs text-justify">
            {generalError}
          </Text>
        ) : null}

        <TouchableOpacity
          className="bg-tertiary-buttonGreen p-2 rounded-md m-2"
          onPress={handleSignup}
          disabled={loading}
        >
          <Text className="text-white text-center font-bold">
            {loading ? "Signing up..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            await SecureStore.setItemAsync("authState", "login");
            router.replace("/(auth)/login");
          }}
        >
          <Text className="border border-gray-300 text-center text-gray-500 p-3 mt-4">
            Already have an account?{" "}
            <Text className="text-tertiary-buttonGreen font-semibold">
              Log in!
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignupPage;
