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
        <TouchableOpacity
          onPress={() => onSelectRoute(item)}
          style={styles.routeInfoContainer}
        >
          <View style={styles.routeInfo}>
            <Text style={styles.routeCode}>{`${startCity} - ${endCity}`}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          <View style={styles.routeDetails}>
            <Text>Distância: {item.distance} km</Text>
            <Text>Duração Estimada: {item.estimatedDuration} min</Text>
            <Text>
              De:{" "}
              {truncateText((item.startLocation as RouteLocation).address, 30)}
            </Text>
            <Text>
              Para:{" "}
              {truncateText((item.endLocation as RouteLocation).address, 30)}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => onEditRoute(item)}
            style={styles.actionButton}
          >
            <Icon name="pencil" size={24} color="#007bff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDeleteRoute(item)}
            style={styles.actionButton}
          >
            <Icon name="delete" size={24} color="#dc3545" />
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
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={contentContainerStyle}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Icon name="map-marker-off" size={64} color="#808080" />
          <Text style={styles.emptyText}>
            Nenhuma rota disponível no momento
          </Text>
          <Text style={styles.emptySubText}>
            Por favor, tente novamente mais tarde ou adicione novas rotas.
          </Text>
        </View>
      }
    />
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Em Progresso":
      return "#FFA500";
    case "Pendente":
      return "#4169E1";
    case "Concluído":
      return "#32CD32";
    case "Cancelada":
      return "#FF0000";
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
  routeInfoContainer: {
    flex: 1,
  },
  routeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routeCode: {
    fontWeight: "bold",
    fontSize: 14,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  statusText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  routeDetails: {
    marginTop: 4,
  },
  detailText: {
    fontSize: 12,
    color: "#666",
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

export default RouteList;
