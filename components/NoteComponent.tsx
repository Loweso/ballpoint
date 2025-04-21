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
import axios from "axios";

type NoteComponentProps = {
  title: string;
  noteID: string;
  categories: { label: string; color?: string }[];
  notesContent: string;
  date: Date;
  onDelete: (noteID: string) => void;
};

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
  const handleRename = () => {
    console.log("Renamed to:", newTitle);
    setIsRenameModalVisible(false);
  };

  const deleteNote = async () => {
    try {
      const response = await axios.delete(
        `${process.env.EXPO_PUBLIC_DEVICE_IPV4}/notes/${noteID}/`
      );
      console.log("Note deleted:", response.data);
      Alert.alert("Success", "Note deleted!");
      onDelete(noteID);
    } catch (error) {
      console.error("Error deleting note:", error);
      Alert.alert("Error", "Something went wrong while deleting.");
    }
  };

  return (
    <Pressable
      className="w-full bg-primary-white rounded-2xl border-2 border-slate-400 p-4"
      onPress={() => {
        console.log("Redirect to?:", noteID);
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

      <View className="flex flex-row items-center justify-between">
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

      <View className="flex flex-row flex-wrap my-2 gap-4">
        {categories.map((category, index) => (
          <View
            key={index}
            style={{ backgroundColor: category.color || "#fffee1" }} // Use style instead
            className="h-8 py-1 px-4"
          >
            <Text className="font-bold">{String(category.label)}</Text>
          </View>
        ))}
      </View>

      <Text className="text-sm text-justify" numberOfLines={4}>
        {notesContent}
      </Text>

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
