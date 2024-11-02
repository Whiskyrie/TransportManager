import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Route } from "../../Types/routeTypes";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface RouteDetailsProps {
  route: Route;
  onClose: () => void;
}

const RouteDetails: React.FC<RouteDetailsProps> = ({ route, onClose }) => {
  return (
    <Modal visible={true} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.dialogContainer}>
          <ScrollView>
            <Text style={styles.title}>Detalhes da Rota</Text>

            <View style={styles.detailRow}>
              <Icon name="flag-checkered" size={24} color="#a51912" />
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={styles.detailText}>{route.status}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="identifier" size={24} color="#a51912" />
              <Text style={styles.detailLabel}>ID:</Text>
              <Text style={styles.detailText}>
                #{route.id.slice(0, 8).toUpperCase()}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="map-marker-distance" size={24} color="#a51912" />
              <Text style={styles.detailLabel}>Distância:</Text>
              <Text style={styles.detailText}>{route.distance} km</Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="map-marker" size={24} color="#a51912" />
              <Text style={styles.detailLabel}>Início:</Text>
              <Text style={styles.detailText}>
                {typeof route.startLocation === "string"
                  ? route.startLocation
                  : route.startLocation.address}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="map-marker-check" size={24} color="#a51912" />
              <Text style={styles.detailLabel}>Destino:</Text>
              <Text style={styles.detailText}>
                {typeof route.endLocation === "string"
                  ? route.endLocation
                  : route.endLocation.address}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Icon name="clock-outline" size={24} color="#a51912" />
              <Text style={styles.detailLabel}>Duração Estimada:</Text>
              <Text style={styles.detailText}>
                {Math.floor(route.estimatedDuration / 60)}h{" "}
                {route.estimatedDuration % 60}m
              </Text>
            </View>

            {/* Novos campos de motorista */}
            <View style={styles.sectionTitle}>
              <Icon name="account-tie" size={24} color="#a51912" />
              <Text style={styles.sectionTitleText}>
                Informações do Motorista
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Nome:</Text>
              <Text style={styles.detailText}>{route.driver.name}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>CNH:</Text>
              <Text style={styles.detailText}>
                {route.driver.licenseNumber}
              </Text>
            </View>
            <View style={styles.sectionTitle}>
              <Icon name="truck" size={24} color="#a51912" />
              <Text style={styles.sectionTitleText}>
                Informações do Veículo
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Modelo:</Text>
              <Text style={styles.detailText}>{route.vehicle.model}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Placa:</Text>
              <Text style={styles.detailText}>{route.vehicle.plate}</Text>
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
    width: "90%",
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
  sectionTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#f5f2e5",
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#f5f2e5",
  },
});

export default RouteDetails;
