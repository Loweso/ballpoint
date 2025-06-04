import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { DashboardSettings } from "./DashboardSettings";
import HighlightModal from "./HighlightModal";

import { DatePickerModal } from "react-native-paper-dates";
import { format } from "date-fns";
import { images } from "@/constants";

import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedCategories,
  setDateRange,
  clearFilters,
} from "@/slices/filterSlice";
import { setSortType, setSortOrder, clearSort } from "@/slices/sortSlice";
import { setSearchQuery } from "@/slices/searchSlice";
import { RootState } from "@/lib/redux/store";
import { api } from "@/lib/redux/slices/authSlice";

interface Category {
  label: string;
  value: string;
}

const DashboardMenu = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const clearCategories = () => {
    setValue([]);
  };

  const [isFilterMenuVisible, setFilterMenuVisible] = useState(false);
  const [isSortMenuVisible, setSortMenuVisible] = useState(false);
  const [isDashboardSettingsVisible, setIsDashBoardSettingsVisible] =
    useState(false);
  const filterSlideAnim = useRef(new Animated.Value(-200)).current;
  const sortSlideAnim = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleFilterMenu = () => {

    setFilterMenuVisible(!isFilterMenuVisible);
    if (isSortMenuVisible) {
      toggleSortMenu();
    }
    Animated.timing(filterSlideAnim, {
      toValue: isFilterMenuVisible ? -200 : 120,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const toggleSortMenu = () => {
 
    setSortMenuVisible(!isSortMenuVisible);
    if (isFilterMenuVisible) {
      toggleFilterMenu();
    }
    Animated.timing(sortSlideAnim, {
      toValue: isSortMenuVisible ? -200 : 120,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get<Category[]>("/notes/categories/");

      const formattedCategories = response.data.map((category) => ({
        label: category.label,
        value: category.label, // Assign value same as label
      }));

      setCategories(formattedCategories);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const [pressedSortType, setPressedSortType] = useState<string | null>(null);
  const [pressedSortOrder, setPressedSortOrder] = useState<string | null>(null);

  const handleSortTypePress = (button: string) => {
    if (button === pressedSortType) {
      setPressedSortType(null);
    } else {
      setPressedSortType(button);
    }
  };

  const handleSortOrderPress = (button: string) => {
    if (button === pressedSortOrder) {
      setPressedSortOrder(null);
    } else {
      setPressedSortOrder(button);
    }
  };

  const [range, setRange] = React.useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
  });

  const [isDateModalOpen, setisDateModalOpen] = React.useState(false);

  const onDismiss = React.useCallback(() => {
    setisDateModalOpen(false);
  }, [setisDateModalOpen]);

  const clearDateRange = () => {
    setRange({ startDate: undefined, endDate: undefined });
  };

  const onConfirm = React.useCallback(
    ({
      startDate,
      endDate,
    }: {
      startDate: Date | undefined;
      endDate: Date | undefined;
    }) => {
      setisDateModalOpen(false);
      setRange({ startDate, endDate });
    },
    [setisDateModalOpen, setRange]
  );
  const router = useRouter();

  const dispatch = useDispatch();
  const selectedCategories = useSelector(
    (state: RootState) => state.filters.selectedCategories
  );
  const dateRange = useSelector((state: RootState) => state.filters.dateRange);
  const sortType = useSelector((state: RootState) => state.sort.sortType);
  const sortOrder = useSelector((state: RootState) => state.sort.sortOrder);

  const handleApplyFilters = () => {
    dispatch(setSelectedCategories(value ?? []));
    dispatch(
      setDateRange({
        startDate: range.startDate ? range.startDate.toISOString() : null,
        endDate: range.endDate ? range.endDate.toISOString() : null,
      })
    );

  };

  const handleApplySorts = () => {
    dispatch(
      setSortType(sortType === pressedSortType ? null : pressedSortType)
    );
    dispatch(
      setSortOrder(sortOrder === pressedSortOrder ? null : pressedSortOrder)
    );

  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    clearCategories();

  };

  const handleClearSort = () => {
    dispatch(clearSort());
    setPressedSortType(null);
    setPressedSortOrder(null);
  };

  const query = useSelector((state: RootState) => state.search.query);

  return (
    <View className="top-0 flex w-screen bg-primary-white">
      <View className="absolute top-0">
        <View className="flex flex-row items-center justify-between px-4 py-3 w-full h-16 bg-primary-white z-50">
          <View className="flex w-1/3">
            <TouchableOpacity
              className="items-start justify-center bg-transparent w-8"
              onPress={() => {
                setIsDashBoardSettingsVisible(true); // this is for testing, change to DashBoardSettingsVisible
            
              }}
            >
              <Entypo name="dots-three-vertical" size={20} color="black" />
            </TouchableOpacity>
          </View>

          <View className="flex pl-2">
            <Image source={images.ballpointLogo} className="w-32 h-32" />
          </View>

          <View className="flex-1"></View>
          <TouchableOpacity
            onPress={() => {
              router.push("/user");
            }}
          >
            <Ionicons name="person-circle-outline" size={35} />
          </TouchableOpacity>
        </View>
        <View className="flex flex-row items-center justify-between bg-primary-white px-4 py-3 h-20 z-50">
          <View className="flex flex-row w-4/5 h-16 text-lg bg-secondary-accentGreen rounded-xl px-4 gap-3">
            <Feather name="search" size={20} color="gray" className="py-5" />
            <TextInput
              className="flex h-full w-full text-lg bg-transparent rounded-xl pr-8"
              placeholder="Search here..."
              placeholderTextColor="gray"
              value={query}
              onChangeText={(text) => dispatch(setSearchQuery(text))} // Update Redux state
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity
            className="items-start justify-center bg-transparent w-8"
            onPress={toggleFilterMenu}
          >
            <Feather name="filter" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            className="items-start justify-center bg-transparent w-8"
            onPress={toggleSortMenu}
          >
            <Ionicons name="filter" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View
        style={{
          transform: [{ translateY: filterSlideAnim }],
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 6,
        }}
        className="bg-primary-white pb-3 px-6 w-full absolute gap-2 z-20"
      >
        <Text className="text-black font-bold my-3">FILTER BY</Text>
        <Text className="text-black">Category</Text>

        <View className="flex flex-row items-center justify-between w-full h-12 bg-transparent">
          <View className="flex flex-row items-center justify-between w-[87.5%] bg-transparent">
            <DropDownPicker
              open={open}
              value={value}
              items={categories}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setCategories}
              multiple={true}
              min={0}
              max={5}
              showBadgeDot={false}
              placeholder="None chosen"
            />
          </View>

          <TouchableOpacity
            className="items-start justify-center bg-transparent w-8"
            onPress={clearCategories}
          >
            <Entypo name="erase" size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <Text className="text-black mt-3">Date</Text>
        <View className="flex flex-row items-center justify-between w-full h-12 bg-transparent">
          <Text>
            {range.startDate && range.endDate
              ? `${format(
                  new Date(range.startDate),
                  "MMM dd, yyyy"
                )} - ${format(new Date(range.endDate), "MMM dd, yyyy")}`
              : "Select a date range"}
          </Text>

          <View className="flex flex-row items-center gap-3">
            <Pressable
              className="w-36 h-12 flex items-center justify-center bg-secondary-yellow rounded-full"
              onPress={() => setisDateModalOpen(true)}
            >
              <Text className="font-bold">Pick date range</Text>
            </Pressable>

            <TouchableOpacity
              className="items-start justify-center bg-transparent w-8"
              onPress={() => clearDateRange()}
            >
              <Entypo name="erase" size={20} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        <DatePickerModal
          locale="en"
          mode="range"
          visible={isDateModalOpen}
          onDismiss={onDismiss}
          startDate={range.startDate}
          endDate={range.endDate}
          onConfirm={onConfirm}
        />

        <View className="flex flex-col items-center w-full mt-4 gap-3">
          <View className="flex flex-row items-center justify-between w-full gap-3">
            <Pressable
              className={`flex flex-col items-center justify-center w-[47.5%] h-16 rounded-full ${
                value != null ||
                (range.startDate !== undefined && range.endDate !== undefined)
                  ? "bg-tertiary-buttonGreen hover:bg-[#37b16f]"
                  : "bg-gray-400"
              }`}
              onPress={handleApplyFilters}
              disabled={
                value == null &&
                range.startDate === undefined &&
                range.endDate === undefined
              }
            >
              <Text className="text-primary-white font-bold">
                APPLY FILTERS
              </Text>
            </Pressable>
            <Pressable
              className="flex flex-col items-center justify-center w-[47.5%] h-16 rounded-full bg-tertiary-buttonRed"
              onPress={handleClearFilters}
            >
              <Text className="text-primary-white font-bold">
                CLEAR FILTERS
              </Text>
            </Pressable>
          </View>

          <TouchableOpacity
            className="items-start justify-center bg-transparent w-8"
            onPress={toggleFilterMenu}
          >
            <Entypo name="chevron-thin-up" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View
        style={{
          transform: [{ translateY: sortSlideAnim }],
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 6,
        }}
        className="bg-primary-white pb-3 px-6 w-full absolute gap-2 z-20"
      >
        <Text className="text-black font-bold my-3">SORT BY</Text>
        <View className="flex flex-row justify-between w-full">
          <Pressable
            onPress={() => handleSortTypePress("Category")}
            className={`flex flex-col items-center justify-center bg-primary-white h-24 w-1/3 shadow-lg gap-2 ${
              pressedSortType === "Category"
                ? "border-2 bg-gray-100"
                : "shadow-black bg-primary-white"
            }`}
          >
            <MaterialIcons name="category" size={25} color="black" />
            <Text>Category</Text>
          </Pressable>
          <Pressable
            onPress={() => handleSortTypePress("Date")}
            className={`flex flex-col items-center justify-center h-24 w-1/3 shadow-lg gap-2 ${
              pressedSortType === "Date"
                ? "border-2 bg-gray-100"
                : "shadow-black bg-primary-white"
            }`}
          >
            <Entypo name="calendar" size={25} color="black" />
            <Text>Date</Text>
          </Pressable>
          <Pressable
            onPress={() => handleSortTypePress("Title")}
            className={`flex flex-col items-center justify-center bg-primary-white h-24 w-1/3 shadow-lg gap-2 ${
              pressedSortType === "Title"
                ? "border-2 bg-gray-100"
                : "shadow-black bg-primary-white"
            }`}
          >
            <MaterialIcons name="title" size={25} color="black" />
            <Text>Title</Text>
          </Pressable>
        </View>

        <View className="flex flex-row justify-between w-full">
          <Pressable
            onPress={() => handleSortOrderPress("SortAscending")}
            className={`flex flex-row items-center justify-center h-24 w-1/2 gap-4 ${
              pressedSortOrder === "SortAscending"
                ? "border-2 bg-gray-100"
                : "shadow-black bg-primary-white"
            }`}
          >
            <MaterialCommunityIcons
              name="sort-alphabetical-ascending"
              size={25}
              color="black"
            />
            <Text className="font-bold">Sort Ascending</Text>
          </Pressable>
          <Pressable
            onPress={() => handleSortOrderPress("SortDescending")}
            className={`flex flex-row items-center justify-center h-24 w-1/2 gap-4 ${
              pressedSortOrder === "SortDescending"
                ? "border-2 bg-gray-100"
                : "shadow-black bg-primary-white"
            }`}
          >
            <MaterialCommunityIcons
              name="sort-alphabetical-descending"
              size={25}
              color="black"
            />
            <Text className="font-bold">Sort Descending</Text>
          </Pressable>
        </View>

        <View className="flex flex-col items-center w-full gap-3">
          <View className="flex flex-row items-center justify-between w-full gap-3">
            <Pressable
              className={`flex flex-col items-center justify-center w-[42.5%] h-16 rounded-full ${
                pressedSortType && pressedSortOrder
                  ? "bg-tertiary-buttonGreen hover:bg-[#37b16f]"
                  : "bg-gray-400"
              }`}
              onPress={handleApplySorts}
              disabled={!pressedSortType || !pressedSortOrder}
            >
              <Text className="text-primary-white font-bold">APPLY SORT</Text>
            </Pressable>

            <Pressable
              className="flex flex-col items-center justify-center w-[52.5%] h-16 rounded-full bg-tertiary-buttonRed"
              onPress={handleClearSort}
            >
              <Text className="text-primary-white font-bold">
                CLEAR SORT SETTINGS
              </Text>
            </Pressable>
          </View>

          <TouchableOpacity
            className="items-start justify-center bg-transparent w-8"
            onPress={toggleSortMenu}
          >
            <Entypo name="chevron-thin-up" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <DashboardSettings
        isVisible={isDashboardSettingsVisible}
        setIsVisible={setIsDashBoardSettingsVisible}
      />
    </View>
  );
};

export default DashboardMenu;
