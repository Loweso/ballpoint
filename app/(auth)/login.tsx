import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { images } from "@/constants";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error messages
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

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

    setErrors(newErrors);
    return isValid;
  };

  const handleSignin = () => {
    if (validateForm()) {
      console.log("Valid");
      // Handle successful signup (e.g., API request)
    } else {
      console.log("Error");
    }
  };

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
          className="border border-gray-300 p-3 m-2  rounded-md"
          onChangeText={(email) => setEmail(email)}
        />
        {errors.email ? (
          <Text className="text-red-500 mx-3 flex-wrap text-xs text-justify">
            {errors.email}
          </Text>
        ) : null}

        <View>
          <TextInput
            placeholder="Password"
            value={password}
            secureTextEntry={!showPassword}
            className="border border-gray-300 p-3 m-2  rounded-md"
            onChangeText={(password) => setPassword(password)}
          />
          <TouchableOpacity
            className="absolute right-4 top-5"
            onPress={() => {
              setShowPassword(!showPassword);
              console.log("Toggled Password Visibility:", !showPassword);
            }}
          >
            <FontAwesome
              name={showPassword ? "eye-slash" : "eye"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {errors.password ? (
          <Text className="text-red-500 mx-3 flex-wrap text-xs text-justify">
            {errors.password}
          </Text>
        ) : null}

        <TouchableOpacity
          className="bg-tertiary-buttonGreen p-2 rounded-md m-2"
          onPress={handleSignin}
        >
          <Text className="text-white text-center font-bold">Log In</Text>
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

        <TouchableOpacity
          className="p-4 flex-row justify-center items-center"
          onPress={() => console.log("Log In with Google Button Pressed")}
        >
          <Image
            source={images.googleLogo}
            className="w-10 h-10"
            resizeMode="contain"
          />
          <Text className="text-tertiary-buttonGreen m-2">
            Log in with your Google Account
          </Text>
        </TouchableOpacity>

        <Link href="/signup" asChild>
          <TouchableOpacity
            onPress={() => console.log("Navigating to Sign up Page")}
          >
            <Text className="border border-gray-300 text-center text-gray-500 p-3 mt-8">
              Don't have an account?{" "}
              <Text className="text-tertiary-buttonGreen font-semibold">
                Sign up!
              </Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default LoginPage;
