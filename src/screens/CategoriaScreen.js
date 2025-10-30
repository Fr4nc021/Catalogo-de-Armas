import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { getProdutosByCategoriaNome } from "../services/dataLoader";

export default function CategoriaScreen({ route, navigation }) {
  const { categoria } = route.params;
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [marcaSelecionada, setMarcaSelecionada] = useState(null);
  const [funcionamentoSelecionado, setFuncionamentoSelecionado] = useState(null);
  const [grupoSelecionado, setGrupoSelecionado] = useState(null);
  const [mostrarFiltroFuncionamento, setMostrarFiltroFuncionamento] = useState(false);
  const [mostrarFiltroGrupo, setMostrarFiltroGrupo] = useState(false);
  const itemsPerPage = 10;

  const { width } = useWindowDimensions();
  const isTablet = width >= 1024;
  const numColumns = isTablet ? 2 : 1;

  useEffect(() => {
    setLoading(true);
    const data = getProdutosByCategoriaNome(categoria);
    setProdutos(data || []);
    setLoading(false);
    setPage(1);
    setMarcaSelecionada(null);
    setFuncionamentoSelecionado(null);
    setGrupoSelecionado(null);
  }, [categoria]);

  // Marcas únicas
  const marcasDisponiveis = useMemo(() => {
    const marcas = produtos
      .map((p) => p.especificacoes?.marca_da_arma || "Desconhecida")
      .filter(Boolean);
    return [...new Set(marcas)];
  }, [produtos]);

  // Tipos de funcionamento únicos
  const tiposFuncionamento = useMemo(() => {
    const tipos = produtos
      .map((p) => p.especificacoes?.tipo_funcionamento_arma || "Desconhecido")
      .filter(Boolean);
    return [...new Set(tipos)];
  }, [produtos]);

  // 🔫 Grupos únicos (com base no grupo_id)
  const gruposDisponiveis = useMemo(() => {
    const grupos = produtos
      .map((p) => p.grupo_id)
      .filter((id) => id !== undefined && id !== null);
    return [...new Set(grupos)].sort((a, b) => a - b);
  }, [produtos]);

  // Filtragem combinada
  const produtosFiltrados = useMemo(() => {
    return produtos.filter((p) => {
      const marcaOk = marcaSelecionada
        ? p.especificacoes?.marca_da_arma === marcaSelecionada
        : true;
      const funcOk = funcionamentoSelecionado
        ? p.especificacoes?.tipo_funcionamento_arma === funcionamentoSelecionado
        : true;
      const grupoOk = grupoSelecionado ? p.grupo_id === grupoSelecionado : true;
      return marcaOk && funcOk && grupoOk;
    });
  }, [marcaSelecionada, funcionamentoSelecionado, grupoSelecionado, produtos]);

  // Paginação
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = produtosFiltrados.slice(start, end);
  const totalPages = Math.ceil(produtosFiltrados.length / itemsPerPage);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#E9B20E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <MaterialIcons name="category" size={26} color="#E9B20E" />
            <Text style={styles.title}>{categoria}</Text>
          </View>
          <Text style={styles.subtitle}>
            {produtosFiltrados.length} produto
            {produtosFiltrados.length !== 1 && "s"} encontrado
            {produtosFiltrados.length !== 1 && "s"}
          </Text>
        </View>
      </View>

      {/* Lista principal */}
      <FlatList
        data={paginatedData}
        keyExtractor={(item) => item.id?.toString()}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              { width: isTablet ? (width - 16 * 2 - 12) / 2 : "100%" },
            ]}
          >
            {item.imagem?.destaque && (
              <View style={styles.imageWrapper}>
                <Image
                  source={item.imagem.destaque}
                  style={styles.image}
                  contentFit="contain"
                  transition={200}
                />
              </View>
            )}

            <View style={styles.cardContent}>
              <Text style={styles.produtoNome}>{item.nome}</Text>
              <Text style={styles.caracteristicas}>Características</Text>
              <Text style={styles.textDescricao} numberOfLines={3}>
                {item.caracteristicas}
              </Text>
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
        ListHeaderComponent={
          <>
            {/* Filtro de marca */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterContainer}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 20 }}
            >
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  !marcaSelecionada && styles.filterButtonActive,
                ]}
                onPress={() => setMarcaSelecionada(null)}
              >
                <Text
                  style={[
                    styles.filterText,
                    !marcaSelecionada && styles.filterTextActive,
                  ]}
                >
                  Todas
                </Text>
              </TouchableOpacity>

              {marcasDisponiveis.map((marca, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.filterButton,
                    marcaSelecionada === marca && styles.filterButtonActive,
                  ]}
                  onPress={() => {
                    setMarcaSelecionada(marca);
                    setPage(1);
                  }}
                >
                  <Text
                    style={[
                      styles.filterText,
                      marcaSelecionada === marca && styles.filterTextActive,
                    ]}
                  >
                    {marca}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Filtro tipo de funcionamento */}
            <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
              <TouchableOpacity
                style={styles.expandButton}
                onPress={() =>
                  setMostrarFiltroFuncionamento(!mostrarFiltroFuncionamento)
                }
              >
                <Text style={styles.expandText}>
                  {mostrarFiltroFuncionamento
                    ? "Ocultar tipo de funcionamento"
                    : "Mostrar tipo de funcionamento"}
                </Text>
                <MaterialIcons
                  name={
                    mostrarFiltroFuncionamento
                      ? "keyboard-arrow-up"
                      : "keyboard-arrow-down"
                  }
                  size={22}
                  color="#E9B20E"
                />
              </TouchableOpacity>

              {mostrarFiltroFuncionamento && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.filterContainer}
                  contentContainerStyle={{ gap: 16 }}
                >
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      !funcionamentoSelecionado && styles.filterButtonActive,
                    ]}
                    onPress={() => setFuncionamentoSelecionado(null)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        !funcionamentoSelecionado && styles.filterTextActive,
                      ]}
                    >
                      Todos
                    </Text>
                  </TouchableOpacity>

                  {tiposFuncionamento.map((tipo, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.filterButton,
                        funcionamentoSelecionado === tipo &&
                          styles.filterButtonActive,
                      ]}
                      onPress={() => {
                        setFuncionamentoSelecionado(tipo);
                        setPage(1);
                      }}
                    >
                      <Text
                        style={[
                          styles.filterText,
                          funcionamentoSelecionado === tipo &&
                            styles.filterTextActive,
                        ]}
                      >
                        {tipo}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* 🔫 Filtro de grupo_id */}
            <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
              <TouchableOpacity
                style={styles.expandButton}
                onPress={() => setMostrarFiltroGrupo(!mostrarFiltroGrupo)}
              >
                <Text style={styles.expandText}>
                  {mostrarFiltroGrupo
                    ? "Ocultar grupos de armas"
                    : "Mostrar grupos de armas"}
                </Text>
                <MaterialIcons
                  name={
                    mostrarFiltroGrupo
                      ? "keyboard-arrow-up"
                      : "keyboard-arrow-down"
                  }
                  size={22}
                  color="#E9B20E"
                />
              </TouchableOpacity>

              {mostrarFiltroGrupo && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.filterContainer}
                  contentContainerStyle={{ gap: 16 }}
                >
                  <TouchableOpacity
                    style={[
                      styles.filterButton,
                      !grupoSelecionado && styles.filterButtonActive,
                    ]}
                    onPress={() => setGrupoSelecionado(null)}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        !grupoSelecionado && styles.filterTextActive,
                      ]}
                    >
                      Todos
                    </Text>
                  </TouchableOpacity>

                  {gruposDisponiveis.map((grupo, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.filterButton,
                        grupoSelecionado === grupo && styles.filterButtonActive,
                      ]}
                      onPress={() => {
                        setGrupoSelecionado(grupo);
                        setPage(1);
                      }}
                    >
                      <Text
                        style={[
                          styles.filterText,
                          grupoSelecionado === grupo && styles.filterTextActive,
                        ]}
                      >
                        Grupo {grupo}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </>
        }
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
        columnWrapperStyle={
          isTablet
            ? {
                justifyContent: "space-between",
                columnGap: 12,
              }
            : null
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum produto encontrado com esses filtros.
          </Text>
        }
      />

      {/* Paginação */}
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
  container: { flex: 1, backgroundColor: "#030711" },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#030711",
  },
  header: { padding: 20, paddingBottom: 10 },
  backButton: { flexDirection: "row", alignItems: "center", gap: 8 },
  backText: { color: "#fff", fontSize: 16 },
  titleContainer: { marginTop: 12 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { color: "#E9B20E", fontSize: 24, fontWeight: "700" },
  subtitle: { color: "#bbb", fontSize: 14, marginTop: 4 },

  filterContainer: { marginBottom: 10, paddingVertical: 5 },
  filterButton: {
    borderWidth: 1.5,
    borderColor: "#E9B20E",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonActive: { backgroundColor: "#E9B20E" },
  filterText: {
    color: "#E9B20E",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
    padding: 6,
  },
  filterTextActive: { color: "#000" },
  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  expandText: { color: "#E9B20E", fontWeight: "700", fontSize: 16 },
  card: {
    backgroundColor: "#0D1324",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    height: 650,
  },
  imageWrapper: {
    width: "100%",
    height: 416,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: "100%", height: "100%" },
  cardContent: { padding: 12 },
  produtoNome: { color: "#E9B20E", fontWeight: "700", fontSize: 16 },
  caracteristicas: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 8,
    fontSize: 14,
  },
  textDescricao: { color: "#ccc", marginVertical: 4, fontSize: 13 },
  preco: {
    color: "#E9B20E",
    fontWeight: "700",
    fontSize: 25,
    marginVertical: 8,
  },
  botao: {
    backgroundColor: "#E9B20E",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoTexto: { color: "#000", fontWeight: "700" },
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
  pageButtonActive: { backgroundColor: "#E9B20E" },
  pageText: { color: "#E9B20E", fontWeight: "600" },
  pageTextActive: { color: "#000" },
  emptyText: { color: "#bbb", textAlign: "center", marginTop: 40, fontSize: 16 },
});
