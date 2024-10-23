import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, StyleSheet } from "react-native";
import CustomButton from "../Driver/CustomButton";
import { Drivers } from "./Types";

interface EditDriverDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (editedDriver: Partial<Drivers>) => void;
  driver: Drivers;
}

const EditDriverDialog: React.FC<EditDriverDialogProps> = ({
  visible,
  onClose,
  onSave,
  driver,
}) => {
  const [editedDriver, setEditedDriver] = useState<Partial<Drivers>>({});

  useEffect(() => {
    setEditedDriver(driver);
  }, [driver]);

  const handleSave = () => {
    onSave(editedDriver);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Editar Motorista</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={editedDriver.name}
            onChangeText={(text) =>
              setEditedDriver({ ...editedDriver, name: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="CNH"
            value={editedDriver.licenseNumber}
            onChangeText={(text) =>
              setEditedDriver({ ...editedDriver, licenseNumber: text })
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

export default EditDriverDialog;
