import axios from "axios";
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CircleButton from "@/components/CircleButton";
import DropDownPicker from "react-native-dropdown-picker";
import { CreateNewNoteModal } from "@/components/CreateNewNoteModal";
import { DashboardSettings } from "@/components/DashboardSettings";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardMenu from "@/components/DashboardMenu";

//bet
import NamingModal from "@/components/NamingModal"; // Import NamingModal
import PolishMenuModal from "@/components/PolishMenuModal"; // Import PolishMenuModal
import QueryMenuModal from "@/components/QueryMenuModal"; // Import QueryMenuModal

import NoteComponent from "@/components/NoteComponent";
import { EventProvider } from "react-native-outside-press";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useMemo } from "react";

DropDownPicker.setMode("BADGE");

interface Note {
  noteID: string;
  title: string;
  categories: { label: string; color: string }[];
  notesContent: string;
  date: string;
}

export default function Home() {
  const [isDashboardSettingsVisible, setIsDashBoardSettingsVisible] =
    useState(false);
  const [isCreateNewNoteModalVisible, setIsCreateNewNoteModalVisible] =
    useState(false);

  // States for the modal visibility
  const [isNamingModalVisible, setIsNamingModalVisible] = useState(false);
  const [isPolishMenuModalVisible, setIsPolishMenuModalVisible] =
    useState(false);
  const [isQueryMenuModalVisible, setIsQueryMenuModalVisible] = useState(false);

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true); // Loading state

  const content = <Ionicons name="add-outline" size={50} color="black" />;
  const { selectedCategories, dateRange } = useSelector(
    (state: RootState) => state.filters
  );
  const { sortType, sortOrder } = useSelector((state: RootState) => state.sort);

  const filteredNotes = useMemo(() => {
    return notes.filter((item) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        item.categories.some((cat) => selectedCategories.includes(cat.label));

      const dateMatch =
        (!dateRange.startDate ||
          new Date(item.date) >= new Date(dateRange.startDate)) &&
        (!dateRange.endDate ||
          new Date(item.date) <= new Date(dateRange.endDate));

      return categoryMatch && dateMatch;
    });
  }, [
    notes,
    dateRange,
    selectedCategories,
    useSelector((state: RootState) => state.filters),
  ]);

  const sortedNotes = useMemo(() => {
    const isAscending = sortOrder === "SortAscending";

    return [...filteredNotes].sort((a, b) => {
      if (sortType === "Date") {
        return isAscending
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }

      if (sortType === "Category") {
        const categoryA = a.categories
          .map((cat) => cat.label)
          .sort()
          .join(",");
        const categoryB = b.categories
          .map((cat) => cat.label)
          .sort()
          .join(",");

        return isAscending
          ? categoryA.localeCompare(categoryB)
          : categoryB.localeCompare(categoryA);
      }

      if (sortType === "Title") {
        return isAscending
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }

      return 0;
    });
  }, [
    filteredNotes,
    sortType,
    sortOrder,
    useSelector((state: RootState) => state.sort),
  ]);

  const searchQuery = useSelector((state: RootState) => state.search.query);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_DEVICE_IPV4}/notes/`,
          {
            params: { search: searchQuery }, // Pass the search query as a parameter
          }
        );
        setNotes(response.data); // Update notes with search results
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchSearchResults(); // Fetch filtered notes if searchQuery is not empty
    } else {
      fetchNotes(); // Fetch all notes if searchQuery is empty
    }

    fetchSearchResults();
  }, [searchQuery]);

  const fetchNotes = async () => {
    try {
      const response = await axios.get<Note[]>(
        `${process.env.EXPO_PUBLIC_DEVICE_IPV4}/notes`
      );
      setNotes(response.data); // Store data in state
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex w-screen h-full bg-primary-white pb-20">
      <EventProvider>
        <CircleButton
          className="absolute -bottom-10 right-8"
          content={content}
          onPress={() => setIsCreateNewNoteModalVisible(true)}
        />

        <DashboardMenu />

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
          <FlatList
            data={sortedNotes}
            keyExtractor={(item) => item.noteID}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 20 }}>
                <NoteComponent
                  title={item.title}
                  noteID={item.noteID}
                  categories={item.categories}
                  notesContent={item.notesContent}
                  date={new Date(item.date)}
                />
              </View>
            )}
          />
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

        <DashboardSettings
          isVisible={isDashboardSettingsVisible}
          setIsVisible={setIsDashBoardSettingsVisible}
        />
      </EventProvider>
    </SafeAreaView>
  );
}
