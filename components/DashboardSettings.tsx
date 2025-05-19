import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ManageCategories } from "./ManageCategories";
import React, { useState, useEffect, useRef } from "react";
import { useWindowDimensions } from "react-native";

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

  const contentRef = useRef<View>(null);
  const { height } = useWindowDimensions();
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.measure((x, y, width, height) => {
        setContentHeight(height);
      });
    }
  }, [isManageCategoriesVisible]);

  const closeModal = () => {
    setIsVisible(false);
    setIsManageCategoriesVisible(false);
  };

  const toggleManageCategories = () => {
    setIsManageCategoriesVisible(!isManageCategoriesVisible);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      >
        <View className="flex-1 justify-end items-center">
          <View
            style={{
              width: "100%",
              backgroundColor: "#e1f1e8",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowOpacity: 0.2,
              minHeight: 180,
              maxHeight: height * 0.9,
            }}
          >
            {/* Close Button */}
            <View className="relative">
              <TouchableOpacity
                className="absolute top-[10px] right-0 z-10"
                onPress={closeModal}
              >
                <Ionicons name="exit-outline" color="#080808" size={32} />
              </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <ScrollView
              ref={contentRef}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Manage Categories Button */}
              <TouchableOpacity onPress={toggleManageCategories}>
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

              {/* Manage Categories Component */}
              {isManageCategoriesVisible && (
                <ManageCategories
                  isVisible={isManageCategoriesVisible}
                  setIsVisible={setIsManageCategoriesVisible}
                  // initialMode prop removed here
                />
              )}
            </ScrollView>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};
