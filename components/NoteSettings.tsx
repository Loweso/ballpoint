import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ManageCategoriesInNote from "./ManageCategoriesInNote";
import NamingModal from "./NamingModal";
import { ConfirmationModal } from "./ConfirmationModal";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useWindowDimensions } from "react-native";

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
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const router = useRouter();
  const { height } = useWindowDimensions();

  const closeModal = () => {
    setIsVisible(false);
    setIsManageCategoriesVisible(false);
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
      <Pressable
        onPress={closeModal}
        style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      >
        <View className="flex-1 justify-end items-center">
          <View
            style={{
              width: "100%",
              backgroundColor: "#e1f1e8",
              paddingHorizontal: 0,
              paddingVertical: 0,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              shadowOpacity: 0.2,
              minHeight: 180,
              maxHeight: height * 0.9,
              position: "relative",
            }}
          >
            {/* Close Button */}
            <View className="mt-4 justify-center items-end">
              <TouchableOpacity className="pr-4" onPress={closeModal}>
                <Ionicons name="exit-outline" color="#080808" size={32} />
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View className="">
              <View className="flex flex-row justify-center pt-2 pb-24">
                <TouchableOpacity
                  className="m-2"
                  onPress={() => console.log("Search in Note Pressed")}
                >
                  <View className="h-[110px] w-[90px] justify-center items-center bg-secondary-buttonGrey rounded-xl p-3">
                    <Ionicons name="search-outline" color="#080808" size={48} />
                    <Text
                      className="min-h-[35px] w-full text-center text-sm"
                      style={{ textAlignVertical: "center" }}
                    >
                      Search in Note
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="m-2"
                  onPress={() => setIsManageCategoriesVisible(true)}
                >
                  <View className="h-[110px] w-[90px] justify-center items-center bg-secondary-categlistyellow rounded-xl p-3">
                    <Ionicons name="list-outline" color="#a09d45" size={48} />
                    <Text
                      className="min-h-[35px] w-full text-center text-sm text-tertiary-textYellow"
                      style={{ textAlignVertical: "center" }}
                    >
                      Manage Categories
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="m-2"
                  onPress={() => setConfirmModalVisible(true)}
                >
                  <View className="h-[110px] w-[90px] justify-center items-center bg-[#FFDEDE] rounded-xl p-3">
                    <Ionicons name="trash-outline" color="#e31e1e" size={48} />
                    <Text
                      className="min-h-[35px] w-full text-center text-sm text-tertiary-textRed"
                      style={{ textAlignVertical: "center" }}
                    >
                      Delete Note
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Manage Categories */}
                <ManageCategoriesInNote
                  isVisible={isManageCategoriesVisible}
                  setIsVisible={setIsManageCategoriesVisible}
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
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default NoteSettings;
