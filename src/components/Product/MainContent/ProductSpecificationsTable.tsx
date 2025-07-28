import React, { useState } from 'react';
import { Product } from '@/hooks/useProducts';
import { ChevronDown, ChevronUp, Info, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductSpecificationsTableProps {
  product: Product;
  className?: string;
}

const ProductSpecificationsTable: React.FC<ProductSpecificationsTableProps> = ({
  product,
  className
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['general']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Mock de especificações baseadas no produto
  const specifications = {
    general: {
      title: 'Informações Gerais',
      icon: '📋',
      items: [
        { label: 'Nome do Produto', value: product.name },
        { label: 'Categoria', value: product.category || 'Games' },
        { label: 'Código do Produto', value: product.id.slice(0, 8).toUpperCase() },
        { label: 'Marca/Editora', value: product.brand || 'Sony Interactive Entertainment' },
        { label: 'Classificação Etária', value: '16 anos' },
        { label: 'Idiomas', value: 'Português, Inglês, Espanhol' },
        { label: 'Legendas', value: 'Português (Brasil)' }
      ]
    },
    technical: {
      title: 'Especificações Técnicas',
      icon: '⚙️',
      items: [
        { label: 'Plataforma', value: 'PlayStation 5' },
        { label: 'Resolução', value: '4K (3840 x 2160)' },
        { label: 'Taxa de Quadros', value: 'Até 60 FPS' },
        { label: 'Ray Tracing', value: 'Sim', highlight: true },
        { label: 'HDR', value: 'HDR10' },
        { label: 'Áudio 3D', value: 'Tempest 3D AudioTech' },
        { label: 'Feedback Háptico', value: 'DualSense', highlight: true },
        { label: 'Gatilhos Adaptativos', value: 'Sim', highlight: true }
      ]
    },
    storage: {
      title: 'Armazenamento e Instalação',
      icon: '💾',
      items: [
        { label: 'Espaço Necessário', value: '50 GB' },
        { label: 'Tipo de Mídia', value: 'Blu-ray 4K UHD' },
        { label: 'Download Adicional', value: 'Não necessário' },
        { label: 'Atualizações', value: 'Automáticas via PSN' },
        { label: 'Save Cloud', value: 'PlayStation Plus' },
        { label: 'Compatibilidade', value: 'Apenas PlayStation 5' }
      ]
    },
    multiplayer: {
      title: 'Recursos Online',
      icon: '🌐',
      items: [
        { label: 'Modo Online', value: 'Não' },
        { label: 'Cooperativo Local', value: 'Não' },
        { label: 'Multijogador', value: 'Não' },
        { label: 'PlayStation Plus', value: 'Não obrigatório' },
        { label: 'Conquistas', value: 'Troféus PlayStation' },
        { label: 'Compartilhamento', value: 'Share Button' }
      ]
    },
    physical: {
      title: 'Informações Físicas',
      icon: '📦',
      items: [
        { label: 'Dimensões da Caixa', value: '17 x 13.5 x 1.5 cm' },
        { label: 'Peso', value: '120g' },
        { label: 'Conteúdo da Embalagem', value: 'Disco do jogo, Manual' },
        { label: 'Código de Barras', value: '711719541234' },
        { label: 'País de Origem', value: 'Brasil' },
        { label: 'Garantia', value: '90 dias (defeito de fabricação)' }
      ]
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Título */}
      <div className="flex items-center gap-3">
        <h3 className="text-xl font-bold text-gray-900">
          Especificações Técnicas
        </h3>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Informações Detalhadas
        </Badge>
      </div>

      {/* Seções de Especificações */}
      <div className="space-y-4">
        {Object.entries(specifications).map(([sectionId, section]) => {
          const isExpanded = expandedSections.includes(sectionId);
          
          return (
            <div
              key={sectionId}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Header da Seção */}
              <button
                onClick={() => toggleSection(sectionId)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{section.icon}</span>
                  <h4 className="font-semibold text-gray-900 text-left">
                    {section.title}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {section.items.length} itens
                  </Badge>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* Conteúdo da Seção */}
              {isExpanded && (
                <div className="bg-white">
                  <div className="divide-y divide-gray-100">
                    {section.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-700 text-sm">
                            {item.label}
                          </span>
                          {item.highlight && (
                            <Badge className="bg-green-100 text-green-800 text-xs font-bold">
                              DESTAQUE
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 font-medium text-sm">
                            {item.value}
                          </span>
                          {item.value === 'Sim' && (
                            <Check className="w-4 h-4 text-green-600" />
                          )}
                          {item.value === 'Não' && (
                            <X className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setExpandedSections(Object.keys(specifications))}
          className="flex-1"
        >
          Expandir Todas
        </Button>
        <Button
          variant="outline"
          onClick={() => setExpandedSections([])}
          className="flex-1"
        >
          Recolher Todas
        </Button>
      </div>

      {/* Informações Importantes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h5 className="font-semibold text-yellow-800">
              Informações Importantes
            </h5>
            <div className="text-sm text-yellow-700 space-y-1">
              <div>• Especificações podem variar conforme atualizações do fabricante</div>
              <div>• Recursos online dependem de conexão com a internet</div>
              <div>• Algumas funcionalidades podem requerer PlayStation Plus</div>
              <div>• Verifique compatibilidade com sua versão do console</div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparação com Outras Plataformas */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-semibold text-blue-800 mb-3">
          🎮 Comparação entre Plataformas
        </h5>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-blue-200">
                <th className="text-left py-2 text-blue-800">Recurso</th>
                <th className="text-center py-2 text-blue-800">PS5</th>
                <th className="text-center py-2 text-blue-800">PS4</th>
                <th className="text-center py-2 text-blue-800">Xbox Series X</th>
              </tr>
            </thead>
            <tbody className="text-blue-700">
              <tr className="border-b border-blue-100">
                <td className="py-2">Resolução 4K</td>
                <td className="text-center"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                <td className="text-center"><X className="w-4 h-4 text-red-600 mx-auto" /></td>
                <td className="text-center"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
              </tr>
              <tr className="border-b border-blue-100">
                <td className="py-2">Ray Tracing</td>
                <td className="text-center"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                <td className="text-center"><X className="w-4 h-4 text-red-600 mx-auto" /></td>
                <td className="text-center"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-2">Feedback Háptico</td>
                <td className="text-center"><Check className="w-4 h-4 text-green-600 mx-auto" /></td>
                <td className="text-center"><X className="w-4 h-4 text-red-600 mx-auto" /></td>
                <td className="text-center"><X className="w-4 h-4 text-red-600 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Link para Mais Informações */}
      <div className="text-center">
        <Button variant="outline" className="border-gray-300 text-gray-600">
          📄 Baixar ficha técnica completa (PDF)
        </Button>
      </div>
    </div>
  );
};

export default ProductSpecificationsTable;

