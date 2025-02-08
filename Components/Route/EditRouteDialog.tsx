import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "../Common/CustomButton";
import { MaterialIcons } from "@expo/vector-icons";
import { Route, RouteLocation, RouteStatus } from "../../Types/routeTypes";
import { VehicleStatus } from "../../Types/vehicleTypes";
import { api, handleApiError } from "Services/api";

interface EditRouteDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (editedRoute: Partial<Route>) => void;
  route: Route;
  isLoading?: boolean;
}

const EditRouteDialog: React.FC<EditRouteDialogProps> = ({
  visible,
  onClose,
  onSave,
  route,
  isLoading = false,
}) => {
  const [editedRoute, setEditedRoute] = useState<Partial<Route>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setEditedRoute(route);
    setErrors({});
  }, [route]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (
      typeof editedRoute.startLocation !== "object" ||
      !editedRoute.startLocation?.address
    ) {
      newErrors.startLocation = "Endereço inicial é obrigatório";
    }
    if (
      typeof editedRoute.endLocation !== "object" ||
      !editedRoute.endLocation?.address
    ) {
      newErrors.endLocation = "Endereço de destino é obrigatório";
    }
    if (!editedRoute.status) {
      newErrors.status = "Status é obrigatório";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateVehicleStatus = async (
    vehicleId: string,
    routeStatus: RouteStatus
  ) => {
    let newStatus: VehicleStatus = "Disponível";

    if (routeStatus === "Pendente" || routeStatus === "Em Progresso") {
      newStatus = "Indisponível";
    } else if (routeStatus === "Concluído" || routeStatus === "Cancelada") {
      newStatus = "Disponível";
    }

    try {
      await api.updateVehicle(vehicleId, { status: newStatus });
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert(
        "Erro",
        "Falha ao atualizar status do veículo: " + errorMessage
      );
    }
  };
  const updateDriverStatus = async (
    driverId: string,
    routeStatus: RouteStatus
  ) => {
    let newStatus: VehicleStatus = "Disponível";

    if (routeStatus === "Pendente" || routeStatus === "Em Progresso") {
      newStatus = "Indisponível";
    } else if (routeStatus === "Concluído" || routeStatus === "Cancelada") {
      newStatus = "Disponível";
    }

    try {
      await api.updateDriver(driverId, { status: newStatus });
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert(
        "Erro",
        "Falha ao atualizar status do motorista: " + errorMessage
      );
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      // Se o status da rota mudou, atualiza o status do veículo e do motorista
      if (editedRoute.status !== route.status) {
        if (editedRoute.vehicle?.id) {
          await updateVehicleStatus(
            editedRoute.vehicle.id,
            editedRoute.status as RouteStatus
          );
        }
        if (editedRoute.driver?.id) {
          await updateDriverStatus(
            editedRoute.driver.id,
            editedRoute.status as RouteStatus
          );
        }
      }

      await api.updateRoute(route.id, editedRoute);
      onSave(editedRoute);
      onClose();
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert("Erro", "Falha ao atualizar rota: " + errorMessage);
    }
  };

  const renderInput = (
    placeholder: string,
    value: string | undefined,
    onChangeText: (text: string) => void,
    icon: string,
    error?: string,
    editable: boolean = true
  ) => (
    <View style={styles.inputContainer}>
      <MaterialIcons
        name={icon as keyof typeof MaterialIcons.glyphMap}
        size={24}
        color="#f5f2e5"
        style={styles.inputIcon}
      />
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          !editable && styles.disabledInput,
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        placeholderTextColor="#f5f2e5"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.dialogContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Editar Rota</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#f5f2e5" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollContent}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#0066CC" />
            ) : (
              <>
                {renderInput(
                  "Início",
                  typeof editedRoute.startLocation === "object"
                    ? editedRoute.startLocation.address
                    : "",
                  (text) =>
                    setEditedRoute({
                      ...editedRoute,
                      startLocation: { address: text } as RouteLocation,
                    }),
                  "place",
                  errors.startLocation
                )}
                {renderInput(
                  "Destino",
                  typeof editedRoute.endLocation === "object"
                    ? editedRoute.endLocation.address
                    : "",
                  (text) =>
                    setEditedRoute({
                      ...editedRoute,
                      endLocation: { address: text } as RouteLocation,
                    }),
                  "location-on",
                  errors.endLocation
                )}
                {renderInput(
                  "Distância (km)",
                  editedRoute.distance?.toString(),
                  (text) =>
                    setEditedRoute({
                      ...editedRoute,
                      distance: parseFloat(text),
                    }),
                  "straighten"
                )}
                {renderInput(
                  "Duração Estimada (min)",
                  editedRoute.estimatedDuration?.toString(),
                  (text) =>
                    setEditedRoute({
                      ...editedRoute,
                      estimatedDuration: parseInt(text),
                    }),
                  "timer"
                )}
                <View style={styles.pickerContainer}>
                  <MaterialIcons
                    name="local-shipping"
                    size={24}
                    color="#f5f2e5"
                    style={styles.pickerIcon}
                  />
                  <View
                    style={[styles.picker, errors.status && styles.pickerError]}
                  >
                    <Picker
                      selectedValue={editedRoute.status}
                      onValueChange={(itemValue) =>
                        setEditedRoute({ ...editedRoute, status: itemValue })
                      }
                      dropdownIconColor="#f5f2e5"
                      style={styles.pickerInput}
                    >
                      <Picker.Item
                        label="Pendente"
                        value="Pendente"
                        color="#1a2b2b"
                      />
                      <Picker.Item
                        label="Em Progresso"
                        value="Em Progresso"
                        color="#1a2b2b"
                      />
                      <Picker.Item
                        label="Concluído"
                        value="Concluído"
                        color="#1a2b2b"
                      />
                      <Picker.Item
                        label="Cancelada"
                        value="Cancelada"
                        color="#1a2b2b"
                      />
                    </Picker>
                  </View>
                  {errors.status && (
                    <Text style={styles.errorText}>{errors.status}</Text>
                  )}
                </View>
              </>
            )}
          </ScrollView>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Cancelar"
              onPress={onClose}
              type="secondary"
              style={styles.button}
            />
            <CustomButton
              title="Salvar"
              onPress={handleSave}
              type="primary"
              style={styles.button}
              disabled={isLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dialogContainer: {
    backgroundColor: "#1a2b2b",
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f5f2e5",
  },
  closeButton: {
    padding: 5,
  },
  scrollContent: {
    maxHeight: "70%",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputIcon: {
    position: "absolute",
    left: 10,
    top: 12,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#243636",
    borderRadius: 10,
    padding: 12,
    paddingLeft: 40,
    fontSize: 16,
    backgroundColor: "#243636",
    color: "#f5f2e5",
  },
  inputError: {
    borderColor: "#dc3545",
  },
  disabledInput: {
    backgroundColor: "#e9ecef",
    color: "#f5f2e5",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
  },
  pickerContainer: {
    marginBottom: 15,
    position: "relative",
  },
  pickerIcon: {
    position: "absolute",
    left: 10,
    top: 12,
    zIndex: 1,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#243636",
    borderRadius: 10,
    backgroundColor: "#243636",
    paddingLeft: 30,
  },
  pickerError: {
    borderColor: "#dc3545",
  },
  pickerInput: {
    height: 50,
    color: "#f5f2e5",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default EditRouteDialog;
