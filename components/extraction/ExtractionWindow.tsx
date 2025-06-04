import React from "react";
import { File } from "@/hooks/DocumentPicker";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Markdown from "react-native-markdown-display";

interface ExtractionWindowProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  selectedFile?: File | null;
  content: string;
  onInsert: (content: string) => void;
  title?: string;
  setSelectedFile: (file: File | null) => void;
  setTitle: (title: string) => void;
}

export const ExtractionWindow: React.FC<ExtractionWindowProps> = ({
  isVisible,
  setIsVisible,
  selectedFile,
  content,
  onInsert,
  title,
  setSelectedFile,
  setTitle,
}) => {
  const closeModal = () => setIsVisible(false);
  const { height } = useWindowDimensions();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {}}
    >
      <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.3)" }}>
        <View className="flex-1 justify-end items-center">
          <View
            style={{
              width: "100%",
              backgroundColor: "#d7eedd", // bg-primary-green
              paddingHorizontal: 16,
              paddingVertical: 16,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowOpacity: 0.2,
              maxHeight: height * 0.9,
              minHeight: 180,
            }}
          >
            {/* Close Button */}
            <View className="relative items-end justify-center">
              <TouchableOpacity
                onPress={() => {
                  closeModal();
                  setSelectedFile(null);
                  setTitle("");
                }}
              >
                <Ionicons name="exit-outline" color="#5A5353" size={32} />
              </TouchableOpacity>
            </View>

            {/* Filename */}
            {title || selectedFile?.name ? (
              <Text className="text-tertiary-buttonGreen text-lg font-semibold">
                {title || selectedFile?.name}
              </Text>
            ) : null}

            {/* Scrollable Markdown Content */}
            <ScrollView
              className="mt-4"
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={true}
            >
              <View className="gap-y-3">
                <Markdown>{content || ""}</Markdown>
              </View>
            </ScrollView>

            {/* Prompt + Buttons */}
            <Text className="text-center mt-4 font-semibold text-lg">
              Insert to notes?
            </Text>
            <View className="flex flex-row justify-around mt-2">
              <Pressable
                onPress={() => {
                  closeModal();
                  setSelectedFile(null);
                  setTitle("");
                }}
                className="shadow-md py-2 w-[40%] flex flex-row justify-center rounded-xl bg-zinc-100"
              >
                <Text className="text-2xl">Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  onInsert(content);
                  closeModal();
                  setSelectedFile(null);
                  setTitle("");
                }}
                className="shadow-md py-2 w-[40%] flex flex-row justify-center rounded-xl bg-secondary-yellow"
              >
                <Text className="text-2xl">Insert</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
