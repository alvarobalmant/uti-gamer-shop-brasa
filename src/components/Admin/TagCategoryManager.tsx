import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Palette, Weight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useTagCategories, TagCategory, TagCategoryEnum } from '@/hooks/useTagCategories';
import { useToast } from '@/hooks/use-toast';

interface CategoryFormData {
  name: string;
  category_enum: TagCategoryEnum;
  default_weight: number;
  description: string;
  color: string;
  icon_emoji: string;
  is_active: boolean;
  display_order: number;
}

const defaultFormData: CategoryFormData = {
  name: '',
  category_enum: 'generic' as TagCategoryEnum,
  default_weight: 1,
  description: '',
  color: '#666666',
  icon_emoji: '🏷️',
  is_active: true,
  display_order: 0,
};

export const TagCategoryManager = () => {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useTagCategories();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TagCategory | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(defaultFormData);
  const { toast } = useToast();

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await addCategory(formData);
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      // Toast já foi mostrado pelo hook
    }
  };

  const handleEdit = (category: TagCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      category_enum: category.category_enum,
      default_weight: category.default_weight,
      description: category.description || '',
      color: category.color,
      icon_emoji: category.icon_emoji,
      is_active: category.is_active,
      display_order: category.display_order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await deleteCategory(id);
      } catch (error) {
        // Toast já foi mostrado pelo hook
      }
    }
  };

  const categoryOptions: { value: TagCategoryEnum; label: string }[] = [
    { value: 'platform', label: 'Plataforma' },
    { value: 'product_type', label: 'Tipo de Produto' },
    { value: 'game_title', label: 'Título do Jogo' },
    { value: 'console_model', label: 'Modelo do Console' },
    { value: 'brand', label: 'Marca' },
    { value: 'accessory_type', label: 'Tipo de Acessório' },
    { value: 'collectible', label: 'Colecionável' },
    { value: 'clothing', label: 'Roupas' },
    { value: 'genre', label: 'Gênero' },
    { value: 'feature', label: 'Característica' },
    { value: 'edition', label: 'Edição' },
    { value: 'condition', label: 'Condição' },
    { value: 'physical_attribute', label: 'Atributo Físico' },
    { value: 'generic', label: 'Genérica' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const toggleCategoryStatus = async (category: TagCategory) => {
    try {
      await updateCategory(category.id, { is_active: !category.is_active });
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Categorias de Tags</h2>
          <p className="text-muted-foreground">
            Configure as categorias que organizam suas tags e definem pesos para o sistema de busca
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Categoria</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Plataforma"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Enum (Identificador)</label>
                <Input
                  value={formData.category_enum}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_enum: e.target.value as TagCategoryEnum }))}
                  placeholder="Ex: platform"
                  pattern="[a-z_]+"
                  title="Apenas letras minúsculas e underscore"
                  required
                  disabled={!!editingCategory}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Peso Padrão</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.default_weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, default_weight: parseInt(e.target.value) }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Ordem</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Emoji</label>
                  <Input
                    value={formData.icon_emoji}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon_emoji: e.target.value }))}
                    placeholder="🏷️"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Cor</label>
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o propósito desta categoria..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <label className="text-sm font-medium">Ativo</label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingCategory ? 'Atualizar' : 'Criar'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`transition-all duration-200 ${category.is_active ? '' : 'opacity-60'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                      style={{ backgroundColor: category.color + '20', color: category.color }}
                    >
                      {category.icon_emoji}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {category.category_enum}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <Weight className="w-3 h-3 mr-1" />
                          Peso {category.default_weight}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCategoryStatus(category)}
                      className="h-8 w-8 p-0"
                    >
                      {category.is_active ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {category.description && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};