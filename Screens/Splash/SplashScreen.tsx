import React, { useEffect } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";

interface SplashScreenProps {
  onFinish: () => void;
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  duration = 10000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, duration);

    return () => clearTimeout(timer);
  }, [onFinish, duration]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/icon.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a2b2b",
  },
  logo: {
    width: Dimensions.get("window").width * 0.825,
    height: Dimensions.get("window").width * 0.825,
    aspectRatio: 1,
    marginBottom: 50,
    marginRight: 15,
  },
});

export default SplashScreen;
