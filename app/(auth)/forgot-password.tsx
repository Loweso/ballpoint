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
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api } from "../../lib/redux/slices/authSlice";

enum ScreenState {
  FIND_ACCOUNT,
  VERIFY_EMAIL,
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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const renderScreen = () => {
    switch (screenState) {
      case ScreenState.FIND_ACCOUNT:
        return renderFindAccountScreen();
      case ScreenState.VERIFY_EMAIL:
        return renderVerifyEmailScreen();
      case ScreenState.NEW_PASSWORD:
        return renderNewPasswordScreen();
      default:
        return renderFindAccountScreen();
    }
  };

  const handleBackPress = () => {
    if (screenState > 0) {
      setScreenState(screenState - 1);
    } else {
      router.push("/login");
    }
  };

  const handleSendVerificationCode = async () => {
    if (!email || !email.includes("@") || !email.includes(".")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/api/forgot-password", { email });
      setScreenState(ScreenState.VERIFY_EMAIL);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to send verification code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert("Error", "Please enter the verification code");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/api/verify-code", { email, code });
      setScreenState(ScreenState.NEW_PASSWORD);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Invalid verification code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/api/reset-password", {
        email,
        code,
        new_password: newPassword,
      });
      Alert.alert("Success", "Password has been reset successfully", [
        { text: "OK", onPress: () => router.push("/login") },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to reset password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Screen 1: Find your account
  const renderFindAccountScreen = () => {
    return (
      <View className="flex-1 justify-start">
        <Text className="text-2xl font-bold mb-2">Find your account</Text>
        <Text className="text-base text-gray-600 mb-5">
          Enter your email address to reset your password
        </Text>

        <TextInput
          className="h-12 border border-gray-300 rounded px-4 text-base mb-5"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />

        <TouchableOpacity
          className="h-12 bg-tertiary-buttonGreen rounded justify-center items-center mb-4"
          onPress={handleSendVerificationCode}
          disabled={isLoading}
        >
          <Text className="text-white font-medium text-base">
            {isLoading ? "Sending..." : "Send Verification Code"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Screen 2: Verify Email
  const renderVerifyEmailScreen = () => {
    return (
      <View className="flex-1 justify-start">
        <Text className="text-xl font-bold mb-2">Verify your email</Text>
        <Text className="text-sm text-gray-600 mb-5">
          We've sent a verification code to {email}. Please enter the code
          below.
        </Text>

        <TextInput
          className="h-12 border border-gray-300 rounded px-4 text-base mb-5"
          placeholder="Enter verification code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          editable={!isLoading}
        />

        <TouchableOpacity
          className="h-12 bg-tertiary-buttonGreen rounded justify-center items-center mb-4"
          onPress={handleVerifyCode}
          disabled={isLoading}
        >
          <Text className="text-white font-medium text-base">
            {isLoading ? "Verifying..." : "Verify Code"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="h-12 border border-gray-300 rounded justify-center items-center"
          onPress={handleSendVerificationCode}
          disabled={isLoading}
        >
          <Text className="text-gray-600 text-sm">Resend code</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Screen 3: Enter new password
  const renderNewPasswordScreen = () => {
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
            editable={!isLoading}
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
            editable={!isLoading}
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
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          <Text className="text-white font-medium text-base">
            {isLoading ? "Resetting..." : "Reset Password"}
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
