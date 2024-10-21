import React from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomInput from "./CustomInput";
import { VehicleStatus } from "./Types";

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
    <Picker
      selectedValue={statusFilter}
      onValueChange={(itemValue) =>
        setStatusFilter(itemValue as VehicleStatus | "All")
      }
    >
      <Picker.Item label="Todos" value="All" />
      <Picker.Item label="Disponível" value="Disponível" />
      <Picker.Item label="Indisponível" value="Indisponível" />
      <Picker.Item label="Em manutenção" value="Em manutenção" />
    </Picker>
  </View>
);

export default VehicleFilter;
