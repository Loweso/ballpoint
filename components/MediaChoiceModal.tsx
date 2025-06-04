import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MediaChoiceModalProps {
  visible: boolean;
  onCancel: () => void;
  onTakePhoto: () => void;
  onPickFile: () => void;
}

const MediaChoiceModal: React.FC<MediaChoiceModalProps> = ({
  visible,
  onCancel,
  onTakePhoto,
  onPickFile,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="bg-white p-6 rounded-xl w-11/12 max-w-md shadow-lg">
          <View className="flex-column">
            <Text className="text-xl font-bold mb-4">
              Choose Media to Extract Text From
            </Text>
            <Text className="text-base text-gray-700 mb-4">
              Would you like to take a photo or select an image/audio file from
              the library?
            </Text>
          </View>

          <TouchableOpacity
            onPress={onTakePhoto}
            className="flex-row items-center px-4 py-2 rounded-md mb-2"
          >
            <Ionicons name="camera-outline" size={30} color="black" />
            <Text className="pl-4 text-black text-lg">Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPickFile}
            className="flex-row items-center px-4 py-2 rounded-md mb-2"
          >
            <Ionicons name="image-outline" size={30} color="black" />
            <View className="pl-4 flex-column">
              <Text className="text-black text-lg">Choose from Library</Text>
              <Text className="text-gray-600 text-sm">
                Upload image file or audio files only.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onCancel}
            className="mt-2 self-center px-4 py-1"
          >
            <Text className="text-red-600">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MediaChoiceModal;
