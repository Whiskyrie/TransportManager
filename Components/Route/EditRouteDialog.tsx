import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Adicionei Picker aqui
import { Route, RouteLocation } from "./Types";

interface EditRouteDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (editedRoute: Partial<Route>) => void;
  route: Route;
}

const EditRouteDialog: React.FC<EditRouteDialogProps> = ({
  visible,
  onClose,
  onSave,
  route,
}) => {
  const [editedRoute, setEditedRoute] = useState<Partial<Route>>({});

  useEffect(() => {
    setEditedRoute(route);
  }, [route]);

  const handleSave = () => {
    onSave(editedRoute);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Editar Rota</Text>
          <TextInput
            style={styles.input}
            placeholder="Início"
            value={
              typeof editedRoute.startLocation === "object"
                ? editedRoute.startLocation.address
                : ""
            }
            onChangeText={(text) =>
              setEditedRoute({
                ...editedRoute,
                startLocation: { address: text } as RouteLocation,
              })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Destino"
            value={
              typeof editedRoute.endLocation === "object"
                ? editedRoute.endLocation.address
                : ""
            }
            onChangeText={(text) =>
              setEditedRoute({
                ...editedRoute,
                endLocation: { address: text } as RouteLocation,
              })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Distância (km)"
            value={editedRoute.distance?.toString()}
            onChangeText={(text) =>
              setEditedRoute({
                ...editedRoute,
                distance: parseFloat(text) || 0,
              })
            }
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Duração Estimada (min)"
            value={editedRoute.estimatedDuration?.toString()}
            onChangeText={(text) =>
              setEditedRoute({
                ...editedRoute,
                estimatedDuration: parseInt(text) || 0,
              })
            }
            keyboardType="numeric"
          />
          <Picker
            selectedValue={editedRoute.status}
            style={styles.picker}
            onValueChange={(itemValue) =>
              setEditedRoute({ ...editedRoute, status: itemValue })
            }
          >
            <Picker.Item label="Pendente" value="Pendente" />
            <Picker.Item label="Em Progresso" value="Em Progresso" />
            <Picker.Item label="Concluído" value="Concluído" />
            <Picker.Item label="Cancelada" value="Cancelada" />
          </Picker>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
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
    width: "90%",
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
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  saveButton: {
    backgroundColor: "#007bff",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default EditRouteDialog;
