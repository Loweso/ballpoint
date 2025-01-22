import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import CircleButton from "@/components/CircleButton";
import { useState } from "react";
import { CreateNewNoteModal } from "@/components/CreateNewNoteModal";

import { SafeAreaView } from "react-native-safe-area-context";
import { OrganizePreferencesModal } from "@/components/OrganizePreferencesModal";

export default function Index() {
  const [isCreateNewNoteModalVisible, setIsCreateNewNoteModalVisible] =
    useState(false);

  const content = <Ionicons name="add-outline" size={50} color="black" />;
  return (
    <SafeAreaView className="flex h-full">
      <View className="flex-row items-center justify-between px-4 py-3 h-16">
        <View className="flex-1">
          <TouchableOpacity
            className="items-start justify-center bg-transparent w-8"
            onPress={() => console.log("Menu Button Pressed")}
          >
            <Entypo name="dots-three-vertical" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-center">
          <Image
            source={require("../assets/images/ballpointLogo.png")}
            className="w-32 h-32"
          />
        </View>
        <View className="flex-1" />
      </View>
      <View className="flex flex-row items-center justify-between px-4 py-3 h-16">
        <View className="flex flex-row w-4/5 h-16 text-lg bg-white rounded-xl px-4 gap-3">
          <Feather name="search" size={20} color="gray" className="py-5" />
          <TextInput
            className="flex h-full w-full text-lg bg-transparent rounded-xl pr-8"
            placeholder="Search here..."
            placeholderTextColor="gray"
          />
        </View>
        <TouchableOpacity
          className="items-start justify-center bg-transparent w-8"
          onPress={() => console.log("Filter Button Pressed")}
        >
          <Feather name="filter" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          className="items-start justify-center bg-transparent w-8"
          onPress={() => console.log("Sort Button Pressed")}
        >
          <Ionicons name="filter" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <CircleButton
        content={content}
        onPress={() => setIsCreateNewNoteModalVisible(true)}
      />
      <CreateNewNoteModal
        isVisible={isCreateNewNoteModalVisible}
        setIsVisible={setIsCreateNewNoteModalVisible}
      />
    </SafeAreaView>
  );
}
