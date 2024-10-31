// DriverFilter.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import CustomInput from "../Common/CustomInput";
import { DriverStatus } from "../../Types/driverTypes";

interface DriverFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: DriverStatus | "All";
  setStatusFilter: (status: DriverStatus | "All") => void;
}

const DriverFilter: React.FC<DriverFilterProps> = ({
  searchQuery,
  setSearchQuery,
}) => (
  <View>
    <CustomInput
      style={styles.input}
      label="Procurar Motorista"
      value={searchQuery}
      onChangeText={setSearchQuery}
      placeholder="Digite o nome ou CNH"
    />
  </View>
);

const styles = StyleSheet.create({
  input: {
    borderRadius: 8,
    borderColor: "#1a2b2b",
  },
});

export default DriverFilter;
