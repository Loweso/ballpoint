import axios from "axios";
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { pickDocument, File } from "@/hooks/DocumentPicker";
import { ExtractionWindow } from "@/components/extraction/ExtractionWindow";
import { noteData } from "@/assets/noteData";
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
import NoteSettings from "@/components/NoteSettings";
import { Alert } from "react-native";

const Note = ({ text }: any) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExtractionWindowVisible, setIsExtractionWindowVisible] =
    useState(false);
  const [title, setTitle] = useState("");
  const [isAIPolishModalOpen, setIsAIPolishModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState(text);
  const [isNoteSettingsVisible, setIsNoteSettingsVisible] = useState(false);
  const [extractedText, setExtractedText] = useState(text);

  const RichText = useRef<RichEditor | null>(null);
  const titleInputRef = useRef<TextInput | null>(null);
  const { id } = useLocalSearchParams();

  const toggleAIPolishModal = () => {
    setIsAIPolishModalOpen(!isAIPolishModalOpen);
  };

  const saveNote = async () => {
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'
    const sanitizedTitle = title.trim() || "Untitled Note";

    try {
      const url = `${process.env.EXPO_PUBLIC_DEVICE_IPV4}/notes/${id}/`;

      const response = await axios.put(url, {
        title: sanitizedTitle,
        notesContent: noteContent,
        categories: [],
        date: today,
      });

      console.log("Sending data:", response);
      Alert.alert("Success", "Note updated!");
    } catch (error: any) {
      if (error.response) {
        console.error("Backend error response:", error.response.data);
      } else {
        console.error("Unexpected error:", error.message);
      }
      Alert.alert("Error", "Something went wrong while saving.");
    }
  };

  const handlePickDocument = async () => {
    console.log("I'm here!");
    const file = await pickDocument();
    setSelectedFile(file);

    if (!file) return;

    try {
      const formData = new FormData();

      formData.append("image", {
        name: file.name,
        uri: file.uri,
        type: "image/*", // Adjust according to the actual file type
      });

      const uploadResponse = await axios.post(
        `${process.env.EXPO_PUBLIC_DEVICE_IPV4}/extract/extract-text`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload successful:", uploadResponse.data);

      if (uploadResponse.data) {
        setExtractedText(uploadResponse.data.text);
      }

      setTimeout(() => {
        setIsExtractionWindowVisible(true);
      }, 600);
    } catch (error) {
      console.error("Error uploading file:", error);
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
    saveNote();
    setIsEditing(false);
    titleInputRef.current?.blur();
  };

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_DEVICE_IPV4}/notes/${id}/`
        );
        const note = response.data;
        setTitle(note.title || "Untitled Note");
        console.log(note.notesContent);
        setNoteContent(note.notesContent || "");
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };

    if (id) {
      fetchNote();
    }
  }, [id]);

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
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color="black"
              onPress={() => {
                setIsNoteSettingsVisible(true);
                console.log("Note Settings Pressed");
              }}
            />
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity
              onPress={async () => {
                await saveNote();
                setIsEditing(false);
                titleInputRef.current?.blur();
                console.log(`${process.env.EXPO_PUBLIC_DEVICE_IPV4}/notes/`);
              }}
            >
              <Text>Done</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ExtractionWindow
        isVisible={isExtractionWindowVisible}
        setIsVisible={setIsExtractionWindowVisible}
        selectedFile={selectedFile}
        content={extractedText}
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
              console.log("descriptionText:", descriptionText);
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
      <NoteSettings
        isVisible={isNoteSettingsVisible}
        setIsVisible={setIsNoteSettingsVisible}
      />
    </SafeAreaView>
  );
};

export default Note;
