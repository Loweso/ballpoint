import React from 'react';
import { Modal, View, TextInput, TouchableWithoutFeedback, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NamingModalProps {
  visible: boolean;
  onClose: () => void;
  onCancel: () => void;
  onProceed: () => void;
}

const NamingModal: React.FC<NamingModalProps> = ({ visible, onClose, onCancel, onProceed }) => {
  React.useEffect(() => {
    console.log('Modal visibility changed:', visible);
  }, [visible]);

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
        <SafeAreaView className="bg-black/30 flex-1 justify-center items-center">
          <TouchableWithoutFeedback>
            <View className="bg-white flex-row rounded-xl items-center shadow-md p-2 gap-2 ">
              <View className="flex-none items-center ">
                <TextInput
                  placeholder="Enter Category Name"
                  className="justify-start text-lg text-gray-800 "
                  style={{width: 230, fontSize: 13}}
                  placeholderTextColor="#6B7280"
                  onChangeText={(text) => console.log('Category Name:', text)}
                />
              </View>
              <View className="flex-row items-center gap-2 ">
                <TouchableOpacity
                  className="p-1 rounded-full "
                  onPress={() => {
                    console.log('Cancel button pressed');
                    onCancel();
                  }}
                >
                  <Ionicons name="close-circle-outline" size={26} color="#EF4444" />
                </TouchableOpacity>
                <TouchableOpacity
                  className="p-1 rounded-full "
                  onPress={() => {
                    console.log('Proceed button pressed');
                    onProceed();
                  }}
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
