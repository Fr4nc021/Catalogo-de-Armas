import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getProdutoById } from "../services/dataLoader";

const { width, height } = Dimensions.get("window");

export default function ProdutosScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};
  const produto = getProdutoById(id);

  const [loading, setLoading] = useState(true);
  const [destaqueIndex, setDestaqueIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const scrollModalRef = useRef(null);
  const [mostrarParcelas, setMostrarParcelas] = useState(false);

  function calcularParcelas(precoStr) {
    const preco = parseFloat(precoStr.replace(",", "."));
    const parcelas = [];

    for (let i = 1; i <= 10; i++) {
      if (i === 1) {
        parcelas.push({ texto: `À vista: R$ ${preco.toFixed(2).replace(".", ",")}` });
      } else if (i <= 4) {
        const valorParcela = preco / i;
        parcelas.push({
          texto: `${i}x de R$ ${valorParcela.toFixed(2).replace(".", ",")} (sem juros)`
        });
      } else {
        const totalComJuros = preco * 1.08;
        const valorParcela = totalComJuros / i;
        parcelas.push({
          texto: `${i}x de R$ ${valorParcela.toFixed(2).replace(".", ",")} (com juros)`
        });
      }
    }

    return parcelas;
  }

  const imagens = useMemo(() => {
    if (!produto) return [];
    const destaque = produto.imagem?.destaque ?? null;
    const complementares = produto.imagem?.complementares ?? [];
    return [destaque, ...complementares].filter(Boolean);
  }, [produto]);

  const miniaturas = useMemo(() => imagens.slice(0, 4), [imagens]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 150);
    return () => clearTimeout(t);
  }, [id]);

  useEffect(() => {
    if (modalVisible && scrollModalRef.current) {
      setTimeout(() => {
        try {
          scrollModalRef.current.scrollTo({ x: destaqueIndex * width, animated: false });
        } catch (e) {
          // noop
        }
      }, 10);
    }
  }, [modalVisible, destaqueIndex]);

  if (!produto) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ color: "#fff" }}>Produto não encontrado.</Text>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E9B20E" />
      </SafeAreaView>
    );
  }

  const formatPreco = (p) => {
    if (typeof p === "number") return p.toFixed(2).replace(".", ",");
    if (!p) return "0,00";
    return p.toString().replace(".", ",");
  };

  const onPressMini = (index) => {
    setDestaqueIndex(index);
  };

  const openModalAt = (index) => {
    setDestaqueIndex(index);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>

          <Text style={styles.breadcrumb}>
            {produto.categoriaNome ? `${produto.categoriaNome} › ` : ""}
            <Text style={styles.breadcrumbProduto}>{produto.nome}</Text>
          </Text>
        </View>

        {/* destaque com rolagem lateral */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
            setDestaqueIndex(newIndex);
          }}
          style={styles.destaqueScroll}
        >
          {imagens.map((src, i) => (
            <TouchableOpacity key={i} activeOpacity={0.95} onPress={() => openModalAt(i)}>
              <Image
                source={src}
                style={[styles.imagemDestaque, { width }]}
                contentFit="cover"
                transition={200}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* miniaturas */}
        {miniaturas.length > 0 && (
          <View style={styles.miniaturasWrap}>
            {miniaturas.map((src, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.85}
                onPress={() => onPressMini(i)}
                onLongPress={() => openModalAt(i)}
                style={[
                  styles.miniaturaButton,
                  destaqueIndex === i ? styles.miniaturaAtiva : null,
                ]}
              >
                <Image source={src} style={styles.miniatura} contentFit="cover" transition={150} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* info do produto */}
        <View style={styles.info}>
          <Text style={styles.nome}>{produto.nome}</Text>
          <Text style={styles.preco}>R$ {formatPreco(produto.preco)}</Text>
          {produto.descricao_breve ? <Text style={styles.descricao}>{produto.descricao_breve}</Text> : null}

          <TouchableOpacity
            style={styles.parcelamentoButton}
            onPress={() => setMostrarParcelas(!mostrarParcelas)}
          >
            <Text style={styles.parcelamentoButtonText}>
              Ver opções de parcelamento
            </Text>
          </TouchableOpacity>

          {mostrarParcelas && (
            <View style={styles.parcelasBox}>
              {calcularParcelas(produto.preco).map((p, i) => (
                <Text key={i} style={styles.parcelaLinha}>
                  {p.texto}
                </Text>
              ))}
            </View>
          )}

          {produto.especificacoes && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Especificações</Text>
              {Object.entries(produto.especificacoes).map(([k, v]) => (
                <Text key={k} style={styles.cardLine}>
                  <Text style={styles.cardKey}>{formatKey(k)}: </Text>
                  <Text style={styles.cardValue}>{v ?? "-"}</Text>
                </Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal fullscreen */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <ScrollView
            ref={scrollModalRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: destaqueIndex * width, y: 0 }}
          >
            {imagens.length > 0 ? (
              imagens.map((src, idx) => (
                <View key={idx} style={styles.fullscreenSlide}>
                  <Image source={src} style={styles.fullscreenImage} contentFit="contain" transition={150} />
                </View>
              ))
            ) : (
              <View style={styles.fullscreenSlide}>
                <Text style={{ color: "#fff" }}>Sem imagens</Text>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity style={styles.modalClose} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function formatKey(key) {
  const s = key.replace(/_/g, " ").replace(/([A-Z])/g, " $1");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#030711" },
  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10 },
  backButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#E9B20E",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: { color: "#E9B20E", fontWeight: "600" },
  breadcrumb: { color: "#999", marginTop: 10, fontSize: 14 },
  breadcrumbProduto: { color: "#fff", fontWeight: "700" },

  destaqueWrap: { alignItems: "center", marginTop: 16, paddingHorizontal: 30 },
  imagemDestaque: {
    width: Math.min(width * 0.92, 700),
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: "#111",
  },

  miniaturasWrap: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    marginTop: 12,
    gap: 6,
    flexWrap: "wrap",
  },

  miniaturaAtiva: { borderColor: "#000000ff" },
  miniatura: {
    width: Math.min(width * 0.92, 700) / 4 - 8,
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: "#111",
  },

  info: { paddingHorizontal: 20, marginTop: 18 },
  nome: { color: "#fff", fontSize: 30, fontWeight: "700", marginBottom: 6 },
  preco: { color: "#E9B20E", fontSize: 30, fontWeight: "700", marginBottom: 10 },
  descricao: { color: "#cfcfcf", fontSize: 15, marginBottom: 16 },

  card: { backgroundColor: "#1F2937", padding: 14, borderRadius: 12 },
  cardTitle: { color: "#E9B20E", fontWeight: "700", marginBottom: 8 },
  cardLine: { color: "#fff", marginBottom: 16 },
  cardKey: { fontWeight: "700" },
  cardValue: { fontWeight: "400" },

  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#030711" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#030711" },

  modalBackground: { flex: 1, backgroundColor: "rgba(0,0,0,0.95)", justifyContent: "center", alignItems: "center" },
  fullscreenSlide: { width, height, justifyContent: "center", alignItems: "center" },
  fullscreenImage: { width: width, height: height * 0.8 },

  modalClose: { position: "absolute", top: 44, right: 18, backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 20, padding: 8 },
  modalCloseText: { color: "#fff", fontSize: 20 },

  parcelamentoButton: {
    backgroundColor: "#E9B20E",
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    gap: 4,
    padding: 12,
  },
  parcelamentoButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
  parcelasBox: {
    backgroundColor: "#1F2937",
    padding: 10,
    borderRadius: 10,
    marginTop: 6,
    marginBottom: 16,
  },
  parcelaLinha: {
    color: "#fff",
    fontSize: 15,
    marginBottom: 4,
    gap: 4,
    marginBottom: 16,
    marginEnd: 4,
  },

  miniaturaButton: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    marginRight: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});