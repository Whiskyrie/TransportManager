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
import { api, handleApiError } from "Services/api";

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
          <Text style={styles.title}>Confirmar exclusão</Text>
          <Text style={styles.message}>
            Tem certeza que deseja excluir esta rota?
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
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
    backgroundColor: "#1a2b2b",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1.25,
    shadowRadius: 4.85,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#f5f2e5",
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#f5f2e5",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  confirmButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DeleteDriverDialog;
