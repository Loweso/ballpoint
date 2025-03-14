import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface ConfirmationModalProps {
  label: string;
  confirmText: string;
  cancelText: string;
  classnameConfirm?: string;
  classnameCancel?: string;
  classnameModal?: string;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  onConfirm: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  setIsVisible,
  label,
  confirmText,
  cancelText,
  classnameConfirm = "",
  classnameCancel = "",
  classnameModal = "",
  onConfirm,
}) => {
  if (!isVisible) return null; // Hide the modal if not visible

  const closeModal = () => setIsVisible(false);

  return (
    <View className="absolute inset-0 h-[100%] justify-center items-center bg-black/40">
      <View
        className={`w-[80%] bg-white px-4 py-6 rounded-xl ${classnameModal}`}
      >
        <Text className="text-center">{label}</Text>

        <View className="flex flex-row justify-around mt-4">
          {/* Cancel Button */}
          <TouchableOpacity
            onPress={closeModal}
            className={`rounded-xl py-2 px-4 w-[45%] items-center ${classnameCancel}`}
          >
            <Text
              className={
                classnameCancel.includes("bg-tertiary-buttonRed")
                  ? "text-white"
                  : "text-black"
              }
            >
              {cancelText}
            </Text>
          </TouchableOpacity>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={() => {
              onConfirm();
              closeModal();
            }}
            className={`rounded-xl py-2 px-4 w-[45%] items-center ${classnameConfirm}`}
          >
            <Text
              className={
                classnameConfirm.includes("bg-tertiary-buttonRed")
                  ? "text-white"
                  : "text-black"
              }
            >
              {confirmText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
