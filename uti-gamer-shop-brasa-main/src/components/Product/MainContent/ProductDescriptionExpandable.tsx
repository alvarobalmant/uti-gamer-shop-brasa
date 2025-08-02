import React, { useState } from 'react';
import { Product } from '@/hooks/useProducts';
import { ChevronDown, ChevronUp, Play, Image, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductDescriptionExpandableProps {
  product: Product;
  className?: string;
}

const ProductDescriptionExpandable: React.FC<ProductDescriptionExpandableProps> = ({
  product,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Mock de conteúdo rico baseado no produto
  const productContent = {
    description: {
      title: 'Descrição do Produto',
      icon: '📝',
      content: `
        <div class="space-y-4">
          <p class="text-gray-700 leading-relaxed">
            <strong>${product.name}</strong> é uma experiência de jogo revolucionária que redefine os padrões da indústria. 
            Com gráficos impressionantes em 4K, jogabilidade inovadora e uma narrativa envolvente, este título oferece 
            horas de entretenimento de alta qualidade.
          </p>
          
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h4 class="font-semibold text-blue-800 mb-2">🎮 Características Principais:</h4>
            <ul class="space-y-1 text-blue-700 text-sm">
              <li>• Gráficos em 4K Ultra HD com Ray Tracing</li>
              <li>• Feedback háptico avançado do DualSense</li>
              <li>• Áudio 3D imersivo com Tempest AudioTech</li>
              <li>• Carregamento ultra-rápido com SSD</li>
              <li>• Suporte a HDR10 para cores vibrantes</li>
            </ul>
          </div>

          <p class="text-gray-700 leading-relaxed">
            A experiência de jogo foi completamente otimizada para o PlayStation 5, aproveitando ao máximo 
            o poder do console next-gen. Cada detalhe foi cuidadosamente crafted para proporcionar uma 
            imersão sem precedentes.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
              <h5 class="font-semibold text-green-800 mb-2">✅ O que você vai amar:</h5>
              <ul class="text-green-700 text-sm space-y-1">
                <li>• Jogabilidade fluida e responsiva</li>
                <li>• História cativante e personagens marcantes</li>
                <li>• Mundo aberto rico em detalhes</li>
                <li>• Sistema de progressão recompensador</li>
              </ul>
            </div>
            
            <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h5 class="font-semibold text-yellow-800 mb-2">⚠️ Requisitos importantes:</h5>
              <ul class="text-yellow-700 text-sm space-y-1">
                <li>• PlayStation 5 obrigatório</li>
                <li>• 50GB de espaço livre</li>
                <li>• Conexão com internet para atualizações</li>
                <li>• Controle DualSense recomendado</li>
              </ul>
            </div>
          </div>
        </div>
      `
    },
    features: {
      title: 'Recursos e Funcionalidades',
      icon: '⚡',
      content: `
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
              <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-white text-xl">🎯</span>
              </div>
              <h4 class="font-semibold text-purple-800 mb-2">Precisão Aprimorada</h4>
              <p class="text-purple-700 text-sm">Controles mais precisos com feedback háptico avançado</p>
            </div>
            
            <div class="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
              <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-white text-xl">🌟</span>
              </div>
              <h4 class="font-semibold text-blue-800 mb-2">Gráficos Next-Gen</h4>
              <p class="text-blue-700 text-sm">Visuais impressionantes em 4K com Ray Tracing</p>
            </div>
            
            <div class="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
              <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-white text-xl">⚡</span>
              </div>
              <h4 class="font-semibold text-green-800 mb-2">Carregamento Rápido</h4>
              <p class="text-green-700 text-sm">Tempos de carregamento praticamente instantâneos</p>
            </div>
          </div>

          <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h4 class="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Award class="w-5 h-5 text-yellow-600" />
              Prêmios e Reconhecimentos
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-bold">🏆</span>
                </div>
                <div>
                  <div class="font-medium text-gray-800">Game of the Year 2024</div>
                  <div class="text-sm text-gray-600">The Game Awards</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-bold">⭐</span>
                </div>
                <div>
                  <div class="font-medium text-gray-800">95/100 Metacritic</div>
                  <div class="text-sm text-gray-600">Crítica Especializada</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    },
    media: {
      title: 'Mídia e Conteúdo',
      icon: '🎬',
      content: `
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h4 class="font-semibold text-gray-800 flex items-center gap-2">
                <Play class="w-5 h-5 text-red-600" />
                Trailers e Vídeos
              </h4>
              <div class="space-y-3">
                <div class="bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors cursor-pointer">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div class="font-medium text-gray-800">Trailer de Lançamento</div>
                      <div class="text-sm text-gray-600">2:34 • 1.2M visualizações</div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors cursor-pointer">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div class="font-medium text-gray-800">Gameplay Walkthrough</div>
                      <div class="text-sm text-gray-600">15:22 • 850K visualizações</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <h4 class="font-semibold text-gray-800 flex items-center gap-2">
                <Image class="w-5 h-5 text-green-600" />
                Screenshots
              </h4>
              <div class="grid grid-cols-2 gap-2">
                <div class="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300" alt="Screenshot 1" class="w-full h-full object-cover" />
                </div>
                <div class="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300" alt="Screenshot 2" class="w-full h-full object-cover" />
                </div>
                <div class="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300" alt="Screenshot 3" class="w-full h-full object-cover" />
                </div>
                <div class="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300" alt="Screenshot 4" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    }
  };

  const tabs = [
    { id: 'description', label: 'Descrição', icon: '📝' },
    { id: 'features', label: 'Recursos', icon: '⚡' },
    { id: 'media', label: 'Mídia', icon: '🎬' }
  ];

  const currentContent = productContent[activeTab as keyof typeof productContent];
  const previewText = product.description || 
    "Descubra uma experiência de jogo revolucionária com gráficos impressionantes, jogabilidade inovadora e uma narrativa envolvente que redefine os padrões da indústria...";

  return (
    <div className={cn("space-y-6", className)}>
      {/* Título */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          Sobre o Produto
        </h3>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Informações Completas
        </Badge>
      </div>

      {/* Preview da Descrição */}
      {!isExpanded && (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            {previewText}
          </p>
          <Button
            onClick={() => setIsExpanded(true)}
            variant="outline"
            className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            <ChevronDown className="w-4 h-4 mr-2" />
            Ver descrição completa
          </Button>
        </div>
      )}

      {/* Conteúdo Expandido */}
      {isExpanded && (
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-t-lg transition-all",
                  activeTab === tab.id
                    ? "bg-blue-600 text-white border-b-2 border-blue-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Conteúdo da Tab */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: currentContent.content }}
            />
          </div>

          {/* Botão Recolher */}
          <div className="text-center">
            <Button
              onClick={() => setIsExpanded(false)}
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <ChevronUp className="w-4 h-4 mr-2" />
              Recolher descrição
            </Button>
          </div>
        </div>
      )}

      {/* Informações Adicionais */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-orange-800 mb-2">
              💬 Dúvidas sobre o produto?
            </h5>
            <p className="text-sm text-orange-700 mb-3">
              Nossa equipe especializada está pronta para ajudar você a escolher o melhor produto.
            </p>
            <div className="flex gap-2">
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                💬 Chat Online
              </Button>
              <Button size="sm" variant="outline" className="border-orange-300 text-orange-600">
                📞 Ligar Agora
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tags do Produto */}
      <div className="space-y-3">
        <h5 className="font-semibold text-gray-900">🏷️ Tags do Produto</h5>
        <div className="flex flex-wrap gap-2">
          {['PlayStation 5', 'Ação', 'Aventura', '4K', 'Ray Tracing', 'Single Player', 'Exclusivo'].map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDescriptionExpandable;

