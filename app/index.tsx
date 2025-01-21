import { View, Text, Image, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View className="flex-row items-center justify-between px-4 py-3 bg-gray-100 h-16">
        {/* Logo */}
        <Image
          source={{ uri: "https://example.com/logo.png" }}
          className="w-10 h-10"
        />

        {/* Title */}
        <Text className="text-lg font-bold">My App</Text>

        {/* Settings Icon */}
        <TouchableOpacity onPress={() => console.log("Settings Pressed")}>
          <Image
            source={{ uri: "https://example.com/settings-icon.png" }}
            className="w-8 h-8"
          />
        </TouchableOpacity>
      </View>
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
