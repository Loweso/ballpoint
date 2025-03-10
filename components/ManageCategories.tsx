import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  Easing,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";

interface ManageCategoriesProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  initialMode?: "view" | "edit";
}

export const ManageCategories: React.FC<ManageCategoriesProps> = ({
  isVisible,
  setIsVisible,
  initialMode = "view",
}) => {
  const [mode, setMode] = useState<"view" | "edit">(initialMode);
  const router = useRouter();
  const screenHeight = Dimensions.get("window").height;

  const slideAnim = useRef(new Animated.Value(screenHeight + 100)).current;

  const closeModal = () => {
    setIsVisible(false);
    console.log(isVisible);
  };

  const changeManageCategories = (state: "view" | "edit") => {
    setMode(state);
    setIsVisible(true);
  };

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0, // Slide in (visible position)
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight + 300, // Slide out (hidden position)
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        position: mode === "view" ? "absolute" : "relative",
        zIndex: 10,
        flex: 1,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 4,
        top: mode === "view" ? 54 : "auto",
        left: mode === "view" ? 0 : "auto",
        right: mode === "view" ? 0 : "auto",
        bottom: mode === "view" ? 0 : "auto",
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: mode === "view" ? "rgba(0,0,0,0.5)" : "transparent",
      }}
    >
      <View className="flex flex-row w-[98%] mt-2 mb-4 bg-secondary-categlistyellow rounded-xl items-center">
        <View className="flex flex-row absolute top-[10px]">
          {mode === "edit" && (
            <TouchableOpacity className="pl-[270px]">
              <Ionicons name="add-circle-outline" color="#a09d45" size={28} />
            </TouchableOpacity>
          )}
          {mode === "edit" && (
            <TouchableOpacity className="pl-[10px] right-[4px]">
              <Ionicons name="trash-outline" color="#E31E1E" size={28} />
            </TouchableOpacity>
          )}
          {mode === "view" && (
            <TouchableOpacity
              className="left-[16px]"
              onPress={() => setIsVisible(false)}
            >
              <Ionicons
                name="arrow-back-circle-outline"
                color="#080808"
                size={28}
              />
            </TouchableOpacity>
          )}
        </View>

        <View className="w-full pl-[20px] pr-[10px] pt-[30px] pb-[20px]">
          {[
            "Category Name",
            "Category Name",
            "Category Name",
            "Category Name",
          ].map((category, index) => (
            <View
              key={index}
              className="flex-row justify-space-between items-center top-[10px]"
            >
              <Text className="py-[2px] text-lg">{category}</Text>
              {mode === "edit" && (
                <TouchableOpacity className="absolute right-[10px]">
                  <Text className="text-tertiary-textGray">Rename</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

export default ManageCategories;
