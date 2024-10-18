import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
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
    <GestureHandlerRootView style={styles.container}>
      {currentScreen === "onboarding" && (
        <OnboardingScreen onFinish={handleOnboardingFinish} />
      )}
      {currentScreen === "splash" && (
        <SplashScreen onFinish={handleSplashFinish} />
      )}
      {currentScreen === "routeList" && <RouteListScreen />}
    </GestureHandlerRootView>
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
