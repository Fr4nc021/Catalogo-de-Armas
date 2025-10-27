import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  FlatList,
} from "react-native";
import {Image} from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [assetsReady, setAssetsReady] = useState(false);
  const { width, height } = useWindowDimensions();
  const imageHeight = height * 0.45;

  const categorias = [
    { nome: "Pistolas", icon: require("../../assets/icons/pistola.png") },
    { nome: "Revólveres", icon: require("../../assets/icons/revolver.png") },
    { nome: "Espingardas SemiAuto", icon: require("../../assets/icons/espingardaSemi.png") },
    { nome: "Espingardas de Repetição", icon: require("../../assets/icons/espingardaRep.png") },
    { nome: "Carabinas", icon: require("../../assets/icons/carabina.png") },
    { nome: "Fuzis", icon: require("../../assets/icons/fuzil.png") },
  ];
 

  const renderCategoria = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("Categoria", { categoria: item.nome })}
    >
      <Image 
      source={item.icon} 
      style={styles.icon} 
      contentFit="contain"
      transition={200}
      cachePolicy="disk"
      />
      <Text style={styles.cardText}>{item.nome}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.content}>
              <Text style={styles.tag}>Catálogo de Armas</Text>
              <Text style={styles.title}>
                Produtos de <Text style={styles.highlight}>Alta qualidade</Text>
              </Text>
              <Text style={styles.description}>
                Explore as melhores opções de Armas, que atendem o que você precisa! Armas de caça,
                tiro de precisão e defesa — todos os modelos e tipos para escolher!
              </Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.buttonYellow, styles.buttonSpacing]}
                  onPress={() => navigation.navigate("Categorias")}
                >
                  <Text style={styles.buttonTextBlack}>Ver Categorias →</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.buttonDark]}
                  onPress={() => navigation.navigate("Produtos", { id: "gx4" })}
                >
                  <Text style={styles.buttonTextLight}>Explorar Produto</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.imageContainer}>
              <Image
                source={require("../../assets/ImagenDestaque/destaque.png")}
                style={[styles.image, { width: 740, height: 520 , borderRadius: 20}]}
                resizeMethod="contain"
                transition={300}
              />
            </View>

            <View style={styles.quickAccessContainer}>
              <Text style={styles.quickAccessTitle}>Acesso Rápido por Categorias</Text>
            </View>
          </>
        }
        data={categorias}
        renderItem={renderCategoria}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: "#030711",
  },
  container: {
    flex: 1,
    backgroundColor: "#030711",
  },
  content: {
    maxWidth: 520,
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  tag: {
    color: "#000",
    backgroundColor: "#E9B20E",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 11.5,
    marginBottom: 15,
    fontWeight: "600",
  },
  
  title: {
    fontSize: 40,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 18,
    maxWidth: 480,
  },
  highlight: {
    color: "#E9B20E",
  },
  description: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 30,
    lineHeight: 22,
    textAlign: "justify",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonYellow: {
    backgroundColor: "#E9B20E",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  buttonDark: {
    backgroundColor: "#333",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  buttonSpacing: {
    marginRight: 12,
  },
  buttonTextBlack: {
    color: "#000",
    fontWeight: "600",
  },
  buttonTextLight: {
    color: "#fff",
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: 500,
    alignSelf: "center",
  },
  imageContainer: {
    width: "100%",
    height: 500,
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    position: "absolute",
    zIndex: 1,
    alignSelf: "center",
    top: "50%",
  },
  quickAccessContainer: {
    padding: 20,
    backgroundColor: "#030711",
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  quickAccessTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
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
    paddingVertical: 20,
    gap: 10,
    marginBottom: 16,
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
