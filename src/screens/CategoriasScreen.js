import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function CategoriasScreen({ navigation }) {
  const categorias = [
    { nome: "Pistolas", icon: require("../../assets/icons/pistola.png") },
    { nome: "Revólveres", icon: require("../../assets/icons/revolver.png") },
    { nome: "Espingardas SemiAuto", icon: require("../../assets/icons/espingardaSemi.png") },
    { nome: "Espingardas de Repetição", icon: require("../../assets/icons/espingardaRep.png") },
    { nome: "Carabinas", icon: require("../../assets/icons/carabina.png") },
    { nome: "Fuzis", icon: require("../../assets/icons/fuzil.png") },
  ];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <MaterialIcons name="grid-view" size={28} color="#E9B20E" />
        <Text style={styles.title}>Categorias</Text>
      </View>

      {/* Grid de categorias */}
      <View style={styles.grid}>
        {categorias.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              navigation.navigate("Categoria", { categoria: item.nome })
            }
          >
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.cardText}>{item.nome}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#030711",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  card: {
    backgroundColor: "#E9B20E",
    width: "47%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 14,
    gap: 10,
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: "#000",
    resizeMode: "contain",
  },
  cardText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
    flexShrink: 1,
    flexWrap: "wrap",
    textAlign: "left",
    maxWidth: "70%",
  },
});
