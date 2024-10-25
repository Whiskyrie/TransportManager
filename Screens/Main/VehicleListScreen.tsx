import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import AppHeader from "../../Components/Common/AppHeader";
import CustomButton from "../../Components/Common/CustomButton";
import VehicleFilter from "../../Components/Vehicle/VehicleFilter";
import VehicleList from "../../Components/Vehicle/VehicleList";
import VehicleDetails from "../../Components/Vehicle/VehicleDetails";
import AddVehicleDialog from "../../Components/Vehicle/AddVehicleDialog";
import DeleteVehicleDialog from "../../Components/Vehicle/DeleteRouteVehicle";
import EditVehicleDialog from "../../Components/Vehicle/EditVehicleDialog";
import { Vehicles, VehicleStatus } from "../../Components/Vehicle/Types";
import { api, handleApiError } from "../../api";

const VehicleListScreen: React.FC<{ onNavigate: (screen: string) => void }> = ({
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "All">(
    "All"
  );
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicles | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicles[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicles | null>(null);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicles | null>(null);

  const fetchVehicles = async () => {
    try {
      const response = await api.getAllVehicles();
      setVehicles(response.data);
      setErrorMessage("");
    } catch (error) {
      const errorMsg = handleApiError(error);
      setErrorMessage(errorMsg);
      setVehicles([]);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAddVehicle = async (newVehicle: Partial<Vehicles>) => {
    try {
      const response = await api.createVehicle(newVehicle);
      setVehicles((prevVehicles) => [...prevVehicles, response.data]);
      setErrorMessage("");
    } catch (error) {
      const errorMsg = handleApiError(error);
      setErrorMessage(`Error adding vehicle: ${errorMsg}`);
    }
  };

  const handleDeleteVehicle = (vehicle: Vehicles) => {
    setVehicleToDelete(vehicle);
    setIsDeleteDialogVisible(true);
  };

  const confirmDeleteVehicle = async () => {
    if (vehicleToDelete) {
      try {
        await api.deleteVehicle(vehicleToDelete.id);
        setVehicles((prevVehicles) =>
          prevVehicles.filter((vehicle) => vehicle.id !== vehicleToDelete.id)
        );
        setErrorMessage("");
      } catch (error) {
        const errorMsg = handleApiError(error);
        setErrorMessage(`Error deleting vehicle: ${errorMsg}`);
      }
    }
    setIsDeleteDialogVisible(false);
    setVehicleToDelete(null);
  };

  const handleEditVehicle = (vehicle: Vehicles) => {
    setVehicleToEdit(vehicle);
    setIsEditDialogVisible(true);
  };

  const confirmEditVehicle = async (editedVehicle: Partial<Vehicles>) => {
    if (vehicleToEdit) {
      try {
        const response = await api.updateVehicle(
          vehicleToEdit.id,
          editedVehicle
        );
        setVehicles((prevVehicles) =>
          prevVehicles.map((vehicle) =>
            vehicle.id === response.data.id ? response.data : vehicle
          )
        );
        setErrorMessage("");
      } catch (error) {
        const errorMsg = handleApiError(error);
        setErrorMessage(`Error updating vehicle: ${errorMsg}`);
      }
    }
    setIsEditDialogVisible(false);
    setVehicleToEdit(null);
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      (statusFilter === "All" || vehicle.status === statusFilter) &&
      (vehicle.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchVehicles().finally(() => setRefreshing(false));
  }, []);

  const renderHeader = () => (
    <>
      <VehicleFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <CustomButton
        title="Novo Veículo"
        onPress={() => setIsAddDialogVisible(true)}
        type="primary"
      />
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </>
  );

  return (
    <View style={styles.container}>
      <AppHeader onNavigate={onNavigate} />
      <VehicleList
        vehicles={filteredVehicles}
        onSelectVehicle={setSelectedVehicle}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={renderHeader()}
        contentContainerStyle={styles.listContent}
        onDeleteVehicle={handleDeleteVehicle}
        onEditVehicle={handleEditVehicle}
      />
      {selectedVehicle && (
        <VehicleDetails
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
      <AddVehicleDialog
        visible={isAddDialogVisible}
        onClose={() => setIsAddDialogVisible(false)}
        onSave={handleAddVehicle}
      />
      <DeleteVehicleDialog
        visible={isDeleteDialogVisible}
        onClose={() => setIsDeleteDialogVisible(false)}
        onConfirm={confirmDeleteVehicle}
      />
      {vehicleToEdit && (
        <EditVehicleDialog
          visible={isEditDialogVisible}
          onClose={() => setIsEditDialogVisible(false)}
          onSave={confirmEditVehicle}
          vehicle={vehicleToEdit}
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
  listContent: {
    paddingHorizontal: 16,
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default VehicleListScreen;
