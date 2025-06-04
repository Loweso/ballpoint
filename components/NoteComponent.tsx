import React, { useState } from "react";
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import OutsidePressHandler from "react-native-outside-press";
import { useFonts } from "expo-font";
import NoteSettingsConfirmationModal from "./NoteSettingsConfirmationModal";
import { api } from "@/lib/redux/slices/authSlice";
// Removed RenderHTML import since no longer used in preview

type NoteComponentProps = {
  title: string;
  noteID: string;
  categories: { label: string; color?: string }[];
  notesContent: string;
  date: Date;
  onDelete: (noteID: string) => void;
};

function getReadableTextColor(hex: string): string {
  const cleanedHex = hex.replace("#", "");
  const r = parseInt(cleanedHex.substring(0, 2), 16);
  const g = parseInt(cleanedHex.substring(2, 4), 16);
  const b = parseInt(cleanedHex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#000000" : "#ffffff";
}

function sanitizeHTML(html: string): string {
  const noInlineStyles = html.replace(/style="[^"]*"/gi, "");
  const noStyleTags = noInlineStyles.replace(
    /<style[^>]*>[\s\S]*?<\/style>/gi,
    ""
  );
  return noStyleTags;
}

// Simple function to strip HTML tags for plain text extraction
function stripHtmlTags(html: string): string {
  if (!html) return "";

  // Replace block-level tags with newlines
  const withLineBreaks = html
    .replace(
      /<\s*(div|p|br|li|section|article|header|footer|h[1-6])[^>]*>/gi,
      "\n"
    )
    .replace(
      /<\s*\/\s*(div|p|li|section|article|header|footer|h[1-6])\s*>/gi,
      "\n"
    );

  // Strip remaining tags
  const textOnly = withLineBreaks.replace(/<\/?[^>]+(>|$)/g, "");

  // Normalize multiple newlines and trim
  return textOnly.replace(/\n{2,}/g, "\n").trim();
}

const NoteComponent: React.FC<NoteComponentProps> = ({
  title,
  noteID,
  categories,
  notesContent,
  date,
  onDelete,
}) => {
  const router = useRouter();

  const [noteSettingsDeleteVisible, setNoteSettingsDeleteVisible] =
    useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [prevTitle, setPrevTitle] = useState(title);
  const [fontsLoaded] = useFonts({
    "Comfortaa-Medium": require("../assets/fonts/Comfortaa-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);
  const openRenameModal = () => {
    setPrevTitle(newTitle);
    setIsRenameModalVisible(true);
    setMenuOpen(false);
  };
  const closeRenameModal = () => {
    setNewTitle(prevTitle);
    setIsRenameModalVisible(false);
  };
  const handleRename = async () => {
    const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'
    try {
      await api.put(`/notes/${noteID}/`, {
        title: newTitle,
        notesContent: notesContent,
        categories: [],
        date: today,
      });
    
      setIsRenameModalVisible(false);
    } catch (error) {
      console.error("Error renaming note:", error);
      Alert.alert("Error", "Failed to rename the note.");
    }
  };

  const deleteNote = async () => {
    try {
      const response = await api.delete(`/notes/${noteID}/`);
   
      Alert.alert("Success", "Note deleted!");
      onDelete(noteID);
    } catch (error) {
      console.error("Error deleting note:", error);
      Alert.alert("Error", "Something went wrong while deleting.");
    }
  };

  // Extract plain text preview for exactly 4 lines display
  const plainTextPreview = stripHtmlTags(sanitizeHTML(notesContent));

  return (
    <Pressable
      className="w-full bg-primary-white rounded-2xl border-2 border-slate-400 p-4"
      onPress={() => {
       
        router.push(`/note/${noteID}` as any);
      }}
    >
      {menuOpen && (
        <OutsidePressHandler
          onOutsidePress={closeMenu}
          className="absolute top-0 right-0 z-10"
        >
          <View
            className="p-4 gap-2 w-36 rounded-xl shadow-lg shadow-black bg-primary-white"
            onStartShouldSetResponder={() => true}
          >
            <TouchableOpacity
              className="flex flex-row items-center justify-between w-full"
              onPress={() => {
                setNoteSettingsDeleteVisible(true);
              }}
            >
              <Text className="text-tertiary-textRed">Delete</Text>
              <Feather name="trash-2" size={20} color="red" />
            </TouchableOpacity>
            <View className="h-px bg-gray-300 w-full" />
            <TouchableOpacity
              className="flex flex-row items-center justify-between w-full"
              onPress={openRenameModal}
            >
              <Text className="text-tertiary-textBlue">Rename</Text>
              <MaterialIcons
                name="drive-file-rename-outline"
                size={20}
                color="blue"
              />
            </TouchableOpacity>
            <View className="h-px bg-gray-300 w-full" />
            <TouchableOpacity
              className="flex flex-row items-center justify-between w-full"
              onPress={closeMenu}
            >
              <Text className="text-black">Back</Text>
              <Feather name="arrow-left" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </OutsidePressHandler>
      )}

      <View className="flex flex-row items-center justify-between -ml-1">
        <Text
          className="text-3xl w-3/4"
          style={{ fontFamily: "Comfortaa-Medium", overflow: "hidden" }}
          numberOfLines={1}
        >
          {newTitle}
        </Text>
        <View className="flex flex-col w-1/4 items-end">
          <TouchableOpacity className="w-8" onPress={openMenu}>
            <Entypo name="dots-three-horizontal" size={20} color="black" />
          </TouchableOpacity>
          <Text className="text-sm">{date.toLocaleDateString("en-US")}</Text>
        </View>
      </View>

      <View className="flex flex-row flex-wrap my-2 gap-2">
        {[...categories]
          .sort((a, b) => b.label.length - a.label.length)
          .map((category, index) => {
            const backgroundColor = category.color || "#fffee1";
            const textColor = getReadableTextColor(backgroundColor);
            return (
              <View
                key={index}
                style={{ backgroundColor }}
                className="p-2 rounded"
              >
                <Text style={{ color: textColor }} className="font-bold">
                  {String(category.label)}
                </Text>
              </View>
            );
          })}
      </View>

      {/* Plain text preview with strict 4 lines limit */}
      <View>
        <Text
          style={{
            fontSize: 12,
            lineHeight: 16,
            color: "#1a1a1a",
            fontFamily: "System",
            fontWeight: "normal",
            textAlign: "left",
          }}
          numberOfLines={4}
        >
          {plainTextPreview}
        </Text>
      </View>

      <Modal visible={isRenameModalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="bg-white p-6 rounded-xl w-full">
            <Text className="text-lg font-bold mb-4">Rename Title</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded-md"
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Enter new title"
            />
            <View className="flex flex-row justify-end mt-4 gap-2">
              <TouchableOpacity
                className="px-4 py-2 bg-gray-300 rounded-md"
                onPress={closeRenameModal}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-4 py-2 bg-tertiary-buttonGreen rounded-md"
                onPress={handleRename}
              >
                <Text className="text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <NoteSettingsConfirmationModal
        isVisible={noteSettingsDeleteVisible}
        setIsVisible={setNoteSettingsDeleteVisible}
        onConfirm={deleteNote}
        noteName={title}
      />
    </Pressable>
  );
};

export default NoteComponent;
