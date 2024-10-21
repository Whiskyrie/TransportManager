import React from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  Text,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Vehicle } from "./Types";

interface VehicleListProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  refreshing: boolean;
  onRefresh: () => void;
  ListHeaderComponent?: React.ReactElement;
  contentContainerStyle?: ViewStyle;
  onDeleteVehicle: (vehicle: Vehicle) => void;
  onEditVehicle: (vehicle: Vehicle) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({
  vehicles,
  onSelectVehicle,
  refreshing,
  onRefresh,
  ListHeaderComponent,
  contentContainerStyle,
  onDeleteVehicle,
  onEditVehicle,
}) => {
  const renderVehicleItem = ({ item }: { item: Vehicle }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        onPress={() => onSelectVehicle(item)}
        style={styles.vehicleInfoContainer}
      >
        <View style={styles.vehicleInfo}>
          <Text style={styles.plateText}>{item.plate}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.vehicleDetails}>
          <Text>Modelo: {item.model}</Text>
          <Text>Marca: {item.brand}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() => onEditVehicle(item)}
          style={styles.actionButton}
        >
          <Icon name="pencil" size={24} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDeleteVehicle(item)}
          style={styles.actionButton}
        >
          <Icon name="delete" size={24} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={vehicles}
      renderItem={renderVehicleItem}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={contentContainerStyle}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Icon name="car-off" size={64} color="#808080" />
          <Text style={styles.emptyText}>
            Nenhum veículo disponível no momento
          </Text>
          <Text style={styles.emptySubText}>
            Por favor, tente novamente mais tarde ou adicione novos veículos.
          </Text>
        </View>
      }
    />
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Disponível":
      return "#32CD32";
    case "Indisponível":
      return "#FF0000";
    case "Em manutenção":
      return "#FFA500";
    default:
      return "#808080";
  }
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    width: "100%",
    padding: 12,
    marginVertical: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    flexDirection: "row",
  },
  vehicleInfoContainer: {
    flex: 1,
  },
  vehicleInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  plateText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  vehicleDetails: {
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "column",
    justifyContent: "space-around",
    marginLeft: 8,
  },
  actionButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#808080",
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: "#808080",
    textAlign: "center",
    marginTop: 5,
  },
});

export default VehicleList;
