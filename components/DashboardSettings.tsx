import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";

interface DashboardSettingsModalProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

export const DashboardSettings: React.FC<DashboardSettingsModalProps> = ({
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
      <View className="bg-black/30 h-full flex justify-end items-center">
        <View className="h-[180px] w-full bg-primary-green px-4 py-8 rounded-t-xl shadow-md">
          <View className="relative">
            <TouchableOpacity
              className="absolute top-[-10px] right-0"
              onPress={closeModal}
            >
              <Ionicons name="exit-outline" color="#080808" size={32} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => console.log("Manage Categories Pressed")}
          >
            <View className="flex flex-row h-[40px] w-full mt-12 bg-secondary-lightyellow rounded-xl items-center">
              <Text className="absolute left-[10px] text-tertiary-textYellow text-lg">
                Manage Categories
              </Text>
              <Ionicons
                name="list-outline"
                className="absolute right-[10px]"
                color="#a09d45"
                size={32}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
