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
import CustomButton from "../Common/CustomButton";
import { MaterialIcons } from "@expo/vector-icons";
import { Vehicles } from "./Types";

interface EditVehicleDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (editedVehicle: Partial<Vehicles>) => void;
  vehicle: Vehicles;
  isLoading?: boolean;
}

const EditVehicleDialog: React.FC<EditVehicleDialogProps> = ({
  visible,
  onClose,
  onSave,
  vehicle,
  isLoading = false,
}) => {
  const [editedVehicle, setEditedVehicle] = useState<Partial<Vehicles>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setEditedVehicle(vehicle);
    setErrors({});
  }, [vehicle]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!editedVehicle.model) newErrors.model = "Modelo é obrigatório";
    if (!editedVehicle.brand) newErrors.brand = "Marca é obrigatória";
    if (!editedVehicle.year) newErrors.year = "Ano é obrigatório";
    if (!editedVehicle.plate) newErrors.plate = "Placa é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave(editedVehicle);
    onClose();
  };

  const renderInput = (
    placeholder: string,
    value: string | number | undefined,
    onChangeText: (text: string) => void,
    icon: string,
    error?: string,
    keyboardType: "default" | "numeric" = "default"
  ) => (
    <View style={styles.inputContainer}>
      <MaterialIcons
        name={icon as keyof typeof MaterialIcons.glyphMap}
        size={24}
        color="#666"
        style={styles.inputIcon}
      />
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        value={value?.toString()}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
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
            <Text style={styles.title}>Editar Veículo</Text>
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
                  "Modelo",
                  editedVehicle.model,
                  (text) => setEditedVehicle({ ...editedVehicle, model: text }),
                  "directions-car",
                  errors.model
                )}
                {renderInput(
                  "Marca",
                  editedVehicle.brand,
                  (text) => setEditedVehicle({ ...editedVehicle, brand: text }),
                  "build",
                  errors.brand
                )}
                {renderInput(
                  "Ano",
                  editedVehicle.year,
                  (text) =>
                    setEditedVehicle({
                      ...editedVehicle,
                      year: text ? parseInt(text) : undefined,
                    }),
                  "event",
                  errors.year,
                  "numeric"
                )}
                {renderInput(
                  "Placa",
                  editedVehicle.plate,
                  (text) => setEditedVehicle({ ...editedVehicle, plate: text }),
                  "label",
                  errors.plate
                )}
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
  errorText: {
    color: "#dc3545",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
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

export default EditVehicleDialog;
