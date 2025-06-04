import { api } from "@/lib/redux/slices/authSlice";
import React, { useState, useEffect, useMemo } from "react";
import { View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CircleButton from "@/components/CircleButton";
import DropDownPicker from "react-native-dropdown-picker";
import { CreateNewNoteModal } from "@/components/CreateNewNoteModal";
import { DashboardSettings } from "@/components/DashboardSettings";
import { SafeAreaView } from "react-native-safe-area-context";
import DashboardMenu from "@/components/DashboardMenu";

import NoteComponent from "@/components/NoteComponent";
import { EventProvider } from "react-native-outside-press";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import striptags from "striptags";
import { useFocusEffect } from "@react-navigation/native";

DropDownPicker.setMode("BADGE");

interface Note {
  noteID: string;
  title: string;
  categories: { label: string; color: string }[];
  notesContent: string;
  date: string;
}

export default function Home() {
  const [isDashboardSettingsVisible, setIsDashboardSettingsVisible] =
    useState(false);
  const [isCreateNewNoteModalVisible, setIsCreateNewNoteModalVisible] =
    useState(false);

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
        const response = await api.get(`/notes`, {
          params: { search: searchQuery }, // Pass the search query as a parameter
        });

        setNotes(response.data); // Update notes with search results
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchSearchResults(); // Fetch filtered notes if searchQuery is not empty
    } else {
      fetchNotes(); // Fetch all notes if searchQuery is empty
    }
  }, [searchQuery]);

  const fetchNotes = async () => {
    try {
      const response = await api.get(`/notes`);
      setNotes(response.data); // Store data in state
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

        <View className="flex flex-col w-full pt-40 px-4">
          <Text className="text-gray-500">Ready to Create?</Text>
          <Text className="my-3 text-5xl font-bold">Your Notes</Text>
          <FlatList
            data={sortedNotes}
            keyExtractor={(item) => item.noteID}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshing={loading}
            onRefresh={() => {
              fetchNotes();
            }}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 20 }}>
                <NoteComponent
                  title={item.title}
                  noteID={item.noteID}
                  categories={item.categories}
                  notesContent={item.notesContent}
                  date={new Date(item.date)}
                  onDelete={(deletedNoteID) => {
                    setNotes((prevNotes) =>
                      prevNotes.filter((n) => n.noteID !== deletedNoteID)
                    );
                  }}
                />
              </View>
            )}
            ListEmptyComponent={
              !loading ? (
                <View className="flex-1 justify-center items-center mt-36">
                  <Text className="text-gray-400 text-2xl text-center">
                    No Notes Yet.{"\n"}Click (+) to start!
                  </Text>
                </View>
              ) : null
            }
          />
        </View>

        <CreateNewNoteModal
          isVisible={isCreateNewNoteModalVisible}
          setIsVisible={setIsCreateNewNoteModalVisible}
        />

        <DashboardSettings
          isVisible={isDashboardSettingsVisible}
          setIsVisible={setIsDashboardSettingsVisible}
        />
      </EventProvider>
    </SafeAreaView>
  );
}
