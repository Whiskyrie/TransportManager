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
import { Drivers } from "../../Types/driverTypes";
import { Vehicles } from "../../Types/vehicleTypes";
import { Route, RouteStatus } from "../../Types/routeTypes";
import { api, handleApiError } from "Services/api";
import LocationAutocomplete from "./LocationAutoComplete";
import calculateRouteDetailsWithRateLimit from "Services/distanceCalculatorAPI";

interface AddRouteDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (route: Partial<Route>) => void;
  isLoading?: boolean;
}

const AddRouteDialog: React.FC<AddRouteDialogProps> = ({
  visible,
  onClose,
  onSave,
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

  const [drivers, setDrivers] = useState<Drivers[]>([]);
  const [vehicles, setVehicles] = useState<Vehicles[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [loadingError, setLoadingError] = useState<string>("");

  const loadDrivers = async () => {
    try {
      const response = await api.getAllDrivers();
      setDrivers(response.data);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setLoadingError(errorMessage);
      Alert.alert("Erro", "Falha ao carregar motoristas: " + errorMessage);
    }
  };

  const loadVehicles = async () => {
    try {
      const response = await api.getAllVehicles();
      // Filtra apenas veículos disponíveis
      const availableVehicles = response.data.filter(
        (vehicle: Vehicles) => vehicle.status === "Disponível"
      );
      setVehicles(availableVehicles);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setLoadingError(errorMessage);
      Alert.alert("Erro", "Falha ao carregar veículos: " + errorMessage);
    }
  };
  useEffect(() => {
    if (visible) {
      setIsLoadingData(true);
      setLoadingError("");

      Promise.all([loadDrivers(), loadVehicles()]).finally(() =>
        setIsLoadingData(false)
      );
    }
  }, [visible]);

  useEffect(() => {
    const updateRouteDetails = async () => {
      if (startLocation && endLocation) {
        try {
          const details = await calculateRouteDetailsWithRateLimit(
            startLocation,
            endLocation
          );
          setDistance(details.distance.toString());
          setEstimatedDuration(details.duration.toString());
        } catch (error) {
          Alert.alert(
            "Erro",
            "Não foi possível calcular a distância e duração da rota"
          );
        }
      }
    };

    updateRouteDetails();
  }, [startLocation, endLocation]);

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

  const handleSave = async () => {
    if (!validateForm()) return;

    const selectedDriverObj = drivers.find((d) => d.id === selectedDriver);
    const selectedVehicleObj = vehicles.find((v) => v.id === selectedVehicle);

    if (!selectedDriverObj || !selectedVehicleObj) {
      Alert.alert("Erro", "Motorista ou veículo não encontrado");
      return;
    }

    try {
      const updatedVehicle: Partial<Vehicles> = {
        ...selectedVehicleObj,
        status: "Indisponível",
      };

      await api.updateVehicle(selectedVehicle, updatedVehicle);

      const newRoute: Partial<Route> = {
        startLocation,
        endLocation,
        distance: parseFloat(distance),
        estimatedDuration: parseFloat(estimatedDuration),
        status,
        driver: selectedDriverObj,
        vehicle: {
          ...selectedVehicleObj,
          status: "Indisponível",
        },
      };

      onSave(newRoute);
      resetForm();
      onClose();
    } catch (error) {
      const errorMessage = handleApiError(error);
      Alert.alert("Erro", "Falha ao salvar rota: " + errorMessage);
    }
  };

  const renderReadOnlyInput = (
    label: string,
    value: string,
    icon: string,
    error?: string
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
        placeholder={label}
        value={value}
        editable={false}
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
            <Text style={styles.title}>Nova Rota</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#f5f2e5" />
            </TouchableOpacity>
          </View>

          {loadingError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorMessage}>{loadingError}</Text>
              <CustomButton
                title="Tentar Novamente"
                onPress={() => {
                  setLoadingError("");
                  setIsLoadingData(true);
                  Promise.all([loadDrivers(), loadVehicles()]).finally(() =>
                    setIsLoadingData(false)
                  );
                }}
                type="secondary"
              />
            </View>
          ) : (
            <ScrollView style={styles.scrollContent}>
              {isLoading || isLoadingData ? (
                <ActivityIndicator size="large" color="#f5f2e5" />
              ) : (
                <>
                  <LocationAutocomplete
                    value={startLocation}
                    onLocationSelect={setStartLocation}
                    placeholder="Local de Origem"
                    icon="location-on"
                    error={errors.startLocation}
                  />

                  <LocationAutocomplete
                    value={endLocation}
                    onLocationSelect={setEndLocation}
                    placeholder="Local de Destino"
                    icon="location-off"
                    error={errors.endLocation}
                  />

                  {renderReadOnlyInput(
                    "Distância (km)",
                    distance ? `${distance} km` : "Calculando...",
                    "straighten",
                    errors.distance
                  )}
                  {renderReadOnlyInput(
                    "Duração Estimada (min)",
                    estimatedDuration
                      ? `${estimatedDuration} min`
                      : "Calculando...",
                    "timer",
                    errors.estimatedDuration
                  )}

                  <View style={styles.pickerContainer}>
                    <MaterialIcons
                      name="person"
                      size={24}
                      color="#f5f2e5"
                      style={styles.inputIcon}
                    />
                    <Picker
                      selectedValue={selectedDriver}
                      style={styles.picker}
                      dropdownIconColor="#f5f2e5"
                      onValueChange={setSelectedDriver}
                    >
                      <Picker.Item
                        label="Selecione um motorista"
                        value=""
                        color="#1a2b2b"
                      />
                      {drivers.map((driver) => (
                        <Picker.Item
                          key={driver.id}
                          label={`${driver.name} - ${driver.licenseNumber}`}
                          value={driver.id}
                          color="#1a2b2b"
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
                      color="#f5f2e5"
                      style={styles.inputIcon}
                    />
                    <Picker
                      selectedValue={selectedVehicle}
                      style={styles.picker}
                      dropdownIconColor="#f5f2e5"
                      onValueChange={setSelectedVehicle}
                    >
                      <Picker.Item
                        label="Selecione um veículo"
                        value=""
                        color="#1a2b2b"
                      />
                      {vehicles.map((vehicle) => (
                        <Picker.Item
                          key={vehicle.id}
                          label={`${vehicle.brand} ${vehicle.model} - ${vehicle.plate} (${vehicle.year})`}
                          value={vehicle.id}
                          color="#1a2b2b"
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
                      color="#f5f2e5"
                      style={styles.inputIcon}
                    />
                    <Picker
                      selectedValue={status}
                      style={styles.picker}
                      dropdownIconColor="#f5f2e5"
                      onValueChange={setStatus}
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
                </>
              )}
            </ScrollView>
          )}

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
              disabled={isLoading || isLoadingData || !!loadingError}
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
    shadowOpacity: 1.25,
    shadowRadius: 4.85,
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
  locationInput: {
    backgroundColor: "#243636",
    borderColor: "#243636",
    color: "#f5f2e5",
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#243636",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#243636",
    flexDirection: "row",
    alignItems: "center",
  },
  picker: {
    flex: 1,
    height: 50,
    marginLeft: 30,
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
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorMessage: {
    color: "#dc3545",
    marginBottom: 15,
    textAlign: "center",
  },
});

export default AddRouteDialog;
