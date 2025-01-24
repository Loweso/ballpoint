import { TouchableOpacity, View, Text } from "react-native";
import { Link } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { pickDocument } from "@/hooks/DocumentPicker";
import { ExtractionWindow } from "@/components/extraction/ExtractionWindow";

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
  };

  return (
    <SafeAreaView>
      <View>
        <Link href="/">back</Link>
        <TouchableOpacity onPress={handlePickDocument}>
          <Text>Extract</Text>
        </TouchableOpacity>
        {selectedFile && (
          <TouchableOpacity
            onPress={() => {
              setIsExtractionWindowVisible(true);
            }}
          >
            <Text>ExtractionWindow</Text>
          </TouchableOpacity>
        )}
        <Text>{selectedFile?.name}</Text>
      </View>
      <ExtractionWindow
        isVisible={isExtractionWindowVisible}
        setIsVisible={setIsExtractionWindowVisible}
      />
    </SafeAreaView>
  );
};

export default Note;
