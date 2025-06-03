import React from "react";
import { ActivityIndicator, Modal, Text, View } from "react-native";

interface LoadingModalProps {
  visible: boolean;
  message?: string;
}

export const LoadingModal = ({
  visible,
  message = "Loading...",
}: LoadingModalProps) => (
  <Modal transparent animationType="fade" visible={visible}>
    <View className="flex-1 items-center justify-center bg-black/30">
      <View className="bg-white px-6 py-4 rounded-xl items-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-3 text-base text-gray-700">{message}</Text>
      </View>
    </View>
  </Modal>
);
