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
}

export const ManageCategories: React.FC<ManageCategoriesProps> = ({
  isVisible,
  setIsVisible,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const screenHeight = Dimensions.get("window").height;

  const slideAnim = useRef(new Animated.Value(screenHeight + 100)).current;

  const closeModal = () => {
    setIsVisible(false);
    console.log(isVisible);
  };

  const toggleMode = () => {
    setIsEditMode(!isEditMode);
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
        zIndex: 10,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 4,
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <View className="flex flex-row w-[98%] mt-2 mb-4 bg-secondary-categlistyellow rounded-xl items-center">
        <View className="flex flex-row absolute top-[10px] right-0">
          <TouchableOpacity>
            <Ionicons name="add-circle-outline" color="#a09d45" size={28} />
          </TouchableOpacity>
          <TouchableOpacity className="px-[10px] right-[4px]">
            <Ionicons name="trash-outline" color="#E31E1E" size={28} />
          </TouchableOpacity>
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
              <TouchableOpacity className="absolute right-[10px]">
                <Text className="text-tertiary-textGray">Rename</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

export default ManageCategories;
