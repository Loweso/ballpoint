import {
  Image,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Pressable,
  Alert,
  useWindowDimensions,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { pickDocument, File } from "@/hooks/DocumentPicker";
import { ExtractionWindow } from "@/components/extraction/ExtractionWindow";
import CircleButton from "@/components/CircleButton";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import RenderHTML from "react-native-render-html";
import striptags from "striptags";
import { api } from "@/lib/redux/slices/authSlice";

import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import PolishMenuModal from "@/components/PolishMenuModal";
import { images } from "@/constants";
import NoteSettings from "@/components/NoteSettings";
import HighlightModal from "@/components/HighlightModal";
import { OrganizePreferencesModal } from "@/components/OrganizePreferencesModal";

const Note = ({ text }: any) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExtractionWindowVisible, setIsExtractionWindowVisible] =
    useState(false);
  const [title, setTitle] = useState("");
  const [extractionTitle, setExtractionTitle] = useState("");
  const [isAIPolishModalOpen, setIsAIPolishModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState(text);
  const [isNoteSettingsVisible, setIsNoteSettingsVisible] = useState(false);
  const [aiText, setAiText] = useState(text);
  const [isHighlightModalOpen, setIsHighlightModalOpen] = useState(false);
  const [isOrganizePreferencesModalOpen, setIsOrganizePreferencesModalOpen] =
    useState(false);
  const [highlightPosition, setHighlightPosition] = useState({
    top: 0,
    left: 0,
  });

  const RichText = useRef<RichEditor | null>(null);
  const titleInputRef = useRef<TextInput | null>(null);
  const { id } = useLocalSearchParams();

  const { width } = useWindowDimensions();

  const toggleAIPolishModal = () => {
    setIsAIPolishModalOpen(!isAIPolishModalOpen);
  };

  useEffect(() => {
    console.log(isOrganizePreferencesModalOpen, "organize");
  }, [isOrganizePreferencesModalOpen]);

  const summarizeNotes = async () => {
    const text = striptags(noteContent);
    if (!striptags(text).trim()) {
      alert("Please enter some text.");
      return;
    }
    try {
      const response = await api.post("extract/summarize-text", {
        text: text,
      });
      console.log(response.data.summary);
      setAiText(response.data.summary);
      setExtractionTitle("Summary of Notes");

      setTimeout(() => {
        toggleAIPolishModal();
        setIsExtractionWindowVisible(true);
      }, 600);
    } catch (error) {
      console.error(error);
      alert("Error summarizing text.");
    }
  };

  const organizeNotes = async (mode: string) => {
    const text = striptags(noteContent);
    if (!striptags(text).trim()) {
      alert("Please enter some text.");
      return;
    }
    try {
      const response = await api.post("extract/organize-text", {
        mode: mode,
        text: text,
      });
      console.log(response.data.organized);
      setAiText(response.data.organized);
      setExtractionTitle(`Organized Notes: ${mode}`);

      setTimeout(() => {
        setIsOrganizePreferencesModalOpen(false);
        setIsExtractionWindowVisible(true);
      }, 600);
    } catch (error) {
      console.error(error);
      alert("Error summarizing text.");
    }
  };

  const saveNote = async () => {
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'
    const sanitizedTitle = title.trim() || "Untitled Note";

    try {
      const response = await api.put(`/notes/${id}/`, {
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

    const isAudio = file.mimeType?.startsWith("audio");
    const isImage = file.mimeType?.startsWith("image");

    console.log("Insights: ", isAudio, file.mimeType);

    const formData = new FormData();

    formData.append(isImage ? "image" : "audio", {
      name: file.name,
      uri: file.uri,
      type: file.mimeType || "application/octet-stream",
    });

    try {
      let uploadResponse;

      if (isImage) {
        uploadResponse = await api.post("extract/extract-text", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Upload successful:", uploadResponse.data);

        if (uploadResponse.data) {
          setAiText(uploadResponse.data.text);
        }
      } else if (isAudio) {
        uploadResponse = await api.post("extract/whisper-audio", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (uploadResponse.data) {
          setAiText(uploadResponse.data.transcript);
        }
      } else {
        Alert.alert(
          "Unsupported File",
          "Please select an image or audio file."
        );
        return;
      }

      console.log("Upload successful:", uploadResponse.data);

      setTimeout(() => {
        setIsExtractionWindowVisible(true);
      }, 600);
    } catch (error) {
      console.error("Error uploading file:", error);
      Alert.alert("Error", "Upload failed. Check your backend and try again.");
    }
  };

  const deleteNote = async () => {
    try {
      const response = await api.delete(`notes/${id}/`);
      console.log("Note deleted:", response.data);
      Alert.alert("Success", "Note deleted!");
    } catch (error) {
      console.error("Error deleting note:", error);
      Alert.alert("Error", "Something went wrong while deleting.");
    }
  };

  const content = <Ionicons name="pencil-outline" size={40} color="black" />;

  const AiModalOpenIcon = () => (
    <Image source={images.aiPolish} className="w-7 h-7" />
  );

  const enableEditing = () => {
    setIsEditing(true);
  };

  const handleLongPress = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setHighlightPosition({ top: pageY, left: pageX });
    setIsHighlightModalOpen(true);
  };

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await api.get(`/notes/${id}/`);
        const note = response.data;
        setTitle(note.title || "Untitled Note");
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
            <TouchableOpacity
              className="flex flex-row items-center px-3 py-1 bg-tertiary-buttonGreen rounded-2xl"
              onPress={handlePickDocument}
            >
              <Text className="text-white">Extract</Text>
              <Ionicons name="document-outline" size={20} color="white" />
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
        content={aiText}
        title={extractionTitle}
      />

      <TextInput
        ref={titleInputRef}
        className="text-2xl mx-2 font-semibold"
        placeholder="Title"
        onChangeText={setTitle}
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
            setTimeout(() => {
              if (RichText.current) {
                RichText.current.focusContentEditor(); // This forces the cursor to appear
              }
            }, 100);
          }}
        >
          <View className="mx-3 mt-2">
            {noteContent ? (
              <Pressable onLongPress={handleLongPress} delayLongPress={300}>
                <RenderHTML
                  contentWidth={width}
                  source={{ html: noteContent }}
                  baseStyle={{
                    fontSize: 16,
                    color: "#000",
                  }}
                  defaultTextProps={{ selectable: true }}
                />
              </Pressable>
            ) : (
              <Text className="text-gray-600">Start Writing!</Text>
            )}
          </View>
        </TouchableWithoutFeedback>
      )}
      <PolishMenuModal
        visible={isAIPolishModalOpen}
        onClose={() => toggleAIPolishModal()}
        summarizeNotes={summarizeNotes}
        setIsOrganizePreferencesModalOpen={setIsOrganizePreferencesModalOpen}
      />
      <NoteSettings
        isVisible={isNoteSettingsVisible}
        setIsVisible={setIsNoteSettingsVisible}
        onDelete={deleteNote}
      />
      <HighlightModal
        isVisible={isHighlightModalOpen}
        setIsVisible={setIsHighlightModalOpen}
        position={highlightPosition}
      />

      <OrganizePreferencesModal
        isVisible={isOrganizePreferencesModalOpen}
        setIsVisible={setIsOrganizePreferencesModalOpen}
        organizeNotes={organizeNotes}
      />
    </SafeAreaView>
  );
};

export default Note;
