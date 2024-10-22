import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, StyleSheet } from "react-native";
import CustomButton from "../Driver/CustomButton";
import { Vehicles } from "./Types";

interface EditVehicleDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (editedVehicle: Partial<Vehicles>) => void;
  vehicle: Vehicles;
}

const EditVehicleDialog: React.FC<EditVehicleDialogProps> = ({
  visible,
  onClose,
  onSave,
  vehicle,
}) => {
  const [editedVehicle, setEditedVehicle] = useState<Partial<Vehicles>>({});

  useEffect(() => {
    setEditedVehicle(vehicle);
  }, [vehicle]);

  const handleSave = () => {
    onSave(editedVehicle);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Editar Veículo</Text>
          <TextInput
            style={styles.input}
            placeholder="Modelo"
            value={editedVehicle.model}
            onChangeText={(text) =>
              setEditedVehicle({ ...editedVehicle, model: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Marca"
            value={editedVehicle.brand}
            onChangeText={(text) =>
              setEditedVehicle({ ...editedVehicle, brand: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Ano"
            value={editedVehicle.year?.toString()}
            onChangeText={(text) =>
              setEditedVehicle({ ...editedVehicle, year: parseInt(text) })
            }
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Placa"
            value={editedVehicle.plate}
            onChangeText={(text) =>
              setEditedVehicle({ ...editedVehicle, plate: text })
            }
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dialog: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
    marginTop: 20,
  },
});

export default EditVehicleDialog;
