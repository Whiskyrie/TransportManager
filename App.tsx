import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Alert, Animated, Dimensions, ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingScreen from "./Screens/Authentication/OnboardingScreen";
import SplashScreen from "./Screens/Splash/SplashScreen";
import LoginScreen from "./Screens/Authentication/LoginScreen";
import RegisterScreen from "./Screens/Authentication/RegisterScreen";
import RouteListScreen from "./Screens/Main/RouteListScreen";
import HomeScreen from "./Screens/Main/Home/HomeScreen";
import VehicleListScreen from "./Screens/Main/VehicleListScreen";
import DriverListScreen from "./Screens/Main/DriverListScreen";
import { api, handleApiError } from "Services/api";
import ProfilePageScreen from "./Screens/Profile/ProfilePageScreen";
import { User } from "./Types/authTypes";
import { LogBox } from "react-native";
import ResetPasswordScreen from "./Screens/Authentication/ResetPasswordScreen"; // Importa a tela de redefinir senha

const { width, height } = Dimensions.get("window");

const App: React.FC = () => {
  LogBox.ignoreLogs([
    "VirtualizedLists should never be nested inside plain ScrollViews",
  ]);
  const [currentScreen, setCurrentScreen] = useState<string>("splash");
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  const startZoomOutAnimation = (nextScreen: string) => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1.5,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentScreen(nextScreen);
      // Reset values for next use
      scaleValue.setValue(1);
      opacityValue.setValue(1);
    });
  };

  useEffect(() => {
    setTimeout(() => {
      checkInitialState();
    }, 3000);
  }, []);

  const checkInitialState = async () => {
    try {
      setIsLoading(true);
      const [token, userStr, firstTimeCheck] = await Promise.all([
        AsyncStorage.getItem("token"),
        AsyncStorage.getItem("user"),
        AsyncStorage.getItem("isFirstTime"),
      ]);

      setIsFirstTime(firstTimeCheck !== "false");

      if (token && userStr) {
        setUser(JSON.parse(userStr));
        startZoomOutAnimation("home");
      } else {
        startZoomOutAnimation("login");
      }
    } catch (error) {
      console.error("Error checking initial state:", error);
      startZoomOutAnimation("login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.login({ email, password });
      const { token, user } = response.data;

      await Promise.all([
        AsyncStorage.setItem("token", token),
        AsyncStorage.setItem("user", JSON.stringify(user)),
      ]);

      setUser(user);
      setCurrentScreen(isFirstTime ? "onboarding" : "home");
    } catch (error) {
      Alert.alert("Erro", handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
    phoneNumber: string
  ) => {
    try {
      setIsLoading(true);
      const response = await api.register({
        name,
        email,
        password,
        phoneNumber,
      });

      const { token, user } = response.data;

      await Promise.all([
        AsyncStorage.setItem("token", token),
        AsyncStorage.setItem("user", JSON.stringify(user)),
      ]);

      setUser(user);
      setCurrentScreen("onboarding");
    } catch (error) {
      Alert.alert("Erro", handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await api.logout();

      // First clear the user state
      setUser(null);

      // Then navigate
      setCurrentScreen("login");
    } catch (error) {
      console.error("Erro durante logout:", error);
      // Even if there's an error, we should still clear the state and redirect
      setUser(null);
      setCurrentScreen("login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingFinish = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem("isFirstTime", "false");
      setIsFirstTime(false);
      setCurrentScreen("home");
    } catch (error) {
      console.error("Error finishing onboarding:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    AsyncStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const LoadingOverlay = () => (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );

  if (currentScreen === "splash") {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          },
        ]}
      >
        <SplashScreen onFinish={() => {}} />
      </Animated.View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {currentScreen === "login" && (
        <LoginScreen
          onLogin={handleLogin}
          onNavigateToRegister={() => setCurrentScreen("register")}
          onNavigateToResetPassword={() => setCurrentScreen("resetPassword")} // Adiciona a navegação para a tela de redefinir senha
        />
      )}
      {currentScreen === "register" && (
        <RegisterScreen
          onRegister={handleRegister}
          onNavigateToLogin={() => setCurrentScreen("login")}
        />
      )}
      {currentScreen === "resetPassword" && (
        <ResetPasswordScreen
          onNavigateToLogin={() => setCurrentScreen("login")} // Navegação de volta para o login
          onResetPassword={function (email: string): void {
            throw new Error("Function not implemented.");
          } }        />
      )}
      {currentScreen === "onboarding" && (
        <OnboardingScreen onFinish={handleOnboardingFinish} />
      )}
      {currentScreen === "home" && (
        <HomeScreen
          onNavigate={handleNavigation}
          onLogout={handleLogout}
          user={user}
        />
      )}
      {isLoading && <LoadingOverlay />}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
});

export default App;
