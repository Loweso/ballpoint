import {
  Image,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Link } from "expo-router";
import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { pickDocument } from "@/hooks/DocumentPicker";
import { ExtractionWindow } from "@/components/extraction/ExtractionWindow";
import CircleButton from "@/components/CircleButton";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import HTMLView from "react-native-htmlview";
import striptags from "striptags";

import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import PolishMenuModal from "@/components/PolishMenuModal";
import { images } from "@/constants";

export type File = {
  name: string;
  size: number;
  uri: string;
};

const Note = ({ text }: any) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExtractionWindowVisible, setIsExtractionWindowVisible] =
    useState(false);
  const [title, setTitle] = useState("");
  const [isAIPolishModalOpen, setIsAIPolishModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState(text);

  const RichText = useRef<RichEditor | null>(null);
  const titleInputRef = useRef<TextInput | null>(null);

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

  const AiModalOpenIcon = () => (
    <Image source={images.aiPolish} className="w-7 h-7" />
  );

  const enableEditing = () => {
    setIsEditing(true);
  };
  const disableEditing = () => {
    setIsEditing(false);
    titleInputRef.current?.blur();
  };

  return (
    <SafeAreaView className="flex w-screen h-full bg-primary-white">
      {!isEditing && (
        <CircleButton
          className="absolute bottom-10 right-8"
          content={content}
          onPress={() => {
            enableEditing();
          }}
        />
      )}
      <View className="justify-between flex-row gap-4 p-4">
        <Link href="/">
          <View className="flex flex-row items-center gap-1">
            <AntDesign name="leftcircleo" size={20} color="black" />
            <Text className="text-lg"> Notes </Text>
          </View>
        </Link>

        <View className="flex-row flex gap-x-3 justify-between items-center">
          {isEditing && (
            <TouchableOpacity onPress={handlePickDocument}>
              <Text>Extract</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={20} color="black" />
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity onPress={disableEditing}>
              <Text>Done</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ExtractionWindow
        isVisible={isExtractionWindowVisible}
        setIsVisible={setIsExtractionWindowVisible}
        selectedFile={selectedFile}
      />

      <TextInput
        ref={titleInputRef}
        className="text-2xl mx-2 font-semibold"
        placeholder="Title"
        onChangeText={setTitle}
        onPress={enableEditing}
        value={title}
      />

      {isEditing ? (
        <>
          <RichEditor
            ref={RichText}
            style={{
              flex: 1,
              marginBottom: 2,
            }}
            editorStyle={{
              contentCSSText: "font-size: 14px;",
            }}
            placeholder={""}
            initialContentHTML={noteContent}
            onChange={(descriptionText) => {
              setNoteContent(descriptionText);
              console.log(striptags(descriptionText));
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
        </>
      ) : (
        <TouchableWithoutFeedback
          onPress={() => {
            enableEditing();
            setTimeout(() => {
              if (RichText.current) {
                RichText.current.focusContentEditor(); // This forces the cursor to appear
              }
            }, 100);
          }}
        >
          <View className="mx-3 mt-2">
            {noteContent ? (
              <HTMLView value={noteContent} />
            ) : (
              <Text className="text-gray-600">Start Writing!</Text>
            )}
          </View>
        </TouchableWithoutFeedback>
      )}
      <PolishMenuModal
        visible={isAIPolishModalOpen}
        onClose={() => toggleAIPolishModal()}
      />
    </SafeAreaView>
  );
};

export default Note;
