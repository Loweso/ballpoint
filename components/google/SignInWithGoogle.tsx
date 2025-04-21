import * as React from "react";
import { TouchableOpacity, Text, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { images } from "@/constants";
import { useAppDispatch } from "@/lib/redux/hooks"; // import dispatch
import { googleLogin } from "@/lib/redux/slices/authSlice"; // import your auth slice
import { router } from "expo-router"; // for redirect
import * as Google from "expo-auth-session/providers/google"; // for Google Auth

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
  const dispatch = useAppDispatch();

  // Initialize the Google auth request
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  });

  const authenticateWithBackend = async (idToken: string) => {
    try {
      // Dispatch the googleLogin thunk to handle the logic
      const res = await dispatch(googleLogin(idToken)).unwrap();

      console.log(res.data);
      router.replace("/(root)/home");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
    }
  };

  React.useEffect(() => {
    console.log("Client ID:", process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID);

    // If Google login is successful
    if (response?.type === "success" && response.params?.id_token) {
      authenticateWithBackend(response.params.id_token);
    }
  }, [response]);

  return (
    <TouchableOpacity
      className="p-4 flex-row justify-center items-center"
      disabled={!request}
      onPress={() => promptAsync()}
    >
      <Image
        source={images.googleLogo}
        className="w-10 h-10"
        resizeMode="contain"
      />
      <Text className="text-tertiary-buttonGreen m-2">
        Log in with your Google Account
      </Text>
    </TouchableOpacity>
  );
}
