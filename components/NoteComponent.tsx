import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
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
  const [fontsLoaded] = useFonts({
    "Comfortaa-Medium": require("../assets/fonts/Comfortaa-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Pressable
      className="w-full bg-primary-white rounded-2xl border-2 border-slate-400 p-4"
      onPress={() => console.log("Pantropiko")}
    >
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
            onPress={() => console.log("Notes Settings Opened")}
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
