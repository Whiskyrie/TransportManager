import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { api, handleApiError } from "api";

interface DeleteDriverDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  driverId: string;
  driverName?: string;
}

const DeleteDriverDialog: React.FC<DeleteDriverDialogProps> = ({
  visible,
  onClose,
  onConfirm,
  driverId,
  driverName,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await api.deleteDriver(driverId);
      setIsLoading(false);
      onConfirm();
    } catch (error: any) {
      setIsLoading(false);

      // Tratamento específico para erro 500
      if (error.response?.status === 500) {
        Alert.alert(
          "Erro ao excluir motorista",
          "Não é possível excluir este motorista pois ele possui rotas associadas. Remova primeiro as rotas associadas.",
          [{ text: "OK", onPress: onClose }]
        );
        return;
      }

      // Outros erros
      Alert.alert("Erro ao excluir motorista", handleApiError(error), [
        { text: "OK" },
      ]);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.dialog}>
          <View style={styles.header}>
            <MaterialIcons name="warning" size={32} color="#dc3545" />
            <Text style={styles.title}>Confirmar exclusão</Text>
          </View>

          <Text style={styles.message}>
            {driverName
              ? `Tem certeza que deseja excluir o motorista ${driverName}?`
              : "Tem certeza que deseja excluir este motorista?"}
          </Text>

          <Text style={styles.warning}>Esta ação não poderá ser desfeita.</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <MaterialIcons
                    name="delete"
                    size={20}
                    color="white"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Excluir</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dialog: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "85%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#dc3545",
  },
  message: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
    lineHeight: 22,
  },
  warning: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  buttonIcon: {
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#666",
  },
  confirmButton: {
    backgroundColor: "#dc3545",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "500",
    fontSize: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
});

export default DeleteDriverDialog;
