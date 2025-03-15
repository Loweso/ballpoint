import React from "react";
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface HighlightModalProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

export const HighlightModal: React.FC<HighlightModalProps> = ({
  isVisible,
  setIsVisible,
}) => {
  if (!isVisible) return null;

  const closeModal = () => {
    setIsVisible(false);
    Keyboard.dismiss();
    console.log(isVisible);
  };

  return (
    <View className="flex flex-row w-[20%] bg-black rounded-xl items-center">
      <TouchableOpacity onPress={() => console.log("Highlight text")}>
        <FontAwesome6 name="highlighter" size={20} color="#6B6B6B" />
      </TouchableOpacity>
      <View className="w-[1%] bg-secondary-buttonGrey rounded" />
      <TouchableOpacity
        className="absolute"
        onPress={() => console.log("Open AI enhance features")}
      >
        <LinearGradient
          colors={["#c6dfff", "#37b16e"]}
          style={{ width: 20, height: 20, borderRadius: 10 }}
        />
        <FontAwesome6 name="wand-magic-sparkles" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default HighlightModal;
