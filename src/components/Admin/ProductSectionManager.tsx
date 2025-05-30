import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox'; // Using Checkbox for multi-select
import { toast } from 'sonner'; // Using sonner as it's often preferred with shadcn/ui
import { Loader2, PlusCircle, Edit, Trash2, AlertCircle } from 'lucide-react';

// Types
type ProductSection = {
  id: string;
  title: string;
  selection_type: 'products' | 'tags';
  selected_product_ids: string[] | null;
  selected_tag_ids: string[] | null;
  max_products: number;
  created_at: string;
};

type Product = { id: string; name: string };
type Tag = { id: string; name: string };

// Fetch functions
const fetchProductSections = async (): Promise<ProductSection[]> => {
  const { data, error } = await supabase.from('product_sections').select('*').order('created_at');
  if (error) {
      console.error("Error fetching product sections:", error);
      throw new Error('Erro ao buscar seções de produtos.');
  }
  // Ensure arrays are always arrays, even if null in DB
  return (data || []).map(section => ({
      ...section,
      selected_product_ids: section.selected_product_ids || [],
      selected_tag_ids: section.selected_tag_ids || [],
  }));
};

const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from('products').select('id, name').order('name');
  if (error) {
      console.error("Error fetching products:", error);
      throw new Error('Erro ao buscar produtos.');
  }
  return data || [];
};

const fetchTags = async (): Promise<Tag[]> => {
  const { data, error } = await supabase.from('tags').select('id, name').order('name');
  if (error) {
      console.error("Error fetching tags:", error);
      throw new Error('Erro ao buscar tags.');
  }
  return data || [];
};

// Upsert function
const upsertProductSection = async (sectionData: Partial<ProductSection>) => {
    const dataToUpsert = {
        ...sectionData,
        // Ensure arrays are correctly formatted for Supabase
        selected_product_ids: sectionData.selection_type === 'products' ? sectionData.selected_product_ids : null,
        selected_tag_ids: sectionData.selection_type === 'tags' ? sectionData.selected_tag_ids : null,
    };

    // Remove id if it's a new entry (or let upsert handle it if id is null/undefined)
    if (!dataToUpsert.id) {
        delete dataToUpsert.id;
    }

    const { data, error } = await supabase
        .from('product_sections')
        .upsert(dataToUpsert)
        .select(); // Select to get the upserted data back

    if (error) {
        console.error('Error upserting product section:', error);
        throw new Error(`Erro ao ${sectionData.id ? 'atualizar' : 'criar'} seção: ${error.message}`);
    }
    return data;
};

// Delete function
const deleteProductSection = async (id: string) => {
    // Before deleting, check if it's used in homepage_sections
    const { data: usage, error: usageError } = await supabase
        .from('homepage_sections')
        .select('id')
        .eq('product_section_id', id)
        .limit(1);

    if (usageError) {
        console.error('Error checking section usage:', usageError);
        throw new Error('Erro ao verificar uso da seção.');
    }

    if (usage && usage.length > 0) {
        throw new Error('Esta seção está em uso na estrutura da homepage e não pode ser excluída.');
    }

    // Proceed with deletion if not used
    const { error } = await supabase
        .from('product_sections')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting product section:', error);
        throw new Error(`Erro ao excluir seção: ${error.message}`);
    }
};

// Component
const ProductSectionManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<ProductSection | null>(null);
  // Use a state for form data separate from the query cache
  const [formData, setFormData] = useState<Partial<ProductSection>>({ selection_type: 'products', max_products: 8 });

  // Queries
  const { data: sections = [], isLoading: isLoadingSections, isError: isErrorSections, error: errorSections } = useQuery<ProductSection[], Error>({
    queryKey: ['productSections'],
    queryFn: fetchProductSections,
  });
  const { data: products = [], isLoading: isLoadingProducts } = useQuery<Product[], Error>({
    queryKey: ['productsList'],
    queryFn: fetchProducts,
  });
  const { data: tags = [], isLoading: isLoadingTags } = useQuery<Tag[], Error>({
    queryKey: ['tagsList'],
    queryFn: fetchTags,
  });

  // Mutations
  const upsertMutation = useMutation({ 
    mutationFn: upsertProductSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productSections'] });
      setIsDialogOpen(false);
      toast.success(`Seção ${editingSection ? 'atualizada' : 'criada'} com sucesso!`);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const deleteMutation = useMutation({ 
    mutationFn: deleteProductSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productSections'] });
      toast.success('Seção excluída com sucesso!');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleOpenDialog = (section: ProductSection | null = null) => {
    setEditingSection(section);
    // Initialize form data based on whether editing or creating
    setFormData(section ? { ...section } : { title: '', selection_type: 'products', max_products: 8, selected_product_ids: [], selected_tag_ids: [] });
    setIsDialogOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) || 0 : value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ 
        ...prev, 
        selection_type: value as 'products' | 'tags',
        // Reset selections when type changes
        selected_product_ids: value === 'products' ? prev.selected_product_ids : [],
        selected_tag_ids: value === 'tags' ? prev.selected_tag_ids : [],
    }));
  };

  const handleCheckboxChange = (id: string, type: 'product' | 'tag') => {
    setFormData(prev => {
        const currentIds = type === 'product' ? (prev.selected_product_ids || []) : (prev.selected_tag_ids || []);
        const newIds = currentIds.includes(id) 
            ? currentIds.filter(currentId => currentId !== id)
            : [...currentIds, id];
        return {
            ...prev,
            [type === 'product' ? 'selected_product_ids' : 'selected_tag_ids']: newIds,
        };
    });
  };

  const handleSubmit = () => {
    if (!formData.title?.trim()) {
        toast.error('O título da seção é obrigatório.');
        return;
    }
    if (formData.selection_type === 'products' && (!formData.selected_product_ids || formData.selected_product_ids.length === 0)) {
        toast.error('Selecione pelo menos um produto.');
        return;
    }
     if (formData.selection_type === 'tags' && (!formData.selected_tag_ids || formData.selected_tag_ids.length === 0)) {
        toast.error('Selecione pelo menos uma tag.');
        return;
    }

    upsertMutation.mutate(formData);
  };

  return (
    <Card className="bg-gray-800 border-gray-700 text-white mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gerenciar Seções de Produtos</CardTitle>
          <CardDescription className="text-gray-400">
            Crie e edite as seções customizadas de produtos para a homepage.
          </CardDescription>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Nova Seção
        </Button>
      </CardHeader>
      <CardContent>
        {isLoadingSections && <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>}
        {isErrorSections && 
            <div className="text-red-500 p-4 bg-red-900/20 border border-red-700 rounded flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" /> Erro: {errorSections?.message}
            </div>
        }
        {!isLoadingSections && !isErrorSections && (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-gray-750 border-gray-700">
                <TableHead className="text-white">Título</TableHead>
                <TableHead className="text-white">Tipo de Seleção</TableHead>
                <TableHead className="text-white">Max Produtos</TableHead>
                <TableHead className="text-white text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.length === 0 && (
                  <TableRow className="border-gray-700">
                      <TableCell colSpan={4} className="text-center text-gray-500 py-4">Nenhuma seção de produto criada ainda.</TableCell>
                  </TableRow>
              )}
              {sections.map((section) => (
                <TableRow key={section.id} className="hover:bg-gray-750 border-gray-700">
                  <TableCell className="font-medium">{section.title}</TableCell>
                  <TableCell>{section.selection_type === 'products' ? 'Produtos Específicos' : 'Tags'}</TableCell>
                  <TableCell>{section.max_products}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(section)} className="mr-2 text-gray-400 hover:text-white" disabled={deleteMutation.isPending || upsertMutation.isPending}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(section.id)} className="text-red-500 hover:text-red-400" disabled={deleteMutation.isPending || upsertMutation.isPending}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>{editingSection ? 'Editar' : 'Criar Nova'} Seção de Produtos</DialogTitle>
            <DialogDescription className="text-gray-400">
              Defina o título, como os produtos serão selecionados e quantos exibir.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Title Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right text-gray-300">Título <span className="text-red-500">*</span></Label>
              <Input id="title" name="title" value={formData.title || ''} onChange={handleFormChange} className="col-span-3 bg-gray-700 border-gray-600 text-white" placeholder="Ex: Mais Vendidos" />
            </div>
            {/* Selection Type Radio */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-gray-300">Tipo Seleção</Label>
              <RadioGroup
                value={formData.selection_type}
                onValueChange={handleRadioChange}
                className="col-span-3 flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="products" id="r-products" className="border-gray-600 text-blue-500" />
                  <Label htmlFor="r-products" className="text-gray-300">Produtos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tags" id="r-tags" className="border-gray-600 text-blue-500" />
                  <Label htmlFor="r-tags" className="text-gray-300">Tags</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Conditional Product Selection */}
            {formData.selection_type === 'products' && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2 text-gray-300">Produtos <span className="text-red-500">*</span></Label>
                <div className="col-span-3 max-h-48 overflow-y-auto border border-gray-600 rounded p-3 bg-gray-700 space-y-2">
                  {isLoadingProducts && <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-400" />}
                  {!isLoadingProducts && products.length === 0 && <p className='text-sm text-gray-500'>Nenhum produto encontrado.</p>}
                  {products.map(p => (
                    <div key={p.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`prod-${p.id}`}
                        checked={(formData.selected_product_ids || []).includes(p.id)}
                        onCheckedChange={() => handleCheckboxChange(p.id, 'product')}
                        className="border-gray-500 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                      />
                      <Label htmlFor={`prod-${p.id}`} className="text-sm text-gray-300 font-normal cursor-pointer">{p.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Conditional Tag Selection */}
            {formData.selection_type === 'tags' && (
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2 text-gray-300">Tags <span className="text-red-500">*</span></Label>
                 <div className="col-span-3 max-h-48 overflow-y-auto border border-gray-600 rounded p-3 bg-gray-700 space-y-2">
                  {isLoadingTags && <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-400" />}
                  {!isLoadingTags && tags.length === 0 && <p className='text-sm text-gray-500'>Nenhuma tag encontrada.</p>}
                  {tags.map(t => (
                     <div key={t.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`tag-${t.id}`}
                        checked={(formData.selected_tag_ids || []).includes(t.id)}
                        onCheckedChange={() => handleCheckboxChange(t.id, 'tag')}
                        className="border-gray-500 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                      />
                      <Label htmlFor={`tag-${t.id}`} className="text-sm text-gray-300 font-normal cursor-pointer">{t.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Max Products Input */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="max_products" className="text-right text-gray-300">Max Produtos</Label>
              <Input id="max_products" name="max_products" type="number" min="1" max="20" value={formData.max_products || 8} onChange={handleFormChange} className="col-span-3 bg-gray-700 border-gray-600 text-white" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700" disabled={upsertMutation.isPending}>
                Cancelar
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700" disabled={upsertMutation.isPending}>
              {upsertMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {editingSection ? 'Salvar Alterações' : 'Criar Seção'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProductSectionManager;

