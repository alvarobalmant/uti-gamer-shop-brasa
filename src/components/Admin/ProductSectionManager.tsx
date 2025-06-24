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
import { useProducts, Product } from '@/hooks/useProducts'; // Assuming Product type is exported
import { useTags, Tag } from '@/hooks/useTags';
import { Skeleton } from '@/components/ui/skeleton';

// Helper to get item names for display
const getItemName = (itemId: string, type: SectionItemType, products: Product[], tags: Tag[]): string => {
  if (type === 'product') {
    const product = products.find(p => p.id === itemId);
    return product?.name || itemId; // Fallback to ID if not found
  } else {
    const tag = tags.find(t => t.id === itemId); // Assuming tag ID is used
    return tag?.name || itemId; // Fallback to ID/name
  }
};

const ProductSectionManager: React.FC = () => {
  const { toast } = useToast();
  const { sections, loading: sectionsLoading, error: sectionsError, createSection, updateSection, deleteSection, fetchSections } = useProductSections();
  const { products, loading: productsLoading } = useProducts();
  const { tags, loading: tagsLoading } = useTags();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState<ProductSection | null>(null);
  const [formData, setFormData] = useState<Omit<ProductSectionInput, 'items'>>({ 
    title: '', 
<<<<<<< HEAD
    titlePart1: '',
    titlePart2: '',
    titleColor1: '#000000',
    titleColor2: '#9ca3af',
=======
    title_part1: '', 
    title_part2: '', 
    title_color1: '#000000', 
    title_color2: '#9ca3af', 
>>>>>>> b1aecab4c65a0281d07579c8840a9247db6e56bb
    view_all_link: '' 
  });
  const [selectedItems, setSelectedItems] = useState<{ type: SectionItemType; id: string }[]>([]);
  const [itemTypeToAdd, setItemTypeToAdd] = useState<SectionItemType>('product'); // 'product' or 'tag'

  const isLoading = sectionsLoading || productsLoading || tagsLoading;

  const handleEditClick = (section: ProductSection) => {
    setCurrentSection(section);
    setFormData({ 
      title: section.title, 
<<<<<<< HEAD
      titlePart1: section.titlePart1 || '',
      titlePart2: section.titlePart2 || '',
      titleColor1: section.titleColor1 || '#000000',
      titleColor2: section.titleColor2 || '#9ca3af',
=======
      title_part1: section.title_part1 || '',
      title_part2: section.title_part2 || '',
      title_color1: section.title_color1 || '#000000',
      title_color2: section.title_color2 || '#9ca3af',
>>>>>>> b1aecab4c65a0281d07579c8840a9247db6e56bb
      view_all_link: section.view_all_link || '' 
    });
    setSelectedItems(section.items?.map(item => ({ type: item.item_type, id: item.item_id })) || []);
    // Determine initial item type based on first item, if any
    setItemTypeToAdd(section.items?.[0]?.item_type || 'product'); 
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setCurrentSection(null);
    setFormData({ 
      title: '', 
<<<<<<< HEAD
      titlePart1: '',
      titlePart2: '',
      titleColor1: '#000000',
      titleColor2: '#9ca3af',
=======
      title_part1: '', 
      title_part2: '', 
      title_color1: '#000000', 
      title_color2: '#9ca3af', 
>>>>>>> b1aecab4c65a0281d07579c8840a9247db6e56bb
      view_all_link: '' 
    });
    setSelectedItems([]);
    setItemTypeToAdd('product');
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    // Add confirmation dialog here
    const confirmed = confirm('Tem certeza que deseja remover esta seção? Ela também será removida do layout da página inicial.');
    if (confirmed) {
      await deleteSection(id);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação: deve ter título simples OU pelo menos uma parte do título bicolor
    const hasSimpleTitle = formData.title && formData.title.trim() !== '';
    const hasBicolorTitle = (formData.titlePart1 && formData.titlePart1.trim() !== '') || 
                           (formData.titlePart2 && formData.titlePart2.trim() !== '');
    
    if (!hasSimpleTitle && !hasBicolorTitle) {
      toast({ 
        title: 'Erro', 
        description: 'É obrigatório ter um título simples OU pelo menos uma parte do título bicolor.', 
        variant: 'destructive' 
      });
      return;
    }
    
    if (selectedItems.length === 0) {
        toast({ title: 'Erro', description: 'Adicione pelo menos um produto ou tag à seção.', variant: 'destructive' });
        return;
    }

    const sectionInput: ProductSectionInput = {
      id: currentSection?.id,
<<<<<<< HEAD
      title: formData.title || '', // Pode ser vazio se usar título bicolor
      titlePart1: formData.titlePart1,
      titlePart2: formData.titlePart2,
      titleColor1: formData.titleColor1,
      titleColor2: formData.titleColor2,
=======
      title: formData.title,
      title_part1: formData.title_part1,
      title_part2: formData.title_part2,
      title_color1: formData.title_color1,
      title_color2: formData.title_color2,
>>>>>>> b1aecab4c65a0281d07579c8840a9247db6e56bb
      view_all_link: formData.view_all_link || null,
      items: selectedItems,
    };

    let success = false;
    if (currentSection) {
      const result = await updateSection(sectionInput);
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
    // Clear selected items when changing type to avoid mixing
    setSelectedItems([]); 
    setItemTypeToAdd(value as SectionItemType);
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => {
      // Prevent duplicates
      if (prev.some(item => item.id === itemId && item.type === itemTypeToAdd)) {
        return prev;
      }
      return [...prev, { type: itemTypeToAdd, id: itemId }];
    });
  };

  const handleItemRemove = (itemIdToRemove: string, typeToRemove: SectionItemType) => {
    setSelectedItems(prev => prev.filter(item => !(item.id === itemIdToRemove && item.type === typeToRemove)));
  };

  // Memoize options for selectors
  const productOptions = useMemo(() => products.map(p => ({ value: p.id, label: p.name })), [products]);
  const tagOptions = useMemo(() => tags.map(t => ({ value: t.id, label: t.name })), [tags]); // Assuming tags have unique IDs

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
                    <TableCell className="font-medium">
                      {section.title_part1 && section.title_part2 ? (
                        <span>
                          <span style={{ color: section.title_color1 }}>{section.title_part1}</span>
                          {' '}
                          <span style={{ color: section.title_color2 }}>{section.title_part2}</span>
                        </span>
                      ) : (
                        section.title
                      )}
                    </TableCell>
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
              Defina o título, o link e selecione os produtos ou tags para esta seção. Use títulos bicolores para um visual mais atrativo.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
<<<<<<< HEAD
            <div className="grid gap-6 py-4">
              {/* Title Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-300 flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Configurações de Título
                </h3>
                
                {/* Simple Title */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right text-gray-300">
                    Título Simples
                  </Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={formData.title} 
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} 
                    className="col-span-3 bg-[#1A1A2E] border-[#343A40] text-white placeholder:text-gray-500" 
                    placeholder="Digite o título (ou deixe vazio para usar título bicolor)"
                  />
                </div>

                {/* Bicolor Title Part 1 */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="titlePart1" className="text-right text-green-400">
                    Título Parte 1
                  </Label>
                  <div className="col-span-3 flex gap-2">
                    <Input 
                      id="titlePart1" 
                      name="titlePart1" 
                      value={formData.titlePart1 || ''} 
                      onChange={(e) => setFormData(prev => ({ ...prev, titlePart1: e.target.value }))} 
                      className="flex-1 bg-[#1A1A2E] border-[#343A40] text-white placeholder:text-gray-500" 
                      placeholder="ex: Most Popular"
                    />
                    <input
                      type="color"
                      value={formData.titleColor1 || '#000000'}
                      onChange={(e) => setFormData(prev => ({ ...prev, titleColor1: e.target.value }))}
                      className="w-12 h-10 rounded border border-[#343A40] bg-[#1A1A2E] cursor-pointer"
                      title="Cor da primeira parte"
                    />
                  </div>
                </div>

                {/* Bicolor Title Part 2 */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="titlePart2" className="text-right text-purple-400">
                    Título Parte 2
                  </Label>
                  <div className="col-span-3 flex gap-2">
                    <Input 
                      id="titlePart2" 
                      name="titlePart2" 
                      value={formData.titlePart2 || ''} 
                      onChange={(e) => setFormData(prev => ({ ...prev, titlePart2: e.target.value }))} 
                      className="flex-1 bg-[#1A1A2E] border-[#343A40] text-white placeholder:text-gray-500" 
                      placeholder="ex: Trading Cards"
                    />
                    <input
                      type="color"
                      value={formData.titleColor2 || '#9ca3af'}
                      onChange={(e) => setFormData(prev => ({ ...prev, titleColor2: e.target.value }))}
                      className="w-12 h-10 rounded border border-[#343A40] bg-[#1A1A2E] cursor-pointer"
                      title="Cor da segunda parte"
                    />
                  </div>
                </div>
              </div>

=======
            <div className="grid gap-4 py-4">
              {/* Title */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Título Simples
                </Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} 
                  className="col-span-3" 
                  placeholder="Usado se não houver título bicolor"
                />
              </div>
              
              {/* Bicolor Title Fields */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title_part1" className="text-right">
                  Título Parte 1
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input 
                    id="title_part1" 
                    name="title_part1" 
                    value={formData.title_part1} 
                    onChange={(e) => setFormData(prev => ({ ...prev, title_part1: e.target.value }))} 
                    className="flex-1"
                    placeholder="Ex: PlayStation 5 Accessories."
                  />
                  <input
                    type="color"
                    value={formData.title_color1}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_color1: e.target.value }))}
                    className="w-12 h-10 rounded border"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title_part2" className="text-right">
                  Título Parte 2
                </Label>
                <div className="col-span-3 flex gap-2">
                  <Input 
                    id="title_part2" 
                    name="title_part2" 
                    value={formData.title_part2} 
                    onChange={(e) => setFormData(prev => ({ ...prev, title_part2: e.target.value }))} 
                    className="flex-1"
                    placeholder="Ex: Best Sellers."
                  />
                  <input
                    type="color"
                    value={formData.title_color2}
                    onChange={(e) => setFormData(prev => ({ ...prev, title_color2: e.target.value }))}
                    className="w-12 h-10 rounded border"
                  />
                </div>
              </div>
              
              {/* Preview */}
              {(formData.title_part1 || formData.title_part2) && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Preview:</Label>
                  <div className="col-span-3 p-2 border rounded bg-gray-50">
                    <span style={{ color: formData.title_color1 }}>{formData.title_part1}</span>
                    {formData.title_part1 && formData.title_part2 && ' '}
                    <span style={{ color: formData.title_color2 }}>{formData.title_part2}</span>
                  </div>
                </div>
              )}
              
>>>>>>> b1aecab4c65a0281d07579c8840a9247db6e56bb
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
                  disabled={selectedItems.length > 0} // Disable changing type if items are already selected
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
                                value={option.value} // Use value for CommandItem value
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
