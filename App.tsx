import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import OnboardingScreen from "./Screens/OnboardingScreen";
import SplashScreen from "./Screens/SplashScreen";
import RouteListScreen from "./Screens/RouteListScreen";
import HomeScreen from "./Screens/HomeScreen";
import VehicleListScreen from "./Screens/VehicleListScreen";
import DriverListScreen from "./Screens/DriverListScreen";

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState("onboarding");

  const handleOnboardingFinish = () => {
    setCurrentScreen("splash");
  };

  const handleSplashFinish = () => {
    setCurrentScreen("home");
  };

  const handleNavigation = (screen: string) => {
    setCurrentScreen(screen);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {currentScreen === "onboarding" && (
        <OnboardingScreen onFinish={handleOnboardingFinish} />
      )}
      {currentScreen === "splash" && (
        <SplashScreen onFinish={handleSplashFinish} />
      )}
      {currentScreen === "home" && <HomeScreen onNavigate={handleNavigation} />}
      {currentScreen === "routeList" && (
        <RouteListScreen onNavigate={handleNavigation} />
      )}
      {currentScreen === "vehicleList" && (
        <VehicleListScreen onNavigate={handleNavigation} />
      )}
      {currentScreen === "driverList" && ( // Nova rota
        <DriverListScreen onNavigate={handleNavigation} />
      )}
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
