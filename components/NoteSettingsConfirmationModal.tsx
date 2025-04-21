import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

type NoteSettingsConfirmationModalProps = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  onConfirm: () => void;
  noteName: string;
};

const NoteSettingsConfirmationModal = ({
  isVisible,
  setIsVisible,
  onConfirm,
  noteName,
}: NoteSettingsConfirmationModalProps) => {
  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent
      onRequestClose={() => setIsVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black/30 bg-opacity-50">
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="w-80 bg-white rounded-2xl p-6 space-y-4">
              <Text className="text-lg font-bold text-center text-primary-text">
                Delete Note?
              </Text>
              <Text className="text-center text-base text-secondary-text">
                This action cannot be undone. Are you sure you want to delete{" "}
                <Text className="font-semibold text-primary-text">
                  {noteName}
                </Text>
                ?
              </Text>

              <View className="flex-row justify-between mt-4">
                <TouchableOpacity
                  className="flex-1 mr-2 p-3 rounded-xl bg-slate-500"
                  onPress={() => setIsVisible(false)}
                >
                  <Text className="text-center text-white font-semibold">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 ml-2 p-3 rounded-xl bg-tertiary-buttonRed"
                  onPress={() => {
                    onConfirm();
                    setIsVisible(false);
                  }}
                >
                  <Text className="text-center text-white font-semibold">
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default NoteSettingsConfirmationModal;
