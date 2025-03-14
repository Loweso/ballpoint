import { Modal, View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ManageCategories } from "./ManageCategories";
import NamingModal from "./NamingModal";
import { ConfirmationModal } from "./ConfirmationModal";
import React, { useState, useRef } from "react";

interface NoteSettingsModalProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

export const NoteSettings: React.FC<NoteSettingsModalProps> = ({
  isVisible,
  setIsVisible,
}) => {
  const [isManageCategoriesVisible, setIsManageCategoriesVisible] =
    useState(false);
  const [manageMode, setManageMode] = useState<"view" | "edit">("view");
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const containerHeight = useRef(new Animated.Value(240)).current;

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

  const handleConfirmDelete = () => {
    console.log("Category Deleted");
    setConfirmModalVisible(false);
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
            height: 320,
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
          <View className="flex flex-row mt-2 items-center justify-center">
            <TouchableOpacity onPress={() => console.log("Search in Note Pressed")}>
              <View className="h-[120px] w-[80px] items-center bg-secondary-buttonGrey rounded-xl p-3">
                <Ionicons name="search-outline" color="#080808" size={56} />
                <Text className="text-center text-sm">Search in Note</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="ml-2"
              onPress={() => toggleManageCategories("view")}
            >
              <View className="h-[120px] w-[80px] items-center bg-secondary-categlistyellow rounded-xl p-2">
                <Ionicons name="list-outline" color="#a09d45" size={56} />
                <Text className="text-center text-sm text-tertiary-textYellow">
                  Manage
                </Text>
                <Text className="text-center text-sm text-tertiary-textYellow">
                  Categories
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="ml-2"
              onPress={() => setRenameModalVisible(true)}
            >
              <View className="h-[120px] w-[80px] items-center bg-tertiary-buttonBlue rounded-xl p-3">
                <Ionicons name="create-outline" color="#146FE1" size={56} />
                <Text className="text-center text-sm text-tertiary-textBlue">
                  Rename Note
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="ml-2"
              onPress={() => setConfirmModalVisible(true)}
            >
              <View className="h-[120px] w-[80px] items-center bg-[#FFDEDE] rounded-xl p-3">
                <Ionicons name="trash-outline" color="#e31e1e" size={56} />
                <Text className="text-center text-sm text-tertiary-textRed">
                  Delete Note
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Manage Categories */}
          <ManageCategories
            isVisible={isManageCategoriesVisible}
            setIsVisible={setIsManageCategoriesVisible}
            initialMode={manageMode}
          />

          {/* Naming Modal */}
          {renameModalVisible && (
            <NamingModal
              visible={renameModalVisible}
              onClose={() => setRenameModalVisible(false)}
              onCancel={() => setRenameModalVisible(false)}
              onProceed={handleRenameSubmit}
              placeholder="Rename Note Title"
            />
          )}

          {/* Confirmation Modal */}
          {confirmModalVisible && (
            <ConfirmationModal
              isVisible={confirmModalVisible}
              setIsVisible={setConfirmModalVisible}
              label="Are you sure you want to delete this note?"
              confirmText="Delete"
              cancelText="Cancel"
              classnameConfirm="bg-tertiary-buttonRed"
              classnameCancel="bg-secondary-buttonGrey"
              onConfirm={handleConfirmDelete}
            />
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default NoteSettings;