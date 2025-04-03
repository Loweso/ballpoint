import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import React from "react";

import { ConfirmationModal } from "@/components/ConfirmationModal";

export default function User() {
  const [username, setUsername] = useState("Username");
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const router = useRouter();

  const handleUsernameChange = (text: string) => {
    setUsername(text);
  };

  return (
    <SafeAreaView className="flex w-screen h-full bg-primary-white">
      <View className="flex min-h-screen bg-gray-200">
        <View className="flex bg-secondary-accentGreen h-[240px] z-50">
          <TouchableOpacity
            className="bg-transparent w-16 p-4"
            onPress={() => router.push("/home")}
          >
            <Ionicons name="arrow-back-outline" size={35} color="black" />
          </TouchableOpacity>

          <View className="flex-row items-center justify-baseline pt-8 pr-10">
            {/*Placeholder icon for user profile*/}
            <Ionicons
              name="person-circle-outline"
              className="px-6"
              size={130}
            />

            <TouchableOpacity
              className="absolute left-28 bottom-4 bg-transparent w-16"
              onPress={() => console.log("User Profile Picture Change")}
            >
              <Ionicons
                name="camera-reverse"
                className="absolute bottom-[5px] right-[21px] z-20"
                size={25}
                color="black"
              />
              <Ionicons
                name="ellipse-outline"
                className="absolute bottom-[-5px] z-20"
                size={45}
                color="black"
              />
              <Ionicons
                name="ellipse"
                className="absolute bottom-[-5px] z-10"
                size={45}
                color="#f9f9f9"
              />
            </TouchableOpacity>

            <Text
              className="flex-1 text-4xl"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {username}
            </Text>
          </View>
        </View>

        <View className="flex bg-primary-white h-[270px] items-left">
          <View className="pt-6 pl-8">
            <Text className="text-xl text-tertiary-buttonGreen">
              Profile Info
            </Text>
            <TouchableOpacity
              className="pt-4 pr-16"
              onPress={() => setIsEditing(true)}
            >
              {isEditing ? (
                <TextInput
                  value={username}
                  onChangeText={handleUsernameChange}
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                  className="text-2xl border-b border-gray-200"
                />
              ) : (
                <>
                  <Text className="text-2xl">{username}</Text>
                  <Text className="text-tertiary-textGray">
                    Tap to change username
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <View className="pt-4">
              <Text className="text-2xl">MM/DD/YYYY</Text>
              <Text className="text-tertiary-textGray">Date of Birth</Text>
            </View>

            <View className="pt-4">
              <Text className="text-2xl underline">user@gmail.com</Text>
              <Text className="text-tertiary-textGray">Email</Text>
            </View>
          </View>
        </View>

        <View className="flex bg-primary-white h-[50px] mt-10 items-center justify-center">
          <TouchableOpacity
            onPress={() => {
              setIsConfirmationVisible(true);
              console.log("Logout button Pressed");
            }}
          >
            <Text className="text-xl text-tertiary-textRed">Log out</Text>
          </TouchableOpacity>
        </View>

        <ConfirmationModal
          isVisible={isConfirmationVisible}
          setIsVisible={setIsConfirmationVisible}
          label="Log out of your account?"
          confirmText="Log out"
          cancelText="Cancel"
          classnameConfirm="bg-tertiary-buttonRed"
          classnameCancel="bg-secondary-buttonGrey"
          onConfirm={() => {
            console.log("Confirmed Logout");
            setIsConfirmationVisible(false);
            router.push("/(auth)/login");
          }}
        />
      </View>
    </SafeAreaView>
  );
}
