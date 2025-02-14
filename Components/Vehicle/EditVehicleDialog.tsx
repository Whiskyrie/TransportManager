import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import CustomButton from "../Common/CustomButton";
import { Vehicles, VehicleStatus } from "../../Types/vehicleTypes";
import { useValidation } from "../../Hooks/useValidation";
import { masks } from "../../Utils/mask";
import { Picker } from "@react-native-picker/picker";
import { fipeApi } from "../../Services/fipeApi";
import { FipeBrand, FipeModel } from "Types/fipeTypes";

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
  const [brands, setBrands] = useState<FipeBrand[]>([]);
  const [models, setModels] = useState<FipeModel[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [isLoadingFipe, setIsLoadingFipe] = useState(false);

  const {
    validatePlate,
    validateYear,
    plateValidations,
    yearValidations,
    isPlateValid,
    isYearValid,
  } = useValidation();

  useEffect(() => {
    loadBrands();
  }, []);

  useEffect(() => {
    if (vehicle) {
      setEditedVehicle(vehicle);
      validatePlate(vehicle.plate);
      validateYear(vehicle.year.toString());

      if (selectedBrand) {
        loadModels(selectedBrand);
      }
    }
    setErrors({});
  }, [vehicle]);

  const loadBrands = async () => {
    setIsLoadingFipe(true);
    const brandsData = await fipeApi.getBrands();
    setBrands(brandsData);
    setIsLoadingFipe(false);
  };

  const loadModels = async (brandId: string) => {
    setIsLoadingFipe(true);
    const modelsData = await fipeApi.getModels(brandId);
    setModels(modelsData);
    setIsLoadingFipe(false);
  };

  const handleBrandSelect = async (brandCode: string) => {
    setSelectedBrand(brandCode);
    const selectedBrandName =
      brands.find((b) => b.codigo === brandCode)?.nome || "";
    setEditedVehicle((prev) => ({ ...prev, brand: selectedBrandName }));
    await loadModels(brandCode);
  };

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
            {isLoading || isLoadingFipe ? (
              <ActivityIndicator size="large" color="#f5f2e5" />
            ) : (
              <>
                <View style={styles.pickerContainer}>
                  <MaterialIcons
                    name="build"
                    size={24}
                    color="#f5f2e5"
                    style={styles.inputIcon}
                  />
                  <Picker
                    selectedValue={selectedBrand}
                    style={styles.picker}
                    onValueChange={handleBrandSelect}
                    dropdownIconColor="#f5f2e5"
                  >
                    <Picker.Item
                      label="Selecione a marca"
                      value=""
                      color="#1a2b2b"
                    />
                    {brands.map((brand) => (
                      <Picker.Item
                        key={brand.codigo}
                        label={brand.nome}
                        value={brand.codigo}
                        color="#1a2b2b"
                      />
                    ))}
                  </Picker>
                </View>

                <View style={styles.pickerContainer}>
                  <MaterialIcons
                    name="directions-car"
                    size={24}
                    color="#f5f2e5"
                    style={styles.inputIcon}
                  />
                  <Picker
                    selectedValue={editedVehicle.model}
                    style={styles.picker}
                    onValueChange={(value) =>
                      setEditedVehicle((prev) => ({ ...prev, model: value }))
                    }
                    dropdownIconColor="#f5f2e5"
                  >
                    <Picker.Item
                      label="Selecione o modelo"
                      value=""
                      color="#1a2b2b"
                    />
                    {models.map((model) => (
                      <Picker.Item
                        key={model.codigo}
                        label={model.nome}
                        value={model.nome}
                        color="#1a2b2b"
                      />
                    ))}
                  </Picker>
                </View>

                {renderInput(
                  "Ano",
                  editedVehicle.year,
                  (text) => {
                    const year = text.replace(/\D/g, "");
                    setEditedVehicle((prev) => ({
                      ...prev,
                      year: parseInt(year) || undefined,
                    }));
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
                    setEditedVehicle((prev) => ({
                      ...prev,
                      plate: maskedValue,
                    }));
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
                    onValueChange={(value: VehicleStatus) =>
                      setEditedVehicle((prev) => ({ ...prev, status: value }))
                    }
                    dropdownIconColor="#f5f2e5"
                  >
                    <Picker.Item
                      label="Selecione o status"
                      value=""
                      color="#1a2b2b"
                    />
                    <Picker.Item
                      label="Disponível"
                      value="Disponível"
                      color="#1a2b2b"
                    />
                    <Picker.Item
                      label="Em uso"
                      value="Em uso"
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
    position: "relative",
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
    backgroundColor: "#243636",
    position: "relative",
    height: 50,
    justifyContent: "center",
  },
  pickerIcon: {
    position: "absolute",
    left: 10,
    zIndex: 1,
  },
  picker: {
    color: "#f5f2e5",
    marginLeft: 30,
    height: 50,
  },
  pickerItemStyle: {
    backgroundColor: "#243636",
    color: "#f5f2e5",
    fontSize: 16,
  },
  pickerError: {
    borderColor: "#dc3545",
  },
});

export default EditVehicleDialog;
