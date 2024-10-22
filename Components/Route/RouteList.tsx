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
import { truncateText } from "../../Utils/helper";
import { Route, RouteLocation } from "../Route/Types";

interface RouteListProps {
  routes: Route[];
  onSelectRoute: (route: Route) => void;
  refreshing: boolean;
  onRefresh: () => void;
  ListHeaderComponent?: React.ReactElement;
  contentContainerStyle?: ViewStyle;
  onDeleteRoute: (route: Route) => void;
  onEditRoute: (route: Route) => void;
}

const RouteList: React.FC<RouteListProps> = ({
  routes,
  onSelectRoute,
  refreshing,
  onRefresh,
  ListHeaderComponent,
  contentContainerStyle,
  onDeleteRoute,
  onEditRoute,
}) => {
  if (!Array.isArray(routes)) {
    console.error("Routes is not an array:", routes);
    return <Text>Error: Invalid routes data</Text>;
  }

  const getCityAbbreviation = (location: RouteLocation) => {
    if (!location || !location.address) return "";
    const addressParts = location.address.split(",");
    const city =
      addressParts.length > 0 ? addressParts[0].trim() : location.address;
    return truncateText(city, 15);
  };

  const renderRouteItem = ({ item }: { item: Route }) => {
    if (!item || !item.id || !item.startLocation || !item.endLocation) {
      console.error("Invalid item:", item);
      return null;
    }

    const startCity = getCityAbbreviation(item.startLocation as RouteLocation);
    const endCity = getCityAbbreviation(item.endLocation as RouteLocation);

    return (
      <View style={styles.itemContainer}>
        <View style={styles.mainContent}>
          <View style={styles.headerSection}>
            <View style={styles.routeIconContainer}>
              <Icon name="truck-delivery" size={24} color="#4A90E2" />
            </View>
            <View style={styles.routeMainInfo}>
              <View style={styles.routeCodeContainer}>
                <Text style={styles.routeCode}>{startCity}</Text>
                <Icon name="arrow-right" size={16} color="#265fa1" />
                <Text style={styles.routeCode}>{endCity}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => onSelectRoute(item)}
            style={styles.routeDetailsContainer}
            activeOpacity={0.7}
          >
            <View style={styles.routeDetails}>
              <View style={styles.detailRow}>
                <Icon name="map-marker-distance" size={16} color="#666" />
                <Text style={styles.detailText}>
                  Distância: {item.distance} km
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="clock-outline" size={16} color="#666" />
                <Text style={styles.detailText}>
                  Duração: {item.estimatedDuration} min
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="ray-start" size={16} color="#666" />
                <Text style={styles.detailText}>
                  De:{" "}
                  {truncateText(
                    (item.startLocation as RouteLocation).address,
                    30
                  )}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="ray-end" size={16} color="#666" />
                <Text style={styles.detailText}>
                  Para:{" "}
                  {truncateText(
                    (item.endLocation as RouteLocation).address,
                    30
                  )}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.footerSection}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            >
              <Icon
                name={getStatusIcon(item.status)}
                size={12}
                color="white"
                style={styles.statusIcon}
              />
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => onEditRoute(item)}
            style={[styles.actionButton, styles.editButton]}
          >
            <Icon name="pencil" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDeleteRoute(item)}
            style={[styles.actionButton, styles.deleteButton]}
          >
            <Icon name="delete" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={routes}
      renderItem={renderRouteItem}
      keyExtractor={(item) => item.id.toString()}
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
        routes.length === 0 && styles.emptyListContainer,
      ]}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Icon name="map-marker-off" size={80} color="#D1D5DB" />
          <Text style={styles.emptyText}>
            Nenhuma rota disponível no momento
          </Text>
          <Text style={styles.emptySubText}>
            Por favor, tente novamente mais tarde ou adicione novas rotas.
          </Text>
        </View>
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Em Progresso":
      return "#F59E0B";
    case "Pendente":
      return "#4A90E2";
    case "Concluído":
      return "#34D399";
    case "Cancelada":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Em Progresso":
      return "progress-clock";
    case "Pendente":
      return "clock-outline";
    case "Concluído":
      return "check-circle";
    case "Cancelada":
      return "close-circle";
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainContent: {
    flex: 1,
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  routeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#c5def7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  routeMainInfo: {
    flex: 1,
  },
  routeDetailsContainer: {
    flex: 1,
  },
  routeCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  routeCode: {
    fontSize: 16.225,
    fontWeight: "700",
    color: "#191723",
  },
  footerSection: {
    marginTop: 12,
    alignItems: "flex-start",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    color: "white",
    fontSize: 12.225,
    fontWeight: "600",
  },
  routeDetails: {
    marginTop: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  detailText: {
    marginLeft: 8,
    color: "#4B5563",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: 32,
    marginBottom: 32,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
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

export default RouteList;
