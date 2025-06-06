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
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome6,
} from "@expo/vector-icons";
import RenderHTML from "react-native-render-html";
import striptags from "striptags";
import { api } from "@/lib/redux/slices/authSlice";
import MarkdownIt from "markdown-it";
import { highlightVisibleTextOnly } from "@/utils/highlightTextinHTML";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

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
import PermissionsModal from "@/components/PermissionsModal";
import MediaChoiceModal from "@/components/MediaChoiceModal";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { LinearGradient } from "expo-linear-gradient";

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
  const [insertMode, setInsertMode] = useState<
    "append" | "replace" | "selected-replace"
  >("append");

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

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);

  const [noteUpdated, setNoteUpdated] = useState(false);
  const [noteSavingError, setNoteSavingError] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);
  const [unsupportedFile, setUnsupportedFile] = useState(false);
  const [noteDeleted, setNoteDeleted] = useState(false);
  const [noteDeletedError, setNoteDeletedError] = useState(false);
  const [noTextHighlighted, setNoTextHighlighted] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [editModeRequired, setEditModeRequired] = useState(false);
  const [replaceNote, setReplaceNote] = useState(false);
  const [replaceHighlightedText, setReplaceHighlightedText] = useState(false);

  const toggleAIPolishModal = () => {
    setIsAIPolishModalOpen(!isAIPolishModalOpen);
  };

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

      setInsertMode("replace");
      setAiText(response.data.organized);
      setExtractionTitle(`Organized Notes: ${mode}`);

      setTimeout(() => {
        setIsOrganizePreferencesModalOpen(false);
        setIsExtractionWindowVisible(true);
      }, 600);
    } catch (error) {
      console.error(error);
      alert("Error organizing text.");
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

      setInsertMode("selected-replace");
      setAiText(response.data.answer);
      setExtractionTitle("Query Response");

      setTimeout(() => {
        setIsQueryMenuModalOpen(false);
        setIsExtractionWindowVisible(true);
      }, 600);
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

      setInsertMode("selected-replace");
      setAiText(response.data.completedText);
      setExtractionTitle("Completed Selection");

      setTimeout(() => {
        setIsQueryMenuModalOpen(false);
        setIsExtractionWindowVisible(true);
      }, 600);
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

      setNoteUpdated(true);
    } catch (error: any) {
      if (error.response) {
        console.error("Backend error response:", error.response.data);
      } else {
        console.error("Unexpected error:", error.message);
      }
      setNoteSavingError(true);
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
      setShowPermissionModal(true);
      return;
    }

    setShowMediaModal(true);
  };

  const handleTakePhoto = async () => {
    setShowMediaModal(false);
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
        const uploadResponse = await api.post(
          "extract/extract-text",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (uploadResponse.data?.text) {
          setAiText(uploadResponse.data.text);
          setTimeout(() => setIsExtractionWindowVisible(true), 600);
        }
      } catch (err) {
        console.error("Error uploading photo:", err);
        setUploadFailed(true);
      } finally {
        setIsLoading(false);
        setLoadingMessage("");
      }
    }
  };

  const handlePickDocument = async () => {
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
        setUnsupportedFile(true);
        return;
      }

      setTimeout(() => {
        setIsExtractionWindowVisible(true);
      }, 600);
    } catch (error) {
      console.error("Error uploading file:", error);

      let backendMessage: string | null = null;

      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "error" in error.response.data &&
        typeof error.response.data.error === "string"
      ) {
        backendMessage = error.response.data.error;
      }

      Alert.alert(
        "Error",
        backendMessage || "Upload failed. Check your backend and try again."
      );
      setUploadFailed(true);
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
      setNoteDeleted(true);
    } catch (error) {
      console.error("Error deleting note:", error);
      setNoteDeletedError(true);
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
    <View
      style={{ width: 30, height: 30, borderRadius: 20, position: "relative" }}
      className="items-center justify-center"
    >
      <LinearGradient
        colors={["#146fe1", "#37b16e"]}
        style={{ width: 24, height: 24, borderRadius: 20 }}
      />
      <Ionicons
        name="sparkles-outline"
        size={16}
        color="white"
        style={{ position: "absolute", left: 8, top: 7 }}
      />
    </View>
  );

  const [initialNoteContent, setInitialNoteContent] = useState(noteContent);
  const enableEditing = () => {
    setInitialNoteContent(noteContent); // store the content before editing
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

      if (selected) {
        setIsQueryMenuModalOpen(true);
      } else {
        setNoTextHighlighted(true);
        return;
      }
    }
  };

  const insertImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Permission to access media library is required."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      base64: false, // we’ll convert it ourselves
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;

      try {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const mimeType = result.assets[0].type || "image/jpeg";
        const dataUrl = `data:${mimeType};base64,${base64}`;

        RichText.current?.insertImage(dataUrl);
      } catch (error) {
        console.error("Failed to convert image to base64:", error);
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
        <TouchableOpacity
          onPress={() => {
            if (isEditing && noteContent !== initialNoteContent) {
              setUnsavedChanges(true);
            } else {
              setLoadingMessage("Returning to dashboard...");
              setIsLoading(true);
              setTimeout(() => {
                router.push("/");
              }, 500);
            }
          }}
          className="pr-4"
        >
          <View className="flex flex-row items-center gap-1">
            <Ionicons name="arrow-back" size={28} color="black" />
          </View>
        </TouchableOpacity>

        <View className="flex-row flex gap-x-1 justify-between items-center">
          <TouchableOpacity className="pl-4 pr-2 py-1 items-center">
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color="black"
              onPress={() => {
                setIsNoteSettingsVisible(true);
              }}
            />
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity
              className="flex flex-row items-center px-3 py-2 bg-tertiary-buttonGreen rounded-2xl"
              onPress={openCamera}
            >
              <Text className="text-white font-medium pl-1">Extract</Text>
              <Ionicons name="document-outline" size={13} color="white" />
            </TouchableOpacity>
          )}

          {isEditing && (
            <TouchableOpacity
              onPress={async () => {
                await saveNote();
                setIsEditing(false);
                titleInputRef.current?.blur();
              }}
              className="flex flex-row items-center px-3 py-2 bg-secondary-yellow gap-1 rounded-2xl"
            >
              <Text className="pl-1 font-medium">Done</Text>
              <Ionicons
                name="checkmark-circle-outline"
                size={15}
                color="black"
              />
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
          } else if (insertMode === "selected-replace") {
            Alert.alert(
              "Replace Highlighted Text?",
              "This will replace only the highlighted portion of the note. Are you sure?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Replace",
                  style: "default",
                  onPress: () => {
                    RichText.current?.commandDOM(
                      `document.execCommand("insertHTML", false, \`${html}\`)`
                    );
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
        className="text-2xl mx-4 mb-3 font-semibold"
        placeholder="Title"
        onChangeText={setTitle}
        value={title}
      />

      {isEditing ? (
        <>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
            className="mx-1"
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
                  marginBottom: 2px;
                  padding: 0;
                }
              `,
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
              actions.setUnderline,
              actions.setStrikethrough,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.insertImage,
            ]}
            iconMap={{
              openAIPolishModal: AiModalOpenIcon,
              replaceText: ReplaceIcon,
            }}
            openAIPolishModal={toggleAIPolishModal}
            replaceText={onInjectJavascript}
            onPressAddImage={insertImage}
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
        <View className="mx-4 mb-6" style={{ flex: 1 }}>
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
                  p: { marginTop: 0, marginBottom: 2, padding: 0 },
                  h1: { marginTop: 0, marginBottom: 2, padding: 0 },
                  h2: { marginTop: 0, marginBottom: 2, padding: 0 },
                  h3: { marginTop: 0, marginBottom: 2, padding: 0 },
                  h4: { marginTop: 0, marginBottom: 2, padding: 0 },
                  h5: { marginTop: 0, marginBottom: 2, padding: 0 },
                  h6: { marginTop: 0, marginBottom: 2, padding: 0 },
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
      <PermissionsModal
        visible={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
      />

      <PermissionsModal
        visible={noteUpdated}
        onClose={() => setNoteUpdated(false)}
        title="You're on Point!"
        message="Your note has been successfully updated."
      />
      <PermissionsModal
        visible={noteSavingError}
        onClose={() => setNoteSavingError(false)}
        title="Error"
        message="Something went wrong while saving your note. Please try again."
      />
      <PermissionsModal
        visible={uploadFailed}
        onClose={() => setUploadFailed(false)}
        title="Upload Failed"
        message="There was an error uploading your file. Please check your backend and try again."
      />
      <PermissionsModal
        visible={unsupportedFile}
        onClose={() => setUnsupportedFile(false)}
        title="Unsupported File"
        message="Please select a valid image or audio file."
      />
      <PermissionsModal
        visible={noteDeleted}
        onClose={() => setNoteDeleted(false)}
        title="Note Deleted"
        message="Your note has been successfully deleted."
      />
      <PermissionsModal
        visible={noteDeletedError}
        onClose={() => setNoteDeletedError(false)}
        title="Error"
        message="Something went wrong while deleting your note. Please try again."
      />
      <PermissionsModal
        visible={noTextHighlighted}
        onClose={() => setNoTextHighlighted(false)}
        title="No Text Highlighted"
        message="Please highlight some text to use this feature."
      />
      <PermissionsModal
        visible={editModeRequired}
        onClose={() => setEditModeRequired(false)}
        title="Edit Mode Required"
        message="Please enable edit mode to use this feature."
      />

      <ConfirmationModal
        isVisible={unsavedChanges}
        setIsVisible={setUnsavedChanges}
        label="You have unsaved changes. Are you sure you want to go back?"
        confirmText="Discard Changes"
        cancelText="Cancel"
        classnameConfirm="bg-tertiary-buttonRed"
        classnameCancel="bg-gray-200"
        onConfirm={() => {
          setIsEditing(false);
          router.push("/");
        }}
      />

      <MediaChoiceModal
        visible={showMediaModal}
        onCancel={() => setShowMediaModal(false)}
        onTakePhoto={handleTakePhoto}
        onPickFile={() => {
          setShowMediaModal(false);
          handlePickDocument();
        }}
      />
    </SafeAreaView>
  );
};

export default Note;
