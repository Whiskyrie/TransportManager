import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import AppHeader from "../Components/Route/AppHeader";
import CustomButton from "../Components/Route/CustomButton";
import RouteFilter from "../Components/Route/RouteFilter";
import RouteList from "../Components/Route/RouteList";
import RouteDetails from "../Components/Route/RouteDetails";
import AddRouteDialog from "../Components/Route/AddRouteDialog";
import { Route, RouteStatus, RouteLocation } from "../Components/Route/Types";
import { api, handleApiError } from "../api";

const formatRoutes = (routes: Route[]): Route[] => {
  return routes.map((route): Route => {
    let startLocation: RouteLocation = { address: "" };
    let endLocation: RouteLocation = { address: "" };

    if (!route.id || !route.startLocation || !route.endLocation) {
      console.warn("Rota inválida encontrada:", route);
      // Você pode optar por retornar um objeto Route padrão ou pular esta rota
      return {
        id: route.id || "",
        distance: 0,
        estimatedDuration: 0,
        status: "Pendente",
        startLocation: { address: "" },
        endLocation: { address: "" },
      };
    }

    // Processa startLocation
    if (typeof route.startLocation === "string") {
      try {
        startLocation = JSON.parse(route.startLocation);
      } catch (e) {
        startLocation = {
          address: route.startLocation,
        };
      }
    } else if (route.startLocation && typeof route.startLocation === "object") {
      startLocation = {
        address: route.startLocation.address || "",
      };
    }

    // Processa endLocation
    if (typeof route.endLocation === "string") {
      try {
        endLocation = JSON.parse(route.endLocation);
      } catch (e) {
        endLocation = { address: route.endLocation };
      }
    } else if (route.endLocation && typeof route.endLocation === "object") {
      endLocation = {
        address: route.endLocation.address || "",
      };
    }

    // Retorna um objeto Route com valores padrão para campos ausentes
    return {
      id: route.id || "",
      distance: route.distance || 0,
      estimatedDuration: route.estimatedDuration || 0,
      status: route.status || "Pendente",
      startLocation,
      endLocation,
    };
  });
};

const RoutesListScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RouteStatus | "All">("All");
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchRoutes = async () => {
    try {
      const response = await api.getAllRoutes();
      console.log("Routes fetched:", response.data);
      const formattedRoutes = Array.isArray(response.data)
        ? formatRoutes(response.data)
        : [];
      setRoutes(formattedRoutes);
      setErrorMessage("");
    } catch (error) {
      const errorMsg = handleApiError(error);
      setErrorMessage(errorMsg);
      setRoutes([]);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleAddRoute = async (newRoute: Partial<Route>) => {
    try {
      const response = await api.createRoute(newRoute);
      const savedRoute = formatRoutes([response.data])[0];
      setRoutes((prevRoutes) => [...prevRoutes, savedRoute]);
      console.log("New route saved:", savedRoute);
      setErrorMessage("");
    } catch (error) {
      const errorMsg = handleApiError(error);
      setErrorMessage(`Error adding route: ${errorMsg}`);
    }
  };

  const filteredRoutes = routes.filter(
    (route) =>
      (statusFilter === "All" || route.status === statusFilter) &&
      route.id &&
      route.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRoutes().finally(() => setRefreshing(false));
  }, []);

  const renderHeader = () => (
    <>
      <RouteFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <CustomButton
        title="Nova Rota"
        onPress={() => setIsAddDialogVisible(true)}
        type="primary"
      />
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </>
  );

  return (
    <View style={styles.container}>
      <AppHeader />
      <RouteList
        routes={filteredRoutes}
        onSelectRoute={setSelectedRoute}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={renderHeader()}
        contentContainerStyle={styles.listContent}
      />
      {selectedRoute && (
        <RouteDetails
          route={selectedRoute}
          onClose={() => setSelectedRoute(null)}
        />
      )}
      <AddRouteDialog
        visible={isAddDialogVisible}
        onClose={() => setIsAddDialogVisible(false)}
        onSave={handleAddRoute}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default RoutesListScreen;
