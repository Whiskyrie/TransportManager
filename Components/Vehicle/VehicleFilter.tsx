import React from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomInput from "../Common/CustomInput";
import { VehicleStatus } from "../../Types/vehicleTypes";

interface VehicleFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: VehicleStatus | "All";
  setStatusFilter: (status: VehicleStatus | "All") => void;
}

const VehicleFilter: React.FC<VehicleFilterProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}) => (
  <View>
    <CustomInput
      label="Procurar Veículo"
      value={searchQuery}
      onChangeText={setSearchQuery}
      placeholder="Digite a placa, modelo ou marca"
    />
  </View>
);

export default VehicleFilter;
