import {
  Image,
  TouchableOpacity,
  ScrollView,
  View,
  Text,
  TextInput,
  // TouchableWithoutFeedback,
  Alert,
  useWindowDimensions,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { pickDocument, File } from "@/hooks/DocumentPicker";
import { ExtractionWindow } from "@/components/extraction/ExtractionWindow";
import CircleButton from "@/components/CircleButton";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import RenderHTML from "react-native-render-html";
import striptags from "striptags";
import { api } from "@/lib/redux/slices/authSlice";
import MarkdownIt from "markdown-it";
import { highlightVisibleTextOnly } from "@/utils/highlightTextinHTML";
import * as ImagePicker from "expo-image-picker";

import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import PolishMenuModal from "@/components/PolishMenuModal";
import { images } from "@/constants";
import NoteSettings from "@/components/NoteSettings";
import { OrganizePreferencesModal } from "@/components/OrganizePreferencesModal";
import QueryMenuModal from "@/components/QueryMenuModal";
import TextReplacementModal from "@/components/TextReplacementModal";
import { LoadingModal } from "@/components/LoadingModal";
import SearchNavigation from "@/components/FindWordOverlay";

const Note = ({ text }: any) => {
  const [extractionTitle, setExtractionTitle] = useState("");
  const [isAIPolishModalOpen, setIsAIPolishModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isExtractionWindowVisible, setIsExtractionWindowVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNoteSettingsVisible, setIsNoteSettingsVisible] = useState(false);

  const [isOrganizePreferencesModalOpen, setIsOrganizePreferencesModalOpen] =
    useState(false);
  const [isSearchNavOpen, setIsSearchNavOpen] = useState(false);

  const [aiText, setAiText] = useState(text);
  const [editorHeight, setEditorHeight] = useState(200);
  const [insertMode, setInsertMode] = useState<"append" | "replace">("append");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [noteContent, setNoteContent] = useState(text);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");

  const [selectedText, setSelectedText] = useState("");
  const [queryText, setQueryText] = useState("");
  const [selectionRange, setSelectionRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [isQueryMenuModalOpen, setIsQueryMenuModalOpen] = useState(false);

  const router = useRouter();
  const md = new MarkdownIt();
  const RichText = useRef<RichEditor | null>(null);
  const titleInputRef = useRef<TextInput | null>(null);
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();

  const [isReplacementModalVisible, setIsReplacementModalVisible] =
    useState(false);
  const [processedText, setProcessedText] = useState("");
  const [isFromQuery, setIsFromQuery] = useState(false);

  const toggleAIPolishModal = () => {
    setIsAIPolishModalOpen(!isAIPolishModalOpen);
  };

  useEffect(() => {
    console.log(isOrganizePreferencesModalOpen, "organize");
  }, [isOrganizePreferencesModalOpen]);

  useEffect(() => {
    if (selectedText) {
      console.log("Selected text updated:", selectedText);
    }
  }, [selectedText]);

  useEffect(() => {
    if (isEditing && RichText.current) {
      RichText.current.setContentHTML(noteContent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  const summarizeNotes = async () => {
    const text = striptags(noteContent);
    if (!striptags(text).trim()) {
      alert("Please enter some text.");
      return;
    }
    try {
      setLoadingMessage("Summarizing notes...");
      setIsLoading(true);
      const response = await api.post("extract/summarize-text", {
        text: text,
      });
      console.log(response.data.summary);
      setInsertMode("append");
      setAiText(response.data.summary);
      setExtractionTitle("Summary of Notes");

      setTimeout(() => {
        toggleAIPolishModal();
        setIsExtractionWindowVisible(true);
      }, 600);
    } catch (error) {
      console.error(error);
      alert("Error summarizing text.");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const organizeNotes = async (mode: string) => {
    const text = striptags(noteContent);
    if (!striptags(text).trim()) {
      alert("Please enter some text.");
      return;
    }
    try {
      setLoadingMessage("Organizing notes...");
      setIsLoading(true);
      const response = await api.post("extract/organize-text", {
        mode: mode,
        text: text,
      });
      console.log(response.data.organized);
      setInsertMode("replace");
      setAiText(response.data.organized);
      setExtractionTitle(`Organized Notes: ${mode}`);

      setTimeout(() => {
        setIsOrganizePreferencesModalOpen(false);
        setIsExtractionWindowVisible(true);
      }, 600);
    } catch (error) {
      console.error(error);
      alert("Error summarizing text.");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const processQuery = async () => {
    const noteText = striptags(noteContent);
    if (!striptags(noteText).trim()) {
      alert("Please enter some text.");
      return;
    }
    try {
      setLoadingMessage("Answering your query...");
      setIsLoading(true);
      const response = await api.post("extract/query-text", {
        selected_text: selectedText,
        note_content: noteText,
        query: queryText,
      });
      setProcessedText(response.data.answer);
      setIsFromQuery(true);
      setIsQueryMenuModalOpen(false);
      setIsReplacementModalVisible(true);
      setSelectedText("");
      setQueryText("");
    } catch (error) {
      console.error(error);
      alert("Error processing query.");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const onCompleteHighlightedText = async () => {
    const noteText = striptags(noteContent);
    if (!striptags(noteText).trim()) {
      alert("Please enter some text.");
      return;
    }
    try {
      setLoadingMessage("Completing text...");
      setIsLoading(true);
      const response = await api.post("extract/complete-text", {
        selected_text: selectedText,
        note_content: noteText,
      });
      setProcessedText(response.data.completedText);
      setIsFromQuery(false);
      setIsQueryMenuModalOpen(false);
      setIsReplacementModalVisible(true);
      setSelectedText("");
      setQueryText("");
    } catch (error) {
      console.error(error);
      alert("Error processing text.");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const handleReplace = () => {
    if (RichText.current) {
      if (isFromQuery) {
        RichText.current.insertHTML(processedText);
        setNoteContent((prev: string) => prev + processedText);
      } else {
        replaceSelectedText(processedText);
      }
    }
    setIsReplacementModalVisible(false);
  };

  const saveNote = async () => {
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'
    const sanitizedTitle = title.trim() || "Untitled Note";

    try {
      setLoadingMessage("Saving note...");
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const openCamera = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaLibraryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || mediaLibraryStatus !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera and media library permissions to make this work."
      );
      return;
    }

    Alert.alert(
      "Choose Media to Extract Text From",
      "Would you like to take a photo or select an image/audio file from the library?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Take Photo",
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              quality: 1,
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });

            if (!result.canceled && result.assets?.length > 0) {
              const photo = result.assets[0];

              const formData = new FormData();
              formData.append("image", {
                uri: photo.uri,
                name: photo.fileName || "photo.jpg",
                type: photo.mimeType || "image/jpeg",
              } as any);

              try {
                setLoadingMessage("Extracting text...");
                setIsLoading(true);
                console.log("Uploading photo to server:", photo.uri);

                const uploadResponse = await api.post(
                  "extract/extract-text",
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  }
                );

                if (uploadResponse.data?.text) {
                  setAiText(uploadResponse.data.text);
                  setTimeout(() => setIsExtractionWindowVisible(true), 600);
                }
              } catch (error) {
                console.error("Error uploading photo:", error);
                Alert.alert(
                  "Error",
                  "Upload failed. Please check your backend and try again."
                );
              } finally {
                setIsLoading(false);
                setLoadingMessage("");
              }
            }
          },
        },
        {
          text: "Choose from Library",
          onPress: async () => {
            handlePickDocument();
          },
        },
      ]
    );
  };

  const handlePickDocument = async () => {
    console.log(extractionTitle, "extraction title");
    const file = await pickDocument();
    setSelectedFile(file);
    setInsertMode("append");

    if (!file) return;

    const isAudio = file.mimeType?.startsWith("audio");
    const isImage = file.mimeType?.startsWith("image");

    const formData = new FormData();
    formData.append(isImage ? "image" : "audio", {
      uri: file.uri,
      type: file.mimeType || "application/octet-stream",
      name: file.name,
    } as any);

    try {
      setLoadingMessage("Extracting text...");
      setIsLoading(true);
      let uploadResponse;

      if (isImage) {
        uploadResponse = await api.post("extract/extract-text", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (uploadResponse.data) {
          setAiText(uploadResponse.data.text);
        }
      } else if (isAudio) {
        uploadResponse = await api.post("extract/google-stt", formData, {
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

      setTimeout(() => {
        setIsExtractionWindowVisible(true);
      }, 600);
    } catch (error) {
      console.error("Error uploading file:", error);
      Alert.alert("Error", "Upload failed. Check your backend and try again.");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const deleteNote = async () => {
    try {
      setLoadingMessage("Deleting note...");
      setIsLoading(true);
      const response = await api.delete(`notes/${id}/`);
      console.log("Note deleted:", response.data);
      Alert.alert("Success", "Note deleted!");
    } catch (error) {
      console.error("Error deleting note:", error);
      Alert.alert("Error", "Something went wrong while deleting.");
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const content = <Ionicons name="pencil-outline" size={40} color="black" />;

  const AiModalOpenIcon = () => (
    <Image source={images.aiPolish} className="w-7 h-7" />
  );

  const ReplaceIcon = () => (
    <Ionicons name="swap-horizontal" size={20} color="black" />
  );

  const enableEditing = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoadingMessage("Fetching note...");
        setIsLoading(true);
        const response = await api.get(`/notes/${id}/`);
        const note = response.data;
        setTitle(note.title || "Untitled Note");
        setNoteContent(note.notesContent || "");
        setIsLoading(false);
        setLoadingMessage("");
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };

    if (id) {
      fetchNote();
    }
  }, [id]);

  const handleSearchModal = (isOpen: boolean) => {
    setSearchQuery("");
    setIsNoteSettingsVisible(false);
    setIsSearchNavOpen(isOpen);
  };

  const replaceSelectedText = (newText: string) => {
    if (RichText.current && selectionRange) {
      RichText.current.insertHTML(newText);
    }
  };

  const onInjectJavascript = () => {
    const script = `(function() {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const value = selection.toString() || '';
        window.ReactNativeWebView.postMessage(JSON.stringify({ 
          data: {
            type: 'SELECTION_CHANGE', 
            value,
            range: {
              start: range.startOffset,
              end: range.endOffset
            }
          } 
        }));
      }
      void(0);
    })();`;
    RichText.current?.injectJavascript(script);
  };

  const handleOnMessage = (event: { type: string; id: string; data?: any }) => {
    if (event?.data?.type === "SELECTION_CHANGE") {
      const selected = event?.data?.value;
      const range = event?.data?.range;
      setSelectedText(selected);
      setSelectionRange(range);
      console.log("Selected text", selected, "Range:", range);
      if (selected) {
        setIsQueryMenuModalOpen(true);
      }
    }
  };

  return (
    <SafeAreaView className="flex w-screen h-full bg-primary-white">
      <LoadingModal visible={isLoading} message={loadingMessage} />

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
        <TouchableOpacity onPress={() => router.push("/")}>
          <View className="flex flex-row items-center gap-1">
            <AntDesign name="leftcircleo" size={20} color="black" />
            <Text className="text-lg">Notes</Text>
          </View>
        </TouchableOpacity>

        <View className="flex-row flex gap-x-3 justify-between items-center">
          {isEditing && (
            <TouchableOpacity
              className="flex flex-row items-center px-3 py-1 bg-tertiary-buttonGreen rounded-2xl"
              onPress={openCamera}
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
        onInsert={(insertedMarkdown) => {
          if (!isEditing || !RichText.current) {
            Alert.alert(
              "Edit Mode Required",
              "Enable editing to insert content."
            );
            return;
          }

          const html = md.render(insertedMarkdown);

          if (insertMode === "replace") {
            Alert.alert(
              "Replace Note?",
              "This will replace the entire note. Are you sure?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Replace",
                  style: "destructive",
                  onPress: () => {
                    RichText.current?.setContentHTML(html);
                    setNoteContent(html);
                    setInsertMode("append");
                  },
                },
              ]
            );
          } else {
            RichText.current.insertHTML(html);
            setNoteContent((prev: string) => prev + html);
          }
        }}
        title={extractionTitle}
        setTitle={setExtractionTitle}
        setSelectedFile={setSelectedFile}
      />

      <TextInput
        ref={titleInputRef}
        className="text-2xl mx-2 font-semibold pb-2"
        placeholder="Title"
        onChangeText={setTitle}
        value={title}
      />

      {isEditing ? (
        <>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
          >
            <RichEditor
              ref={RichText}
              initialContentHTML={noteContent}
              placeholder=""
              onChange={setNoteContent}
              onMessage={handleOnMessage}
              style={{
                minHeight: 200,
                height: editorHeight,
              }}
              editorStyle={{
                contentCSSText: `
                font-size: 14px;
                p, h1, h2, h3, h4, h5, h6 {
                  margin: 0;
                  padding: 0;
                }
              `,
              }}
              onHeightChange={(height) => {
                setEditorHeight(height);
              }}
            />
          </ScrollView>
          <RichToolbar
            editor={RichText}
            actions={[
              "openAIPolishModal",
              "replaceText",
              actions.undo,
              actions.redo,
              actions.setBold,
              actions.setItalic,
              actions.insertBulletsList,
              actions.insertOrderedList,
            ]}
            iconMap={{
              openAIPolishModal: AiModalOpenIcon,
              replaceText: ReplaceIcon,
            }}
            openAIPolishModal={toggleAIPolishModal}
            replaceText={onInjectJavascript}
          />
        </>
      ) : (
        // <TouchableWithoutFeedback
        //   onPress={() => {
        //     setTimeout(() => {
        //       if (RichText.current) {
        //         RichText.current.focusContentEditor();
        //       }
        //     }, 100);
        //   }}
        // >
        <View className="mx-3 mb-6" style={{ flex: 1 }}>
          {noteContent ? (
            <ScrollView>
              <RenderHTML
                contentWidth={width}
                source={{
                  html: highlightVisibleTextOnly(noteContent, searchQuery),
                }}
                baseStyle={{
                  fontSize: 14,
                  color: "#000",
                }}
                tagsStyles={{
                  p: { marginTop: 0, marginBottom: 0, padding: 0 },
                  h1: { marginTop: 0, marginBottom: 0, padding: 0 },
                  h2: { marginTop: 0, marginBottom: 0, padding: 0 },
                  h3: { marginTop: 0, marginBottom: 0, padding: 0 },
                  h4: { marginTop: 0, marginBottom: 0, padding: 0 },
                  h5: { marginTop: 0, marginBottom: 0, padding: 0 },
                  h6: { marginTop: 0, marginBottom: 0, padding: 0 },
                }}
              />
            </ScrollView>
          ) : (
            <Text className="text-gray-600">Start Writing!</Text>
          )}
        </View>
        // </TouchableWithoutFeedback>
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
        handleSearchModal={handleSearchModal}
        isEditing={isEditing}
      />
      <QueryMenuModal
        visible={isQueryMenuModalOpen}
        onClose={() => setIsQueryMenuModalOpen(false)}
        onProcessQuery={processQuery}
        onCompleteHighlightedText={onCompleteHighlightedText}
        setQueryText={setQueryText}
        setSelectedText={setSelectedText}
        queryText={queryText}
      />
      <OrganizePreferencesModal
        isVisible={isOrganizePreferencesModalOpen}
        setIsVisible={setIsOrganizePreferencesModalOpen}
        organizeNotes={organizeNotes}
      />
      <SearchNavigation
        query={searchQuery}
        onChangeQuery={setSearchQuery}
        isModalOpen={isSearchNavOpen}
        handleModalClose={handleSearchModal}
      />
      <TextReplacementModal
        visible={isReplacementModalVisible}
        onClose={() => setIsReplacementModalVisible(false)}
        onReplace={handleReplace}
        processedText={processedText}
      />
    </SafeAreaView>
  );
};

export default Note;
