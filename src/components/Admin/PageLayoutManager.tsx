
import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { GripVertical, Eye, EyeOff, Plus, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePages, Page, PageLayoutItem } from '@/hooks/usePages';

// Tipos de seção disponíveis
const SECTION_TYPES = [
  { id: 'banner', label: 'Banner' },
  { id: 'products', label: 'Produtos' },
  { id: 'featured', label: 'Destaques' },
  { id: 'custom', label: 'Conteúdo Personalizado' }
];

// Componente para item ordenável
interface SortableItemProps {
  item: PageLayoutItem;
  onVisibilityToggle: (id: string, isVisible: boolean) => void;
  onEditSection: (item: PageLayoutItem) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ item, onVisibilityToggle, onEditSection }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes} className="bg-background hover:bg-muted/50">
      <TableCell className="w-10 cursor-grab touch-none">
        <GripVertical {...listeners} className="h-5 w-5 text-muted-foreground" />
      </TableCell>
      <TableCell className="font-medium">{item.title || item.sectionKey}</TableCell>
      <TableCell>{SECTION_TYPES.find(t => t.id === item.sectionType)?.label || item.sectionType}</TableCell>
      <TableCell className="text-right w-24 flex items-center justify-end gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onEditSection(item)}
          className="mr-2"
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only">Configurar</span>
        </Button>
        <Switch
          id={`visibility-${item.id}`}
          checked={item.isVisible}
          onCheckedChange={(checked) => onVisibilityToggle(item.id, checked)}
          aria-label={item.isVisible ? 'Ocultar seção' : 'Mostrar seção'}
        />
        {item.isVisible ? 
          <Eye className="h-4 w-4 text-green-500 ml-1" /> : 
          <EyeOff className="h-4 w-4 text-red-500 ml-1" />
        }
      </TableCell>
    </TableRow>
  );
};

// Formulário para adicionar/editar seção
interface SectionFormProps {
  pageId: string;
  section?: PageLayoutItem;
  onSave: (section: Partial<PageLayoutItem>) => void;
  onCancel: () => void;
}

const SectionForm: React.FC<SectionFormProps> = ({ pageId, section, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<PageLayoutItem>>({
    pageId,
    sectionKey: '',
    title: '',
    displayOrder: 999,
    isVisible: true,
    sectionType: 'products',
    sectionConfig: {}
  });

  // Preencher formulário se estiver editando
  useEffect(() => {
    if (section) {
      setFormData({
        ...section
      });
    }
  }, [section]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título da Seção</Label>
          <Input
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleInputChange}
            placeholder="Ex: Produtos em Destaque"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sectionKey">Chave da Seção</Label>
          <Input
            id="sectionKey"
            name="sectionKey"
            value={formData.sectionKey || ''}
            onChange={handleInputChange}
            placeholder="Ex: featured_products"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sectionType">Tipo de Seção</Label>
        <Select
          value={formData.sectionType}
          onValueChange={(value) => handleSelectChange('sectionType', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de seção" />
          </SelectTrigger>
          <SelectContent>
            {SECTION_TYPES.map(type => (
              <SelectItem key={type.id} value={type.id}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isVisible"
          checked={formData.isVisible}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isVisible: checked }))}
        />
        <Label htmlFor="isVisible">Seção Visível</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {section ? 'Atualizar Seção' : 'Adicionar Seção'}
        </Button>
      </div>
    </form>
  );
};

// Componente principal
interface PageLayoutManagerProps {
  page: Page;
}

const PageLayoutManager: React.FC<PageLayoutManagerProps> = ({ page }) => {
  const { toast } = useToast();
  const { 
    pageLayouts, 
    fetchPageLayout, 
    updatePageLayout, 
    addPageSection, 
    removePageSection,
    loading
  } = usePages();
  
  const [layoutItems, setLayoutItems] = useState<PageLayoutItem[]>([]);
  const [isAddingSectionOpen, setIsAddingSectionOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<PageLayoutItem | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Carregar layout da página
  useEffect(() => {
    const loadPageLayout = async () => {
      const layout = await fetchPageLayout(page.id);
      setLayoutItems(layout);
    };
    
    loadPageLayout();
  }, [page.id, fetchPageLayout]);

  // Atualizar layout local quando o layout da página mudar
  useEffect(() => {
    if (pageLayouts[page.id]) {
      setLayoutItems(pageLayouts[page.id]);
    }
  }, [pageLayouts, page.id]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLayoutItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        // Atualizar displayOrder com base no novo índice
        return newItems.map((item, index) => ({ ...item, displayOrder: index + 1 }));
      });
      setHasChanges(true);
    }
  }, []);

  const handleVisibilityToggle = useCallback((id: string, isVisible: boolean) => {
    setLayoutItems((items) =>
      items.map((item) => (item.id === id ? { ...item, isVisible } : item))
    );
    setHasChanges(true);
  }, []);

  const handleSaveChanges = async () => {
    try {
      const updates = layoutItems.map(item => ({
        id: item.id,
        pageId: item.pageId,
        sectionKey: item.sectionKey,
        displayOrder: item.displayOrder,
        isVisible: item.isVisible,
      }));
      
      await updatePageLayout(page.id, updates);
      setHasChanges(false);
      
      toast({
        title: "Layout atualizado",
        description: "As alterações no layout da página foram salvas com sucesso."
      });
    } catch (err) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as alterações no layout.",
        variant: "destructive"
      });
    }
  };

  const handleAddSection = async (sectionData: Partial<PageLayoutItem>) => {
    try {
      // Calcular a próxima ordem de exibição
      const nextOrder = layoutItems.length > 0 
        ? Math.max(...layoutItems.map(item => item.displayOrder)) + 1 
        : 1;
      
      await addPageSection(page.id, {
        ...sectionData,
        pageId: page.id,
        displayOrder: nextOrder,
        isVisible: sectionData.isVisible ?? true,
        sectionType: sectionData.sectionType || 'products',
        id: '', // This will be generated by the database
      } as PageLayoutItem);
      
      setIsAddingSectionOpen(false);
      
      toast({
        title: "Seção adicionada",
        description: `A seção "${sectionData.title || sectionData.sectionKey}" foi adicionada com sucesso.`
      });
    } catch (err) {
      toast({
        title: "Erro ao adicionar seção",
        description: "Ocorreu um erro ao adicionar a nova seção.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateSection = async (sectionData: Partial<PageLayoutItem>) => {
    if (!editingSection) return;
    
    try {
      const updatedItems = layoutItems.map(item => 
        item.id === editingSection.id ? { ...item, ...sectionData } : item
      );
      
      setLayoutItems(updatedItems);
      await updatePageLayout(page.id, [sectionData]);
      
      setEditingSection(null);
      
      toast({
        title: "Seção atualizada",
        description: `A seção "${sectionData.title || sectionData.sectionKey}" foi atualizada com sucesso.`
      });
    } catch (err) {
      toast({
        title: "Erro ao atualizar seção",
        description: "Ocorreu um erro ao atualizar a seção.",
        variant: "destructive"
      });
    }
  };

  const handleEditSection = (section: PageLayoutItem) => {
    setEditingSection(section);
  };

  const handleCancelChanges = async () => {
    // Recarregar layout original
    await fetchPageLayout(page.id);
    setHasChanges(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Layout da Página: {page.title}</CardTitle>
          <Button onClick={() => setIsAddingSectionOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Seção
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}
        {!loading && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={layoutItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead> {/* Handle */}
                    <TableHead>Seção</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {layoutItems.length > 0 ? (
                    layoutItems.map((item) => (
                      <SortableItem 
                        key={item.id} 
                        item={item} 
                        onVisibilityToggle={handleVisibilityToggle}
                        onEditSection={handleEditSection}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Nenhuma seção encontrada. Adicione seções para personalizar esta página.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {hasChanges && (
          <Button variant="outline" onClick={handleCancelChanges} disabled={loading}>
            Cancelar
          </Button>
        )}
        <Button onClick={handleSaveChanges} disabled={!hasChanges || loading}>
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </CardFooter>

      {/* Dialog para adicionar nova seção */}
      <Dialog open={isAddingSectionOpen} onOpenChange={setIsAddingSectionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Seção</DialogTitle>
          </DialogHeader>
          <SectionForm 
            pageId={page.id}
            onSave={handleAddSection}
            onCancel={() => setIsAddingSectionOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog para editar seção existente */}
      <Dialog open={!!editingSection} onOpenChange={(open) => !open && setEditingSection(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Seção</DialogTitle>
          </DialogHeader>
          {editingSection && (
            <SectionForm 
              pageId={page.id}
              section={editingSection}
              onSave={handleUpdateSection}
              onCancel={() => setEditingSection(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PageLayoutManager;
