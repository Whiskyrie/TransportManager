import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const AppHeader: React.FC<{ onNavigate: (screen: string) => void }> = ({
  onNavigate,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => onNavigate("home")}
      >
        <Icon name="arrow-back" size={24} color="#007bff" />
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>
      <Image
        source={require("/Users/evand/OneDrive/Documentos/TransportManager/TransportManager/Assets/icon.png")}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginTop: 30,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 18,
    color: "#007bff",
    marginLeft: 8,
  },
  logo: {
    width: Dimensions.get("window").width * 0.155,
    height: undefined,
    aspectRatio: 1,
  },
});

export default AppHeader;
