import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import AppHeader from "../../Components/Common/AppHeader";
import CustomButton from "../../Components/Common/CustomButton";
import RouteFilter from "../../Components/Route/RouteFilter";
import RouteList from "../../Components/Route/RouteList";
import RouteDetails from "../../Components/Route/RouteDetails";
import AddRouteDialog from "../../Components/Route/AddRouteDialog";
import DeleteRouteDialog from "../../Components/Route/DeleteRouteDialog";
import EditRouteDialog from "../../Components/Route/EditRouteDialog";
import { Route, RouteStatus, RouteLocation } from "../../Types/routeTypes";
import { api, handleApiError } from "Services/api";
import { Vehicles } from "Types/vehicleTypes";
import { Drivers } from "Types/driverTypes";
import { usePermissions, User } from "../../Types/authTypes";

const formatRoutes = (routes: Route[]): Route[] => {
  return routes.map((route): Route => {
    let startLocation: RouteLocation = { address: "" };
    let endLocation: RouteLocation = { address: "" };

    if (!route.id) {
      console.warn("Rota inválida encontrada:", route);
      return route;
    }

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
      ...route,
      id: route.id,
      distance: route.distance || 0,
      estimatedDuration: route.estimatedDuration || 0,
      status: route.status || "Pendente",
      startLocation: startLocation,
      endLocation: endLocation,
      vehicle: route.vehicle as Vehicles,
      driver: route.driver as Drivers,
    };
  });
};

const RoutesListScreen: React.FC<{
  onNavigate: (screen: string) => void;
  user: User | null;
}> = ({ onNavigate, user }) => {
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
  const { canEdit, canDelete, canAdd } = usePermissions(user);

  const fetchRoutes = async () => {
    try {
      const response = await api.getAllRoutes();
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

  const handleAddRoute = useCallback(async (newRoute: Partial<Route>) => {
    try {
      const response = await api.createRoute(newRoute);
      const savedRoute = formatRoutes([response.data])[0];
      setRoutes((prevRoutes) => [...prevRoutes, savedRoute]);
      setErrorMessage("");
    } catch (error) {
      const errorMsg = handleApiError(error);
      setErrorMessage(`Error adding route: ${errorMsg}`);
      throw error; // Propaga o erro para ser tratado no AddRouteDialog
    }
  }, []);

  const handleUpdateVehicle = async (
    vehicleId: string,
    updates: Partial<Vehicles>
  ) => {
    if (!vehicleId) {
      throw new Error("ID do veículo não fornecido");
    }
    try {
      await api.updateVehicle(vehicleId, updates);
    } catch (error) {
      const errorMsg = handleApiError(error);
      setErrorMessage(`Error updating vehicle: ${errorMsg}`);
      throw error;
    }
  };

  const handleDeleteRoute = (route: Route) => {
    if (!route) {
      console.warn("Tentativa de deletar uma rota inválida");
      return;
    }
    if (!route.vehicle) {
      console.warn("Rota sem veículo associado");
      return;
    }
    setRouteToDelete(route);
    setIsDeleteDialogVisible(true);
  };

  const confirmDeleteRoute = async () => {
    if (!routeToDelete) {
      console.warn("Nenhuma rota selecionada para deletar");
      setIsDeleteDialogVisible(false);
      return;
    }

    try {
      // Se tiver um veículo associado, atualize seu status
      if (routeToDelete.vehicle && routeToDelete.vehicle.id) {
        await handleUpdateVehicle(routeToDelete.vehicle.id, {
          status: "Disponível",
        });
      }

      await api.deleteRoute(routeToDelete.id);
      setRoutes((prevRoutes) =>
        prevRoutes.filter((route) => route.id !== routeToDelete.id)
      );
      setErrorMessage("");
    } catch (error) {
      const errorMsg = handleApiError(error);
      setErrorMessage(`Error deleting route: ${errorMsg}`);
    } finally {
      setIsDeleteDialogVisible(false);
      setRouteToDelete(null);
    }
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

  const filteredRoutes = routes.filter((route) => {
    const matchesStatus =
      statusFilter === "All" || route.status === statusFilter;

    if (!matchesStatus) return false;

    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    const startAddress =
      typeof route.startLocation === "object"
        ? route.startLocation.address?.toLowerCase()
        : "";
    const endAddress =
      typeof route.endLocation === "object"
        ? route.endLocation.address?.toLowerCase()
        : "";

    return (
      startAddress.includes(searchLower) || endAddress.includes(searchLower)
    );
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRoutes().finally(() => setRefreshing(false));
  }, []);
  const renderDeleteDialog = () => {
    if (!canDelete || !isDeleteDialogVisible || !routeToDelete?.vehicle) {
      return null;
    }

    return (
      <DeleteRouteDialog
        visible={isDeleteDialogVisible}
        onClose={() => {
          setIsDeleteDialogVisible(false);
          setRouteToDelete(null);
        }}
        onConfirm={confirmDeleteRoute}
        route={routeToDelete}
        onUpdateVehicle={handleUpdateVehicle}
      />
    );
  };

  const renderHeader = () => (
    <>
      <RouteFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      {canAdd && (
        <CustomButton
          title="Nova Rota"
          onPress={() => setIsAddDialogVisible(true)}
          type="primary"
        />
      )}
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </>
  );

  return (
    <View style={styles.container}>
      <AppHeader onNavigate={onNavigate} />
      <RouteList
        routes={filteredRoutes}
        onSelectRoute={setSelectedRoute}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={renderHeader()}
        contentContainerStyle={styles.listContent}
        onDeleteRoute={canDelete ? handleDeleteRoute : null}
        onEditRoute={canEdit ? handleEditRoute : null}
      />
      {selectedRoute && (
        <RouteDetails
          route={selectedRoute}
          onClose={() => setSelectedRoute(null)}
        />
      )}
      {canAdd && (
        <AddRouteDialog
          visible={isAddDialogVisible}
          onClose={() => setIsAddDialogVisible(false)}
          onSave={handleAddRoute}
        />
      )}
      {renderDeleteDialog()}

      {canEdit && routeToEdit && (
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
    backgroundColor: "#182727",
    width: "100%",
  },
  listContent: {
    paddingHorizontal: 16,
  },
  errorMessage: {
    color: "#5d0000",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default RoutesListScreen;
