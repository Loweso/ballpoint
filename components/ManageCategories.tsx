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
import CategoryNamingModal from "./CategoryNamingModal";
import { ConfirmationModal } from "./ConfirmationModal";
import { api } from "@/lib/redux/slices/authSlice";

interface ManageCategoriesProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  initialMode?: "view" | "edit";
}

interface Category {
  id: string;
  label: string;
  color: string;
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

  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState(
    Array(categories.length).fill(false)
  );
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [isCategoryNamingModalVisible, setIsCategoryNamingModalVisible] =
    useState(false);

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState<
    number | null
  >(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isSelectingForDelete, setIsSelectingForDelete] = useState(false);
  const [categoryColor, setCategoryColor] = useState("#FF0000");

  const toggleSelection = (index: number) => {
    const newSelected = [...selected];
    newSelected[index] = !newSelected[index];
    setSelected(newSelected);
  };

  const handleRenameCategory = (index: number) => {
    setCurrentCategoryIndex(index);
    setCategoryColor(categories[index].color);
    setRenameModalVisible(true);
  };

  const handleRenameSubmit = async (newName: string, color: string) => {
    if (currentCategoryIndex !== null) {
      const categoryToUpdate = categories[currentCategoryIndex];
      try {
        await api.put(`/categories/update/${categoryToUpdate.id}/`, {
          label: newName,
          color: color,
        });

        const updatedCategories = [...categories];
        updatedCategories[currentCategoryIndex] = {
          ...updatedCategories[currentCategoryIndex],
          label: newName,
          color: color,
        };
        setCategories(updatedCategories);
        setRenameModalVisible(false);
      } catch (error) {
        console.error("Error updating category:", error);
      }
    }
  };

  const openCategoryNamingModal = () => {
    console.log("Opening naming modal..."); // Debug log
    setIsCategoryNamingModalVisible(true);
  };

  const closeCategoryNamingModal = () => {
    console.log("Closing naming modal..."); // Debug log
    setIsCategoryNamingModalVisible(false);
  };

  const handleAddCategory = async (newName: string) => {
    const sanitizedName = newName.trim();

    if (!sanitizedName) {
      console.log("Category name cannot be empty or just spaces.");
      return;
    }

    try {
      console.log("Sending request to create a new category...");
      const response = await api.post("/categories/create/", {
        label: sanitizedName,
        color: categoryColor,
      });

      console.log("Category created successfully:", response.data);

      setCategories((prev) => [
        ...prev,
        {
          id: response.data.id,
          label: response.data.label,
          color: response.data.color || "#FFB300",
        },
      ]);
    } catch (error: any) {
      console.error("Error during category creation:", error.message || error);
    } finally {
      closeCategoryNamingModal();
    }
  };

  const handleDeletePress = () => {
    if (selected.some((value) => value)) {
      setConfirmModalVisible(true);
    }
  };

  const handleConfirmDelete = async () => {
    const indicesToDelete = selected
      .map((isSelected, index) => (isSelected ? index : -1))
      .filter((index) => index !== -1);

    if (indicesToDelete.length === 0) return;

    try {
      // Use Promise.all to send multiple DELETE requests
      await Promise.all(
        indicesToDelete.map(async (index) => {
          const category = categories[index];
          try {
            const response = await api.delete(
              `/categories/delete/${category.id}/`
            );
            console.log("Category deleted:", response.data);
            // You can do something after successful deletion, like refreshing the list
          } catch (error) {
            console.error("Error deleting category:", error);
            // You can show an error message to the user here
          }

          console.log(`Successfully deleted category: ${category.label}`);
        })
      );

      // Remove deleted categories from the state
      const updatedCategories = categories.filter(
        (_, index) => !selected[index]
      );
      setCategories(updatedCategories);
      setSelected(Array(updatedCategories.length).fill(false)); // Reset selection
      setIsSelectingForDelete(false);
      setConfirmModalVisible(false);
    } catch (error) {
      console.error("Error deleting categories:", error);
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

      const fetchCategories = async () => {
        try {
          const response = await api.get("/categories/");
          const categories = response.data; // axios already parses JSON
          setCategories(categories);
          setSelected(Array(categories.length).fill(false));
        } catch (error) {
          console.error("Failed to fetch categories:", error);
        }
      };

      fetchCategories();
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
      <View
        className="flex flex-row mt-2 mb-4 bg-secondary-categlistyellow rounded-xl justify-center items-center"
        style={{ width: mode === "view" ? "90%" : "100%" }}
      >
        <View className="flex flex-row w-full absolute top-[10px] justify-end">
          {mode === "edit" && (
            <TouchableOpacity
              className="pr-2"
              onPress={openCategoryNamingModal}
            >
              <Ionicons name="add-circle-outline" color="#a09d45" size={28} />
            </TouchableOpacity>
          )}
          {mode === "edit" && (
            <>
              {!isSelectingForDelete ? (
                // First trash icon to enter selection mode
                <TouchableOpacity
                  className="pr-4"
                  onPress={() => {
                    setIsSelectingForDelete(true);
                    setSelected(Array(categories.length).fill(false)); // Reset selection
                  }}
                >
                  <Ionicons name="trash-outline" color="#E31E1E" size={28} />
                </TouchableOpacity>
              ) : (
                // Second trash icon to confirm deletion
                <TouchableOpacity className="pr-4" onPress={handleDeletePress}>
                  <Ionicons name="trash" color="#E31E1E" size={28} />
                </TouchableOpacity>
              )}
            </>
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
        <View className="w-full h-full pl-[10px] pr-[10px] pt-[30px] pb-[20px] rounded-xl">
          {categories.map((category, index) => (
            <View
              key={index}
              className="flex-row justify-right items-center top-[10px]"
            >
              {mode === "edit" && isSelectingForDelete && (
                <TouchableOpacity onPress={() => toggleSelection(index)}>
                  <Ionicons
                    name={selected[index] ? "ellipse" : "ellipse-outline"}
                    color={selected[index] ? "#6a994e" : "#a09d45"}
                    size={20}
                  />
                </TouchableOpacity>
              )}

              {mode === "view" && (
                <View
                  className="pl-[10px]"
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: category.color,
                      marginRight: 10,
                      borderRadius: 5,
                    }}
                  />
                  <Text className="text-lg">{category.label}</Text>
                </View>
              )}

              {mode === "edit" && (
                <View
                  className="pl-[10px]"
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: category.color,
                      marginRight: 10,
                      borderRadius: 5,
                    }}
                  />
                  <Text className="text-lg">{category.label}</Text>
                </View>
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
        <CategoryNamingModal
          visible={renameModalVisible}
          onClose={() => setRenameModalVisible(false)}
          onCancel={() => setRenameModalVisible(false)}
          onProceed={handleRenameSubmit}
          placeholder="Rename category"
          categoryColor={categoryColor}
          setCategoryColor={setCategoryColor}
        />

        {/* Naming Modal */}
        <CategoryNamingModal
          visible={isCategoryNamingModalVisible}
          onClose={closeCategoryNamingModal}
          onCancel={closeCategoryNamingModal}
          onProceed={handleAddCategory}
          placeholder="Enter new category name"
          categoryColor={categoryColor}
          setCategoryColor={setCategoryColor}
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
  );
};

export default ManageCategories;
