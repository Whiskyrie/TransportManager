import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";

const AppHeader: React.FC = () => {
  return (
    <View style={styles.header}>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: 30,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  logo: {
    width: Dimensions.get("window").width * 0.155,
    height: undefined,
    aspectRatio: 1,
  },
});

export default AppHeader;
