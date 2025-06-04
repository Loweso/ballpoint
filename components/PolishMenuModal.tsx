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

interface PolishModalProps {
  visible: boolean;
  onClose: () => void;
  summarizeNotes: () => void;
  setIsOrganizePreferencesModalOpen: (open: boolean) => void;
}

const PolishModal: React.FC<PolishModalProps> = ({
  visible,
  onClose,
  summarizeNotes,
  setIsOrganizePreferencesModalOpen,
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
            <View className="bg-white w-4/5 rounded-lg flex-column shadow-md">
              <TouchableOpacity
                className="flex-row m-1 p-2 gap-2 items-center rounded-lg"
                onPress={summarizeNotes}
              >
                <View className="flex-none p-1 rounded-md">
                  <MaterialCommunityIcons
                    name="note-edit-outline"
                    size={26}
                    color="black"
                  />
                </View>
                <View className="flex-column">
                  <Text className="flex-none text-black font-medium pr-2">
                    Summarize notes
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    Generate a brief synthesis of your notes.
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row m-1 p-2 gap-2 items-center rounded-lg"
                onPress={() => {
                  setIsOrganizePreferencesModalOpen(true);
                  setTimeout(() => {
                    onClose();
                  }, 100);
                }}
              >
                <View className="flex-none p-1 rounded-md">
                  <MaterialCommunityIcons
                    name="note-check-outline"
                    size={26}
                    color="black"
                  />
                </View>
                <View className="flex-column">
                  <Text className="flex-none text-black font-medium pr-2">
                    Organize notes
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    Structure out the main points of your notes.
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PolishModal;
