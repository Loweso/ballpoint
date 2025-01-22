import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Dropdown } from "react-native-element-dropdown";

interface OrganizePreferencesModalProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

export const OrganizePreferencesModal: React.FC<
  OrganizePreferencesModalProps
> = ({ isVisible, setIsVisible }) => {
  const [value, setValue] = useState(null);

  const closeModal = () => {
    setIsVisible(false);
    console.log(isVisible);
  };

  const data = [
    { label: "Item 1", value: "1" },
    { label: "Item 2", value: "2" },
    { label: "Item 3", value: "3" },
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
            onPress={() => {
              setIsVisible(false);
            }}
            className="bg-tertiary-buttonGreen/70 rounded-full p-4 w-full flex justify-center items-center mt-3 ov"
          >
            <Text className="text-white">Organize Notes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
