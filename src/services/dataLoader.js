import produtosData from "../../assets/produtos/produtos.json";
import { imagens } from "../../assets/imagens";

// 🔹 Cache para evitar reprocessamento
let cachedFlattened = null;
let produtoMap = null;

/**
 * Helper para montar corretamente as imagens de um produto
 */
function getImagem(p) {
  return {
    destaque: imagens[p.imagem?.destaque] || null,
    complementares: (p.imagem?.complementares || [])
      .map(img => imagens[img])
      .filter(Boolean),
  };
}

/**
 * Retorna todos os produtos em um único array,
 * com referência à categoria e imagens resolvidas.
 */
export function getAllProdutosFlattened() {
  if (cachedFlattened) return cachedFlattened;

  cachedFlattened = produtosData.categorias.flatMap(categoria =>
    categoria.produtos.map(p => ({
      ...p,
      categoriaId: categoria.id,
      categoriaNome: categoria.nome,
      imagem: getImagem(p),
    }))
  );

  return cachedFlattened;
}

/**
 * Cria e mantém um mapa (objeto) de produtos por ID,
 * tornando buscas muito mais rápidas.
 */
function buildProdutoMap() {
  if (produtoMap) return produtoMap;

  produtoMap = Object.fromEntries(
    getAllProdutosFlattened().map(p => [p.id, p])
  );

  return produtoMap;
}

/**
 * Busca um produto pelo ID (string ou número)
 */
export function getProdutoById(id) {
  const map = buildProdutoMap();
  return map[id] || null;
}

/**
 * Retorna todas as categorias disponíveis no JSON
 */
export function getCategorias() {
  return produtosData.categorias.map(c => ({
    id: c.id,
    nome: c.nome,
    totalProdutos: c.produtos.length,
  }));
}

/**
 * Retorna todos os produtos de uma categoria específica
 * (case-insensitive e tolerante a acentos)
 */
export function getProdutosByCategoriaNome(nome) {
  if (!nome) return [];

  const normalize = str =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const categoria = produtosData.categorias.find(
    c => normalize(c.nome) === normalize(nome)
  );

  if (!categoria) return [];

  return categoria.produtos.map(p => ({
    ...p,
    categoriaId: categoria.id,
    categoriaNome: categoria.nome,
    imagem: getImagem(p),
  }));
}
