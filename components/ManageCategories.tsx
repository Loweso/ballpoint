import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  Easing,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef } from "react";
import NamingModal from "./NamingModal";
import { ConfirmationModal } from "./ConfirmationModal";

interface ManageCategoriesProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  initialMode?: "view" | "edit";
}

export const ManageCategories: React.FC<ManageCategoriesProps> = ({
  isVisible,
  setIsVisible,
  initialMode = "view",
}) => {
  const [mode, setMode] = useState<"view" | "edit">(initialMode);
  const screenHeight = Dimensions.get("window").height;

  const slideAnim = useRef(new Animated.Value(screenHeight + 100)).current;

  const closeModal = () => {
    setIsVisible(false);
  };

  const [categories, setCategories] = useState([
    "Category Name 1",
    "Category Name 2",
    "Category Name 3",
    "Category Name 4",
  ]);

  const [selected, setSelected] = useState(Array(categories.length).fill(false));
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number | null>(null);

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const toggleSelection = (index: number) => {
    const newSelected = [...selected];
    newSelected[index] = !newSelected[index];
    setSelected(newSelected);
  };

  const handleRenameCategory = (index: number) => {
    setCurrentCategoryIndex(index);
    setRenameModalVisible(true);
  };

  const handleRenameSubmit = (newName: string) => {
    if (currentCategoryIndex !== null) {
      const updatedCategories = [...categories];
      updatedCategories[currentCategoryIndex] = newName;
      setCategories(updatedCategories);
      setRenameModalVisible(false);
    }
  };

  const handleDeletePress = (index: number) => {
    setCategoryToDelete(index);
    setConfirmModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete !== null) {
      const updatedCategories = categories.filter(
        (_, i) => i !== categoryToDelete
      );
      setCategories(updatedCategories);
      setCategoryToDelete(null);
      setConfirmModalVisible(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: screenHeight + 300,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  return (
    <>
      <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        position: mode === "view" ? "absolute" : "relative",
        zIndex: 10,
        flex: 1,
        paddingLeft: 2,
        paddingRight: 2,
        paddingTop: 4,
        top: mode === "view" ? 54 : "auto",
        left: mode === "view" ? 0 : "auto",
        right: mode === "view" ? 0 : "auto",
        bottom: mode === "view" ? 0 : "auto",
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: mode === "view" ? "rgba(0,0,0,0.5)" : "transparent",
      }}
    >
        {/* Header */}
        <View className="flex flex-row w-[90%] h-[90%] mt-2 mb-4 bg-secondary-categlistyellow rounded-xl justify-center items-center">
          <View className="flex flex-row w-full absolute top-[10px]">
            {mode === "edit" && (
              <TouchableOpacity className="pl-[270px]">
                <Ionicons name="add-circle-outline" color="#a09d45" size={28} />
              </TouchableOpacity>
            )}
            {mode === "edit" && (
              <TouchableOpacity
                className="pl-[16px] right-[10px]"
                onPress={() => {
                  const selectedIndexes = selected
                    .map((isSelected, index) => (isSelected ? index : null))
                    .filter((index) => index !== null);
                  if (selectedIndexes.length > 0) {
                    handleDeletePress(selectedIndexes[0]!);
                  }
                }}
              >
                <Ionicons name="trash-outline" color="#E31E1E" size={28} />
              </TouchableOpacity>
            )}
            {mode === "view" && (
              <TouchableOpacity className="pl-[12px]" onPress={closeModal}>
                <Ionicons
                  name="arrow-back-circle-outline"
                  color="#080808"
                  size={28}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Category List */}
          <View className="w-full h-full pl-[10px] pr-[10px] pt-[30px] pb-[20px]">
            {categories.map((category, index) => (
              <View
                key={index}
                className="flex-row justify-right items-center top-[10px]"
              >
                {mode === "edit" && (
                  <TouchableOpacity onPress={() => toggleSelection(index)}>
                    <Ionicons
                      name={selected[index] ? "ellipse" : "ellipse-outline"}
                      color={selected[index] ? "#6a994e" : "#a09d45"}
                      size={20}
                    />
                  </TouchableOpacity>
                )}

                {mode === "edit" && (
                  <Text className="py-[2px] pl-[10px] text-lg">{category}</Text>
                )}

                {mode === "view" && (
                  <Text className="py-[2px] pl-[32px] text-lg">{category}</Text>
                )}

                {mode === "edit" && (
                  <TouchableOpacity
                    className="absolute right-[10px]"
                    onPress={() => handleRenameCategory(index)}
                  >
                    <Text className="text-tertiary-textGray">Rename</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          {/* Naming Modal */}
          <NamingModal
            visible={renameModalVisible}
            onClose={() => setRenameModalVisible(false)}
            onCancel={() => setRenameModalVisible(false)}
            onProceed={handleRenameSubmit}
            placeholder="Rename category"
          />

          {/* Confirmation Modal */}
          <ConfirmationModal
              isVisible={confirmModalVisible}
              setIsVisible={setConfirmModalVisible}
              label="Are you sure you want to delete this category?"
              confirmText="Delete"
              cancelText="Cancel"
              classnameConfirm="bg-tertiary-buttonRed"
              classnameCancel="bg-secondary-buttonGrey"
              onConfirm={handleConfirmDelete} 
            />
        </View>
      </Animated.View>
    </>
  );
};

export default ManageCategories;
