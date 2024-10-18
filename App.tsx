import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Onboarding from "../TransportManager/Screens/OnboardingScreen"; // Importando a tela de Onboarding
import RoutesListScreen from "../TransportManager/Screens/RouteListScreen"; // Importe outras telas conforme necessário
// import VehicleListScreen from './src/screens/VehicleListScreen';
// import DriverListScreen from './src/screens/DriverListScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  const handleStart = () => {
    setIsFirstLaunch(false);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        {isFirstLaunch ? (
          <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
            {(props) => <Onboarding {...props} onStart={handleStart} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen
              name="RoutesList"
              component={RoutesListScreen}
              options={{ headerShown: false }}
            />
            {/* Adicione outras telas conforme necessário */}
            {/* <Stack.Screen name="VehicleList" component={VehicleListScreen} /> */}
            {/* <Stack.Screen name="DriverList" component={DriverListScreen} /> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
