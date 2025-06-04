import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

interface PermissionsModalProps {
  visible: boolean;
  onClose: () => void;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="bg-white p-6 rounded-xl w-11/12 max-w-md shadow-lg">
          <Text className="text-lg font-bold mb-2">Permission Denied</Text>
          <Text className="text-base text-gray-700 mb-4">
            Sorry, we need camera and media library permissions to make this
            work.
          </Text>
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
