import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ExtractionWindowProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

export const ExtractionWindow: React.FC<ExtractionWindowProps> = ({
  isVisible,
  setIsVisible,
}) => {
  const closeModal = () => {
    setIsVisible(false);
    console.log(isVisible);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View className="bg-black/30 h-full flex relative ">
        <View className="h-[85%] w-full bg-primary-green px-6 py-8 rounded-xl shadow-md absolute bottom-0 left-0">
          <View className="relative">
            <Text className="text-3xl mt-8">Title</Text>
            <TouchableOpacity
              className="absolute top-[-10px] right-0"
              onPress={closeModal}
            >
              <Ionicons name="close-outline" color="#5A5353" size={32} />
            </TouchableOpacity>
          </View>

          <View className="gap-y-3">
            <Text className="text-xl mt-3">Header 1</Text>
            <Text className="">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};
