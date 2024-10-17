import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import AppHeader from "../Components/Route/AppHeader";
import CustomButton from "../Components/Route/CustomButton";
import RouteMap from "../Components/Route/RouteMap";
import RouteFilter from "../Components/Route/RouteFilter";
import RouteList from "../Components/Route/RouteList";
import RouteDetails from "../Components/Route/RouteDetails";
import AddRouteDialog from "../Components/Route/AddRouteDialog";
import { Route, RouteStatus } from "../Components/Route/Types";
import { api, handleApiError } from "../api";

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
      console.log("Rotas buscadas:", response.data);
      setRoutes(response.data);
      setErrorMessage(""); // Limpa qualquer mensagem de erro anterior
    } catch (error) {
      const errorMsg = handleApiError(error);
      setErrorMessage(errorMsg);
      setRoutes([]); // Limpa as rotas em caso de erro
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleAddRoute = async (newRoute: Partial<Route>) => {
    try {
      const response = await api.createRoute(newRoute);
      const savedRoute = response.data;
      setRoutes((prevRoutes) => [...prevRoutes, savedRoute]);
      console.log("Nova rota salva:", savedRoute);
      setErrorMessage(""); // Limpa qualquer mensagem de erro anterior
    } catch (error) {
      const errorMsg = handleApiError(error);
      setErrorMessage(`Erro ao adicionar rota: ${errorMsg}`);
    }
  };

  const filteredRoutes = routes.filter(
    (route) =>
      route &&
      (statusFilter === "All" || route.status === statusFilter) &&
      route.code && // Verifica se `code` não é `undefined`
      route.code.includes(searchQuery)
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRoutes().finally(() => setRefreshing(false));
  }, []);

  const renderHeader = () => (
    <>
      <RouteMap routes={filteredRoutes} />
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
    backgroundColor: "#F5F5F5",
  },
  listContent: {
    padding: 14,
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default RoutesListScreen;
