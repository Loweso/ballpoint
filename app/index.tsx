import React, { useRef, useState } from "react";
import {
  Animated,
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import CircleButton from "@/components/CircleButton";
import DropDownPicker from "react-native-dropdown-picker";
import { CreateNewNoteModal } from "@/components/CreateNewNoteModal";
import { SafeAreaView } from "react-native-safe-area-context";

DropDownPicker.setMode("BADGE");

export default function Index() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Category 1", value: "category1" },
    { label: "Category 2", value: "category2" },
    { label: "Category 3", value: "category3" },
  ]);

  const [isFilterMenuVisible, setFilterMenuVisible] = useState(false);
  const [isSortMenuVisible, setSortMenuVisible] = useState(false);
  const filterSlideAnim = useRef(new Animated.Value(-200)).current;
  const sortSlideAnim = useRef(new Animated.Value(-200)).current;

  const toggleFilterMenu = () => {
    console.log("Filter Button Pressed");
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
    console.log("Sort Button Pressed");
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

  const [range, setRange] = React.useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
  });

  const [isModalOpen, setisModalOpen] = React.useState(false);

  const onDismiss = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = React.useCallback(
    ({
      startDate,
      endDate,
    }: {
      startDate: Date | undefined;
      endDate: Date | undefined;
    }) => {
      setOpen(false);
      setRange({ startDate, endDate });
    },
    [setOpen, setRange]
  );

  const [isModalVisible, setIsModalVisible] = useState(false);

  const content = <Ionicons name="add-outline" size={50} color="black" />;
  return (
    <SafeAreaView className="flex w-screen h-full">
      <CircleButton content={content} onPress={() => setIsModalVisible(true)} />
      <View className="flex flex-row items-center justify-between px-4 py-3 w-full h-16 bg-primary-white z-20">
        <View className="flex w-1/3">
          <TouchableOpacity
            className="items-start justify-center bg-transparent w-8"
            onPress={() => console.log("Menu Button Pressed")}
          >
            <Entypo name="dots-three-vertical" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-center">
          <Image
            source={require("../assets/images/ballpointLogo.png")}
            className="w-32 h-32"
          />
        </View>

        <View className="flex-1" />
      </View>
      <View className="flex flex-row items-center justify-between bg-primary-white px-4 py-3 h-20 z-20">
        <View className="flex flex-row w-4/5 h-16 text-lg bg-secondary-accentGreen rounded-xl px-4 gap-3">
          <Feather name="search" size={20} color="gray" className="py-5" />
          <TextInput
            className="flex h-full w-full text-lg bg-transparent rounded-xl pr-8"
            placeholder="Search here..."
            placeholderTextColor="gray"
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

      <Animated.View
        style={{
          transform: [{ translateY: filterSlideAnim }],
        }}
        className="bg-primary-white pb-3 px-6 w-full absolute gap-2 z-10"
      >
        <Text className="text-black font-bold my-3">FILTER BY</Text>
        <Text className="text-black">Category</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          multiple={true}
          min={0}
          max={5}
          showBadgeDot={false}
          placeholder="None chosen"
        />

        <Text className="text-black mt-3">Date</Text>

        <View className="flex flex-col items-center w-full">
          <Pressable
            className="flex flex-col items-center justify-center w-1/2 h-16 bg-tertiary-buttonGreen rounded-full hover:bg-[#37b16f]"
            onPress={() => console.log("Apply Filters Pressed")}
          >
            <Text className="text-primary-white font-bold">APPLY FILTERS</Text>
          </Pressable>
        </View>
      </Animated.View>

      <Animated.View
        style={{
          transform: [{ translateY: sortSlideAnim }],
        }}
        className="bg-primary-white pb-3 px-6 w-full absolute gap-2 z-10"
      >
        <Text className="text-black font-bold my-3">SORT BY</Text>
        <View className="flex flex-row justify-between w-full">
          <Pressable className="flex flex-col items-center justify-center bg-primary-white h-24 w-24 shadow-lg shadow-black gap-2">
            <MaterialIcons name="category" size={25} color="black" />
            <Text>Category</Text>
          </Pressable>
          <Pressable className="flex flex-col items-center justify-center bg-primary-white h-24 w-24 shadow-lg shadow-black gap-2">
            <Entypo name="calendar" size={25} color="black" />
            <Text>Date</Text>
          </Pressable>
          <Pressable className="flex flex-col items-center justify-center bg-primary-white h-24 w-24 shadow-lg shadow-black gap-2">
            <MaterialIcons name="title" size={25} color="black" />
            <Text>Title</Text>
          </Pressable>
        </View>

        <View className="flex flex-row justify-between w-full">
          <Pressable className="flex flex-row items-center justify-center bg-primary-white h-24 w-1/2 gap-4">
            <MaterialCommunityIcons
              name="sort-alphabetical-ascending"
              size={25}
              color="black"
            />
            <Text className="font-bold">Sort Ascending</Text>
          </Pressable>
          <Pressable className="flex flex-row items-center justify-center bg-primary-white h-24 w-1/2 gap-4">
            <MaterialCommunityIcons
              name="sort-alphabetical-descending"
              size={25}
              color="black"
            />
            <Text className="font-bold">Sort Descending</Text>
          </Pressable>
        </View>

        <View className="flex flex-col items-center w-full">
          <Pressable
            className="flex flex-col items-center justify-center w-1/2 h-16 bg-tertiary-buttonGreen rounded-full hover:bg-[#37b16f]"
            onPress={() => console.log("Apply Filters Pressed")}
          >
            <Text className="text-primary-white font-bold">APPLY SORT</Text>
          </Pressable>
        </View>
      </Animated.View>

      <Text>Edit app/index.tsx to edit this screen.</Text>
      <CreateNewNoteModal
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
      />
    </SafeAreaView>
  );
}
