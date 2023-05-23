import React from "react";
import "expo-dev-menu";

import Login from "./screens/Login";
import Classes from "./screens/Classes";
import Assignments from "./screens/Assignments"

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const App = () => {
  // <Stack.Screen name="Login" component={Login} />
  // <Stack.Screen name="Classes" component={Classes} />
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} >
      <Stack.Screen name="Assignments" component={Assignments} />
    </Stack.Navigator>
  );
}

export default () => {
  return(
    <NavigationContainer>
      <App />
    </NavigationContainer>
  );
}