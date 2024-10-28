import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomInput from "../Common/CustomInput";
import { RouteStatus } from "../../Types/routeTypes";

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
  <View style={styles.container}>
    <CustomInput
      style={styles.input}
      label="Procurar Rota"
      value={searchQuery}
      onChangeText={setSearchQuery}
      placeholder="Buscar por cidade de origem ou destino"
    />
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={statusFilter}
        onValueChange={(itemValue) =>
          setStatusFilter(itemValue as RouteStatus | "All")
        }
        style={styles.picker}
        dropdownIconColor="#f5f2e5"
        mode="dropdown"
      >
        <Picker.Item label="Todas" value="All" style={styles.pickerItem} />
        <Picker.Item
          label="Em Progresso"
          value="Em Progresso"
          style={styles.pickerItem}
        />
        <Picker.Item
          label="Pendente"
          value="Pendente"
          style={styles.pickerItem}
        />
        <Picker.Item
          label="Concluído"
          value="Concluído"
          style={styles.pickerItem}
        />
      </Picker>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    borderRadius: 8,
    borderColor: "#1a2b2b",
  },
  pickerContainer: {
    marginTop: 10,
    backgroundColor: "#1a2b2b",
    borderRadius: 5,
    overflow: "hidden",
    ...Platform.select({
      android: {
        elevation: 0,
      },
      ios: {
        shadowColor: "transparent",
      },
    }),
  },
  picker: {
    backgroundColor: "#1a2b2b",
    color: "#f5f2e5",
    height: 50,
    ...Platform.select({
      android: {
        borderWidth: 0,
      },
      ios: {
        borderWidth: 0,
      },
    }),
  },
  pickerItem: {
    backgroundColor: "#1a2b2b",
    color: "#f5f2e5",
    fontSize: 16,
  },
});

export default RouteFilter;
