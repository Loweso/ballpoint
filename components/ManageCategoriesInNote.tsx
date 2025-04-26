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
  initialMode = "view",
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
      console.log("Fetched categories:", response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNoteCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_DEVICE_IPV4}/notes/${id}/`
      );
      const note = response.data;
      const categoryIds = note.categories.map((cat: Category) => cat.id); // Extract category IDs
      setNoteCategories(categoryIds);
      console.log("Fetched note categories:", categoryIds);
    } catch (error) {
      console.error("Failed to fetch note categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateNoteCategories = async () => {
    try {
      console.log("damn note categories:", noteCategories);
      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_DEVICE_IPV4}/notes/${id}/update-categories/`,
        { categories: noteCategories }
      );
      console.log("Updated note categories:", response.data);
    } catch (error) {
      console.error("Failed to update note categories:", error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchCategories();
      fetchNoteCategories();
    }
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

  return (
    <View
      className={`${
        isVisible ? "flex" : "hidden"
      } absolute w-full h-full justify-center items-center bg-black/25 z-10 pb-8`}
    >
      <View className="flex flex-col bg-white h-3/4 w-3/4 p-3 rounded-lg">
        <View className="flex flex-row justify-between items-center mb-2">
          <Text className="font-bold text-center">Select Note Categories</Text>
          <TouchableOpacity
            onPress={() => {
              updateNoteCategories();
              setIsVisible(false);
            }}
          >
            <AntDesign name="close" size={24} color="grey" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="black" className="mt-8" />
        ) : (
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
                  style={{
                    backgroundColor: item.color,
                  }}
                >
                  {/* Custom Circle */}
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: isSelected ? "black" : "white",
                      borderWidth: 2,
                      borderColor: "black",
                      marginRight: 10,
                    }}
                  />

                  {/* Category Label */}
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
        )}
      </View>
    </View>
  );
};

export default ManageCategoriesInNote;
