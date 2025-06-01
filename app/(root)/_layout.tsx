import { Stack } from "expo-router";
import { ProtectedRoute } from "@/lib/components/ProtectedRoute";

export default function RootLayout() {
  return (
    <ProtectedRoute>
      <Stack>
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="note/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="user" options={{ headerShown: false }} />
      </Stack>
    </ProtectedRoute>
  );
}
