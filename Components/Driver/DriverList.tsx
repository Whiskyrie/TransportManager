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
import { Drivers } from "../../Types/driverTypes";

interface DriverListProps {
  drivers: Drivers[];
  onSelectDriver: (driver: Drivers) => void;
  refreshing: boolean;
  onRefresh: () => void;
  ListHeaderComponent?: React.ReactElement;
  contentContainerStyle?: ViewStyle;
  onDeleteDriver: ((driver: Drivers) => void) | null;
  onEditDriver: ((driver: Drivers) => void) | null;
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
        <Icon name="account" size={28} color="#1a2b2b" />
      </View>
      <TouchableOpacity
        onPress={() => onSelectDriver(item)}
        style={[
          styles.driverInfoContainer,
          !onEditDriver && !onDeleteDriver && styles.driverInfoFullWidth,
        ]}
        activeOpacity={0.7}
      >
        <View style={styles.driverInfo}>
          <View style={styles.headerContainer}>
            <Text style={styles.nameText}>{item.name}</Text>
          </View>
          <View style={styles.driverDetails}>
            <View style={styles.detailRow}>
              <Icon name="card-account-details" size={16} color="#a51912" />
              <Text style={styles.detailText}>CNH: {item.licenseNumber}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {/* Renderiza os botões de ação apenas se as permissões existirem */}
      {(onEditDriver || onDeleteDriver) && (
        <View style={styles.actionButtons}>
          {onEditDriver && (
            <TouchableOpacity
              onPress={() => onEditDriver(item)}
              style={[styles.actionButton, styles.editButton]}
            >
              <Icon name="pencil" size={20} color="#FFF" />
            </TouchableOpacity>
          )}
          {onDeleteDriver && (
            <TouchableOpacity
              onPress={() => onDeleteDriver(item)}
              style={[styles.actionButton, styles.deleteButton]}
            >
              <Icon name="delete" size={20} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      )}
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
          colors={["#a51912"]}
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

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: "#1a2b2b",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 4,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.85,
    elevation: 12,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  driverInfoContainer: {
    flex: 1,
  },
  driverInfoFullWidth: {
    flex: 1,
    marginRight: 0, // Remove margem quando não há botões de ação
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#f5f2e5",
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
    color: "#f5f2e5",
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
    color: "#f5f2e5",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 16,
    color: "#f5f2e5",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 32,
  },
});

export default DriverList;
