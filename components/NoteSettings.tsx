import { Modal, View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ManageCategories } from "./ManageCategories";
import React, { useState, useRef } from "react";

interface NoteSettingsModalProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

export const NoteSettings: React.FC<NoteSettingsModalProps> = ({
  isVisible,
  setIsVisible,
}) => {
  const [isManageCategoriesVisible, setIsManageCategoriesVisible] =
    useState(false);
  const router = useRouter();

  const containerHeight = useRef(new Animated.Value(180)).current;

  const closeModal = () => {
    Animated.timing(containerHeight, {
      toValue: 180,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsVisible(false);
      setIsManageCategoriesVisible(false);
    });
  };

  const toggleManageCategories = () => {
    const newVisibility = !isManageCategoriesVisible;

    setIsManageCategoriesVisible(newVisibility);

    Animated.timing(containerHeight, {
      toValue: newVisibility ? 240 : 300,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View className="bg-black/30 h-full flex justify-end items-center">
        <Animated.View
          style={{
            height: 280,
            width: "100%",
            backgroundColor: "#e1f1e8",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowOpacity: 0.2,
          }}
        >
          <View className="relative">
            <TouchableOpacity
              className="absolute top-[10px] right-0 z-10"
              onPress={closeModal}
            >
              <Ionicons name="exit-outline" color="#080808" size={32} />
            </TouchableOpacity>
          </View>

          <View className="flex flex-row mt-16 items-center">
            <TouchableOpacity
              onPress={() => console.log("Search in Note Pressed")}
            >
              <View className="h-[120px] w-[90px] items-center bg-secondary-buttonGrey rounded-xl p-3">
                <Ionicons
                  name="search-outline"
                  className="my-2"
                  color="#080808"
                  size={56}
                />
                <Text className="text-center text-base leading-none">
                  Search in Note
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="ml-2"
              onPress={() => {
                toggleManageCategories();
                console.log("Manage Categories Pressed");
              }}
            >
              <View className="h-[120px] w-[90px] items-center bg-secondary-categlistyellow rounded-xl p-3">
                <Ionicons
                  name="list-outline"
                  className="my-2"
                  color="#a09d45"
                  size={56}
                />
                <Text className="text-center text-base text-tertiary-textYellow line-clamp-2 leading-none">
                  Manage Categories
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="ml-2"
              onPress={() => console.log("Rename Note Pressed")}
            >
              <View className="h-[120px] w-[90px] items-center bg-tertiary-buttonBlue rounded-xl p-3">
                <Ionicons
                  name="create-outline"
                  className="my-2"
                  color="#146FE1"
                  size={56}
                />
                <Text className="text-center text-base text-tertiary-textBlue line-clamp-2 leading-none">
                  Rename Note
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="ml-2"
              onPress={() => console.log("Delete Note Pressed")}
            >
              <View className="h-[120px] w-[90px] items-center bg-[#FFDEDE] rounded-xl p-3">
                <Ionicons
                  name="trash-outline"
                  className="my-2"
                  color="#e31e1e"
                  size={56}
                />
                <Text className="text-center text-base text-tertiary-textRed line-clamp-2 leading-none">
                  Delete Note
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <ManageCategories
            isVisible={isManageCategoriesVisible}
            setIsVisible={setIsManageCategoriesVisible}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

export default NoteSettings;
