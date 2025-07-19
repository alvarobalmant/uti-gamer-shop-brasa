import React from 'react';
import { SpecialSection } from '@/types/specialSections';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  Plus, 
  Eye, 
  EyeOff,
  Settings,
  Layers
} from 'lucide-react';

interface SpecialSectionsListProps {
  sections: SpecialSection[];
  onEdit: (section: SpecialSection) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
  loading: boolean;
}

const SpecialSectionsList: React.FC<SpecialSectionsListProps> = ({ 
  sections, 
  onEdit, 
  onDelete, 
  onCreateNew,
  loading 
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Carregando seções...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Seções Especiais</h2>
          <p className="text-muted-foreground">
            Gerencie as seções especiais do seu site de forma intuitiva
          </p>
        </div>
        <Button onClick={onCreateNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Seção Especial
        </Button>
      </div>

      {/* Sections Grid */}
      {sections.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Layers className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma seção encontrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece criando sua primeira seção especial para personalizar seu site
            </p>
            <Button onClick={onCreateNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Criar Primeira Seção
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Card key={section.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    {section.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {section.description}
                      </p>
                    )}
                  </div>
                  <Badge variant={section.is_active ? 'default' : 'secondary'} className="gap-1">
                    {section.is_active ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                    {section.is_active ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Ordem: {section.display_order ?? 'Não definida'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(section)}
                      className="gap-1"
                    >
                      <Settings className="h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(section.id)}
                      className="gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecialSectionsList;