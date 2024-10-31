import React, { useState, useCallback, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import AppHeader from "../../Components/Common/AppHeader";
import CustomButton from "../../Components/Common/CustomButton";
import DriverFilter from "Components/Driver/DriverFilter";
import DriverList from "Components/Driver/DriverList";
import DriverDetails from "Components/Driver/DriverDetails";
import AddDriverDialog from "Components/Driver/AddDriverDialog";
import DeleteDriverDialog from "Components/Driver/DeleteDriverDialog";
import EditDriverDialog from "Components/Driver/EditDriverDialog";
import { Drivers, DriverStatus } from "../../Types/driverTypes";
import { api, handleApiError } from "Services/api";
import { usePermissions, User } from "../../Types/authTypes";

interface DriverListScreenProps {
  onNavigate: (screen: string) => void;
  user: User | null;
}

const DriverListScreen: React.FC<DriverListScreenProps> = ({
  onNavigate,
  user,
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
  const { canEdit, canDelete, canAdd } = usePermissions(user);

  const fetchDrivers = useCallback(async () => {
    try {
      const response = await api.getAllDrivers();
      setDrivers(response.data);
      setErrorMessage("");
    } catch (error) {
      const errorMsg = handleApiError(error);
      setErrorMessage(errorMsg);
      setDrivers([]);
    }
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleAddDriver = async (newDriver: Partial<Drivers>) => {
    try {
      const response = await api.createDriver(newDriver);
      setDrivers((prevDrivers) => [...prevDrivers, response.data]);
      setIsAddDialogVisible(false);
      setErrorMessage("");
    } catch (error) {
      const errorMsg = handleApiError(error);
      setErrorMessage(`Error adding driver: ${errorMsg}`);
    }
  };

  const handleDeleteDriver = useCallback((driver: Drivers) => {
    setDriverToDelete(driver);
    setIsDeleteDialogVisible(true);
  }, []);

  const confirmDeleteDriver = async () => {
    if (!driverToDelete) return;

    try {
      await api.deleteDriver(driverToDelete.id);
      setDrivers((prevDrivers) =>
        prevDrivers.filter((driver) => driver.id !== driverToDelete.id)
      );
      setErrorMessage("");
      setIsDeleteDialogVisible(false);
      setDriverToDelete(null);
    } catch (error: unknown) {
      const isError = error instanceof Error;
      const status =
        isError && "response" in error ? (error as any).response?.status : null;

      if (status === 500) {
        setErrorMessage(
          "Não é possível excluir este motorista pois ele possui rotas associadas. Remova primeiro as rotas associadas."
        );
      } else {
        const errorMsg = handleApiError(error);
        setErrorMessage(`Error deleting driver: ${errorMsg}`);
        setIsDeleteDialogVisible(false);
        setDriverToDelete(null);
      }
    }
  };

  const handleEditDriver = useCallback((driver: Drivers) => {
    setDriverToEdit(driver);
    setIsEditDialogVisible(true);
  }, []);

  const confirmEditDriver = async (editedDriver: Partial<Drivers>) => {
    if (!driverToEdit) return;

    try {
      const response = await api.updateDriver(driverToEdit.id, editedDriver);
      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) =>
          driver.id === response.data.id ? response.data : driver
        )
      );
      setErrorMessage("");
      setIsEditDialogVisible(false);
      setDriverToEdit(null);
    } catch (error) {
      const errorMsg = handleApiError(error);
      setErrorMessage(`Error updating driver: ${errorMsg}`);
    }
  };

  const filteredDrivers = React.useMemo(() => {
    const searchTerm = searchQuery.toLowerCase();
    return drivers.filter(
      (driver) =>
        driver.name.toLowerCase().includes(searchTerm) ||
        driver.licenseNumber.toLowerCase().includes(searchTerm)
    );
  }, [drivers, searchQuery]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchDrivers();
    } finally {
      setRefreshing(false);
    }
  }, [fetchDrivers]);

  const renderHeader = useCallback(
    () => (
      <>
        <DriverFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        {canAdd && (
          <CustomButton
            title="Novo Motorista"
            onPress={() => setIsAddDialogVisible(true)}
            type="primary"
          />
        )}
        {errorMessage && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
      </>
    ),
    [searchQuery, statusFilter, canAdd, errorMessage]
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
        onDeleteDriver={canDelete ? handleDeleteDriver : null}
        onEditDriver={canEdit ? handleEditDriver : null}
      />
      {selectedDriver && (
        <DriverDetails
          driver={selectedDriver}
          onClose={() => setSelectedDriver(null)}
        />
      )}
      {canAdd && (
        <AddDriverDialog
          visible={isAddDialogVisible}
          onClose={() => setIsAddDialogVisible(false)}
          onSave={handleAddDriver}
        />
      )}
      {canDelete && driverToDelete && (
        <DeleteDriverDialog
          visible={isDeleteDialogVisible}
          onClose={() => setIsDeleteDialogVisible(false)}
          onConfirm={confirmDeleteDriver}
          driverId={driverToDelete.id}
          driverName={driverToDelete.name}
        />
      )}
      {canEdit && driverToEdit && (
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

export default DriverListScreen;
