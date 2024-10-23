// DriverFilter.tsx
import React from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomInput from "../Driver/CustomInput";
import { DriverStatus } from "./Types";

interface DriverFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: DriverStatus | "All";
  setStatusFilter: (status: DriverStatus | "All") => void;
}

const DriverFilter: React.FC<DriverFilterProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}) => (
  <View>
    <CustomInput
      label="Procurar Motorista"
      value={searchQuery}
      onChangeText={setSearchQuery}
      placeholder="Digite o nome ou CNH"
    />
    <Picker
      selectedValue={statusFilter}
      onValueChange={(itemValue) =>
        setStatusFilter(itemValue as DriverStatus | "All")
      }
    >
      <Picker.Item label="Todos" value="All" />
      <Picker.Item label="Disponível" value="Disponível" />
      <Picker.Item label="Em serviço" value="Em serviço" />
      <Picker.Item label="De folga" value="De folga" />
    </Picker>
  </View>
);

export default DriverFilter;
