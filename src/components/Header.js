import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {Ionicons, MaterialIcons} from '@expo/vector-icons';

export default function Header() {
    const navigation = useNavigation();
    const route = useRoute();

    return (
  <View style={styles.headerContainer}>
    <View style={styles.header}>
      {/* Logo */}
      <Image
        source={require('../../assets/Logo/Logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Botões */}
      <View style={styles.buttonsContainer}>
        {/* Botão Início */}
        <TouchableOpacity
          style={[
            styles.button,
            route.name === 'Home' && styles.activeButton,
          ]}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home-outline" size={18} color="#000" margin={2} />
          <Text style={styles.text}>Início</Text>
        </TouchableOpacity>

        {/* Botão Categorias */}
        <TouchableOpacity
          style={[
            styles.button,
            route.name === 'Categorias' && styles.activeButton,
          ]}
          onPress={() => navigation.navigate('Categorias')}
        >
          <MaterialIcons name="grid-view" size={18} color="#000" />
          <Text style={styles.text}>Categorias</Text>
        </TouchableOpacity>
      </View>
    </View>

    {/* Linha embaixo */}
    <View style={styles.line} />
  </View>
);
}


const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#030711",
    paddingHorizontal: 8,
    paddingVertical: 28,
  },
  logo: {
    width: 100,
    height: 50,
    marginLeft: 8,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#C0C0C0",
  },
    activeButton: {
    backgroundColor: "#E9B20E",
    },

  text: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },

  line: {
    backgroundColor: "rgba(89, 89, 89, 1)",
    width: "100%",
    height: 0.350,
    alignSelf: "center",
  },

});

