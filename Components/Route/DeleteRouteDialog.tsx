import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Route } from "../../Types/routeTypes";
import { Vehicles } from "../../Types/vehicleTypes";
import { api } from "Services/api";

interface DeleteRouteDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (route: Route) => Promise<void>;
  route: Route;
  onUpdateVehicle: (
    vehicleId: string,
    updates: Partial<Vehicles>
  ) => Promise<void>;
}

const DeleteRouteDialog: React.FC<DeleteRouteDialogProps> = ({
  visible,
  onClose,
  onConfirm,
  route,
  onUpdateVehicle,
}) => {
  const handleConfirm = async () => {
    try {
      // Atualiza o status do veículo para Disponível
      await onUpdateVehicle(route.vehicle.id, { status: "Disponível" });

      // Atualiza o status do motorista para Disponível
      try {
        await api.updateDriver(route.driver.id, { status: "Disponível" });
      } catch (error) {
        console.error("Erro ao atualizar status do motorista:", error);
        // Você pode adicionar um Alert aqui se desejar
      }

      // Deleta a rota
      await onConfirm(route);

      onClose();
    } catch (error) {
      console.error("Erro ao deletar rota e atualizar status:", error);
      Alert.alert(
        "Erro",
        "Falha ao deletar rota ou atualizar status dos recursos"
      );
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
          <Text style={styles.subMessage}>
            O veículo {route.vehicle.model} ({route.vehicle.plate}) será marcado
            como disponível.
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
              onPress={handleConfirm}
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
  subMessage: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    color: "#f5f2e5",
    opacity: 0.8,
  },
});

export default DeleteRouteDialog;
