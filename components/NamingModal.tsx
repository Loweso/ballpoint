import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NamingModalProps {
  visible: boolean;
  onClose: () => void;
  onCancel: () => void;
  onProceed: (newName: string) => void;
  placeholder?: string;
}

const NamingModal: React.FC<NamingModalProps> = ({
  visible,
  onClose,
  onCancel,
  onProceed,
  placeholder,
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!visible) {
      setName("");
    }
  }, [visible]);

  const handleProceed = () => {
    if (name.trim()) {
      onProceed(name);
      setName("");
    }
  };

  if (!visible) return null;

  return (
    <View className="absolute inset-0 h-full justify-center items-center bg-black/30">
      {/* MODAL CONTENT */}
      <View className="bg-white flex-row rounded-xl items-center shadow-md p-1 gap-2 z-10">
        <TextInput
          placeholder={placeholder}
          className="text-lg text-gray-800"
          style={{ width: 200, fontSize: 13 }}
          placeholderTextColor="#6B7280"
          value={name}
          onChangeText={setName}
        />

        {/* Action Buttons */}
        <View className="flex-row items-center gap-1">
          <TouchableOpacity
            className="p-1 rounded-full"
            onPress={() => {
              onCancel();
              setName("");
            }}
          >
            <Ionicons name="close-circle-outline" size={26} color="#EF4444" />
          </TouchableOpacity>

          <TouchableOpacity
            className="p-1 rounded-full"
            onPress={handleProceed}
          >
            <Ionicons
              name="arrow-forward-circle-outline"
              size={26}
              color="#EAB308"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default NamingModal;
