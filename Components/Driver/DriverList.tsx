import React from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  Text,
  ViewStyle,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Drivers } from "./Types";

interface DriverListProps {
  drivers: Drivers[];
  onSelectDriver: (driver: Drivers) => void;
  refreshing: boolean;
  onRefresh: () => void;
  ListHeaderComponent?: React.ReactElement;
  contentContainerStyle?: ViewStyle;
  onDeleteDriver: (driver: Drivers) => void;
  onEditDriver: (driver: Drivers) => void;
}

const DriverList: React.FC<DriverListProps> = ({
  drivers,
  onSelectDriver,
  refreshing,
  onRefresh,
  ListHeaderComponent,
  contentContainerStyle,
  onDeleteDriver,
  onEditDriver,
}) => {
  const renderDriverItem = ({ item }: { item: Drivers }) => (
    <View style={styles.itemContainer}>
      <View style={styles.iconContainer}>
        <Icon name="account" size={32} color="#4A90E2" />
      </View>
      <TouchableOpacity
        onPress={() => onSelectDriver(item)}
        style={styles.driverInfoContainer}
        activeOpacity={0.7}
      >
        <View style={styles.driverInfo}>
          <View style={styles.headerContainer}>
            <Text style={styles.nameText}>{item.name}</Text>
          </View>
          <View style={styles.driverDetails}>
            <View style={styles.detailRow}>
              <Icon name="card-account-details" size={16} color="#666" />
              <Text style={styles.detailText}>CNH: {item.licenseNumber}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() => onEditDriver(item)}
          style={[styles.actionButton, styles.editButton]}
        >
          <Icon name="pencil" size={20} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDeleteDriver(item)}
          style={[styles.actionButton, styles.deleteButton]}
        >
          <Icon name="delete" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="account-off" size={80} color="#D1D5DB" />
      <Text style={styles.emptyText}>
        Nenhum motorista disponível no momento
      </Text>
      <Text style={styles.emptySubText}>
        Por favor, tente novamente mais tarde ou adicione novos motoristas.
      </Text>
    </View>
  );

  return (
    <FlatList
      data={drivers}
      renderItem={renderDriverItem}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#4A90E2"]}
        />
      }
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={[
        styles.listContainer,
        contentContainerStyle,
        drivers.length === 0 && styles.emptyListContainer,
      ]}
      ListEmptyComponent={EmptyComponent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Disponível":
      return "#34D399";
    case "Indisponível":
      return "#EF4444";
    case "Em viagem":
      return "#F59E0B";
    default:
      return "#6B7280";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Disponível":
      return "check-circle";
    case "Indisponível":
      return "close-circle";
    case "Em viagem":
      return "car-connected";
    default:
      return "help-circle";
  }
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  driverInfoContainer: {
    flex: 1,
  },
  driverInfo: {
    justifyContent: "space-between",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  driverDetails: {
    marginTop: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  detailText: {
    marginLeft: 8,
    color: "#4B5563",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "column",
    justifyContent: "space-around",
    marginLeft: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },
  editButton: {
    backgroundColor: "#4A90E2",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: Dimensions.get("window").height * 0.5,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 32,
  },
});

export default DriverList;
