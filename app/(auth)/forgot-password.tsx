import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

enum ScreenState {
  FIND_ACCOUNT,
  USE_GOOGLE,
  CONFIRM_ACCOUNT,
  NEW_PASSWORD,
}

export default function ForgotPasswordFlow({ navigation }: any) {
  const [screenState, setScreenState] = useState<ScreenState>(
    ScreenState.FIND_ACCOUNT
  );
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const renderScreen = () => {
    switch (screenState) {
      case ScreenState.FIND_ACCOUNT:
        return renderFindAccountScreen();
      case ScreenState.USE_GOOGLE:
        return renderUseGoogleScreen();
      case ScreenState.CONFIRM_ACCOUNT:
        return renderConfirmAccountScreen();
      case ScreenState.NEW_PASSWORD:
        return renderNewPasswordScreen();
      default:
        return renderFindAccountScreen();
    }
  };

  const handleBackPress = () => {
    if (screenState > 0) {
      setScreenState(screenState - 1); // Go to the previous state in the flow
    } else {
      router.push("/login"); // ✅ Use router to navigate to the login screen
    }
  };

  // Screen 1: Find your account
  const renderFindAccountScreen = () => {
    return (
      <View className="flex-1 justify-start">
        <Text className="text-2xl font-bold mb-2">Find your account</Text>
        <Text className="text-base text-gray-600 mb-5">
          Enter your email address
        </Text>

        <TextInput
          className="h-12 border border-gray-300 rounded px-4 text-base mb-5"
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            console.log("Email entered:", text);
            setEmail(text);
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          className="h-12 bg-tertiary-buttonGreen rounded justify-center items-center mb-4"
          onPress={() => {
            if (email && email.includes("@") && email.includes(".")) {
              setScreenState(ScreenState.USE_GOOGLE);
            } else {
              alert("Please enter a valid email address");
            }
          }}
        >
          <Text className="text-white font-medium text-base">Continue</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Screen 2: Use your Google account
  const renderUseGoogleScreen = () => {
    return (
      <View className="flex-1 justify-start items-center">
        <Text className="text-2xl font-bold mb-2">Use your Google account</Text>
        <Text className="text-base text-gray-600 mb-5">
          Log into Google to quickly reset your password
        </Text>

        <View className="items-center my-8">
          <FontAwesome
            name="user-circle-o"
            size={72}
            color="black"
            style={{ paddingBottom: 15 }}
          />
          <Text className="text-xl font-medium">
            {email || "No email provided"}
          </Text>
        </View>

        <TouchableOpacity
          className="w-full h-12 bg-tertiary-buttonGreen rounded justify-center items-center mb-4"
          onPress={() => setScreenState(ScreenState.CONFIRM_ACCOUNT)}
        >
          <Text className="text-white font-medium text-base">Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity className="w-full h-12 border border-gray-300 rounded justify-center items-center">
          <Text className="text-gray-600 text-sm">Try another way</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Screen 3: Confirm your account
  const renderConfirmAccountScreen = () => {
    return (
      <View className="flex-1 justify-start">
        <Text className="text-xl font-bold mb-2">Confirm your account</Text>
        <Text className="text-sm text-gray-600 mb-5">
          We've sent a code to your email that needs to confirm your account.
          Enter that code.
        </Text>

        <TextInput
          className="h-12 border border-gray-300 rounded px-4 text-base mb-5"
          placeholder="Code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
        />

        <TouchableOpacity
          className="h-12 bg-tertiary-buttonGreen rounded justify-center items-center mb-4"
          onPress={() => setScreenState(ScreenState.NEW_PASSWORD)}
        >
          <Text className="text-white font-medium text-base">Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity className="h-12 border border-gray-300 rounded justify-center items-center">
          <Text className="text-gray-600 text-sm">Send code again</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Screen 4: Enter new password
  const renderNewPasswordScreen = () => {
    const handleSavePassword = () => {
      if (newPassword.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      router.push("/login");
    };

    return (
      <View className="flex-1 justify-start">
        <Text className="text-xl font-bold mb-5">Enter new password</Text>

        <View className="relative mb-5">
          <TextInput
            className="h-12 border border-gray-300 rounded px-4 text-base pr-12"
            placeholder="New password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNewPassword}
          />
          <TouchableOpacity
            className="absolute right-4 top-3"
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            <FontAwesome
              name={showNewPassword ? "eye-slash" : "eye"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <View className="relative mb-5">
          <TextInput
            className="h-12 border border-gray-300 rounded px-4 text-base pr-12"
            placeholder="Re-type new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            className="absolute right-4 top-3"
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <FontAwesome
              name={showConfirmPassword ? "eye-slash" : "eye"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="h-12 bg-tertiary-buttonGreen rounded justify-center items-center"
          onPress={handleSavePassword}
        >
          <Text className="text-white font-medium text-base">
            Save and continue to log in
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
          <View className="relative flex-row items-center mb-8 pt-2">
            <TouchableOpacity className="-ml-2 p-2" onPress={handleBackPress}>
              <AntDesign name="leftcircleo" size={24} color="black" />
            </TouchableOpacity>
            <Text className="text-xl font-medium ml-2">Reset Password</Text>
          </View>

          {renderScreen()}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
