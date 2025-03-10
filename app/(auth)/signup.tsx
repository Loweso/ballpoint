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

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white border border-black">
      <View className="p-3 bg-white rounded-lg shadow-md border border-black">
        <View className="items-center">
          <Image
            source={images.ballpointLogo}
            className="w-56 h-32"
            resizeMode="cover"
          />
        </View>

        <TextInput
          placeholder="Username"
          className="border border-gray-300 p-3 m-2 rounded-md"
          onChangeText={(text) => console.log("Username Input:", text)}
        />

        <View>
          <TextInput
            placeholder="Password"
            secureTextEntry={!showPassword}
            className="border border-gray-300 p-3 m-2 rounded-md"
            onChangeText={(text) => console.log("Password Input:", text)}
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

        <View>
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            className="border border-gray-300 p-3 m-2 rounded-md pr-10"
            onChangeText={(text) =>
              console.log("Confirm Password Input:", text)
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

        <TouchableOpacity
          className="bg-tertiary-buttonGreen p-2 rounded-md m-2"
          onPress={() => console.log("Sign Up Button Pressed")}
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
          onPress={() => console.log("Sign Up with Google Button Pressed")}
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
