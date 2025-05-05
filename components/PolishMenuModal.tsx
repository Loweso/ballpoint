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
}

const PolishModal: React.FC<PolishModalProps> = ({
  visible,
  onClose,
  summarizeNotes,
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
            <View className="bg-white rounded-lg flex-column shadow-md">
              <TouchableOpacity
                className="flex-row m-1 gap-2 items-center rounded-lg"
                onPress={summarizeNotes}
              >
                <View className="flex-none p-1 rounded-md">
                  <MaterialCommunityIcons
                    name="note-edit-outline"
                    size={26}
                    color="black"
                  />
                </View>
                <Text className="flex-none text-black font-medium pr-2">
                  Summarize notes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row m-1 gap-2 items-center rounded-lg"
                onPress={() => console.log("Organize notes")}
              >
                <View className="flex-none p-1 rounded-md">
                  <MaterialCommunityIcons
                    name="note-check-outline"
                    size={26}
                    color="black"
                  />
                </View>
                <Text className="flex-none text-black font-medium">
                  Organize notes
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PolishModal;
