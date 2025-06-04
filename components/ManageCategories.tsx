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
import { LoadingModal } from "@/components/LoadingModal";

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

  const handleRenameCategory = (index: number, label: string) => {
    setCurrentCategoryIndex(index);
    setCategoryColor(categories[index].color);
    setCategoryToRename(categories[index].label);
    setRenameModalVisible(true);
  };

  const [categoryToRename, setCategoryToRename] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const handleRenameSubmit = async (newName: string, color: string) => {
    if (currentCategoryIndex !== null) {
      const categoryToUpdate = categories[currentCategoryIndex];

      setLoadingMessage("Renaming category...");
      setIsLoading(true);

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
      } finally {
        setIsLoading(false);
      }
    }
  };

  const openCategoryNamingModal = () => {
    console.log("Opening naming modal...");
    setIsCategoryNamingModalVisible(true);
  };

  const closeCategoryNamingModal = () => {
    console.log("Closing naming modal...");
    setIsCategoryNamingModalVisible(false);
  };

  const handleAddCategory = async (newName: string) => {
    const sanitizedName = newName.trim();

    if (!sanitizedName) {
      console.log("Category name cannot be empty or just spaces.");
      return;
    }

    setLoadingMessage("Adding category...");
    setIsLoading(true);

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
      setIsLoading(false);
      closeCategoryNamingModal();
    }
  };

  const handleDeletePress = () => {
    if (selected.some((value) => value)) {
      setConfirmModalVisible(true);
    } else {
      // No items selected, exit delete mode
      setIsSelectingForDelete(false);
    }
  };

  const handleConfirmDelete = async () => {
    const indicesToDelete = selected
      .map((isSelected, index) => (isSelected ? index : -1))
      .filter((index) => index !== -1);

    if (indicesToDelete.length === 0) return;

    setLoadingMessage("Deleting selected categories...");
    setIsLoading(true);

    try {
      await Promise.all(
        indicesToDelete.map(async (index) => {
          const category = categories[index];
          try {
            await api.delete(`/notes/categories/delete/${category.id}/`);
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
    } finally {
      setIsLoading(false);
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
        setLoadingMessage("Fetching categories...");
        setIsLoading(true);

        try {
          const response = await api.get("/notes/categories/");
          setCategories(response.data);
          setSelected(Array(response.data.length).fill(false));
        } catch (error) {
          console.error("Failed to fetch categories:", error);
        } finally {
          setIsLoading(false);
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
        <View className="w-full h-full pl-[10px] pr-[10px] pt-[15px] pb-[15px] rounded-xl justify-center items-center">
          <View className="flex flex-row w-full items-center justify-end gap-2 pb-2">
            <TouchableOpacity
              className="flex flex-row items-center px-3 py-2 gap-1 border border-[#cc930c] rounded-2xl"
              onPress={openCategoryNamingModal}
            >
              <Ionicons name="add-circle-outline" color="#cc930c" size={14} />
              <Text className="text-[#cc930c]">Add Category</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="pr-2"
              onPress={() => {
                if (isSelectingForDelete) {
                  const anySelected = selected.some((val) => val);
                  if (anySelected) {
                    setConfirmModalVisible(true);
                  } else {
                    setIsSelectingForDelete(false);
                    setSelected(Array(categories.length).fill(false));
                  }
                } else {
                  setIsSelectingForDelete(true);
                  setSelected(Array(categories.length).fill(false));
                }
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: isSelectingForDelete
                  ? "#E31E1E"
                  : "transparent",
                borderRadius: 28,
                paddingVertical: 6,
                paddingHorizontal: 10,
                borderWidth: isSelectingForDelete ? 1 : 1,
                borderColor: "#E31E1E",
              }}
            >
              <Ionicons
                name={isSelectingForDelete ? "trash" : "trash-outline"}
                color={isSelectingForDelete ? "#FFFFFF" : "#E31E1E"}
                size={16}
              />
              <Text
                style={{
                  marginLeft: 6,
                  fontSize: 14,
                  fontWeight: "500",
                  color: isSelectingForDelete ? "#FFFFFF" : "#E31E1E",
                  paddingRight: 4,
                }}
              >
                {isSelectingForDelete
                  ? selected.some((val) => val)
                    ? `Delete (${selected.filter(Boolean).length})`
                    : "Cancel"
                  : "Delete Categories"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ maxHeight: 200, width: "100%" }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={true}
          >
            {categories.length === 0 ? (
              <View className="w-full items-center mt-4">
                <Text className="text-gray-500 text-lg text-center">
                  No existing categories. Press (+) to add.
                </Text>
              </View>
            ) : (
              categories.map((category, index) => (
                <View
                  key={index}
                  className="flex-row justify-right items-center"
                >
                  {isSelectingForDelete && (
                    <TouchableOpacity onPress={() => toggleSelection(index)}>
                      <Ionicons
                        name={
                          selected[index]
                            ? "checkmark-circle"
                            : "ellipse-outline"
                        }
                        color={selected[index] ? "#E31E1E" : "#a09d45"}
                        size={26}
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
                    <Text className="text-xl p-3">{category.label}</Text>
                  </View>

                  <TouchableOpacity
                    className="absolute right-[10px] pl-4 py-2"
                    onPress={() => handleRenameCategory(index, category.label)}
                  >
                    <Text className="text-lg text-tertiary-textGray">Edit</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </View>

        {/* Naming Modal */}
        <CategoryNamingModal
          visible={renameModalVisible}
          onClose={() => setRenameModalVisible(false)}
          onCancel={() => setRenameModalVisible(false)}
          onProceed={handleRenameSubmit}
          placeholder={categoryToRename || "Rename category"}
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
      <LoadingModal visible={isLoading} message={loadingMessage} />
    </Animated.View>
  );
};

export default ManageCategories;
