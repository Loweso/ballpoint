import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

interface ConfirmationModalProps {
  label: string;
  confirmText: string;
  cancelText: string;
  classnameConfirm?: string;
  classnameCancel?: string;
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  classnameModal?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  setIsVisible,
  label,
  confirmText,
  cancelText,
  classnameConfirm,
  classnameCancel,
  classnameModal,
}) => {
  const closeModal = () => {
    setIsVisible(false);
    console.log(isVisible);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View
        className={` w-[50%] bg-white px-2 py-6 rounded-xl ${classnameModal}`}
      >
        <Text className=" text-center">{label}</Text>
        <View className="flex flex-row w-full justify-around">
          <TouchableOpacity
            onPress={closeModal}
            className={`rounded-xl py-2 px-4 w-[45%] flex justify-center items-center mt-3 ${classnameCancel}`}
          >
            <Text
              className={`${
                classnameCancel?.includes("bg-tertiary-buttonRed")
                  ? "text-white"
                  : "text-black"
              }`}
            >
              {cancelText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={closeModal}
            className={` rounded-xl py-2 px-4 w-[45%] flex justify-center items-center mt-3 ${classnameConfirm}`}
          >
            <Text
              className={`${
                classnameConfirm?.includes("bg-tertiary-buttonRed")
                  ? "text-white"
                  : "text-black"
              }`}
            >
              {confirmText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
