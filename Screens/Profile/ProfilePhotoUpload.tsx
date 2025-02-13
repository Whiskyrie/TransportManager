import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MediaTypeOptions } from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { handleApiError, api } from "Services/api";
import { User, UploadResponse } from "../../Types/authTypes";

interface ProfilePhotoUploadProps {
  currentPhotoUrl: string | null;
  onPhotoUpdate: (newPhotoUrl: string) => void;
}

export const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  currentPhotoUrl,
  onPhotoUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de permissão para acessar sua galeria de fotos."
      );
      return false;
    }
    return true;
  };

  const handleImagePicker = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.Images, // Permite selecionar fotos e live photos
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  };

  // In the uploadImage function of ProfilePhotoUpload.tsx
  const uploadImage = async (uri: string) => {
    setLoading(true);
    setError(false);

    try {
      // Fetch and validate the image first
      const response = await fetch(uri);
      const blob = await response.blob();

      // Validate file size (5MB limit)
      if (blob.size > 5 * 1024 * 1024) {
        throw new Error("A imagem deve ter menos de 5MB");
      }

      // Validate mime type
      const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validImageTypes.includes(blob.type)) {
        throw new Error(
          "Tipo de arquivo não suportado. Use apenas JPG ou PNG."
        );
      }

      // Create unique filename
      const timestamp = new Date().getTime();
      const fileName = `profile-photo-${timestamp}.${blob.type.split("/")[1]}`;

      // Create FormData
      const formData = new FormData();
      formData.append("file", {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        type: blob.type,
        name: fileName,
      } as any);

      // Add detailed logging
      console.log("Preparando upload:", {
        fileName,
        type: blob.type,
        size: blob.size,
        uri,
      });

      const { data } = await api.uploadProfilePicture(formData);

      if (data?.user?.profilePicture) {
        onPhotoUpdate(data.user.profilePicture);
      } else {
        throw new Error("Resposta inválida do servidor");
      }
    } catch (error: any) {
      console.error("Erro detalhado:", error.response?.data || error);
      setError(true);

      // More user-friendly error messages
      const errorMessage = error.response?.data?.message
        ? error.response.data.message
        : error.message || "Erro ao fazer upload da imagem";

      Alert.alert("Erro no Upload", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!currentPhotoUrl) return;

    Alert.alert(
      "Remover foto",
      "Tem certeza que deseja remover sua foto de perfil?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            setError(false);
            try {
              await api.deleteProfilePicture();
              onPhotoUpdate?.("");
              Alert.alert("Sucesso", "Foto de perfil removida com sucesso!");
            } catch (error) {
              console.error("Delete photo error:", error);
              setError(true);
              Alert.alert("Erro", handleApiError(error));
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.photoContainer, error && styles.photoContainerError]}
        onPress={handleImagePicker}
        onLongPress={currentPhotoUrl ? handleDeletePhoto : undefined}
        activeOpacity={0.7}
      >
        {currentPhotoUrl ? (
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: currentPhotoUrl.startsWith("data:image")
                  ? currentPhotoUrl
                  : `data:image/jpeg;base64,${currentPhotoUrl}`,
              }}
              style={styles.photo}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Feather name="user" size={40} color="#f5f2e5" />
            <View style={styles.overlay}>
              <Feather name="camera" size={20} color="#f5f2e5" />
            </View>
          </View>
        )}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#f5f2e5" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    backgroundColor: "#182727",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.35,
    shadowRadius: 4.84,
    borderWidth: 2,
    borderColor: "#1a2b2b",
  },
  photoContainerError: {
    borderColor: "#ff4444",
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  photo: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#182727",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(24, 39, 39, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfilePhotoUpload;
