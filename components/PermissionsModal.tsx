import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

interface PermissionsModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({
  visible,
  onClose,
  title = "Permission Denied",
  message = "Sorry, we need camera and media library permissions to make this work.",
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="bg-white p-6 rounded-xl w-11/12 max-w-md shadow-lg">
          <Text className="text-lg font-bold mb-2">{title}</Text>
          <Text className="text-base text-gray-700 mb-4">{message}</Text>
          <TouchableOpacity
            onPress={onClose}
            className="bg-tertiary-buttonGreen/70 px-4 py-2 rounded-md self-end"
          >
            <Text className="text-white font-medium">Okay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PermissionsModal;