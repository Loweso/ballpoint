import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableWithoutFeedback, SafeAreaView, TouchableOpacity } from 'react-native';
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
    console.log('Modal visibility changed:', visible);
    if (!visible) {
      setName(""); 
    }
  }, [visible]);

  const handleProceed = () => {
    if (name.trim()) { 
      console.log('Proceed button pressed with name:', name);
      onProceed(name);
      setName(""); 
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        console.log('Modal close request triggered');
        onClose();
      }}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <SafeAreaView className="absolute flex flex-1 bg-black/30 justify-center items-center">
          <TouchableWithoutFeedback>
            <View className="bg-white flex-row rounded-xl items-center shadow-md p-2 gap-2">
              <View className="flex-none items-center">
                <TextInput
                  placeholder={placeholder}
                  className="justify-start text-lg text-gray-800"
                  style={{ width: 230, fontSize: 13 }}
                  placeholderTextColor="#6B7280"
                  value={name}
                  onChangeText={(text) => setName(text)} // Update state
                />
              </View>
              <View className="flex-row items-center gap-2">
                {/* Cancel button */}
                <TouchableOpacity
                  className="p-1 rounded-full"
                  onPress={() => {
                    console.log('Cancel button pressed');
                    onCancel();
                    setName(""); // Reset input on cancel
                  }}
                >
                  <Ionicons name="close-circle-outline" size={26} color="#EF4444" />
                </TouchableOpacity>

                {/* Proceed button */}
                <TouchableOpacity
                  className="p-1 rounded-full"
                  onPress={handleProceed}
                >
                  <Ionicons name="arrow-forward-circle-outline" size={26} color="#EAB308" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default NamingModal;
