import { Modal, View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ManageCategoriesInNote from "./ManageCategoriesInNote";
import NamingModal from "./NamingModal";
import { ConfirmationModal } from "./ConfirmationModal";
import React, { useState, useRef } from "react";
import { useRouter } from "expo-router";

interface NoteSettingsModalProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  onDelete: () => Promise<void>;
}

export const NoteSettings: React.FC<NoteSettingsModalProps> = ({
  isVisible,
  setIsVisible,
  onDelete,
}) => {
  const [isManageCategoriesVisible, setIsManageCategoriesVisible] =
    useState(false);
  const [manageMode, setManageMode] = useState<"view" | "edit">("view");
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const containerHeight = useRef(new Animated.Value(240)).current;

  const router = useRouter();

  const closeModal = () => {
    Animated.timing(containerHeight, {
      toValue: 240,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setIsVisible(false);
      setIsManageCategoriesVisible(false);
    });
  };

  const toggleManageCategories = (mode: "view" | "edit") => {
    setIsManageCategoriesVisible(!isManageCategoriesVisible);
    setManageMode(mode);
  };

  const handleRenameSubmit = (newName: string) => {
    console.log("New Category Name:", newName);
    setRenameModalVisible(false);
  };

  const confirmDelete = async () => {
    await onDelete();
    setIsVisible(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View className="bg-black/30 h-full flex justify-end items-center">
        <Animated.View
          style={{
            height: "35%",
            width: "100%",
            backgroundColor: "#e1f1e8",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowOpacity: 0.2,
          }}
        >
          {/* Close Button */}
          <View className="h-16 items-center">
            <TouchableOpacity
              className="absolute top-[10px] right-0 z-10"
              onPress={closeModal}
            >
              <Ionicons name="exit-outline" color="#080808" size={32} />
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View className="-mx-5">
            <View className="h-full w-full flex flex-row justify-center pt-8">
              <TouchableOpacity
                onPress={() => console.log("Search in Note Pressed")}
              >
                <View className="h-[110px] w-[75px] items-center bg-secondary-buttonGrey rounded-xl p-3">
                  <Ionicons name="search-outline" color="#080808" size={48} />
                  <Text className="text-center text-sm">Search in Note</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="ml-2"
                onPress={() => toggleManageCategories("view")}
              >
                <View className="h-[110px] w-[75px] items-center bg-secondary-categlistyellow rounded-xl pt-3">
                  <Ionicons name="list-outline" color="#a09d45" size={48} />
                  <Text className="text-center text-sm text-tertiary-textYellow">
                    Manage Categories
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="ml-2"
                onPress={() => setRenameModalVisible(true)}
              >
                <View className="h-[110px] w-[75px] items-center bg-tertiary-buttonBlue rounded-xl p-3">
                  <Ionicons name="create-outline" color="#146FE1" size={48} />
                  <Text className="text-center text-sm text-tertiary-textBlue">
                    Rename Note
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="ml-2"
                onPress={() => setConfirmModalVisible(true)}
              >
                <View className="h-[110px] w-[75px] items-center bg-[#FFDEDE] rounded-xl p-3">
                  <Ionicons name="trash-outline" color="#e31e1e" size={48} />
                  <Text className="text-center text-sm text-tertiary-textRed">
                    Delete Note
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Manage Categories */}
              <ManageCategoriesInNote
                isVisible={isManageCategoriesVisible}
                setIsVisible={setIsManageCategoriesVisible}
                initialMode={manageMode}
              />
            </View>

            {/* Naming Modal */}
            <NamingModal
              visible={renameModalVisible}
              onClose={() => setRenameModalVisible(false)}
              onCancel={() => setRenameModalVisible(false)}
              onProceed={handleRenameSubmit}
              placeholder="Rename Note Title"
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
              isVisible={confirmModalVisible}
              setIsVisible={setConfirmModalVisible}
              label="Are you sure you want to delete this note?"
              confirmText="Delete"
              cancelText="Cancel"
              classnameConfirm="bg-tertiary-buttonRed"
              classnameCancel="bg-secondary-buttonGrey"
              onConfirm={() => {
                confirmDelete();
                router.replace("/home");
              }}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default NoteSettings;
