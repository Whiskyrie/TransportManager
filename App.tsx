import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import RoutesListScreen from '../TransportManager/Screens/RouteListScreen';
// Importe outras telas conforme necessário
// import VehicleListScreen from './src/screens/VehicleListScreen';
// import DriverListScreen from './src/screens/DriverListScreen';

const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RoutesList">
        <Stack.Screen 
          name="RoutesList" 
          component={RoutesListScreen} 
          options={{ headerShown: false }}
        />
        {/* Adicione outras telas conforme necessário */}
        {/* <Stack.Screen name="VehicleList" component={VehicleListScreen} /> */}
        {/* <Stack.Screen name="DriverList" component={DriverListScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;