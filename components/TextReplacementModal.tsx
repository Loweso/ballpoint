import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface TextReplacementModalProps {
  visible: boolean;
  onClose: () => void;
  onReplace: () => void;
  processedText: string;
}

const TextReplacementModal: React.FC<TextReplacementModalProps> = ({
  visible,
  onClose,
  onReplace,
  processedText,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <SafeAreaView className="bg-black/30 flex-1 justify-center items-center">
          <TouchableWithoutFeedback>
            <View className="bg-white w-4/5 rounded-lg shadow-md p-4 space-y-4">
              {/* Processed Text Display */}
              <View className="bg-gray-100 rounded-lg p-4">
                <Text className="text-gray-800 text-base">{processedText}</Text>
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-end gap-x-3 mt-4">
                <TouchableOpacity
                  className="flex-row items-center px-4 py-2 rounded-lg bg-gray-200"
                  onPress={onClose}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color="black"
                  />
                  <Text className="ml-2 text-black font-medium">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center px-4 py-2 rounded-lg bg-blue-500"
                  onPress={onReplace}
                >
                  <MaterialCommunityIcons
                    name="content-save"
                    size={20}
                    color="white"
                  />
                  <Text className="ml-2 text-white font-medium">Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default TextReplacementModal;
