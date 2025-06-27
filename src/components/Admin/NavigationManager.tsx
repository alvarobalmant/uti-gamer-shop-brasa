
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { useNavigationItemsAdmin, useCreateNavigationItem, useUpdateNavigationItem, useDeleteNavigationItem, NavigationItem } from '@/hooks/useNavigationItems';
import { useToast } from '@/hooks/use-toast';

const NavigationManager = () => {
  const { data: navigationItems, isLoading } = useNavigationItemsAdmin();
  const createMutation = useCreateNavigationItem();
  const updateMutation = useUpdateNavigationItem();
  const deleteMutation = useDeleteNavigationItem();
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    icon_url: '',
    icon_type: 'emoji' as 'image' | 'emoji' | 'icon',
    background_color: '#6366f1',
    text_color: '#ffffff',
    hover_background_color: '#4f46e5',
    hover_text_color: '#ffffff',
    link_url: '',
    link_type: 'internal' as 'internal' | 'external',
    display_order: 0,
    is_visible: true,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      icon_url: '',
      icon_type: 'emoji',
      background_color: '#6366f1',
      text_color: '#ffffff',
      hover_background_color: '#4f46e5',
      hover_text_color: '#ffffff',
      link_url: '',
      link_type: 'internal',
      display_order: 0,
      is_visible: true,
      is_active: true,
    });
    setEditingItem(null);
  };

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync(formData);
      toast({
        title: "Sucesso",
        description: "Item de navegação criado com sucesso!",
      });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar item de navegação.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: NavigationItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      icon_url: item.icon_url || '',
      icon_type: item.icon_type,
      background_color: item.background_color,
      text_color: item.text_color,
      hover_background_color: item.hover_background_color || '',
      hover_text_color: item.hover_text_color || '',
      link_url: item.link_url,
      link_type: item.link_type,
      display_order: item.display_order,
      is_visible: item.is_visible,
      is_active: item.is_active,
    });
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    
    try {
      await updateMutation.mutateAsync({
        id: editingItem.id,
        ...formData,
      });
      toast({
        title: "Sucesso",
        description: "Item de navegação atualizado com sucesso!",
      });
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar item de navegação.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: "Sucesso",
        description: "Item de navegação excluído com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir item de navegação.",
        variant: "destructive",
      });
    }
  };

  const toggleVisibility = async (item: NavigationItem) => {
    try {
      await updateMutation.mutateAsync({
        id: item.id,
        is_visible: !item.is_visible,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar visibilidade.",
        variant: "destructive",
      });
    }
  };

  const FormFields = () => (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Ex: PlayStation"
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
            placeholder="Ex: playstation"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="icon_url">Ícone</Label>
          <Input
            id="icon_url"
            value={formData.icon_url}
            onChange={(e) => setFormData(prev => ({ ...prev, icon_url: e.target.value }))}
            placeholder="🎮 ou URL da imagem"
          />
        </div>
        <div>
          <Label htmlFor="icon_type">Tipo do Ícone</Label>
          <Select value={formData.icon_type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, icon_type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emoji">Emoji</SelectItem>
              <SelectItem value="image">Imagem</SelectItem>
              <SelectItem value="icon">Ícone CSS</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="link_url">URL do Link</Label>
          <Input
            id="link_url"
            value={formData.link_url}
            onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
            placeholder="/playstation ou https://..."
          />
        </div>
        <div>
          <Label htmlFor="link_type">Tipo do Link</Label>
          <Select value={formData.link_type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, link_type: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="internal">Interno</SelectItem>
              <SelectItem value="external">Externo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="background_color">Cor de Fundo</Label>
          <Input
            id="background_color"
            type="color"
            value={formData.background_color}
            onChange={(e) => setFormData(prev => ({ ...prev, background_color: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="text_color">Cor do Texto</Label>
          <Input
            id="text_color"
            type="color"
            value={formData.text_color}
            onChange={(e) => setFormData(prev => ({ ...prev, text_color: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hover_background_color">Cor de Fundo (Hover)</Label>
          <Input
            id="hover_background_color"
            type="color"
            value={formData.hover_background_color}
            onChange={(e) => setFormData(prev => ({ ...prev, hover_background_color: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="hover_text_color">Cor do Texto (Hover)</Label>
          <Input
            id="hover_text_color"
            type="color"
            value={formData.hover_text_color}
            onChange={(e) => setFormData(prev => ({ ...prev, hover_text_color: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="display_order">Ordem de Exibição</Label>
        <Input
          id="display_order"
          type="number"
          value={formData.display_order}
          onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_visible"
            checked={formData.is_visible}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_visible: checked }))}
          />
          <Label htmlFor="is_visible">Visível</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
          />
          <Label htmlFor="is_active">Ativo</Label>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#2C2C44] border-[#343A40]">
        <CardHeader className="border-b border-[#343A40]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl">Gerenciador de Navegação</CardTitle>
              <CardDescription className="text-gray-400">
                Configure os itens do menu de navegação principal
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#007BFF] hover:bg-[#0056B3] text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-[#2C2C44] border-[#343A40] text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">Criar Novo Item de Navegação</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Configure um novo item para o menu de navegação
                  </DialogDescription>
                </DialogHeader>
                <FormFields />
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      resetForm();
                    }}
                    className="border-[#6C757D] text-[#6C757D] hover:bg-[#6C757D] hover:text-white"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreate}
                    disabled={createMutation.isPending}
                    className="bg-[#007BFF] hover:bg-[#0056B3] text-white"
                  >
                    {createMutation.isPending ? 'Criando...' : 'Criar Item'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {navigationItems && navigationItems.length > 0 ? (
            <div className="space-y-4">
              {navigationItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-[#343A40] rounded-lg border border-[#6C757D]"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-400">#{item.display_order}</span>
                    </div>
                    
                    <div
                      className="flex items-center space-x-2 px-3 py-1 rounded text-sm"
                      style={{
                        backgroundColor: item.background_color,
                        color: item.text_color,
                      }}
                    >
                      {item.icon_url && (
                        <span>
                          {item.icon_type === 'emoji' ? item.icon_url : 
                          item.icon_type === 'image' ? 
                            <img src={item.icon_url} alt="" className="w-4 h-4" /> : 
                            <i className={item.icon_url} />
                          }
                        </span>
                      )}
                      <span>{item.title}</span>
                    </div>

                    <div className="text-gray-300">
                      <div className="text-sm font-medium">{item.link_url}</div>
                      <div className="text-xs text-gray-400 flex items-center space-x-2">
                        <Badge variant={item.link_type === 'internal' ? 'default' : 'secondary'} className="text-xs">
                          {item.link_type}
                        </Badge>
                        {!item.is_visible && <Badge variant="destructive" className="text-xs">Oculto</Badge>}
                        {!item.is_active && <Badge variant="outline" className="text-xs">Inativo</Badge>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleVisibility(item)}
                      className="text-gray-300 hover:text-white hover:bg-[#6C757D]"
                    >
                      {item.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="text-gray-300 hover:text-white hover:bg-[#6C757D]"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              Nenhum item de navegação encontrado. Crie o primeiro item para começar.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => resetForm()}>
        <DialogContent className="max-w-2xl bg-[#2C2C44] border-[#343A40] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Item de Navegação</DialogTitle>
            <DialogDescription className="text-gray-400">
              Edite as configurações do item de navegação
            </DialogDescription>
          </DialogHeader>
          <FormFields />
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={resetForm}
              className="border-[#6C757D] text-[#6C757D] hover:bg-[#6C757D] hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              className="bg-[#28A745] hover:bg-[#218838] text-white"
            >
              {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NavigationManager;
