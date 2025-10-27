import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image"; // ⚡ Usa expo-image (melhor performance)
import { MaterialIcons } from "@expo/vector-icons";
import { getProdutosByCategoriaNome } from "../services/dataLoader";

export default function CategoriaScreen({ route, navigation }) {
  const { categoria } = route.params; // nome da categoria (ex: "Pistolas")
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const { width } = useWindowDimensions();
  const isTablet = width >= 900;
  const numColumns = isTablet ? 2 : 1;

  useEffect(() => {
    setLoading(true);
    const data = getProdutosByCategoriaNome(categoria);
    setProdutos(data);
    setLoading(false);
    setPage(1);
  }, [categoria]);

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = produtos.slice(start, end);
  const totalPages = Math.ceil(produtos.length / itemsPerPage);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#E9B20E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔹 Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <MaterialIcons name="category" size={26} color="#E9B20E" />
            <Text style={styles.title}>{categoria}</Text>
          </View>
          <Text style={styles.subtitle}>
            {produtos.length} produto{produtos.length !== 1 && "s"} encontrado
            {produtos.length !== 1 && "s"}
          </Text>
        </View>
      </View>

      {/* 🔹 Lista de produtos */}
      <FlatList
        data={paginatedData}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <View style={[styles.card, { width: isTablet ? "47%" : "100%" }]}>
            {item.imagem?.destaque && (
              <Image
                source={item.imagem.destaque}
                style={styles.image}
                contentFit="contain"
                transition={200}
              />
            )}

            <View style={styles.cardContent}>
              <Text style={styles.produtoNome}>{item.nome}</Text>

              <Text style={styles.caracteristicas}>Características</Text>
              <Text style={styles.textDescricao}>{item.caracteristicas}</Text>

              <Text style={styles.preco}>R$ {item.preco}</Text>

              <TouchableOpacity
                style={styles.botao}
                onPress={() =>
                  navigation.navigate("Produtos", {
                    id: item.id,
                    categoria: item.categoriaNome,
                  })
                }
              >
                <Text style={styles.botaoTexto}>Ver Detalhes</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
        columnWrapperStyle={isTablet ? { justifyContent: "space-between" } : null}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum produto encontrado nesta categoria.
          </Text>
        }
      />

      {/* 🔹 Paginação */}
      {totalPages > 1 && (
        <View style={styles.pagination}>
          {[...Array(totalPages)].map((_, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.pageButton,
                page === i + 1 && styles.pageButtonActive,
              ]}
              onPress={() => setPage(i + 1)}
            >
              <Text
                style={[
                  styles.pageText,
                  page === i + 1 && styles.pageTextActive,
                ]}
              >
                {i + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030711",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#030711",
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backText: {
    color: "#fff",
    fontSize: 16,
  },
  titleContainer: {
    marginTop: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    color: "#E9B20E",
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    color: "#bbb",
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    backgroundColor: "#0D1324",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 300,
  },
  cardContent: {
    padding: 12,
  },
  produtoNome: {
    color: "#E9B20E",
    fontWeight: "700",
    fontSize: 16,
  },
  caracteristicas: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 8,
    fontSize: 14,
  },
  textDescricao: {
    color: "#ccc",
    marginVertical: 4,
    fontSize: 13,
  },
  preco: {
    color: "#E9B20E",
    fontWeight: "700",
    fontSize: 25,
    marginVertical: 8,
    marginEnd: 10,
  },
  botao: {
    backgroundColor: "#E9B20E",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#000",
    fontWeight: "700",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  pageButton: {
    borderWidth: 1,
    borderColor: "#E9B20E",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  pageButtonActive: {
    backgroundColor: "#E9B20E",
  },
  pageText: {
    color: "#E9B20E",
    fontWeight: "600",
  },
  pageTextActive: {
    color: "#000",
  },
  emptyText: {
    color: "#bbb",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
});
