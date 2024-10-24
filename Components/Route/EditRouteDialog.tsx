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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "../Common/CustomButton";
import { MaterialIcons } from "@expo/vector-icons";
import { Route, RouteLocation } from "./Types";

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

  const handleSave = () => {
    if (!validateForm()) return;
    onSave(editedRoute);
    onClose();
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
        color="#666"
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
        placeholderTextColor="#666"
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
              <MaterialIcons name="close" size={24} color="#666" />
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
                    color="#666"
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
                      style={styles.pickerInput}
                    >
                      <Picker.Item label="Selecione um status" value="" />
                      <Picker.Item label="Pendente" value="Pendente" />
                      <Picker.Item label="Em Progresso" value="Em Progresso" />
                      <Picker.Item label="Concluído" value="Concluído" />
                      <Picker.Item label="Cancelada" value="Cancelada" />
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
    backgroundColor: "white",
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
    color: "#333",
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
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    paddingLeft: 40,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
    color: "#333",
  },
  inputError: {
    borderColor: "#dc3545",
  },
  disabledInput: {
    backgroundColor: "#e9ecef",
    color: "#666",
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
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#f8f9fa",
    paddingLeft: 30,
  },
  pickerError: {
    borderColor: "#dc3545",
  },
  pickerInput: {
    height: 50,
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
