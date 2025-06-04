// app/index.tsx
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { checkAuthStatus } from "@/lib/redux/slices/authSlice";

export default function Index() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [authState, setAuthState] = useState<string | null>(null);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    const checkOnboarding = async () => {
      const value = await SecureStore.getItemAsync("authState");
      console.log("Auth status:", value);

      if (!isAuthenticated) {
        setAuthState(value);
        switch (value) {
          case "onboarding":
            router.replace("/(auth)/onboardingscreen");
            break;
          case "login":
            router.replace("/(auth)/onboardingscreen");
            break;
          case "signup":
            router.replace("/(auth)/onboardingscreen");
            break;
        }
      }
    };
    checkOnboarding();
  }, []);

  // If user is authenticated, go to home
  if (isAuthenticated) {
    return <Redirect href="/(root)/home" />;
  }

  // If not onboarded, go to onboarding
  if (authState === "onboarding" || authState === null) {
    return <Redirect href="/(auth)/onboardingscreen" />;
  }

  if (authState === "login") {
    return <Redirect href="/(auth)/login" />;
  }

  if (authState === "signup") {
    return <Redirect href="/(auth)/signup" />;
  }
}
