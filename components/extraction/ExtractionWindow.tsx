import React from "react";
import { File } from "@/app/note";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ExtractionWindowProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  selectedFile?: File | null;
}

export const ExtractionWindow: React.FC<ExtractionWindowProps> = ({
  isVisible,
  setIsVisible,
  selectedFile,
}) => {
  const closeModal = () => {
    setIsVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View className="bg-black/30 h-full flex relative ">
        <View className="flex flex-col max-h-[80%] w-full bg-primary-green px-6 py-8 rounded-t-xl shadow-md absolute bottom-0 left-0">
          {selectedFile?.name ? (
            <Text className="">{selectedFile.name}</Text>
          ) : null}
          <TouchableOpacity
            className="absolute right-0 px-6 py-8"
            onPress={closeModal}
          >
            <Ionicons name="exit-outline" color="#5A5353" size={32} />
          </TouchableOpacity>
          <ScrollView className="mt-8 border p-4">
            <View className="relative">
              <Text className="text-3xl">Title</Text>
            </View>

            <View className="gap-y-3">
              <Text className="text-xl mt-3">Header 1</Text>
              <Text className="text-justify">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Text>
            </View>
          </ScrollView>

          <Text className="text-center mt-4 font-semibold text-lg">
            Insert to notes?
          </Text>
          <View className="flex flex-row justify-around mt-2 ">
            <Pressable
              onPress={closeModal}
              className="shadow-md py-2 w-[40%] flex flex-row justify-center rounded-xl bg-zinc-100"
            >
              <Text className="text-2xl">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={closeModal}
              className="shadow-md py-2 w-[40%] flex flex-row justify-center rounded-xl bg-secondary-yellow"
            >
              <Text className="text-2xl">Insert</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
