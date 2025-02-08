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
import { Vehicles, VehicleStatus } from "../../Types/vehicleTypes";
import { useValidation } from "../../Hooks/useValidation";
import { masks } from "../../Utils/mask";

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

  const {
    validatePlate,
    validateYear,
    plateValidations,
    yearValidations,
    isPlateValid,
    isYearValid,
  } = useValidation();

  useEffect(() => {
    setEditedVehicle(vehicle);
    if (vehicle) {
      validatePlate(vehicle.plate);
      validateYear(vehicle.year.toString());
    }
    setErrors({});
  }, [vehicle]);

  const validateForm = () => {
    validatePlate(editedVehicle.plate || "");
    validateYear(editedVehicle.year?.toString() || "");

    if (!isPlateValid() || !isYearValid()) {
      setErrors((prev) => ({
        ...prev,
        plate: plateValidations.find((v) => !v.isValid)?.message,
        year: yearValidations.find((v) => !v.isValid)?.message,
      }));
      return false;
    }

    const newErrors: Record<string, string> = {};

    if (!editedVehicle.model?.trim()) {
      newErrors.model = "Modelo é obrigatório";
    }
    if (!editedVehicle.brand?.trim()) {
      newErrors.brand = "Marca é obrigatória";
    }
    if (!editedVehicle.status) {
      newErrors.status = "Status é obrigatório";
    }

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
        color="#f5f2e5"
        style={styles.inputIcon}
      />
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        value={value?.toString()}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor="#a0a0a0"
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
              <MaterialIcons name="close" size={24} color="#f5f2e5" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#f5f2e5" />
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
                  (text) => {
                    const year = text.replace(/\D/g, "");
                    setEditedVehicle({
                      ...editedVehicle,
                      year: parseInt(year) || undefined,
                    });
                    validateYear(year);
                  },
                  "event",
                  errors.year ||
                    yearValidations.find((v) => !v.isValid)?.message,
                  "numeric"
                )}

                {renderInput(
                  "Placa",
                  editedVehicle.plate,
                  (text) => {
                    const maskedValue = masks.plate(text);
                    setEditedVehicle({ ...editedVehicle, plate: maskedValue });
                    validatePlate(maskedValue);
                  },
                  "label",
                  errors.plate ||
                    plateValidations.find((v) => !v.isValid)?.message
                )}

                <View style={styles.pickerContainer}>
                  <MaterialIcons
                    name="info"
                    size={24}
                    color="#f5f2e5"
                    style={styles.inputIcon}
                  />
                  <Picker
                    selectedValue={editedVehicle.status}
                    style={styles.picker}
                    dropdownIconColor="#f5f2e5"
                    onValueChange={(value: VehicleStatus) =>
                      setEditedVehicle({ ...editedVehicle, status: value })
                    }
                  >
                    <Picker.Item
                      label="Disponível"
                      value="Disponível"
                      color="#1a2b2b"
                    />
                    <Picker.Item
                      label="Indisponível"
                      value="Indisponível"
                      color="#1a2b2b"
                    />
                    <Picker.Item
                      label="Em manutenção"
                      value="Em manutenção"
                      color="#1a2b2b"
                    />
                  </Picker>
                </View>
                {errors.status && (
                  <Text style={styles.errorText}>{errors.status}</Text>
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
  pickerContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#243636",
    borderRadius: 10,
    padding: 12,
    paddingLeft: 40,
    backgroundColor: "#243636",
  },
  picker: {
    color: "#f5f2e5",
  },
});
export default EditVehicleDialog;
