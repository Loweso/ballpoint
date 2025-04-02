import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../lib/redux/store";
import { ProtectedRoute } from "@/lib/components/ProtectedRoute";
import "./global.css";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ProtectedRoute>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(root)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </ProtectedRoute>
    </Provider>
  );
}
