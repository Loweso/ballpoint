import { Modal, View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ManageCategories } from "./ManageCategories";
import React, { useState, useRef } from "react";

interface DashboardSettingsModalProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

export const DashboardSettings: React.FC<DashboardSettingsModalProps> = ({
  isVisible,
  setIsVisible,
}) => {
  const [isManageCategoriesVisible, setIsManageCategoriesVisible] =
    useState(false);
  const [manageMode, setManageMode] = useState<"view" | "edit">("edit");

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

  const toggleManageCategories = (mode: "view" | "edit") => {
    const newVisibility = !isManageCategoriesVisible;

    setIsManageCategoriesVisible(newVisibility);
    setManageMode(mode);

    Animated.timing(containerHeight, {
      toValue: newVisibility ? 300 : 180,
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
            height: containerHeight,
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
          <View>
            <TouchableOpacity
              onPress={() => {
                toggleManageCategories("edit");
                console.log(setIsManageCategoriesVisible);
                console.log("Manage Categories Pressed");
              }}
            >
              <View className="flex flex-row h-[40px] w-full mt-16 bg-secondary-lightyellow rounded-xl items-center">
                <Text className="absolute left-[10px] text-tertiary-textYellow text-xl">
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
          <ManageCategories
            isVisible={isManageCategoriesVisible}
            setIsVisible={setIsManageCategoriesVisible}
            initialMode={manageMode}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};
