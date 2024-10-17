import React from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  Text,
  ViewStyle,
} from "react-native";
import { truncateText } from "../../Utils/helper";
import { Route, RouteLocation } from "../Route/Types";

interface RouteListProps {
  routes: Route[];
  onSelectRoute: (route: Route) => void;
  refreshing: boolean;
  onRefresh: () => void;
  ListHeaderComponent?: React.ReactElement;
  contentContainerStyle?: ViewStyle;
}

const RouteList: React.FC<RouteListProps> = ({
  routes,
  onSelectRoute,
  refreshing,
  onRefresh,
  ListHeaderComponent,
  contentContainerStyle,
}) => {
  console.log("Recebendo rotas para exibir:", routes);

  const renderRouteItem = ({ item }: { item: Route }) => (
    <View style={styles.itemContainer} onTouchEnd={() => onSelectRoute(item)}>
      <View style={styles.routeInfo}>
        <Text style={styles.routeCode}>{truncateText(item.code, 8)}</Text>
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
          De: {truncateText((item.startLocation as RouteLocation).address, 30)}
        </Text>
        <Text>
          Para: {truncateText((item.endLocation as RouteLocation).address, 30)}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={routes}
      renderItem={renderRouteItem}
      keyExtractor={(item) => item.code.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={contentContainerStyle}
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
    default:
      return "#808080";
  }
};

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  routeInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  routeCode: {
    fontWeight: "bold",
    fontSize: 16,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  routeDetails: {
    marginTop: 10,
  },
});

export default RouteList;
