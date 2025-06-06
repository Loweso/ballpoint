import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { api } from "@/lib/redux/slices/authSlice";
import { useFonts } from "expo-font";

interface CreateNewNoteModalProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

export const CreateNewNoteModal: React.FC<CreateNewNoteModalProps> = ({
  isVisible,
  setIsVisible,
}) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [fontsLoaded] = useFonts({
    "Comfortaa-Medium": require("../assets/fonts/Comfortaa-Medium.ttf"),
  });

  const closeModal = () => {
    setIsVisible(false);
  };

  const createNote = async () => {
    const today = new Date().toISOString().split("T")[0];
    const sanitizedTitle = title.trim() || "Untitled Note";

    try {
      const response = await api.post("/notes/", {
        title: sanitizedTitle,
        notesContent: "",
        categories: [],
        date: today,
      });


      const newNoteID = response.data.noteID;

      if (newNoteID) {
        setIsVisible(false);
        router.push(`/note/${newNoteID}`);
      } else {
        throw new Error("No note ID returned.");
      }
    } catch (error: any) {
      if (error.response) {
        console.error("Backend response error:", error.response.data);
      } else {
        console.error("Error creating note:", error.message);
      }
      Alert.alert("Error", "Could not create note.");
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View className="bg-black/30 h-full flex justify-center items-center">
        <View className="flex flex-col w-[80%] bg-white px-6 py-8 rounded-xl shadow-md">
          <View className="flex flex-row items-center justify-between relative">
            <Text
              className="text-2xl"
              style={{ fontFamily: "Comfortaa-Medium" }}
            >
              Title
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close-outline" color="#5A5353" size={32} />
            </TouchableOpacity>
          </View>
          <View className="flex flex-row w-full mt-3 text-lg bg-white rounded-xl">
            <TextInput
              className="h-full w-full text-md bg-transparent border-b overflow-hidden"
              placeholder="Enter note title..."
              placeholderTextColor="gray"
              value={title}
              onChangeText={setTitle}
            />
          </View>
          <TouchableOpacity
            onPress={createNote}
            className="bg-tertiary-buttonGreen/70 rounded-full p-3 w-full flex justify-center items-center mt-5"
          >
            <Text className="text-white">Create New Note</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
