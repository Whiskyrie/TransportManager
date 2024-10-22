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
import { Picker } from "@react-native-picker/picker";
import CustomButton from "./CustomButton";
import { MaterialIcons } from "@expo/vector-icons";
import { Drivers } from "../Driver/Types";
import { Vehicles } from "../Vehicle/Types";
import { Route, RouteStatus } from "./Types";

interface AddRouteDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (route: Partial<Route>) => void;
  drivers?: Drivers[];
  vehicles?: Vehicles[];
  isLoading?: boolean;
}

const AddRouteDialog: React.FC<AddRouteDialogProps> = ({
  visible,
  onClose,
  onSave,
  drivers = [],
  vehicles = [],
  isLoading = false,
}) => {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [status, setStatus] = useState<RouteStatus>("Pendente");
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!startLocation)
      newErrors.startLocation = "Local de origem é obrigatório";
    if (!endLocation) newErrors.endLocation = "Local de destino é obrigatório";
    if (!distance) newErrors.distance = "Distância é obrigatória";
    if (!estimatedDuration)
      newErrors.estimatedDuration = "Duração é obrigatória";
    if (!selectedDriver) newErrors.driver = "Motorista é obrigatório";
    if (!selectedVehicle) newErrors.vehicle = "Veículo é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const selectedDriverObj = drivers.find((d) => d.id === selectedDriver);
    const selectedVehicleObj = vehicles.find((v) => v.id === selectedVehicle);

    if (!selectedDriverObj || !selectedVehicleObj) {
      console.error("Driver or vehicle not found");
      return;
    }

    const newRoute: Partial<Route> = {
      startLocation,
      endLocation,
      distance: parseFloat(distance),
      estimatedDuration: parseFloat(estimatedDuration),
      status,
      driver: selectedDriverObj,
      vehicle: selectedVehicleObj,
    };

    onSave(newRoute);
    resetForm();
  };

  const resetForm = () => {
    setStartLocation("");
    setEndLocation("");
    setDistance("");
    setEstimatedDuration("");
    setStatus("Pendente");
    setSelectedDriver("");
    setSelectedVehicle("");
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
        color="#666"
        style={styles.inputIcon}
      />
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        value={value}
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
            <Text style={styles.title}>Nova Rota</Text>
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
                  "Local de Origem",
                  startLocation,
                  setStartLocation,
                  "location-on",
                  errors.startLocation
                )}
                {renderInput(
                  "Local de Destino",
                  endLocation,
                  setEndLocation,
                  "location-off",
                  errors.endLocation
                )}
                {renderInput(
                  "Distância (km)",
                  distance,
                  setDistance,
                  "straighten",
                  errors.distance,
                  "numeric"
                )}
                {renderInput(
                  "Duração Estimada (min)",
                  estimatedDuration,
                  setEstimatedDuration,
                  "timer",
                  errors.estimatedDuration,
                  "numeric"
                )}

                <View style={styles.pickerContainer}>
                  <MaterialIcons
                    name="person"
                    size={24}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <Picker
                    selectedValue={selectedDriver}
                    style={styles.picker}
                    onValueChange={setSelectedDriver}
                  >
                    <Picker.Item label="Selecione um motorista" value="" />
                    {drivers
                      .filter((driver) => driver)
                      .map((driver) => (
                        <Picker.Item
                          key={driver.id}
                          label={`${driver.name} - ${driver.licenseNumber}`}
                          value={driver.id}
                        />
                      ))}
                  </Picker>
                </View>
                {errors.driver && (
                  <Text style={styles.errorText}>{errors.driver}</Text>
                )}

                <View style={styles.pickerContainer}>
                  <MaterialIcons
                    name="directions-car"
                    size={24}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <Picker
                    selectedValue={selectedVehicle}
                    style={styles.picker}
                    onValueChange={setSelectedVehicle}
                  >
                    <Picker.Item label="Selecione um veículo" value="" />
                    {vehicles.map((vehicle) => (
                      <Picker.Item
                        key={vehicle.id}
                        label={`${vehicle.brand} ${vehicle.model} - ${vehicle.plate} (${vehicle.year})`}
                        value={vehicle.id}
                      />
                    ))}
                  </Picker>
                </View>
                {errors.vehicle && (
                  <Text style={styles.errorText}>{errors.vehicle}</Text>
                )}

                <View style={styles.pickerContainer}>
                  <MaterialIcons
                    name="info"
                    size={24}
                    color="#666"
                    style={styles.inputIcon}
                  />
                  <Picker
                    selectedValue={status}
                    style={styles.picker}
                    onValueChange={setStatus}
                  >
                    <Picker.Item label="Pendente" value="Pendente" />
                    <Picker.Item label="Em Progresso" value="Em Progresso" />
                    <Picker.Item label="Concluído" value="Concluído" />
                    <Picker.Item label="Cancelada" value="Cancelada" />
                  </Picker>
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
  errorText: {
    color: "#dc3545",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#f8f9fa",
    flexDirection: "row",
    alignItems: "center",
  },
  picker: {
    flex: 1,
    height: 50,
    marginLeft: 30,
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

export default AddRouteDialog;
