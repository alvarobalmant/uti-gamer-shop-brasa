import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { ArrowLeft } from 'lucide-react';
import { Product } from '@/hooks/useProducts';
import { Tag } from '@/hooks/useTags';
import { TagSelector } from './TagSelector';

interface ProductFormProps {
  product?: Product | null;
  tags: Tag[];
  onSubmit: (productData: any) => Promise<void>;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  tags,
  onSubmit,
  onCancel,
}) => {
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      console.log('Produto carregado para edição:', product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '0',
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field: 'sizes' | 'colors', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const handleTagChange = (tagId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      tagIds: checked 
        ? [...prev.tagIds, tagId]
        : prev.tagIds.filter(id => id !== tagId)
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
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <CardTitle className="text-white">
              {product ? 'Editar Produto' : 'Novo Produto'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {product ? 'Edite as informações do produto' : 'Preencha as informações do novo produto'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Nome do Produto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Digite o nome do produto"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Descrição do produto"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="text-white">Preço *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="stock" className="text-white">Estoque</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sizes" className="text-white">Tamanhos</Label>
                <Input
                  id="sizes"
                  value={formData.sizes.join(', ')}
                  onChange={(e) => handleArrayInputChange('sizes', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="P, M, G, GG (separados por vírgula)"
                />
              </div>

              <div>
                <Label htmlFor="colors" className="text-white">Cores</Label>
                <Input
                  id="colors"
                  value={formData.colors.join(', ')}
                  onChange={(e) => handleArrayInputChange('colors', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Azul, Vermelho, Verde (separados por vírgula)"
                />
              </div>

              <TagSelector
                tags={tags}
                selectedTagIds={formData.tagIds}
                onTagChange={handleTagChange}
              />
            </div>

            <div className="space-y-4">
              <div>
                <ImageUpload
                  label="Imagem Principal"
                  currentImage={formData.image}
                  onImageUploaded={(url) => handleInputChange('image', url)}
                  folder="products"
                  className="bg-gray-700 border-gray-600"
                />
              </div>

              <div>
                <Label className="text-white">Imagens Adicionais</Label>
                <div className="space-y-2">
                  {formData.additional_images.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={url}
                        onChange={(e) => {
                          const newImages = [...formData.additional_images];
                          newImages[index] = e.target.value;
                          handleInputChange('additional_images', newImages);
                        }}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="URL da imagem"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newImages = formData.additional_images.filter((_, i) => i !== index);
                          handleInputChange('additional_images', newImages);
                        }}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleInputChange('additional_images', [...formData.additional_images, '']);
                    }}
                    className="text-gray-300"
                  >
                    Adicionar Imagem
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-700">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? 'Salvando...' : (product ? 'Atualizar Produto' : 'Criar Produto')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="border-gray-600 text-gray-300"
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
