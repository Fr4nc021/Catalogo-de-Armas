import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import CategoriasScreen from "./src/screens/CategoriasScreen";
import Header from "./src/components/Header";
import ProdutosScreen from "./src/screens/ProdutosScreen";
import CategoriaScreen from "./src/screens/CategoriaScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      screenOptions={{
        header: () => <Header />,
      }}
      >
        <Stack.Screen 
        name="Home" component={HomeScreen} /> 
        <Stack.Screen 
        name="Categorias" 
        component={CategoriasScreen}
        />
        <Stack.Screen
        name="Categoria"
        component={CategoriaScreen}
        />
        <Stack.Screen
        name="Produtos"
        component={ProdutosScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
