"use client";

import { useState, useRef } from "react";
import * as SecureStore from "expo-secure-store";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  type ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Swiper from "react-native-swiper";
import "nativewind";
import { router } from "expo-router";
import { Link } from "expo-router";

const { width } = Dimensions.get("window");

// Define the screens enum for type safety
enum ScreenType {
  WELCOME = "welcome",
  FEATURES = "features",
  FINAL = "final",
}

const OnboardingScreen = () => {
  // State to track the current screen
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(
    ScreenType.WELCOME
  );
  const swiperRef = useRef<Swiper>(null);

  const finishOnboardingLogin = async () => {
    await SecureStore.setItemAsync("authState", "login");
    router.replace("/(auth)/login"); // or home if they're already authenticated
  };
  const finishOnboardingSignup = async () => {
    await SecureStore.setItemAsync("authState", "signup");
    router.replace("/(auth)/signup"); // or home if they're already authenticated
  };

  // Feature data for the swiper
  const features = [
    {
      title: "Manual Note Creation",
      description: "Write and format your own notes",
      image: require("@/assets/images/feature-manual.png"),
      width: 200,
      height: 200,
      marginTop: 100,
    },
    {
      title: "AI-Powered Extraction",
      description: "Upload images or pdfs and let AI extract key information",
      image: require("@/assets/images/feature-extraction.png"),
      width: 350,
      height: 200,
      marginTop: 100,
    },
    {
      title: "Organize Efficiently",
      description: "Add categories, filter, and search notes with ease",
      image: require("@/assets/images/feature-organize.png"),
      width: 250,
      height: 200,
      marginTop: 100,
    },
    {
      title: "Enhance existing notes with AI",
      description: "",
      image: require("@/assets/images/feature-ai.png"),
      width: 200,
      height: 200,
      hasExtraContent: true,
      marginTop: 0,
    },
  ];

  // Navigation handlers
  const handleProceed = () => {
    setCurrentScreen(ScreenType.FEATURES);
  };

  const handleFinishSwiper = () => {
    setCurrentScreen(ScreenType.FINAL);
  };

  const handleIndexChanged = (index: number) => {
    if (index === features.length - 1) {
      setTimeout(() => {
        handleFinishSwiper();
      }, 2000);
    }
  };

  const [swiperIndex, setSwiperIndex] = useState(0);

  const renderFeatureScreen = (
    title: string,
    description: string,
    image: ImageSourcePropType,
    hasExtraContent?: boolean,
    width: string | number = "100%",
    height: string | number = "auto",
    marginTop: number = 0
  ) => {
    const imageStyle = {
      width: typeof width === "number" ? width : parseFloat(width),
      height: typeof height === "number" ? height : parseFloat(height),
      marginTop: marginTop,
    };

    return (
      <SafeAreaView className="flex-1 bg-white">
        <Text className="text-black text-2xl font-semibold m-8">
          What You Can Do
        </Text>

        <View className="flex-1 items-center">
          <View className="items-center justify-center">
            <Image source={image} style={imageStyle} resizeMode="cover" />
          </View>

          <Text className="text-xl font-semibold mb-2 text-center">
            {title}
          </Text>

          <Text className="text-base text-center text-gray-600 px-5">
            {description}
          </Text>

          {hasExtraContent && (
            <View className="mt-2 w-full">
              <View className="h-32 w-80 bg-tertiary-cardBg p-4 rounded-r-xl mb-2 justify-start items-center flex-row">
                <Image
                  source={require("@/assets/images/feature-autocomplete.png")}
                  className="w-44 h-24"
                  resizeMode="cover"
                />
                <Text className="font-medium">Autocomplete</Text>
              </View>
              <View className="h-32 w-80 bg-tertiary-cardBg p-2 rounded-l-xl mb-2 justify-end items-center self-end flex-row">
                <Text className="font-medium">Summarize</Text>
                <Image
                  source={require("@/assets/images/feature-summarize.png")}
                  className="w-48 h-24"
                  resizeMode="cover"
                />
              </View>
              <View className="h-32 w-80 bg-tertiary-cardBg p-2 rounded-r-xl mb-2 justify-start items-center flex-row">
                <Image
                  source={require("@/assets/images/feature-organizeAI.png")}
                  className="w-48 h-24"
                  resizeMode="cover"
                />
                <Text className="font-medium">Organize</Text>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  };

  const renderFeaturesSwiper = () => {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Swiper
          ref={swiperRef}
          showsButtons={false}
          loop={false}
          dot={<View className="bg-gray-300 w-2 h-2 rounded-full mx-1" />}
          activeDot={<View className="bg-gray-800 w-2 h-2 rounded-full mx-1" />}
          paginationStyle={{ bottom: 20 }}
          style={{ height: "100%" }}
          onIndexChanged={(index) => setSwiperIndex(index)}
        >
          {features.map((feature, index) => (
            <View key={index} className="flex-1 min-h-screen">
              {renderFeatureScreen(
                feature.title,
                feature.description,
                feature.image,
                feature.hasExtraContent,
                feature.width,
                feature.height,
                feature.marginTop
              )}
            </View>
          ))}
        </Swiper>

        {swiperIndex === features.length - 1 && (
          <TouchableOpacity
            className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-tertiary-buttonGreen py-3 px-6 rounded-lg"
            onPress={() => setCurrentScreen(ScreenType.FINAL)}
          >
            <Text className="text-white font-semibold">Finish</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  };

  // Render the welcome screen
  const renderWelcomeScreen = () => {
    return (
      <SafeAreaView className="flex-1 bg-white px-5">
        <View className="flex-1 justify-center items-center">
          <Text className="text-2xl mb-2">Welcome to</Text>
          <Image
            source={require("@/assets/images/ballpointLogo.png")}
            className="w-72 h-32 overflow-hidden"
            resizeMode="cover"
          />
          <Text className="text-base mb-2 italic text-tertiary-textGreen">
            From one point to another
          </Text>
          <Text className="text-base text-center text-gray-600 max-w-[100%]">
            Note taking application with Artificial Intelligence
          </Text>
        </View>

        <TouchableOpacity
          className="py-4 rounded-lg mb-8 bg-tertiary-buttonGreen"
          onPress={handleProceed}
        >
          <Text className="text-center text-white font-semibold">Proceed</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  // Render the final screen
  const renderFinalScreen = () => {
    return (
      <SafeAreaView className="flex-1 bg-white px-5">
        <View className="flex-1 justify-center items-center">
          <Image
            source={require("@/assets/images/ballpointLogo.png")}
            className="w-72 h-32 overflow-hidden"
            resizeMode="cover"
          />
          <Text className="text-2xl font-semibold">Ready to Take Notes?</Text>
        </View>

        <View className="mb-8">
          <TouchableOpacity
            className="bg-tertiary-buttonGreen py-4 rounded-lg mb-2"
            onPress={finishOnboardingLogin}
          >
            <Text className="text-center text-white font-semibold">Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white py-4 rounded-lg border-2 border-tertiary-buttonGreen"
            onPress={finishOnboardingSignup}
          >
            <Text className="text-center font-senbomibold">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  // Render the current screen based on state
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case ScreenType.WELCOME:
        return renderWelcomeScreen();
      case ScreenType.FEATURES:
        return renderFeaturesSwiper();
      case ScreenType.FINAL:
        return renderFinalScreen();
      default:
        return renderWelcomeScreen();
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      {renderCurrentScreen()}
    </>
  );
};

export default OnboardingScreen;
