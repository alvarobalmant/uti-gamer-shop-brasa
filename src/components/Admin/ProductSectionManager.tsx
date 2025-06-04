import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, ListFilter, Tag as TagIcon, Package as PackageIcon } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogTrigger, 
  DialogClose 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger, 
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from '@/components/ui/use-toast';
import { useProductSections, ProductSection, ProductSectionInput, SectionItemType } from '@/hooks/useProductSections';
import { useProducts, Product } from '@/hooks/useProducts'; 
import { useTags, Tag } from '@/hooks/useTags';
import { Skeleton } from '@/components/ui/skeleton';

// Helper to get item names for display
const getItemName = (itemId: string, type: SectionItemType, products: Product[], tags: Tag[]): string => {
  if (type === 'product') {
    const product = products.find(p => p.id === itemId);
    return product?.name || itemId; 
  } else {
    const tag = tags.find(t => t.id === itemId); 
    return tag?.name || itemId; 
  }
};

const ProductSectionManager: React.FC = () => {
  const { toast } = useToast();
  const { sections, loading: sectionsLoading, error: sectionsError, createSection, updateSection, deleteSection, fetchProductSections } = useProductSections();
  const { products, loading: productsLoading } = useProducts();
  const { tags, loading: tagsLoading } = useTags();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<ProductSection | null>(null);
  const [formData, setFormData] = useState<Omit<ProductSectionInput, 'items'>>({ title: '', view_all_link: '' });
  const [selectedItems, setSelectedItems] = useState<{ type: SectionItemType; id: string }[]>([]);
  const [itemTypeToAdd, setItemTypeToAdd] = useState<SectionItemType>('product'); 

  const isLoading = sectionsLoading || productsLoading || tagsLoading;

  const handleEditClick = (section: ProductSection) => {
    setCurrentSection(section);
    setFormData({ title: section.title, view_all_link: section.view_all_link || '' });
    setSelectedItems(section.items?.map(item => ({ type: item.item_type, id: item.item_id })) || []);
    setItemTypeToAdd(section.items?.[0]?.item_type || 'product'); 
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setCurrentSection(null);
    setFormData({ title: '', view_all_link: '' });
    setSelectedItems([]);
    setItemTypeToAdd('product');
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    const confirmed = confirm('Tem certeza que deseja remover esta seção? Ela também será removida do layout da página inicial.');
    if (confirmed) {
      await deleteSection(id);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast({ title: 'Erro', description: 'O título da seção é obrigatório.', variant: 'destructive' });
      return;
    }
    if (selectedItems.length === 0) {
        toast({ title: 'Erro', description: 'Adicione pelo menos um produto ou tag à seção.', variant: 'destructive' });
        return;
    }

    const sectionInput: ProductSectionInput = {
      title: formData.title,
      view_all_link: formData.view_all_link || null,
      items: selectedItems.map((item, index) => ({
        item_id: item.id,
        item_type: item.type,
        display_order: index + 1
      })),
    };

    let success = false;
    if (currentSection) {
      const result = await updateSection(currentSection.id, sectionInput);
      success = !!result;
    } else {
      const result = await createSection(sectionInput);
      success = !!result;
    }

    if (success) {
      setIsModalOpen(false);
    }
  };

  const handleItemTypeChange = (value: string) => {
    setSelectedItems([]); 
    setItemTypeToAdd(value as SectionItemType);
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => {
      if (prev.some(item => item.id === itemId && item.type === itemTypeToAdd)) {
        return prev;
      }
      return [...prev, { type: itemTypeToAdd, id: itemId }];
    });
  };

  const handleItemRemove = (itemIdToRemove: string, typeToRemove: SectionItemType) => {
    setSelectedItems(prev => prev.filter(item => !(item.id === itemIdToRemove && item.type === typeToRemove)));
  };

  const productOptions = useMemo(() => products.map(p => ({ value: p.id, label: p.name })), [products]);
  const tagOptions = useMemo(() => tags.map(t => ({ value: t.id, label: t.name })), [tags]); 

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gerenciar Seções de Produtos</CardTitle>
          <p className="text-sm text-muted-foreground">
            Crie e edite as seções que exibem produtos na página inicial.
          </p>
        </div>
        <Button size="sm" onClick={handleAddNewClick} disabled={isLoading}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Adicionar Seção
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}
        {sectionsError && <p className="text-red-500">Erro ao carregar seções: {sectionsError}</p>}
        {!isLoading && !sectionsError && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Itens</TableHead>
                <TableHead>Link "Ver Todos"</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.length > 0 ? (
                sections.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell className="font-medium">{section.title}</TableCell>
                    <TableCell className="capitalize">
                      {section.items?.[0]?.item_type === 'product' ? <PackageIcon className="h-4 w-4 inline mr-1"/> : <TagIcon className="h-4 w-4 inline mr-1"/>}
                      {section.items?.[0]?.item_type === 'product' ? 'Produtos' : 'Tags'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {section.items?.slice(0, 3).map(item => (
                          <Badge key={item.id || item.item_id} variant="secondary">
                            {getItemName(item.item_id, item.item_type, products, tags)}
                          </Badge>
                        ))}
                        {section.items && section.items.length > 3 && (
                          <Badge variant="outline">+{section.items.length - 3}...</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{section.view_all_link || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleEditClick(section)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(section.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhuma seção de produtos cadastrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentSection ? 'Editar Seção' : 'Adicionar Nova Seção'}</DialogTitle>
            <DialogDescription>
              Defina o título, o link e selecione os produtos ou tags para esta seção.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              {/* Title */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Título*
                </Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} 
                  className="col-span-3" 
                  required 
                />
              </div>
              {/* View All Link */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="viewAllLink" className="text-right">
                  Link "Ver Todos"
                </Label>
                <Input 
                  id="viewAllLink" 
                  name="viewAllLink" 
                  value={formData.view_all_link || ''} 
                  onChange={(e) => setFormData(prev => ({ ...prev, view_all_link: e.target.value }))} 
                  className="col-span-3" 
                  placeholder="Opcional (ex: /categoria/promocoes)"
                />
              </div>
              {/* Item Type Selector */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="itemType" className="text-right">
                  Tipo de Item*
                </Label>
                <Select 
                  value={itemTypeToAdd}
                  onValueChange={handleItemTypeChange}
                  disabled={selectedItems.length > 0} 
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Produtos Específicos</SelectItem>
                    <SelectItem value="tag">Produtos por Tag</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Item Selector (Product or Tag) */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="itemSelector" className="text-right pt-2">
                  {itemTypeToAdd === 'product' ? 'Produtos*' : 'Tags*'}
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar {itemTypeToAdd === 'product' ? 'Produto' : 'Tag'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder={`Buscar ${itemTypeToAdd === 'product' ? 'produto' : 'tag'}...`} />
                        <CommandList>
                          <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                          <CommandGroup>
                            {(itemTypeToAdd === 'product' ? productOptions : tagOptions).map((option) => (
                              <CommandItem
                                key={option.value}
                                value={option.value} 
                                onSelect={() => handleItemSelect(option.value)}
                                disabled={selectedItems.some(item => item.id === option.value && item.type === itemTypeToAdd)}
                              >
                                {option.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {/* Display Selected Items */}
                  <ScrollArea className="h-32 mt-2 border rounded-md p-2">
                    <div className="flex flex-wrap gap-2">
                      {selectedItems.length === 0 && (
                        <p className="text-sm text-muted-foreground p-2">Nenhum item selecionado.</p>
                      )}
                      {selectedItems.map((item) => (
                        <Badge key={`${item.type}-${item.id}`} variant="secondary">
                          {getItemName(item.id, item.type, products, tags)}
                          <button 
                            type="button" 
                            onClick={() => handleItemRemove(item.id, item.type)} 
                            className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            aria-label={`Remover ${getItemName(item.id, item.type, products, tags)}`}
                          >
                            <span className="text-xs">×</span>
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading || selectedItems.length === 0}>
                {isLoading ? 'Salvando...' : (currentSection ? 'Salvar Alterações' : 'Adicionar Seção')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProductSectionManager;
