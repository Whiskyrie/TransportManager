import React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Route } from "../Route/Types";

interface RouteDetailsProps {
  route: Route;
  onClose: () => void;
}

const RouteDetails: React.FC<RouteDetailsProps> = ({ route, onClose }) => {
  return (
    <Modal visible={true} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.dialogContainer}>
          <Text style={styles.title}>Detalhes da Rota</Text>
          <Text style={styles.detailText}>Status: {route.status}</Text>
          <Text style={styles.detailText}>Distância: {route.distance} km</Text>
          <Text style={styles.detailText}>
            Início: {route.startLocation.address}
          </Text>
          <Text style={styles.detailText}>
            Destino: {route.endLocation.address}
          </Text>
          <Text style={styles.detailText}>
            Duração Estimada: {route.estimatedDuration} min
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
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
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RouteDetails;
