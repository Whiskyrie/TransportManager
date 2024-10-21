import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import OnboardingScreen from "./Screens/OnboardingScreen";
import SplashScreen from "./Screens/SplashScreen";
import RouteListScreen from "./Screens/RouteListScreen";
import HomeScreen from "./Screens/HomeScreen";
import VehicleListScreen from "./Screens/VehicleListScreen"; // Importação da nova tela

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState("onboarding");

  const handleOnboardingFinish = () => {
    setCurrentScreen("splash");
  };

  const handleSplashFinish = () => {
    setCurrentScreen("home"); // Redirecionar para a HomeScreen
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
      {currentScreen === "vehicleList" && ( // Adicionando a VehicleListScreen
        <VehicleListScreen onNavigate={handleNavigation} />
      )}
      {/* Adicione as outras telas aqui no futuro */}
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
