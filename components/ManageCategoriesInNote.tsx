import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";

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

// Utility function to check if background color is light or dark
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
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_DEVICE_IPV4}/categories/`
      );
      setCategories(response.data);
      console.log("Fetched categories:", response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchCategories();
    }
  }, [isVisible]);

  const mergedCategories = [
    ...categories.filter((cat) => selectedCategoryIds.includes(cat.id)),
    ...categories.filter((cat) => !selectedCategoryIds.includes(cat.id)),
  ];

  const toggleCategory = (categoryId: number) => {
    if (selectedCategoryIds.includes(categoryId)) {
      setSelectedCategoryIds((prev) => prev.filter((id) => id !== categoryId));
    } else {
      setSelectedCategoryIds((prev) => [...prev, categoryId]);
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
          <TouchableOpacity onPress={() => setIsVisible(false)}>
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
              const isSelected = selectedCategoryIds.includes(item.id);
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
