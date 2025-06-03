import React, { useState, useEffect } from 'react';
import { usePages, Page } from '@/hooks/usePages';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Edit, Trash2, Plus, Layout, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageLayoutManager from './PageLayoutManager';

const PageManager: React.FC = () => {
  const { toast } = useToast();
  const { 
    pages, 
    loading, 
    error, 
    createPage, 
    updatePage, 
    deletePage 
  } = usePages();
  
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLayoutOpen, setIsLayoutOpen] = useState(false);
  
  // Form state for create/edit
  const [formData, setFormData] = useState<Partial<Page>>({
    title: '',
    slug: '',
    description: '',
    isActive: true,
    theme: {
      primaryColor: '#107C10',
      secondaryColor: '#3A3A3A',
    },
    filters: {
      tagIds: [],
      categoryIds: []
    }
  });

  // Reset form when switching tabs or closing edit mode
  useEffect(() => {
    if (activeTab === 'create' || !isEditing) {
      setFormData({
        title: '',
        slug: '',
        description: '',
        isActive: true,
        theme: {
          primaryColor: '#107C10',
          secondaryColor: '#3A3A3A',
        },
        filters: {
          tagIds: [],
          categoryIds: []
        }
      });
    }
  }, [activeTab, isEditing]);

  // Set form data when editing a page
  useEffect(() => {
    if (isEditing && selectedPage) {
      setFormData({
        title: selectedPage.title,
        slug: selectedPage.slug,
        description: selectedPage.description || '',
        isActive: selectedPage.isActive,
        theme: selectedPage.theme ? { ...selectedPage.theme } : { primaryColor: '#107C10', secondaryColor: '#3A3A3A' },
        filters: selectedPage.filters ? { ...selectedPage.filters } : { tagIds: [], categoryIds: [] }
      });
    }
  }, [isEditing, selectedPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object || {}),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };

  const handleCreatePage = async () => {
    try {
      if (!formData.title || !formData.slug) {
        toast({
          title: "Campos obrigatórios",
          description: "Título e slug são obrigatórios.",
          variant: "destructive"
        });
        return;
      }

      // Normalize slug
      const normalizedSlug = formData.slug
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      const newPage = await createPage({
        title: formData.title,
        slug: normalizedSlug,
        description: formData.description,
        isActive: formData.isActive ?? true,
        theme: formData.theme as Page['theme'],
        filters: formData.filters as Page['filters']
      });

      toast({
        title: "Página criada",
        description: `A página "${newPage.title}" foi criada com sucesso.`
      });

      setActiveTab('list');
    } catch (err) {
      toast({
        title: "Erro ao criar página",
        description: "Ocorreu um erro ao criar a página. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePage = async () => {
    if (!selectedPage) return;

    try {
      if (!formData.title || !formData.slug) {
        toast({
          title: "Campos obrigatórios",
          description: "Título e slug são obrigatórios.",
          variant: "destructive"
        });
        return;
      }

      // Normalize slug
      const normalizedSlug = formData.slug
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      await updatePage(selectedPage.id, {
        title: formData.title,
        slug: normalizedSlug,
        description: formData.description,
        isActive: formData.isActive,
        theme: formData.theme,
        filters: formData.filters
      });

      toast({
        title: "Página atualizada",
        description: `A página "${formData.title}" foi atualizada com sucesso.`
      });

      setIsEditing(false);
      setSelectedPage(null);
    } catch (err) {
      toast({
        title: "Erro ao atualizar página",
        description: "Ocorreu um erro ao atualizar a página. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDeletePage = async (page: Page) => {
    try {
      await deletePage(page.id);
      
      toast({
        title: "Página excluída",
        description: `A página "${page.title}" foi excluída com sucesso.`
      });
      
      if (selectedPage?.id === page.id) {
        setSelectedPage(null);
        setIsEditing(false);
      }
    } catch (err) {
      toast({
        title: "Erro ao excluir página",
        description: "Ocorreu um erro ao excluir a página. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleEditPage = (page: Page) => {
    setSelectedPage(page);
    setIsEditing(true);
  };

  const handleOpenLayout = (page: Page) => {
    setSelectedPage(page);
    setIsLayoutOpen(true);
  };

  const renderPageList = () => {
    if (loading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      );
    }

    if (error) {
      return <p className="text-red-500">{error}</p>;
    }

    if (pages.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Nenhuma página encontrada.</p>
          <Button onClick={() => setActiveTab('create')}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Página
          </Button>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => (
            <TableRow key={page.id}>
              <TableCell className="font-medium">{page.title}</TableCell>
              <TableCell>/{page.slug}</TableCell>
              <TableCell>
                {page.isActive ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Eye className="mr-1 h-3 w-3" />
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    <EyeOff className="mr-1 h-3 w-3" />
                    Inativo
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleOpenLayout(page)}>
                  <Layout className="h-4 w-4" />
                  <span className="sr-only">Layout</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEditPage(page)}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Visualizar</span>
                  </a>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Excluir página</DialogTitle>
                      <DialogDescription>
                        Tem certeza que deseja excluir a página "{page.title}"? Esta ação não pode ser desfeita.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogClose>
                      <Button variant="destructive" onClick={() => handleDeletePage(page)}>
                        Excluir
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const renderPageForm = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Página *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ex: Xbox"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">URL da Página *</Label>
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">/</span>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="Ex: xbox"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Descreva brevemente o conteúdo desta página"
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tema da Página</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme.primaryColor">Cor Primária</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="theme.primaryColor"
                  name="theme.primaryColor"
                  type="color"
                  value={formData.theme?.primaryColor}
                  onChange={handleInputChange}
                  className="w-12 h-8 p-1"
                />
                <Input
                  value={formData.theme?.primaryColor}
                  onChange={handleInputChange}
                  name="theme.primaryColor"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme.secondaryColor">Cor Secundária</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="theme.secondaryColor"
                  name="theme.secondaryColor"
                  type="color"
                  value={formData.theme?.secondaryColor}
                  onChange={handleInputChange}
                  className="w-12 h-8 p-1"
                />
                <Input
                  value={formData.theme?.secondaryColor}
                  onChange={handleInputChange}
                  name="theme.secondaryColor"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-4">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="isActive">Página Ativa</Label>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gerenciador de Páginas</CardTitle>
              <CardDescription>
                Crie e gerencie páginas personalizadas para categorias e plataformas específicas
              </CardDescription>
            </div>
            {activeTab === 'list' && !isEditing && (
              <Button onClick={() => setActiveTab('create')}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Página
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Editar Página</h2>
              {renderPageForm()}
            </>
          ) : (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'list' | 'create')}>
              <TabsList className="mb-4">
                <TabsTrigger value="list">Lista de Páginas</TabsTrigger>
                <TabsTrigger value="create">Criar Página</TabsTrigger>
              </TabsList>
              <TabsContent value="list">
                {renderPageList()}
              </TabsContent>
              <TabsContent value="create">
                <h2 className="text-xl font-semibold mb-4">Nova Página</h2>
                {renderPageForm()}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdatePage}>
                Salvar Alterações
              </Button>
            </>
          ) : activeTab === 'create' ? (
            <>
              <Button variant="outline" onClick={() => setActiveTab('list')}>
                Cancelar
              </Button>
              <Button onClick={handleCreatePage}>
                Criar Página
              </Button>
            </>
          ) : null}
        </CardFooter>
      </Card>

      {/* Layout Manager Dialog */}
      {selectedPage && (
        <Dialog open={isLayoutOpen} onOpenChange={setIsLayoutOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Layout da Página: {selectedPage.title}</DialogTitle>
              <DialogDescription>
                Organize as seções e configure o conteúdo da página
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <PageLayoutManager page={selectedPage} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PageManager;
