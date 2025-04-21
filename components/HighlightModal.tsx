import React from "react";
import { View, TouchableOpacity, Keyboard, Dimensions } from "react-native";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import QueryMenuModal from "./QueryMenuModal";
import { useState } from "react";

interface HighlightModalProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  position: { top: number; left: number };
}

export const HighlightModal: React.FC<HighlightModalProps> = ({
  isVisible,
  setIsVisible,
  position,
}) => {
  if (!isVisible) return null;

  const [isQueryMenuModal, setIsQueryMenuModalVisible] = useState(false);
  const screen = Dimensions.get("window");
  const MODAL_WIDTH = 120;
  const MODAL_HEIGHT = 36;

  let top = position.top + 10;
  let left = position.left;

  if (left < 10) left = 10;
  if (left + MODAL_WIDTH > screen.width) left = screen.width - MODAL_WIDTH - 10;

  if (top < 10) top = 10;
  if (top + MODAL_HEIGHT > screen.height) top = screen.height - MODAL_HEIGHT;

  const closeModal = () => {
    setIsVisible(false);
    Keyboard.dismiss();
    console.log(isVisible);
  };

  return (
    <View
      className="absolute z-100 bg-white rounded-2xl shadow-md items-center"
      style={{
        top,
        left,
        width: MODAL_WIDTH,
        height: MODAL_HEIGHT,
      }}
    >
      <View className="flex flex-row justify-content-center">
        <TouchableOpacity
          className="mx-1 mt-2"
          onPress={() => {
            console.log("Highlight text");
          }}
        >
          <FontAwesome6 name="highlighter" size={22} color="gray" />
        </TouchableOpacity>

        <View className="w-[1%] h-[65%] m-1 mt-2 bg-[#D3D3D3] rounded" />

        <TouchableOpacity
          className="mx-1 mt-1"
          onPress={() => {
            setIsQueryMenuModalVisible(true);
            console.log("Open AI enhance features");
          }}
        >
          <LinearGradient
            colors={["#146fe1", "#37b16e"]}
            style={{ width: 30, height: 30, borderRadius: 20 }}
          />
          <FontAwesome6
            className="absolute ml-[4px] mt-[4px]"
            name="wand-magic-sparkles"
            size={20}
            color="white"
          />
        </TouchableOpacity>

        <View className="w-[1%] h-[65%] m-1 mt-2 bg-[#D3D3D3] rounded" />

        <TouchableOpacity
          className="mx-1 mt-2"
          onPress={() => {
            closeModal();
          }}
        >
          <Ionicons name="close-circle-outline" size={22} color="#bf5e5e" />
        </TouchableOpacity>
      </View>

      <QueryMenuModal
        visible={isQueryMenuModal}
        onClose={closeModal} // change this in future
        onProcessQuery={closeModal} // change this in future
        onCompleteHighlightedText={closeModal} // change this in future
      />
    </View>
  );
};

export default HighlightModal;
