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
import { ScrollView } from "react-native";

interface ManageCategoriesProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
}

interface Category {
  id: string;
  label: string;
  color: string;
}

export const ManageCategories: React.FC<ManageCategoriesProps> = ({
  isVisible,
  setIsVisible,
}) => {
  const screenHeight = Dimensions.get("window").height;

  const slideAnim = useRef(new Animated.Value(screenHeight + 100)).current;

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
        await api.put(`/notes/categories/update/${categoryToUpdate.id}/`, {
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
    setIsCategoryNamingModalVisible(true);
  };

  const closeCategoryNamingModal = () => {
    setIsCategoryNamingModalVisible(false);
  };

  const handleAddCategory = async (newName: string) => {
    const sanitizedName = newName.trim();

    if (!sanitizedName) {
      return;
    }

    try {
      const response = await api.post("/notes/categories/create/", {
        label: sanitizedName,
        color: categoryColor,
      });

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
      await Promise.all(
        indicesToDelete.map(async (index) => {
          const category = categories[index];
          try {
            const response = await api.delete(
              `/notes/categories/delete/${category.id}/`
            );
          } catch (error) {
            console.error("Error deleting category:", error);
          }
        })
      );
      const updatedCategories = categories.filter(
        (_, index) => !selected[index]
      );
      setCategories(updatedCategories);
      setSelected(Array(updatedCategories.length).fill(false));
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
          const response = await api.get("/notes/categories/");
          const categories = response.data;
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
  }, [isVisible, screenHeight, slideAnim]);

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        position: "relative",
        zIndex: 10,
        flex: 1,
        paddingLeft: 2,
        paddingRight: 2,
        paddingTop: 4,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      {/* Header */}
      <View
        className="flex flex-row mt-2 mb-4 bg-secondary-categlistyellow rounded-xl justify-center items-center"
        style={{ width: "100%" }}
      >
        {/* Category List */}
        <View className="w-full h-full pl-[10px] pr-[10px] pt-[15px] pb-[30px] rounded-xl justify-center items-center">
          <View className="flex flex-row w-full justify-end pb-2">
            <TouchableOpacity
              className="pr-2"
              onPress={openCategoryNamingModal}
            >
              <Ionicons name="add-circle-outline" color="#a09d45" size={28} />
            </TouchableOpacity>

            {!isSelectingForDelete ? (
              <TouchableOpacity
                className="pr-2"
                onPress={() => {
                  setIsSelectingForDelete(true);
                  setSelected(Array(categories.length).fill(false)); // Reset selection
                }}
              >
                <Ionicons name="trash-outline" color="#E31E1E" size={28} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity className="pr-4" onPress={handleDeletePress}>
                <Ionicons name="trash" color="#E31E1E" size={28} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            style={{ maxHeight: 200, width: "100%" }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={true}
          >
            {categories.map((category, index) => (
              <View
                key={index}
                className="flex-row justify-right items-center p-2"
              >
                {isSelectingForDelete && (
                  <TouchableOpacity onPress={() => toggleSelection(index)}>
                    <Ionicons
                      name={selected[index] ? "ellipse" : "ellipse-outline"}
                      color={selected[index] ? "#6a994e" : "#a09d45"}
                      size={20}
                    />
                  </TouchableOpacity>
                )}

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
                  <Text className="text-xl">{category.label}</Text>
                </View>

                <TouchableOpacity
                  className="absolute right-[10px]"
                  onPress={() => handleRenameCategory(index)}
                >
                  <Text className="text-lg text-tertiary-textGray">Rename</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
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
