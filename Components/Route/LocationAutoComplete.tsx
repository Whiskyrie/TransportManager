import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import debounce from "lodash/debounce";
import { ibgeService, Municipio } from "Services/ibgeApi";

interface LocationAutocompleteProps {
  value: string;
  onLocationSelect: (location: string) => void;
  placeholder: string;
  icon: string;
  error?: string;
  style?: object;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onLocationSelect,
  placeholder,
  icon,
  error,
  style,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Municipio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (term.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await ibgeService.buscarMunicipios(term);
        setSuggestions(results);
      } catch (error) {
        console.error("Erro na busca:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm]);

  const handleSelect = (municipio: Municipio) => {
    const locationString = `${municipio.nome} - ${municipio.microrregiao.mesorregiao.UF.sigla}`;
    onLocationSelect(locationString);
    setShowModal(false);
    setSuggestions([]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.inputContainer}
        onPress={() => setShowModal(true)}
      >
        <MaterialIcons
          name={icon as keyof typeof MaterialIcons.glyphMap}
          size={24}
          color="#f5f2e5"
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, error && styles.inputError, style]}
          placeholder={placeholder}
          placeholderTextColor="#a0a0a0"
          value={searchTerm}
          onChangeText={(text) => {
            setSearchTerm(text);
            setShowModal(true);
          }}
          onFocus={() => setShowModal(true)}
        />
        {isLoading && (
          <ActivityIndicator
            style={styles.loadingIndicator}
            size="small"
            color="#f5f2e5"
          />
        )}
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione a localização</Text>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#f5f2e5" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <MaterialIcons
                name="search"
                size={24}
                color="#f5f2e5"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar cidade..."
                placeholderTextColor="#a0a0a0"
                value={searchTerm}
                onChangeText={setSearchTerm}
                autoFocus
              />
            </View>

            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.suggestionText}>
                    {item.nome} - {item.microrregiao.mesorregiao.UF.sigla}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {searchTerm.length < 3
                      ? "Digite pelo menos 3 caracteres para buscar"
                      : "Nenhuma cidade encontrada"}
                  </Text>
                </View>
              }
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: 10,
    zIndex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#243636",
    borderRadius: 10,
    padding: 12,
    paddingLeft: 40,
    fontSize: 16,
    backgroundColor: "#243636",
    color: "#f5f2e5",
  },
  inputError: {
    borderColor: "#dc3545",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
  },
  loadingIndicator: {
    position: "absolute",
    right: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#1a2b2b",
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#243636",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f5f2e5",
  },
  closeButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#243636",
  },
  searchIcon: {
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#f5f2e5",
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#243636",
  },
  suggestionText: {
    fontSize: 16,
    color: "#f5f2e5",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#a0a0a0",
    fontSize: 16,
  },
});

export default LocationAutocomplete;
