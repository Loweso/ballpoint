import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";

interface OrganizePreferencesModalProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  organizeNotes: (mode: string) => void;
}

export const OrganizePreferencesModal: React.FC<
  OrganizePreferencesModalProps
> = ({ isVisible, setIsVisible, organizeNotes }) => {
  const [value, setValue] = useState("bulleted");

  const closeModal = () => {
    setIsVisible(false);
 
  };

  const data = [
    { label: "bulleted", value: "bulleted" },
    { label: "paragraph", value: "paragraph" },
  ];

  const styles = StyleSheet.create({
    dropdown: {
      height: 50,
      paddingHorizontal: 16,
      width: "100%",
      backgroundColor: "white",
      elevation: 2,
    },
    text: {
      marginTop: 20,
      fontSize: 16,
    },
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View className="bg-black/30 h-full flex justify-center items-center">
        <View className=" w-[80%] bg-white px-6 py-8 rounded-xl shadow-md">
          <View className="relative">
            <View className="">
              <Text className="text-lg">Organization Preference</Text>
              <Text className="text-sm text-tertiary-textGray leading-none">
                How do want your notes to be organized?
              </Text>
            </View>
            <TouchableOpacity
              className="absolute top-[-15px] right-0"
              onPress={closeModal}
            >
              <Ionicons name="close-outline" color="#5A5353" size={32} />
            </TouchableOpacity>
          </View>
          <View className="flex w-full mt-4 text-lg justify-center   ">
            <Dropdown
              style={styles.dropdown}
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Select item"
              value={value}
              onChange={(item) => {
                setValue(item.value);
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => organizeNotes(value)}
            className="bg-tertiary-buttonGreen/70 rounded-full p-4 w-full flex justify-center items-center mt-3 "
          >
            <Text className="text-white">Organize Notes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
