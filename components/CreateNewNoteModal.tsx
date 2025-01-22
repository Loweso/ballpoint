import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface CreateNewNoteModalProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

export const CreateNewNoteModal: React.FC<CreateNewNoteModalProps> = ({
  isVisible,
  setIsVisible,
}) => {
  const closeModal = () => {
    setIsVisible(false);
    console.log(isVisible);
  };
  const router = useRouter();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <SafeAreaView className="bg-black/30 h-full flex justify-center items-center">
        <View className="h-[200px] w-[80%] bg-white px-6 py-8 rounded-xl shadow-md">
          <View className="relative">
            <Text className="text-3xl">Title</Text>
            <TouchableOpacity
              className="absolute top-[-10px] right-0"
              onPress={closeModal}
            >
              <Ionicons name="close-outline" color="#5A5353" size={32} />
            </TouchableOpacity>
          </View>
          <View className="flex flex-row w-full mt-4 text-lg bg-white rounded-xl">
            <TextInput
              className=" h-full w-full text-lg bg-transparent border-b overflow-hidden"
              placeholder="Enter note title..."
              placeholderTextColor="gray"
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              router.push("/note");
              setIsVisible(false);
            }}
            className="bg-tertiary-buttonGreen/70 rounded-full p-4 w-full flex justify-center items-center mt-3 ov"
          >
            <Text className="text-white">Create New Note</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
