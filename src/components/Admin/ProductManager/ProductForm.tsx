
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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

  useEffect(() => {
    if (product) {
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

  const toggleTag = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }));
  };

  const removeAdditionalImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additional_images: prev.additional_images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      image: formData.image || null,
      additional_images: formData.additional_images,
      sizes: formData.sizes,
      colors: formData.colors,
      tagIds: formData.tagIds,
    };

    onSubmit(productData);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button
            onClick={onCancel}
            variant="ghost"
            className="text-white hover:bg-gray-700"
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
                />
                <Button type="button" onClick={addSize} variant="outline" className="border-gray-600">
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
                />
                <Button type="button" onClick={addColor} variant="outline" className="border-gray-600">
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
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-white">Categorias</Label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`tag-${tag.id}`}
                    checked={formData.tagIds.includes(tag.id)}
                    onChange={() => toggleTag(tag.id)}
                    className="rounded border-gray-600"
                  />
                  <label htmlFor={`tag-${tag.id}`} className="text-sm text-gray-300">
                    {tag.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-6 border-t border-gray-700">
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              {product ? 'Atualizar Produto' : 'Criar Produto'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="border-gray-600">
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
