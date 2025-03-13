import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
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

  const content = <Ionicons name="add-outline" size={50} color="black" />;

  return (
    <SafeAreaView className="flex w-screen h-full bg-primary-white">
      <EventProvider>
        <CircleButton
          className="absolute bottom-10 right-8"
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

        <DashboardSettings
          isVisible={isDashboardSettingsVisible}
          setIsVisible={setIsDashBoardSettingsVisible}
        />
      </EventProvider>
    </SafeAreaView>
  );
}
