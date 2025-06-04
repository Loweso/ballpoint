import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { api } from "@/lib/redux/slices/authSlice";

interface Category {
  id: number;
  label: string;
  color: string;
}

interface ManageCategoriesProps {
  isVisible: boolean;
  setIsVisible: (value: boolean) => void;
  initialMode?: "view" | "edit";
}

const isColorLight = (hexColor: string) => {
  if (!hexColor) return true; // fallback to light
  const color = hexColor.replace("#", "");

  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 155;
};

const ManageCategoriesInNote: React.FC<ManageCategoriesProps> = ({
  isVisible,
  setIsVisible,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [noteCategories, setNoteCategories] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { id } = useLocalSearchParams();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/notes/categories/");
      setCategories(response.data);
    
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNoteCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/notes/${id}/`);
      const note = response.data;
      const categoryIds = note.categories.map((cat: Category) => cat.id); // Extract category IDs
      setNoteCategories(categoryIds);
 
    } catch (error) {
      console.error("Failed to fetch note categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateNoteCategories = async () => {
    try {
  
      const response = await api.put(`/notes/${id}/update-categories/`, {
        categories: noteCategories,
      });
    
    } catch (error) {
      console.error("Failed to update note categories:", error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchCategories();
      fetchNoteCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const mergedCategories = [
    ...categories.filter((cat) => noteCategories.includes(cat.id)),
    ...categories.filter((cat) => !noteCategories.includes(cat.id)),
  ];

  const toggleCategory = (categoryId: number) => {
    if (noteCategories.includes(categoryId)) {
      setNoteCategories((prev) => prev.filter((id) => id !== categoryId));
    } else {
      setNoteCategories((prev) => [...prev, categoryId]);
    }
  };

  if (!isVisible) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.25)",
        zIndex: 1000,
      }}
    >
      {/* inner modal box */}
      <View
        style={{
          width: "85%",
          height: "95%",
          backgroundColor: "white",
          padding: 12,
          borderRadius: 10,
        }}
      >
        <View className="flex flex-row justify-between items-center mb-2">
          <Text className="font-bold text-center">Select Note Categories</Text>
          <TouchableOpacity
            onPress={() => {
              setIsVisible(false);
            }}
          >
            <AntDesign name="close" size={24} color="grey" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="black" className="mt-8" />
        ) : (
          <>
            <FlatList
              data={mergedCategories}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const isSelected = noteCategories.includes(item.id);
                const useDarkText = isColorLight(item.color);

                return (
                  <TouchableOpacity
                    onPress={() => toggleCategory(item.id)}
                    className="flex flex-row items-center w-full p-3 mb-2 rounded-lg"
                    style={{ backgroundColor: item.color }}
                  >
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: isSelected ? "black" : "white",
                        borderWidth: 1,
                        borderColor: useDarkText ? "black" : "white",
                        marginRight: 10,
                      }}
                    />
                    <Text
                      style={{
                        color: useDarkText ? "black" : "white",
                        fontWeight: isSelected ? "bold" : "normal",
                      }}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

            {/* Buttons */}
            <View className="flex flex-row justify-end gap-2 mt-2">
              <TouchableOpacity
                onPress={() => setIsVisible(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                <Text className="text-black font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  updateNoteCategories();
                  setIsVisible(false);
                }}
                className="px-4 py-2 bg-black rounded-md"
              >
                <Text className="text-white font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default ManageCategoriesInNote;
