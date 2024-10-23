import React, { useState } from "react";
import { View, Text, TextInput, Modal, StyleSheet } from "react-native";
import CustomButton from "../Driver/CustomButton";
import { Drivers } from "./Types";

interface AddDriverDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (driver: Partial<Drivers>) => void;
}

const AddDriverDialog: React.FC<AddDriverDialogProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [licenseNumber, setLicense] = useState("");

  const handleSave = () => {
    const newDriver: Partial<Drivers> = {
      name,
      licenseNumber,
    };
    onSave(newDriver);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.dialogContainer}>
          <Text style={styles.title}>Adicionar Novo Motorista</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="CNH"
            value={licenseNumber}
            onChangeText={setLicense}
          />
          <View style={styles.buttonContainer}>
            <CustomButton title="Cancelar" onPress={onClose} type="secondary" />
            <CustomButton title="Salvar" onPress={handleSave} type="primary" />
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
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});

export default AddDriverDialog;
