
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSpecialSections } from '@/hooks/useSpecialSections';
import { SpecialSectionForm } from './SpecialSectionManager/SpecialSectionForm';
import { SpecialSection } from '@/types/specialSections';

export const SpecialSectionManager = () => {
  const { sections, isLoading, deleteSection } = useSpecialSections();
  const [editingSection, setEditingSection] = useState<SpecialSection | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = (section: SpecialSection) => {
    setEditingSection(section);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingSection(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSection(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta seção especial?')) {
      try {
        await deleteSection(id);
      } catch (error) {
        console.error('Error deleting section:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Carregando seções especiais...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Seções Especiais</h2>
          <p className="text-muted-foreground">
            Crie e gerencie seções personalizadas para a página inicial
          </p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nova Seção
        </Button>
      </div>

      {isFormOpen && (
        <SpecialSectionForm
          section={editingSection}
          onClose={handleCloseForm}
        />
      )}

      <div className="grid gap-4">
        {sections?.map((section) => (
          <Card key={section.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg">{section.title}</CardTitle>
                {section.description && (
                  <p className="text-sm text-muted-foreground">
                    {section.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={section.is_active ? 'default' : 'secondary'}>
                  {section.is_active ? (
                    <>
                      <Eye className="w-3 h-3 mr-1" />
                      Ativa
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3 mr-1" />
                      Inativa
                    </>
                  )}
                </Badge>
                <Badge variant="outline">
                  Ordem: {section.display_order}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="font-medium">Tipo:</span>{' '}
                    {section.background_type === 'color' && 'Cor sólida'}
                    {section.background_type === 'image' && 'Imagem'}
                    {section.background_type === 'gradient' && 'Gradiente'}
                  </div>
                  {section.elements && (
                    <div className="text-sm">
                      <span className="font-medium">Elementos:</span>{' '}
                      {section.elements.length}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(section)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(section.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!sections || sections.length === 0) && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">
                  Nenhuma seção especial encontrada
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comece criando sua primeira seção especial
                </p>
                <Button onClick={handleCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Seção
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
