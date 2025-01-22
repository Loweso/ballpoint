import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

interface CircleButtonProps {
  onPress?: () => void;
}

const CircleButton: React.FC<CircleButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      className="absolute bottom-10 right-12 z-50 w-20 h-20 bg-secondary-yellow rounded-full flex items-center justify-center font-light"
      onPress={onPress}
    >
      <Ionicons name="add-outline" size={50} color="black" />
    </TouchableOpacity>
  );
};

export default CircleButton;
