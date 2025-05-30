
import React, { useState, useEffect, useCallback } from 'react';
import { useQuickLinks, QuickLink } from '@/hooks/useQuickLinks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Settings, GripVertical, Info, Link as LinkIcon } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Sortable Row Component
interface SortableQuickLinkRowProps {
  link: QuickLink;
  onEdit: (link: QuickLink) => void;
  onDelete: (id: string) => void;
  onVisibilityToggle: (id: string, isActive: boolean) => void;
}

const SortableQuickLinkRow: React.FC<SortableQuickLinkRowProps> = ({ link, onEdit, onDelete, onVisibilityToggle }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });

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
      <TableCell className="w-16">
        <img src={link.icon_url} alt={link.label} className="w-8 h-8 object-contain rounded border border-border" onError={(e) => e.currentTarget.src = '/placeholder-icon.svg'} />
      </TableCell>
      <TableCell className="font-medium">{link.label}</TableCell>
      <TableCell className="text-sm text-muted-foreground">{link.path}</TableCell>
      <TableCell className="text-center">{link.position}</TableCell>
      <TableCell className="text-right w-24">
        <Switch
          id={`visibility-${link.id}`}
          checked={link.is_active}
          onCheckedChange={(checked) => onVisibilityToggle(link.id, checked)}
          aria-label={link.is_active ? 'Desativar link' : 'Ativar link'}
        />
      </TableCell>
      <TableCell className="text-right w-32">
        <Button variant="ghost" size="icon" onClick={() => onEdit(link)} className="mr-1 h-8 w-8">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(link.id)} className="text-destructive hover:text-destructive h-8 w-8">
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

// Main Manager Component
export const QuickLinkManager = () => {
  const { quickLinks, loading, fetchAllQuickLinksForAdmin, addQuickLink, updateQuickLink, deleteQuickLink } = useQuickLinks();
  const [editingLink, setEditingLink] = useState<QuickLink | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [localLinks, setLocalLinks] = useState<QuickLink[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchAllQuickLinksForAdmin();
  }, [fetchAllQuickLinksForAdmin]);

  useEffect(() => {
    setLocalLinks(quickLinks);
  }, [quickLinks]);

  const [formData, setFormData] = useState<Omit<QuickLink, 'id' | 'created_at' | 'updated_at'>>({
    label: '',
    path: '',
    icon_url: '',
    position: 1,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      label: '',
      path: '',
      icon_url: '',
      position: (localLinks.length + 1),
      is_active: true,
    });
    setEditingLink(null);
  };

  const handleEdit = (link: QuickLink) => {
    setEditingLink(link);
    setFormData({
      label: link.label,
      path: link.path,
      icon_url: link.icon_url,
      position: link.position,
      is_active: link.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.path || !formData.icon_url) {
      alert('Label, Path e Ícone são obrigatórios.');
      return;
    }

    try {
      let updatedLink;
      if (editingLink) {
        updatedLink = await updateQuickLink(editingLink.id, formData);
      } else {
        updatedLink = await addQuickLink(formData);
      }
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este link rápido?')) {
      await deleteQuickLink(id);
    }
  };

  const handleVisibilityToggle = async (id: string, isActive: boolean) => {
    try {
      await updateQuickLink(id, { is_active: isActive });
      // Update local state immediately for responsiveness
      setLocalLinks(prev => prev.map(link => link.id === id ? { ...link, is_active: isActive } : link));
    } catch (error) {
      // Error handled in hook
    }
  };

  // Drag and Drop Handling
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        // Update position based on new array index
        return newItems.map((item, index) => ({ ...item, position: index + 1 }));
      });
      setHasChanges(true);
    }
  }, []);

  const handleSaveChangesOrder = async () => {
    const updates = localLinks.map(link => ({ id: link.id, position: link.position }));
    try {
      // Update positions in batch or individually
      await Promise.all(updates.map(update => updateQuickLink(update.id, { position: update.position })));
      setHasChanges(false);
      fetchAllQuickLinksForAdmin(); // Refetch to confirm
    } catch (error) {
      console.error("Erro ao salvar ordem:", error);
    }
  };

  const handleCancelChangesOrder = () => {
    setLocalLinks(quickLinks); // Revert to original order from hook
    setHasChanges(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="w-5 h-5" />
          Gerenciar Links Rápidos
        </CardTitle>
        <Alert variant="default" className="mt-2">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Configure os links rápidos exibidos na página inicial. Arraste para reordenar. Use ícones SVG ou PNG (recomendado: 64x64px).
          </AlertDescription>
        </Alert>
      </CardHeader>

      <CardContent>
        <div className="flex justify-end mb-4">
          <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsDialogOpen(open); }}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Link Rápido
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingLink ? 'Editar Link Rápido' : 'Novo Link Rápido'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="label">Label *</Label>
                    <Input id="label" value={formData.label} onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="path">Path *</Label>
                    <Input id="path" value={formData.path} onChange={(e) => setFormData(prev => ({ ...prev, path: e.target.value }))} placeholder="/categoria/exemplo" required />
                  </div>
                </div>
                <div className="space-y-1">
                  <ImageUpload
                    onImageUploaded={(url) => setFormData(prev => ({ ...prev, icon_url: url }))}
                    currentImage={formData.icon_url}
                    label="Ícone (SVG/PNG) *"
                    folder="quick-link-icons"
                  />
                  {!formData.icon_url && editingLink?.icon_url && (
                     <p className="text-xs text-muted-foreground">Ícone atual: {editingLink.icon_url}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="is_active" checked={formData.is_active} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))} />
                  <Label htmlFor="is_active">Ativo</Label>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                     <Button type="button" variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit">{editingLink ? 'Salvar Alterações' : 'Adicionar Link'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading && (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        )}
        {!loading && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={localLinks.map(link => link.id)} strategy={verticalListSortingStrategy}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead> {/* Handle */}
                    <TableHead className="w-16">Ícone</TableHead>
                    <TableHead>Label</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead className="text-center">Posição</TableHead>
                    <TableHead className="text-right w-24">Ativo</TableHead>
                    <TableHead className="text-right w-32">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localLinks.length > 0 ? (
                    localLinks.map((link) => (
                      <SortableQuickLinkRow
                        key={link.id}
                        link={link}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onVisibilityToggle={handleVisibilityToggle}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground h-24">
                        Nenhum link rápido encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
      {hasChanges && (
        <CardFooter className="flex justify-end gap-2 border-t pt-4">
          <Button variant="outline" onClick={handleCancelChangesOrder} disabled={loading}>
            Cancelar Ordem
          </Button>
          <Button onClick={handleSaveChangesOrder} disabled={loading}>
            Salvar Ordem
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
