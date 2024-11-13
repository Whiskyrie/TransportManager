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
import { Drivers } from "../../Types/driverTypes";

interface AddDriverDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (driver: Partial<Drivers>) => void;
  isLoading?: boolean;
}

const AddDriverDialog: React.FC<AddDriverDialogProps> = ({
  visible,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const [name, setName] = useState("");
  const [licenseNumber, setLicense] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name) newErrors.name = "Nome é obrigatório";
    if (!licenseNumber) newErrors.licenseNumber = "CNH é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const newDriver: Partial<Drivers> = {
      name,
      licenseNumber,
    };
    onSave(newDriver);
    onClose();
  };

  const renderInput = (
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
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
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
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
            <Text style={styles.title}>Novo Motorista</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#f5f2e5" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#0066CC" />
            ) : (
              <>
                {renderInput("Nome", name, setName, "person", errors.name)}
                {renderInput(
                  "CNH",
                  licenseNumber,
                  setLicense,
                  "assignment",
                  errors.licenseNumber
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
    marginBottom: 12,
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
    padding: 12.225,
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

export default AddDriverDialog;
