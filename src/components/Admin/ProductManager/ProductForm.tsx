
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { Tag } from '@/hooks/useTags';
import { ImageUpload } from '@/components/ui/image-upload';

interface ProductFormProps {
  product: Product | null;
  tags: Tag[];
  onSubmit: (productData: any) => void;
  onCancel: () => void;
}

const ProductForm = ({ product, tags, onSubmit, onCancel }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
    additional_images: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    tagIds: [] as string[],
  });

  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      console.log('Carregando produto para edição:', product);
      console.log('Tags do produto:', product.tags);
      
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price.toString(),
        stock: (product.stock || 0).toString(),
        image: product.image || '',
        additional_images: product.additional_images || [],
        sizes: product.sizes || [],
        colors: product.colors || [],
        tagIds: product.tags?.map(tag => tag.id) || [],
      });
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        image: '',
        additional_images: [],
        sizes: [],
        colors: [],
        tagIds: [],
      });
    }
  }, [product]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMainImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  };

  const handleAdditionalImageUpload = (url: string) => {
    if (url) {
      setFormData(prev => ({
        ...prev,
        additional_images: [...prev.additional_images, url]
      }));
    }
  };

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()]
      }));
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter(s => s !== size)
    }));
  };

  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()]
      }));
      setNewColor('');
    }
  };

  const removeColor = (color: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter(c => c !== color)
    }));
  };

  const handleTagToggle = (tagId: string, checked: boolean) => {
    console.log('Toggle tag:', tagId, 'checked:', checked);
    
    setFormData(prev => {
      const newTagIds = checked
        ? [...prev.tagIds, tagId]
        : prev.tagIds.filter(id => id !== tagId);
      
      console.log('Tags atualizadas:', newTagIds);
      return { ...prev, tagIds: newTagIds };
    });
  };

  const removeAdditionalImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additional_images: prev.additional_images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Nome do produto é obrigatório');
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('Preço deve ser maior que zero');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Enviando dados do produto com tags:', formData.tagIds);
      
      const productData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        image: formData.image || null,
        additional_images: formData.additional_images,
        sizes: formData.sizes,
        colors: formData.colors,
        tagIds: formData.tagIds,
      };

      console.log('Dados finais do produto:', productData);
      await onSubmit(productData);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button
            onClick={onCancel}
            variant="ghost"
            className="text-white hover:bg-gray-700"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <CardTitle className="text-white">
              {product ? 'Editar Produto' : 'Novo Produto'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {product ? 'Edite as informações do produto' : 'Adicione um novo produto ao catálogo'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Nome do Produto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="price" className="text-white">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="stock" className="text-white">Estoque</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="description" className="text-white">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="bg-gray-700 border-gray-600 text-white"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Imagem Principal */}
          <div>
            <ImageUpload
              onImageUploaded={handleMainImageUpload}
              currentImage={formData.image}
              label="Imagem Principal *"
              folder="products"
              className="mb-4"
            />
          </div>

          {/* Imagens Adicionais */}
          <div>
            <Label className="text-white mb-2 block">Imagens Adicionais</Label>
            
            <ImageUpload
              onImageUploaded={handleAdditionalImageUpload}
              label="Adicionar Imagem Adicional"
              folder="products"
              className="mb-4"
            />
            
            {formData.additional_images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {formData.additional_images.map((image, index) => (
                  <div key={index} className="relative">
                    <div className="w-full h-24 bg-gray-600 rounded-lg overflow-hidden">
                      <img src={image} alt={`Additional ${index}`} className="w-full h-full object-cover" />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0"
                      onClick={() => removeAdditionalImage(index)}
                      disabled={isSubmitting}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tamanhos */}
          <div>
            <Label className="text-white">Tamanhos</Label>
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="Ex: P, M, G, GG"
                  className="bg-gray-700 border-gray-600 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
                  disabled={isSubmitting}
                />
                <Button 
                  type="button" 
                  onClick={addSize} 
                  variant="outline" 
                  className="border-gray-600"
                  disabled={isSubmitting}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.sizes.map((size) => (
                  <Badge key={size} variant="secondary" className="pr-1">
                    {size}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-auto p-1 ml-1"
                      onClick={() => removeSize(size)}
                      disabled={isSubmitting}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Cores */}
          <div>
            <Label className="text-white">Cores</Label>
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Ex: Preto, Branco, Azul"
                  className="bg-gray-700 border-gray-600 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                  disabled={isSubmitting}
                />
                <Button 
                  type="button" 
                  onClick={addColor} 
                  variant="outline" 
                  className="border-gray-600"
                  disabled={isSubmitting}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.colors.map((color) => (
                  <Badge key={color} variant="secondary" className="pr-1">
                    {color}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-auto p-1 ml-1"
                      onClick={() => removeColor(color)}
                      disabled={isSubmitting}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Categorias/Tags */}
          <div>
            <Label className="text-white mb-3 block">Categorias</Label>
            {tags.length === 0 ? (
              <div className="text-gray-400 text-sm">
                Nenhuma categoria disponível. Crie categorias no gerenciador de tags primeiro.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {tags.map((tag) => {
                  const isChecked = formData.tagIds.includes(tag.id);
                  
                  return (
                    <div key={tag.id} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                      <Checkbox
                        id={`tag-${tag.id}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => handleTagToggle(tag.id, checked as boolean)}
                        disabled={isSubmitting}
                        className="border-gray-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      />
                      <label 
                        htmlFor={`tag-${tag.id}`} 
                        className="text-sm text-gray-300 cursor-pointer flex-1"
                      >
                        {tag.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Exibir tags selecionadas */}
            {formData.tagIds.length > 0 && (
              <div className="mt-4">
                <Label className="text-white text-sm mb-2 block">Tags Selecionadas:</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.tagIds.map((tagId) => {
                    const tag = tags.find(t => t.id === tagId);
                    return tag ? (
                      <Badge key={tagId} variant="default" className="bg-red-600 text-white">
                        {tag.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-6 border-t border-gray-700">
            <Button 
              type="submit" 
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {product ? 'Atualizando...' : 'Criando...'}
                </div>
              ) : (
                product ? 'Atualizar Produto' : 'Criar Produto'
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel} 
              className="border-gray-600"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
