import React from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomInput from "../Common/CustomInput";
import { RouteStatus } from "../Route/Types";

interface RouteFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: RouteStatus | "All";
  setStatusFilter: (status: RouteStatus | "All") => void;
}

const RouteFilter: React.FC<RouteFilterProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}) => (
  <View>
    <CustomInput
      label="Procurar Rota"
      value={searchQuery}
      onChangeText={setSearchQuery}
      placeholder="Buscar por cidade de origem ou destino"
    />
    <Picker
      selectedValue={statusFilter}
      onValueChange={(itemValue) =>
        setStatusFilter(itemValue as RouteStatus | "All")
      }
    >
      <Picker.Item label="Todas" value="All" />
      <Picker.Item label="Em Progresso" value="Em Progresso" />
      <Picker.Item label="Pendente" value="Pendente" />
      <Picker.Item label="Concluído" value="Concluído" />
    </Picker>
  </View>
);

export default RouteFilter;
