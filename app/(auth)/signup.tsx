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
import { useRouter } from "expo-router";
import { Link } from "expo-router";
import { images } from "@/constants";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //validation
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  // Error messages
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const router = useRouter();

  // Email validation regex
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate form fields
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
    } else if (!/^[a-zA-Z]\w{4,20}$/.test(username)) {
      newErrors.username =
        "Username must only contain alphanumeric characters that starts with a letter and be 4-20 characters long";
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

    setErrors(newErrors);
    return isValid;
  };

  // Handle signup submission
  const handleSignup = () => {
    if (validateForm()) {
      console.log("Valid");
      // Handle successful signup (e.g., API request)
    } else {
      console.log("Error");
    }
  };

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
          className="border border-gray-300 p-3 m-2  rounded-md"
          onChangeText={(username) => setUsername(username)}
        />
        {errors.username ? (
          <Text className="text-red-500 mx-3 flex-wrap text-xs text-justify">
            {errors.username}
          </Text>
        ) : null}

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

        <View>
          <TextInput
            placeholder="Confirm Password"
            value={passwordConfirmation}
            secureTextEntry={!showConfirmPassword}
            className="border border-gray-300 p-3 m-2  rounded-md pr-10"
            onChangeText={(password_confirmation) =>
              setPasswordConfirmation(password_confirmation)
            }
          />
          <TouchableOpacity
            className="absolute right-4 top-5"
            onPress={() => {
              setShowConfirmPassword(!showConfirmPassword);
              console.log(
                "Toggled Confirm Password Visibility:",
                !showConfirmPassword
              );
            }}
          >
            <FontAwesome
              name={showConfirmPassword ? "eye-slash" : "eye"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {errors.passwordConfirmation ? (
          <Text className="text-red-500 mx-3 flex-wrap text-xs text-justify">
            {errors.passwordConfirmation}
          </Text>
        ) : null}

        <TouchableOpacity
          className="bg-tertiary-buttonGreen p-2 rounded-md m-2"
          onPress={handleSignup}
        >
          <Text className="text-white text-center font-bold">Sign Up</Text>
        </TouchableOpacity>

        <View className="flex-row items-center m-4">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="px-2 text-gray-500">OR</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>

        <TouchableOpacity
          className="p-4 flex-row justify-center items-center"
          onPress={() => router.push("/(root)/home")}
        >
          <Image
            source={images.googleLogo}
            className="w-10 h-10"
            resizeMode="contain"
          />
          <Text className="text-tertiary-buttonGreen m-2">
            Sign up with your Google Account
          </Text>
        </TouchableOpacity>

        <Link href="/login" asChild>
          <TouchableOpacity
            onPress={() => console.log("Navigating to Login Page")}
          >
            <Text className="border border-gray-300 text-center text-gray-500 p-3 mt-8">
              Already have an account?{" "}
              <Text className="text-tertiary-buttonGreen font-semibold">
                Log in!
              </Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default SignupPage;
