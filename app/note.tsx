import { TouchableOpacity, View, Text } from "react-native";
import { Link } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { pickDocument } from "@/hooks/DocumentPicker";
import { ExtractionWindow } from "@/components/extraction/ExtractionWindow";
import CircleButton from "@/components/CircleButton";
import { Ionicons } from "@expo/vector-icons";

export type File = {
  name: string;
  size: number;
  uri: string;
};

const Note = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExtractionWindowVisible, setIsExtractionWindowVisible] =
    useState(false);

  const handlePickDocument = async () => {
    const file: File | null = await pickDocument();
    setSelectedFile(file);

    if (file) {
      setTimeout(() => {
        setIsExtractionWindowVisible(true);
      }, 600);
    }
  };
  const content = <Ionicons name="pencil-outline" size={40} color="black" />;

  return (
    <SafeAreaView className="flex w-screen h-full bg-primary-white">
      <CircleButton
        className="absolute bottom-10 right-8"
        content={content}
        onPress={() => {
          console.log("edit button pressed");
        }}
      />
      <View>
        <Link href="/">back</Link>
        <TouchableOpacity onPress={handlePickDocument}>
          <Text>Extract</Text>
        </TouchableOpacity>
      </View>
      <ExtractionWindow
        isVisible={isExtractionWindowVisible}
        setIsVisible={setIsExtractionWindowVisible}
        selectedFile={selectedFile}
      />
    </SafeAreaView>
  );
};

export default Note;
