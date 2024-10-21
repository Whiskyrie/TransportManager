import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Vehicle } from "./Types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface VehicleDetailsProps {
  vehicle: Vehicle;
  onClose: () => void;
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({
  vehicle,
  onClose,
}) => {
  return (
    <Modal visible={true} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.dialogContainer}>
          <ScrollView>
            <Text style={styles.title}>Detalhes do Veículo</Text>

            <View style={styles.detailRow}>
              <Icon name="car" size={24} color="#007bff" />
              <Text style={styles.detailLabel}>Modelo:</Text>
              <Text style={styles.detailText}>{vehicle.model}</Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="domain" size={24} color="#007bff" />
              <Text style={styles.detailLabel}>Marca:</Text>
              <Text style={styles.detailText}>{vehicle.brand}</Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="calendar" size={24} color="#007bff" />
              <Text style={styles.detailLabel}>Ano:</Text>
              <Text style={styles.detailText}>{vehicle.brand}</Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="card-text" size={24} color="#007bff" />
              <Text style={styles.detailLabel}>Placa:</Text>
              <Text style={styles.detailText}>{vehicle.plate}</Text>
            </View>
          </ScrollView>

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
    borderRadius: 20,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
    color: "#555",
  },
  detailText: {
    fontSize: 16,
    flex: 2,
    color: "#333",
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default VehicleDetails;
