import React, { useState } from 'react';
import { View, TextInput, TouchableWithoutFeedback, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NamingModalProps {
  visible: boolean;
  onClose: () => void;
  onCancel: () => void;
  onProceed: (newName: string) => void; 
  placeholder?: string;
}

const NamingModal: React.FC<NamingModalProps> = ({ visible, onClose, onCancel, onProceed, placeholder }) => {
  const [name, setName] = useState(""); 

  React.useEffect(() => {
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

  if (!visible) return null; // Hide the modal when not visible

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View className="absolute inset-0 h-[100%] justify-center items-center bg-black/30">
        <TouchableWithoutFeedback>
          <View className="bg-white flex-row rounded-xl items-center shadow-md p-1 gap-2">
            <View className="flex-none items-center">
              <TextInput
                placeholder={placeholder}
                className="text-lg text-gray-800"
                style={{ width: 200, fontSize: 13 }}
                placeholderTextColor="#6B7280"
                value={name}
                onChangeText={setName} // Update state
              />
            </View>

            <View className="flex-row items-center gap-2">
              {/* Cancel button */}
              <TouchableOpacity
                className="p-1 rounded-full"
                onPress={() => {
                  onCancel();
                  setName(""); // Reset input on cancel
                }}
              >
                <Ionicons name="close-circle-outline" size={26} color="#EF4444" />
              </TouchableOpacity>

              {/* Proceed button */}
              <TouchableOpacity className="p-1 rounded-full" onPress={handleProceed}>
                <Ionicons name="arrow-forward-circle-outline" size={26} color="#EAB308" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NamingModal;
