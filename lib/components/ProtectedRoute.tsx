import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import {
  refreshToken,
  checkAuthStatus,
  clearAuthTokens,
  logoutUser,
} from "@/lib/redux/slices/authSlice";
import { router, useSegments, useRootNavigationState } from "expo-router";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  // Check auth status on mount
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  useEffect(() => {
    if (!navigationState?.key) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated and trying to access protected route
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      console.log(isAuthenticated, inAuthGroup);
      // Redirect to home if authenticated and trying to access auth routes
      router.replace("/(root)/home");
    }
  }, [isAuthenticated, segments, navigationState?.key]);

  // Set up automatic token refresh
  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshInterval = setInterval(async () => {
      try {
        await dispatch(refreshToken()).unwrap();
      } catch (error) {
        console.error("Token refresh failed:", error);
        clearInterval(refreshInterval);

        await dispatch(logoutUser());

        // Navigate to login
        router.replace("/(auth)/login");
      }
    }, 60 * 1000); // Set to 30 seconds for testing

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated, dispatch, segments]);

  // Show loading state while checking authentication
  if (loading) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}
