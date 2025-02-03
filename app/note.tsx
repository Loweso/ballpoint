import { Image, TouchableOpacity, View, Text, TextInput } from "react-native";
import { Link } from "expo-router";
import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { pickDocument } from "@/hooks/DocumentPicker";
import { ExtractionWindow } from "@/components/extraction/ExtractionWindow";
import CircleButton from "@/components/CircleButton";
import { Ionicons } from "@expo/vector-icons";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import PolishMenuModal from "@/components/PolishMenuModal";

export type File = {
  name: string;
  size: number;
  uri: string;
};

const Note = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExtractionWindowVisible, setIsExtractionWindowVisible] =
    useState(false);
  const [title, onChangeTitle] = useState("");
  const [isAIPolishModalOpen, setIsAIPolishModalOpen] = useState(false);

  const toggleAIPolishModal = () => {
    setIsAIPolishModalOpen(!isAIPolishModalOpen);
  };

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

  const RichText = useRef();
  const AiModalOpenIcon = () => (
    <Image
      source={require("../assets/images/aiPolish.png")}
      className="w-7 h-7"
    />
  );

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

      <TextInput
        className="text-2xl mx-2"
        placeholder="Title"
        onChangeText={onChangeTitle}
        value={title}
      />

      <RichEditor
        disabled={false}
        ref={RichText}
        style={{
          flex: 1,
          marginBottom: 2,
        }}
        placeholder={"Start writing!"}
        onChange={(descriptionText) => {
          console.log("descriptionText:", descriptionText); //descriptionText is for text from editor
        }}
      />

      <RichToolbar
        editor={RichText}
        actions={[
          "openAIPolishModal",
          actions.undo,
          actions.redo,
          actions.setBold,
          actions.setItalic,
          actions.insertBulletsList,
          actions.insertOrderedList,
        ]}
        iconMap={{
          openAIPolishModal: AiModalOpenIcon,
        }}
        openAIPolishModal={toggleAIPolishModal}
      />

      <PolishMenuModal
        visible={isAIPolishModalOpen}
        onClose={() => toggleAIPolishModal()}
      />
    </SafeAreaView>
  );
};

export default Note;
