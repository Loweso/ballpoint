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
import ColorPicker from "react-native-wheel-color-picker";

interface CategoryNamingModalProps {
  visible: boolean;
  onClose: () => void;
  onCancel: () => void;
  categoryColor?: string;
  setCategoryColor?: (color: string) => void;
  onProceed: (newName: string, selectedColor: string) => void;
  placeholder?: string;
}

const CategoryNamingModal: React.FC<CategoryNamingModalProps> = ({
  visible,
  onClose,
  onCancel,
  onProceed,
  placeholder,
  categoryColor = "#EAB308",
  setCategoryColor,
}) => {
  const [name, setName] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (!visible) {
      setName("");
      if (setCategoryColor) setCategoryColor("#EAB308");
      setShowColorPicker(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleProceed = () => {
    if (name.trim()) {
      onProceed(name, categoryColor || "#EAB308");
      setName("");
      if (setCategoryColor) setCategoryColor("#EAB308");
      setShowColorPicker(false);
    }
  };

  if (!visible) return null;

  return (
    <View className="absolute inset-0 h-full justify-center items-center bg-black/30 rounded-xl">
      {/* BACKDROP PRESS TO CLOSE */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="absolute inset-0" />
      </TouchableWithoutFeedback>

      {/* MODAL CONTENT */}
      <View className="bg-white flex-row rounded-xl items-center shadow-md p-2 px-3 gap-1 z-10">
        <TextInput
          placeholder={placeholder}
          className="text-lg text-gray-800"
          style={{ width: 200, fontSize: 13 }}
          placeholderTextColor="#6B7280"
          value={name}
          onChangeText={setName}
          maxLength={20}
        />

        {/* Color Circle Toggle */}
        <TouchableOpacity onPress={() => setShowColorPicker(true)}>
          <View
            style={{
              width: 26,
              height: 26,
              backgroundColor: categoryColor,
              borderWidth: 2,
              borderColor: "#e5e7eb",
            }}
          />
        </TouchableOpacity>

        {/* Action Buttons */}
        <View className="flex-row items-center gap-1">
          <TouchableOpacity
            className="pl-1 rounded-full"
            onPress={() => {
              onCancel();
              setName("");
              if (setCategoryColor) setCategoryColor("#EAB308");
              setShowColorPicker(false);
            }}
          >
            <Ionicons name="close-circle-outline" size={26} color="#EF4444" />
          </TouchableOpacity>

          <TouchableOpacity className="rounded-full" onPress={handleProceed}>
            <Ionicons
              name="arrow-forward-circle-outline"
              size={26}
              color="#EAB308"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Color Picker Modal */}
      <Modal
        visible={showColorPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowColorPicker(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View
            style={{
              width: 300,
              height: 420,
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 16,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 10,
              elevation: 5,
              justifyContent: "space-between",
            }}
          >
            <ColorPicker
              color={categoryColor}
              onColorChangeComplete={(color) => {
                if (setCategoryColor) setCategoryColor(color);
              }}
              thumbSize={30}
              sliderSize={30}
              noSnap={true}
              row={false}
            />

            <TouchableOpacity
              onPress={() => setShowColorPicker(false)}
              style={{ marginTop: 12, alignItems: "center" }}
            >
              <View className="mt-2 px-3 py-1 rounded-xl bg-tertiary-buttonGreen/80">
                <Text className="text-white text-2xl font-semibold">
                  Choose
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CategoryNamingModal;
