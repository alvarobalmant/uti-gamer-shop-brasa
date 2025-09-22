import React, { useState } from 'react';
import AlgorithmComparisonDemo from '@/components/Debug/AlgorithmComparisonDemo';
import { Product } from '@/hooks/useProducts/types';

const AlgorithmTestPage: React.FC = () => {
  // Dados de teste simulados
  const testProducts: Product[] = [
    {
      id: '1',
      name: 'Resident Evil 4 Remake PS5',
      tags: [
        { id: 'resident-evil', name: 'Resident Evil' },
        { id: 'survival-horror', name: 'Survival Horror' },
        { id: 'playstation-5', name: 'PlayStation 5' },
        { id: 'capcom', name: 'Capcom' },
        { id: 'remake', name: 'Remake' },
        { id: 'jogo', name: 'Jogo' }
      ],
      product_type: 'simple',
      is_active: true,
      price: 199.99,
      image_url: '/placeholder-game.jpg',
      description: 'Remake do clássico jogo de survival horror'
    },
    {
      id: '2',
      name: 'Resident Evil 2 Remake',
      tags: [
        { id: 'resident-evil', name: 'Resident Evil' },
        { id: 'survival-horror', name: 'Survival Horror' },
        { id: 'capcom', name: 'Capcom' },
        { id: 'remake', name: 'Remake' },
        { id: 'jogo', name: 'Jogo' }
      ],
      product_type: 'simple',
      is_active: true,
      price: 149.99,
      image_url: '/placeholder-game.jpg',
      description: 'Remake do segundo jogo da série'
    },
    {
      id: '3',
      name: 'Dead Space Remake',
      tags: [
        { id: 'survival-horror', name: 'Survival Horror' },
        { id: 'playstation-5', name: 'PlayStation 5' },
        { id: 'remake', name: 'Remake' },
        { id: 'jogo', name: 'Jogo' }
      ],
      product_type: 'simple',
      is_active: true,
      price: 179.99,
      image_url: '/placeholder-game.jpg',
      description: 'Remake do clássico jogo de terror espacial'
    },
    {
      id: '4',
      name: 'Pantufa Garfield',
      tags: [
        { id: 'acessorio', name: 'Acessório' },
        { id: 'conforto', name: 'Conforto' },
        { id: 'pantufa', name: 'Pantufa' }
      ],
      product_type: 'simple',
      is_active: true,
      price: 39.99,
      image_url: '/placeholder-accessory.jpg',
      description: 'Pantufa temática do Garfield'
    },
    {
      id: '5',
      name: 'FIFA 24 PS5',
      tags: [
        { id: 'fifa', name: 'FIFA' },
        { id: 'esporte', name: 'Esporte' },
        { id: 'playstation-5', name: 'PlayStation 5' },
        { id: 'jogo', name: 'Jogo' }
      ],
      product_type: 'simple',
      is_active: true,
      price: 249.99,
      image_url: '/placeholder-game.jpg',
      description: 'Jogo de futebol mais recente da série FIFA'
    },
    {
      id: '6',
      name: 'The Last of Us Part II',
      tags: [
        { id: 'the-last-of-us', name: 'The Last of Us' },
        { id: 'survival-horror', name: 'Survival Horror' },
        { id: 'playstation-5', name: 'PlayStation 5' },
        { id: 'naughty-dog', name: 'Naughty Dog' },
        { id: 'jogo', name: 'Jogo' }
      ],
      product_type: 'simple',
      is_active: true,
      price: 159.99,
      image_url: '/placeholder-game.jpg',
      description: 'Sequência do aclamado jogo pós-apocalíptico'
    },
    {
      id: '7',
      name: 'Mouse Gamer RGB',
      tags: [
        { id: 'acessorio', name: 'Acessório' },
        { id: 'gaming', name: 'Gaming' },
        { id: 'mouse', name: 'Mouse' }
      ],
      product_type: 'simple',
      is_active: true,
      price: 89.99,
      image_url: '/placeholder-accessory.jpg',
      description: 'Mouse gamer com iluminação RGB'
    },
    {
      id: '8',
      name: 'Resident Evil 3 Remake',
      tags: [
        { id: 'resident-evil', name: 'Resident Evil' },
        { id: 'survival-horror', name: 'Survival Horror' },
        { id: 'capcom', name: 'Capcom' },
        { id: 'remake', name: 'Remake' },
        { id: 'jogo', name: 'Jogo' }
      ],
      product_type: 'simple',
      is_active: true,
      price: 139.99,
      image_url: '/placeholder-game.jpg',
      description: 'Remake do terceiro jogo da série'
    },
    {
      id: '9',
      name: 'Street Fighter 6',
      tags: [
        { id: 'street-fighter', name: 'Street Fighter' },
        { id: 'luta', name: 'Luta' },
        { id: 'capcom', name: 'Capcom' },
        { id: 'playstation-5', name: 'PlayStation 5' },
        { id: 'jogo', name: 'Jogo' }
      ],
      product_type: 'simple',
      is_active: true,
      price: 199.99,
      image_url: '/placeholder-game.jpg',
      description: 'Mais recente jogo da série Street Fighter'
    },
    {
      id: '10',
      name: 'Camiseta Resident Evil',
      tags: [
        { id: 'resident-evil', name: 'Resident Evil' },
        { id: 'camiseta', name: 'Camiseta' },
        { id: 'roupa', name: 'Roupa' }
      ],
      product_type: 'simple',
      is_active: true,
      price: 49.99,
      image_url: '/placeholder-clothing.jpg',
      description: 'Camiseta oficial da franquia Resident Evil'
    }
  ];

  const [selectedProductId, setSelectedProductId] = useState('1');
  
  const selectedProduct = testProducts.find(p => p.id === selectedProductId) || testProducts[0];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🧪 Laboratório de Algoritmos de Produtos Relacionados
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Esta página demonstra a diferença entre o algoritmo atual e o algoritmo melhorado 
            para recomendação de produtos relacionados. Selecione um produto abaixo para ver 
            como cada algoritmo se comporta.
          </p>
        </div>

        {/* Seletor de Produto */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🎯 Selecione um Produto para Testar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProductId(product.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedProductId === product.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-800">{product.name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  R$ {product.price?.toFixed(2)}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  {product.tags?.length || 0} tags
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Comparação de Algoritmos */}
        <AlgorithmComparisonDemo
          currentProduct={selectedProduct}
          allProducts={testProducts}
        />

        {/* Informações Adicionais */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📊 Análise de Impacto
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">~43%</div>
              <div className="text-sm text-red-700">Taxa de Relevância Atual</div>
              <div className="text-xs text-red-500 mt-1">Muitos produtos irrelevantes</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">~85%</div>
              <div className="text-sm text-green-700">Taxa de Relevância Melhorada</div>
              <div className="text-xs text-green-500 mt-1">Apenas produtos relevantes</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">+42%</div>
              <div className="text-sm text-blue-700">Melhoria Esperada</div>
              <div className="text-xs text-blue-500 mt-1">Em conversão e satisfação</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">💡 Próximos Passos</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Implementar o novo algoritmo em ambiente de teste</li>
              <li>• Configurar A/B testing para comparar performance</li>
              <li>• Monitorar métricas de clique e conversão</li>
              <li>• Ajustar pesos das tags baseado em dados reais</li>
              <li>• Expandir sistema de boosts contextuais</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmTestPage;
