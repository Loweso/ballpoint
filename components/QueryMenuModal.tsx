import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface QueryMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onProcessQuery: () => void;
  onCompleteHighlightedText: () => void;
  setQueryText: (str: string) => void;
  setSelectedText: (str: string) => void;
  queryText: string;
}

const QueryMenuModal: React.FC<QueryMenuModalProps> = ({
  visible,
  onClose,
  onProcessQuery,
  onCompleteHighlightedText,
  setQueryText,
  setSelectedText,
  queryText,
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
            <View className="bg-white w-4/5 rounded-lg shadow-md p-4 space-y-4">
              {/* Query Input */}
              <View className="flex-row items-center bg-gray-100 rounded-lg p-2">
                <TextInput
                  value={queryText}
                  onChangeText={(text) => setQueryText(text)}
                  placeholder="Improve with a query..."
                  style={{ width: 230, fontSize: 15 }}
                  className="flex-1 text-lg text-gray-800"
                  placeholderTextColor="#6B7280"
                />
              </View>

              {/* Options */}
              <TouchableOpacity
                className="flex-row m-1 gap-2 items-center rounded-lg"
                onPress={onProcessQuery}
              >
                <View className="flex-none p-1 rounded-md">
                  <MaterialCommunityIcons
                    name="rotate-3d-variant"
                    size={26}
                    color="black"
                  />
                </View>
                <Text className="flex-none text-black font-medium pr-2">
                  Process Query
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row m-1 gap-2 items-center rounded-lg"
                onPress={onCompleteHighlightedText}
              >
                <View className="flex-none p-1 rounded-md">
                  <MaterialCommunityIcons
                    name="form-textbox"
                    size={26}
                    color="black"
                  />
                </View>
                <Text className="flex-none text-black font-medium">
                  Complete Highlighted Text
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row m-1 gap-2 items-center rounded-lg"
                onPress={() => {
                  console.log("Cancel button pressed");
                  onClose();
                  setQueryText(""); // Clear the query text
                  setSelectedText("");
                }}
              >
                <View className="flex-none p-1 rounded-md">
                  <MaterialCommunityIcons
                    name="exit-to-app"
                    size={26}
                    color="black"
                  />
                </View>
                <Text className="flex-none text-black font-medium">
                  Cancel Query
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default QueryMenuModal;
