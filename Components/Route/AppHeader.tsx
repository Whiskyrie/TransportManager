import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const AppHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <Image
        source={require("/Users/evand/OneDrive/Documentos/TransportManager/TransportManager/Assets/icon.png")} // Certifique-se de ter este arquivo na pasta assets
        style={styles.logo}
      />
      <Text style={styles.title}>Rubi Ride</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginTop: 30,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default AppHeader;
