import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import AppHeader from "../Components/Driver/AppHeader";
import CustomButton from "../Components/Driver/CustomButton";
import DriverFilter from "Components/Driver/DriverFilter";
import DriverList from "Components/Driver/DriverList";
import DriverDetails from "Components/Driver/DriverDetails";
import AddDriverDialog from "Components/Driver/AddDriverDialog";
import DeleteDriverDialog from "Components/Driver/DeleteRouteDriver";
import EditDriverDialog from "Components/Driver/EditDriverDialog";
import { Drivers, DriverStatus } from "../Components/Driver/Types";
import { api, handleApiError } from "../api";

const DriverListScreen: React.FC<{ onNavigate: (screen: string) => void }> = ({
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DriverStatus | "All">("All");
  const [selectedDriver, setSelectedDriver] = useState<Drivers | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [drivers, setDrivers] = useState<Drivers[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [driverToDelete, setDriverToDelete] = useState<Drivers | null>(null);
  const [driverToEdit, setDriverToEdit] = useState<Drivers | null>(null);

  const fetchDrivers = async () => {
    try {
      const response = await api.getAllDrivers();
      setDrivers(response.data);
      setErrorMessage("");
    } catch (error) {
      const errorMsg = handleApiError(error);
      setErrorMessage(errorMsg);
      setDrivers([]);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleAddDriver = async (newDriver: Partial<Drivers>) => {
    try {
      const response = await api.createDriver(newDriver);
      setDrivers((prevDrivers) => [...prevDrivers, response.data]);
      setErrorMessage("");
    } catch (error) {
      const errorMsg = handleApiError(error);
      setErrorMessage(`Error adding driver: ${errorMsg}`);
    }
  };

  const handleDeleteDriver = (driver: Drivers) => {
    setDriverToDelete(driver);
    setIsDeleteDialogVisible(true);
  };

  const confirmDeleteDriver = async () => {
    if (driverToDelete) {
      try {
        await api.deleteDriver(driverToDelete.id);
        setDrivers((prevDrivers) =>
          prevDrivers.filter((driver) => driver.id !== driverToDelete.id)
        );
        setErrorMessage("");
      } catch (error) {
        const errorMsg = handleApiError(error);
        setErrorMessage(`Error deleting driver: ${errorMsg}`);
      }
    }
    setIsDeleteDialogVisible(false);
    setDriverToDelete(null);
  };

  const handleEditDriver = (driver: Drivers) => {
    setDriverToEdit(driver);
    setIsEditDialogVisible(true);
  };

  const confirmEditDriver = async (editedDriver: Partial<Drivers>) => {
    if (driverToEdit) {
      try {
        const response = await api.updateDriver(driverToEdit.id, editedDriver);
        setDrivers((prevDrivers) =>
          prevDrivers.map((driver) =>
            driver.id === response.data.id ? response.data : driver
          )
        );
        setErrorMessage("");
      } catch (error) {
        const errorMsg = handleApiError(error);
        setErrorMessage(`Error updating driver: ${errorMsg}`);
      }
    }
    setIsEditDialogVisible(false);
    setDriverToEdit(null);
  };

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDrivers().finally(() => setRefreshing(false));
  }, []);

  const renderHeader = () => (
    <>
      <DriverFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <CustomButton
        title="Novo Motorista"
        onPress={() => setIsAddDialogVisible(true)}
        type="primary"
      />
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </>
  );

  return (
    <View style={styles.container}>
      <AppHeader onNavigate={onNavigate} />
      <DriverList
        drivers={filteredDrivers}
        onSelectDriver={setSelectedDriver}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={renderHeader()}
        contentContainerStyle={styles.listContent}
        onDeleteDriver={handleDeleteDriver}
        onEditDriver={handleEditDriver}
      />
      {selectedDriver && (
        <DriverDetails
          driver={selectedDriver}
          onClose={() => setSelectedDriver(null)}
        />
      )}
      <AddDriverDialog
        visible={isAddDialogVisible}
        onClose={() => setIsAddDialogVisible(false)}
        onSave={handleAddDriver}
      />
      <DeleteDriverDialog
        visible={isDeleteDialogVisible}
        onClose={() => setIsDeleteDialogVisible(false)}
        onConfirm={confirmDeleteDriver}
      />
      {driverToEdit && (
        <EditDriverDialog
          visible={isEditDialogVisible}
          onClose={() => setIsEditDialogVisible(false)}
          onSave={confirmEditDriver}
          driver={driverToEdit}
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

export default DriverListScreen;
