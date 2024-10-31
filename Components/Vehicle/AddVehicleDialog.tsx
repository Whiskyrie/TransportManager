import React, { useState } from "react";
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
import { Vehicles, VehicleStatus } from "../../Types/vehicleTypes";

interface AddVehicleDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (vehicle: Omit<Vehicles, "id">) => void; // Modificado para garantir todos os campos exceto id
  isLoading?: boolean;
}

const AddVehicleDialog: React.FC<AddVehicleDialogProps> = ({
  visible,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const [model, setModel] = useState("");
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [plate, setPlate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!model) newErrors.model = "Modelo é obrigatório";
    if (!brand) newErrors.brand = "Marca é obrigatória";
    if (!year) newErrors.year = "Ano é obrigatório";
    if (!plate) newErrors.plate = "Placa é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    // Modificado para incluir todos os campos obrigatórios exceto id
    const newVehicle: Omit<Vehicles, "id"> = {
      model,
      brand,
      year: parseInt(year),
      plate,
      status: "Disponível" as VehicleStatus,
    };

    // Log para debug
    console.log("Novo veículo sendo criado:", newVehicle);

    onSave(newVehicle);
    clearForm();
    onClose();
  };

  const clearForm = () => {
    setModel("");
    setBrand("");
    setYear("");
    setPlate("");
    setErrors({});
  };

  const renderInput = (
    placeholder: string,
    value: string,
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
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
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
            <Text style={styles.title}>Novo Veículo</Text>
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
                  "Modelo",
                  model,
                  setModel,
                  "directions-car",
                  errors.model
                )}
                {renderInput("Marca", brand, setBrand, "build", errors.brand)}
                {renderInput(
                  "Ano",
                  year,
                  setYear,
                  "event",
                  errors.year,
                  "numeric"
                )}
                {renderInput("Placa", plate, setPlate, "label", errors.plate)}
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
});

export default AddVehicleDialog;
