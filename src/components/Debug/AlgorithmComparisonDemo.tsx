import React, { useState } from 'react';
import { Product } from '@/hooks/useProducts/types';

interface AlgorithmResult {
  products: Product[];
  algorithm: string;
  scores?: { [productId: string]: number };
}

interface AlgorithmComparisonDemoProps {
  currentProduct: Product;
  allProducts: Product[];
}

const AlgorithmComparisonDemo: React.FC<AlgorithmComparisonDemoProps> = ({
  currentProduct,
  allProducts
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Simulação do algoritmo atual
  const getCurrentAlgorithmResult = (): AlgorithmResult => {
    const validProducts = allProducts.filter(product => 
      product.id !== currentProduct.id &&
      product.product_type !== 'master' &&
      product.is_active !== false
    );
    
    if (!currentProduct.tags || currentProduct.tags.length === 0) {
      return { products: validProducts.slice(0, 8), algorithm: 'fallback' };
    }
    
    const currentTags = currentProduct.tags.map(tag => tag.id);
    const productsWithMatches: { product: Product; matches: number }[] = [];
    
    validProducts.forEach(product => {
      if (!product.tags || product.tags.length === 0) {
        return;
      }
      
      const productTags = product.tags.map(tag => tag.id);
      const matches = currentTags.filter(tagId => productTags.includes(tagId)).length;
      
      if (matches > 0) {
        productsWithMatches.push({ product, matches });
      }
    });
    
    productsWithMatches.sort((a, b) => {
      if (a.matches !== b.matches) {
        return b.matches - a.matches;
      }
      return Math.random() - 0.5;
    });
    
    const relatedProducts = productsWithMatches.map(item => item.product);
    let finalProducts = relatedProducts.slice(0, 8);
    
    if (finalProducts.length < 8) {
      const usedIds = new Set([currentProduct.id, ...finalProducts.map(p => p.id)]);
      const remainingProducts = validProducts.filter(p => !usedIds.has(p.id));
      const additionalProducts = remainingProducts.slice(0, 8 - finalProducts.length);
      finalProducts = [...finalProducts, ...additionalProducts];
    }
    
    return { products: finalProducts, algorithm: 'tags' };
  };

  // Simulação do algoritmo melhorado
  const getImprovedAlgorithmResult = (): AlgorithmResult => {
    const TAG_WEIGHTS = {
      FRANCHISE: 100,
      MAIN_GAME: 80,
      GENRE: 50,
      DEVELOPER: 40,
      PLATFORM: 20,
      ATTRIBUTE: 10,
      GENERIC: 5
    };
    
    const TAG_CATEGORIES: { [key: string]: keyof typeof TAG_WEIGHTS } = {
      'resident-evil': 'FRANCHISE',
      'fifa': 'FRANCHISE',
      'street-fighter': 'FRANCHISE',
      'the-last-of-us': 'MAIN_GAME',
      'survival-horror': 'GENRE',
      'esporte': 'GENRE',
      'luta': 'GENRE',
      'capcom': 'DEVELOPER',
      'naughty-dog': 'DEVELOPER',
      'playstation-5': 'PLATFORM',
      'remake': 'ATTRIBUTE',
      'jogo': 'GENERIC',
      'acessorio': 'GENERIC',
      'roupa': 'GENERIC'
    };
    
    const PRODUCT_CATEGORIES = {
      GAMES: ['jogo', 'game'],
      ACCESSORIES: ['acessorio', 'mouse'],
      CLOTHING: ['roupa', 'camiseta', 'pantufa']
    };
    
    const getProductMainCategory = (product: Product): string => {
      if (!product.tags) return 'UNKNOWN';
      const tagNames = product.tags.map(tag => tag.name.toLowerCase());
      
      for (const [category, keywords] of Object.entries(PRODUCT_CATEGORIES)) {
        if (keywords.some(keyword => tagNames.some(tagName => tagName.includes(keyword)))) {
          return category;
        }
      }
      return 'UNKNOWN';
    };
    
    const calculateWeightedScore = (currentProduct: Product, candidateProduct: Product): number => {
      if (!currentProduct.tags || !candidateProduct.tags) return 0;
      
      const currentTagIds = currentProduct.tags.map(tag => tag.id);
      const candidateTagIds = candidateProduct.tags.map(tag => tag.id);
      
      let score = 0;
      for (const tagId of candidateTagIds) {
        if (currentTagIds.includes(tagId)) {
          const category = TAG_CATEGORIES[tagId] || 'GENERIC';
          score += TAG_WEIGHTS[category];
        }
      }
      
      // Boost para mesmo desenvolvedor
      const currentDeveloperTags = currentProduct.tags.filter(tag => 
        TAG_CATEGORIES[tag.id] === 'DEVELOPER'
      );
      const candidateDeveloperTags = candidateProduct.tags.filter(tag => 
        TAG_CATEGORIES[tag.id] === 'DEVELOPER'
      );
      
      const hasSameDeveloper = currentDeveloperTags.some(currentTag =>
        candidateDeveloperTags.some(candidateTag => candidateTag.id === currentTag.id)
      );
      
      if (hasSameDeveloper) {
        score += 20;
      }
      
      return score;
    };
    
    const validProducts = allProducts.filter(product => 
      product.id !== currentProduct.id &&
      product.product_type !== 'master' &&
      product.is_active !== false
    );
    
    const currentCategory = getProductMainCategory(currentProduct);
    const sameCategoryProducts = validProducts.filter(product => 
      getProductMainCategory(product) === currentCategory
    );
    
    const productsWithScores: { product: Product; score: number }[] = [];
    sameCategoryProducts.forEach(product => {
      const score = calculateWeightedScore(currentProduct, product);
      if (score >= 50) {
        productsWithScores.push({ product, score });
      }
    });
    
    productsWithScores.sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score;
      }
      return (b.product.tags?.length || 0) - (a.product.tags?.length || 0);
    });
    
    let finalProducts = productsWithScores.slice(0, 8).map(item => item.product);
    let algorithm = 'weighted_tags';
    
    if (finalProducts.length < 3) {
      const usedIds = new Set(finalProducts.map(p => p.id));
      const remainingCategoryProducts = sameCategoryProducts
        .filter(p => !usedIds.has(p.id))
        .slice(0, 3 - finalProducts.length);
      
      finalProducts = [...finalProducts, ...remainingCategoryProducts];
      algorithm = 'category_fallback';
    }
    
    const scores = Object.fromEntries(productsWithScores.map(item => [item.product.id, item.score]));
    
    return { products: finalProducts, algorithm, scores };
  };

  const currentResult = getCurrentAlgorithmResult();
  const improvedResult = getImprovedAlgorithmResult();

  const getScoreColor = (score: number): string => {
    if (score >= 100) return 'text-green-600 bg-green-50';
    if (score >= 50) return 'text-blue-600 bg-blue-50';
    if (score >= 20) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRelevanceIcon = (score: number): string => {
    if (score >= 100) return '🎯';
    if (score >= 50) return '✅';
    if (score >= 20) return '⚠️';
    return '❌';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🔬 Comparação de Algoritmos de Produtos Relacionados
        </h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Produto Atual:</h3>
          <div className="text-blue-700">
            <div className="font-medium">{currentProduct.name}</div>
            <div className="text-sm mt-1">
              Tags: {currentProduct.tags?.map(tag => tag.name).join(', ') || 'Nenhuma'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Algoritmo Atual */}
        <div className="border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <h3 className="text-lg font-semibold text-red-700">Algoritmo Atual</h3>
          </div>
          
          <div className="space-y-2">
            {currentResult.products.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 mr-2">
                    {index + 1}.
                  </span>
                  <span className="text-sm">{product.name}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {product.tags?.length || 0} tags
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-red-50 rounded">
            <div className="text-sm text-red-700">
              <div>📊 Total de produtos: {currentResult.products.length}</div>
              <div>🎲 Algoritmo: {currentResult.algorithm}</div>
              <div>⚠️ Inclui produtos irrelevantes</div>
            </div>
          </div>
        </div>

        {/* Algoritmo Melhorado */}
        <div className="border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <h3 className="text-lg font-semibold text-green-700">Algoritmo Melhorado</h3>
          </div>
          
          <div className="space-y-2">
            {improvedResult.products.map((product, index) => {
              const score = improvedResult.scores?.[product.id] || 0;
              return (
                <div key={product.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-2">
                      {index + 1}.
                    </span>
                    <span className="text-sm">{product.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">{getRelevanceIcon(score)}</span>
                    <span className={`text-xs px-2 py-1 rounded ${getScoreColor(score)}`}>
                      {score}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded">
            <div className="text-sm text-green-700">
              <div>📊 Total de produtos: {improvedResult.products.length}</div>
              <div>🎯 Algoritmo: {improvedResult.algorithm}</div>
              <div>✅ Apenas produtos relevantes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão para mostrar detalhes */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {showDetails ? 'Ocultar Detalhes' : 'Mostrar Detalhes Técnicos'}
        </button>
      </div>

      {/* Detalhes técnicos */}
      {showDetails && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3">🔧 Detalhes Técnicos</h4>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-red-700 mb-2">Problemas do Algoritmo Atual:</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• Contagem simples de tags (todas têm mesmo peso)</li>
                <li>• Fallback completamente aleatório</li>
                <li>• Não filtra por categoria de produto</li>
                <li>• Força sempre 8 produtos, mesmo irrelevantes</li>
                <li>• Não considera contexto ou popularidade</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-medium text-green-700 mb-2">Melhorias do Novo Algoritmo:</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• Sistema de pontuação ponderada por tipo de tag</li>
                <li>• Filtro rígido por categoria de produto</li>
                <li>• Limite mínimo de relevância (score ≥ 50)</li>
                <li>• Fallback estratégico (mesma categoria)</li>
                <li>• Boosts contextuais (mesmo desenvolvedor, etc.)</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <h5 className="font-medium text-blue-800 mb-2">📈 Legenda de Scores:</h5>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded mr-1"></span>
                100+ = Altíssima relevância (mesma franquia)
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded mr-1"></span>
                50-99 = Boa relevância (mesmo gênero/dev)
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 bg-yellow-500 rounded mr-1"></span>
                20-49 = Baixa relevância (mesma plataforma)
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded mr-1"></span>
                0-19 = Irrelevante (filtrado)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmComparisonDemo;
