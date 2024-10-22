import React, { useState } from "react";
import { View, Text, TextInput, Modal, StyleSheet } from "react-native";
import CustomButton from "../Driver/CustomButton";
import { Vehicles } from "./Types";

interface AddVehicleDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (vehicle: Partial<Vehicles>) => void;
}

const AddVehicleDialog: React.FC<AddVehicleDialogProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [model, setModel] = useState("");
  const [brand, setBrand] = useState("");
  const [year, setYear] = useState("");
  const [plate, setPlate] = useState("");

  const handleSave = () => {
    const newVehicle: Partial<Vehicles> = {
      model,
      brand,
      year: parseInt(year),
      plate,
    };
    onSave(newVehicle);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.dialogContainer}>
          <Text style={styles.title}>Adicionar Novo Veículo</Text>
          <TextInput
            style={styles.input}
            placeholder="Modelo"
            value={model}
            onChangeText={setModel}
          />
          <TextInput
            style={styles.input}
            placeholder="Marca"
            value={brand}
            onChangeText={setBrand}
          />
          <TextInput
            style={styles.input}
            placeholder="Ano"
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Placa"
            value={plate}
            onChangeText={setPlate}
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

export default AddVehicleDialog;
