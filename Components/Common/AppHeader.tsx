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
      <View style={styles.leftContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate("home")}
        >
          <Icon name="arrow-back" size={24} color="#f5f2e5" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.centerContainer}>
        <Image
          source={require("/Users/evand/OneDrive/Documentos/TransportManager/TransportManager/Assets/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.rightContainer} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    height: 80, // Altura fixa para o header
    marginTop: 45,
    backgroundColor: "#182727",
    borderBottomWidth: 1,
    borderBottomColor: "#182727",
  },
  leftContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rightContainer: {
    flex: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 18,
    color: "#f5f2e5",
    marginLeft: 8,
  },
  logo: {
    alignSelf: "center",
    marginTop: Dimensions.get("window").height * 0.03, // Margem fixa para o topo
    width: Dimensions.get("window").width * 0.5, // Tamanho fixo para a largura
    height: Dimensions.get("window").height * 0.1, // Tamanho fixo para a altura
  },
});

export default AppHeader;
