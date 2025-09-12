import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface TagsValidationHelperProps {
  selectedTags: Array<{id: string, name: string, category?: string, weight?: number}>;
  showValidation?: boolean;
}

export const TagsValidationHelper: React.FC<TagsValidationHelperProps> = ({ 
  selectedTags, 
  showValidation = true 
}) => {
  if (!showValidation || selectedTags.length === 0) return null;

  // Análise das tags selecionadas
  const categories = [...new Set(selectedTags.map(tag => tag.category || 'Geral'))];
  const highWeightTags = selectedTags.filter(tag => (tag.weight || 1) > 3);
  const hasGoodDistribution = categories.length >= 2 && selectedTags.length >= 3;

  return (
    <div className="space-y-3">
      {/* Status das Tags */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-blue-400">{selectedTags.length}</div>
          <div className="text-xs text-gray-400">Tags Total</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-green-400">{categories.length}</div>
          <div className="text-xs text-gray-400">Categorias</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-purple-400">{highWeightTags.length}</div>
          <div className="text-xs text-gray-400">Alta Relevância</div>
        </div>
      </div>

      {/* Feedback sobre a seleção */}
      {hasGoodDistribution ? (
        <Alert className="bg-green-950/30 border-green-500/30">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-200">
            <strong>Ótima seleção de tags!</strong> Você tem uma boa distribuição entre categorias, 
            o que ajudará na descoberta e organização do produto.
          </AlertDescription>
        </Alert>
      ) : selectedTags.length < 3 ? (
        <Alert className="bg-yellow-950/30 border-yellow-500/30">
          <AlertTriangle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-200">
            <strong>Adicione mais tags:</strong> Recomendamos pelo menos 3 tags para melhor 
            categorização e descoberta do produto.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-blue-950/30 border-blue-500/30">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            <strong>Diversifique as categorias:</strong> Tente usar tags de diferentes categorias 
            (plataforma, gênero, marca) para melhor organização.
          </AlertDescription>
        </Alert>
      )}

      {/* Categorias Selecionadas */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
            Categorias Selecionadas
          </h5>
          <div className="flex flex-wrap gap-1">
            {categories.map(category => {
              const categoryTags = selectedTags.filter(tag => (tag.category || 'Geral') === category);
              return (
                <Badge 
                  key={category} 
                  variant="outline" 
                  className="text-gray-300 border-gray-600"
                >
                  {category} ({categoryTags.length})
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Tags de Alta Relevância */}
      {highWeightTags.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
            Tags de Alta Relevância (Peso {'>'} 3)
          </h5>
          <div className="flex flex-wrap gap-1">
            {highWeightTags.map(tag => (
              <Badge 
                key={tag.id} 
                variant="outline" 
                className="text-purple-300 border-purple-600"
              >
                {tag.name} ★{tag.weight}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};