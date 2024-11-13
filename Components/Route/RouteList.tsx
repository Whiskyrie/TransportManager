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
import { Route, RouteLocation } from "../../Types/routeTypes";

interface RouteListProps {
  routes: Route[];
  onSelectRoute: (route: Route) => void;
  refreshing: boolean;
  onRefresh: () => void;
  ListHeaderComponent?: React.ReactElement;
  contentContainerStyle?: ViewStyle;
  onDeleteRoute?: ((route: Route) => void) | null;
  onEditRoute?: ((route: Route) => void) | null;
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
    return truncateText(city, 50);
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
        <View
          style={[
            styles.mainContent,
            !onEditRoute && !onDeleteRoute && styles.mainContentFullWidth,
          ]}
        >
          <View style={styles.headerSection}>
            <View style={styles.routeIconContainer}>
              <Icon name="truck-delivery" size={24} color="#1a2b2b" />
            </View>
            <View style={styles.routeMainInfo}>
              <View style={styles.routeCodeContainer}>
                <Text style={styles.routeCode}>{startCity}</Text>
                <Icon name="arrow-right" size={16} color="#539a9a" />
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
                <Icon name="identifier" size={16} color="#a51912" />
                <Text style={styles.detailText}>
                  ID: #{item.id.slice(0, 8).toUpperCase()}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="map-marker-distance" size={16} color="#a51912" />
                <Text style={styles.detailText}>
                  Distância: {item.distance} km
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="clock-outline" size={16} color="#a51912" />
                <Text style={styles.detailText}>
                  Duração: {Math.floor(item.estimatedDuration / 60)}h{" "}
                  {item.estimatedDuration % 60}m
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="map-marker-radius" size={16} color="#a51912" />
                <Text style={styles.detailText}>
                  De:{" "}
                  {truncateText(
                    (item.startLocation as RouteLocation).address,
                    50
                  )}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="map-marker-check" size={16} color="#a51912" />
                <Text style={styles.detailText}>
                  Para:{" "}
                  {truncateText(
                    (item.endLocation as RouteLocation).address,
                    50
                  )}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="account-tie" size={16} color="#a51912" />
                <Text style={styles.detailText}>
                  Motorista: {item.driver.name}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="truck" size={16} color="#a51912" />
                <Text style={styles.detailText}>
                  Veículo: {item.vehicle.model} - {item.vehicle.plate}
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

        {(onEditRoute || onDeleteRoute) && (
          <View style={styles.actionButtons}>
            {onEditRoute && (
              <TouchableOpacity
                onPress={() => onEditRoute(item)}
                style={[styles.actionButton, styles.editButton]}
              >
                <Icon name="pencil" size={20} color="#FFF" />
              </TouchableOpacity>
            )}
            {onDeleteRoute && (
              <TouchableOpacity
                onPress={() => onDeleteRoute(item)}
                style={[styles.actionButton, styles.deleteButton]}
              >
                <Icon name="delete" size={20} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
        )}
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
          colors={["#a51912"]}
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
      return "#e66c25";
    case "Pendente":
      return "#2d7ad2";
    case "Concluído":
      return "#19aa0c";
    case "Cancelada":
      return "#ca0d0d";
    default:
      return "#6B7280";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Em Progresso":
      return "clock-time-five";
    case "Pendente":
      return "clock-alert";
    case "Concluído":
      return "check-circle";
    case "Cancelada":
      return "close-circle";
    default:
      return "help-circle";
  }
};

const styles = StyleSheet.create({
  routeIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  routeId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f5f2e5",
    marginLeft: 4,
  },
  listContainer: {
    padding: 16,
    width: "100%",
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
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2.425,
    },
    shadowOpacity: 0.225,
    shadowRadius: 5.25,
    elevation: 8,
  },
  mainContent: {
    flex: 1,
    marginRight: 16,
  },
  mainContentFullWidth: {
    flex: 1,
    marginRight: 0,
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
    backgroundColor: "#f1f1f1",
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
    color: "#f5f2e5",
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
    color: "#171717",
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
    color: "#f5f2e5",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 20,
    marginBottom: 15,
    marginTop: 15,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 22,
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

export default RouteList;
