import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import OnboardingScreen from "./Screens/OnboardingScreen";
import SplashScreen from "./Screens/SplashScreen";
import RouteListScreen from "./Screens/RouteListScreen";

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState("onboarding");

  const handleOnboardingFinish = () => {
    setCurrentScreen("splash");
  };

  const handleSplashFinish = () => {
    setCurrentScreen("routeList");
  };

  return (
    <View style={styles.container}>
      {currentScreen === "onboarding" && (
        <OnboardingScreen onFinish={handleOnboardingFinish} />
      )}
      {currentScreen === "splash" && (
        <SplashScreen onFinish={handleSplashFinish} />
      )}
      {currentScreen === "routeList" && <RouteListScreen />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
