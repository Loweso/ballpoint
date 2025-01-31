import { Dimensions, TouchableOpacity, View, Text } from "react-native";
import { Link } from "expo-router";
import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { pickDocument } from "@/hooks/DocumentPicker";
import { ExtractionWindow } from "@/components/extraction/ExtractionWindow";
import { RichEditor } from "react-native-pell-rich-editor";

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

  const RichText = useRef();
  const screenHeight = Dimensions.get("window").height;

  return (
    <SafeAreaView className="bg-white">
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

      <RichEditor
        disabled={false}
        ref={RichText}
        style={{
          minHeight: screenHeight,
          marginBottom: 2,
        }}
        placeholder={"Start Writing Here"}
      />
    </SafeAreaView>
  );
};

export default Note;
