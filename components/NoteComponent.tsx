import React, { useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import OutsidePressHandler from "react-native-outside-press";
import { useFonts } from "expo-font";

type NoteComponentProps = {
  title: string;
  categories: { label: string; color?: string }[];
  notesContent: string;
  date: Date;
};

const NoteComponent: React.FC<NoteComponentProps> = ({
  title,
  categories,
  notesContent,
  date,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [fontsLoaded] = useFonts({
    "Comfortaa-Medium": require("../assets/fonts/Comfortaa-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const openMenu = () => {
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <Pressable
      className="w-full bg-primary-white rounded-2xl border-2 border-slate-400 p-4"
      onPress={() => console.log("Pantropiko")}
    >
      {menuOpen && (
        <OutsidePressHandler
          onOutsidePress={closeMenu}
          className="absolute top-0 right-0 z-10"
        >
          <View className="p-4 gap-2 w-36 rounded-xl shadow-lg shadow-black bg-primary-white">
            <TouchableOpacity
              className="flex flex-row items-center justify-between w-full"
              onPress={() => console.log("Delete Pressed")}
            >
              <Text className="text-tertiary-textRed">Delete</Text>
              <Feather name="trash-2" size={20} color="red" />
            </TouchableOpacity>

            <View className="h-px bg-gray-300 w-full" />

            <TouchableOpacity
              className="flex flex-row items-center justify-between w-full"
              onPress={() => console.log("Rename Pressed")}
            >
              <Text className="text-tertiary-textBlue">Rename</Text>
              <MaterialIcons
                name="drive-file-rename-outline"
                size={20}
                color="blue"
              />
            </TouchableOpacity>

            <View className="h-px bg-gray-300 w-full" />

            <TouchableOpacity
              className="flex flex-row items-center justify-between w-full"
              onPress={closeMenu}
            >
              <Text className="text-black">Back</Text>
              <Feather name="arrow-left" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </OutsidePressHandler>
      )}

      <View className="flex flex-row items-center justify-between">
        <Text
          className="text-3xl w-3/4 items-center"
          style={{ fontFamily: "Comfortaa-Medium", overflow: "hidden" }}
          numberOfLines={1}
        >
          {title}
        </Text>
        <View className="flex flex-col w-1/4 items-end justify-end">
          <TouchableOpacity
            className="items-start justify-center w-8"
            onPress={openMenu}
          >
            <Entypo name="dots-three-horizontal" size={20} color="black" />
          </TouchableOpacity>
          <Text className="text-sm">{date.toLocaleDateString("en-US")}</Text>
        </View>
      </View>

      <View className="flex flex-row flex-wrap my-2 gap-4">
        {categories.map((category, index) => (
          <View
            key={index}
            className={`h-8 py-1 px-4 ${
              category.color || "bg-secondary-yellow"
            }`}
          >
            <Text className="font-bold">{category.label}</Text>
          </View>
        ))}
      </View>

      <Text className="text-sm text-justify" numberOfLines={4}>
        {notesContent}
      </Text>
    </Pressable>
  );
};

export default NoteComponent;
