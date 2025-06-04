import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { checkAuthStatus } from "@/lib/redux/slices/authSlice";

export default function Index() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [authState, setAuthState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await dispatch(checkAuthStatus());
      const value = await SecureStore.getItemAsync("authState");
      setAuthState(value);
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return null; // or a splash/loading component

  if (isAuthenticated) {
    return <Redirect href="/(root)/home" />;
  }

  switch (authState) {
    case "login":
      return <Redirect href="/(auth)/login" />;
    case "signup":
      return <Redirect href="/(auth)/signup" />;
    case "onboarding":
    default:
      return <Redirect href="/(auth)/onboardingscreen" />;
  }
}
