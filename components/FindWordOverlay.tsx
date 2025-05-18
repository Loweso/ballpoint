import React from "react";
import { TextInput, TouchableOpacity } from "react-native";
import { View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const SearchNavigation = ({
  query,
  onChangeQuery,
  isModalOpen,
  handleModalClose,
}: {
  query: string;
  onChangeQuery: (text: string) => void;
  isModalOpen: boolean;
  handleModalClose: (value: boolean) => void;
}) => {
  if (!isModalOpen) return null;

  return (
    <View className="absolute top-4 left-4 right-4 z-50 bg-white border border-gray-300 rounded-lg flex-row items-center px-3 py-2 shadow-lg">
      <TextInput
        placeholder="Search..."
        value={query}
        onChangeText={onChangeQuery}
        className="flex-1 text-base text-black"
        placeholderTextColor="#aaa"
      />

      {/*
        <TouchableOpacity onPress={onPrev} className="mx-1 p-1">
            <AntDesign name="arrowleft" size={20} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext} className="mx-1 p-1">
            <AntDesign name="arrowright" size={20} color="#333" />
        </TouchableOpacity>
      */}

      <TouchableOpacity
        onPress={() => handleModalClose(false)}
        className="ml-1 p-1"
      >
        <AntDesign name="close" size={20} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchNavigation;
