import * as DocumentPicker from "expo-document-picker";

export type File = {
  name: string;
  size: number;
  uri: string;
  mimeType?: string;
};

export const pickDocument = async (): Promise<File | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "audio/*"],
    });

    if (result.canceled) {
  
      alert("No file was selected.");
      return null;
    } else if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const file: File = {
        name: asset.name ?? "Unnamed file",
        size: asset.size ?? 0,
        uri: asset.uri,
        mimeType: asset.mimeType ?? undefined,
      };

      if (
        asset.mimeType &&
        !asset.mimeType.startsWith("image/") &&
        !asset.mimeType.startsWith("audio/")
      ) {
        alert(
          "Invalid file type selected. Please select an image or audio file."
        );
        return null;
      }


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
