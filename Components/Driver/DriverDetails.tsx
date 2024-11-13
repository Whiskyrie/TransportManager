// DriverDetails.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Drivers } from "../../Types/driverTypes";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface DriverDetailsProps {
  driver: Drivers;
  onClose: () => void;
}

const DriverDetails: React.FC<DriverDetailsProps> = ({ driver, onClose }) => {
  return (
    <Modal visible={true} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.dialogContainer}>
          <ScrollView>
            <Text style={styles.title}>Detalhes do Motorista</Text>

            <View style={styles.detailRow}>
              <Icon name="account" size={24} color="#a51912" />
              <Text style={styles.detailLabel}>Nome:</Text>
              <Text style={styles.detailText}>{driver.name}</Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="card-account-details" size={24} color="#a51912" />
              <Text style={styles.detailLabel}>CNH:</Text>
              <Text style={styles.detailText}>{driver.licenseNumber}</Text>
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
    backgroundColor: "#1a2b2b",
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
    color: "#f5f2e5",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f2e5",
    paddingBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
    color: "#f5f2e5",
  },
  detailText: {
    fontSize: 16,
    flex: 2,
    color: "#f5f2e5",
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#a51912",
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#f5f2e5",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default DriverDetails;
