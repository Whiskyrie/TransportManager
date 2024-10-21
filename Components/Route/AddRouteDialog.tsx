import React, { useState } from "react";
import { View, Text, TextInput, Modal, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "./CustomButton";
import { Route, RouteLocation, RouteStatus } from "./Types";
import { getRouteData } from "Utils/routeService";

interface AddRouteDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (route: Partial<Route>) => void;
}
const AddRouteDialog: React.FC<AddRouteDialogProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [startLocation, setStartLocation] = useState<RouteLocation>(
    {} as RouteLocation
  );
  const [endLocation, setEndLocation] = useState<RouteLocation>(
    {} as RouteLocation
  );
  const [distance, setDistance] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [status, setStatus] = useState<RouteStatus>("Pendente");

  const handleSave = async () => {
    const { distance, duration } = await getRouteData(
      startLocation.address,
      endLocation.address
    );
    const newRoute: Partial<Route> = {
      startLocation,
      endLocation,
      distance,
      estimatedDuration: duration,
      status,
    };
    onSave(newRoute);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.dialogContainer}>
          <Text style={styles.title}>Adicionar Nova Rota</Text>
          <TextInput
            style={styles.input}
            placeholder="Local de Origem"
            value={startLocation.address}
            onChangeText={(text) =>
              setStartLocation({ ...startLocation, address: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Local de Destino"
            value={endLocation.address}
            onChangeText={(text) =>
              setEndLocation({ ...endLocation, address: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Distância (km)"
            value={distance}
            editable={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Duração Estimada (min)"
            value={estimatedDuration}
            editable={false}
          />
          <Picker
            selectedValue={status}
            style={styles.picker}
            onValueChange={(itemValue) => setStatus(itemValue)}
          >
            <Picker.Item label="Pendente" value="Pendente" />
            <Picker.Item label="Em Progresso" value="Em Progresso" />
            <Picker.Item label="Concluído" value="Concluído" />
            <Picker.Item label="Cancelada" value="Cancelada" />
          </Picker>
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
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});

export default AddRouteDialog;
