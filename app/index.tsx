import React, { useRef, useState } from "react";
import {
  Animated,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
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

//bet
import NamingModal from "@/components/NamingModal"; // Import NamingModal
import PolishMenuModal from "@/components/PolishMenuModal"; // Import PolishMenuModal
import QueryMenuModal from "@/components/QueryMenuModal"; // Import QueryMenuModal

import { DatePickerModal } from "react-native-paper-dates";
import { format } from "date-fns";
import NoteComponent from "@/components/NoteComponent";

DropDownPicker.setMode("BADGE");

const noteData = [
  {
    title: "Note 1",
    categories: [
      { label: "CMSC 128", color: "bg-secondary-yellow" },
      { label: "Prototyping", color: "bg-tertiary-buttonGreen/[0.5]" },
    ],
    notesContent:
      "(This is a test for very long content.) Component-Level Design defines the data structures, algorithms, interface characteristics, and communication mechanisms allocated to each software component. It can be used to review for correctness and consistency with other components. A component is a modular",
    date: new Date("2024-12-15"),
  },
  {
    title: "Long Note Title Test",
    categories: [
      { label: "Design", color: "bg-tertiary-buttonRed/[0.5]" },
      { label: "CMSC 101", color: "bg-tertiary-buttonBlue" },
    ],
    notesContent:
      "This is the content of note 2. It contains details about another topic.",
    date: new Date("2025-01-24"),
  },
];

export default function Index() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Category 1", value: "category1" },
    { label: "Category 2", value: "category2" },
    { label: "Category 3", value: "category3" },
  ]);

  const clearCategories = () => {
    setValue(null);
  };

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

  const [isCreateNewNoteModalVisible, setIsCreateNewNoteModalVisible] =
    useState(false);

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

  // States for the modal visibility
  const [isNamingModalVisible, setIsNamingModalVisible] = useState(false);
  const [isPolishMenuModalVisible, setIsPolishMenuModalVisible] =
    useState(false);
  const [isQueryMenuModalVisible, setIsQueryMenuModalVisible] = useState(false);

  const content = <Ionicons name="add-outline" size={50} color="black" />;
  return (
    <SafeAreaView className="flex w-screen h-full bg-primary-white">
      <CircleButton
        content={content}
        onPress={() => setIsCreateNewNoteModalVisible(true)}
      />
      <View className="absolute top-0">
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
      </View>

      <Animated.View
        style={{
          transform: [{ translateY: filterSlideAnim }],
        }}
        className="bg-primary-white pb-3 px-6 w-full absolute gap-2 z-10"
      >
        <Text className="text-black font-bold my-3">FILTER BY</Text>
        <Text className="text-black">Category</Text>

        <View className="flex flex-row items-center justify-between w-full h-12 bg-transparent">
          <View className="flex flex-row items-center justify-between w-[87.5%] bg-transparent">
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
          <Pressable
            className={`flex flex-col items-center justify-center w-1/2 h-16 rounded-full ${
              value != null ||
              (range.startDate !== undefined && range.endDate !== undefined)
                ? "bg-tertiary-buttonGreen hover:bg-[#37b16f]"
                : "bg-gray-400"
            }`}
            onPress={() => console.log(value, "date range here")}
            disabled={
              value == null &&
              range.startDate === undefined &&
              range.endDate === undefined
            }
          >
            <Text className="text-primary-white font-bold">APPLY FILTERS</Text>
          </Pressable>

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
        }}
        className="bg-primary-white pb-3 px-6 w-full absolute gap-2 z-10"
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
          <Pressable
            className={`flex flex-col items-center justify-center w-1/2 h-16 rounded-full ${
              pressedSortType && pressedSortOrder
                ? "bg-tertiary-buttonGreen hover:bg-[#37b16f]"
                : "bg-gray-400"
            }`}
            onPress={() => console.log(pressedSortType, pressedSortOrder)}
            disabled={!pressedSortType || !pressedSortOrder}
          >
            <Text className="text-primary-white font-bold">APPLY SORT</Text>
          </Pressable>

          <TouchableOpacity
            className="items-start justify-center bg-transparent w-8"
            onPress={toggleSortMenu}
          >
            <Entypo name="chevron-thin-up" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </Animated.View>
      <View className="flex flex-col w-full pt-32 px-4">
        {/* Buttons to Trigger Modals */}
        <View className="flex-row justify-around py-4">
          <TouchableOpacity
            onPress={() => setIsNamingModalVisible(true)}
            className="bg-yellow p-3 rounded-full shadow-md"
          >
            <Text>Open Naming Modal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsPolishMenuModalVisible(true)}
            className="bg-yellow p-3 rounded-full shadow-md"
          >
            <Text>Open Polish Menu Modal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsQueryMenuModalVisible(true)}
            className="bg-yellow p-3 rounded-full shadow-md"
          >
            <Text>Open Query Menu Modal</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-gray-500">Ready to Create?</Text>
        <Text className="my-3 text-5xl font-bold">Your Notes</Text>
        <ScrollView>
          {noteData.map((note, index) => (
            <View key={index} style={{ marginBottom: 20 }}>
              <NoteComponent
                title={note.title}
                categories={note.categories}
                notesContent={note.notesContent}
                date={note.date}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Modals */}
      <NamingModal
        visible={isNamingModalVisible}
        onClose={() => setIsNamingModalVisible(false)}
        onCancel={() => setIsNamingModalVisible(false)}
        onProceed={() => {
          console.log("Naming Modal Proceeded");
          setIsNamingModalVisible(false);
        }}
      />
      <PolishMenuModal
        visible={isPolishMenuModalVisible}
        onClose={() => setIsPolishMenuModalVisible(false)}
      />

      <QueryMenuModal
        visible={isQueryMenuModalVisible}
        onClose={() => setIsQueryMenuModalVisible(false)}
        onProcessQuery={() => {
          console.log("Query Process");
          setIsPolishMenuModalVisible(false);
        }}
        onCompleteHighlightedText={() => {
          console.log("Complete Highlighted Text");
          setIsPolishMenuModalVisible(false);
        }}
      />

      <CreateNewNoteModal
        isVisible={isCreateNewNoteModalVisible}
        setIsVisible={setIsCreateNewNoteModalVisible}
      />
    </SafeAreaView>
  );
}
