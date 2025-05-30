import React, { useState, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useHomepageLayout, HomepageLayoutItem } from '@/hooks/useHomepageLayout'; // Import the hook and type
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

// Sortable Item Component
interface SortableItemProps {
  item: HomepageLayoutItem;
  onVisibilityToggle: (id: number, isVisible: boolean) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ item, onVisibilityToggle }) => {
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
      <TableCell className="font-medium">{item.title || item.section_key}</TableCell>
      <TableCell className="text-right w-24">
        <Switch
          id={`visibility-${item.id}`}
          checked={item.is_visible}
          onCheckedChange={(checked) => onVisibilityToggle(item.id, checked)}
          aria-label={item.is_visible ? 'Ocultar seção' : 'Mostrar seção'}
        />
        {/* Optional: Add icons for clarity */}
        {/* {item.is_visible ? <Eye className="h-4 w-4 inline-block ml-2 text-green-500" /> : <EyeOff className="h-4 w-4 inline-block ml-2 text-red-500" />} */}
      </TableCell>
    </TableRow>
  );
};

// Main AdminSections Component
const AdminSections: React.FC = () => {
  const { toast } = useToast();
  const { layoutItems, setLayoutItems, loading, error, updateLayout, fetchLayout } = useHomepageLayout();
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLayoutItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        // Update display_order based on new array index
        return newItems.map((item, index) => ({ ...item, display_order: index + 1 }));
      });
      setHasChanges(true);
    }
  }, [setLayoutItems]);

  const handleVisibilityToggle = useCallback((id: number, isVisible: boolean) => {
    setLayoutItems((items) =>
      items.map((item) => (item.id === id ? { ...item, is_visible: isVisible } : item))
    );
    setHasChanges(true);
  }, [setLayoutItems]);

  const handleSaveChanges = async () => {
    const updates = layoutItems.map(item => ({
      id: item.id,
      display_order: item.display_order,
      is_visible: item.is_visible,
    }));
    await updateLayout(updates);
    setHasChanges(false); // Reset changes state after saving
  };

  const handleCancelChanges = () => {
    fetchLayout(); // Refetch original layout
    setHasChanges(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organização da Página Inicial</CardTitle>
        <p className="text-sm text-muted-foreground">
          Arraste e solte as seções para reordenar como elas aparecem na página inicial. Use o botão para ativar ou desativar a visibilidade.
        </p>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={layoutItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead> {/* Handle */}
                    <TableHead>Seção</TableHead>
                    <TableHead className="text-right w-24">Visível</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {layoutItems.length > 0 ? (
                    layoutItems.map((item) => (
                      <SortableItem key={item.id} item={item} onVisibilityToggle={handleVisibilityToggle} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        Nenhuma seção encontrada ou layout não configurado.
                        Verifique se executou os scripts SQL e inseriu os dados iniciais na tabela `homepage_layout`.
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
    </Card>
  );
};

export default AdminSections;

