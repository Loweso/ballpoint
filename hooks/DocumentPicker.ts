import * as DocumentPicker from "expo-document-picker";
import { File } from "@/app/note";

export const pickDocument = async (): Promise<File | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
    });

    if (result.canceled) {
      console.log("User canceled the document picker");
      alert("No file was selected.");
      return null; // Explicitly return null if the picker is canceled
    } else if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const file: File = {
        name: asset.name ?? "Unnamed file",
        size: asset.size ?? 0,
        uri: asset.uri,
      };

      console.log("Selected file:", file);
      alert(`Name: ${file.name}\nSize: ${file.size} bytes\nURI: ${file.uri}`);
      return file;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error picking document:", error);
    alert("Something went wrong while picking the document.");
    return null;
  }
};
