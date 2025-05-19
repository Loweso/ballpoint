import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { pickDocument } from "@/hooks/DocumentPicker";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  logoutUser,
  updateUsername,
  updateProfilePicture,
} from "@/lib/redux/slices/authSlice";

import { ConfirmationModal } from "@/components/ConfirmationModal";

export default function User() {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const router = useRouter();

  const { user } = useAppSelector((state) => state.auth);
  const [editedUsername, setEditedUsername] = useState(user?.username ?? "");

  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);

  const dispatch = useAppDispatch();

  const handleUsernameChange = (text: string) => {
    setEditedUsername(text);
  };

  const handleSaveUsername = async () => {
    try {
      const updatedUser = await dispatch(
        updateUsername({ username: editedUsername })
      ).unwrap();

      setEditedUsername(updatedUser.username);
    } catch (err) {
      console.error("Error updating username:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const pickImage = async () => {
    console.log("Picking image through document picker...");

    const file = await pickDocument();
    if (!file) return;

    const isImage = file.mimeType?.startsWith("image");

    if (!isImage) {
      Alert.alert("Unsupported File", "Please select a valid image file.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", {
      name: file.name,
      uri: file.uri,
      type: file.mimeType || "image/jpeg",
    });

    try {
      const response = await dispatch(
        updateProfilePicture({ photo: file })
      ).unwrap();

      if (response?.profile_picture) {
        dispatch(updateProfilePicture(response.profile_picture));
        console.log(
          "Profile picture updated successfully:",
          response.profile_picture
        );
      } else {
        console.error("Error: No photo in response", response);
      }
    } catch (err) {
      console.error("Failed to upload profile picture:", err);
      Alert.alert("Error", "Upload failed. Please try again.");
    }
  };

  return (
    <SafeAreaView className="flex w-screen h-full bg-primary-white">
      <View className="flex min-h-screen bg-gray-200">
        <View className="flex bg-secondary-accentGreen h-[240px] z-50">
          <TouchableOpacity
            className="bg-transparent w-16 p-4"
            onPress={() => router.push("/home")}
          >
            <Ionicons name="arrow-back-outline" size={35} color="black" />
          </TouchableOpacity>

          <View className="flex-row items-center justify-baseline pt-8 pr-10">
            {user?.profile_picture ? (
              <Image
                source={{ uri: user.profile_picture }}
                className="rounded-full w-[115px] h-[115px] mx-6 border"
              />
            ) : (
              <Ionicons
                name="person-circle-outline"
                className="px-4"
                size={130}
              />
            )}

            <TouchableOpacity
              className="absolute left-28 bottom-4 bg-transparent w-16"
              onPress={() => {
                pickImage();
                console.log("User Profile Picture Change");
              }}
            >
              <Ionicons
                name="camera-reverse"
                className="absolute bottom-[5px] right-[21px] z-20"
                size={25}
                color="black"
              />
              <Ionicons
                name="ellipse-outline"
                className="absolute bottom-[-5px] z-20"
                size={45}
                color="black"
              />
              <Ionicons
                name="ellipse"
                className="absolute bottom-[-5px] z-10"
                size={45}
                color="#f9f9f9"
              />
            </TouchableOpacity>

            <Text
              className="flex-1 text-4xl"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {editedUsername || user?.username || "Guest"}
            </Text>
          </View>
        </View>

        <View className="flex bg-primary-white h-[270px] items-left">
          <View className="pt-6 pl-8">
            <Text className="text-xl text-tertiary-buttonGreen">
              Profile Info
            </Text>
            <TouchableOpacity
              className="pt-4 pr-16"
              onPress={() => setIsEditing(true)}
            >
              {isEditing ? (
                <TextInput
                  value={editedUsername}
                  onChangeText={handleUsernameChange}
                  onBlur={() => {
                    setIsEditing(false);
                    handleSaveUsername();
                  }}
                  autoFocus
                  className="text-2xl border-b border-gray-200"
                />
              ) : (
                <>
                  <Text className="text-2xl">{user?.username ?? "Guest"}</Text>
                  <Text className="text-tertiary-textGray">
                    Tap to change username
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <View className="pt-4">
              <Text className="text-2xl">
                {user?.date_joined
                  ? new Date(user.date_joined).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "MM/DD/YYYY"}
              </Text>
              <Text className="text-tertiary-textGray">Date Joined</Text>
            </View>

            <View className="pt-4">
              <Text className="text-2xl underline">{user?.email ?? "N/A"}</Text>
              <Text className="text-tertiary-textGray">Email</Text>
            </View>
          </View>
        </View>

        <View className="flex bg-primary-white h-[50px] mt-10 items-center justify-center">
          <TouchableOpacity
            onPress={() => {
              setIsConfirmationVisible(true);
            }}
          >
            <Text className="text-xl text-tertiary-textRed">Log out</Text>
          </TouchableOpacity>
        </View>

        <ConfirmationModal
          isVisible={isConfirmationVisible}
          setIsVisible={setIsConfirmationVisible}
          label="Log out of your account?"
          confirmText="Log out"
          cancelText="Cancel"
          classnameConfirm="bg-tertiary-buttonRed"
          classnameCancel="bg-secondary-buttonGrey"
          onConfirm={() => {
            handleLogout();
            setIsConfirmationVisible(false);
            router.push("/(auth)/login");
          }}
        />
      </View>
    </SafeAreaView>
  );
}
