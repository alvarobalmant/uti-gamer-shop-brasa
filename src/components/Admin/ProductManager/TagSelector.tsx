
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tag } from '@/hooks/useTags';
import { TagsValidationHelper } from './TagsValidationHelper';

interface TagSelectorProps {
  tags: Tag[];
  selectedTagIds: string[];
  onTagChange: (tagId: string, checked: boolean) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  tags,
  selectedTagIds,
  onTagChange,
}) => {
  const handleTagToggle = (tagId: string, checked: boolean) => {
    onTagChange(tagId, checked);
  };

  // Agrupar tags por categoria se disponível
  const groupedTags = tags.reduce((acc, tag) => {
    const category = tag.category || 'Geral';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tag);
    return acc;
  }, {} as Record<string, typeof tags>);

  // Ordenar categorias
  const sortedCategories = Object.keys(groupedTags).sort();
  
  // Tags selecionadas para validação
  const selectedTags = tags.filter(tag => selectedTagIds.includes(tag.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-white">
          Tags ({selectedTagIds.length} selecionada{selectedTagIds.length !== 1 ? 's' : ''})
        </Label>
        {selectedTagIds.length > 0 && (
          <button
            type="button"
            onClick={() => selectedTagIds.forEach(tagId => onTagChange(tagId, false))}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Limpar todas
          </button>
        )}
      </div>
      
      {/* Validação e Feedback */}
      <TagsValidationHelper selectedTags={selectedTags} />
      
      <div className="max-h-48 overflow-y-auto bg-gray-700 rounded-lg border border-gray-600">
        {tags.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-400 text-sm">
              Nenhuma tag disponível. Crie tags primeiro no gerenciador de tags.
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-4">
            {sortedCategories.map(category => (
              <div key={category} className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wide border-b border-gray-600 pb-1">
                  {category}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {groupedTags[category].map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-2 p-1">
                      <Checkbox
                        id={`tag-${tag.id}`}
                        checked={selectedTagIds.includes(tag.id)}
                        onCheckedChange={(checked) => 
                          handleTagToggle(tag.id, checked as boolean)
                        }
                        className="border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label
                        htmlFor={`tag-${tag.id}`}
                        className="text-sm text-white cursor-pointer truncate flex-1 hover:text-blue-300 transition-colors"
                        title={`${tag.name} (Categoria: ${category}${tag.weight ? `, Peso: ${tag.weight}` : ''})`}
                      >
                        {tag.name}
                        {tag.weight && tag.weight > 1 && (
                          <span className="ml-1 text-xs text-blue-400">★{tag.weight}</span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedTagIds.length > 0 && (
        <div className="text-xs text-gray-400 bg-gray-800 rounded p-2">
          <strong>Tags selecionadas:</strong>{' '}
          {tags
            .filter(tag => selectedTagIds.includes(tag.id))
            .map(tag => tag.name)
            .join(', ')
          }
        </div>
      )}
    </div>
  );
};
