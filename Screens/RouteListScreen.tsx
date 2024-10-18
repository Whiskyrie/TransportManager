import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import AppHeader from "../Components/Route/AppHeader";
import CustomButton from "../Components/Route/CustomButton";
import RouteFilter from "../Components/Route/RouteFilter";
import RouteList from "../Components/Route/RouteList";
import RouteDetails from "../Components/Route/RouteDetails";
import AddRouteDialog from "../Components/Route/AddRouteDialog";
import DeleteRouteDialog from "../Components/Route/DeleteRouteDialog";
import EditRouteDialog from "../Components/Route/EditRouteDialog";
import { Route, RouteStatus, RouteLocation } from "../Components/Route/Types";
import { api, handleApiError } from "../api";

const formatRoutes = (routes: Route[]): Route[] => {
  return routes.map((route): Route => {
    let startLocation: RouteLocation = { address: "" };
    let endLocation: RouteLocation = { address: "" };

    if (!route.id || !route.startLocation || !route.endLocation) {
      console.warn("Rota inválida encontrada:", route);
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
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [routeToDelete, setRouteToDelete] = useState<Route | null>(null);
  const [routeToEdit, setRouteToEdit] = useState<Route | null>(null);

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

  const handleDeleteRoute = (route: Route) => {
    setRouteToDelete(route);
    setIsDeleteDialogVisible(true);
  };

  const confirmDeleteRoute = async () => {
    if (routeToDelete) {
      try {
        await api.deleteRoute(routeToDelete.id);
        setRoutes((prevRoutes) =>
          prevRoutes.filter((route) => route.id !== routeToDelete.id)
        );
        setErrorMessage("");
      } catch (error) {
        const errorMsg = handleApiError(error);
        setErrorMessage(`Error deleting route: ${errorMsg}`);
      }
    }
    setIsDeleteDialogVisible(false);
    setRouteToDelete(null);
  };

  const handleEditRoute = (route: Route) => {
    setRouteToEdit(route);
    setIsEditDialogVisible(true);
  };

  const confirmEditRoute = async (editedRoute: Partial<Route>) => {
    if (routeToEdit) {
      try {
        const response = await api.updateRoute(routeToEdit.id, editedRoute);
        const updatedRoute = formatRoutes([response.data])[0];
        setRoutes((prevRoutes) =>
          prevRoutes.map((route) =>
            route.id === updatedRoute.id ? updatedRoute : route
          )
        );
        setErrorMessage("");
      } catch (error) {
        const errorMsg = handleApiError(error);
        setErrorMessage(`Error updating route: ${errorMsg}`);
      }
    }
    setIsEditDialogVisible(false);
    setRouteToEdit(null);
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
        onDeleteRoute={handleDeleteRoute}
        onEditRoute={handleEditRoute}
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
      <DeleteRouteDialog
        visible={isDeleteDialogVisible}
        onClose={() => setIsDeleteDialogVisible(false)}
        onConfirm={confirmDeleteRoute}
      />
      {routeToEdit && (
        <EditRouteDialog
          visible={isEditDialogVisible}
          onClose={() => setIsEditDialogVisible(false)}
          onSave={confirmEditRoute}
          route={routeToEdit}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    width: "100%",
  },
  header: {
    padding: 16,
    backgroundColor: "white",
  },
  listContent: {
    paddingHorizontal: 16,
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default RoutesListScreen;
